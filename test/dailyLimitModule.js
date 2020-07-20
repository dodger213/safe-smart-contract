const utils = require('./utils/general')

const GnosisSafe = artifacts.require("./GnosisSafe.sol");
const CreateAndAddModules = artifacts.require("./libraries/CreateAndAddModules.sol");
const ProxyFactory = artifacts.require("./GnosisSafeProxyFactory.sol");
const DailyLimitModule = artifacts.require("./modules/DailyLimitModule.sol");
const MockContract = artifacts.require('./MockContract.sol');
const MockToken = artifacts.require('./Token.sol');


contract('DailyLimitModule', function(accounts) {

    let gnosisSafe
    let dailyLimitModule
    let lw

    const CALL = 0

    beforeEach(async function () {
        // Create lightwallet
        lw = await utils.createLightwallet()
        // Create Master Copies
        let proxyFactory = await ProxyFactory.new()
        let createAndAddModules = await CreateAndAddModules.new()
        let gnosisSafeMasterCopy = await utils.deployContract("deploying Gnosis Safe Mastercopy", GnosisSafe)
        let dailyLimitModuleMasterCopy = await DailyLimitModule.new()
        // Initialize module master copy
        dailyLimitModuleMasterCopy.setup([], [])
        // Create Gnosis Safe and Daily Limit Module in one transactions
        let moduleData = await dailyLimitModuleMasterCopy.contract.methods.setup([utils.Address0], [100]).encodeABI()
        let proxyFactoryData = await proxyFactory.contract.methods.createProxy(dailyLimitModuleMasterCopy.address, moduleData).encodeABI()
        let modulesCreationData = utils.createAndAddModulesData([proxyFactoryData])
        let createAndAddModulesData = createAndAddModules.contract.methods.createAndAddModules(proxyFactory.address, modulesCreationData).encodeABI()
        let gnosisSafeData = await gnosisSafeMasterCopy.contract.methods.setup(
            [lw.accounts[0], lw.accounts[1], accounts[0]], 2, createAndAddModules.address, createAndAddModulesData, utils.Address0, utils.Address0, 0, utils.Address0
        ).encodeABI()
        gnosisSafe = await utils.getParamFromTxEvent(
            await proxyFactory.createProxy(gnosisSafeMasterCopy.address, gnosisSafeData),
            'ProxyCreation', 'proxy', proxyFactory.address, GnosisSafe, 'create Gnosis Safe and Daily Limit Module',
        )
        let modules = await gnosisSafe.getModules()
        dailyLimitModule = await DailyLimitModule.at(modules[0])
        assert.equal(await dailyLimitModule.manager.call(), gnosisSafe.address)
    })

    it('should withdraw daily limit', async () => {
        // Withdrawal should fail as there is no ETH in the Safe
        await utils.assertRejects(
            dailyLimitModule.executeDailyLimit(
                0, accounts[0], 50, {from: accounts[0]}
            ),
            "Not enough funds"
        )
        // Deposit 1 eth
        await web3.eth.sendTransaction({from: accounts[0], to: gnosisSafe.address, value: web3.utils.toWei("1", 'ether')})
        assert.equal(await web3.eth.getBalance(gnosisSafe.address), web3.utils.toWei("1", 'ether'));
        // Withdraw daily limit
        utils.logGasUsage(
            'execTransactionFromModule withdraw daily limit',
            await dailyLimitModule.executeDailyLimit(
                utils.Address0, accounts[0], 50, {from: accounts[0]}
            )
        )
        utils.logGasUsage(
            'execTransactionFromModule withdraw daily limit 2nd time',
            await dailyLimitModule.executeDailyLimit(
                utils.Address0, accounts[0], 50, {from: accounts[0]}
            )
        )
        assert.equal(await web3.eth.getBalance(gnosisSafe.address), web3.utils.toWei("1", 'ether') - 100);
        // Third withdrawal will fail
        await utils.assertRejects(
            dailyLimitModule.executeDailyLimit(
                utils.Address0, accounts[0], 50, {from: accounts[0]}
            ),
            "Daily limit exceeded"
        )
    })

    it('should change daily limit', async () => {
        // Funds for paying execution
        await web3.eth.sendTransaction({from: accounts[0], to: gnosisSafe.address, value: web3.utils.toWei("0.1", 'ether')})
        // Change daily limit
        let dailyLimit = await dailyLimitModule.dailyLimits(utils.Address0)
        assert.equal(dailyLimit[0], 100);
        let data = await dailyLimitModule.contract.methods.changeDailyLimit(utils.Address0, 200).encodeABI()

        let nonce = await gnosisSafe.nonce()
        let transactionHash = await gnosisSafe.getTransactionHash(
            dailyLimitModule.address, 0, data, CALL, 100000, 0, web3.utils.toWei("100", 'gwei'), utils.Address0, utils.Address0, nonce
        )
        let sigs = utils.signTransaction(lw, [lw.accounts[0], lw.accounts[1]], transactionHash)

        utils.logGasUsage(
            'execTransaction change daily limit',
            await gnosisSafe.execTransaction(
                dailyLimitModule.address, 0, data, CALL, 100000, 0, web3.utils.toWei("100", 'gwei'), utils.Address0, utils.Address0, sigs
            )
        )
        dailyLimit = await dailyLimitModule.dailyLimits(utils.Address0)
        assert.equal(dailyLimit[0], 200);
    })

    it('should withdraw daily limit for an ERC20 token', async () => {
        // deposit money for execution
        await web3.eth.sendTransaction({from: accounts[0], to: gnosisSafe.address, value: web3.utils.toWei("0.1", 'ether')})
        // Create fake token
        let source = `
        contract TestToken {
            mapping (address => uint) public balances;
            constructor() public {
                balances[msg.sender] = 100;
            }
            function transfer(address to, uint value) public returns (bool) {
                require(balances[msg.sender] >= value);
                balances[msg.sender] -= value;
                balances[to] += value;
            }
        }`
        let output = await utils.compile(source);
        // Create test token contract
        let contractInterface = output.interface
        let contractBytecode = output.data
        let tx = await web3.eth.sendTransaction({from: accounts[0], data: contractBytecode, gas: 4000000})
        let receipt = await web3.eth.getTransactionReceipt(tx.transactionHash)
        let testToken = new web3.eth.Contract(contractInterface, receipt.contractAddress)
        // Add test token to daily limit module
        let data = await dailyLimitModule.contract.methods.changeDailyLimit(testToken.options.address, 20).encodeABI()
        let nonce = await gnosisSafe.nonce()
        transactionHash = await gnosisSafe.getTransactionHash(dailyLimitModule.address, 0, data, CALL, 100000, 0, 0, utils.Address0, utils.Address0, nonce)
        let sigs = utils.signTransaction(lw, [lw.accounts[0], lw.accounts[1]], transactionHash)
        await gnosisSafe.execTransaction(dailyLimitModule.address, 0, data, CALL, 100000, 0, 0, utils.Address0, utils.Address0, sigs)

        // Withdrawal should fail as there are no tokens
        assert.equal(await testToken.methods.balances(gnosisSafe.address).call(), 0);
        await utils.assertRejects(
            dailyLimitModule.executeDailyLimit(testToken.options.address, accounts[0], 10, {from: accounts[0]}),
            "Not enough funds"
        )

        // Transfer 100 tokens to Safe
        await testToken.methods.transfer(gnosisSafe.address, 100).send({ from: accounts[0] })
        assert.equal(await testToken.methods.balances(gnosisSafe.address).call(), 100)

        // Withdraw daily limit
        utils.logGasUsage(
            'execTransactionFromModule withdraw daily limit for ERC20 token',
            await dailyLimitModule.executeDailyLimit(
                testToken.options.address, accounts[0], 10, {from: accounts[0]}
            )
        )
        assert.equal(await testToken.methods.balances(gnosisSafe.address).call(), 90)
        assert.equal(await testToken.methods.balances(accounts[0]).call(), 10)
        utils.logGasUsage(
            'execTransactionFromModule withdraw daily limit for ERC20 token 2nd time',
            await dailyLimitModule.executeDailyLimit(
                testToken.options.address, accounts[0], 10, {from: accounts[0]}
            )
        )
        assert.equal(await testToken.methods.balances(gnosisSafe.address).call(), 80)
        assert.equal(await testToken.methods.balances(accounts[0]).call(), 20)


        // Third withdrawal will fail
        await utils.assertRejects(
            dailyLimitModule.executeDailyLimit(testToken.options.address, accounts[0], 10, {from: accounts[0]}),
            "Daily limit exceeded for ERC20 token"
        )

        // Balances didn't change
        assert.equal(await testToken.methods.balances(gnosisSafe.address).call(), 80)
        assert.equal(await testToken.methods.balances(accounts[0]).call(), 20)

        // Withdrawal should  fail because of ERC20 transfer revert
        let mockContract = await MockContract.new();
        let mockToken = await MockToken.at(mockContract.address);
        await mockContract.givenAnyRevert()
        await utils.assertRejects(
            dailyLimitModule.executeDailyLimit(mockContract.address, accounts[0], 10, {from: accounts[0]}),
            "Transaction should fail if the ERC20 token transfer method reverts"
        );


        // Withdrawal should fail because of ERC20 transfer out of gas
        await mockContract.givenAnyRunOutOfGas();
        await utils.assertRejects(
            dailyLimitModule.executeDailyLimit(mockContract.address, accounts[0], 10, {from: accounts[0]}),
            "Transaction should fail if the ERC20 token transfer method is out of gas"
        );

        // Withdrawal should fail because of ERC20 transfer returns false
        await mockContract.givenAnyReturnBool(false);
        await utils.assertRejects(
            dailyLimitModule.executeDailyLimit(mockContract.address, accounts[0], 10, {from: accounts[0]}),
            "Transaction should fail if the ERC20 token transfer method returns false"
        );
    });
});
