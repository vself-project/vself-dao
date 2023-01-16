// First, import some helper libraries. `shelljs` is included in the
// devDependencies of the root project, which is why it's available here. It
// makes it easy to use *NIX-style scripting (which works on Linux distros,
// macOS, and Unix systems) on Windows as well.
const sh = require("shelljs");

const contractName =
  process.env.POW_CONTRACT ||
  fs.readFileSync("./neardev/dev-account").toString();
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

// Near cashback
sh.exec(`near send ${contractName} sergantche.testnet 100`);

// Copy credentials for later use
sh.exec(`cp ~/.near-credentials/testnet/${contractName}.json ./creds`);

// Exit script with the same code as the build command
process.exit(code);
