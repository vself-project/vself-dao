#!/bin/bash
set -e

ID=pow_v1c.sergantche.testnet

# create subaccount
# near delete $ID ilerik.testnet # uncomment to delete old account
near create-account $ID --masterAccount=sergantche.testnet --initial-balance 10

# deploy contract
near deploy --wasmFile contracts/target/wasm32-unknown-unknown/release/near_backend.wasm --accountId $ID
near call $ID new --accountId $ID

# copy credentials for later deploy
cp ~/.near-credentials/testnet/$ID.json ./creds
