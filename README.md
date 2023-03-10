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

Each SBT is uniquely identified by a tuple `<event_id>:<reward_inedex>`, where `<reward_index>` is the index the reward from the `<event_id>` SBT collection. 

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
NEAR_ENV=mainnet 
yarn events:deploy
```
### Data structure
SBT reward
```
struct QuestData {
   qr_prefix_enc: String,
   qr_prefix_len: usize,
   reward_title: String,
   reward_description: String,
   reward_uri: String,
}
```
SBT collection
```
struct EventData {
    event_name: String,
    event_description: String,
    start_time: u64,
    finish_time: u64,
    quests: Vec<QuestData>,
}
```
Collection stats 
```
struct EventStats {
    participants: HashSet<AccountId>,
    created_by: AccountId,
    created_at: u64,
    stopped_at: Option<u64>,
    total_rewards: u64,
    total_users: u64,
    total_actions: u64,
}
```  
### Change state methods

- `start_event(event_data: EventData)` runs new event with _event_data_ and returns id of created event. _EventData_ consists of following fields: _event_name_, _event_description_, _start_time_, _finish_time_ and _quests_. _quests_ is an array of _QuestData_ that contains the data about a specific quest;

- `checkin(event_id: u32, username: String, request: String)` checks if the `sha256(request)` matches the value _qr_prefix_enc_ specified in one of the quests of the event with id _event_id_. In case of success the contract mints non transferable NFT specified in the quest and sets NEAR account _username_ as its owner;

- `stop_event(event_id: u32)` set event with id _event_id_ as inactive disallowing checkins;

### View methods:

- `get_ongoing_events(from_index: u64, limit: u64)` returns array of tuples `(event_id: u32, data: EventData, stats: EventStats)` with id, data and stats of active events using pagination. That is, for an event that has not been stopped and whose _finish_time_ has not yet arrived;

- `get_ongoing_user_events(account_id: AccountId)` returns an array of tuples `(event_id: u32, data: EventData, stats: EventStats)` with the id, data, and statistics of active events started by account _account_id_;

- `get_event_data(event_id: u32)` returns _EventData_ for the event with id _event_id_;

- `get_event_stats(event_id: u32)` returns _EventStats_ consisting of some statistics about the event with id _event_id_;

- `get_user_balance(event_id: u32, account_id: AccountId)` returns array of boolean values corresponding to array of quests for the event with _event_id_. If _account_id_ made successfull checkin for a quest then value is true and the value is false otherwise;

- `get_event_actions(event_id: u32, from_index: u64, limit: u64)` returns array of data about successful and unsuccessful checkins of the event with id _event_id_ with pagination (using _from_index_ and _limit_);

For more details of events smart contract and deployment instructions please refer to [Events](EVENTS.md).
