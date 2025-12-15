// SPDX-License-Identifier: MIT

import {Campaign} from "./Campaign.sol";

pragma solidity ^0.8.24;

/// @title CampaignFactory
/// @author dnctrlx
/// @notice This contract provides way to create new campaigns through single interface CampaignFactory
contract CampaignFactory {
    address[] public campaigns;

    constructor() {}

    /// @notice Function to create new campaign
    /// @param _campaignTitle Title of the campaign
    /// @param _campaignGoal Goal of the campaign
    /// @param _campaignDuration Duration of the campaign in seconds
    function createCampaign(string memory _campaignTitle, uint256 _campaignGoal, uint256 _campaignDuration) external {
        Campaign campaign = new Campaign(_campaignTitle, _campaignGoal, _campaignDuration, msg.sender);
        campaigns.push(address(campaign));
    }

    /// @notice Function to get all campaigns
    /// @return Arrays of campaign addresses
    function getAllCampaigns() external view returns (address[] memory) {
        return campaigns;
    }
}
