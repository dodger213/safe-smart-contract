import hre, { deployments } from "hardhat";
import { Contract, Signer, ethers } from "ethers";
import { AddressZero } from "@ethersproject/constants";
import solc from "solc";
import * as zk from "zksync-ethers";
import { logGas } from "../../src/utils/execution";
import { safeContractUnderTest } from "./config";
import { zkCompile } from "./zkSync";
import { getRandomIntAsString } from "./numbers";
import { Safe, SafeL2 } from "../../typechain-types";

export const defaultTokenCallbackHandlerDeployment = async () => {
    return deployments.get("TokenCallbackHandler");
};

export const defaultTokenCallbackHandlerContract = async () => {
    return getContractFactoryByName("TokenCallbackHandler");
};

export const compatFallbackHandlerDeployment = async () => {
    return deployments.get("CompatibilityFallbackHandler");
};

export const compatFallbackHandlerContract = async () => {
    return getContractFactoryByName("CompatibilityFallbackHandler");
};

export const getSafeSingleton = async () => {
    const SafeDeployment = await deployments.get(safeContractUnderTest());
    const Safe = await hre.ethers.getContractAt(safeContractUnderTest(), SafeDeployment.address);
    return Safe;
};

export const getSafeSingletonContract = async () => {
    const safeSingleton = await getContractFactoryByName("Safe");

    return safeSingleton;
};

export const getSafeL2SingletonContract = async () => {
    const safeSingleton = await getContractFactoryByName("SafeL2");

    return safeSingleton;
};

export const getSafeSingletonContractFromEnvVariable = async () => {
    if (safeContractUnderTest() === "SafeL2") {
        return await getSafeL2SingletonContract();
    }

    return await getSafeSingletonContract();
};

export const getSafeSingletonAt = async (address: string) => {
    const safe = await hre.ethers.getContractAt(safeContractUnderTest(), address);
    return safe as unknown as Safe | SafeL2;
};

export const getFactoryContract = async () => {
    const factory = await getContractFactoryByName("SafeProxyFactory");

    return factory;
};

export const getFactory = async () => {
    const FactoryDeployment = await deployments.get("SafeProxyFactory");
    const Factory = await hre.ethers.getContractAt("SafeProxyFactory", FactoryDeployment.address);
    return Factory;
};

export const getFactoryAt = async (address: string) => {
    const Factory = await hre.ethers.getContractAt("SafeProxyFactory", address);
    return Factory;
};

export const getSimulateTxAccessor = async () => {
    const SimulateTxAccessorDeployment = await deployments.get("SimulateTxAccessor");
    const SimulateTxAccessor = await hre.ethers.getContractAt("SimulateTxAccessor", SimulateTxAccessorDeployment.address);
    return SimulateTxAccessor;
};

export const getMultiSend = async () => {
    const MultiSendDeployment = await deployments.get("MultiSend");
    const MultiSend = await hre.ethers.getContractAt("MultiSend", MultiSendDeployment.address);
    return MultiSend;
};

export const getMultiSendCallOnly = async () => {
    const MultiSendDeployment = await deployments.get("MultiSendCallOnly");
    const MultiSend = await hre.ethers.getContractAt("MultiSendCallOnly", MultiSendDeployment.address);
    return MultiSend;
};

export const getCreateCall = async () => {
    const CreateCallDeployment = await deployments.get("CreateCall");
    const CreateCall = await hre.ethers.getContractAt("CreateCall", CreateCallDeployment.address);
    return CreateCall;
};

export const migrationContract = async () => {
    return await getContractFactoryByName("Migration");
};

export const migrationContractTo150 = async () => {
    return await hre.ethers.getContractFactory("Safe150Migration");
};

export const migrationContractFrom130To141 = async () => {
    return await hre.ethers.getContractFactory("Safe130To141Migration");
};

export const getMock = async () => {
    const contractFactory = await getContractFactoryByName("MockContract");
    const contract = await contractFactory.deploy();

    return contract;
};

export const getContractFactoryByName = async (contractName: string): Promise<ethers.ContractFactory | zk.ContractFactory> => {
    if (hre.network.zksync) {
        return hre.zksyncEthers.getContractFactory(contractName);
    } else {
        return hre.ethers.getContractFactory(contractName);
    }
};

export const getSafeTemplate = async (saltNumber: string = getRandomIntAsString()) => {
    const singleton = await getSafeSingleton();
    const singletonAddress = await singleton.getAddress();
    const factory = await getFactory();
    const template = await factory.createProxyWithNonce.staticCall(singletonAddress, "0x", saltNumber);
    await factory.createProxyWithNonce(singletonAddress, "0x", saltNumber).then((tx: any) => tx.wait());
    const Safe = await getSafeSingletonContractFromEnvVariable();
    return Safe.attach(template) as Safe | SafeL2;
};

export const getSafeWithOwners = async (
    owners: string[],
    threshold?: number,
    fallbackHandler?: string,
    logGasUsage?: boolean,
    saltNumber: string = getRandomIntAsString(),
) => {
    const template = await getSafeTemplate(saltNumber);
    await logGas(
        `Setup Safe with ${owners.length} owner(s)${fallbackHandler && fallbackHandler !== AddressZero ? " and fallback handler" : ""}`,
        template.setup(owners, threshold || owners.length, AddressZero, "0x", fallbackHandler || AddressZero, AddressZero, 0, AddressZero),
        !logGasUsage,
    );
    return template;
};

export const getSafeWithSingleton = async (
    singleton: Safe | SafeL2,
    owners: string[],
    threshold?: number,
    fallbackHandler?: string,
    saltNumber: string = getRandomIntAsString(),
) => {
    const factory = await getFactory();
    const singletonAddress = await singleton.getAddress();
    const template = await factory.createProxyWithNonce.staticCall(singletonAddress, "0x", saltNumber);
    await factory.createProxyWithNonce(singletonAddress, "0x", saltNumber).then((tx: any) => tx.wait());
    const safeProxy = singleton.attach(template) as Safe | SafeL2;
    await safeProxy.setup(
        owners,
        threshold || owners.length,
        AddressZero,
        "0x",
        fallbackHandler || AddressZero,
        AddressZero,
        0,
        AddressZero,
    );

    return safeProxy;
};

export const getTokenCallbackHandler = async (address?: string) => {
    const tokenCallbackHandler = await hre.ethers.getContractAt(
        "TokenCallbackHandler",
        address || (await defaultTokenCallbackHandlerDeployment()).address,
    );

    return tokenCallbackHandler;
};

export const getCompatFallbackHandler = async (address?: string) => {
    const fallbackHandler = await hre.ethers.getContractAt(
        "CompatibilityFallbackHandler",
        address || (await compatFallbackHandlerDeployment()).address,
    );

    return fallbackHandler;
};

export const getSafeProxyRuntimeCode = async () => {
    const proxyArtifact = await hre.artifacts.readArtifact("SafeProxy");

    return proxyArtifact.deployedBytecode;
};

export const getDelegateCaller = async () => {
    const DelegateCaller = await getContractFactoryByName("DelegateCaller");
    return await DelegateCaller.deploy();
};

export const compile = async (source: string) => {
    const input = JSON.stringify({
        language: "Solidity",
        settings: {
            outputSelection: {
                "*": {
                    "*": ["abi", "evm.bytecode"],
                },
            },
        },
        sources: {
            "tmp.sol": {
                content: source,
            },
        },
    });
    const solcData = await solc.compile(input);
    const output = JSON.parse(solcData);
    if (!output["contracts"]) {
        console.log(output);
        throw Error("Could not compile contract");
    }
    const fileOutput = output["contracts"]["tmp.sol"];
    const contractOutput = fileOutput[Object.keys(fileOutput)[0]];
    const abi = contractOutput["abi"];
    const data = "0x" + contractOutput["evm"]["bytecode"]["object"];
    return {
        data: data,
        interface: abi,
    };
};

export const deployContract = async (deployer: Signer, source: string): Promise<ethers.BaseContract> => {
    if (!hre.network.zksync) {
        const output = await compile(source);
        const transaction = await deployer.sendTransaction({ data: output.data, gasLimit: 6000000 });
        const receipt = await transaction.wait();

        if (!receipt?.contractAddress) {
            throw Error("Could not deploy contract");
        }

        return new Contract(receipt.contractAddress, output.interface, deployer);
    } else {
        const output = await zkCompile(hre, source);
        const signers = await getWallets();
        const factory = new zk.ContractFactory(output.abi, output.data, signers[0] as zk.Wallet, "create");
        // Encode and send the deploy transaction providing factory dependencies.
        const contract = await factory.deploy();

        return contract;
    }
};

export const getWallets = async () => {
    if (hre.network.name === "hardhat") return hre.ethers.getSigners();
    if (hre.network.zksync) return hre.zksyncEthers.getWallets();

    throw new Error("You can get wallets only on Hardhat or ZkSyncLocal networks!");
};
