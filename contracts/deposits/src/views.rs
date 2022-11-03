use crate::*;

#[near_bindgen]
impl Contract {
    /// Return near account of contract owner
    pub fn get_owner(&self) -> String {
        self.owner.to_string()
    }

    /// Get deposit amount for the account `account_id`
    pub fn get_deposit_amount(&self, account_id: AccountId) -> U128 {
        self.deposits.get(&account_id).unwrap_or(0).into()
    }

    // Get sum of all deposit values
    pub fn get_total_deposit(&self) -> U128 {
        self.total_deposit.into()
    }

    // Get balance of the owner
    pub fn get_owner_balance(&self) -> U128 {
        self.owner_balance.into()
    }
}
