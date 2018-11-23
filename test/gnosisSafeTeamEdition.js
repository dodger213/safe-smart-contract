const utils = require('./utils')
const solc = require('solc')

const GnosisSafe = artifacts.require("./GnosisSafe.sol")
const ProxyFactory = artifacts.require("./ProxyFactory.sol")


contract('GnosisSafeTeamEdition', function(accounts) {

    let gnosisSafe
    let executor = accounts[8]

    const CALL = 0
    const CREATE = 2

    let executeTransaction = async function(subject, accounts, to, value, data, operation, opts) {
        let options = opts || {}
        let txSender = options.sender || executor 
        let nonce = await gnosisSafe.nonce()
        let txHash = await gnosisSafe.getTransactionHash(to, value, data, operation, 0, 0, 0, 0, 0, nonce)
        let executeDataWithoutSignatures = gnosisSafe.contract.execTransaction.getData(to, value, data, operation, 0, 0, 0, 0, 0, "0x")
        assert.equal(await utils.getErrorMessage(gnosisSafe.address, 0, executeDataWithoutSignatures), "Invalid signatures provided")

        let approveData = gnosisSafe.contract.approveHash.getData(txHash)
        assert.equal(await utils.getErrorMessage(gnosisSafe.address, 0, approveData, executor), "Only owners can approve a hash")

        let sigs = "0x"
        for (let account of (accounts.sort())) {
            if (account != txSender) {
                utils.logGasUsage("confirm by hash " + subject + " with " + account, await gnosisSafe.approveHash(txHash, {from: account}))
            }
            sigs += "000000000000000000000000" + account.replace('0x', '') + "0000000000000000000000000000000000000000000000000000000000000000" + "01"
        }

        let tx = await gnosisSafe.execTransaction(to, value, data, operation, 0, 0, 0, 0, 0, sigs, {from: txSender})
        utils.logGasUsage(subject, tx)

        let executeDataUsedSignatures = gnosisSafe.contract.execTransaction.getData(to, value, data, operation, 0, 0, 0, 0, 0, sigs)
        assert.equal(await utils.getErrorMessage(gnosisSafe.address, 0, executeDataUsedSignatures), "Invalid signatures provided")
        return tx
    }

    beforeEach(async function () {
        // Create Master Copies
        let proxyFactory = await ProxyFactory.new()
        let gnosisSafeMasterCopy = await GnosisSafe.new()
        gnosisSafeMasterCopy.setup([accounts[0]], 1, 0, "0x")
        // Create Gnosis Safe
        let gnosisSafeData = await gnosisSafeMasterCopy.contract.setup.getData([accounts[0], accounts[1], accounts[2]], 2, 0, "0x")
        gnosisSafe = utils.getParamFromTxEvent(
            await proxyFactory.createProxy(gnosisSafeMasterCopy.address, gnosisSafeData),
            'ProxyCreation', 'proxy', proxyFactory.address, GnosisSafe, 'create Gnosis Safe',
        )
    })

    it('should deposit and withdraw 1 ETH', async () => {
        // Deposit 1 ETH + some spare money for execution 
        assert.equal(await web3.eth.getBalance(gnosisSafe.address), 0)
        await web3.eth.sendTransaction({from: accounts[0], to: gnosisSafe.address, value: web3.toWei(1, 'ether')})
        assert.equal(await web3.eth.getBalance(gnosisSafe.address).toNumber(), web3.toWei(1, 'ether'))

        // Withdraw 1 ETH
        await executeTransaction('executeTransaction withdraw 0.5 ETH', [accounts[0], accounts[2]], accounts[0], web3.toWei(0.5, 'ether'), "0x", CALL)

        await executeTransaction('executeTransaction withdraw 0.5 ETH', [accounts[0], accounts[2]], accounts[0], web3.toWei(0.5, 'ether'), "0x", CALL)

        assert.equal(await web3.eth.getBalance(gnosisSafe.address).toNumber(), web3.toWei(0, 'ether'))
    })

    it('should deposit and withdraw 1 ETH with sender as owner', async () => {
        // Deposit 1 ETH + some spare money for execution 
        assert.equal(await web3.eth.getBalance(gnosisSafe.address), 0)
        await web3.eth.sendTransaction({from: accounts[0], to: gnosisSafe.address, value: web3.toWei(1, 'ether')})
        assert.equal(await web3.eth.getBalance(gnosisSafe.address).toNumber(), web3.toWei(1, 'ether'))

        // Withdraw 1 ETH
        await executeTransaction('executeTransaction withdraw 0.5 ETH', [accounts[0], accounts[2]], accounts[0], web3.toWei(0.5, 'ether'), "0x", CALL, { sender: accounts[2] })

        await executeTransaction('executeTransaction withdraw 0.5 ETH', [accounts[0], accounts[2]], accounts[0], web3.toWei(0.5, 'ether'), "0x", CALL, { sender: accounts[2] })

        assert.equal(await web3.eth.getBalance(gnosisSafe.address).toNumber(), web3.toWei(0, 'ether'))
    })

    it('should add, remove and replace an owner and update the threshold', async () => {
        // Add owner and set threshold to 3
        assert.equal(await gnosisSafe.getThreshold(), 2)
        let data = await gnosisSafe.contract.addOwnerWithThreshold.getData(accounts[5], 3)
        await executeTransaction('add owner and set threshold to 3', [accounts[0], accounts[1]], gnosisSafe.address, 0, data, CALL)
        assert.deepEqual(await gnosisSafe.getOwners(), [accounts[5], accounts[0], accounts[1], accounts[2]])
        assert.equal(await gnosisSafe.getThreshold(), 3)

        // Replace owner and keep threshold
        data = await gnosisSafe.contract.swapOwner.getData(accounts[1], accounts[2], accounts[3])
        await executeTransaction('replace owner', [accounts[0], accounts[1], accounts[2]], gnosisSafe.address, 0, data, CALL)
        assert.deepEqual(await gnosisSafe.getOwners(), [accounts[5], accounts[0], accounts[1], accounts[3]])

        // Remove owner and reduce threshold to 2
        data = await gnosisSafe.contract.removeOwner.getData(accounts[1], accounts[3], 2)
        await executeTransaction('remove owner and reduce threshold to 2', [accounts[0], accounts[1], accounts[3]], gnosisSafe.address, 0, data, CALL)
        assert.deepEqual(await gnosisSafe.getOwners(), [accounts[5], accounts[0], accounts[1]])
    })

    it('should do a CREATE transaction', async () => {
        // Create test contract
        let source = `
        contract Test {
            function x() public pure returns (uint) {
                return 21;
            }
        }`
        let output = await utils.compile(source);
        const TestContract = web3.eth.contract(output.interface);
        let testContract = utils.getParamFromTxEvent(
            await executeTransaction('create test contract', [accounts[0], accounts[1]], 0, 0, output.data, CREATE),
            'ContractCreation', 'newContract', gnosisSafe.address, TestContract, 'executeTransaction CREATE'
        )
        assert.equal(await testContract.x(), 21)
    })
})
