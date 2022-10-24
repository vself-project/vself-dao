use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet, Vector};
use near_sdk::json_types::{Base64VecU8, U128};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, log, near_bindgen, AccountId, Balance, Promise, BorshStorageKey, PanicOnDefault};
use std::collections::HashSet;

pub mod views;

const ERR_TOTAL_DEPOSIT_OVERFLOW: &str = "Total deposit overflow";
const ERR_BALANCE_OVERFLOW: &str = "Balance overflow";
const ERR_NOT_ENOUGH_BALANCE: &str = "The account doesn't have enough balance";
const ERR_CALLER_IS_NOT_OWNER: &str = "Method call access denied";

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    Account
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    /// AccountID -> Account balance.
    pub deposits: LookupMap<AccountId, Balance>,

    /// Sum of all deposits
    pub total_deposit: Balance,

    /// Contract owner
    pub owner: AccountId,
}

#[near_bindgen]
impl Contract {

    /// Constructor
    #[init]
    pub fn new() -> Self {
        let owner = env::current_account_id();

        // Init
        Self {
            deposits: LookupMap::new(StorageKey::Account),
            total_deposit: 0,
            owner: owner.into()
        }
    }

    fn internal_unwrap_balance_of(&self, account_id: AccountId) -> Balance {
        match self.deposits.get(&account_id) {
            Some(balance) => balance,
            None => {
                env::panic_str(format!("The account {} is not registered", &account_id).as_str())
            }
        }
    }

    /// Increase deposit amount of account `account_id` by attached amount
    #[payable]
    pub fn make_deposit(&mut self, account_id: AccountId) {
        let amount: Balance = env::attached_deposit();
        let balance: Balance = self.deposits.get(&account_id).unwrap_or(0).into();
        if let Some(new_balance) = balance.checked_add(amount) {
            self.deposits.insert(&account_id, &new_balance);
            self.total_deposit = self
                .total_deposit
                .checked_add(amount)
                .unwrap_or_else(|| env::panic_str(ERR_TOTAL_DEPOSIT_OVERFLOW));
        } else {
            env::panic_str(ERR_BALANCE_OVERFLOW);
        }
    }

    /// Decrease deposit amount of account `account_id` by `amount` value
    pub fn decrease_deposit(&mut self, account_id: AccountId, amount: U128) {
        //assert_eq!(env::predecessor_account_id(), self.owner, "{}", ERR_CALLER_IS_NOT_OWNER);
        
        let balance: Balance = self.deposits.get(&account_id).unwrap_or(0).into();
        if let Some(new_balance) = balance.checked_sub(amount.into()) {
            self.deposits.insert(&account_id, &new_balance);
            self.total_deposit = self
                .total_deposit
                .checked_sub(amount.into())
                .unwrap_or_else(|| env::panic_str(ERR_TOTAL_DEPOSIT_OVERFLOW));
        } else {
            env::panic_str(ERR_NOT_ENOUGH_BALANCE);
        }
    }

    /// If a caller has a positive deposit amount then set it to zero and transfer nears to the caller
    pub fn withdraw(&mut self) -> Balance {
        let account_id = env::predecessor_account_id();
        let balance: Balance = self.deposits.get(&account_id).unwrap_or(0).into();
        // If balance is positive then make transfer
        if (balance > 0) {
          self.deposits.insert(&account_id, &0);
          self.total_deposit = self
            .total_deposit
            .checked_sub(balance.clone())
            .unwrap_or_else(|| env::panic_str(ERR_TOTAL_DEPOSIT_OVERFLOW));
          Promise::new(account_id).transfer(balance.clone());
        }
        balance
    }

    /// Withdraw platform funds to the given address `account_id`
    pub fn withdraw_to_owner(&mut self, account_id: AccountId) -> Balance {
        //assert_eq!(env::predecessor_account_id(), self.owner, "{}", ERR_CALLER_IS_NOT_OWNER);

        let contract_balance: Balance = env::account_balance();
        let amount_to_withdraw: Balance = contract_balance - self.total_deposit;

        // Make a transfer to `account_id`
        if (amount_to_withdraw > 0) {
            Promise::new(account_id).transfer(amount_to_withdraw);
        }
        amount_to_withdraw
    }
}
