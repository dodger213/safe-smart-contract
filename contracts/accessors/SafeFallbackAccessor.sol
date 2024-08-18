// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

contract SafeFallbackAccessor {
    address private constant _SENTINEL = address(1);

    address private _singleton;
    mapping(address => address) private _modules;
    mapping(address => address) private _owners;
    uint256 private _ownerCount;
    uint256 private _threshold;
    uint256 private _nonce;
    bytes32 private _deprecatedDomainSeparator;
    mapping(bytes32 => uint256) private _signedMessages;
    mapping(address => mapping(bytes32 => uint256)) private _approvedHashes;

    function signedMessages(bytes32 hash) external view returns (bool signed) {
        return _signedMessages[hash] != 0;
    }

    function getModulesPaginated(address start, uint256 pageSize)
        public
        view
        returns (address[] memory modules, address next)
    {
        require(start == _SENTINEL || _modules[start] != address(0), "GS105");
        require(pageSize > 0, "GS106");
        modules = new address[](pageSize);

        uint256 moduleCount = 0;
        next = _modules[start];
        while (next != address(0) && next != _SENTINEL && moduleCount < pageSize) {
            modules[moduleCount] = next;
            next = _modules[next];
            moduleCount++;
        }

        if (next != _SENTINEL) {
            next = modules[moduleCount - 1];
        }

        /* solhint-disable no-inline-assembly */
        /// @solidity memory-safe-assembly
        assembly {
            mstore(modules, moduleCount)
        }
        /* solhint-enable no-inline-assembly */
    }

    function getModules() external view returns (address[] memory modules) {
        address next;
        (modules, next) = getModulesPaginated(_SENTINEL, 10);
        require(next == address(0) || next == _SENTINEL, "GS107");
        return modules;
    }

    function getOwners() external view returns (address[] memory array) {
        array = new address[](_ownerCount);

        uint256 index = 0;
        address currentOwner = _owners[_SENTINEL];
        while (currentOwner != _SENTINEL) {
            array[index] = currentOwner;
            currentOwner = _owners[currentOwner];
            index++;
        }
    }

    function getStorageAt(uint256 offset, uint256 length) external view returns (bytes memory result) {
        result = new bytes(length * 32);
        for (uint256 index = 0; index < length; index++) {
            /* solhint-disable no-inline-assembly */
            /// @solidity memory-safe-assembly
            assembly {
                let word := sload(add(offset, index))
                mstore(add(add(result, 0x20), mul(index, 0x20)), word)
            }
            /* solhint-enable no-inline-assembly */
        }
    }
}
