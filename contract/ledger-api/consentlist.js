'use strict';
const Consent = require('./consent.js');

class ConsentList {

    /**
     * Store Fabric context for subsequent API access, and name of list
     */
    constructor(ctx, listName) {
        this.ctx = ctx;
        this.name = listName;
        this.supportedClasses = {};

    }

    /**
     * Add a state to the list. Creates a new state in worldstate with
     * appropriate composite key.  Note that state defines its own key.
     * State object is serialized before writing.
     */
    async addConsent(consent) {
        let key = this.ctx.stub.createCompositeKey(this.name, consent.getSplitKey());
        let data = Consent.serialize(consent);
        await this.ctx.stub.putState(key, data);
    }

    /**
     * Get a state from the list using supplied keys. Form composite
     * keys to retrieve state from world state. State data is deserialized
     * into JSON object before being returned.
     */
    async getConsent(key) {
        let ledgerKey = this.ctx.stub.createCompositeKey(this.name, Consent.splitKey(key));
        let data = await this.ctx.stub.getState(ledgerKey);
        let consent = Consent.deserialize(data, this.supportedClasses);
        return consent;
    }

    /**
     * Update a state in the list. Puts the new state in world state with
     * appropriate composite key.  Note that state defines its own key.
     * A state is serialized before writing. Logic is very similar to
     * addState() but kept separate becuase it is semantically distinct.
     */
    async updateConsent(consent) {
        let key = this.ctx.stub.createCompositeKey(this.name, consent.getSplitKey());
        let data = Consent.serialize(consent);
        await this.ctx.stub.putState(key, data);
    }

    /** Stores the class for future deserialization */
    use(consentClass) {
        this.supportedClasses[consentClass.getClass()] = consentClass;
    }

}

module.exports = ConsentList;