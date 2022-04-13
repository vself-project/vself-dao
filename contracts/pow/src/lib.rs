use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::Vector;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, log, near_bindgen, AccountId, BorshStorageKey, PanicOnDefault};

mod constants;
pub mod views;

#[derive(Clone, BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct EvidenceData {
    media_hash: String,
    metadata: String,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId, // Owner ID
    evidence: Vector<EvidenceData>,
}

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    Evidence,
}

#[near_bindgen]
impl Contract {
    /// Initializes the contract owned by `owner_id`
    #[init]
    pub fn new() -> Self {
        assert!(!env::state_exists(), "Already initialized");
        let owner_id = env::current_account_id(); // Who deployed owns

        Self {
            owner_id: owner_id,
            evidence: Vector::new(StorageKey::Evidence),
        }
    }

    /// Upload evidence fingerprint to blochchain
    #[payable]
    pub fn upload_evidence(&mut self, evidence: EvidenceData) {
        let timestamp: u64 = env::block_timestamp();
        self.evidence.push(&evidence);
    }
}
