use crate::*;

#[near_bindgen]
impl Contract {
    /// Returns semver of this contract.
    pub fn version(&self) -> String {
        env!("CARGO_PKG_VERSION").to_string()
    }

    /// Get amount of uploaded evidences
    pub fn get_evidences_amount(&self) -> u64 {
        self.evidence.len()
    }

    /// Get all user evidences (supports pagination)
    /// - `from_index` is the index to start from.
    /// - `limit` is the maximum number of elements (evidences) to return.
    pub fn get_evidences(&self, from_index: u64, limit: u64) -> Vec<EvidenceData> {
        (from_index..std::cmp::min(from_index + limit, self.evidence.len()))
            .map(|index| self.evidence.get(index).unwrap())
            .collect()
    }
}
