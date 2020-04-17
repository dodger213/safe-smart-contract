const utils = require('./utils/general')

const CreateAndAddModules = artifacts.require("./libraries/CreateAndAddModules.sol");
const ProxyFactory = artifacts.require("./GnosisSafeProxyFactory.sol");
const GnosisSafe = artifacts.require("./GnosisSafe.sol");
const WhitelistModule = artifacts.require("./WhitelistModule.sol");


contract('WhitelistModule', function(accounts) {

    let gnosisSafe
    let whitelistModule
    let lw

    const CALL = 0

    beforeEach(async function () {
        // Create lightwallet
        lw = await utils.createLightwallet()
        // Create Master Copies
        let proxyFactory = await ProxyFactory.new()
        let createAndAddModules = await CreateAndAddModules.new()
        let gnosisSafeMasterCopy = await utils.deployContract("deploying Gnosis Safe Mastercopy", GnosisSafe)
        let whitelistModuleMasterCopy = await WhitelistModule.new([])
        // Create Gnosis Safe and Whitelist Module in one transactions
        let moduleData = await whitelistModuleMasterCopy.contract.methods.setup([accounts[3]]).encodeABI()
        let proxyFactoryData = await proxyFactory.contract.methods.createProxy(whitelistModuleMasterCopy.address, moduleData).encodeABI()
        let modulesCreationData = utils.createAndAddModulesData([proxyFactoryData])
        let createAndAddModulesData = createAndAddModules.contract.methods.createAndAddModules(proxyFactory.address, modulesCreationData).encodeABI()
        let gnosisSafeData = await gnosisSafeMasterCopy.contract.methods.setup(
            [lw.accounts[0], lw.accounts[1], accounts[1]], 2, createAndAddModules.address, createAndAddModulesData, utils.Address0, utils.Address0, 0, utils.Address0
        ).encodeABI()
        gnosisSafe = await utils.getParamFromTxEvent(
            await proxyFactory.createProxy(gnosisSafeMasterCopy.address, gnosisSafeData),
            'ProxyCreation', 'proxy', proxyFactory.address, GnosisSafe, 'create Gnosis Safe and Whitelist Module',
        )
        let modules = await gnosisSafe.getModules()
        whitelistModule = await WhitelistModule.at(modules[0])
        assert.equal(await whitelistModule.manager.call(), gnosisSafe.address)
    })

    it('should execute a withdraw transaction to a whitelisted account', async () => {
        // Withdraw to whitelisted account should fail as we don't have funds
        await utils.assertRejects(
            whitelistModule.executeWhitelisted(
                accounts[3], 300, "0x", {from: accounts[1]}
            ),
            "Not enough funds"
        )
        // Deposit 1 eth
        await web3.eth.sendTransaction({from: accounts[0], to: gnosisSafe.address, value: web3.utils.toWei("1", 'ether')})
        assert.equal(await web3.eth.getBalance(gnosisSafe.address), web3.utils.toWei("1", 'ether'));
        // Withdraw to whitelisted account
        utils.logGasUsage(
            'execTransactionFromModule withdraw to whitelisted account',
            await whitelistModule.executeWhitelisted(
                accounts[3], 300, "0x", {from: accounts[1]}
            )
        )
        assert.equal(await web3.eth.getBalance(gnosisSafe.address), web3.utils.toWei("1", 'ether') - 300);
    })

    it('should add and remove an account from the whitelist', async () => {
        assert.equal(await whitelistModule.isWhitelisted(accounts[1]), false)
        // Add account 3 to whitelist
        let data = await whitelistModule.contract.methods.addToWhitelist(accounts[1]).encodeABI()
        let nonce = await gnosisSafe.nonce()
        let transactionHash = await gnosisSafe.getTransactionHash(whitelistModule.address, 0, data, CALL, 0, 0, 0, utils.Address0, utils.Address0, nonce)
        let sigs = utils.signTransaction(lw, [lw.accounts[0], lw.accounts[1]], transactionHash)
        utils.logGasUsage(
            'execTransaction add account to whitelist',
            await gnosisSafe.execTransaction(
                whitelistModule.address, 0, data, CALL, 0, 0, 0, utils.Address0, utils.Address0, sigs
            )
        )
        assert.equal(await whitelistModule.isWhitelisted(accounts[1]), true)
        // Remove account 3 from whitelist
        data = await whitelistModule.contract.methods.removeFromWhitelist(accounts[1]).encodeABI()
        nonce = await gnosisSafe.nonce()
        transactionHash = await gnosisSafe.getTransactionHash(whitelistModule.address, 0, data, CALL, 0, 0, 0, utils.Address0, utils.Address0, nonce)
        sigs = utils.signTransaction(lw, [lw.accounts[0], lw.accounts[1]], transactionHash)
        utils.logGasUsage(
            'execTransaction remove account from whitelist',
            await gnosisSafe.execTransaction(
                whitelistModule.address, 0, data, CALL, 0, 0, 0, utils.Address0, utils.Address0, sigs
            )
        )
        assert.equal(await whitelistModule.isWhitelisted(accounts[1]), false)
    })
});
