#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

#[test]
fn test_voucher_lifecycle_happy_path() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, VoucherHub);
    let client = VoucherHubClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let merchant = Address::generate(&env);
    let user = Address::generate(&env);

    // 1. Initialize
    client.initialize(&admin);
    assert_eq!(client.get_voucher_count(), 0);

    // 2. Issue Voucher (Gift Card: type 1, total 1000, claim 100)
    let metadata_uri = String::from_str(&env, "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi");
    let voucher_id = client.issue_voucher(
        &merchant,
        &1u32,
        &1000i128,
        &100i128,
        &metadata_uri,
        &0u64,
    );
    assert_eq!(voucher_id, 1);
    assert_eq!(client.get_voucher_count(), 1);

    let details = client.get_voucher_details(&voucher_id);
    assert_eq!(details.remaining_supply, 1000);
    assert_eq!(details.claim_amount, 100);

    // 3. User claims voucher
    let balance = client.claim_voucher(&voucher_id, &user);
    assert_eq!(balance, 100);

    let updated_details = client.get_voucher_details(&voucher_id);
    assert_eq!(updated_details.remaining_supply, 900);
    assert_eq!(client.get_user_balance(&voucher_id, &user), 100);

    // 4. Merchant redeems voucher at POS
    let redeemed = client.redeem_voucher(&voucher_id, &merchant, &user, &50i128);
    assert_eq!(redeemed, true);
    assert_eq!(client.get_user_balance(&voucher_id, &user), 50);
}

#[test]
fn test_single_use_coupon_prevention() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, VoucherHub);
    let client = VoucherHubClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let merchant = Address::generate(&env);
    let user = Address::generate(&env);

    client.initialize(&admin);

    // Type 2: Single use coupon
    let metadata_uri = String::from_str(&env, "ipfs://coupon1");
    let voucher_id = client.issue_voucher(
        &merchant,
        &2u32,
        &500i128,
        &50i128,
        &metadata_uri,
        &0u64,
    );

    // First claim succeeds
    let balance = client.claim_voucher(&voucher_id, &user);
    assert_eq!(balance, 50);

    // Second claim should fail for single use coupon
    let res = client.try_claim_voucher(&voucher_id, &user);
    assert!(res.is_err());
}
