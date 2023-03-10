const sh = require("shelljs");
const fs = require("fs");

// Create community, and return the community id if successfull
const createCommunity = (contractCall) => {
  const res = sh.exec(contractCall);
  if (res.code === 0) {
    const community_id = res.stdout.split("\n").slice(-2)[0];
    console.log("Communuty was ceated: ", community_id);
    return community_id;
  } else {
    console.log("Communuty wasn't ceated");
    console.log(res.stderr);
    return null;
  }
};

const contractName = fs.readFileSync("./neardev/dev-account").toString();
const masterAccount = fs.readFileSync("./neardev/dev-account").toString();
console.log(contractName);
console.log(masterAccount);

// Default communities for tests
const addDefaultCommunity = `near call ${contractName} add_community '{"community_data": {
    "community_owner": "sergantche.testnet",
    "community_name": "vSelf community",
    "community_description": "Web3 identity wallet",
    "community_source_image": "https://firebasestorage.googleapis.com/v0/b/vself-prod.appspot.com/o/vSelf%20community.png?alt=media&token=27d6fcb7-6ffe-4718-84b6-0a7640c57bfd"}}' --accountId ${masterAccount}`;

const addBearsCommunity = `near call ${contractName} add_community '{"community_data": {
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
const community_id_1 = createCommunity(addDefaultCommunity);
//const community_id_2 = createCommunity(addBearsCommunity);
//const community_id_3 = createCommunity(addVselfDAO);
const commitment_1 = "commitment_1.test";
const commitment_2 = "commitment_2.test";
const near_account = "test.account.testnet";

// View methods
sh.exec(
  `near view ${contractName} get_community_list '{"from_index": 0, "limit": 100}' --accountId ${masterAccount}`
);
sh.exec(
  `near view ${contractName} get_community_members '{"community_id": "${community_id_1}"}' --accountId ${masterAccount}`
);
sh.exec(
  `near view ${contractName} get_community_public_members '{"community_id": "${community_id_1}"}' --accountId ${masterAccount}`
);
sh.exec(
  `near view ${contractName} get_community '{"community_id": "${community_id_1}"}' --accountId ${masterAccount}`
);

// Add new members
sh.exec(
  `near call ${contractName} add_member '{"community_id": "${community_id_1}", "commitment": "${commitment_1}"}' --accountId ${contractName}`
);
sh.exec(
  `near call ${contractName} add_member '{"community_id": "${community_id_1}", "commitment": "${commitment_2}"}' --accountId ${contractName}`
);

// Add new public member
sh.exec(
  `near call ${contractName} add_public_member '{"community_id": "${community_id_1}", "commitment": "${commitment_2}", "near_id": "${near_account}"}' --accountId ${contractName}`
);

// Check community data after changes
sh.exec(
  `near view ${contractName} get_community_list '{"from_index": 0, "limit": 100}' --accountId ${masterAccount}`
);
sh.exec(
  `near view ${contractName} get_community_members '{"community_id": "${community_id_1}"}' --accountId ${masterAccount}`
);
sh.exec(
  `near view ${contractName} get_community_public_members '{"community_id": "${community_id_1}"}' --accountId ${masterAccount}`
);
sh.exec(
  `near view ${contractName} get_community '{"community_id": "${community_id_1}"}' --accountId ${masterAccount}`
);

// Remove community
sh.exec(
  `near call ${contractName} remove_community '{"community_id": "${community_id_1}"}' --accountId ${contractName}`
);
sh.exec(
  `near view ${contractName} get_community_list '{"from_index": 0, "limit": 100}' --accountId ${masterAccount}`
);

// exit script with the same code as the build command
process.exit();
