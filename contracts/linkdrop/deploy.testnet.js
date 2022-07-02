const sh = require("shelljs");
const { LINKDROP_CONTRACT, MASTER_ACCOUNT } = process.env;

const DELETE_BEFORE_DEPLOY = process.env.DELETE_BEFORE_DEPLOY === "true";
const CREATE_CONTRACT_ACCOUNT_BEFORE_DEPLOY = process.env.CREATE_CONTRACT_ACCOUNT_BEFORE_DEPLOY === "true";

// Initial contract account balance
let initialBalance = 21;

// Recreate account
if (DELETE_BEFORE_DEPLOY) {
  console.log('Recreate contract account: ', LINKDROP_CONTRACT);
  sh.exec(`near delete ${LINKDROP_CONTRACT} ${MASTER_ACCOUNT}`);
  sh.exec(
    `near create-account ${LINKDROP_CONTRACT} --masterAccount=${MASTER_ACCOUNT} --initialBalance ${initialBalance}`
  );

  // Copy credentials for later deploy
  sh.exec(`cp ~/.near-credentials/testnet/${LINKDROP_CONTRACT}.json ./creds`);
} else if (CREATE_CONTRACT_ACCOUNT_BEFORE_DEPLOY) {
  console.log('Create contract account before deploy: ', LINKDROP_CONTRACT);
  sh.exec(
    `near create-account ${LINKDROP_CONTRACT} --masterAccount=${MASTER_ACCOUNT} --initialBalance ${initialBalance}`
  );

  // Copy credentials for later deploy
  sh.exec(`cp ~/.near-credentials/testnet/${LINKDROP_CONTRACT}.json ./creds`);
}

// Deploy contract
sh.exec(
  `near deploy --wasmFile contracts/target/wasm32-unknown-unknown/release/nft_reward_contract.wasm --accountId ${LINKDROP_CONTRACT}`
);
sh.exec(`near call ${LINKDROP_CONTRACT} new --accountId ${LINKDROP_CONTRACT}`);

// Copy credentials for later deploy
sh.exec(`cp ~/.near-credentials/testnet/${LINKDROP_CONTRACT}.json ./creds`);
