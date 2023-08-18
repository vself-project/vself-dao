use near_contract_standards::non_fungible_token::metadata::{
    NFTContractMetadata, NonFungibleTokenMetadataProvider, TokenMetadata,
  };
use near_contract_standards::non_fungible_token::{Token, TokenId};
use near_sdk::{
    near_bindgen, AccountId
};
use near_sdk::PromiseOrValue;

use crate::*;

#[near_bindgen]
impl Contract {
    /// Mint a new token with ID=`token_id` belonging to `receiver_id`.
    ///
    /// Since this example implements metadata, it also requires per-token metadata to be provided
    /// in this call. `self.tokens.mint` will also require it to be Some, since
    /// `StorageKey::TokenMetadata` was provided at initialization.
    ///
    /// `self.tokens.mint` will enforce `predecessor_account_id` to equal the `owner_id` given in
    /// initialization call to `new`.
    #[payable]
    pub fn nft_mint(
        &mut self,
        token_id: TokenId,
        receiver_id: AccountId,
        token_metadata: TokenMetadata,
    ) -> Token {
        //assert_eq!(env::predecessor_account_id(), self.tokens.owner_id, "Unauthorized");
        self.tokens.internal_mint(token_id, receiver_id, Some(token_metadata))
    }
}   

// Implement NFT standart
near_contract_standards::impl_non_fungible_token_core!(Contract, tokens);
near_contract_standards::impl_non_fungible_token_enumeration!(Contract, tokens);

#[near_bindgen]
impl NonFungibleTokenMetadataProvider for Contract {
  fn nft_metadata(&self) -> NFTContractMetadata {
      self.metadata.get().unwrap()
  }
}

// #[near_bindgen]
// impl Contract {
//     /// Simple transfer. Transfer a given `token_id` from current owner to
//     /// `receiver_id`.
//     ///
//     /// Requirements
//     /// * Caller of the method must attach a deposit of 1 yoctoⓃ for security purposes
//     /// * Contract MUST panic if called by someone other than token owner or,
//     ///   if using Approval Management, one of the approved accounts
//     /// * `approval_id` is for use with Approval Management,
//     ///   see <https://nomicon.io/Standards/NonFungibleToken/ApprovalManagement.html>
//     /// * If using Approval Management, contract MUST nullify approved accounts on
//     ///   successful transfer.
//     /// * TODO: needed? Both accounts must be registered with the contract for transfer to
//     ///   succeed. See see <https://nomicon.io/Standards/StorageManagement.html>
//     ///
//     /// Arguments:
//     /// * `receiver_id`: the valid NEAR account receiving the token
//     /// * `token_id`: the token to transfer
//     /// * `approval_id`: expected approval ID. A number smaller than
//     ///    2^53, and therefore representable as JSON. See Approval Management
//     ///    standard for full explanation.
//     /// * `memo` (optional): for use cases that may benefit from indexing or
//     ///    providing information for a transfer
//     fn nft_transfer(
//         &mut self,
//         receiver_id: AccountId,
//         token_id: TokenId,
//         approval_id: Option<u64>,
//         memo: Option<String>,
//     );

//     /// Transfer token and call a method on a receiver contract. A successful
//     /// workflow will end in a success execution outcome to the callback on the NFT
//     /// contract at the method `nft_resolve_transfer`.
//     ///
//     /// You can think of this as being similar to attaching native NEAR tokens to a
//     /// function call. It allows you to attach any Non-Fungible Token in a call to a
//     /// receiver contract.
//     ///
//     /// Requirements:
//     /// * Caller of the method must attach a deposit of 1 yoctoⓃ for security
//     ///   purposes
//     /// * Contract MUST panic if called by someone other than token owner or,
//     ///   if using Approval Management, one of the approved accounts
//     /// * The receiving contract must implement `ft_on_transfer` according to the
//     ///   standard. If it does not, FT contract's `ft_resolve_transfer` MUST deal
//     ///   with the resulting failed cross-contract call and roll back the transfer.
//     /// * Contract MUST implement the behavior described in `ft_resolve_transfer`
//     /// * `approval_id` is for use with Approval Management extension, see
//     ///   that document for full explanation.
//     /// * If using Approval Management, contract MUST nullify approved accounts on
//     ///   successful transfer.
//     ///
//     /// Arguments:
//     /// * `receiver_id`: the valid NEAR account receiving the token.
//     /// * `token_id`: the token to send.
//     /// * `approval_id`: expected approval ID. A number smaller than
//     ///    2^53, and therefore representable as JSON. See Approval Management
//     ///    standard for full explanation.
//     /// * `memo` (optional): for use cases that may benefit from indexing or
//     ///    providing information for a transfer.
//     /// * `msg`: specifies information needed by the receiving contract in
//     ///    order to properly handle the transfer. Can indicate both a function to
//     ///    call and the parameters to pass to that function.
//     fn nft_transfer_call(
//         &mut self,
//         receiver_id: AccountId,
//         token_id: TokenId,
//         approval_id: Option<u64>,
//         memo: Option<String>,
//         msg: String,
//     ) -> PromiseOrValue<bool>;
// }