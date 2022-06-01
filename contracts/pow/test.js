// First, import some helper libraries. `shelljs` is included in the
// devDependencies of the root project, which is why it's available here. It
// makes it easy to use *NIX-style scripting (which works on Linux distros,
// macOS, and Unix systems) on Windows as well.
const sh = require("shelljs");
const fs = require("fs");
const contractName =
  process.env.POW_CONTRACT ||
  fs.readFileSync("./neardev/dev-account").toString();
const ownerAccount =
  process.env.MASTER_ACCOUNT ||
  fs.readFileSync("./neardev/dev-account").toString();

// Test admin management
console.log("..................................");
console.log("Evidences amount");
sh.exec(`near view ${contractName} get_evidences_amount`);
console.log("..................................");

// Check if the event has already been started and call start_event if it hasn't
console.log("..................................");
console.log("Send evidence ");
sh.exec(`near call ${contractName} upload_evidence '{"evidence": {
  "media_hash": "keepyoumotivatedwhileyoulearn",
  "metadata": "preloaded"
}}' --accountId ${ownerAccount}`);

console.log("..................................");
console.log("Evidences amount");
sh.exec(`near view ${contractName} get_evidences_amount`);
sh.exec(
  `near view ${contractName} get_evidences '{"from_index": ${0}, "limit": ${10}}'`
);
console.log("..................................");

// Exit script with the same code as the build command
process.exit();
