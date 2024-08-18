/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export interface Safe150MigrationInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "SAFE_150_FALLBACK_HANDLER"
      | "SAFE_150_SINGLETON"
      | "SAFE_150_SINGLETON_L2"
      | "migrateL2Singleton"
      | "migrateL2WithFallbackHandler"
      | "migrateL2WithSetGuard"
      | "migrateL2WithSetGuardAndFallbackHandler"
      | "migrateSingleton"
      | "migrateWithFallbackHandler"
      | "migrateWithSetGuard"
      | "migrateWithSetGuardAndFallbackHandler"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "ChangedMasterCopy"): EventFragment;

  encodeFunctionData(
    functionFragment: "SAFE_150_FALLBACK_HANDLER",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "SAFE_150_SINGLETON",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "SAFE_150_SINGLETON_L2",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "migrateL2Singleton",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "migrateL2WithFallbackHandler",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "migrateL2WithSetGuard",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "migrateL2WithSetGuardAndFallbackHandler",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "migrateSingleton",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "migrateWithFallbackHandler",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "migrateWithSetGuard",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "migrateWithSetGuardAndFallbackHandler",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "SAFE_150_FALLBACK_HANDLER",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "SAFE_150_SINGLETON",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "SAFE_150_SINGLETON_L2",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "migrateL2Singleton",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "migrateL2WithFallbackHandler",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "migrateL2WithSetGuard",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "migrateL2WithSetGuardAndFallbackHandler",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "migrateSingleton",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "migrateWithFallbackHandler",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "migrateWithSetGuard",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "migrateWithSetGuardAndFallbackHandler",
    data: BytesLike
  ): Result;
}

export namespace ChangedMasterCopyEvent {
  export type InputTuple = [singleton: AddressLike];
  export type OutputTuple = [singleton: string];
  export interface OutputObject {
    singleton: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface Safe150Migration extends BaseContract {
  connect(runner?: ContractRunner | null): Safe150Migration;
  waitForDeployment(): Promise<this>;

  interface: Safe150MigrationInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  SAFE_150_FALLBACK_HANDLER: TypedContractMethod<[], [string], "view">;

  SAFE_150_SINGLETON: TypedContractMethod<[], [string], "view">;

  SAFE_150_SINGLETON_L2: TypedContractMethod<[], [string], "view">;

  migrateL2Singleton: TypedContractMethod<[], [void], "nonpayable">;

  migrateL2WithFallbackHandler: TypedContractMethod<[], [void], "nonpayable">;

  migrateL2WithSetGuard: TypedContractMethod<
    [guard: AddressLike],
    [void],
    "nonpayable"
  >;

  migrateL2WithSetGuardAndFallbackHandler: TypedContractMethod<
    [guard: AddressLike],
    [void],
    "nonpayable"
  >;

  migrateSingleton: TypedContractMethod<[], [void], "nonpayable">;

  migrateWithFallbackHandler: TypedContractMethod<[], [void], "nonpayable">;

  migrateWithSetGuard: TypedContractMethod<
    [guard: AddressLike],
    [void],
    "nonpayable"
  >;

  migrateWithSetGuardAndFallbackHandler: TypedContractMethod<
    [guard: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "SAFE_150_FALLBACK_HANDLER"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "SAFE_150_SINGLETON"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "SAFE_150_SINGLETON_L2"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "migrateL2Singleton"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "migrateL2WithFallbackHandler"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "migrateL2WithSetGuard"
  ): TypedContractMethod<[guard: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "migrateL2WithSetGuardAndFallbackHandler"
  ): TypedContractMethod<[guard: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "migrateSingleton"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "migrateWithFallbackHandler"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "migrateWithSetGuard"
  ): TypedContractMethod<[guard: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "migrateWithSetGuardAndFallbackHandler"
  ): TypedContractMethod<[guard: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "ChangedMasterCopy"
  ): TypedContractEvent<
    ChangedMasterCopyEvent.InputTuple,
    ChangedMasterCopyEvent.OutputTuple,
    ChangedMasterCopyEvent.OutputObject
  >;

  filters: {
    "ChangedMasterCopy(address)": TypedContractEvent<
      ChangedMasterCopyEvent.InputTuple,
      ChangedMasterCopyEvent.OutputTuple,
      ChangedMasterCopyEvent.OutputObject
    >;
    ChangedMasterCopy: TypedContractEvent<
      ChangedMasterCopyEvent.InputTuple,
      ChangedMasterCopyEvent.OutputTuple,
      ChangedMasterCopyEvent.OutputObject
    >;
  };
}
