const utils = require('./utils/general')
const safeUtils = require('./utils/execution')
const ProxyFactory = artifacts.require("./GnosisSafeProxyFactory.sol");
const GnosisSafe = artifacts.require("./GnosisSafe.sol")

contract('GnosisSafe', function(accounts) {

    let gnosisSafe
    let lw
    let executor = accounts[8]

    const CALL = 0

    beforeEach(async function () {
        // Create lightwallet
        lw = await utils.createLightwallet()
        // Create Master Copies
        let proxyFactory = await ProxyFactory.new()
        let gnosisSafeMasterCopy = await utils.deployContract("deploying Gnosis Safe Mastercopy", GnosisSafe)
        let gnosisSafeData = await gnosisSafeMasterCopy.contract.methods.setup(
            [lw.accounts[0], lw.accounts[1], lw.accounts[2]], 2, utils.Address0, "0x", utils.Address0, utils.Address0, 0, utils.Address0
        ).encodeABI()
        gnosisSafe = await utils.getParamFromTxEvent(
            await proxyFactory.createProxy(gnosisSafeMasterCopy.address, gnosisSafeData),
            'ProxyCreation', 'proxy', proxyFactory.address, GnosisSafe, 'create Gnosis Safe',
        )
    })

    it('Check that correct data is returned', async () => {
        // Deposit 1 ETH + some spare money for execution
        assert.equal(await web3.eth.getBalance(gnosisSafe.address), 0)
        await web3.eth.sendTransaction({from: accounts[0], to: gnosisSafe.address, value: web3.utils.toWei("1.1", 'ether')})
        assert.equal(await web3.eth.getBalance(gnosisSafe.address), web3.utils.toWei("1.1", 'ether'))

        let enableModuleData = gnosisSafe.contract.methods.enableModule(accounts[0]).encodeABI()
        await safeUtils.executeTransaction(lw, gnosisSafe, 'enable account as module', [lw.accounts[0], lw.accounts[2]], gnosisSafe.address, 0, enableModuleData, CALL, executor)

        let getModulesData = gnosisSafe.contract.methods.getModules().encodeABI()
        let response = await gnosisSafe.execTransactionFromModuleReturnData.call(gnosisSafe.address, 0, getModulesData, CALL)
        assert.deepEqual(
            [true, '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000' + accounts[0].slice(2).toLowerCase()],
            [response.success, response.returnData]
        )
    })
})
