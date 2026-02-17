module hashpay::profile {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};

    /// Profile object for a user
    struct UserProfile has key {
        id: UID,
        owner: address,
        username: String,
        bio: String,
    }

    /// Event emitted when a profile is created
    struct ProfileCreated has copy, drop {
        id: address,
        owner: address,
        username: String,
    }

    /// Register a new profile
    public entry fun register(
        username_bytes: vector<u8>,
        bio_bytes: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let profile = UserProfile {
            id: object::new(ctx),
            owner: sender,
            username: string::utf8(username_bytes),
            bio: string::utf8(bio_bytes),
        };
        
        // Emit event
        sui::event::emit(ProfileCreated {
            id: object::uid_to_address(&profile.id),
            owner: sender,
            username: profile.username,
        });

        // Transfer ownership to the sender
        transfer::transfer(profile, sender);
    }

    /// Update profile bio
    public entry fun update_bio(
        profile: &mut UserProfile,
        new_bio_bytes: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        // Since it's an owned object passed mutably, Sui authorization checks ensure sender is owner
        // But we can add an explicit check if we were using shared objects.
        // For owned objects, only the owner can call this.
        assert!(sender == profile.owner, 0); 

        profile.bio = string::utf8(new_bio_bytes);
    }
}
