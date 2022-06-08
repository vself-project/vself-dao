use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::Vector;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, log, near_bindgen, AccountId, BorshStorageKey, PanicOnDefault};

mod constants;

extern crate rand;
use rand::thread_rng;

extern crate curve25519_dalek;
use curve25519_dalek::scalar::Scalar;

extern crate merlin;
use merlin::Transcript;

extern crate bulletproofs;
use bulletproofs::{BulletproofGens, PedersenGens, RangeProof};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId, // Owner ID
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
        }
    }

    /// Upload evidence fingerprint to blochchain
    pub fn test(&self) {
        // Generators for Pedersen commitments.  These can be selected
        // independently of the Bulletproofs generators.
        let pc_gens = PedersenGens::default();

        // Generators for Bulletproofs, valid for proofs up to bitsize 64
        // and aggregation size up to 1.
        let bp_gens = BulletproofGens::new(64, 1);

        // A secret value we want to prove lies in the range [0, 2^32)
        let secret_value = 1037578891u64;

        // The API takes a blinding factor for the commitment.
        let blinding = Scalar::random(&mut thread_rng());

        // The proof can be chained to an existing transcript.
        // Here we create a transcript with a doctest domain separator.
        let mut prover_transcript = Transcript::new(b"doctest example");

        // Create a 32-bit rangeproof.
        let (proof, committed_value) = RangeProof::prove_single(
            &bp_gens,
            &pc_gens,
            &mut prover_transcript,
            secret_value,
            &blinding,
            32,
        ).expect("A real program could handle errors");

        // Verification requires a transcript with identical initial state:
        let mut verifier_transcript = Transcript::new(b"doctest example");
        assert!(
            proof
                .verify_single(&bp_gens, &pc_gens, &mut verifier_transcript, &committed_value, 32)
                .is_ok()
        );
    }
}
