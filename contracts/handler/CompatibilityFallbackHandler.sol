// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import "./TokenCallbackHandler.sol";
import "../interfaces/ISignatureValidator.sol";
import "../Safe.sol";

import "./SafeFallbackHandler.sol";

/**
 * @title Compatibility Fallback Handler - Provides compatibility between pre 1.3.0 and 1.3.0+ Safe contracts.
 * @author Richard Meissner - @rmeissner
 */
contract CompatibilityFallbackHandler is SafeFallbackHandler, TokenCallbackHandler, ISignatureValidator {
    // keccak256("SafeMessage(bytes message)");
    bytes32 private constant SAFE_MSG_TYPEHASH = 0x60b3cbf8b4a223d68d641b3b6ddf9a298e7f33710cf3d3a9d1146b5a6150fbca;

    bytes4 internal constant SIMULATE_SELECTOR = bytes4(keccak256("simulate(address,bytes)"));

    address internal constant SENTINEL_MODULES = address(0x1);
    bytes4 internal constant UPDATED_MAGIC_VALUE = 0x1626ba7e;

    /**
     * @notice Legacy EIP-1271 signature validation method.
     * @dev Implementation of ISignatureValidator (see `interfaces/ISignatureValidator.sol`)
     * @param _data Arbitrary length data signed on the behalf of address(msg.sender).
     * @param _signature Signature byte array associated with _data.
     * @return The EIP-1271 magic value.
     */
    function isValidSignature(bytes memory _data, bytes memory _signature) public view override returns (bytes4) {
        // Caller should be a Safe
        Safe safe = Safe(payable(msg.sender));
        bytes memory messageData = encodeMessageDataForSafe(safe, _data);
        bytes32 messageHash = keccak256(messageData);
        if (_signature.length == 0) {
            require(safe.signedMessages(messageHash) != 0, "Hash not approved");
        } else {
            safe.checkSignatures(messageHash, messageData, _signature);
        }
        return EIP1271_MAGIC_VALUE;
    }

    /**
     * @dev Returns the hash of a message to be signed by owners.
     * @param message Raw message bytes.
     * @return Message hash.
     */
    function getMessageHash(bytes memory message) public view returns (bytes32) {
        return getMessageHashForSafe(Safe(payable(msg.sender)), message);
    }

    /**
     * @dev Returns the pre-image of the message hash (see getMessageHashForSafe).
     * @param safe Safe to which the message is targeted.
     * @param message Message that should be encoded.
     * @return Encoded message.
     */
    function encodeMessageDataForSafe(Safe safe, bytes memory message) public view returns (bytes memory) {
        bytes32 safeMessageHash = keccak256(abi.encode(SAFE_MSG_TYPEHASH, keccak256(message)));
        return abi.encodePacked(bytes1(0x19), bytes1(0x01), safe.domainSeparator(), safeMessageHash);
    }

    /**
     * @dev Returns hash of a message that can be signed by owners.
     * @param safe Safe to which the message is targeted.
     * @param message Message that should be hashed.
     * @return Message hash.
     */
    function getMessageHashForSafe(Safe safe, bytes memory message) public view returns (bytes32) {
        return keccak256(encodeMessageDataForSafe(safe, message));
    }

    /**
     * @notice Implementation of updated EIP-1271 signature validation method.
     * @param _dataHash Hash of the data signed on the behalf of address(msg.sender)
     * @param _signature Signature byte array associated with _dataHash
     * @return Updated EIP1271 magic value if signature is valid, otherwise 0x0
     */
    function isValidSignature(bytes32 _dataHash, bytes calldata _signature) external view returns (bytes4) {
        ISignatureValidator validator = ISignatureValidator(msg.sender);
        bytes4 value = validator.isValidSignature(abi.encode(_dataHash), _signature);
        return (value == EIP1271_MAGIC_VALUE) ? UPDATED_MAGIC_VALUE : bytes4(0);
    }
}
