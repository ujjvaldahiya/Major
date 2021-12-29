const MarketplaceMigration = artifacts.require("ItemMarketPlace");

module.exports = function (deployer) {
  deployer.deploy(MarketplaceMigration);
};
