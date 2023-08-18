const sh = require("shelljs");
const fs = require("fs");

const contractName =
  process.env.EVENTS_CONTRACT ||
  fs.readFileSync("./neardev/dev-account").toString();
const masterAccount =
  process.env.MASTER_ACCOUNT ||
  fs.readFileSync("./neardev/dev-account").toString();

// Start default event (time in 1 billionth of second)
const start_time = 1681724813000000000; // 17.04
const end_time = start_time + 30 * 24 * 60 * 60 * 1000000000; // + month

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

// Run start of both events
if (sh.exec(startEventVself).code === 0) {
  console.log("Event startEventVself begins");
}
if (sh.exec(startEventAnimals).code === 0) {
  console.log("Test event begins");
}
sh.exec(
  `near view ${contractName} get_ongoing_events '{"from_index": 0, "limit": 100}' --accountId ${contractName}`
);

// exit script with the same code as the build command
process.exit();
