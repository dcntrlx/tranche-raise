// SPDX-License-Identifier: MIT

import {Campaign} from "./Campaign.sol";

import "@openzeppelin/contracts/proxy/Clones.sol";

pragma solidity ^0.8.24;

/// @title CampaignFactory
/// @author dnctrlx
/// @notice This contract provides way to create new campaigns through single interface CampaignFactory
contract CampaignFactory {
    address[] public campaigns;
    address public immutable campaignImplementation;

    constructor() {
        campaignImplementation = address(new Campaign());
    }

    /// @notice Function to create new campaign
    /// @param _campaignTitle Title of the campaign
    /// @param _metadataCID IPFS CID of the campaign metadata
    /// @param _campaignGoal Goal of the campaign
    /// @param _campaignDuration Duration of the campaign in seconds
    function createCampaign(string memory _campaignTitle, string memory _metadataCID, uint256 _campaignGoal, uint256 _campaignDuration) external {
        address clone = Clones.clone(campaignImplementation);
        Campaign(clone).initialize(_campaignTitle, _metadataCID, _campaignGoal, _campaignDuration, msg.sender);
        campaigns.push(clone);
    }

    /// @notice Function to get all campaigns
    /// @return Arrays of campaign addresses
    function getAllCampaigns() external view returns (address[] memory) {
        return campaigns;
    }
}
