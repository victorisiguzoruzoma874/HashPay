module hashpay::escrow {
    use sui::object::{Self, UID};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    /// Error codes
    const ENotOwner: u64 = 0;
    const ENotRecipient: u64 = 1;

    /// Escrow object that holds the funds
    struct Escrow has key, store {
        id: UID,
        sender: address,
        recipient: address,
        amount: Coin<SUI>,
        is_locked: bool,
    }

    /// Create a new escrow payment
    public entry fun create(
        recipient: address,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let escrow = Escrow {
            id: object::new(ctx),
            sender,
            recipient,
            amount: payment,
            is_locked: true,
        };
        // Share the object so both parties can potentially interact (though only defined parties can call methods)
        // Or we can transfer to the sender to own it, but sharing it allows the recipient to see it easily.
        // For strict escrow, we might want to share it.
        transfer::share_object(escrow);
    }

    /// Release funds to the recipient. 
    /// Can be called by the sender (to approve) or potentially an arbiter in a more complex system.
    /// Here we allow the sender to release it.
    public entry fun release(escrow: &mut Escrow, ctx: &mut TxContext) {
        let caller = tx_context::sender(ctx);
        assert!(caller == escrow.sender, ENotOwner);

        let amount = coin::value(&escrow.amount);
        // We need to extract the coin to transfer it. 
        // Since we can't move fields out of a shared object easily without destroying it, 
        // we'll split the coin out.
        let payment = coin::split(&mut escrow.amount, amount, ctx);
        
        transfer::public_transfer(payment, escrow.recipient);
        escrow.is_locked = false;
    }

    /// Cancel the escrow and return funds to sender.
    /// Can be called by the sender BEFORE the recipient accepts, or if mutual cancellation logic existed.
    /// For this simple version, we allow sender to cancel if they change their mind.
    public entry fun cancel(escrow: &mut Escrow, ctx: &mut TxContext) {
        let caller = tx_context::sender(ctx);
        assert!(caller == escrow.sender, ENotOwner);

        let amount = coin::value(&escrow.amount);
        let refund = coin::split(&mut escrow.amount, amount, ctx);
        
        transfer::public_transfer(refund, escrow.sender);
        escrow.is_locked = false;
    }
}
