/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  SafeProxyFactory,
  SafeProxyFactoryInterface,
} from "../../../contracts/proxies/SafeProxyFactory";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract SafeProxy",
        name: "proxy",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "singleton",
        type: "address",
      },
    ],
    name: "ProxyCreation",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_singleton",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "initializer",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "saltNonce",
        type: "uint256",
      },
    ],
    name: "createChainSpecificProxyWithNonce",
    outputs: [
      {
        internalType: "contract SafeProxy",
        name: "proxy",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_singleton",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "initializer",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "saltNonce",
        type: "uint256",
      },
      {
        internalType: "contract IProxyCreationCallback",
        name: "callback",
        type: "address",
      },
    ],
    name: "createProxyWithCallback",
    outputs: [
      {
        internalType: "contract SafeProxy",
        name: "proxy",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_singleton",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "initializer",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "saltNonce",
        type: "uint256",
      },
    ],
    name: "createProxyWithNonce",
    outputs: [
      {
        internalType: "contract SafeProxy",
        name: "proxy",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getChainId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxyCreationCode",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50611055806100206000396000f3fe60806040523480156200001157600080fd5b50600436106200005e5760003560e01c80631688f0b914620000635780633408e470146200009957806353e5d93514620000bb578063d18af54d14620000dd578063ec9e80bb1462000113575b600080fd5b6200008160048036038101906200007b919062000756565b62000149565b6040516200009091906200083c565b60405180910390f35b620000a3620001e7565b604051620000b291906200086a565b60405180910390f35b620000c5620001f4565b604051620000d4919062000910565b60405180910390f35b620000fb6004803603810190620000f5919062000979565b62000221565b6040516200010a91906200083c565b60405180910390f35b6200013160048036038101906200012b919062000756565b62000317565b6040516200014091906200083c565b60405180910390f35b6000808380519060200120836040516020016200016892919062000a5e565b6040516020818303038152906040528051906020012090506200018d858583620003c0565b91508173ffffffffffffffffffffffffffffffffffffffff167f4f51faf6c4561ff95f067657e43439f0f856d97c04d9ec9070a6199ad418e23586604051620001d7919062000a9f565b60405180910390a2509392505050565b6000804690508091505090565b606060405180602001620002089062000532565b6020820181038252601f19601f82011660405250905090565b60008083836040516020016200023992919062000b34565b6040516020818303038152906040528051906020012060001c90506200026186868362000149565b9150600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16146200030e578273ffffffffffffffffffffffffffffffffffffffff16631e52b518838888886040518563ffffffff1660e01b8152600401620002d9949392919062000b64565b600060405180830381600087803b158015620002f457600080fd5b505af115801562000309573d6000803e3d6000fd5b505050505b50949350505050565b6000808380519060200120836200032d620001e7565b604051602001620003419392919062000bb8565b60405160208183030381529060405280519060200120905062000366858583620003c0565b91508173ffffffffffffffffffffffffffffffffffffffff167f4f51faf6c4561ff95f067657e43439f0f856d97c04d9ec9070a6199ad418e23586604051620003b0919062000a9f565b60405180910390a2509392505050565b6000620003cd846200051f565b6200040f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620004069062000c5c565b60405180910390fd5b600060405180602001620004239062000532565b6020820181038252601f19601f820116604052508573ffffffffffffffffffffffffffffffffffffffff166040516020016200046192919062000cc0565b6040516020818303038152906040529050828151826020016000f59150600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603620004f0576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620004e79062000d3c565b60405180910390fd5b600084511115620005175760008060008651602088016000875af1036200051657600080fd5b5b509392505050565b600080823b905060008111915050919050565b6102c18062000d5f83390190565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620005818262000554565b9050919050565b620005938162000574565b81146200059f57600080fd5b50565b600081359050620005b38162000588565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6200060e82620005c3565b810181811067ffffffffffffffff8211171562000630576200062f620005d4565b5b80604052505050565b60006200064562000540565b905062000653828262000603565b919050565b600067ffffffffffffffff821115620006765762000675620005d4565b5b6200068182620005c3565b9050602081019050919050565b82818337600083830152505050565b6000620006b4620006ae8462000658565b62000639565b905082815260208101848484011115620006d357620006d2620005be565b5b620006e08482856200068e565b509392505050565b600082601f8301126200070057620006ff620005b9565b5b8135620007128482602086016200069d565b91505092915050565b6000819050919050565b62000730816200071b565b81146200073c57600080fd5b50565b600081359050620007508162000725565b92915050565b6000806000606084860312156200077257620007716200054a565b5b60006200078286828701620005a2565b935050602084013567ffffffffffffffff811115620007a657620007a56200054f565b5b620007b486828701620006e8565b9250506040620007c7868287016200073f565b9150509250925092565b6000819050919050565b6000620007fc620007f6620007f08462000554565b620007d1565b62000554565b9050919050565b60006200081082620007db565b9050919050565b6000620008248262000803565b9050919050565b620008368162000817565b82525050565b60006020820190506200085360008301846200082b565b92915050565b62000864816200071b565b82525050565b600060208201905062000881600083018462000859565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015620008c3578082015181840152602081019050620008a6565b60008484015250505050565b6000620008dc8262000887565b620008e8818562000892565b9350620008fa818560208601620008a3565b6200090581620005c3565b840191505092915050565b600060208201905081810360008301526200092c8184620008cf565b905092915050565b6000620009418262000574565b9050919050565b620009538162000934565b81146200095f57600080fd5b50565b600081359050620009738162000948565b92915050565b600080600080608085870312156200099657620009956200054a565b5b6000620009a687828801620005a2565b945050602085013567ffffffffffffffff811115620009ca57620009c96200054f565b5b620009d887828801620006e8565b9350506040620009eb878288016200073f565b9250506060620009fe8782880162000962565b91505092959194509250565b6000819050919050565b6000819050919050565b62000a3362000a2d8262000a0a565b62000a14565b82525050565b6000819050919050565b62000a5862000a52826200071b565b62000a39565b82525050565b600062000a6c828562000a1e565b60208201915062000a7e828462000a43565b6020820191508190509392505050565b62000a998162000574565b82525050565b600060208201905062000ab6600083018462000a8e565b92915050565b600062000ac982620007db565b9050919050565b600062000add8262000abc565b9050919050565b60008160601b9050919050565b600062000afe8262000ae4565b9050919050565b600062000b128262000af1565b9050919050565b62000b2e62000b288262000ad0565b62000b05565b82525050565b600062000b42828562000a43565b60208201915062000b54828462000b19565b6014820191508190509392505050565b600060808201905062000b7b60008301876200082b565b62000b8a602083018662000a8e565b818103604083015262000b9e8185620008cf565b905062000baf606083018462000859565b95945050505050565b600062000bc6828662000a1e565b60208201915062000bd8828562000a43565b60208201915062000bea828462000a43565b602082019150819050949350505050565b600082825260208201905092915050565b7f53696e676c65746f6e20636f6e7472616374206e6f74206465706c6f79656400600082015250565b600062000c44601f8362000bfb565b915062000c518262000c0c565b602082019050919050565b6000602082019050818103600083015262000c778162000c35565b9050919050565b600081905092915050565b600062000c968262000887565b62000ca2818562000c7e565b935062000cb4818560208601620008a3565b80840191505092915050565b600062000cce828562000c89565b915062000cdc828462000a43565b6020820191508190509392505050565b7f437265617465322063616c6c206661696c656400000000000000000000000000600082015250565b600062000d2460138362000bfb565b915062000d318262000cec565b602082019050919050565b6000602082019050818103600083015262000d578162000d15565b905091905056fe608060405234801561001057600080fd5b506040516102c13803806102c18339818101604052810190610032919061014a565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036100a1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610098906101fa565b60405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505061021a565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610117826100ec565b9050919050565b6101278161010c565b811461013257600080fd5b50565b6000815190506101448161011e565b92915050565b6000602082840312156101605761015f6100e7565b5b600061016e84828501610135565b91505092915050565b600082825260208201905092915050565b7f496e76616c69642073696e676c65746f6e20616464726573732070726f76696460008201527f6564000000000000000000000000000000000000000000000000000000000000602082015250565b60006101e4602283610177565b91506101ef82610188565b604082019050919050565b60006020820190508181036000830152610213816101d7565b9050919050565b6099806102286000396000f3fe60806040526000547fa619486e0000000000000000000000000000000000000000000000000000000060003503603f5780600c1b600c1c60005260206000f35b3660008037600080366000845af43d6000803e60008103605e573d6000fd5b3d6000f3fea26469706673582212202d4d73cf4da9b548ffe6a3333bfee82fca296154330d4d47e3cb664cba3fcf8f64736f6c63430008180033a2646970667358221220cdf582cadd779283fc8742263f88e9a1d95e98d97695f3974061efc7bc761bf664736f6c63430008180033";

type SafeProxyFactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SafeProxyFactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SafeProxyFactory__factory extends ContractFactory {
  constructor(...args: SafeProxyFactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      SafeProxyFactory & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): SafeProxyFactory__factory {
    return super.connect(runner) as SafeProxyFactory__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SafeProxyFactoryInterface {
    return new Interface(_abi) as SafeProxyFactoryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): SafeProxyFactory {
    return new Contract(address, _abi, runner) as unknown as SafeProxyFactory;
  }
}
