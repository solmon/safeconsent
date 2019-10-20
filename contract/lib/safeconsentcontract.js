'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const SafeConsent = require('./safeconsent.js');
const SafeConsentList = require('./safeconsentlist.js');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class SafeConsentContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.safeConsentList = new SafeConsentList(this);
    }

}
/**
 * Define safe consent smart contract by extending Fabric Contract class
 *
 */
class SafeConsentContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.safeconnet.safeconsent');
    }

    /**
     * Define a custom context for safe consent
    */
    createContext() {
        return new SafeConsentContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    //Issue consent request
    async issue(ctx, userId, appId, caseId, docId, forApp,forWhom, acl,from, to) {

        // create an instance of the paper
        let consent = SafeConsent.createInstance(userId, appId, caseId, docId, forApp,forWhom,acl,from, to);

        // Smart contract, moves consent into Requested state
        consent.setRequested();
        
        // Add the consent to the list of all consents in the ledger world state
        await ctx.safeConsentList.addConsent(consent);

        // Must return a serialized consent to caller of smart contract
        return consent.toBuffer();
    }

    //reject the consent
    async reject(ctx, userId, appId, caseId, docId,when,host) {

        // Retrieve the consent using key fields provided
        let consentKey = SafeConsent.makeKey([userId, appId,caseId,docId]);
        let consent = await ctx.safeConsentList.getConsent(consentKey);

        // Validate current owner
        if (consent.getUserId() !== userId) {
            throw new Error('Consent ' + userId + appId + ' is not owned by ' + userId);
        }

        consent.setRejected();
        
        // Update the paper
        await ctx.safeConsentList.updateConsent(consent);
        return consent.toBuffer();
    }

    //approve the consent
    async approve(ctx, userId, appId, caseId, docId,when,host) {

        // Retrieve the consent using key fields provided
        let consentKey = SafeConsent.makeKey([userId, appId,caseId,docId]);
        let consent = await ctx.safeConsentList.getConsent(consentKey);

        // Validate current owner
        if (consent.getUserId() !== userId) {
            throw new Error('Consent ' + userId + appId + ' is not owned by ' + userId);
        }

        consent.setApproved();
        
        // Update the paper
        await ctx.safeConsentList.updateConsent(consent);
        return consent.toBuffer();
    }

}

module.exports = SafeConsentContract;
