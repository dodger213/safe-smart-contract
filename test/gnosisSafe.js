const utils = require('./utils')
const solc = require('solc')

const GnosisSafe = artifacts.require("./GnosisSafe.sol")


contract('GnosisSafe', function(accounts) {

    let gnosisSafe
    let lw
    let data
    let transactionHash

    const CALL = 0
    const CREATE = 2

    beforeEach(async function () {
        // Create lightwallet
        lw = await utils.createLightwallet()
        // Create Gnosis Safe
        gnosisSafe = await GnosisSafe.new([lw.accounts[0], lw.accounts[1]], 2, 0, 0)
    })

    it('should create a new Safe and deposit and withdraw 1 ETH', async () => {
        // Deposit 1 ETH
        assert.equal(await web3.eth.getBalance(gnosisSafe.address), 0)
        await web3.eth.sendTransaction({from: accounts[0], to: gnosisSafe.address, value: web3.toWei(1, 'ether')})
        assert.equal(await web3.eth.getBalance(gnosisSafe.address).toNumber(), web3.toWei(1, 'ether'))
        // Withdraw 1 ETH
        nonce = await gnosisSafe.nonce()
        transactionHash = await gnosisSafe.getTransactionHash(accounts[0], web3.toWei(0.5, 'ether'), 0, CALL, nonce)
        // Confirm transaction with signed messages
        let sigs = utils.signTransaction(lw, [lw.accounts[0], lw.accounts[1]], transactionHash)
        utils.logGasUsage(
            'executeTransaction withdraw 0.5 ETH',
            await gnosisSafe.executeTransaction(
                accounts[0], web3.toWei(0.5, 'ether'), 0, CALL, sigs.sigV, sigs.sigR, sigs.sigS, []
            )
        )
        nonce = await gnosisSafe.nonce()
        transactionHash = await gnosisSafe.getTransactionHash(accounts[0], web3.toWei(0.5, 'ether'), 0, CALL, nonce)
        // Confirm transaction with signed messages
        sigs = utils.signTransaction(lw, [lw.accounts[0], lw.accounts[1]], transactionHash)
        utils.logGasUsage(
            'executeTransaction withdraw 0.5 ETH 2nd time',
            await gnosisSafe.executeTransaction(
                accounts[0], web3.toWei(0.5, 'ether'), 0, CALL, sigs.sigV, sigs.sigR, sigs.sigS, []
            )
        )
        assert.equal(await web3.eth.getBalance(gnosisSafe.address).toNumber(), 0)
    })

    it('should add, remove and replace an owner and update the threshold', async () => {
        // Add owner and set threshold to 3
        assert.equal(await gnosisSafe.threshold(), 2)
        data = await gnosisSafe.contract.addOwner.getData(lw.accounts[2], 3)
        nonce = await gnosisSafe.nonce()
        transactionHash = await gnosisSafe.getTransactionHash(gnosisSafe.address, 0, data, CALL, nonce)
        // Confirm transaction with signed messages
        let sigs = utils.signTransaction(lw, [lw.accounts[0], lw.accounts[1]], transactionHash)
        utils.logGasUsage(
            'executeTransaction add owner',
            await gnosisSafe.executeTransaction(
                gnosisSafe.address, 0, data, CALL, sigs.sigV, sigs.sigR, sigs.sigS, []
            )
        )
        assert.deepEqual(await gnosisSafe.getOwners(), [lw.accounts[0], lw.accounts[1], lw.accounts[2]])
        assert.equal(await gnosisSafe.threshold(), 3)
        // Replace owner and keep threshold
        data = await gnosisSafe.contract.replaceOwner.getData(2, lw.accounts[3])
        nonce = await gnosisSafe.nonce()
        transactionHash = await gnosisSafe.getTransactionHash(gnosisSafe.address, 0, data, CALL, nonce)
        // Confirm transaction with signed messages
        sigs = utils.signTransaction(lw, [lw.accounts[0], lw.accounts[1], lw.accounts[2]], transactionHash)
        utils.logGasUsage(
            'executeTransaction replace owner',
            await gnosisSafe.executeTransaction(
                gnosisSafe.address, 0, data, CALL, sigs.sigV, sigs.sigR, sigs.sigS, []
            )
        )
        assert.deepEqual(await gnosisSafe.getOwners(), [lw.accounts[0], lw.accounts[1], lw.accounts[3]])
        // Remove owner and reduce threshold to 2
        data = await gnosisSafe.contract.removeOwner.getData(2, 2)
        nonce = await gnosisSafe.nonce()
        transactionHash = await gnosisSafe.getTransactionHash(gnosisSafe.address, 0, data, CALL, nonce)
        // Confirm transaction with signed messages
        sigs = utils.signTransaction(lw, [lw.accounts[0], lw.accounts[1], lw.accounts[3]], transactionHash)
        utils.logGasUsage(
            'executeTransaction remove owner',
            await gnosisSafe.executeTransaction(
                gnosisSafe.address, 0, data, CALL, sigs.sigV, sigs.sigR, sigs.sigS, []
            )
        )
        assert.deepEqual(await gnosisSafe.getOwners(), [lw.accounts[0], lw.accounts[1]])
    })

    it('should do a CREATE transaction', async () => {
        // Create test contract
        let source = `
        contract Test {
            function x() pure returns (uint) {
                return 21;
            }
        }`
        let output = await solc.compile(source, 0);
        let interface = JSON.parse(output.contracts[':Test']['interface'])
        let bytecode = '0x' + output.contracts[':Test']['bytecode']
        data = bytecode
        nonce = await gnosisSafe.nonce()
        transactionHash = await gnosisSafe.getTransactionHash(0, 0, data, CREATE, nonce)
        // Confirm transaction with signed messages
        let sigs = utils.signTransaction(lw, [lw.accounts[0], lw.accounts[1]], transactionHash)
        const TestContract = web3.eth.contract(interface);
        let testContract = utils.getParamFromTxEvent(
            await gnosisSafe.executeTransaction(
                0, 0, data, CREATE, sigs.sigV, sigs.sigR, sigs.sigS, []
            ),
            'ContractCreation', 'newContract', gnosisSafe.address, TestContract, 'executeTransaction CREATE'
        )
        assert.equal(await testContract.x(), 21)
    })
})
