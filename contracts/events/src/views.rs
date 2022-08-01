use crate::*;

/// This is format of output via JSON for the user balance.
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct UserBalanceOutput {
    index: usize,
    got: bool,
    title: String,
    description: String,
}

#[near_bindgen]
impl Contract {
    /// Returns semver of this contract.
    pub fn version(&self) -> String {
        env!("CARGO_PKG_VERSION").to_string()
    }

    /// Get all ongoing events (with pagination)
    pub fn get_ongoing_events(&self, from_index: u64, limit: u64) -> Vec<(u32, EventData, EventStats)> {
        let keys = self.ongoing_events.keys_as_vector();
        (from_index..std::cmp::min(from_index + limit, self.ongoing_events.len()))
        .map(|index| {
            let event_id = keys.get(index).unwrap();
            let event = self.ongoing_events.get(&event_id).unwrap();
            (event_id, event.data, event.stats)
        })
        .collect()
    }

    /// Get ongoing events for specific user
    pub fn get_ongoing_user_events(&self, account_id: AccountId) -> Vec<(u32, EventData, EventStats)> {
        let ids = self.ongoing.get(&account_id).unwrap_or(HashSet::new());
        let mut user_events = vec![];
        for id in ids {
            let event = self.ongoing_events.get(&id).unwrap();
            user_events.push((id, event.data, event.stats));
        }
        user_events
    }
    
    /// Return event data
    pub fn get_event_data(self, event_id: u32) -> Option<EventData> {        
        let data = self.ongoing_events.get(&event_id);
        match data {
            Some(event) => Some(event.data),
            None => None
        }
    }

    /// Return current event stats
    pub fn get_event_stats(self, event_id: u32) -> Option<EventStats> {        
        let data = self.ongoing_events.get(&event_id);
        match data {
            Some(event) => Some(event.stats),
            None => None
        }
    }

    /// Return user balance (for specific event)
    pub fn get_user_balance(&self, event_id: u32, account_id: AccountId) -> Option<UserBalance> {
        let balances = self.balances.get(&event_id).unwrap();
        balances.get(&account_id)
    }

    /// Returns history of user actions for event (supports pagination)
    /// - `from_index` is the index to start from.
    /// - `limit` is the maximum number of elements to return.
    pub fn get_event_actions(&self, event_id: u32, from_index: u64, limit: u64) -> Vec<ActionData> {
        let actions = self.actions.get(&event_id).unwrap();
        (from_index..std::cmp::min(from_index + limit, actions.len()))
            .map(|index| actions.get(index).unwrap())
            .collect()
    }

    // /// Return user balance (with extra data)
    // pub fn get_user_balance_extra(&self, account_id: AccountId) -> Vec<UserBalanceOutput> {
    //     match self.balances.get(&account_id) {
    //         Some(balance) => {
    //             let quests = self.event.as_ref().unwrap().quests.clone();
    //             let mut i = 0;
    //             let mut result = vec![];
    //             for quest in &quests {
    //                 result.push(UserBalanceOutput {
    //                     index: i,
    //                     got: balance.quests_status[i],
    //                     title: quest.reward_title.clone(),
    //                     description: quest.reward_description.clone(),
    //                 });
    //                 i += 1;
    //             }
    //             result
    //         }
    //         None => vec![],
    //     }
    // }

    // /// Get all user actions for current event (supports pagination)
    // /// - `from_index` is the index to start from.
    // /// - `limit` is the maximum number of elements to return.
    // pub fn get_actions(&self, from_index: u64, limit: u64) -> Vec<ActionData> {
    //     if let None = self.event {
    //         // No event is running -> no actions
    //         log!("No ongoing event, sorry.");
    //         return vec![];
    //     }
    //     let actions_from = self.actions_from.get(self.event_id).unwrap();
    //     let from_index = actions_from + from_index; // Shift for current event
    //     (from_index..std::cmp::min(from_index + limit, self.actions.len()))
    //         .map(|index| self.actions.get(index).unwrap())
    //         .collect()
    // }

    // /// Get all user actions for current event (supports pagination)
    // /// - `from_index` is the index to start from.
    // /// - `limit` is the maximum number of elements to return.
    // pub fn get_past_event_actions(
    //     &self,
    //     event_id: u64,
    //     from_index: u64,
    //     limit: u64,
    // ) -> Vec<ActionData> {
    //     assert!(self.event_id > event_id, "Wrong event index");
    //     let actions_from = self.actions_from.get(event_id).unwrap();
    //     let from_index = actions_from + from_index; // Shift for current event
    //     (from_index..std::cmp::min(from_index + limit, self.actions.len()))
    //         .map(|index| self.actions.get(index).unwrap())
    //         .collect()
    // }

    // /// Get past events data (supports pagination)
    // /// - `from_index` is the index to start from.
    // /// - `limit` is the maximum number of elements to return.
    // pub fn get_past_events(&self, from_index: u64, limit: u64) -> Vec<(EventData, EventStats)> {
    //     (from_index..std::cmp::min(from_index + limit, self.past_events.len()))
    //         .map(|index| self.past_events.get(index).unwrap())
    //         .collect()
    // }
}
