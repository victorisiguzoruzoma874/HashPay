# How to Deploy HashPay Smart Contracts

This guide will help you deploy the HashPay Move modules to the Sui Blockchain (Testnet).

## Prerequisites
1.  **Install Sui CLI**: Ensure you have the [Sui binaries installed](https://docs.sui.io/guides/developer/getting-started/sui-install).
2.  **Create a Wallet**:
    ```bash
    sui client active-address
    # If no address, create one:
    sui client new-address ed25519
    ```
3.  **Get Gas (Testnet SUI)**:
    Join the [Sui Discord](https://discord.gg/sui) or use the command:
    ```bash
    sui client faucet
    ```

## Step 1: Build the Package
Navigate to the `move` directory and build the project to ensure there are no errors.

```powershell
cd move
sui move build
```

## Step 2: Run Tests (Optional but Recommended)
Verify the logic before spending gas.

```powershell
sui move test
```

## Step 3: Publish (Deploy)
Run the publish command. We set a gas budget to ensure it processes.

```powershell
sui client publish --gas-budget 100000000 --skip-dependency-verification
```

## Step 4: Save the Package ID
After a successful deployment, the terminal will output a large JSON object. Look for the **"Published Objects"** section.

1.  Find the object with type `package`.
2.  Copy its **ObjectId**. This is your **Package ID**.
3.  You will need this ID to interact with your contract from the frontend.

## Example Output
```text
----- Transaction Effects ....
Created Objects:
  - ID: 0x123...abc  <-- THIS IS YOUR PACKAGE ID
    Owner: Immutable
```
