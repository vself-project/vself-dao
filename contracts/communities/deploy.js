const sh = require("shelljs");
const { COMMUNITIES_CONTRACT, MASTER_ACCOUNT } = process.env;

const DELETE_BEFORE_DEPLOY = process.env.DELETE_BEFORE_DEPLOY === "true";
const CREATE_CONTRACT_ACCOUNT_BEFORE_DEPLOY =
  process.env.CREATE_CONTRACT_ACCOUNT_BEFORE_DEPLOY === "true";

// Initial contract account balance
let initialBalance = 5;

// Recreate account
if (DELETE_BEFORE_DEPLOY) {
  console.log("Recreate contract account: ", COMMUNITIES_CONTRACT);
  sh.exec(`near delete ${COMMUNITIES_CONTRACT} ${MASTER_ACCOUNT}`);
  sh.exec(
    `near create-account ${COMMUNITIES_CONTRACT} --masterAccount=${MASTER_ACCOUNT} --initialBalance ${initialBalance}`
  );

  // Copy credentials for later deploy
  sh.exec(
    `cp ~/.near-credentials/testnet/${COMMUNITIES_CONTRACT}.json ./creds`
  );
} else if (CREATE_CONTRACT_ACCOUNT_BEFORE_DEPLOY) {
  console.log("Create contract account before deploy: ", COMMUNITIES_CONTRACT);
  sh.exec(
    `near create-account ${COMMUNITIES_CONTRACT} --masterAccount=${MASTER_ACCOUNT} --initialBalance ${initialBalance}`
  );

  // Copy credentials for later deploy
  sh.exec(
    `cp ~/.near-credentials/testnet/${COMMUNITIES_CONTRACT}.json ./creds`
  );
}

// Deploy contract
sh.exec(
  `near deploy --wasmFile contracts/target/wasm32-unknown-unknown/release/communities.wasm --accountId ${COMMUNITIES_CONTRACT}`
);
sh.exec(
  `near call ${COMMUNITIES_CONTRACT} new --accountId ${COMMUNITIES_CONTRACT}`
);

// Copy credentials for later deploy
sh.exec(`cp ~/.near-credentials/testnet/${COMMUNITIES_CONTRACT}.json ./creds`);
