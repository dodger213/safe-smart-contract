// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;
import {Enum} from "../libraries/Enum.sol";
import {SelfAuthorized} from "../common/SelfAuthorized.sol";
import {Executor} from "./Executor.sol";
import {GuardManager, Guard} from "./GuardManager.sol";
import {IModuleManager} from "../interfaces/IModuleManager.sol";

/**
 * @title Module Manager - A contract managing Safe modules
 * @notice Modules are extensions with unlimited access to a Safe that can be added to a Safe by its owners.
           ⚠️ WARNING: Modules are a security risk since they can execute arbitrary transactions, 
           so only trusted and audited modules should be added to a Safe. A malicious module can
           completely takeover a Safe.
 * @author Stefan George - @Georgi87
 * @author Richard Meissner - @rmeissner
 */
abstract contract ModuleManager is SelfAuthorized, Executor, GuardManager, IModuleManager {
    address internal constant SENTINEL_MODULES = address(0x1);

    mapping(address => address) internal modules;

    /**
     * @notice Setup function sets the initial storage of the contract.
     *         Optionally executes a delegate call to another contract to setup the modules.
     * @param to Optional destination address of call to execute.
     * @param data Optional data of call to execute.
     */
    function setupModules(address to, bytes memory data) internal {
        if (modules[SENTINEL_MODULES] != address(0)) revertWithError("GS100");
        modules[SENTINEL_MODULES] = SENTINEL_MODULES;
        if (to != address(0)) {
            if (!isContract(to)) revertWithError("GS002");
            // Setup has to complete successfully or transaction fails.
            if (!execute(to, 0, data, Enum.Operation.DelegateCall, type(uint256).max)) revertWithError("GS000");
        }
    }

    /**
     * @notice Runs pre-execution checks for module transactions if a guard is enabled.
     * @param to Target address of module transaction.
     * @param value Ether value of module transaction.
     * @param data Data payload of module transaction.
     * @param operation Operation type of module transaction.
     * @return guard Guard to be used for checking.
     * @return guardHash Hash returned from the guard tx check.
     */
    function preModuleExecution(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation
    ) internal returns (address guard, bytes32 guardHash) {
        guard = getGuard();

        // Only whitelisted modules are allowed.
        require(msg.sender != SENTINEL_MODULES && modules[msg.sender] != address(0), "GS104");

        if (guard != address(0)) {
            guardHash = Guard(guard).checkModuleTransaction(to, value, data, operation, msg.sender);
        }
    }

    /**
     * @notice Runs post-execution checks for module transactions if a guard is enabled.
     * @param guardHash Hash returned from the guard during pre execution check.
     * @param success Boolean flag indicating if the call succeeded.
     * @param guard Guard to be used for checking.
     * @dev Emits event based on module transaction success.
     */
    function postModuleExecution(address guard, bytes32 guardHash, bool success) internal {
        if (guard != address(0)) {
            Guard(guard).checkAfterExecution(guardHash, success);
        }
        if (success) emit ExecutionFromModuleSuccess(msg.sender);
        else emit ExecutionFromModuleFailure(msg.sender);
    }

    // @inheritdoc IModuleManager
    function enableModule(address module) public override authorized {
        // Module address cannot be null or sentinel.
        if (module == address(0) || module == SENTINEL_MODULES) revertWithError("GS101");
        // Module cannot be added twice.
        if (modules[module] != address(0)) revertWithError("GS102");
        modules[module] = modules[SENTINEL_MODULES];
        modules[SENTINEL_MODULES] = module;
        emit EnabledModule(module);
    }

    // @inheritdoc IModuleManager
    function disableModule(address prevModule, address module) public override authorized {
        // Validate module address and check that it corresponds to module index.
        if (module == address(0) || module == SENTINEL_MODULES) revertWithError("GS101");
        if (modules[prevModule] != module) revertWithError("GS103");
        modules[prevModule] = modules[module];
        modules[module] = address(0);
        emit DisabledModule(module);
    }

    // @inheritdoc IModuleManager
    function execTransactionFromModule(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation
    ) public virtual override returns (bool success) {
        (address guard, bytes32 guardHash) = preModuleExecution(to, value, data, operation);
        success = execute(to, value, data, operation, type(uint256).max);
        postModuleExecution(guard, guardHash, success);
    }

    // @inheritdoc IModuleManager
    function execTransactionFromModuleReturnData(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation
    ) public override returns (bool success, bytes memory returnData) {
        (address guard, bytes32 guardHash) = preModuleExecution(to, value, data, operation);
        success = execute(to, value, data, operation, type(uint256).max);
        /* solhint-disable no-inline-assembly */
        /// @solidity memory-safe-assembly
        assembly {
            // Load free memory location
            returnData := mload(0x40)
            // We allocate memory for the return data by setting the free memory location to
            // current free memory location + data size + 32 bytes for data size value
            mstore(0x40, add(returnData, add(returndatasize(), 0x20)))
            // Store the size
            mstore(returnData, returndatasize())
            // Store the data
            returndatacopy(add(returnData, 0x20), 0, returndatasize())
        }
        /* solhint-enable no-inline-assembly */
        postModuleExecution(guard, guardHash, success);
    }

    // @inheritdoc IModuleManager
    function isModuleEnabled(address module) public view override returns (bool) {
        return SENTINEL_MODULES != module && modules[module] != address(0);
    }

    // @inheritdoc IModuleManager
    function getModulesPaginated(address start, uint256 pageSize) external view override returns (address[] memory array, address next) {
        if (start != SENTINEL_MODULES && !isModuleEnabled(start)) revertWithError("GS105");
        if (pageSize == 0) revertWithError("GS106");
        // Init array with max page size
        array = new address[](pageSize);

        // Populate return array
        uint256 moduleCount = 0;
        next = modules[start];
        while (next != address(0) && next != SENTINEL_MODULES && moduleCount < pageSize) {
            array[moduleCount] = next;
            next = modules[next];
            moduleCount++;
        }

        /**
          Because of the argument validation, we can assume that the loop will always iterate over the valid module list values
          and the `next` variable will either be an enabled module or a sentinel address (signalling the end). 
          
          If we haven't reached the end inside the loop, we need to set the next pointer to the last element of the modules array
          because the `next` variable (which is a module by itself) acting as a pointer to the start of the next page is neither 
          included to the current page, nor will it be included in the next one if you pass it as a start.
        */
        if (next != SENTINEL_MODULES) {
            next = array[moduleCount - 1];
        }
        // Set correct size of returned array
        /* solhint-disable no-inline-assembly */
        /// @solidity memory-safe-assembly
        assembly {
            mstore(array, moduleCount)
        }
        /* solhint-enable no-inline-assembly */
    }

    /**
     * @notice Returns true if `account` is a contract.
     * @dev This function will return false if invoked during the constructor of a contract,
     *      as the code is not actually created until after the constructor finishes.
     * @param account The address being queried
     */
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        /* solhint-disable no-inline-assembly */
        /// @solidity memory-safe-assembly
        assembly {
            size := extcodesize(account)
        }
        /* solhint-enable no-inline-assembly */
        return size > 0;
    }
}
