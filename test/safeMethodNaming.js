const utils = require('./utils')
const solc = require('solc')

const StateChannelModule = artifacts.require("./StateChannelModule.sol");
const GnosisSafeTeam = artifacts.require("./GnosisSafeTeamEdition.sol");
const GnosisSafePersonal = artifacts.require("./GnosisSafePersonalEdition.sol");

contract('GnosisSafeEditions', function(accounts) {

    let getSortedFunctions = function(abi) {
        return abi.filter((e) => e.type === 'function')
                    .map((f) => {
                        let sig = f.name + "(" + (f.inputs.length == 0 ? "" : f.inputs.map((i) => i.type).reduce((acc, value) => acc + "," + value)) + ")"
                        return {
                            "name": f.name, 
                            "id": web3.sha3(sig).substr(0,10),
                            //"sig": sig
                        }
                    })
                    .sort((a, b) => {
                        if (a.id < b.id) {
                            return -1;
                        }
                        if (a.id > b.id) {
                            return 1;
                        }
                        return 0;
                    })
    }
    it('check method naming of personal safe', async () => {
        let functions = getSortedFunctions(GnosisSafePersonal.abi)
        console.log(functions)
        assert.equal('execTransactionAndPaySubmitter', functions[0].name)
    })
});
