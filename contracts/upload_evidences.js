// First, import some helper libraries. `shelljs` is included in the
// devDependencies of the root project, which is why it's available here. It
// makes it easy to use *NIX-style scripting (which works on Linux distros,
// macOS, and Unix systems) on Windows as well.
const sh = require("shelljs");
const fs = require("fs");
const contractName =
  process.env.CONTRACT_NAME ||
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
console.log("Send evidences ");
// #1
sh.exec(`near call ${contractName} upload_evidence '{"evidence": {
  "media_hash": "99db50f86507b2756183d829efc86eb70357d37c186e583cfb6979cfdcfab89e",
  "metadata": "preloaded"
}}' --accountId ${ownerAccount}`);

// #2
sh.exec(`near call ${contractName} upload_evidence '{"evidence": {
  "media_hash": "4e00110557e83f12f8dfa28a62d3e9ca0e364859f0dbe984e605a165de4ffc7a",
  "metadata": "preloaded"
}}' --accountId ${ownerAccount}`);

// #3
sh.exec(`near call ${contractName} upload_evidence '{"evidence": {
  "media_hash": "5ae03c532ff376172511940f2dc08b2898eca8342168f3d8cc384f07951bd859",
  "metadata": "preloaded"
}}' --accountId ${ownerAccount}`);

// #4
sh.exec(`near call ${contractName} upload_evidence '{"evidence": {
  "media_hash": "7e907833c6233ff27c5f928fd1c60cf5112381675258925c1676b5a3a2231835",
  "metadata": "preloaded"
}}' --accountId ${ownerAccount}`);

// #5
sh.exec(`near call ${contractName} upload_evidence '{"evidence": {
  "media_hash": "9a7516f8e2edf3d13e04e66d3eb8de4cd236e66f49a513e8a5b9b247906af72b",
  "metadata": "preloaded"
}}' --accountId ${ownerAccount}`);

// #6
sh.exec(`near call ${contractName} upload_evidence '{"evidence": {
  "media_hash": "395addc5cdbf628e273e3e059c16c08dcb65d432848756d35ab898742177ecd4",
  "metadata": "preloaded"
}}' --accountId ${ownerAccount}`);

// #7
sh.exec(`near call ${contractName} upload_evidence '{"evidence": {
  "media_hash": "1778955f366bb24ca9f1ca74646768ad44c419cc8cb31dfd19ea38f1ab158369",
  "metadata": "preloaded"
}}' --accountId ${ownerAccount}`);

// #8
sh.exec(`near call ${contractName} upload_evidence '{"evidence": {
  "media_hash": "9825679226b72456cd082d75bbd6a845d8ceadfa506fcc978b30f54723db6b78",
  "metadata": "preloaded"
}}' --accountId ${ownerAccount}`);

// #9
sh.exec(`near call ${contractName} upload_evidence '{"evidence": {
  "media_hash": "69407975431f5177f7e9bb3252a399669192bdf007da1cb524a023bcc30d9dc5",
  "metadata": "preloaded"
}}' --accountId ${ownerAccount}`);

// #10
sh.exec(`near call ${contractName} upload_evidence '{"evidence": {
  "media_hash": "e56824cfb04e44dd3115db9dc47811eda59b1cd692a2a8a494c2b09145b68b85",
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
