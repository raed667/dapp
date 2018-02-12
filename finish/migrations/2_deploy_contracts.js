var VoteDapp = artifacts.require("./VoteDapp.sol");

module.exports = function(deployer) {
  deployer.deploy(VoteDapp, {overwrite: true});
};
