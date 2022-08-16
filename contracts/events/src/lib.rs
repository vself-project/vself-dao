use near_contract_standards::non_fungible_token::metadata::{
    NFTContractMetadata, NFT_METADATA_SPEC,
  };
use near_contract_standards::non_fungible_token::{NonFungibleToken};
use near_sdk::json_types::Base64VecU8;
use near_sdk::serde_json::json;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, log, near_bindgen, PanicOnDefault, AccountId, BorshStorageKey};
use near_sdk::collections::{ LookupMap, LazyOption, Vector, UnorderedSet, UnorderedMap };
use std::collections::HashSet;

mod constants;
pub mod views;
pub mod nft;

use near_sdk::ONE_YOCTO;
use constants::SINGLE_CALL_GAS;

/// It's used to compute event id (start_event function)
fn read_be_u32(input: &mut &[u8]) -> u32 {
    let (int_bytes, rest) = input.split_at(std::mem::size_of::<u32>());
    *input = rest;
    u32::from_be_bytes(int_bytes.try_into().unwrap())
}

#[derive(Clone)]
#[derive(Debug)]
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct QuestData {
    pub qr_prefix_enc: String,
    pub qr_prefix_len: usize,    
    pub reward_title: String,
    pub reward_description: String,
    pub reward_uri: String,
}

/// Current event data
#[derive(Clone)]
#[derive(Debug)]
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct EventData {
    event_name: String,
    event_description: String,
    start_time: u64,
    finish_time: u64,
    quests: Vec<QuestData>,
}

/// Current event data
#[derive(Clone)]
#[derive(Debug)]
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct EventStats {               
    participants: HashSet<AccountId>, // Participants of current event
    start_time: u64,
    finish_time: Option<u64>,
    total_rewards: u64,
    total_users: u64,
    total_actions: u64,
}

#[derive(Clone)]
#[derive(Debug, BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ActionData {
    timestamp: u64,
    username: String,
    qr_string: String,
    reward_index: usize,    
}

#[derive(Clone)]
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ActionResult {
    index: usize,
    got: bool,
    title: String,
    description: String,
}

/// This is format of output via JSON for the user balance.
#[derive(Clone)]
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct UserBalance {
    pub karma_balance: u64,
    pub quests_status: Vec<bool>,
}

/// Single event
#[derive(Debug, BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Event {
    pub nonce: u32, // Id
    pub data: EventData,
    pub stats: EventStats,    
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    authors: UnorderedSet<AccountId>, // Approved list of authors
    public_events: UnorderedSet<u32>, // List of public events (premoderated)
    ongoing_events: LookupMap<AccountId, HashSet<u32>>, // List of ongoing events by owner account
    events: UnorderedMap<u32, Event>, // All events data and stats

    // NFT implementation
    tokens: NonFungibleToken,
    metadata: LazyOption<NFTContractMetadata>,
    
    // Event statistics and history (event_id -> actions)
    actions: LookupMap<u32, Vector<ActionData>>, // History of all user actions
    // Balance sheet for each user (event_id -> account_id -> balance)
    balances: LookupMap<u32, LookupMap<AccountId, UserBalance>>,
}

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    ActionsRoot,
    BalancesRoot,
    Actions { event_id: u32 },
    Balances { event_id: u32 },
    Authors,
    PublicEvents,
    Events,
    Ongoing,
    NonFungibleToken,
    Metadata,
    TokenMetadata,
    Enumeration,
    Approval,
        
}

// Contract NFT metadata
use constants::DATA_IMAGE_SVG_NEAR_ICON;
use constants::BASE_URI;

#[near_bindgen]
impl Contract {
    /// Initializes the contract owned by `owner_id` with
    /// default metadata (for example purposes only).    
    #[init]
    pub fn new() -> Self {        
        assert!(!env::state_exists(), "Already initialized");

        // Common metadata for all minted SBT
        let metadata = NFTContractMetadata {
            spec: NFT_METADATA_SPEC.to_string(),
            name: "vSelf Events SBTs".to_string(),
            symbol: "VSELF".to_string(),
            icon: Some(DATA_IMAGE_SVG_NEAR_ICON.to_string()),
            base_uri: Some(BASE_URI.to_string()),
            reference: None,
            reference_hash: None,
        };
        metadata.assert_valid();        

        // Init
        Self {
            authors: UnorderedSet::new(StorageKey::Authors), // Approved list of authors
            public_events: UnorderedSet::new(StorageKey::PublicEvents), // List of public events (premoderated)                        
            ongoing_events: LookupMap::new(StorageKey::Ongoing),
            events: UnorderedMap::new(StorageKey::Events),
            actions: LookupMap::new(StorageKey::ActionsRoot),
            balances: LookupMap::new(StorageKey::BalancesRoot),
            tokens: NonFungibleToken::new(
                StorageKey::NonFungibleToken,
                env::predecessor_account_id(),
                Some(StorageKey::TokenMetadata),
                Some(StorageKey::Enumeration),
                Some(StorageKey::Approval),
            ),
            metadata: LazyOption::new(StorageKey::Metadata, Some(&metadata)),            
        }
    }
    
    /// Initiate next event 
    #[payable]
    pub fn start_event(&mut self, event_data: EventData) -> u32 {
        // assert add checks TO DO
        let user_id = env::predecessor_account_id();
        let timestamp: u64 = env::block_timestamp();
        let hash: Vec<u8> = env::sha256(&event_data.try_to_vec().unwrap());
        log!("{:?}", hash);
        let nonce: u32 = read_be_u32(&mut hash.as_slice());

        let initial_stats = EventStats {
            participants: HashSet::new(),
            start_time: timestamp,
            finish_time: None,
            total_rewards: 0,
            total_users: 0,
            total_actions: 0,
        };

        // Empty history of event actions and user balances //https://www.near-sdk.io/contract-structure/nesting
        self.actions.insert(&nonce, &Vector::new(StorageKey::Actions { event_id: nonce }));
        self.balances.insert(&nonce, &LookupMap::new(StorageKey::Balances { event_id: nonce }));

        // Create new event
        let event = Event {
            nonce, // Unique event ID
            data: event_data,
            stats: initial_stats,            
        };

        // Update index by user
        let mut user_events = self.ongoing_events.get(&user_id).unwrap_or(HashSet::new());
        user_events.insert(nonce);
        self.ongoing_events.insert(&user_id, &user_events);

        // Update public events set // TO DO check author
        self.public_events.insert(&nonce);
        
        // Add event to the list
        self.events.insert(&nonce, &event);
        log!("Successfully strated by {} an event with id {}", user_id, nonce);

        nonce // return event_id = nonce
    }

    /// Stop and put event to archive (only for an owner of event)
    #[payable]
    pub fn stop_event(&mut self, event_id: u32) {
        // asserts and checks TO DO
        let user_id = env::predecessor_account_id();
        let timestamp: u64 = env::block_timestamp();

        // Remove from public events set
        self.public_events.remove(&event_id);

        // Remove from user ongoing events
        let mut user_events = self.ongoing_events.get(&user_id).unwrap();
        user_events.remove(&event_id);
        self.ongoing_events.insert(&user_id, &user_events);

        // Fix actual finish time
        let mut event = self.events.get(&event_id).unwrap();
        event.stats.finish_time = Some(timestamp);
        self.events.insert(&event_id, &event);
    }

    #[payable]
    pub fn checkin(&mut self, event_id: u32, username: String, request: String) -> Option<ActionResult> {
        // Assert event is active        
        let timestamp: u64 = env::block_timestamp();
        let mut event = self.events.get(&event_id).unwrap();
        assert!( event.data.finish_time > timestamp, "No event with this id is running" );

        // Check if account seems valid
        assert!( AccountId::try_from(username.clone()).is_ok(), "Valid account is required" );
        let user_account_id = AccountId::try_from(username.clone()).unwrap();
                        
        // Match QR code to quest
        let qr_string = request.clone();        
        let quests = event.data.quests.clone();
        let mut reward_index = 0;
        for quest in &quests {
            if let Some(request_prefix) = request.get(0..quest.qr_prefix_len) {
                let hashed_input = env::sha256(request_prefix.as_bytes());
                let hashed_input_hex = hex::encode(&hashed_input);
                if hashed_input_hex == quest.qr_prefix_enc { break };
            }         
            reward_index = reward_index + 1;            
        }
        
        let action_data = ActionData {
            username: username.clone(),
            qr_string: qr_string.clone(),
            reward_index,
            timestamp,
        };       

        log!("Action data: {:?}", action_data);

        // Register checkin data        
        let mut stats = event.stats.clone();

        // Check if we have a new user
        if stats.participants.insert(user_account_id.clone()) {
            stats.total_users += 1;
            
            // Initial balance
            self.balances.get(&event_id).unwrap().insert(&user_account_id, &UserBalance {
                karma_balance: 0,
                quests_status: vec![false; quests.len()],
            });
        }

        // Register action 
        let mut actions = self.actions.get(&event_id).unwrap();
        actions.push(&action_data);
        stats.total_actions += 1;

        // Update contract state
        self.actions.insert(&event_id, &actions);                

        // Check if we've been awarded a reward
        if let Some(quest) = quests.get(reward_index) {  
            // Update state if we are lucky          
            stats.total_rewards += 1;
            event.stats = stats;

            // Update user balance
            let mut balance = self.balances.get(&event_id).unwrap().get(&user_account_id).expect("ERR_NOT_REGISTERED");
            balance.karma_balance += 1; // Number of successfull actions

            // If karma is full issue uber NFT TO DO
            //if balance.karma_balance == quests.len() {
                // self.issue_nft_reward(user_account_id.clone(), event_id.clone(), reward_index.clone());
            //}

            // Do we have this reward already            
            if balance.quests_status[reward_index] { // Yes (no reward then)
                self.events.insert(&event_id, &event);
                
                return Some(ActionResult {
                    index: reward_index,
                    got: true,
                    title: quest.reward_title.clone(),
                    description: quest.reward_description.clone(),
                });                
            } else { // No
                balance.quests_status[reward_index] = true;
                self.balances.get(&event_id).unwrap().insert(&user_account_id, &balance);

                // NFT Part (issue token)
                self.issue_nft_reward(user_account_id.clone(), event_id.clone(), reward_index.clone());

                self.events.insert(&event_id, &event);
                return Some(ActionResult {
                    index: reward_index,
                    got: false,
                    title: quest.reward_title.clone(),
                    description: quest.reward_description.clone(),
                });
            }                                     
        } else {
            // Update stats
            event.stats = stats;   
            log!("No reward for this checkin! User: {}", username);
            self.events.insert(&event_id, &event);
            None
        }
    }
}