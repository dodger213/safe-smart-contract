// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import {Safe, Enum} from "./Safe.sol";

// Imports are required for NatSpec validation of the compiler, and falsely detected as unused by
// the linter, so disable the `no-unused-imports` rule for the next line.
// solhint-disable-next-line no-unused-import
import {ISafe} from "./interfaces/ISafe.sol";
// solhint-disable-next-line no-unused-import
import {ModuleManager} from "./base/ModuleManager.sol";

/**
 * @title SafeL2 - An implementation of the Safe contract that emits additional events on transaction executions.
 * @notice For a more complete description of the Safe contract, please refer to the main Safe contract `Safe.sol`.
 * @author Stefan George - @Georgi87
 * @author Richard Meissner - @rmeissner
 */
contract SafeL2 is Safe {
    event SafeMultiSigTransaction(
        address to,
        uint256 value,
        bytes data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver,
        bytes signatures,
        // We combine nonce, sender and threshold into one to avoid stack too deep
        // Dev note: additionalInfo should not contain `bytes`, as this complicates decoding
        bytes additionalInfo
    );

    event SafeModuleTransaction(address module, address to, uint256 value, bytes data, Enum.Operation operation);

    /**
     * @inheritdoc ISafe
     */
    function execTransaction(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver,
        bytes memory signatures
    ) public payable override returns (bool) {
        bytes memory additionalInfo;
        {
            additionalInfo = abi.encode(nonce, msg.sender, threshold);
        }
        emit SafeMultiSigTransaction(
            to,
            value,
            data,
            operation,
            safeTxGas,
            baseGas,
            gasPrice,
            gasToken,
            refundReceiver,
            signatures,
            additionalInfo
        );
        return super.execTransaction(to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, signatures);
    }

    /**
     * @inheritdoc ModuleManager
     */
    function onAfterExecTransactionFromModule(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        bool /*success*/
    ) internal override {
        emit SafeModuleTransaction(msg.sender, to, value, data, operation);
    }
}
