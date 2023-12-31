<p align="center">
  <img src="https://github.com/vself-project/.github/blob/master/images/vSelf%20community.png" alt="Vself community"/>
</p>

# vSelf DAO

Current repo contains vSelf smart contracts source code. It includes smart contract providing the functionality set up, mint, and distribute NFTs (SBT or transferable) [here](https://github.com/vself-project/vself-dao/tree/events_v2/contracts/events) and one for community management [here](https://github.com/vself-project/vself-dao/tree/events_v2/contracts/communities).

Frontend web app & API endpoints are available in this [repo](https://github.com/vself-project/vself-beta).

## Deployment

### Tokens collection toolkit

- [testnet contract](https://explorer.testnet.near.org/accounts/events_v33.sergantche.testnet) deployed at events_v33.sergantche.testnet
- [mainnet contract](https://nearblocks.io/address/v4.event.vself.near) deployed at v4.event.vself.near

### Community management toolkit

- [testnet contract](https://explorer.testnet.near.org/accounts/communities_v6.sergantche.testnet) deployed at communities_v6.sergantche.testnet
- [mainnet contract](https://nearblocks.io/address/communities_v1.sergantche_dev.near) deployed at communities_v1.sergantche_dev.near

## Documentation

- [SBT events functionality](https://vself-project.gitbook.io/vself-project-documentation/sbt-collection-toolkit)
- [SBT events rates](https://vself-project.gitbook.io/vself-project-documentation/sbt-collection-toolkit/payment)
- [Community toolkit functionality](https://vself-project.gitbook.io/vself-project-documentation/community-management-toolkit)

## NFT collection smart contract

### Synopsis

This contract mints NFT to recipient account on successful checkin (e.g. via claim link or QR-code).

Each token is uniquely identified by a tuple `<event_id>:<reward_index>`, where `<reward_index>` is the index of the reward from the `<event_id>` NFT collection.

### Installation

```bash
#Compile contract
yarn events:build
```

Set values for `EVENTS_CONTRACT` (account on which the contract will be deployed) and `MASTER_ACCOUNT` (account from which the contract subaccount will be created) in `./config/deployment.env`

```bash
#Testnet contract deployment
yarn events:deploy

#Mainnet contract run
NEAR_ENV=mainnet
yarn events:deploy
```

### Data structure

NFT reward

```
struct QuestData {
   qr_prefix: String,
   qr_prefix_len: usize,
   reward_title: String,
   reward_description: String,
   reward_uri: String,
}
```

Event data

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

Settings of NFT collection

```
struct CollectionSettings {
    signin_request: bool,
    transferability: bool,
    limited_collection: bool,
    ambassador_allowed: bool,
}
```

### Call methods

- `start_event(event_data: EventData, collection_settings: CollectionSettings)` runs new event with _event_data_ and _collection_settings_ and returns id of created event.

- `checkin(event_id: u32, username: String, request: String)` checks if the `request` contains _qr_prefix_ as a substring and starts with it. specified in one of the quests of the event with _event_id_. In case of success the contract mints NFT specified in the quest to the NEAR account _username_ owner;

- `stop_event(event_id: u32)` sets event with _event_id_ as inactive disallowing checkins;

### View methods

- `get_ongoing_events(from_index: u64, limit: u64)` returns array of tuples `(event_id: u32, data: EventData, stats: EventStats)` with id, data and stats of active events using pagination. That is, for an event that has not been stopped and whose _finish_time_ has not yet arrived;

- `get_ongoing_user_events(account_id: AccountId)` returns an array of tuples `(event_id: u32, data: EventData, stats: EventStats)` with the id, data, and statistics of active events started by account _account_id_;

- `get_event_data(event_id: u32)` returns _EventData_ for the event with id _event_id_;

- `get_event_stats(event_id: u32)` returns _EventStats_ consisting of some statistics about the event with _event_id_;

- `get_user_balance(event_id: u32, account_id: AccountId)` returns array of boolean values corresponding to array of quests for the event with _event_id_. If _account_id_ made successfull checkin for a quest then value is true and the value is false otherwise;

- `get_event_actions(event_id: u32, from_index: u64, limit: u64)` returns array of data about successful and unsuccessful checkins of the event with _event_id_ with pagination (using _from_index_ and _limit_);

- `get_collection_settings(event_id: u32)` returns collection settings for the event _event_id_;

## Community smart contact

### Synopsis

This contract is responsible for creating community, on-chain managing community metadata & community members.

Currently it holds explicit list of membeship commitments for every community created.

Each user can create any number of communities under her control.

### Installation

```bash
#Compile contract
yarn communities:build
```

Set values for `COMMUNITIES_CONTRACT` (account on which the contract will be deployed) and `MASTER_ACCOUNT` (account from which the contract subaccount will be created) in `./config/deployment.env`

```bash
#Testnet run
yarn communities:deploy
```

```bash
#Mainnet run
NEAR_ENV=mainnet
yarn communities:deploy
```

### Data structure

Community metadata

```
struct CommunityData {
    community_owner: AccountId,
    community_name: String,
    community_description: String,
    community_source_image: String,
}
```

Communities with their metadata and public & private members

```
struct Contract {
    members_by_community: LookupMap<String, Vec<String>>,
    public_members_by_community: LookupMap<String, HashMap<String, AccountId>>,
    communities: UnorderedMap<String, CommunityData>
}
```

### Call methods

- `add_community(community_data: CommunityData)`creates new community & returns the _community_id_.
- `remove_community(community_id: String)` delates community with _community_id_.
- `add_member(community_id: String, commitment: String)` adds new member with _commitment_ in community with _community_id_.
- `add_public_member(community_id: String, commitment: String, near_id: AccountId)` discloses the _near_id_ of the member with _commitment_.

### View methods

- `get_community_list(from_index: usize, limit: usize)` returns _community_id_ & community metadata for each community.
- `get_community(community_id: String)` returns community metadata and its public & private members.
