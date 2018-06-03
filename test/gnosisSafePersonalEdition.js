const utils = require('./utils')
const safeUtils = require('./utilsPersonalSafe')
const solc = require('solc')

const GnosisSafe = artifacts.require("./GnosisSafePersonalEdition.sol")
const ProxyFactory = artifacts.require("./ProxyFactory.sol")


contract('GnosisSafePersonalEdition', function(accounts) {

    let gnosisSafe
    let lw
    let executor = accounts[8]

    const CALL = 0
    const CREATE = 2

    beforeEach(async function () {
        // Create lightwallet
        lw = await utils.createLightwallet()
        // Create Master Copies
        let proxyFactory = await ProxyFactory.new()
        let gnosisSafeMasterCopy = await GnosisSafe.new()
        gnosisSafeMasterCopy.setup([lw.accounts[0], lw.accounts[1], lw.accounts[2]], 2, 0, "0x")
        // Create Gnosis Safe
        let gnosisSafeData = await gnosisSafeMasterCopy.contract.setup.getData([lw.accounts[0], lw.accounts[1], lw.accounts[2]], 2, 0, "0x")
        gnosisSafe = utils.getParamFromTxEvent(
            await proxyFactory.createProxy(gnosisSafeMasterCopy.address, gnosisSafeData),
            'ProxyCreation', 'proxy', proxyFactory.address, GnosisSafe, 'create Gnosis Safe',
        )
    })

    it('should deposit and withdraw 1 ETH', async () => {
        // Deposit 1 ETH + some spare money for execution 
        assert.equal(await web3.eth.getBalance(gnosisSafe.address), 0)
        await web3.eth.sendTransaction({from: accounts[0], to: gnosisSafe.address, value: web3.toWei(1.1, 'ether')})
        assert.equal(await web3.eth.getBalance(gnosisSafe.address).toNumber(), web3.toWei(1.1, 'ether'))

        let executorBalance = await web3.eth.getBalance(executor).toNumber()

        // Withdraw 1 ETH
        await safeUtils.executeTransaction(lw, gnosisSafe, 'executeTransaction withdraw 0.5 ETH', [lw.accounts[0], lw.accounts[2]], accounts[0], web3.toWei(0.5, 'ether'), "0x", CALL, executor)

        await safeUtils.executeTransaction(lw, gnosisSafe, 'executeTransaction withdraw 0.5 ETH', [lw.accounts[0], lw.accounts[2]], accounts[0], web3.toWei(0.5, 'ether'), "0x", CALL, executor)

        // Should fail as it is over the balance (payment should still happen)
        await safeUtils.executeTransaction(lw, gnosisSafe, 'executeTransaction withdraw 0.5 ETH', [lw.accounts[0], lw.accounts[2]], accounts[0], web3.toWei(0.5, 'ether'), "0x", CALL, executor, 0, true)

        let executorDiff = await web3.eth.getBalance(executor) - executorBalance
        console.log("    Executor earned " + web3.fromWei(executorDiff, 'ether') + " ETH")
        assert.ok(executorDiff > 0)
    })

    it('should add, remove and replace an owner and update the threshold', async () => {
        // Fund account for execution 
        await web3.eth.sendTransaction({from: accounts[0], to: gnosisSafe.address, value: web3.toWei(0.1, 'ether')})

        let executorBalance = await web3.eth.getBalance(executor).toNumber()
        // Add owner and set threshold to 3
        assert.equal(await gnosisSafe.getThreshold(), 2)
        let data = await gnosisSafe.contract.addOwnerWithThreshold.getData(accounts[1], 3)
        await safeUtils.executeTransaction(lw, gnosisSafe, 'add owner and set threshold to 3', [lw.accounts[0], lw.accounts[1]], gnosisSafe.address, 0, data, CALL, executor)
        assert.deepEqual(await gnosisSafe.getOwners(), [accounts[1], lw.accounts[0], lw.accounts[1], lw.accounts[2]])
        assert.equal(await gnosisSafe.getThreshold(), 3)

        // Replace owner and keep threshold
        data = await gnosisSafe.contract.swapOwner.getData(lw.accounts[1], lw.accounts[2], lw.accounts[3])
        await safeUtils.executeTransaction(lw, gnosisSafe, 'replace owner', [lw.accounts[0], lw.accounts[1], lw.accounts[2]], gnosisSafe.address, 0, data, CALL, executor)
        assert.deepEqual(await gnosisSafe.getOwners(), [accounts[1], lw.accounts[0], lw.accounts[1], lw.accounts[3]])

        // Remove owner and reduce threshold to 2
        data = await gnosisSafe.contract.removeOwner.getData(lw.accounts[1], lw.accounts[3], 2)
        await safeUtils.executeTransaction(lw, gnosisSafe, 'remove owner and reduce threshold to 2', [lw.accounts[0], lw.accounts[1], lw.accounts[3]], gnosisSafe.address, 0, data, CALL, executor)
        assert.deepEqual(await gnosisSafe.getOwners(), [accounts[1], lw.accounts[0], lw.accounts[1]])
        assert.equal(await gnosisSafe.getThreshold(), 2)

        let executorDiff = await web3.eth.getBalance(executor) - executorBalance
        console.log("    Executor earned " + web3.fromWei(executorDiff, 'ether') + " ETH")
        assert.ok(executorDiff > 0)
    })

    it('should not be able to add/remove/replace invalid owners', async () => {
        let zeroAcc = "0x0000000000000000000000000000000000000000"
        let sentinel = "0x0000000000000000000000000000000000000001"
        // Fund account for execution 
        await web3.eth.sendTransaction({from: accounts[0], to: gnosisSafe.address, value: web3.toWei(0.1, 'ether')})

        let executorBalance = await web3.eth.getBalance(executor).toNumber()
        // Check initial state
        assert.equal(await gnosisSafe.getThreshold(), 2)
        assert.deepEqual(await gnosisSafe.getOwners(), [lw.accounts[0], lw.accounts[1], lw.accounts[2]])

        // Invalid owner additions
        let data = await gnosisSafe.contract.addOwnerWithThreshold.getData(zeroAcc, 3)
        await safeUtils.executeTransaction(lw, gnosisSafe, 'add zero account', [lw.accounts[0], lw.accounts[1]], gnosisSafe.address, 0, data, CALL, executor, 0, true)

        data = await gnosisSafe.contract.addOwnerWithThreshold.getData(sentinel, 3)
        await safeUtils.executeTransaction(lw, gnosisSafe, 'add sentinel', [lw.accounts[0], lw.accounts[1]], gnosisSafe.address, 0, data, CALL, executor, 0, true)

        // Invalid owner replacements
        data = await gnosisSafe.contract.swapOwner.getData(sentinel, accounts[0], accounts[1])
        await safeUtils.executeTransaction(lw, gnosisSafe, 'replace non-owner', [lw.accounts[0], lw.accounts[1]], gnosisSafe.address, 0, data, CALL, executor, 0, true)

        data = await gnosisSafe.contract.swapOwner.getData(lw.accounts[2], sentinel, accounts[1])
        await safeUtils.executeTransaction(lw, gnosisSafe, 'replace sentinel', [lw.accounts[0], lw.accounts[1]], gnosisSafe.address, 0, data, CALL, executor, 0, true)

        data = await gnosisSafe.contract.swapOwner.getData(accounts[1], zeroAcc, accounts[2])
        await safeUtils.executeTransaction(lw, gnosisSafe, 'replace with zero account', [lw.accounts[0], lw.accounts[1]], gnosisSafe.address, 0, data, CALL, executor, 0, true)

        // Invalid owner removals
        data = await gnosisSafe.contract.removeOwner.getData(sentinel, accounts[0], 1)
        await safeUtils.executeTransaction(lw, gnosisSafe, 'remove non-owner', [lw.accounts[0], lw.accounts[1]], gnosisSafe.address, 0, data, CALL, executor, 0, true)

        data = await gnosisSafe.contract.removeOwner.getData(lw.accounts[2], sentinel, 1)
        await safeUtils.executeTransaction(lw, gnosisSafe, 'remove sentinel', [lw.accounts[0], lw.accounts[1]], gnosisSafe.address, 0, data, CALL, executor, 0, true)
        
        data = await gnosisSafe.contract.removeOwner.getData(accounts[1], zeroAcc, 1)
        await safeUtils.executeTransaction(lw, gnosisSafe, 'remove with zero account', [lw.accounts[0], lw.accounts[1]], gnosisSafe.address, 0, data, CALL, executor, 0, true)

        let executorDiff = await web3.eth.getBalance(executor) - executorBalance
        console.log("    Executor earned " + web3.fromWei(executorDiff, 'ether') + " ETH")
        assert.ok(executorDiff > 0)

        // Check that initial state still applies
        assert.equal(await gnosisSafe.getThreshold(), 2)
        assert.deepEqual(await gnosisSafe.getOwners(), [lw.accounts[0], lw.accounts[1], lw.accounts[2]])
    })

    it('should not be able to add/remove invalid modules', async () => {
        let zeroAcc = "0x0000000000000000000000000000000000000000"
        let sentinel = "0x0000000000000000000000000000000000000001"

        // Fund account for execution 
        await web3.eth.sendTransaction({from: accounts[0], to: gnosisSafe.address, value: web3.toWei(0.1, 'ether')})

        let executorBalance = await web3.eth.getBalance(executor).toNumber()

        // Add random account as module
        let randomModule = accounts[6]
        let data = await gnosisSafe.contract.enableModule.getData(randomModule)
        await safeUtils.executeTransaction(lw, gnosisSafe, 'add random module', [lw.accounts[0], lw.accounts[1]], gnosisSafe.address, 0, data, CALL, executor)

        // Check initial state
        assert.deepEqual(await gnosisSafe.getModules(), [randomModule])

        // Invalid module additions
        data = await gnosisSafe.contract.enableModule.getData(zeroAcc)
        await safeUtils.executeTransaction(lw, gnosisSafe, 'add zero account', [lw.accounts[0], lw.accounts[1]], gnosisSafe.address, 0, data, CALL, executor, 0, true)

        data = await gnosisSafe.contract.enableModule.getData(sentinel)
        await safeUtils.executeTransaction(lw, gnosisSafe, 'add sentinel', [lw.accounts[0], lw.accounts[1]], gnosisSafe.address, 0, data, CALL, executor, 0, true)

        // Invalid module removals
        data = await gnosisSafe.contract.disableModule.getData(sentinel, accounts[0])
        await safeUtils.executeTransaction(lw, gnosisSafe, 'remove non-module', [lw.accounts[0], lw.accounts[1]], gnosisSafe.address, 0, data, CALL, executor, 0, true)

        data = await gnosisSafe.contract.disableModule.getData(randomModule, sentinel)
        await safeUtils.executeTransaction(lw, gnosisSafe, 'remove sentinel', [lw.accounts[0], lw.accounts[1]], gnosisSafe.address, 0, data, CALL, executor, 0, true)
        
        data = await gnosisSafe.contract.disableModule.getData(accounts[1], zeroAcc)
        await safeUtils.executeTransaction(lw, gnosisSafe, 'remove with zero account', [lw.accounts[0], lw.accounts[1]], gnosisSafe.address, 0, data, CALL, executor, 0, true)

        let executorDiff = await web3.eth.getBalance(executor) - executorBalance
        console.log("    Executor earned " + web3.fromWei(executorDiff, 'ether') + " ETH")
        assert.ok(executorDiff > 0)

        // Check that initial state still applies
        assert.deepEqual(await gnosisSafe.getModules(), [accounts[6]])
    })

    it('should do a CREATE transaction', async () => {
        // Fund account for execution 
        await web3.eth.sendTransaction({from: accounts[0], to: gnosisSafe.address, value: web3.toWei(0.1, 'ether')})

        let executorBalance = await web3.eth.getBalance(executor).toNumber()
        // Create test contract
        let source = `
        contract Test {
            function x() pure returns (uint) {
                return 21;
            }
        }`
        let output = await solc.compile(source, 0);
        let interface = JSON.parse(output.contracts[':Test']['interface'])
        let data = '0x' + output.contracts[':Test']['bytecode']
        const TestContract = web3.eth.contract(interface);
        let testContract = utils.getParamFromTxEvent(
            await safeUtils.executeTransaction(lw, gnosisSafe, 'create test contract', [lw.accounts[0], lw.accounts[1]], 0, 0, data, CREATE, executor),
            'ContractCreation', 'newContract', gnosisSafe.address, TestContract, 'executeTransaction CREATE'
        )
        assert.equal(await testContract.x(), 21)

        let executorDiff = await web3.eth.getBalance(executor) - executorBalance
        console.log("    Executor earned " + web3.fromWei(executorDiff, 'ether') + " ETH")
        assert.ok(executorDiff > 0)
    })
})
