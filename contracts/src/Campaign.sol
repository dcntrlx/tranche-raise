//SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

/// @title Campaign
/// @author dnctrlx
/// @notice This contract represents a single campaign with state management
contract Campaign is Initializable {
    /// @dev Represents campaign owner. One of the values from constructor of campaign
    address public OWNER;
    /// @dev Represents campaign title. One of the values from constructor of campaign
    string public campaignTitle;
    /// @dev Represents IPFS CID of campaign metadata
    string public metadataCID;
    /// @dev Represents capmaign goal in wei. One of the values from constructor of campaign
    uint256 public CAMPAIGN_GOAL;
    /// @dev Represents capmaign duration in seconds. One of the values from constructor of campaign
    uint256 public CAMPAIGN_DURATION;
    /// @dev campaignStart is set to block.timestamp on campaign creation. Represents capmaign creation timestamp
    uint256 public campaignStart;
    /// @dev campaignEnd is calculated as campaignStart + CAMPAIGN_DURATION on campaign creation
    uint256 public campaignEnd;

    /// @notice CampaignState describes all possible states of the campaign
    /// @dev State is resolved by the state() function
    enum CampaignState {
        Fundraising,
        Distributing,
        Successful,
        Failed
    }

    /// @notice TrancheState describes all possible states of a tranche
    enum TrancheState {
        NotCreated,
        Voting,
        Executed,
        Failed
    }

    /// @notice Tranche is a struct representing single tranche request
    struct Tranche {
        string trancheName;
        uint256 trancheAmount;
        uint256 votesFor;
        uint256 votesAgainst;
        address payable recepient;
        TrancheState state;
        mapping(address => bool) usersVoted;
    }

    /// @dev TrancheView to return for external sources
    struct TrancheView {
        string trancheName;
        uint256 trancheAmount;
        uint256 votesFor;
        uint256 votesAgainst;
        address recepient;
        TrancheState state;
    }

    /// @dev Array of all started traches. Includes not active traches
    Tranche[] public tranches;

    /// @dev Mapping of backers raises. Key is backer address, value is raise amount from current backer
    mapping(address => uint256) public backersRaises;
    /// @dev Array of backers for current campaign
    address[] public backers;
    /// @dev Total amount of raised funds from backers
    uint256 public totalRaised;
    /// @dev Total amount of distributed funds from backers
    uint256 public totalDistributed;
    /// @dev Flag indicating if the campaign was cancelled by investors
    bool public isCancelled;
    /// @dev Snapshot of balance at cancellation for proportional refunds
    uint256 public cancelledBalance;
    /// @dev Total votes for campaign cancellation
    uint256 public cancelVotes;
    /// @dev Mapping to track who voted to cancel
    mapping(address => bool) public votedToCancel;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    modifier onlyOwner() {
        require(msg.sender == OWNER, "You are not an owner");
        _;
    }

    function initialize(string memory _campaignTitle, string memory _metadataCID, uint256 _campaignGoal, uint256 _campaignDuration, address _owner)
        public
        initializer
    {
        OWNER = _owner;
        campaignTitle = _campaignTitle;
        metadataCID = _metadataCID;
        CAMPAIGN_GOAL = _campaignGoal;
        CAMPAIGN_DURATION = _campaignDuration;
        campaignStart = block.timestamp;
        campaignEnd = block.timestamp + _campaignDuration;
    }

    /// @notice Calculates the current state of the campaign based on time and total raised
    /// @dev Uses CAMPAIGN_GOAL and CAMPAIGN_DURATION constants to determine the current state of the campaign
    /// @notice Calculates the current state of the campaign based on time and total raised
    /// @dev Uses CAMPAIGN_GOAL and CAMPAIGN_DURATION constants to determine the current state of the campaign
    function state() public view returns (CampaignState) {
        if (isCancelled) return CampaignState.Failed;

        // Automatic failure if 60% cancellation threshold is met
        if (totalRaised > 0 && cancelVotes >= (totalRaised * 60) / 100) {
            return CampaignState.Failed;
        }

        if (block.timestamp < campaignEnd && totalRaised < CAMPAIGN_GOAL) {
            return CampaignState.Fundraising; // If campaign fundraising period is not over and goal is not reached, then company is fundraising
        }

        if (totalRaised >= CAMPAIGN_GOAL) {
            // If campaign goal was reached then
            if (totalDistributed < totalRaised) {
                return CampaignState.Distributing; // If total distributed is less than total raised, then company is distributing
            }
            return CampaignState.Successful; // If totalDistibuted == totalRaised then company is finished
        }
        // If (block.timestamp > campaignEnd && totalRaised < CAMPAIGN_GOAL)
        return CampaignState.Failed; // If campaign goal was not reached then company is failed
    }

    /// @notice Modifier to check if campaign is in a specific state
    modifier inState(CampaignState _state) {
        require(state() == _state, "Current state does not allow this action");
        _;
    }

    /// @notice Modifier to check if campgaing in CampaignState.Fundraising state
    modifier onlyFundraising() {
        require(state() == CampaignState.Fundraising, "Campaign is not in fundraising state");
        _;
    }

    /// @notice Modifier to check if campgaing in CampaignState.Distributing state
    modifier onlyDistributing() {
        require(state() == CampaignState.Distributing, "Campaign is not in distributing state");
        _;
    }

    /// @notice Allows backers to fund the campaign
    /// @dev Fund is only possible during CampaignState.Fundraising state
    function fund() external payable onlyFundraising {
        require(msg.value > 0, "Must send ETH");

        if (backersRaises[msg.sender] == 0) {
            backers.push(msg.sender);
        }

        backersRaises[msg.sender] += msg.value;
        totalRaised += msg.value;
    }

    /// @notice Allows backers to revoke their funds during fundraising
    /// @dev Revoke is only possible during CampaignState.Fundraising state
    function revokeFunds() external onlyFundraising {
        uint256 amount = backersRaises[msg.sender];
        require(amount > 0, "No funds to revoke");

        backersRaises[msg.sender] = 0;
        totalRaised -= amount;
        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, "Revoke failed");
    }

    /// @notice Allows backers to get a refund if the campaign failed or was cancelled
    /// @dev Refund is only possible if campaign is in CampaignState.Failed state
    function refund() external inState(CampaignState.Failed) {
        uint256 amount = backersRaises[msg.sender];
        require(amount > 0, "No funds to refund");

        // If threshold met but flag not set, seal the cancellation state now
        if (!isCancelled && cancelVotes >= (totalRaised * 60) / 100) {
            isCancelled = true;
            cancelledBalance = address(this).balance;
        }

        backersRaises[msg.sender] = 0;
        
        uint256 refundAmount = amount;
        
        // If cancelled, calculate proportional refund based on remaining balance
        if (isCancelled && totalRaised > 0) {
            refundAmount = (amount * cancelledBalance) / totalRaised;
        }

        (bool success,) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Refund failed");
    }

    /// @notice Allows investors to vote to cancel the campaign during vesting
    /// @dev accessible only in Distributing state
    function voteToCancel() external onlyDistributing {
        require(backersRaises[msg.sender] > 0 || msg.sender == OWNER, "Only investors or owner can vote");
        require(!votedToCancel[msg.sender], "Already voted to cancel");

        votedToCancel[msg.sender] = true;
        cancelVotes += backersRaises[msg.sender];

        // Check if 60% threshold is reached
        if (cancelVotes >= (totalRaised * 60) / 100) {
            isCancelled = true;
            cancelledBalance = address(this).balance;
        }
    }

    /// @notice Function to request a tranche from the campaign
    /// @dev Tranche can be executed if more than 50% of backers vote for it, othervise it is considered to be failed
    function requestTranche(string memory _trancheName, uint256 _trancheAmount, address payable _recepint)
        external
        onlyDistributing
        onlyOwner
    {
        require(_trancheAmount > 0, "Tranche amount must be greater than 0");
        require(_trancheAmount <= totalRaised - totalDistributed, "Not enough funds left to tranche");
        Tranche storage newTranche = tranches.push();
        newTranche.trancheName = _trancheName;
        newTranche.trancheAmount = _trancheAmount;
        newTranche.recepient = _recepint;
        newTranche.state = TrancheState.Voting;
    }

    /// @notice Allows investors to vote for a tranches
    /// @dev Tranche can be executed if more than 50% of backers vote for it, othervise it is considered to be failed. Will also fail if recepient doesnt have receive or fallback
    function voteForTranche(uint256 _trancheIndex, bool _voteFor) external onlyDistributing {
        Tranche storage tranche = tranches[_trancheIndex];
        require(tranche.state == TrancheState.Voting, "Tranche is not in voting state");
        require(!tranche.usersVoted[msg.sender], "You have already voted for this tranche");
        tranche.usersVoted[msg.sender] = true;
        if (_voteFor) {
            tranche.votesFor += backersRaises[msg.sender];
            if (tranche.votesFor >= totalRaised / 2) {
                tranche.state = TrancheState.Executed;
                totalDistributed += tranche.trancheAmount;
                (bool success,) = payable(tranche.recepient).call{value: tranche.trancheAmount}("");
                require(success, "Tranche execution transfer failed");
            }
        } else {
            tranche.votesAgainst += backersRaises[msg.sender];
            if (tranche.votesAgainst >= totalRaised / 2) {
                tranche.state = TrancheState.Failed;
            }
        }
    }

    /// @notice Function returns verstion of tranches to view
    /// @dev Supposed to be used only for external calls not in transactions
    function getAllTranches() external view returns (TrancheView[] memory) {
        TrancheView[] memory tranchesView = new TrancheView[](tranches.length);
        for (uint256 i = 0; i < tranches.length; i++) {
            Tranche storage tranche = tranches[i];
            tranchesView[i] = TrancheView({
                trancheName: tranche.trancheName,
                trancheAmount: tranche.trancheAmount,
                votesFor: tranche.votesFor,
                votesAgainst: tranche.votesAgainst,
                recepient: tranche.recepient,
                state: tranche.state
            });
        }
        return tranchesView;
    }
}
