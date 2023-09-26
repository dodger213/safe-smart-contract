// SPDX-License-Identifier: LGPL-3.0-only
/* solhint-disable one-contract-per-file */
pragma solidity >=0.7.0 <0.9.0;

import {Enum} from "../../common/Enum.sol";
import {BaseGuard} from "../../base/GuardManager.sol";

interface ISafe {
    function getOwners() external view returns (address[] memory);
}

/**
 * @title OnlyOwnersGuard - Only allows owners to execute transactions.
 * @author Richard Meissner - @rmeissner
 */
contract OnlyOwnersGuard is BaseGuard {
    ISafe public safe;

    constructor() {}

    // solhint-disable-next-line payable-fallback
    fallback() external {
        // We don't revert on fallback to avoid issues in case of a Safe upgrade
        // E.g. The expected check method might change and then the Safe would be locked.
    }

    /**
     * @notice Called by the Safe contract before a transaction is executed.
     * @dev Reverts if the transaction is not executed by an owner.
     * @param msgSender Executor of the transaction.
     */
    function checkTransaction(
        address,
        uint256,
        bytes memory,
        Enum.Operation,
        uint256,
        uint256,
        uint256,
        address,
        // solhint-disable-next-line no-unused-vars
        address payable,
        bytes memory,
        address msgSender
    ) external view override {
        // Only owners can exec
        address[] memory owners = ISafe(msg.sender).getOwners();
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == msgSender) {
                return;
            }
        }

        // msg sender is not an owner
        revert("msg sender is not allowed to exec");
    }

    function checkAfterExecution(bytes32, bool) external view override {}

    /**
     * @notice Called by the Safe contract before a transaction is executed via a module.
     * @param to Destination address of Safe transaction.
     * @param value Ether value of Safe transaction.
     * @param data Data payload of Safe transaction.
     * @param operation Operation type of Safe transaction.
     * @param module Module executing the transaction.
     */
    function checkModuleTransaction(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        address module
    ) external override returns (bytes32) {}
}
