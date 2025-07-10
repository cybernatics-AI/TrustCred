import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Initialize contract successfully",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('digital-credentials', 'initialize', [], deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);
    },
});

Clarinet.test({
    name: "Store and retrieve credential schema",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const schemaId = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        const name = "Academic Degree";
        const description = "Digital academic degree certificate";
        const version = "1.0";
        const fields = ["degree_type", "institution", "graduation_date"];
        
        let block = chain.mineBlock([
            Tx.contractCall('digital-credentials', 'store-schema', [
                types.buff(schemaId),
                types.utf8(name),
                types.utf8(description),
                deployer.address,
                types.list(fields.map(f => types.utf8(f))),
                types.utf8(version)
            ], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result.expectOk(), true);
        
        // Retrieve the schema
        let getSchema = chain.callReadOnlyFn('digital-credentials', 'get-schema', [
            types.buff(schemaId)
        ], deployer.address);
        
        let schema = getSchema.result.expectSome().expectTuple();
        assertEquals(schema['name'], name);
        assertEquals(schema['description'], description);
        assertEquals(schema['version'], version);
    },
});

Clarinet.test({
    name: "Store and retrieve credential",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const alice = accounts.get('wallet_1')!;
        
        const schemaId = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        const credentialId = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
        const dataHash = '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba';
        const metadataUri = "ipfs://QmExampleHash";
        
        let block = chain.mineBlock([
            // First create a schema
            Tx.contractCall('digital-credentials', 'store-schema', [
                types.buff(schemaId),
                types.utf8("Test Schema"),
                types.utf8("Test description"),
                deployer.address,
                types.list([types.utf8("field1")]),
                types.utf8("1.0")
            ], deployer.address),
            
            // Then store a credential
            Tx.contractCall('digital-credentials', 'store-credential', [
                types.buff(credentialId),
                deployer.address,
                alice.address,
                types.buff(schemaId),
                types.buff(dataHash),
                types.utf8(metadataUri),
                types.none()
            ], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result.expectOk(), true);
        assertEquals(block.receipts[1].result.expectOk(), true);
        
        // Retrieve the credential
        let getCredential = chain.callReadOnlyFn('digital-credentials', 'get-credential', [
            types.buff(credentialId)
        ], deployer.address);
        
        let credential = getCredential.result.expectSome().expectTuple();
        assertEquals(credential['issuer'], deployer.address);
        assertEquals(credential['recipient'], alice.address);
        assertEquals(credential['schema-id'], schemaId);
        assertEquals(credential['metadata-uri'], metadataUri);
        assertEquals(credential['revoked'], false);
    },
});

Clarinet.test({
    name: "Credential validation works correctly",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const alice = accounts.get('wallet_1')!;
        
        const schemaId = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        const credentialId = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
        const dataHash = '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba';
        
        let block = chain.mineBlock([
            // Create schema
            Tx.contractCall('digital-credentials', 'store-schema', [
                types.buff(schemaId),
                types.utf8("Test Schema"),
                types.utf8("Test description"),
                deployer.address,
                types.list([types.utf8("field1")]),
                types.utf8("1.0")
            ], deployer.address),
            
            // Store valid credential (expires in 1000 blocks)
            Tx.contractCall('digital-credentials', 'store-credential', [
                types.buff(credentialId),
                deployer.address,
                alice.address,
                types.buff(schemaId),
                types.buff(dataHash),
                types.utf8("ipfs://test"),
                types.some(types.uint(1000))
            ], deployer.address)
        ]);
        
        // Check if credential is valid
        let isValid = chain.callReadOnlyFn('digital-credentials', 'is-credential-valid', [
            types.buff(credentialId)
        ], deployer.address);
        
        assertEquals(isValid.result, true);
    },
});

Clarinet.test({
    name: "Revoke credential successfully",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const alice = accounts.get('wallet_1')!;
        
        const schemaId = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        const credentialId = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
        const dataHash = '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba';
        
        let block = chain.mineBlock([
            // Setup
            Tx.contractCall('digital-credentials', 'store-schema', [
                types.buff(schemaId),
                types.utf8("Test Schema"),
                types.utf8("Test description"),
                deployer.address,
                types.list([types.utf8("field1")]),
                types.utf8("1.0")
            ], deployer.address),
            
            Tx.contractCall('digital-credentials', 'store-credential', [
                types.buff(credentialId),
                deployer.address,
                alice.address,
                types.buff(schemaId),
                types.buff(dataHash),
                types.utf8("ipfs://test"),
                types.none()
            ], deployer.address),
            
            // Revoke the credential
            Tx.contractCall('digital-credentials', 'revoke-credential', [
                types.buff(credentialId)
            ], deployer.address)
        ]);
        
        assertEquals(block.receipts[2].result.expectOk(), true);
        
        // Check if credential is revoked
        let isRevoked = chain.callReadOnlyFn('digital-credentials', 'is-credential-revoked', [
            types.buff(credentialId)
        ], deployer.address);
        
        assertEquals(isRevoked.result, true);
        
        // Check if credential is no longer valid
        let isValid = chain.callReadOnlyFn('digital-credentials', 'is-credential-valid', [
            types.buff(credentialId)
        ], deployer.address);
        
        assertEquals(isValid.result, false);
    },
});

Clarinet.test({
    name: "Cannot store duplicate schema",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const schemaId = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        
        let block = chain.mineBlock([
            Tx.contractCall('digital-credentials', 'store-schema', [
                types.buff(schemaId),
                types.utf8("Test Schema"),
                types.utf8("Test description"),
                deployer.address,
                types.list([types.utf8("field1")]),
                types.utf8("1.0")
            ], deployer.address),
            
            // Try to store the same schema again
            Tx.contractCall('digital-credentials', 'store-schema', [
                types.buff(schemaId),
                types.utf8("Duplicate Schema"),
                types.utf8("Should fail"),
                deployer.address,
                types.list([types.utf8("field2")]),
                types.utf8("2.0")
            ], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result.expectOk(), true);
        assertEquals(block.receipts[1].result.expectErr(), types.uint(103)); // err-already-exists
    },
});

Clarinet.test({
    name: "Cannot store credential with invalid schema",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const alice = accounts.get('wallet_1')!;
        
        const invalidSchemaId = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        const credentialId = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
        const dataHash = '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba';
        
        let block = chain.mineBlock([
            // Try to store credential with non-existent schema
            Tx.contractCall('digital-credentials', 'store-credential', [
                types.buff(credentialId),
                deployer.address,
                alice.address,
                types.buff(invalidSchemaId),
                types.buff(dataHash),
                types.utf8("ipfs://test"),
                types.none()
            ], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result.expectErr(), types.uint(101)); // err-not-found
    },
});

Clarinet.test({
    name: "Get verification details works correctly",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const alice = accounts.get('wallet_1')!;
        
        const schemaId = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        const credentialId = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
        const dataHash = '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba';
        
        let block = chain.mineBlock([
            // Setup
            Tx.contractCall('digital-credentials', 'store-schema', [
                types.buff(schemaId),
                types.utf8("Test Schema"),
                types.utf8("Test description"),
                deployer.address,
                types.list([types.utf8("field1")]),
                types.utf8("1.0")
            ], deployer.address),
            
            Tx.contractCall('digital-credentials', 'store-credential', [
                types.buff(credentialId),
                deployer.address,
                alice.address,
                types.buff(schemaId),
                types.buff(dataHash),
                types.utf8("ipfs://test"),
                types.some(types.uint(1000))
            ], deployer.address)
        ]);
        
        // Get verification details
        let verificationDetails = chain.callReadOnlyFn('digital-credentials', 'get-verification-details', [
            types.buff(credentialId)
        ], deployer.address);
        
        let details = verificationDetails.result.expectOk().expectTuple();
        assertEquals(details['issuer'], deployer.address);
        assertEquals(details['schema-id'], schemaId);
        assertEquals(details['revoked'], false);
        assertEquals(details['valid'], true);
    },
});

Clarinet.test({
    name: "Credential exists and schema exists helpers work",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const alice = accounts.get('wallet_1')!;
        
        const schemaId = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        const credentialId = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
        const dataHash = '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba';
        
        // Check non-existent schema and credential
        let schemaExists = chain.callReadOnlyFn('digital-credentials', 'schema-exists', [
            types.buff(schemaId)
        ], deployer.address);
        assertEquals(schemaExists.result, false);
        
        let credentialExists = chain.callReadOnlyFn('digital-credentials', 'credential-exists', [
            types.buff(credentialId)
        ], deployer.address);
        assertEquals(credentialExists.result, false);
        
        // Create schema and credential
        let block = chain.mineBlock([
            Tx.contractCall('digital-credentials', 'store-schema', [
                types.buff(schemaId),
                types.utf8("Test Schema"),
                types.utf8("Test description"),
                deployer.address,
                types.list([types.utf8("field1")]),
                types.utf8("1.0")
            ], deployer.address),
            
            Tx.contractCall('digital-credentials', 'store-credential', [
                types.buff(credentialId),
                deployer.address,
                alice.address,
                types.buff(schemaId),
                types.buff(dataHash),
                types.utf8("ipfs://test"),
                types.none()
            ], deployer.address)
        ]);
        
        // Check existing schema and credential
        schemaExists = chain.callReadOnlyFn('digital-credentials', 'schema-exists', [
            types.buff(schemaId)
        ], deployer.address);
        assertEquals(schemaExists.result, true);
        
        credentialExists = chain.callReadOnlyFn('digital-credentials', 'credential-exists', [
            types.buff(credentialId)
        ], deployer.address);
        assertEquals(credentialExists.result, true);
    },
});