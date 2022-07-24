// First, import some helper libraries. `shelljs` is included in the
// devDependencies of the root project, which is why it's available here. It
// makes it easy to use *NIX-style scripting (which works on Linux distros,
// macOS, and Unix systems) on Windows as well.
const sh = require("shelljs");
const fs = require('fs');

const contractName = process.env.CONTRACT_NAME || fs.readFileSync('./neardev/dev-account').toString();
const masterAccount = process.env.MASTER_ACCOUNT || fs.readFileSync('./neardev/dev-account').toString();

// Utils
const { createHash } = require('crypto');

// SHA-256 hash
const hash = (msg) => {
  return createHash('sha256').update(msg).digest('hex');
}

// Contructor call
const initCmd = `near call ${contractName} new --accountId ${contractName}`;

// Execute the build command, storing exit code for later use
const { code } = sh.exec(initCmd);

// Assuming this is compiled from the root project directory, link the compiled
// contract to the `out` folder –
// When running commands like `near deploy`, near-cli looks for a contract at
// <CURRENT_DIRECTORY>/out/main.wasm
if (code === 0) {
  console.log("Init successfull");
}

// Start default event
const start_time = 1658661284014000000; // 24.07
const end_time = start_time + 30 * 24 * 60 * 60 * 1000000; // + month

const startEventCmd = `near call ${contractName} start_event '{"event_data": {
  "event_description":
  "vSelf launches a series of quests which will keep you motivated while you learn about our project and its place inside NEAR ecosystem",
  "event_name": "vSelf Onboarding Metabuild Quest",
  "finish_time": ${end_time},
  "quests": [{
    "qr_prefix_enc": "${hash('https://vself-dev.web.app/vself.apk')}",
    "qr_prefix_len": ${"https://vself-dev.web.app/vself.apk".length},
    "reward_description": "Welcome to the vSelf demo!",
    "reward_title": "vSelf: Welcome Badge",
    "reward_uri": "/nft1.png"
  },
  {
    "qr_prefix_enc": "${hash('You have registered in the NEAR community')}",
    "qr_prefix_len": ${"You have registered in the NEAR community".length},
    "reward_description": "You have registered in the NEAR community",
    "reward_title": "vSelf: NEAR User Badge",
    "reward_uri": "/nft2.png"
  },
  {
    "qr_prefix_enc": "${hash('Congrats! Now you know more about Web3')}",
    "qr_prefix_len": ${"Congrats! Now you know more about Web3".length},
    "reward_description": "Congrats! Now you know more about Web3",
    "reward_title": "vSelf: Early Adopter Badge",
    "reward_uri": "/nft3.png"
  },
  {
    "qr_prefix_enc": "${hash('Thank you <3 and see you soon!')}",
    "qr_prefix_len": ${"Thank you <3 and see you soon!".length},
    "reward_description": "Thank you <3 and see you soon!",
    "reward_title": "vSelf: Metabuidl Badge",
    "reward_uri": "/nft4.png"
  }],
"start_time": ${start_time}}}' --accountId ${contractName}`;

// Execute the command
if (sh.exec(startEventCmd).code === 0) {
  console.log("Start default event successfull");
}

// Some tests
const eventId = 3090415815; //u32 for now
sh.exec(`near view ${contractName} get_ongoing_events '{"from_index": 0, "limit": 100}' --accountId ${contractName}`);
sh.exec(`near view ${contractName} get_event_data '{"event_id": ${eventId}}'`);
sh.exec(`near view ${contractName} get_event_stats '{"event_id": ${eventId}}'`);
sh.exec(`near call ${contractName} checkin '{"event_id": ${eventId}, "username": "sergantche.testnet", "request": "Ground control to major Tom" }' --accountId ${masterAccount} --depositYocto 9000000000000000000000 --gas 300000000000000`);
sh.exec(`near call ${contractName} checkin '{"event_id": ${eventId}, "username": "ilerik.testnet", "request": "Congrats! Now you know more about Web3" }' --accountId ${masterAccount} --depositYocto 9000000000000000000000 --gas 300000000000000`);
sh.exec(`near call ${contractName} checkin '{"event_id": ${eventId}, "username": "sergantche.testnet", "request": "You have registered in the NEAR community" }' --accountId ${masterAccount} --depositYocto 9000000000000000000000 --gas 300000000000000`);
sh.exec(`near view ${contractName} get_event_stats '{"event_id": ${eventId}}'`);
sh.exec(`near view ${contractName} get_user_balance '{"event_id": ${eventId}, "account_id": "ilerik.testnet"}'`);
sh.exec(`near view ${contractName} get_user_balance '{"event_id": ${eventId}, "account_id": "sergantche.testnet"}'`);
sh.exec(`near view ${contractName} get_event_actions '{"event_id": ${eventId}, "from_index": 0, "limit": 100}'`);

// Try to send money to my main account
sh.exec(`near send ${contractName} ilerik.testnet 100`);

// Copy crededntials for later use
sh.exec(`cp ~/.near-credentials/testnet/${contractName}.json ./creds`);

// exit script with the same code as the build command
process.exit(code);
