const sh = require("shelljs");
const fs = require('fs');
const { createHash } = require('crypto');

// SHA-256 hash
const hash = (msg) => {
  return createHash('sha256').update(msg).digest('hex');
}

const contractName = process.env.CONTRACT_NAME || fs.readFileSync('./neardev/dev-account').toString();
const masterAccount = process.env.MASTER_ACCOUNT || fs.readFileSync('./neardev/dev-account').toString();

// Start default event
const start_time = (new Date().getTime()) * 1000000; // 24.07
const end_time = start_time + 30 * 24 * 60 * 60 * 1000000; // + month

const startEvent1 = `near call ${contractName} start_event '{"event_data": {
  "event_description":
  "Test event",
  "event_name": "Test event 1",
  "finish_time": ${end_time},
  "quests": [{
    "qr_prefix_enc": "${hash('hello')}",
    "qr_prefix_len": ${"hello".length},
    "reward_description": "Welcome to the test!",
    "reward_title": "vSelf: Tester Badge",
    "reward_uri": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Felis_silvestris_silvestris.jpg/1200px-Felis_silvestris_silvestris.jpg"
  },
  {
    "qr_prefix_enc": "${hash('goodbye')}",
    "qr_prefix_len": ${"goodbye".length},
    "reward_description": "Welcome to the test!",
    "reward_title": "vSelf: Tester Badge",
    "reward_uri": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Zunge_raus.JPG/1200px-Zunge_raus.JPG"
  }],
"start_time": ${start_time}}}' --accountId ${masterAccount}`;

const startEvent2 = `near call ${contractName} start_event '{"event_data": {
  "event_description":
  "Test event",
  "event_name": "Test event 2",
  "finish_time": ${end_time},
  "quests": [{
    "qr_prefix_enc": "${hash('cat')}",
    "qr_prefix_len": ${"cat".length},
    "reward_description": "You discovered a cat!",
    "reward_title": "vSelf: Tester Badge",
    "reward_uri": "https://cdn.britannica.com/39/7139-050-A88818BB/Himalayan-chocolate-point.jpg"
  },
  {
    "qr_prefix_enc": "${hash('dog')}",
    "qr_prefix_len": ${"dog".length},
    "reward_description": "You discovered a dog!",
    "reward_title": "vSelf: Tester Badge",
    "reward_uri": "https://th-thumbnailer.cdn-si-edu.com/SdKYWifCKfE2g8O-po_SO99hQ-Y=/1000x750/filters:no_upscale():focal(3126x2084:3127x2085)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer_public/ec/e6/ece69181-708a-496e-b2b7-eaf7078b99e0/gettyimages-1310156391.jpg"
  },
  {
    "qr_prefix_enc": "${hash('possum')}",
    "qr_prefix_len": ${"possum".length},
    "reward_description": "You discovered a possum!",
    "reward_title": "vSelf: Tester Badge",
    "reward_uri": "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-139677758-scaled.jpg"
  }],
"start_time": ${start_time}}}' --accountId ${masterAccount}`;

// Start both events the command
if (sh.exec(startEvent1).code === 0) {
  console.log("Test event 1 starts successfully");
}
if (sh.exec(startEvent2).code === 0) {
  console.log("Test event 2 starts successfully");
}

// Some tests
// const event1_id = 319923400; //u32 for now
// const event2_id = 3899876070; //u32 for now
// sh.exec(`near view ${contractName} get_ongoing_events '{"from_index": 0, "limit": 100}' --accountId ${contractName}`);
// sh.exec(`near view ${contractName} get_ongoing_user_events '{"account_id": "${contractName}"}' --accountId ${contractName}`);
// sh.exec(`near view ${contractName} get_event_data '{"event_id": ${eventId}}'`);
// sh.exec(`near view ${contractName} get_event_stats '{"event_id": ${eventId}}'`);
// sh.exec(`near call ${contractName} checkin '{"event_id": ${eventId}, "username": "sergantche.testnet", "request": "Ground control to major Tom" }' --accountId ${masterAccount} --depositYocto 9000000000000000000000 --gas 300000000000000`);
// sh.exec(`near call ${contractName} checkin '{"event_id": ${eventId}, "username": "ilerik.testnet", "request": "Congrats! Now you know more about Web3" }' --accountId ${masterAccount} --depositYocto 9000000000000000000000 --gas 300000000000000`);
// sh.exec(`near call ${contractName} checkin '{"event_id": ${eventId}, "username": "sergantche.testnet", "request": "You have registered in the NEAR community" }' --accountId ${masterAccount} --depositYocto 9000000000000000000000 --gas 300000000000000`);
// sh.exec(`near view ${contractName} get_event_stats '{"event_id": ${eventId}}'`);
// sh.exec(`near view ${contractName} get_user_balance '{"event_id": ${eventId}, "account_id": "ilerik.testnet"}'`);
// sh.exec(`near view ${contractName} get_user_balance '{"event_id": ${eventId}, "account_id": "sergantche.testnet"}'`);
// sh.exec(`near view ${contractName} get_event_actions '{"event_id": ${eventId}, "from_index": 0, "limit": 100}'`);

// exit script with the same code as the build command
process.exit();
