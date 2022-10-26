const sh = require("shelljs");
const fs = require('fs');

const contractName = fs.readFileSync('./neardev/dev-account').toString() || process.env.EVENTS_CONTRACT; 
const masterAccount = process.env.MASTER_ACCOUNT || fs.readFileSync('./neardev/dev-account').toString();

sh.exec(`near view ${contractName} get_owner '{}' --accountId ${masterAccount}`);
sh.exec(`near view ${contractName} get_deposit_amount '{"account_id": "${contractName}"}' --accountId ${masterAccount}`);
sh.exec(`near view ${contractName} get_deposit_amount '{"account_id": "${masterAccount}"}' --accountId ${masterAccount}`);
sh.exec(`near view ${contractName} get_total_deposit '{}' --accountId ${masterAccount}`);
//sh.exec(`near call ${contractName} make_deposit '{"account_id": "${masterAccount}"}' --accountId ${masterAccount} --depositYocto 1 --gas 300000000000000`);
//sh.exec(`near call ${contractName} make_deposit '{"account_id": "${masterAccount}"}' --accountId ${masterAccount} --depositYocto 20000000000000000000000 --gas 300000000000000`);
//sh.exec(`near call ${contractName} decrease_deposit '{"account_id": "${masterAccount}", "amount": "20000000000000000000000"}' --accountId ${masterAccount}`);
//sh.exec(`near call ${contractName} make_deposit '{"account_id": "${masterAccount}"}' --accountId ${masterAccount} --depositYocto 1 --gas 300000000000000`);
//sh.exec(`near view ${contractName} get_deposit_amount '{"account_id": "${contractName}"}' --accountId ${masterAccount}`);
//sh.exec(`near view ${contractName} get_deposit_amount '{"account_id": "${masterAccount}"}' --accountId ${masterAccount}`);
//sh.exec(`near view ${contractName} get_total_deposit '{}' --accountId ${masterAccount}`);
//sh.exec(`near call ${contractName} withdraw '{}' --accountId ${masterAccount}`);
//sh.exec(`near call ${contractName} withdraw_to_owner '{"account_id": "${masterAccount}"}' --accountId ${masterAccount}`);

// exit script with the same code as the build command
process.exit();
