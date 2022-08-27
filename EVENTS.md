# vSelf Events Contract

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
- `start_event(event_data: EventData)` runs new event with *event_data* and returns id of created event. *EventData* consists of following fields: *event_name*, *event_description*, *start_time*, *finish_time* and *quests*. *quests* is an array of *QuestData* that contains the data about a specific quest;

- `checkin(event_id: u32, username: String, request: String)` checks if the `sha256(request)` matches the value *qr_prefix_enc* specified in one of the quests of the event with id *event_id*. In case of success the contract mints non transferable NFT specified in the quest and sets NEAR account *username* as its owner;

- `stop_event(event_id: u32)` set event with id *event_id* as inactive disallowing checkins;

### View methods:

- `get_ongoing_events(from_index: u64, limit: u64)` returns array of tuples `(event_id: u32, data: EventData, stats: EventStats)` with id, data and stats of active events using pagination. That is, for an event that has not been stopped and whose *finish_time* has not yet arrived;

- `get_ongoing_user_events(account_id: AccountId)` returns an array of tuples `(event_id: u32, data: EventData, stats: EventStats)` with the id, data, and statistics of active events started by account *account_id*;

- `get_event_data(event_id: u32)` returns *EventData* for the event with id *event_id*;

- `get_event_stats(event_id: u32)` returns *EventStats* consisting of some statistics about the event with id *event_id*;

- `get_user_balance(event_id: u32, account_id: AccountId)` returns array of boolean values corresponding to array of quests for the event with *event_id*. If *account_id* made successfull checkin for a quest then value is true and the value is false otherwise;

- `get_event_actions(event_id: u32, from_index: u64, limit: u64)` returns array of data about successful and unsuccessful checkins of the event with id *event_id* with pagination (using *from_index* and *limit*);
