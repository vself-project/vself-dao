# vSelf Events Contract

A contract which mints non-transferable NFT (soulboud token) to recipient account on successful checkin (e.g. via claim link). Each NFT is uniquely identified by a tuple `<event_id>:<reward_inedex>`, where `<reward_index>` is an index of reward, in case many different rewards set up during the start of specific event. View method `get_user_balance(event_id: u32, account_id: AccountId)` can be used to get information about one's obtained rewards.

## Deployment

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

To run simulation tests:

## Contract methods

### Methods that change the state of the contract:

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
