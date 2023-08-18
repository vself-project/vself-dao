const sh = require("shelljs");
const fs = require("fs");

const { extractTokenID, extractResult } = require("./utils");

const contractName =
  //fs.readFileSync("./neardev/dev-account").toString() ||
  process.env.EVENTS_CONTRACT;
const masterAccount = process.env.MASTER_ACCOUNT;

// Start default event (time in 1 billionth of second)
const start_time = 1681724813000000000; // 17.04
const end_time = start_time + 365 * 24 * 60 * 60 * 1000000000; // + year
const pased_end_time = start_time + 60 * 1000000000; // + minute

// Start default event "Vself Onboarding"
const startEventVself = `near call ${contractName} start_event '{"event_data": {
  "event_description":
  "vSelf launches a series of quests which will keep you motivated while you learn about our project and its place inside NEAR ecosystem",
  "event_name": "vSelf Onboarding Metabuild Quest",
  "finish_time": ${end_time},
  "quests": [{
    "qr_prefix": "https://vself-dev.web.app/vself.apk",
    "qr_prefix_len": ${"https://vself-dev.web.app/vself.apk".length},
    "reward_description": "Welcome to the vSelf demo!",
    "reward_title": "vSelf: Welcome Badge",
    "reward_uri": "/nft1.png"
  },
  {
    "qr_prefix": "You have registered in the NEAR community",
    "qr_prefix_len": ${"You have registered in the NEAR community".length},
    "reward_description": "You have registered in the NEAR community",
    "reward_title": "vSelf: NEAR User Badge",
    "reward_uri": "/nft2.png"
  },
  {
    "qr_prefix": "Congrats! Now you know more about Web3",
    "qr_prefix_len": ${"Congrats! Now you know more about Web3".length},
    "reward_description": "Congrats! Now you know more about Web3",
    "reward_title": "vSelf: Early Adopter Badge",
    "reward_uri": "/nft3.png"
  },
  {
    "qr_prefix": "Thank you <3 and see you soon!",
    "qr_prefix_len": ${"Thank you <3 and see you soon!".length},
    "reward_description": "Thank you <3 and see you soon!",
    "reward_title": "vSelf: Metabuidl Badge",
    "reward_uri": "/nft4.png"
  }],
"start_time": ${start_time}},
"collection_settings": {
  "signin_request": ${true},
  "transferability": ${true},
  "limited_collection": ${true},
  "ambassador_allowed": ${true}
}}' --accountId ${masterAccount}`;

// Start default event "Animals"
const startEventAnimals = `near call ${contractName} start_event '{"event_data": {
  "event_description":
  "Test event",
  "event_name": "Animals",
  "finish_time": ${end_time},
  "quests": [{
    "qr_prefix": "cat",
    "qr_prefix_len": ${"cat".length},
    "reward_description": "You discovered a cat!",
    "reward_title": "vSelf: Tester Badge",
    "reward_uri": "https://i.pinimg.com/736x/98/16/ee/9816ee545b0f22fed08d3e120fdd48d7--jungle-cat-a-tiger.jpg"
  },
  {
    "qr_prefix": "dog",
    "qr_prefix_len": ${"dog".length},
    "reward_description": "You discovered a dog!",
    "reward_title": "vSelf: Tester Badge",
    "reward_uri": "https://breed-assets.wisdompanel.com/dog/street-dog-india/Indian_Street_Dog_Color.png"
  },
  {
    "qr_prefix": "possum",
    "qr_prefix_len": ${"possum".length},
    "reward_description": "You discovered a possum!",
    "reward_title": "vSelf: Tester Badge",
    "reward_uri": "https://i.pinimg.com/550x/43/e2/26/43e226270cbc24c2fd7efeff710da7d1.jpg"
  }],
"start_time": ${start_time}},
"collection_settings": {
  "signin_request": ${false},
  "transferability": ${false},
  "limited_collection": ${false},
  "ambassador_allowed": ${false}
}}' --accountId ${masterAccount}`;

// Start event that already finished
const startFinishedEvent = `near call ${contractName} start_event '{"event_data": {
  "event_description":
  "Test finished event",
  "event_name": "Test event",
  "finish_time": ${pased_end_time},
  "quests": [{
    "qr_prefix": "hello",
    "qr_prefix_len": ${"hello".length},
    "reward_description": "Welcome to the test!",
    "reward_title": "vSelf: Tester Badge",
    "reward_uri": "https://us.123rf.com/450wm/oksanastepova/oksanastepova1805/oksanastepova180500047/102167642-hello-unique-hand-drawn-nursery-poster-with-lettering-in-scandinavian-style-vector-illustration-.jpg?ver=6"
  },
  {
    "qr_prefix": "goodbye",
    "qr_prefix_len": ${"goodbye".length},
    "reward_description": "Welcome to the test!",
    "reward_title": "vSelf: Tester Badge",
    "reward_uri": "https://www.wallquotes.com/sites/default/files/entr0054_01.jpg"
  }],
"start_time": ${start_time}}}' --accountId ${masterAccount}`;

// Start all events
if (sh.exec(startEventVself).code === 0) {
  console.log("Start Vself Onboarding event");
}
if (sh.exec(startEventAnimals).code === 0) {
  console.log("Start test event");
}
// if (sh.exec(startFinishedEvent).code === 0) {
//   console.log("Start finished event");
// }

// Some tests
const eventId1 = 389418135;
const eventId2 = 3666939948;
const finishedEventId = 1816186509;
sh.exec(
  `near view ${contractName} get_ongoing_events '{"from_index": 0, "limit": 100}' --accountId ${contractName}`
);

// // Check collection settings
sh.exec(
  `near view ${contractName} get_collection_settings '{"event_id": ${eventId1}}' --accountId ${contractName}`
);

// Failed checkin because the collection is limited
// sh.exec(
//   `near call ${contractName} checkin '{"event_id": ${eventId1}, "username": "${masterAccount}", "request": "https://vself-dev.web.app/vself.apk" }' --accountId ${contractName} --depositYocto 10000000000000000000000 --gas 300000000000000`
// );

// Successfull checkins
// sh.exec(
//   `near call ${contractName} checkin_with_ambassador '{"event_id": ${eventId1}, "username": "${masterAccount}", "request": "Congrats! Now you know more about Web3", "ambassador": "ilerik.testnet" }' --accountId ${masterAccount} --depositYocto 10000000000000000000000 --gas 300000000000000`
// );
// let token_id = sh.exec(
//   `near call ${contractName} checkin '{"event_id": ${eventId1}, "username": "jkahfkjashdfs.testnet", "request": "https://vself-dev.web.app/vself.apk" }' --accountId ${masterAccount} --depositYocto 10000000000000000000000 --gas 300000000000000`
// );
// token_id = extractTokenID(token_id);

// // Check event stats, data and user balance
// sh.exec(
//   `near view ${contractName} get_event_stats '{"event_id": ${eventId1}}'`
// );
// sh.exec(
//   `near view ${contractName} get_event_actions '{"event_id": ${eventId1}, "from_index": 0, "limit": 100}'`
// );
// sh.exec(
//   `near view ${contractName} get_user_balance '{"event_id": ${eventId1}, "account_id": "jkahfkjashdfs.testnet"}'`
// );

// // Successfull transfer
// sh.exec(
//   `near call ${contractName} nft_transfer '{"receiver_id": "jkahfkjashdfs.testnet", "token_id": "${token_id}"}' --accountId ${masterAccount} --depositYocto 1`
// );
// sh.exec(`near view ${contractName} nft_token '{"token_id": "${token_id}"}'`);

// // Check second collection settings
// console.log("!!!Second collection!!!");
// sh.exec(
//   `near view ${contractName} get_collection_settings '{"event_id": ${eventId2}}' --accountId ${contractName}`
// );

// // Successfull checkins
// sh.exec(
//   `near call ${contractName} checkin_with_ambassador '{"event_id": ${eventId2}, "username": "jkahfkjashdfs.testnet", "request": "possum", "ambassador": "ilerik.testnet" }' --accountId ${contractName} --depositYocto 10000000000000000000000 --gas 300000000000000`
// );
// token_id = sh.exec(
//   `near call ${contractName} checkin '{"event_id": ${eventId2}, "username": "${masterAccount}", "request": "dog" }' --accountId ${masterAccount} --depositYocto 10000000000000000000000 --gas 300000000000000`
// );
// token_id = extractTokenID(token_id);

// // Check event stats, data and user balance
// sh.exec(
//   `near view ${contractName} get_event_stats '{"event_id": ${eventId2}}'`
// );
// sh.exec(
//   `near view ${contractName} get_event_actions '{"event_id": ${eventId2}, "from_index": 0, "limit": 100}'`
// );
// sh.exec(
//   `near view ${contractName} get_user_balance '{"event_id": ${eventId2}, "account_id": "jkahfkjashdfs.testnet"}'`
// );

// // Failed transfer
// sh.exec(`near view ${contractName} nft_token '{"token_id": "${token_id}"}'`);
// sh.exec(
//   `near call ${contractName} nft_transfer '{"receiver_id": "jkahfkjashdfs.testnet", "token_id": "${token_id}"}' --accountId ${masterAccount} --depositYocto 1`
// );
// sh.exec(`near view ${contractName} nft_token '{"token_id": "${token_id}"}'`);

// exit script with the same code as the build command
process.exit();
