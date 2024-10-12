const DiscountTokens = artifacts.require("DiscountTokens");

module.exports = (deployer) => {
    deployer.deploy(DiscountTokens);
};