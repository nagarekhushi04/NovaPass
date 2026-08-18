#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, Address, Env, String,
    Symbol,
};

// Storage TTL Constants (in ledgers; ~5 seconds per ledger on Stellar)
const DAY_IN_LEDGERS: u32 = 17_280;
const INSTANCE_BUMP_AMOUNT: u32 = 30 * DAY_IN_LEDGERS; // 30 days
const INSTANCE_LIFETIME_THRESHOLD: u32 = INSTANCE_BUMP_AMOUNT - DAY_IN_LEDGERS;

const PERSISTENT_BUMP_AMOUNT: u32 = 60 * DAY_IN_LEDGERS; // 60 days
const PERSISTENT_LIFETIME_THRESHOLD: u32 = PERSISTENT_BUMP_AMOUNT - DAY_IN_LEDGERS;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    Unauthorized = 3,
    VoucherNotFound = 4,
    VoucherExpired = 5,
    SupplyExhausted = 6,
    AlreadyClaimed = 7,
    InsufficientBalance = 8,
    InvalidAmount = 9,
    VoucherInactive = 10,
    InvalidExpiry = 11,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct VoucherInfo {
    pub id: u128,
    pub merchant: Address,
    pub voucher_type: u32, // 1: Gift Card, 2: Single-use Coupon, 3: Loyalty Points
    pub total_supply: i128,
    pub remaining_supply: i128,
    pub claim_amount: i128,
    pub metadata_uri: String,
    pub expires_at: u64,
    pub is_active: bool,
}

#[contracttype]
pub enum DataKey {
    Admin,
    VoucherCount,
    Voucher(u128),
    UserBalance(u128, Address),
    UserClaimed(u128, Address),
}

#[contract]
pub struct VoucherHub;

#[contractimpl]
impl VoucherHub {
    /// Initialize the contract with an admin address
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::VoucherCount, &0u128);

        // Extend instance TTL
        env.storage().instance().extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);

        Ok(())
    }

    /// Issue a new digital voucher campaign
    pub fn issue_voucher(
        env: Env,
        merchant: Address,
        voucher_type: u32,
        total_supply: i128,
        claim_amount: i128,
        metadata_uri: String,
        expires_at: u64,
    ) -> Result<u128, Error> {
        // Enforce merchant authorization
        merchant.require_auth();

        if total_supply <= 0 || claim_amount <= 0 || claim_amount > total_supply {
            return Err(Error::InvalidAmount);
        }

        let current_time = env.ledger().timestamp();
        if expires_at > 0 && expires_at <= current_time {
            return Err(Error::InvalidExpiry);
        }

        let mut count: u128 = env
            .storage()
            .instance()
            .get(&DataKey::VoucherCount)
            .unwrap_or(0);
        count += 1;

        let voucher = VoucherInfo {
            id: count,
            merchant: merchant.clone(),
            voucher_type,
            total_supply,
            remaining_supply: total_supply,
            claim_amount,
            metadata_uri,
            expires_at,
            is_active: true,
        };

        let voucher_key = DataKey::Voucher(count);
        env.storage().persistent().set(&voucher_key, &voucher);
        env.storage().persistent().extend_ttl(
            &voucher_key,
            PERSISTENT_LIFETIME_THRESHOLD,
            PERSISTENT_BUMP_AMOUNT,
        );

        env.storage().instance().set(&DataKey::VoucherCount, &count);
        env.storage().instance().extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);

        // Emit on-chain event
        env.events().publish(
            (symbol_short!("issued"), count, merchant),
            voucher.claim_amount,
        );

        Ok(count)
    }

    /// Claim a voucher for a user
    pub fn claim_voucher(env: Env, voucher_id: u128, user: Address) -> Result<i128, Error> {
        // Enforce user authorization
        user.require_auth();

        let voucher_key = DataKey::Voucher(voucher_id);
        let mut voucher: VoucherInfo = env
            .storage()
            .persistent()
            .get(&voucher_key)
            .ok_or(Error::VoucherNotFound)?;

        if !voucher.is_active {
            return Err(Error::VoucherInactive);
        }

        let ledger_time = env.ledger().timestamp();
        if voucher.expires_at > 0 && ledger_time > voucher.expires_at {
            return Err(Error::VoucherExpired);
        }

        if voucher.remaining_supply < voucher.claim_amount {
            return Err(Error::SupplyExhausted);
        }

        // Single-use coupon check
        if voucher.voucher_type == 2 {
            let claimed_key = DataKey::UserClaimed(voucher_id, user.clone());
            let already_claimed: bool = env
                .storage()
                .persistent()
                .get(&claimed_key)
                .unwrap_or(false);
            if already_claimed {
                return Err(Error::AlreadyClaimed);
            }
            env.storage().persistent().set(&claimed_key, &true);
            env.storage().persistent().extend_ttl(
                &claimed_key,
                PERSISTENT_LIFETIME_THRESHOLD,
                PERSISTENT_BUMP_AMOUNT,
            );
        }

        voucher.remaining_supply -= voucher.claim_amount;
        env.storage().persistent().set(&voucher_key, &voucher);
        env.storage().persistent().extend_ttl(
            &voucher_key,
            PERSISTENT_LIFETIME_THRESHOLD,
            PERSISTENT_BUMP_AMOUNT,
        );

        let balance_key = DataKey::UserBalance(voucher_id, user.clone());
        let current_balance: i128 = env
            .storage()
            .persistent()
            .get(&balance_key)
            .unwrap_or(0);
        let new_balance = current_balance + voucher.claim_amount;

        env.storage().persistent().set(&balance_key, &new_balance);
        env.storage().persistent().extend_ttl(
            &balance_key,
            PERSISTENT_LIFETIME_THRESHOLD,
            PERSISTENT_BUMP_AMOUNT,
        );

        // Emit on-chain event
        env.events().publish(
            (symbol_short!("claimed"), voucher_id, user.clone()),
            voucher.claim_amount,
        );

        Ok(new_balance)
    }

    /// Redeem/Burn voucher value at merchant POS
    pub fn redeem_voucher(
        env: Env,
        voucher_id: u128,
        merchant: Address,
        user: Address,
        amount: i128,
    ) -> Result<bool, Error> {
        // Enforce merchant authorization
        merchant.require_auth();

        let voucher_key = DataKey::Voucher(voucher_id);
        let voucher: VoucherInfo = env
            .storage()
            .persistent()
            .get(&voucher_key)
            .ok_or(Error::VoucherNotFound)?;

        if voucher.merchant != merchant {
            return Err(Error::Unauthorized);
        }

        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        let balance_key = DataKey::UserBalance(voucher_id, user.clone());
        let user_balance: i128 = env
            .storage()
            .persistent()
            .get(&balance_key)
            .unwrap_or(0);

        if user_balance < amount {
            return Err(Error::InsufficientBalance);
        }

        let new_balance = user_balance - amount;
        env.storage().persistent().set(&balance_key, &new_balance);
        env.storage().persistent().extend_ttl(
            &balance_key,
            PERSISTENT_LIFETIME_THRESHOLD,
            PERSISTENT_BUMP_AMOUNT,
        );

        // Emit on-chain event
        env.events().publish(
            (symbol_short!("redeemed"), voucher_id, user.clone()),
            amount,
        );

        Ok(true)
    }

    /// Burn coupon upon one-time redemption
    pub fn burn_coupon(env: Env, voucher_id: u128, user: Address) -> Result<bool, Error> {
        user.require_auth();

        let balance_key = DataKey::UserBalance(voucher_id, user.clone());
        let balance: i128 = env
            .storage()
            .persistent()
            .get(&balance_key)
            .unwrap_or(0);

        if balance <= 0 {
            return Err(Error::InsufficientBalance);
        }

        env.storage().persistent().set(&balance_key, &0i128);
        env.storage().persistent().extend_ttl(
            &balance_key,
            PERSISTENT_LIFETIME_THRESHOLD,
            PERSISTENT_BUMP_AMOUNT,
        );

        env.events().publish((symbol_short!("burned"), voucher_id, user), balance);

        Ok(true)
    }

    /// Get voucher details by ID
    pub fn get_voucher_details(env: Env, voucher_id: u128) -> Result<VoucherInfo, Error> {
        let voucher_key = DataKey::Voucher(voucher_id);
        env.storage()
            .persistent()
            .get(&voucher_key)
            .ok_or(Error::VoucherNotFound)
    }

    /// Get user balance for a specific voucher
    pub fn get_user_balance(env: Env, voucher_id: u128, user: Address) -> i128 {
        let balance_key = DataKey::UserBalance(voucher_id, user);
        env.storage()
            .persistent()
            .get(&balance_key)
            .unwrap_or(0)
    }

    /// Total vouchers created
    pub fn get_voucher_count(env: Env) -> u128 {
        env.storage()
            .instance()
            .get(&DataKey::VoucherCount)
            .unwrap_or(0)
    }
}

#[cfg(test)]
mod test;
