const DiscountTokens = artifacts.require("DiscountTokens");

contract ("DiscountTokens", (accounts) => {
    //Only VetSplet can give out tokens from personal wallet (via the veterinarians that are logged in).
    contract("DiscountTokens.minting", () => {
        const VetSplet = accounts[0];
        const client = accounts[1];

        let TokensDeployedContract;
        beforeEach(async () => {
            TokensDeployedContract = await DiscountTokens.deployed();
        });

        it("Allows owner to mint tokens", async () => {
            const token = 1;
            const currentBalance = await TokensDeployedContract.balanceOf(client);
            await TokensDeployedContract.minting(client, token, { from: VetSplet });
            const newBalance = await TokensDeployedContract.balanceOf(client);
            assert.equal(currentBalance.toNumber() + token, newBalance.toNumber(), "Balance is not equal");
        });

        it("Doesn't allow client to mint tokens", async () => {
            const token = 1;
            const currentBalance = await TokensDeployedContract.balanceOf(client);
            await TokensDeployedContract.minting(client, token, { from: client })
            .then(() => {
                assert.fail("Client cannot mint tokens");
            })
            .catch((error) => {
                assert.isTrue(
                    error.hijackedStack.indexOf("Only VetSplet can do this action") > 0
                );
            });
        });
    });

    //Client can get discount tokens if appointment is deleted, and cannot register already existing account.
    contract("DiscountTokens.minting", () => {
        const VetSplet = accounts[0];
        const client = accounts[1];

        let TokensDeployedContract;
        beforeEach(async () => {
            TokensDeployedContract = await DiscountTokens.deployed();
        });

        it("Owner gives tokens to registered client", async () => {
            const token = 1;
            await TokensDeployedContract.registeringAccount("6599bc43fb00e51a3107482c", { from: client });
            const currentBalance = await TokensDeployedContract.balanceOf(client);
            await TokensDeployedContract.minting(client, token, { from: VetSplet });
            const newBalance = await TokensDeployedContract.balanceOf(client);

            assert.equal(currentBalance.toNumber() + token, newBalance.toNumber(), "Balance is not equal");
            const checkUser = await TokensDeployedContract.getAccount(client);
            assert.equal(checkUser.userID, "6599bc43fb00e51a3107482c", "Accounts are not the same");
        });

        it("Client has not been registered, no tokens were given", async () => {
            await TokensDeployedContract.registeringAccount("6599bc43fb00e51a3107482c", { from: client })
            .then(() => {
                assert.fail("Failed to register already existing account");
            })
            .catch((error) => {
                assert.isTrue(
                    error.hijackedStack.indexOf("Account has already been registered") > 0
                );
            });
        });
    });

    //If num of tokens that client wants to use is smaller than num of existing tokens, may tokens be used.
    contract("DiscountTokens.minting", () => {
        const VetSplet = accounts[0];
        const client = accounts[1];

        let TokensDeployedContract;
        beforeEach(async () => {
            TokensDeployedContract = await DiscountTokens.deployed();
        });

        it("Client uses tokens for discount, overall tokens are balanced", async () => {
            const addingTokens = 20;
            const tokens = 15;

            await TokensDeployedContract.minting(client, addingTokens, { from: VetSplet });
            const currentBalance = await TokensDeployedContract.balanceOf(client);
            await TokensDeployedContract.discount(client, tokens, { from: client });
            const newBalance = await TokensDeployedContract.balanceOf(client);

            assert.equal(currentBalance.toNumber() - tokens, newBalance.toNumber(), "Balance is not equal");
        });

        it("Client does not use tokens for discount, overall tokens are unchanged", async () => {
            const addingTokens = 15;
            const tokens = 100;

            await TokensDeployedContract.minting(client, addingTokens, { from: VetSplet });
            await TokensDeployedContract.discount(client, tokens, { from: client })
            .then(() => {
                assert.fail("Client cannot use tokens");
            })
            .catch((error) => {
                assert.isTrue(
                    error.message.includes("Not enough tokens"), "Unexpected error message."
                );
            });
        });
    });
});
