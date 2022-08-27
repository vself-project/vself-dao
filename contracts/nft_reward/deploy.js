const sh = require("shelljs");
const { NFT_REWARD_CONTRACT, MASTER_ACCOUNT } = process.env;

const DELETE_BEFORE_DEPLOY = process.env.DELETE_BEFORE_DEPLOY === "true";
const CREATE_CONTRACT_ACCOUNT_BEFORE_DEPLOY = process.env.CREATE_CONTRACT_ACCOUNT_BEFORE_DEPLOY === "true";

// Initial contract account balance
let initialBalance = 20.4;

// Recreate account
if (DELETE_BEFORE_DEPLOY) {
  console.log('Recreate contract account: ', NFT_REWARD_CONTRACT);
  sh.exec(`near delete ${NFT_REWARD_CONTRACT} ${MASTER_ACCOUNT}`);
  sh.exec(
    `near create-account ${NFT_REWARD_CONTRACT} --masterAccount=${MASTER_ACCOUNT} --initialBalance ${initialBalance}`
  );

  // Copy credentials for later deploy
  sh.exec(`cp ~/.near-credentials/testnet/${NFT_REWARD_CONTRACT}.json ./creds`);
} else if (CREATE_CONTRACT_ACCOUNT_BEFORE_DEPLOY) {
  console.log('Create contract account before deploy: ', NFT_REWARD_CONTRACT);
  sh.exec(
    `near create-account ${NFT_REWARD_CONTRACT} --masterAccount=${MASTER_ACCOUNT} --initialBalance ${initialBalance}`
  );

  // Copy credentials for later deploy
  sh.exec(`cp ~/.near-credentials/testnet/${NFT_REWARD_CONTRACT}.json ./creds`);
}

// Deploy contract
sh.exec(
  `near deploy --wasmFile contracts/target/wasm32-unknown-unknown/release/nft_reward_contract.wasm --accountId ${NFT_REWARD_CONTRACT}`
);
sh.exec(`near call ${NFT_REWARD_CONTRACT} new --accountId ${NFT_REWARD_CONTRACT}`);
//sh.exec(`near view ${NFT_REWARD_CONTRACT} get_evidences_amount`);

// Copy credentials for later deploy
sh.exec(`cp ~/.near-credentials/testnet/${NFT_REWARD_CONTRACT}.json ./creds`);
