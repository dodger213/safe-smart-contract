// SPDX-License-Identifier: LGPL-3.0-only
/* solhint-disable one-contract-per-file */
pragma solidity >=0.7.0 <0.9.0;

import {Enum} from "../common/Enum.sol";
import {SelfAuthorized} from "../common/SelfAuthorized.sol";
import {IERC165} from "../interfaces/IERC165.sol";

/// @title Guard Interface
interface Guard is IERC165 {
    /// @notice Checks the transaction details.
    /// @dev The function needs to implement transaction validation logic.
    /// @param to The address to which the transaction is intended.
    /// @param value The value of the transaction in Wei.
    /// @param data The transaction data.
    /// @param operation The type of operation of the transaction.
    /// @param safeTxGas Gas used for the transaction.
    /// @param baseGas The base gas for the transaction.
    /// @param gasPrice The price of gas in Wei for the transaction.
    /// @param gasToken The token used to pay for gas.
    /// @param refundReceiver The address which should receive the refund.
    /// @param signatures The signatures of the transaction.
    /// @param msgSender The address of the message sender.
    function checkTransaction(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver,
        bytes memory signatures,
        address msgSender
    ) external;

    /// @notice Checks the module transaction details.
    /// @dev The function needs to implement module transaction validation logic.
    /// @param to The address to which the transaction is intended.
    /// @param value The value of the transaction in Wei.
    /// @param data The transaction data.
    /// @param operation The type of operation of the transaction.
    /// @param module The module involved in the transaction.
    /// @return moduleTxHash The hash of the module transaction.
    function checkModuleTransaction(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        address module
    ) external returns (bytes32 moduleTxHash);

    /// @notice Checks after execution of transaction.
    /// @dev The function needs to implement a check after the execution of the transaction.
    /// @param hash The hash of the transaction.
    /// @param success The status of the transaction execution.
    function checkAfterExecution(bytes32 hash, bool success) external;
}

abstract contract BaseGuard is Guard {
    function supportsInterface(bytes4 interfaceId) external view virtual override returns (bool) {
        return
            interfaceId == type(Guard).interfaceId || // 0x945b8148
            interfaceId == type(IERC165).interfaceId; // 0x01ffc9a7
    }
}

/**
 * @title Guard Manager - A contract managing transaction guards which perform pre and post-checks on Safe transactions.
 * @author Richard Meissner - @rmeissner
 */
abstract contract GuardManager is SelfAuthorized {
    event ChangedGuard(address indexed guard);

    // keccak256("guard_manager.guard.address")
    bytes32 internal constant GUARD_STORAGE_SLOT = 0x4a204f620c8c5ccdca3fd54d003badd85ba500436a431f0cbda4f558c93c34c8;

    /**
     * @dev Set a guard that checks transactions before execution
     *      This can only be done via a Safe transaction.
     *      ⚠️ IMPORTANT: Since a guard has full power to block Safe transaction execution,
     *        a broken guard can cause a denial of service for the Safe. Make sure to carefully
     *        audit the guard code and design recovery mechanisms.
     * @notice Set Transaction Guard `guard` for the Safe. Make sure you trust the guard.
     * @param guard The address of the guard to be used or the 0 address to disable the guard
     */
    function setGuard(address guard) external authorized {
        if (guard != address(0)) {
            require(Guard(guard).supportsInterface(type(Guard).interfaceId), "GS300");
        }
        bytes32 slot = GUARD_STORAGE_SLOT;
        /* solhint-disable no-inline-assembly */
        /// @solidity memory-safe-assembly
        assembly {
            sstore(slot, guard)
        }
        /* solhint-enable no-inline-assembly */
        emit ChangedGuard(guard);
    }

    /**
     * @dev Internal method to retrieve the current guard
     *      We do not have a public method because we're short on bytecode size limit,
     *      to retrieve the guard address, one can use `getStorageAt` from `StorageAccessible` contract
     *      with the slot `GUARD_STORAGE_SLOT`
     * @return guard The address of the guard
     */
    function getGuard() internal view returns (address guard) {
        bytes32 slot = GUARD_STORAGE_SLOT;
        /* solhint-disable no-inline-assembly */
        /// @solidity memory-safe-assembly
        assembly {
            guard := sload(slot)
        }
        /* solhint-enable no-inline-assembly */
    }
}
