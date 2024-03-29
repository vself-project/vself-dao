const sh = require("shelljs");
const fs = require("fs");

const contractName =
  process.env.COMMUNITIES_CONTRACT ||
  fs.readFileSync("./neardev/dev-account").toString();
const masterAccount =
  process.env.MASTER_ACCOUNT ||
  fs.readFileSync("./neardev/dev-account").toString();

// Default communities for tests
const addDefaultCommunity = `near call ${contractName} add_community '{"community_data": {
  "community_owner": "sergantche.testnet",
  "community_name": "vSelf community",
  "community_description": "Web3 identity wallet",
  "community_source_image": "https://firebasestorage.googleapis.com/v0/b/vself-prod.appspot.com/o/vSelf%20community.png?alt=media&token=27d6fcb7-6ffe-4718-84b6-0a7640c57bfd"}}' --accountId ${masterAccount}`;

const addChickenCommunity = `near call ${contractName} add_community '{"community_data": {
  "community_owner": "sergantche.testnet",
  "community_name": "Bears",
  "community_description": "Community for bears and honey lovers",
  "community_source_image": "https://ipfs.io/ipfs/bafybeig7ot4aluihyuvsleo5khxz6zr44foeydhauok6gf5cqjua5nidw4/bear.png"}}' --accountId ${masterAccount}`;

const addVselfDAO = `near call ${contractName} add_community '{"community_data": {
  "community_owner": "caesai.testnet",
  "community_name": "vSelf DAO",
  "community_description": "Web3 identity wallet",
  "community_source_image": "https://firebasestorage.googleapis.com/v0/b/vself-prod.appspot.com/o/vSelf%20community.png?alt=media&token=27d6fcb7-6ffe-4718-84b6-0a7640c57bfd"}}' --accountId ${masterAccount}`;

// Create some communities
if (sh.exec(addDefaultCommunity).code === 0) {
  console.log("Add first  default community");
}

// Bears community
if (sh.exec(addChickenCommunity).code === 0) {
  console.log("Add bear community");
}

// vSelf DAO
if (sh.exec(addVselfDAO).code === 0) {
  console.log("Add vSelf DAO community");
}

// Get all communities
sh.exec(
  `near view ${contractName} get_community_list '{"from_index": 0, "limit": 100}' --accountId ${masterAccount}`
);

// exit script with the same code as the build command
process.exit();
