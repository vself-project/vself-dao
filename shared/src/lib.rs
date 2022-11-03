mod utils;

use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

extern crate rand;
use rand::thread_rng;

extern crate curve25519_dalek;
use curve25519_dalek::ristretto::CompressedRistretto;
use curve25519_dalek::scalar::Scalar;

extern crate merlin;
use merlin::Transcript;

extern crate bulletproofs;
use bulletproofs::{BulletproofGens, PedersenGens, RangeProof};

// When the wee_alloc feature is enabled, use wee_alloc as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen(getter_with_clone)]
#[derive(Serialize, Deserialize)]
pub struct ProofAndCommitment(pub Vec<u8>, pub Vec<u8>);

#[wasm_bindgen]
pub fn generate_proof(secret: u64) -> ProofAndCommitment {
    // Generators for Pedersen commitments.  These can be selected
    // independently of the Bulletproofs generators.
    let pc_gens = PedersenGens::default();

    // Generators for Bulletproofs, valid for proofs up to bitsize 64
    // and aggregation size up to 1.
    let bp_gens = BulletproofGens::new(64, 1);

    // A secret value we want to prove lies in the range [0, 2^32)
    let secret_value = secret;

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

    let proof_data = proof.to_bytes();
    let commitment_data = committed_value.to_bytes();

    ProofAndCommitment(proof_data, commitment_data.to_vec())
}

#[wasm_bindgen]
pub fn verify_proof(proof_data: ProofAndCommitment) -> bool {
    // Generators for Pedersen commitments.  These can be selected
    // independently of the Bulletproofs generators.
    let pc_gens = PedersenGens::default();

    // Generators for Bulletproofs, valid for proofs up to bitsize 64
    // and aggregation size up to 1.
    let bp_gens = BulletproofGens::new(64, 1);

    // 
    let proof = RangeProof::from_bytes(&proof_data.0).unwrap();

    // 
    let committed_value = CompressedRistretto::from_slice(&proof_data.1[..]);

    // Verification requires a transcript with identical initial state:
    let mut verifier_transcript = Transcript::new(b"doctest example");

    // Verify proof
    proof.verify_single(&bp_gens, &pc_gens, &mut verifier_transcript, &committed_value, 32)
        .is_ok()
}