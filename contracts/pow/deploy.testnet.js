const sh = require("shelljs");
const { POW_CONTRACT, MASTER_ACCOUNT } = process.env;
const DELETE_BEFORE_DEPLOY = process.env.DELETE_BEFORE_DEPLOY === "true";

// Recreate account
if (DELETE_BEFORE_DEPLOY) {
  sh.exec(`near delete ${POW_CONTRACT} ${MASTER_ACCOUNT}`);
}
sh.exec(
  `near create-account ${POW_CONTRACT} --masterAccount=${MASTER_ACCOUNT} --initial-balance 30`
);

// Deploy contract
sh.exec(
  `near deploy --wasmFile contracts/target/wasm32-unknown-unknown/release/pow_contract.wasm --accountId ${POW_CONTRACT}`
);
sh.exec(`near call ${POW_CONTRACT} new --accountId ${POW_CONTRACT}`);
sh.exec(`near view ${POW_CONTRACT} get_evidences_amount`);

// Copy credentials for later deploy
sh.exec(`cp ~/.near-credentials/testnet/${POW_CONTRACT}.json ./creds`);
