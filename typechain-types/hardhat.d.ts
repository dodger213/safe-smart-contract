/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "MockContract",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockContract__factory>;
    getContractFactory(
      name: "MockInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockInterface__factory>;
    getContractFactory(
      name: "SimulateTxAccessor",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SimulateTxAccessor__factory>;
    getContractFactory(
      name: "FallbackManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FallbackManager__factory>;
    getContractFactory(
      name: "Guard",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Guard__factory>;
    getContractFactory(
      name: "GuardManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.GuardManager__factory>;
    getContractFactory(
      name: "ModuleManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ModuleManager__factory>;
    getContractFactory(
      name: "OwnerManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OwnerManager__factory>;
    getContractFactory(
      name: "EtherPaymentFallback",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.EtherPaymentFallback__factory>;
    getContractFactory(
      name: "StorageAccessible",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.StorageAccessible__factory>;
    getContractFactory(
      name: "DebugTransactionGuard",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DebugTransactionGuard__factory>;
    getContractFactory(
      name: "DelegateCallTransactionGuard",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DelegateCallTransactionGuard__factory>;
    getContractFactory(
      name: "ReentrancyTransactionGuard",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ReentrancyTransactionGuard__factory>;
    getContractFactory(
      name: "Migration",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Migration__factory>;
    getContractFactory(
      name: "GnosisSafe",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.GnosisSafe__factory>;
    getContractFactory(
      name: "GnosisSafeL2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.GnosisSafeL2__factory>;
    getContractFactory(
      name: "CompatibilityFallbackHandler",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CompatibilityFallbackHandler__factory>;
    getContractFactory(
      name: "DefaultCallbackHandler",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DefaultCallbackHandler__factory>;
    getContractFactory(
      name: "ERC1155TokenReceiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155TokenReceiver__factory>;
    getContractFactory(
      name: "ERC721TokenReceiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721TokenReceiver__factory>;
    getContractFactory(
      name: "ERC777TokensRecipient",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC777TokensRecipient__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "ISignatureValidator",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISignatureValidator__factory>;
    getContractFactory(
      name: "ViewStorageAccessible",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ViewStorageAccessible__factory>;
    getContractFactory(
      name: "CreateCall",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CreateCall__factory>;
    getContractFactory(
      name: "MultiSend",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MultiSend__factory>;
    getContractFactory(
      name: "MultiSendCallOnly",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MultiSendCallOnly__factory>;
    getContractFactory(
      name: "SignMessageLib",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SignMessageLib__factory>;
    getContractFactory(
      name: "GnosisSafeProxy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.GnosisSafeProxy__factory>;
    getContractFactory(
      name: "IProxy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IProxy__factory>;
    getContractFactory(
      name: "GnosisSafeProxyFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.GnosisSafeProxyFactory__factory>;
    getContractFactory(
      name: "IProxyCreationCallback",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IProxyCreationCallback__factory>;
    getContractFactory(
      name: "ERC1155Token",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155Token__factory>;
    getContractFactory(
      name: "ERC20Token",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Token__factory>;
    getContractFactory(
      name: "TestHandler",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestHandler__factory>;
    getContractFactory(
      name: "Token",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Token__factory>;

    getContractAt(
      name: "ERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "MockContract",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.MockContract>;
    getContractAt(
      name: "MockInterface",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.MockInterface>;
    getContractAt(
      name: "SimulateTxAccessor",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.SimulateTxAccessor>;
    getContractAt(
      name: "FallbackManager",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FallbackManager>;
    getContractAt(
      name: "Guard",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Guard>;
    getContractAt(
      name: "GuardManager",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.GuardManager>;
    getContractAt(
      name: "ModuleManager",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ModuleManager>;
    getContractAt(
      name: "OwnerManager",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.OwnerManager>;
    getContractAt(
      name: "EtherPaymentFallback",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.EtherPaymentFallback>;
    getContractAt(
      name: "StorageAccessible",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.StorageAccessible>;
    getContractAt(
      name: "DebugTransactionGuard",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.DebugTransactionGuard>;
    getContractAt(
      name: "DelegateCallTransactionGuard",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.DelegateCallTransactionGuard>;
    getContractAt(
      name: "ReentrancyTransactionGuard",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ReentrancyTransactionGuard>;
    getContractAt(
      name: "Migration",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Migration>;
    getContractAt(
      name: "GnosisSafe",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.GnosisSafe>;
    getContractAt(
      name: "GnosisSafeL2",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.GnosisSafeL2>;
    getContractAt(
      name: "CompatibilityFallbackHandler",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.CompatibilityFallbackHandler>;
    getContractAt(
      name: "DefaultCallbackHandler",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.DefaultCallbackHandler>;
    getContractAt(
      name: "ERC1155TokenReceiver",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155TokenReceiver>;
    getContractAt(
      name: "ERC721TokenReceiver",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721TokenReceiver>;
    getContractAt(
      name: "ERC777TokensRecipient",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC777TokensRecipient>;
    getContractAt(
      name: "IERC165",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "ISignatureValidator",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ISignatureValidator>;
    getContractAt(
      name: "ViewStorageAccessible",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ViewStorageAccessible>;
    getContractAt(
      name: "CreateCall",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.CreateCall>;
    getContractAt(
      name: "MultiSend",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.MultiSend>;
    getContractAt(
      name: "MultiSendCallOnly",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.MultiSendCallOnly>;
    getContractAt(
      name: "SignMessageLib",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.SignMessageLib>;
    getContractAt(
      name: "GnosisSafeProxy",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.GnosisSafeProxy>;
    getContractAt(
      name: "IProxy",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IProxy>;
    getContractAt(
      name: "GnosisSafeProxyFactory",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.GnosisSafeProxyFactory>;
    getContractAt(
      name: "IProxyCreationCallback",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IProxyCreationCallback>;
    getContractAt(
      name: "ERC1155Token",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155Token>;
    getContractAt(
      name: "ERC20Token",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Token>;
    getContractAt(
      name: "TestHandler",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.TestHandler>;
    getContractAt(
      name: "Token",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Token>;

    deployContract(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20>;
    deployContract(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "MockContract",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.MockContract>;
    deployContract(
      name: "MockInterface",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.MockInterface>;
    deployContract(
      name: "SimulateTxAccessor",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SimulateTxAccessor>;
    deployContract(
      name: "FallbackManager",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FallbackManager>;
    deployContract(
      name: "Guard",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Guard>;
    deployContract(
      name: "GuardManager",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GuardManager>;
    deployContract(
      name: "ModuleManager",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ModuleManager>;
    deployContract(
      name: "OwnerManager",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OwnerManager>;
    deployContract(
      name: "EtherPaymentFallback",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.EtherPaymentFallback>;
    deployContract(
      name: "StorageAccessible",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.StorageAccessible>;
    deployContract(
      name: "DebugTransactionGuard",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DebugTransactionGuard>;
    deployContract(
      name: "DelegateCallTransactionGuard",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DelegateCallTransactionGuard>;
    deployContract(
      name: "ReentrancyTransactionGuard",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ReentrancyTransactionGuard>;
    deployContract(
      name: "Migration",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Migration>;
    deployContract(
      name: "GnosisSafe",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GnosisSafe>;
    deployContract(
      name: "GnosisSafeL2",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GnosisSafeL2>;
    deployContract(
      name: "CompatibilityFallbackHandler",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.CompatibilityFallbackHandler>;
    deployContract(
      name: "DefaultCallbackHandler",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DefaultCallbackHandler>;
    deployContract(
      name: "ERC1155TokenReceiver",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC1155TokenReceiver>;
    deployContract(
      name: "ERC721TokenReceiver",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC721TokenReceiver>;
    deployContract(
      name: "ERC777TokensRecipient",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC777TokensRecipient>;
    deployContract(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165>;
    deployContract(
      name: "ISignatureValidator",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ISignatureValidator>;
    deployContract(
      name: "ViewStorageAccessible",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ViewStorageAccessible>;
    deployContract(
      name: "CreateCall",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.CreateCall>;
    deployContract(
      name: "MultiSend",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.MultiSend>;
    deployContract(
      name: "MultiSendCallOnly",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.MultiSendCallOnly>;
    deployContract(
      name: "SignMessageLib",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SignMessageLib>;
    deployContract(
      name: "GnosisSafeProxy",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GnosisSafeProxy>;
    deployContract(
      name: "IProxy",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IProxy>;
    deployContract(
      name: "GnosisSafeProxyFactory",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GnosisSafeProxyFactory>;
    deployContract(
      name: "IProxyCreationCallback",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IProxyCreationCallback>;
    deployContract(
      name: "ERC1155Token",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC1155Token>;
    deployContract(
      name: "ERC20Token",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20Token>;
    deployContract(
      name: "TestHandler",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TestHandler>;
    deployContract(
      name: "Token",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Token>;

    deployContract(
      name: "ERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20>;
    deployContract(
      name: "IERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "MockContract",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.MockContract>;
    deployContract(
      name: "MockInterface",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.MockInterface>;
    deployContract(
      name: "SimulateTxAccessor",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SimulateTxAccessor>;
    deployContract(
      name: "FallbackManager",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FallbackManager>;
    deployContract(
      name: "Guard",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Guard>;
    deployContract(
      name: "GuardManager",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GuardManager>;
    deployContract(
      name: "ModuleManager",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ModuleManager>;
    deployContract(
      name: "OwnerManager",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OwnerManager>;
    deployContract(
      name: "EtherPaymentFallback",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.EtherPaymentFallback>;
    deployContract(
      name: "StorageAccessible",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.StorageAccessible>;
    deployContract(
      name: "DebugTransactionGuard",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DebugTransactionGuard>;
    deployContract(
      name: "DelegateCallTransactionGuard",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DelegateCallTransactionGuard>;
    deployContract(
      name: "ReentrancyTransactionGuard",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ReentrancyTransactionGuard>;
    deployContract(
      name: "Migration",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Migration>;
    deployContract(
      name: "GnosisSafe",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GnosisSafe>;
    deployContract(
      name: "GnosisSafeL2",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GnosisSafeL2>;
    deployContract(
      name: "CompatibilityFallbackHandler",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.CompatibilityFallbackHandler>;
    deployContract(
      name: "DefaultCallbackHandler",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DefaultCallbackHandler>;
    deployContract(
      name: "ERC1155TokenReceiver",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC1155TokenReceiver>;
    deployContract(
      name: "ERC721TokenReceiver",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC721TokenReceiver>;
    deployContract(
      name: "ERC777TokensRecipient",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC777TokensRecipient>;
    deployContract(
      name: "IERC165",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165>;
    deployContract(
      name: "ISignatureValidator",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ISignatureValidator>;
    deployContract(
      name: "ViewStorageAccessible",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ViewStorageAccessible>;
    deployContract(
      name: "CreateCall",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.CreateCall>;
    deployContract(
      name: "MultiSend",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.MultiSend>;
    deployContract(
      name: "MultiSendCallOnly",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.MultiSendCallOnly>;
    deployContract(
      name: "SignMessageLib",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SignMessageLib>;
    deployContract(
      name: "GnosisSafeProxy",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GnosisSafeProxy>;
    deployContract(
      name: "IProxy",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IProxy>;
    deployContract(
      name: "GnosisSafeProxyFactory",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GnosisSafeProxyFactory>;
    deployContract(
      name: "IProxyCreationCallback",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IProxyCreationCallback>;
    deployContract(
      name: "ERC1155Token",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC1155Token>;
    deployContract(
      name: "ERC20Token",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20Token>;
    deployContract(
      name: "TestHandler",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TestHandler>;
    deployContract(
      name: "Token",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Token>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}