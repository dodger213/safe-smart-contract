/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export interface ISafeInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "VERSION"
      | "getOwners"
      | "getThreshold"
      | "setFallbackHandler"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "VERSION", values?: undefined): string;
  encodeFunctionData(functionFragment: "getOwners", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getThreshold",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setFallbackHandler",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(functionFragment: "VERSION", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getOwners", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getThreshold",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setFallbackHandler",
    data: BytesLike
  ): Result;
}

export interface ISafe extends BaseContract {
  connect(runner?: ContractRunner | null): ISafe;
  waitForDeployment(): Promise<this>;

  interface: ISafeInterface;

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

  VERSION: TypedContractMethod<[], [string], "view">;

  getOwners: TypedContractMethod<[], [string[]], "view">;

  getThreshold: TypedContractMethod<[], [bigint], "view">;

  setFallbackHandler: TypedContractMethod<
    [handler: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "VERSION"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getOwners"
  ): TypedContractMethod<[], [string[]], "view">;
  getFunction(
    nameOrSignature: "getThreshold"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "setFallbackHandler"
  ): TypedContractMethod<[handler: AddressLike], [void], "nonpayable">;

  filters: {};
}
