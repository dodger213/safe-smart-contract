pragma solidity 0.4.21;
import "../Extension.sol";
import "../GnosisSafe.sol";


/// @title Daily Limit Extension - Allows to transfer limited amounts of ERC20 tokens and Ether without confirmations.
/// @author Stefan George - <stefan@gnosis.pm>
contract DailyLimitExtension is Extension {

    string public constant NAME = "Daily Limit Extension";
    string public constant VERSION = "0.0.1";
    bytes4 public constant TRANSFER_FUNCTION_IDENTIFIER = hex"a9059cbb";

    DailyLimitExtension masterCopy;
    GnosisSafe gnosisSafe;

    // dailyLimits mapping maps token address to daily limit settings.
    mapping (address => DailyLimit) public dailyLimits;

    struct DailyLimit {
        uint256 dailyLimit;
        uint256 spentToday;
        uint256 lastDay;
    }

    modifier onlyGnosisSafe() {
        require(msg.sender == address(gnosisSafe));
        _;
    }

    /// @dev Setup function sets initial storage of contract.
    /// @param tokens List of token addresses. Ether is represented with address 0x0.
    /// @param _dailyLimits List of daily limits in smalles units (e.g. Wei for Ether).
    function setup(address[] tokens, uint256[] _dailyLimits)
        public
    {
        // gnosisSafe can only be 0 at initalization of contract.
        // Check ensures that setup function can only be called once.
        require(address(gnosisSafe) == 0);
        gnosisSafe = GnosisSafe(msg.sender);
        for (uint256 i = 0; i < tokens.length; i++)
            dailyLimits[tokens[i]].dailyLimit = _dailyLimits[i];
    }

    /// @dev Allows to upgrade the contract. This can only be done via a Safe transaction.
    /// @param _masterCopy New contract address.
    function changeMasterCopy(DailyLimitExtension _masterCopy)
        public
        onlyGnosisSafe
    {
        require(address(_masterCopy) != 0);
        masterCopy = _masterCopy;
    }

    /// @dev Function to be implemented by extension. This is used to check to what Safe the Extension is attached.
    /// @return Returns the safe the Extension is attached to.
    function getGnosisSafe()
        public
        returns (GnosisSafe)
    {
        return gnosisSafe;
    }

    /// @dev Allows to update the daily limit for a specified token. This can only be done via a Safe transaction.
    /// @param token Token contract address.
    /// @param dailyLimit Daily limit in smallest token unit.
    function changeDailyLimit(address token, uint256 dailyLimit)
        public
        onlyGnosisSafe
    {
        dailyLimits[token].dailyLimit = dailyLimit;
    }

    function executeInternal(address sender, address to, uint256 value, bytes data)
        internal
    {
        // Only Safe owners are allowed to execute daily limit transactions.
        require(gnosisSafe.isOwner(sender));
        // Data has to encode a token transfer or has to be empty.
        require(data.length == 0 && value > 0 || data.length > 0 && value == 0);
        address token;
        address receiver;
        uint256 amount;
        if (data.length == 0) {
            token = 0;
            receiver = to;
            amount = value;
        }
        else {
            token = to;
            bytes4 functionIdentifier;
            assembly {
                functionIdentifier := mload(add(data, 0x20))
                receiver := mload(add(data, 0x24))
                amount := mload(add(data, 0x44))
            }
            require(functionIdentifier == TRANSFER_FUNCTION_IDENTIFIER);
        }
        require(receiver != 0);
        require(amount > 0);
        // Validate that transfer is not exceeding daily limit.
        require(isUnderLimit(token, amount));
        dailyLimits[token].spentToday += amount;
        gnosisSafe.executeExtension(to, value, data, GnosisSafe.Operation.Call);
    }

    /// @dev Returns if Safe transaction is a valid daily limit transaction.
    /// @param to Receiver address in case of Ether transfer, token address in case of a token transfer.
    /// @param value Ether value in case of an Ether transfer.
    /// @param data Encoded token transfer. Empty in case of Ether transfer.
    /// @return Returns if transaction can be executed.
    function executeDailyLimit(address to, uint256 value, bytes data)
        public
    {
        executeInternal(msg.sender, to, value, data);
    }

    function isUnderLimit(address token, uint256 amount)
        internal
        returns (bool)
    {
        DailyLimit storage dailyLimit = dailyLimits[token];
        if (today() > dailyLimit.lastDay) {
            dailyLimit.lastDay = today();
            dailyLimit.spentToday = 0;
        }
        if (   dailyLimit.spentToday + amount <= dailyLimit.dailyLimit
            && dailyLimit.spentToday + amount > dailyLimit.spentToday)
            return true;
        return false;
    }

    /// @dev Returns last midnight as Unix timestamp.
    /// @return Unix timestamp.
    function today()
        public
        view
        returns (uint)
    {
        return now - (now % 1 days);
    }
}
