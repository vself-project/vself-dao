mod constants;

use near_contract_standards::non_fungible_token::{Token, TokenId, NonFungibleToken};
use near_contract_standards::non_fungible_token::metadata::{
    NFTContractMetadata, NonFungibleTokenMetadataProvider, TokenMetadata, NFT_METADATA_SPEC,
  };

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{
    env, log, near_bindgen, PanicOnDefault, AccountId, BorshStorageKey, Promise, PromiseOrValue
};
use near_sdk::collections::{ LazyOption };
use near_sdk::json_types::Base64VecU8;
use near_sdk::serde_json::json;

pub use constants::{BASE_URI, DATA_IMAGE_SVG_NEAR_ICON, ONE_NEAR, ONE_YOCTO, SINGLE_CALL_GAS};

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    NonFungibleToken,
    Metadata,
    TokenMetadata,
    Enumeration,
    Approval,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    // NFT implementation
    tokens: NonFungibleToken,
    metadata: LazyOption<NFTContractMetadata>,
}

#[near_bindgen]
impl Contract {
    /// Initializes the contract owned by `owner_id` with
    /// default metadata (for example purposes only).
    #[init]
    pub fn new() -> Self {
        assert!(!env::state_exists(), "Already initialized");
        let owner_id = env::current_account_id(); // Who deployed owns

        let metadata = NFTContractMetadata {
            spec: NFT_METADATA_SPEC.to_string(),
            name: "HASHD0X reward NFT".to_string(),
            symbol: "HSHDX".to_string(),    // TODO ask main developer
            icon: Some(DATA_IMAGE_SVG_NEAR_ICON.to_string()),    // TO DO ask Kraft
            base_uri: Some(BASE_URI.to_string()),    // TODO ask main developer
            reference: None,
            reference_hash: None,
        };
        metadata.assert_valid();

        Self {
            owner_id: owner_id.clone().into(),
            tokens: NonFungibleToken::new(
                StorageKey::NonFungibleToken,
                owner_id,
                Some(StorageKey::TokenMetadata),
                Some(StorageKey::Enumeration),
                Some(StorageKey::Approval),
            ),
            metadata: LazyOption::new(StorageKey::Metadata, Some(&metadata)),
        }                
    }

    /// Mint nft ans send it to `username` account
    #[payable]
    pub fn send_reward(&mut self, username: String) -> TokenId {
        // Generate token_id
        let timestamp: u64 = env::block_timestamp();
        let rand: u8 = *env::random_seed().get(0).unwrap();
        let token_id: String = format!("{}:{}", rand, timestamp);
        log!("token id: {}", token_id.clone());

        let contract_id = env::current_account_id();
        let root_id = AccountId::try_from(contract_id).unwrap();
        
        // TODO media url and media hash
        let media_url: String = String::from("image_url");
        let media_hash = Base64VecU8(env::sha256(media_url.as_bytes()));

        // Default to common token
        let token_metadata = TokenMetadata {
            title: Some(String::from("HASHD0X reward")),
            description: Some(String::from("HASHD0X reward description")),
            media: Some(media_url),
            media_hash: Some(media_hash),
            copies: Some(1u64),
            issued_at: Some(timestamp.to_string()),
            expires_at: None,
            starts_at: None,
            updated_at: None,
            extra: None,
            reference: None,
            reference_hash: None,
        };

        // Mint NFT
        // TODO ask main developer about mint + transfer
        self.nft_mint(token_id.clone(), root_id.clone(), token_metadata.clone());

        // Transfer NFT to new owner
        log!("username: {}", username.clone());
        let receiver_id = AccountId::try_from(username).unwrap();
        log!("receiver id: {}", receiver_id.clone());
        log!("token_id: {}", token_id.clone());
        env::promise_create(
            root_id,
            "nft_transfer",
            json!({
                "token_id": token_id.clone(),
                "receiver_id": receiver_id,
            })
            .to_string()
            .as_bytes(),
            ONE_YOCTO,  // TODO ask main developer
            SINGLE_CALL_GAS,
        );
        log!("Success! NFT transfering for {}! Token ID = {}", receiver_id.clone(), token_id.clone());
        token_id
    }

    /// Mint a new token with ID=token_id belonging to receiver_id.
    ///
    /// Since this example implements metadata, it also requires per-token metadata to be provided
    /// in this call. self.tokens.mint will also require it to be Some, since
    /// StorageKey::TokenMetadata was provided at initialization.
    ///
    /// self.tokens.mint will enforce predecessor_account_id to equal the owner_id given in
    /// initialization call to new.
    #[payable]
    pub fn nft_mint(
        &mut self,
        token_id: TokenId,
        receiver_id: AccountId,
        token_metadata: TokenMetadata,
    ) -> Token {
        self.tokens.internal_mint(token_id, receiver_id, Some(token_metadata))
    }
}

// Implement NFT standart
near_contract_standards::impl_non_fungible_token_core!(Contract, tokens);
near_contract_standards::impl_non_fungible_token_approval!(Contract, tokens);
near_contract_standards::impl_non_fungible_token_enumeration!(Contract, tokens);

#[near_bindgen]
impl NonFungibleTokenMetadataProvider for Contract {
  fn nft_metadata(&self) -> NFTContractMetadata {
      self.metadata.get().unwrap()
  }
}