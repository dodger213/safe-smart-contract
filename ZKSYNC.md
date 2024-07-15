# Safe Smart Account & ZkSync Integration Attempts

### Introduction

This document captures Safe’s multiple attempts to integrate the ZkSync network into their Hardhat project. We genuinely believe that ZkSync is doing a fantastic job bringing cutting-edge Zero Knowledge cryptography for a more trustless and fair future, and we would love to support ZkSync in our Safe project. However, it turned out to be much more challenging than we anticipated. This paper will describe all the issues that we encountered on the way.

### Status Quo

-   Safe Contracts are written in Solidity and deployed to hundreds EVM-compatible networks
-   We use `hardhat` and `hardhat-deploy` for counterfactual deployments

### Integration requirements

-   Compile contracts to a ZkSync-compatible bytecode
-   Deploy contracts to ZkSync
-   **Most important:** Run tests against a ZkSync VM-based network

### **An endeavour from the past**

Our first attempt to integrate ZkSync was roughly in March 2023, when Safe was at v1.3.0 of the contracts. We found out that there were hardhat plugins and hoped that we would have a smooth ride, but we quickly found out that:

-   You’d have to use a separate compiler to compile to a ZkSync-compatible bytecode.
-   Running tests against a ZkSync VM was not covered by the tutorials, as it was assumed that projects would just blindly trust the compiler and the claimed EVM compatibility. Running a local testned required running a docker compose app.
-   When using the compiler, we discovered that our code contained ZK-incompatible code, such as contract type property `type(C).creationCode`

The latter became a hard blocker for the integration because it meant updating the contract code and re-auditing the contracts. Given the complexity, we decided not to pursue the in-house integration and suggested hiring an external dev agency to perform all the necessary steps. ZkSync hired Protofire, who managed to complete all the required integration steps and delivered a version that fit all of our integration requirements. The version co-existed with the EVM-based 1.3.0 version because we didn’t want to release a new 1.3.0 version with breaking changes. The version is available here:

[1.3.0 libs.0 zksync](https://github.com/safe-global/safe-smart-account/pull/588)

The setup seems to still work up to this day with the latest ZkSync local node from [https://github.com/matter-labs/local-setup](https://github.com/matter-labs/local-setup), even though the ZkSync plugins used are deprecated. With one caveat, though, each test took around 28 seconds to execute:

```other
SimulateTxAccessor
    estimate
      - should enforce delegatecall
      ✔ simulate call (27558ms)
      ✔ simulate delegatecall (27214ms)
      ✔ simulate revert (27298ms)

  GnosisSafe
    requiredTxGas
      ✔ should revert without reason if tx fails (31726ms)
      ✔ should always revert (29918ms)
      ✔ can be called from another contract (29574ms)
```

I didn’t investigate the exact reason, but I think it might be related to the batch processing time. I asked the ZkSync team whether there’s a configuration option I can try.

### Back to the modern day

Safe Contracts are at version 1.4.1 now, with 1.5.0 coming soon. We want to bring ZkSync support to our new versions. We based our work on a previous attempt to integrate ZkSync done by Protofire: [https://github.com/safe-global/safe-smart-account/pull/625](https://github.com/safe-global/safe-smart-account/pull/625).

The integration failed because ZkSync packages used ethers v5 at the time while Safe had already migrated to ethers v6.

**Failed attempt #1: The Umbrella plugin**

Trying to follow the [Migrating to ZKsync](https://docs.zksync.io/build/tooling/hardhat/migrating-to-zksync) guide:

> ## [Install dependencies](https://docs.zksync.io/build/tooling/hardhat/migrating-to-zksync#install-dependencies)

> Although ZKsync Era is compatible with Solidity and Vyper, the deployed bytecode and the deployment process is different from Ethereum or other EVM blockchains. So the first step is to install the compiler and deployer Hardhat plugins:

> If you're using Vyper, replace `@matterlabs/hardhat-zksync-solc` with `@matterlabs/hardhat-zksync-vyper`

> npm

```other
npm i -D @matterlabs/hardhat-zksync
```

When running the above command, we get a lot of warnings from npm:

```other
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: @matterlabs/zksync-contracts@0.6.1
npm warn Found: @openzeppelin/contracts@4.9.6
npm warn node_modules/@matterlabs/hardhat-zksync/node_modules/@openzeppelin/contracts
npm warn   @openzeppelin/contracts@"^4.9.2" from @matterlabs/hardhat-zksync@1.1.0
npm warn   node_modules/@matterlabs/hardhat-zksync
npm warn     @matterlabs/hardhat-zksync@"*" from the root project
npm warn
npm warn Could not resolve dependency:
npm warn peer @openzeppelin/contracts@"4.6.0" from @matterlabs/zksync-contracts@0.6.1
npm warn node_modules/@matterlabs/hardhat-zksync/node_modules/@matterlabs/zksync-contracts
npm warn   @matterlabs/zksync-contracts@"^0.6.1" from @matterlabs/hardhat-zksync@1.1.0
npm warn   node_modules/@matterlabs/hardhat-zksync
npm warn
npm warn Conflicting peer dependency: @openzeppelin/contracts@4.6.0
npm warn node_modules/@openzeppelin/contracts
npm warn   peer @openzeppelin/contracts@"4.6.0" from @matterlabs/zksync-contracts@0.6.1
npm warn   node_modules/@matterlabs/hardhat-zksync/node_modules/@matterlabs/zksync-contracts
npm warn     @matterlabs/zksync-contracts@"^0.6.1" from @matterlabs/hardhat-zksync@1.1.0
npm warn     node_modules/@matterlabs/hardhat-zksync
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: @matterlabs/zksync-contracts@0.6.1
npm warn Found: @openzeppelin/contracts-upgradeable@4.9.6
npm warn node_modules/@openzeppelin/contracts-upgradeable
npm warn   @openzeppelin/contracts-upgradeable@"^4.9.2" from @matterlabs/hardhat-zksync@1.1.0
npm warn   node_modules/@matterlabs/hardhat-zksync
npm warn     @matterlabs/hardhat-zksync@"*" from the root project
npm warn   1 more (@matterlabs/hardhat-zksync-upgradable)
npm warn
npm warn Could not resolve dependency:
npm warn peer @openzeppelin/contracts-upgradeable@"4.6.0" from @matterlabs/zksync-contracts@0.6.1
npm warn node_modules/@matterlabs/hardhat-zksync/node_modules/@matterlabs/zksync-contracts
npm warn   @matterlabs/zksync-contracts@"^0.6.1" from @matterlabs/hardhat-zksync@1.1.0
npm warn   node_modules/@matterlabs/hardhat-zksync
npm warn
npm warn Conflicting peer dependency: @openzeppelin/contracts-upgradeable@4.6.0
npm warn node_modules/@openzeppelin/contracts-upgradeable
npm warn   peer @openzeppelin/contracts-upgradeable@"4.6.0" from @matterlabs/zksync-contracts@0.6.1
npm warn   node_modules/@matterlabs/hardhat-zksync/node_modules/@matterlabs/zksync-contracts
npm warn     @matterlabs/zksync-contracts@"^0.6.1" from @matterlabs/hardhat-zksync@1.1.0
npm warn     node_modules/@matterlabs/hardhat-zksync
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
```

This log shows that a few ZKsync packages depend on a specific @openzeppelin/contracts version but expect the dependencies to be provided by the host project. This is suboptimal for many reasons:

1. This forces the host project to use a specific version of the Openzeppelin contract suite
2. Security - The ZkSync team should’ve audited their contracts for a specific version of the openzeppelin contracts. What if the audit was performed on version 4.6.0, but the host project supplied version 4.6.1, which introduces a potential bug?

Furthermore, there’s already a dependency conflict even between their pacakges, from the log:

1. `@openzeppelin/contracts@"4.6.0" from @matterlabs/zksync-contracts@0.6.1`
2. `openzeppelin/contracts@"^4.9.2" from @matterlabs/hardhat-zksync@1.1.0`

Therefore, it’s impossible to fulfil the requirements already, clearly showing the shortcomings of the peer dependencies approach.

Following the guide further, after importing the package into hardhat.config.ts, our project can no longer be compiled:

> @safe-global/safe-smart-account@1.4.1-build.0 build

> hardhat compile

> Error HH402: File @openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol doesn't exist.

> For more info go to [https://hardhat.org/HH402](https://hardhat.org/HH402) or run Hardhat with --show-stack-traces

We reported the issue with the dependencies [https://github.com/matter-labs/hardhat-zksync/issues/1227](https://github.com/matter-labs/hardhat-zksync/issues/1227), and after a short back and forth, the ZKsync team promised to look into it.

**Failed attempt #2: The local in-memory node**

Instead of using the umbrella package, let’s install only the plugins that we require and configure hardhat to use them. This is the hardhat config we end up with:

```other
import "@nomicfoundation/hardhat-toolbox";
import type { HardhatUserConfig, HttpNetworkUserConfig } from "hardhat/types";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";
import "@matterlabs/hardhat-zksync-ethers";
import "@matterlabs/hardhat-zksync-node";
import "hardhat-deploy";
import dotenv from "dotenv";
import yargs from "yargs";
import { getSingletonFactoryInfo } from "@safe-global/safe-singleton-factory";
import { LOCAL_NODE_RICH_WALLETS } from "./src/zk-utils/constants";

const argv = yargs
    .option("network", {
        type: "string",
        default: "hardhat",
    })
    .help(false)
    .version(false)
    .parseSync();

// Load environment variables.
dotenv.config();
const {
    NODE_URL,
    INFURA_KEY,
    MNEMONIC,
    ETHERSCAN_API_KEY,
    PK,
    SOLIDITY_VERSION,
    SOLIDITY_SETTINGS,
    HARDHAT_RUN_ZKSYNC_NODE = "",
} = process.env;

const DEFAULT_MNEMONIC = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";

const sharedNetworkConfig: HttpNetworkUserConfig = {};
if (PK) {
    sharedNetworkConfig.accounts = [PK];
} else {
    sharedNetworkConfig.accounts = {
        mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
    };
}

if (["mainnet", "rinkeby", "kovan", "goerli", "ropsten", "mumbai", "polygon"].includes(argv.network) && INFURA_KEY === undefined) {
    throw new Error(`Could not find Infura key in env, unable to connect to network ${argv.network}`);
}

import "./src/tasks/local_verify";
import "./src/tasks/deploy_contracts";
import "./src/tasks/show_codesize";
import "./src/tasks/zk";
import { BigNumber } from "@ethersproject/bignumber";
import { DeterministicDeploymentInfo } from "hardhat-deploy/dist/types";

const defaultSolidityVersion = "0.7.6";
const primarySolidityVersion = SOLIDITY_VERSION || defaultSolidityVersion;
const soliditySettings = SOLIDITY_SETTINGS ? JSON.parse(SOLIDITY_SETTINGS) : undefined;

const deterministicDeployment = (network: string): DeterministicDeploymentInfo => {
    const info = getSingletonFactoryInfo(parseInt(network));
    if (!info) {
        throw new Error(`
        Safe factory not found for network ${network}. You can request a new deployment at https://github.com/safe-global/safe-singleton-factory.
        For more information, see https://github.com/safe-global/safe-smart-account#replay-protection-eip-155
      `);
    }
    return {
        factory: info.address,
        deployer: info.signerAddress,
        funding: BigNumber.from(info.gasLimit).mul(BigNumber.from(info.gasPrice)).toString(),
        signedTx: info.transaction,
    };
};

const userConfig: HardhatUserConfig = {
    paths: {
        artifacts: "build/artifacts",
        cache: "build/cache",
        deploy: "src/deploy",
        sources: "contracts",
    },
    typechain: {
        outDir: "typechain-types",
        target: "ethers-v6",
    },
    solidity: {
        compilers: [{ version: primarySolidityVersion, settings: soliditySettings }, { version: defaultSolidityVersion }],
    },
    zksolc: {
        version: "1.5.1",
        settings: {},
    },
    networks: {
        hardhat: {
            allowUnlimitedContractSize: true,
            blockGasLimit: 100000000,
            gas: 100000000,
            zksync: Boolean(HARDHAT_RUN_ZKSYNC_NODE),
        },
        mainnet: {
            ...sharedNetworkConfig,
            url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
        },
        gnosis: {
            ...sharedNetworkConfig,
            url: "https://rpc.gnosischain.com",
        },
        goerli: {
            ...sharedNetworkConfig,
            url: `https://goerli.infura.io/v3/${INFURA_KEY}`,
        },
        mumbai: {
            ...sharedNetworkConfig,
            url: `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`,
        },
        polygon: {
            ...sharedNetworkConfig,
            url: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
        },
        bsc: {
            ...sharedNetworkConfig,
            url: `https://bsc-dataseed.binance.org/`,
        },
        arbitrum: {
            ...sharedNetworkConfig,
            url: `https://arb1.arbitrum.io/rpc`,
        },
        fantomTestnet: {
            ...sharedNetworkConfig,
            url: `https://rpc.testnet.fantom.network/`,
        },
        avalanche: {
            ...sharedNetworkConfig,
            url: `https://api.avax.network/ext/bc/C/rpc`,
        },
        zkSyncMainnet: {
            ...sharedNetworkConfig,
            url: "https://mainnet.era.zksync.io",
            ethNetwork: "mainnet",
            zksync: true,
            verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
        },
        zkSyncTestnet: {
            ...sharedNetworkConfig,
            url: "https://testnet.era.zksync.dev",
            ethNetwork: "goerli",
            zksync: true,
            verifyURL: "https://zksync2-testnet-explorer.zksync.dev/contract_verification",
        },
        zkSyncLocal: {
            chainId: 270,
            url: "http://localhost:3050",
            ethNetwork: "http://localhost:8545",
            accounts: LOCAL_NODE_RICH_WALLETS.map((w) => w.privateKey),
            zksync: true,
            saveDeployments: false,
        },
    },
    deterministicDeployment,
    namedAccounts: {
        deployer: 0,
    },
    mocha: {
        timeout: 2000000,
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
};
if (NODE_URL) {
    userConfig.networks!.custom = {
        ...sharedNetworkConfig,
        url: NODE_URL,
    };
}
export default userConfig;
```

Testing the compilation:

`hardhat compile --network zkSyncLocal`

Works! Log:

```plaintext
> @safe-global/safe-smart-account@1.4.1-build.0 npx
> hardhat compile --network zkSyncLocal

Yul codegen is only supported for solc >= 0.8. Flag forceEVMLA will automatically be set to true by default.
Yul codegen is only supported for solc >= 0.8. Flag forceEVMLA will automatically be set to true by default.
Compiling contracts for ZKsync Era with zksolc v1.5.1 and zkvm-solc v0.7.6-1.0.1
Compiling 1 Solidity file
Compiling contracts for ZKsync Era with zksolc v1.5.1 and zkvm-solc v0.7.6-1.0.1
Compiling 1 Solidity file
Compiling contracts for ZKsync Era with zksolc v1.5.1 and zkvm-solc v0.7.6-1.0.1
Compiling 42 Solidity files
Compiling contracts for ZKsync Era with zksolc v1.5.1 and zkvm-solc v0.7.6-1.0.1
Compiling 1 Solidity file
Compiling contracts for ZKsync Era with zksolc v1.5.1 and zkvm-solc v0.7.6-1.0.1
Compiling 3 Solidity files
Compiling contracts for ZKsync Era with zksolc v1.5.1 and zkvm-solc v0.7.6-1.0.1
Compiling 1 Solidity file
Compiling contracts for ZKsync Era with zksolc v1.5.1 and zkvm-solc v0.7.6-1.0.1
Compiling 5 Solidity files
Compiling contracts for ZKsync Era with zksolc v1.5.1 and zkvm-solc v0.7.6-1.0.1
Compiling 5 Solidity files
Compiling contracts for ZKsync Era with zksolc v1.5.1 and zkvm-solc v0.7.6-1.0.1
Compiling 1 Solidity file
Compiling contracts for ZKsync Era with zksolc v1.5.1 and zkvm-solc v0.7.6-1.0.1
Compiling 1 Solidity file
Compiling contracts for ZKsync Era with zksolc v1.5.1 and zkvm-solc v0.7.6-1.0.1
Compiling 1 Solidity file
Compiling contracts for ZKsync Era with zksolc v1.5.1 and zkvm-solc v0.7.6-1.0.1
Compiling 1 Solidity file
contracts/proxies/SafeProxyFactory.sol:123:5: Warning: Function state mutability can be restricted to pure
    function getChainId() public view returns (uint256) {
    ^ (Relevant source part starts here and spans across multiple lines).

@openzeppelin/contracts/token/ERC20/ERC20.sol:55:5: Warning: Visibility for constructor is ignored. If you want the contract to be non-deployable, making it "abstract" is sufficient.
    constructor (string memory name_, string memory symbol_) public {
    ^ (Relevant source part starts here and spans across multiple lines).

contracts/test/ERC20Token.sol:14:5: Warning: Visibility for constructor is ignored. If you want the contract to be non-deployable, making it "abstract" is sufficient.
    constructor() public ERC20("TestToken", "TT") {
    ^ (Relevant source part starts here and spans across multiple lines).

@openzeppelin/contracts/proxy/UpgradeableProxy.sol:24:5: Warning: Visibility for constructor is ignored. If you want the contract to be non-deployable, making it "abstract" is sufficient.
    constructor(address _logic, bytes memory _data) public payable {
    ^ (Relevant source part starts here and spans across multiple lines).

Warning: You are checking for 'tx.origin', which might lead to unexpected behavior.

ZKsync Era comes with native account abstraction support, and therefore the initiator of a
transaction might be different from the contract calling your code. It is highly recommended NOT
to rely on tx.origin, but use msg.sender instead.

In Solidity v0.4, where there is no `payable` type, this may be a false positive
if `using X for address` is used with `X` implementing its own `send` or `transfer` functions.

Learn more about Account Abstraction at https://docs.zksync.io/build/developer-reference/account-abstraction/

You may disable this warning with:
    a. `suppressedWarnings = ["txorigin"]` in standard JSON.
    b. `--suppress-warnings txorigin` in the CLI.
    --> contracts/Safe.sol:206:73
     |
 206 |         address payable receiver = refundReceiver == address(0) ? payable(tx.origin) : refundReceiver;
     |                                                                           ^^^^^^^^^


Generating typings for: 68 artifacts in dir: typechain-types for target: ethers-v6
Successfully generated 162 typings!
Successfully compiled 63 Solidity files
```

Unfortunately, the [guide](https://docs.zksync.io/build/tooling/hardhat/migrating-to-zksync#overview) we've been following so far doesn't tell you how to test the contracts; instead, it only focuses on compilation and deployment steps, so we must search for it elsewhere. There's a guide [available](https://docs.zksync.io/build/test-and-debug/hardhat), but it primarily focuses on a ZKsync-first setup rather than side-by-side with EVM testing. But let's see how far we can go with it.

It wants us to install and run the [in-memory node](https://docs.zksync.io/build/test-and-debug/in-memory-node) separately, but we found a hardhat plugin [available](https://docs.zksync.io/build/tooling/hardhat/hardhat-zksync-node). Ideally, we'd like to stay in the hardhat environment to avoid glueing multiple pieces together. We configured our hardhat network according to the “Running Hardhat's test Task with hardhat-zksync-node" section from the documentation page:

```other
networks: {
  hardhat: {
    zksync: true,
  }
},
```

We adjusted our signer accounts retrieval code to use the zksync-ethers package and fixed some TypeScript type errors along the way.

```other
export const getWallets = async () => {
    if (hre.network.name === "hardhat") return hre.ethers.getSigners();
    if (hre.network.zksync) return hre.zksyncEthers.getWallets();

    throw new Error("You can get wallets only on Hardhat or ZkSyncLocal networks!");
};
```

The getWallets function should return an array of rich ZKsync accounts (if not configured otherwise), which seems to be [supported](https://docs.zksync.io/build/test-and-debug/in-memory-node#pre-configured-rich-wallets) by the node.

The “Deploy contracts” section from the “Migrating to ZKSync” [guide](https://docs.zksync.io/build/tooling/hardhat/migrating-to-zksync#deploy-contracts) states:

> `hardhat-deploy` version `^0.11.26` supports deployments on ZKsync Era.

We use `hardhat-deploy v0.12.x` , so we should be good here.

We configured the deployed private key to be the private key of one of ZKSync’s rich accounts in the `.env` file:

```other
PK="0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110"
```

Let’s run the tests:

```other
> hardhat test --network hardhat

Yul codegen is only supported for solc >= 0.8. Flag forceEVMLA will automatically be set to true by default.
Yul codegen is only supported for solc >= 0.8. Flag forceEVMLA will automatically be set to true by default.


  SimulateTxAccessor
    estimate
could not coalesce error (error={ "code": -32603, "message": "Initiator address 0x0d43eb5b8a47ba8900d84aa36656c92024e9772e is not allowed to perform transactions" }, payload={ "id": 19, "jsonrpc": "2.0", "method": "eth_sendTransaction", "params": [ { "from": "0x0d43eb5b8a47ba8900d84aa36656c92024e9772e", "gas": "0x586fd1", "nonce": "0x0", "to": "0x3fab184622dc19b6109349b94811493bf2a45362", "type": "0x0", "value": "0x2386f26fc10000" } ] }, code=UNKNOWN_ERROR, version=6.13.1) {"code":"UNKNOWN_ERROR","error":{"code":-32603,"message":"Initiator address 0x0d43eb5b8a47ba8900d84aa36656c92024e9772e is not allowed to perform transactions"},"payload":{"method":"eth_sendTransaction","params":[{"gas":"0x586fd1","type":"0x0","nonce":"0x0","value":"0x2386f26fc10000","from":"0x0d43eb5b8a47ba8900d84aa36656c92024e9772e","to":"0x3fab184622dc19b6109349b94811493bf2a45362"}],"id":19,"jsonrpc":"2.0"},"shortMessage":"could not coalesce error"} Error: could not coalesce error (error={ "code": -32603, "message": "Initiator address 0x0d43eb5b8a47ba8900d84aa36656c92024e9772e is not allowed to perform transactions" }, payload={ "id": 19, "jsonrpc": "2.0", "method": "eth_sendTransaction", "params": [ { "from": "0x0d43eb5b8a47ba8900d84aa36656c92024e9772e", "gas": "0x586fd1", "nonce": "0x0", "to": "0x3fab184622dc19b6109349b94811493bf2a45362", "type": "0x0", "value": "0x2386f26fc10000" } ] }, code=UNKNOWN_ERROR, version=6.13.1)
    at makeError (/Users/mmv/Projects/safe/safe-contracts/node_modules/ethers/src.ts/utils/errors.ts:694:21)
    at Provider.getRpcError (/Users/mmv/Projects/safe/safe-contracts/node_modules/ethers/src.ts/providers/provider-jsonrpc.ts:1059:25)
    at /Users/mmv/Projects/safe/safe-contracts/node_modules/ethers/src.ts/providers/provider-jsonrpc.ts:563:45
    at processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'UNKNOWN_ERROR',
  error: {
    code: -32603,
    message: 'Initiator address 0x0d43eb5b8a47ba8900d84aa36656c92024e9772e is not allowed to perform transactions'
  },
  payload: {
    method: 'eth_sendTransaction',
    params: [ [Object] ],
    id: 19,
    jsonrpc: '2.0'
  },
  shortMessage: 'could not coalesce error'
}
```

It’s unclear why the address for sending the transaction used here was 0x0d43eb5b8a47ba8900d84aa36656c92024e9772e because we set the private key from a different account, but it still seems to be from the list of the ZKsync rich accounts supported by the node. Why cannot it make transactions?

We reported the issue to the ZKsync team [the error message was different when we reported it]:

[##zkSync-Community-Hub / ##zksync-developers](https://github.com/zkSync-Community-Hub/zksync-developers/discussions/482)

The ZKsync team didn’t acknowledge the issue and suggested adding hardhat_impersonateAccount RPC call. This is not possible because we do not control the hardhat-deploy package code. Also, what’s the point of hardhat plugins and claimed compatibility if what worked for hundreds of other networks doesn’t work for one?

**Failed attempt #3: The local testnet**

Things didn’t work out with the in-memory node, let’s try using what worked for us before - running the dockerized testnet locally.

Added the configuration entry:

```other
zkSyncLocal: {
            chainId: 270,
            url: "http://localhost:3050",
            ethNetwork: "http://localhost:8545",
            zksync: true,
            saveDeployments: false,
        },
```

Ran the node:

```other
[+] Running 3/0
 ✔ Network zksync-local-setup_default                                                                                                                    Created0.0s
 ⠋ Container zksync-local-setup-postgres-1                                                                                                               Starting0.1s
[+] Running 3/5sync-local-setup-reth-1                                                          ✔ Network zksync-local-setup_default                                                                                                                    Created0.0s                           ⠙ Container zksync-local-setup-postgres-1                                                                                                               Starting0.2s he detected host platfor[+] Running 4/5sync-local-setup-reth-1                                                          ✔ Network zksync-local-setup_default                                                                                                                    Created0.0s                           ✔ Container zksync-local-setup-postgres-1                                                                                                               Started0.2s the detected host platfor[+] Running 5/5sync-local-setup-reth-1                                                          ✔ Network zksync-local-setup_default                                                                                                                    Created0.0s                           ✔ Container zksync-local-setup-postgres-1                                                                                                               Started0.2s the detected host platfor ✔ Container zksync-local-setup-reth-1                                                                                                                   Started0.2s
 ✔ Container zksync-local-setup-zksync-1                                                                                                                 Started0.3s
 ! zksync The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested 0.0s
Services are not yet healthy, waiting...
Services are not yet healthy, waiting...
Services are not yet healthy, waiting...
Services are not yet healthy, waiting...
Services are not yet healthy, waiting...
Services are not yet healthy, waiting...
Services are not yet healthy, waiting...
Services are not yet healthy, waiting...
Services are not yet healthy, waiting...
Services are not yet healthy, waiting...
Services are not yet healthy, waiting...
Services are not yet healthy, waiting...
Services are not yet healthy, waiting...
Services are not yet healthy, waiting...
Services are not yet healthy, waiting...
zksync-local-setup-zksync-1   matterlabs/local-node:latest2.0   "entrypoint.sh"   zksync    2 minutes ago   Up 2 minutes (healthy)   3000/tcp, 3030-3031/tcp, 127.0.0.1:3050-3051->3050-3051/tcp
All services are healthy!
```

First attempt to run tests:

```other
> @safe-global/safe-smart-account@1.4.1-build.0 test:zk
> HARDHAT_RUN_ZKSYNC_NODE=1 hardhat test --network zkSyncLocal

Yul codegen is only supported for solc >= 0.8. Flag forceEVMLA will automatically be set to true by default.
Yul codegen is only supported for solc >= 0.8. Flag forceEVMLA will automatically be set to true by default.
Nothing to compile
No need to generate any newer typings.
sending eth to create2 contract deployer address (0x3fab184622dc19b6109349b94811493bf2a45362) (tx: 0x31d5914e15f47b75045154409e627503a93ccd0236f8055fe529bfaf14d762a1)...
deploying create2 deployer contract (at 0x4e59b44847b379578588920ca78fbf26c0b4956c) using deterministic deployment (https://github.com/Arachnid/deterministic-deployment-proxy)An unexpected error occurred:

Error: ERROR processing /Users/mmv/Projects/safe/safe-contracts/src/deploy/deploy_accessors.ts:
ProviderError: Failed to serialize transaction: toAddressIsNull
    at HttpProvider.request (/Users/mmv/Projects/safe/safe-contracts/node_modules/hardhat/src/internal/core/providers/http.ts:96:21)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Web3Provider.send (/Users/mmv/Projects/safe/safe-contracts/node_modules/hardhat-deploy/node_modules/zksync-ethers/src/provider.ts:2607:12)
    at DeploymentsManager.executeDeployScripts (/Users/mmv/Projects/safe/safe-contracts/node_modules/hardhat-deploy/src/DeploymentsManager.ts:1214:19)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async DeploymentsManager.runDeploy (/Users/mmv/Projects/safe/safe-contracts/node_modules/hardhat-deploy/src/DeploymentsManager.ts:1060:5)
    at async SimpleTaskDefinition.action (/Users/mmv/Projects/safe/safe-contracts/node_modules/hardhat-deploy/src/index.ts:450:5)
    at async Environment._runTaskDefinition (/Users/mmv/Projects/safe/safe-contracts/node_modules/hardhat/src/internal/core/runtime-environment.ts:359:14)
    at async Environment.run (/Users/mmv/Projects/safe/safe-contracts/node_modules/hardhat/src/internal/core/runtime-environment.ts:192:14)
    at async SimpleTaskDefinition.action (/Users/mmv/Projects/safe/safe-contracts/node_modules/hardhat-deploy/src/index.ts:601:32)
    at async Environment._runTaskDefinition (/Users/mmv/Projects/safe/safe-contracts/node_modules/hardhat/src/internal/core/runtime-environment.ts:359:14)
    at async Environment.run (/Users/mmv/Projects/safe/safe-contracts/node_modules/hardhat/src/internal/core/runtime-environment.ts:192:14)
    at async SimpleTaskDefinition.action (/Users/mmv/Projects/safe/safe-contracts/node_modules/hardhat-deploy/src/index.ts:690:5)
```

Error when deploying the create2 deterministic deployment factory - seems right since the factory is only EVM compatible. Let’s turn off determinstic deployments for the time being and also run just a single test simply to see if we can get anywhere:

```other
describe("Safe", () => {
    const setupTests = hre.deployments.createFixture(async ({ deployments }) => {
        await deployments.fixture();
        const signers = await getWallets();
        return {
            template: await getSafeTemplate(),
            mock: await getMock(),
            signers,
        };
    });

    describe("setup", () => {
        it.only("should not allow to call setup on singleton", async () => {
            const {
                signers: [user1, user2, user3],
            } = await setupTests();
            const singleton = await getSafeSingleton();
            await expect(await singleton.getThreshold()).to.eq(1n);

            // Because setup wasn't called on the singleton it breaks the assumption made
            // within `getModulesPaginated` method that the linked list will be always correctly
            // initialized with 0x1 as a starting element and 0x1 as the end
            // But because `setupModules` wasn't called, it is empty.
            await expect(singleton.getModulesPaginated(AddressOne, 10)).to.be.reverted;

            // "Should not be able to retrieve owners (currently the contract will run in an endless loop when not initialized)"
            await expect(singleton.getOwners()).to.be.reverted;

            await expect(
                singleton.setup(
                    [user1.address, user2.address, user3.address],
                    2,
                    AddressZero,
                    "0x",
                    AddressZero,
                    AddressZero,
                    0,
                    AddressZero,
                ),
            ).to.be.revertedWith("GS200");
        });
  })
})
```

Ran the tests:

```other
> @safe-global/safe-smart-account@1.4.1-build.0 test:zk
> HARDHAT_RUN_ZKSYNC_NODE=1 hardhat test --network zkSyncLocal

Yul codegen is only supported for solc >= 0.8. Flag forceEVMLA will automatically be set to true by default.
Yul codegen is only supported for solc >= 0.8. Flag forceEVMLA will automatically be set to true by default.
Nothing to compile
No need to generate any newer typings.
deploying "SimulateTxAccessor" (tx: 0xa819f3e7934f3186fd5279dfa6cae3cc5b3da5cc83d5ba5bc72164c8c9f03ef3)...: deployed at 0x011DDA7296ABaDd4E06Ca51a91119c2288f91eB9 with 172837 gas
deploying "SafeProxyFactory" (tx: 0xc36a9d20170f94f9d2f5eb2054b75cf613ad521285a928283de25d99eb281145)...: deployed at 0xb9F68be12C19FF0cB897259DF9F00b5368d54531 with 118143 gas
deploying "TokenCallbackHandler" (tx: 0x8848e6f21072bb25afdf7aacafb97797ffbf8d51c59f94c7eac1627b0269d6d3)...: deployed at 0x4Bde7BBc8CAf803eB6c085e2D9e76b95A3683DA4 with 115054 gas
deploying "CompatibilityFallbackHandler" (tx: 0x1059d5f039cefeb81e045823eb5bf042e6f71deac7329198dd86c867c504320c)...: deployed at 0x7552FD2e9a4751fa23C676141C5011a523D6A9CF with 116768 gas
deploying "CreateCall" (tx: 0xf80fe6bcfa132af2225a63d8da0d19633258b45e7bf38193ce20bcbc2db9d804)...: deployed at 0x4f4A0F99981E9884C9a3FfDeD9C33FF8D088bC30 with 115132 gas
deploying "MultiSend" (tx: 0x38f70ba590821b5d8dea5b0678d30d79001118f4e65d2d73491449054f4b8e4b)...: deployed at 0xd00aA47887597f95a68f87f1a5C96Df1B3fF0bdF with 172791 gas
deploying "MultiSendCallOnly" (tx: 0x851e5be8afab6457930c499fbd55180e75d3a40440b57071104dc2b7f6814c35)...: deployed at 0xFE138f90Ef64c495F53185AF09cE22c6c433f1ef with 115026 gas
deploying "SignMessageLib" (tx: 0xf177a7859ba08b1866e7df0bf97f6aa15a9fd3f67795ae5a7af65471abb5b3cd)...: deployed at 0xCBc6b8aeea129c206F4836799621C833Bf8B9BDe with 115450 gas
deploying "SafeToL2Migration" (tx: 0xe3c5a049387b16e19f117d528613cf4d45c61c5f62d41bb73d36cc020fd579be)...: deployed at 0xAc91E574f2C222a5F8F023C20d2a64Eaa170CcA9 with 131375 gas
deploying "SafeL2" (tx: 0x85b1d1bb19f2410c5753a08dd331d87fb1e08f711b146deb219c6c2908f9cd5c)...: deployed at 0xD46a20665791623De9c223d8375BB3a2744d0dfC with 133187 gas
deploying "Safe" (tx: 0xf5249c649dfb4f77fd90d8fdd9814e9403d43bac526326026013bcd2fe42bd94)...: deployed at 0xAe3d8ffE23780AD8d688d369FC27a0fabD2Bb735 with 176281 gas


  Safe
    setup
      ✔ should not allow to call setup on singleton (15709ms)
```

Single test done (although it took almost 16 seconds - the whole test suite with the hardhat node takes less than that), that’s great - let’s see if we can run the whole `Safe` suite:

```other
> @safe-global/safe-smart-account@1.4.1-build.0 test:zk
> HARDHAT_RUN_ZKSYNC_NODE=1 hardhat test --network zkSyncLocal

Nothing to compile
No need to generate any newer typings.
deploying "SimulateTxAccessor" (tx: 0xe882ab6cc7472cdb653fd693055e8d23dffd9ac91c0d1f658df3c6e4db4b037c)...: deployed at 0x554aD3c784a22480770BaE7e42D13DB31476c5b1 with 172837 gas
deploying "SafeProxyFactory" (tx: 0xfe31e441c27617443997b58671451e024e84f6a8c1b8f6d25fac695346a3f4da)...: deployed at 0x6cE2eF5452E07af258493bbcD521e95E79A3D292 with 118143 gas
deploying "TokenCallbackHandler" (tx: 0xa4a6c8a14a66ba2757ca6907e51f68e78adb13303dbd6ba8c8654c430796c4cf)...: deployed at 0xf7B3900F1D6c2664B705b4876f7b09020984f3cd with 115054 gas
deploying "CompatibilityFallbackHandler" (tx: 0x448afea39298f49c89ff879b2eab09dd853c5ff5960fabcbcb50f9a274747281)...: deployed at 0x12e01702D7683a0Aa5973866d32c6A35B7384B6C with 116768 gas
deploying "CreateCall" (tx: 0x340cb29b6370d2d90dd6f02d039948f521a7b24152f88c75cdbc88a7dbaeadfc)...: deployed at 0x9375CD3BFb036eDC8C3D27864f1DF9bdcb3026f6 with 115132 gas
deploying "MultiSend" (tx: 0xb6ab2576b63797fa89503dd342a05fbc12c5b041ce3b654a8af5459b82320876)...: deployed at 0x28058107Bb5803A5cb1311482f4f6b9a88a7Df41 with 172791 gas
deploying "MultiSendCallOnly" (tx: 0x8a5ed1e2186abe2bb032d30081af23093fb88ff0c5ecacdc15fb6ba23ceb4615)...: deployed at 0xd64ec887ED2Fe953c441D05C92603Ce65d36EF33 with 115026 gas
deploying "SignMessageLib" (tx: 0xe48d0bbb869e4907883b1a5875d43184b3c614ad862c9eab8b3013daa53886f1)...: deployed at 0x3Eeb61b3Dc2af27D63F9CeD3c8571d3c066c77fc with 115450 gas
deploying "SafeToL2Migration" (tx: 0xd67563bb4920d41c0c3a9a9159b2a790800ff7c0b2ece73e3889a37c84aca0c0)...: deployed at 0x52002eF73e1Cb38bB6120b32a2a4988936c9A312 with 131375 gas
deploying "SafeL2" (tx: 0x31e209f6ece5b552cd61731f1dc5d17b8b56e198fd23fe47d780111a635347e1)...: deployed at 0x39a4405ba24Ce876Cc550a52c6d3Aa7aa7Da7c22 with 133187 gas
deploying "Safe" (tx: 0xd20c893022869527b09d68c550c4afa484cb12fe800a109a640ae6eace473bdc)...: deployed at 0x8CB489DC942B168eFdf97d180D8954AFB0cdc7EA with 176281 gas


  Safe
    setup
      ✔ should not allow to call setup on singleton
      1) should set domain hash
      ✔ should revert if called twice (18012ms)
      ✔ should revert if same owner is included twice
      ✔ should revert if 0 address is used as an owner (16267ms)
      ✔ should revert if Safe itself is used as an owner (15357ms)
      ✔ should revert if sentinel is used as an owner (15697ms)
      ✔ should revert if same owner is included twice one after each other (15489ms)
      ✔ should revert if threshold is too high
      ✔ should revert if threshold is 0 (16333ms)
      ✔ should revert if owners are empty (16128ms)
      2) should set fallback handler and call sub inititalizer
      3) should fail if sub initializer fails
      ✔ should fail if ether payment fails (16671ms)
      ✔ should work with ether payment to deployer (17529ms)
      ✔ should work with ether payment to account (20631ms)
      ✔ should fail if token payment fails (15075ms)
      ✔ should work with token payment to deployer (20583ms)
      ✔ should work with token payment to account (19270ms)
      ✔ should revert if the initializer address does not contain code (16398ms)
      ✔ should fail if tried to set the fallback handler address to self (15773ms)


  18 passing (10m)
  3 failing

  1) Safe
       setup
         should set domain hash:
     HardhatChaiMatchersAssertionError: Assertion error: receipt should not be null
      at assertIsNotNull (/Users/mmv/Projects/safe/safe-contracts/node_modules/@nomicfoundation/hardhat-chai-matchers/src/internal/utils.ts:16:11)
      at /Users/mmv/Projects/safe/safe-contracts/node_modules/@nomicfoundation/hardhat-chai-matchers/src/internal/emit.ts:126:28
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at async Context.<anonymous> (/Users/mmv/Projects/safe/safe-contracts/test/core/Safe.Setup.spec.ts:58:13)

  2) Safe
       setup
         should set fallback handler and call sub inititalizer:
     TypeError: Cannot read properties of undefined (reading 'getSolcConfig')
      at OverriddenTaskDefinition._action (node_modules/@matterlabs/hardhat-zksync-solc/src/index.ts:389:46)
      at Environment._runTaskDefinition (node_modules/hardhat/src/internal/core/runtime-environment.ts:359:35)
      at Environment.run (node_modules/hardhat/src/internal/core/runtime-environment.ts:192:25)
      at getSolcBuild (test/utils/zkSync.ts:10:32)
      at zkCompile (test/utils/zkSync.ts:23:29)
      at deployContract (test/utils/setup.ts:252:39)
      at Context.<anonymous> (test/core/Safe.Setup.spec.ts:229:56)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)

  3) Safe
       setup
         should fail if sub initializer fails:
     TypeError: Cannot read properties of undefined (reading 'getSolcConfig')
      at OverriddenTaskDefinition._action (node_modules/@matterlabs/hardhat-zksync-solc/src/index.ts:389:46)
      at Environment._runTaskDefinition (node_modules/hardhat/src/internal/core/runtime-environment.ts:359:35)
      at Environment.run (node_modules/hardhat/src/internal/core/runtime-environment.ts:192:25)
      at getSolcBuild (test/utils/zkSync.ts:10:32)
      at zkCompile (test/utils/zkSync.ts:23:29)
      at deployContract (test/utils/setup.ts:252:39)
      at Context.<anonymous> (test/core/Safe.Setup.spec.ts:270:56)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
```

It did, but some of the tests failed and took 10 minutes to run. 2) and 3) are legit failures. There’s a bug in our code that compiles a Solidity code from string to bytecode. But for some reason, test 1) is missing a receipt. Also, each test took around 16 seconds to run. There was no documentation about any configuration options that could improve this situation.

### Conclusion

After looking at all the potential integration paths, it seem like ZKsync tooling needs significant improvement to ensure the security of initially EVM-based projects that want to deploy to ZKsync. If projects cannot run tests on ZKSync-based network, how can they know if their contracts work with ZKSync? This is extremely improtant since ZKSync is not 100% EVM compatible and has it's peculiarities. Furthermore, we couldn’t find any examples of EVM/Zksync side-by-side integration in projects already deployed there, such as Uniswap.
