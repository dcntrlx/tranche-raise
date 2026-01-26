# TrancheRaise Protocol Documentation

## Overview
TrancheRaise is a decentralized fundraising protocol that enables projects to raise capital through milestone-based fund distribution. Unlike traditional fundraising where all funds are released upfront, TrancheRaise implements a tranche-based system where capital is released tranche after tranche and only if majority of investors voted for tranche. Tranche is one portion of money.

## Protocol Live Cycle

### 1. Campaign Creation
- Project owners deploy a new campaign contract
- Define fundraising goals and deadline of fundraising

### 2. Investment Phase
- Investors contribute funds to the campaign
- Contributions are locked in the contract
- Voting power is allocated proportional to investment
- If campaign reaches funding goal the milistone based tranche execution process starts
- If campaign is failed to reach funding goal funds are returned to investors

### 3. Milestone Execution
- Project team requests tranche
- Defines amount of tokens to exempt
- Voting period begins for investors

### 4. Investor Voting
- Investors review milestone evidence
- Cast votes to approve or deny tranche release
- Voting power weighted by invested amount

### 5. Tranche Distribution
- If more than 50% of investors who voted before tranche's end voted for exempt, than team(specified by team wallet) receive tokens
- If vote fails, funds remain locked until next milestone
- Process repeats for subsequent tranches

## Economic Model
### Fee Structure
- Platform fee on successful campaigns (e.g., 0.5-2%) + comission from treasury managed funds
- Gas optimization for cost-effective voting and campaign creation

### Token Economics
- Native token for governance participation
- Staking mechanisms for enhanced voting power
- Reward distribution for milestone validators
- Deflationary mechanisms through fee burning

## Benefits
### For Projects
- Access to convenient decentralized funding
- Accrue investors trust because of milestone-based funds distribution system

### For Investors
- Protected capital through staged releases
- Direct influence on project progress
- Allows to integrate fair token share system for investors(investors will not vote for tranche if it won't be fair)


## Future Enhancements

### Protocol Evolution
- ERC-tokens support
- Investors will be able to vote to cancel campaign if team left or trying to scam
- Multi-campaign investments: allow users to invest in different campaigns using same tokens to not lock them for nothing if campaign fails
- Optional function to use locked funds to participate in yield management protocol to earn from locked tokens(tokens will stay in yield management protocol even if campaign fundraising ends, they will only removed when they will be distributed through tranches)
- Advanced voting mechanisms (quadratic voting)
- Cross-chain protocol integrations
