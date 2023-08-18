const { createHash } = require("crypto");

// SHA-256 hash
const hash = (msg) => {
  return createHash("sha256").update(msg).digest("hex");
};

const extractResult = (callResponse) => {
  return callResponse.stdout.split("\n")[1];
};

const extractResultBoolean = (callResponse) => {
  return extractResult(callResponse) == "true";
};

const extractTokenID = (callResponse) => {
  return callResponse.stdout.split("TokenID = ")[1].split("\n")[0];
};

module.exports.hash = hash;
module.exports.extractResult = extractResult;
module.exports.extractResultBoolean = extractResultBoolean;
module.exports.extractTokenID = extractTokenID;
