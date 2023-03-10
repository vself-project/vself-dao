![](https://github.com/vself-project/.github/blob/master/images/vSelf%20community.png)

# vSelf DAO

Current repo contains vSelf smart contracts source code.

Frontend web app & API endpoints are available in this [repo](https://github.com/vself-project/vself-beta).



## Deployment
### SBT events

- [testnet contract](https://explorer.testnet.near.org/accounts/events_v22.sergantche.testnet) deployed at events_v29.sergantche.testnet
- [mainnet contract](https://explorer.near.org/accounts/v3.event.vself.near) deployed at v3.event.vself.near

### Community toolkit

- [testnet contract](https://explorer.testnet.near.org/accounts/communities_v6.sergantche.testnet) deployed at communities_v6.sergantche.testnet)
- mainnent contract comming soon



## Documentation

- [SBT events functionality](https://vself-project.gitbook.io/vself-project-documentation/sbt-collection-toolkit)
- [SBT events rates](https://vself-project.gitbook.io/vself-project-documentation/sbt-collection-toolkit/payment)
- [Community toolkit functionality](https://vself-project.gitbook.io/vself-project-documentation/sbt-collection-toolkit)



## SBT smart contact 

### Synopsis

This contract mints non-transferable NFT (Soul Boud Token) to recipient account on successful checkin (e.g. via claim link or QR-code). 

Each NFT is uniquely identified by a tuple `<event_id>:<reward_inedex>`, where `<reward_index>` is the index the reward from the `<event_id>` collection. 

### Deployment

Compile contract:

```bash
yarn events:build
```

Set values for `EVENTS_CONTRACT` (account on which the contract will be deployed) and `MASTER_ACCOUNT` (account from which the contract subaccount will be created) in `./config/deployment.env`

To deploy into testnet run:

```bash
yarn events:deploy
```

To deploy into mainnet run:

```bash
NEAR_ENV=mainnet yarn events:deploy
```
View method `get_user_balance(event_id: u32, account_id: AccountId)` can be used to get information about one's obtained rewards.

For more details of events smart contract and deployment instructions please refer to [Events](EVENTS.md).
