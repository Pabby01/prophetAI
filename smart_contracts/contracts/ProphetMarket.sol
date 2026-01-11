// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProphetMarket {
    struct Market {
        string id;
        string question;
        uint256 yesPool;
        uint256 noPool;
        bool resolved;
        bool outcome; // true = YES, false = NO
    }

    mapping(string => Market) public markets;
    mapping(string => mapping(address => mapping(bool => uint256))) public bets;
    mapping(string => mapping(address => bool)) public hasClaimed;

    address public owner;

    event MarketCreated(string id, string question);
    event BetPlaced(string id, address user, bool isYes, uint256 amount);
    event MarketResolved(string id, bool outcome);
    event WinningsClaimed(string id, address user, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    function createMarket(string calldata marketId, string calldata question) external onlyOwner {
        require(bytes(markets[marketId].id).length == 0, "Market already exists");
        markets[marketId] = Market(marketId, question, 0, 0, false, false);
        emit MarketCreated(marketId, question);
    }

    function placeBet(string calldata marketId, bool isYes) external payable {
        Market storage market = markets[marketId];
        require(bytes(market.id).length > 0, "Market does not exist");
        require(!market.resolved, "Market already resolved");
        require(msg.value > 0, "Bet amount must be greater than 0");

        if (isYes) {
            market.yesPool += msg.value;
        } else {
            market.noPool += msg.value;
        }

        bets[marketId][msg.sender][isYes] += msg.value;
        emit BetPlaced(marketId, msg.sender, isYes, msg.value);
    }

    function resolveMarket(string calldata marketId, bool outcome) external onlyOwner {
        Market storage market = markets[marketId];
        require(bytes(market.id).length > 0, "Market does not exist");
        require(!market.resolved, "Market already resolved");

        market.resolved = true;
        market.outcome = outcome;
        emit MarketResolved(marketId, outcome);
    }

    function claim(string calldata marketId) external {
        Market storage market = markets[marketId];
        require(market.resolved, "Market not resolved");
        require(!hasClaimed[marketId][msg.sender], "Already claimed");

        uint256 userBet = bets[marketId][msg.sender][market.outcome];
        require(userBet > 0, "No winning bet");

        uint256 winningPool = market.outcome ? market.yesPool : market.noPool;
        uint256 losingPool = market.outcome ? market.noPool : market.yesPool;
        
        // If losing pool is 0, user just gets their money back (reward = userBet). 
        // Logic: reward = userBet + share of losing pool.
        // share = userBet / winningPool * losingPool.
        // If winningPool is 0, this shouldn't happen because userBet > 0 implies winningPool > 0.
        
        uint256 reward = userBet;
        if (winningPool > 0) {
            reward += (userBet * losingPool) / winningPool;
        }

        hasClaimed[marketId][msg.sender] = true;
        (bool sent, ) = payable(msg.sender).call{value: reward}("");
        require(sent, "Failed to send Ether");
        
        emit WinningsClaimed(marketId, msg.sender, reward);
    }
}
