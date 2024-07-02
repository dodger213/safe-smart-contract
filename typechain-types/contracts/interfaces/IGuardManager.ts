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
} from "../../common";

export interface IGuardManagerInterface extends Interface {
  getFunction(nameOrSignature: "setGuard"): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "ChangedGuard"): EventFragment;

  encodeFunctionData(
    functionFragment: "setGuard",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(functionFragment: "setGuard", data: BytesLike): Result;
}

export namespace ChangedGuardEvent {
  export type InputTuple = [guard: AddressLike];
  export type OutputTuple = [guard: string];
  export interface OutputObject {
    guard: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface IGuardManager extends BaseContract {
  connect(runner?: ContractRunner | null): IGuardManager;
  waitForDeployment(): Promise<this>;

  interface: IGuardManagerInterface;

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

  setGuard: TypedContractMethod<[guard: AddressLike], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "setGuard"
  ): TypedContractMethod<[guard: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "ChangedGuard"
  ): TypedContractEvent<
    ChangedGuardEvent.InputTuple,
    ChangedGuardEvent.OutputTuple,
    ChangedGuardEvent.OutputObject
  >;

  filters: {
    "ChangedGuard(address)": TypedContractEvent<
      ChangedGuardEvent.InputTuple,
      ChangedGuardEvent.OutputTuple,
      ChangedGuardEvent.OutputObject
    >;
    ChangedGuard: TypedContractEvent<
      ChangedGuardEvent.InputTuple,
      ChangedGuardEvent.OutputTuple,
      ChangedGuardEvent.OutputObject
    >;
  };
}
