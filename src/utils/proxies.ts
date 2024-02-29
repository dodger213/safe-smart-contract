import { ethers, BigNumberish } from "ethers";
import hre from "hardhat";
import * as zk from "zksync-ethers";
import { SafeProxyFactory } from "../../typechain-types";

export const calculateProxyAddress = async (factory: SafeProxyFactory, singleton: string, inititalizer: string, nonce: number | string) => {
    const salt = ethers.solidityPackedKeccak256(["bytes32", "uint256"], [ethers.solidityPackedKeccak256(["bytes"], [inititalizer]), nonce]);
    const factoryAddress = await factory.getAddress();

    if (hre.network.zksync) {
        const proxyCreationCode = (await hre.artifacts.readArtifact("SafeProxy")).deployedBytecode;
        const bytecodehash = zk.utils.hashBytecode(proxyCreationCode);
        const input = new ethers.AbiCoder().encode(["address"], [singleton]);
        return zk.utils.create2Address(factoryAddress, bytecodehash, salt, input);
    }

    const deploymentCode = ethers.solidityPacked(["bytes", "uint256"], [await factory.proxyCreationCode(), singleton]);
    return ethers.getCreate2Address(factoryAddress, salt, ethers.keccak256(deploymentCode));
};

export const calculateProxyAddressWithCallback = async (
    factory: SafeProxyFactory,
    singleton: string,
    inititalizer: string,
    nonce: number | string,
    callback: string,
) => {
    const saltNonceWithCallback = ethers.solidityPackedKeccak256(["uint256", "address"], [nonce, callback]);
    return calculateProxyAddress(factory, singleton, inititalizer, saltNonceWithCallback);
};

export const calculateChainSpecificProxyAddress = async (
    factory: SafeProxyFactory,
    singleton: string,
    inititalizer: string,
    nonce: number | string,
    chainId: BigNumberish,
) => {
    const salt = ethers.solidityPackedKeccak256(
        ["bytes32", "uint256", "uint256"],
        [ethers.solidityPackedKeccak256(["bytes"], [inititalizer]), nonce, chainId],
    );
    const factoryAddress = await factory.getAddress();

    if (hre.network.zksync) {
        const proxyCreationCode = (await hre.artifacts.readArtifact("SafeProxy")).deployedBytecode;
        const bytecodehash = zk.utils.hashBytecode(proxyCreationCode);
        const input = new ethers.AbiCoder().encode(["address"], [singleton]);
        return zk.utils.create2Address(factoryAddress, bytecodehash, salt, input);
    }

    const deploymentCode = ethers.solidityPacked(["bytes", "uint256"], [await factory.proxyCreationCode(), singleton]);
    return ethers.getCreate2Address(factoryAddress, salt, ethers.keccak256(deploymentCode));
};
