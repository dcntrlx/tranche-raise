//SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

/// @title Campaign
/// @author dnctrlx
/// @notice This contract represents a single campaign with state management
contract Campaign {
    address public immutable OWNER;
    string public campaignTitle;
    uint256 public immutable CAMPAIGN_GOAL;
    uint256 public immutable CAMPAIGN_DURATION;
    uint256 public campaignStart;
    uint256 public campaignEnd;

    enum CampaignState {
        Fundraising,
        Successful,
        Failed,
        Distributing
    }

    mapping(address => uint256) public backersRaises;
    address[] public backers;
    uint256 public totalRaised;
    uint256 public totalDistributed;

    constructor(string memory _campaignTitle, uint256 _campaignGoal, uint256 _campaignDuration) {
        OWNER = msg.sender;
        campaignTitle = _campaignTitle;
        CAMPAIGN_GOAL = _campaignGoal;
        CAMPAIGN_DURATION = _campaignDuration;
        campaignStart = block.timestamp;
        campaignEnd = block.timestamp + _campaignDuration;
    }

    /// @notice Calculates the current state of the campaign based on time and total raised
    function state() public view returns (CampaignState) {
        if (block.timestamp < campaignEnd && totalRaised < CAMPAIGN_GOAL) {
            return CampaignState.Fundraising; // If campaign fundraising period is not over and goal is not reached, then company is fundraising
        }

        if (totalRaised >= CAMPAIGN_GOAL) {
            // If campaign goal was reached then
            if (totalDistributed == totalRaised) {
                return CampaignState.Distributing; // If total distributed is equal to total raised, then company is distributing
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

    /// @notice Allows backers to fund the campaign
    function fund() external payable onlyFundraising {
        require(msg.value > 0, "Must send ETH");

        if (backersRaises[msg.sender] == 0) {
            backers.push(msg.sender);
        }

        backersRaises[msg.sender] += msg.value;
        totalRaised += msg.value;
    }

    /// @notice Function to withraw funds from campaign
    function withdraw(uint256 amount) external onlyFundraising {
        require(address(this).balance >= amount, "You havent raised this much");
        totalRaised -= amount;
        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    /// @notice Allows backers to get a refund if the campaign failed
    function refund() external inState(CampaignState.Failed) {
        uint256 amount = backersRaises[msg.sender];
        require(amount > 0, "No funds to refund");

        backersRaises[msg.sender] = 0;
        // totalRaised -= amount;   Omitting here to save gas. It will not break logic because we are not going to use this campaign anymore
        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, "Refund failed");
    }
}
