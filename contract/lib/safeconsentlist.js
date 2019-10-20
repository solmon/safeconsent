'use strict';

const ConsentList = require('./../ledger-api/consentlist.js');

const SafeConsent = require('./safeconsent.js');

class SafeConsentList extends ConsentList {

    constructor(ctx) {
        super(ctx, 'org.safeconnet.safeconsentlist');
        this.use(SafeConsent);
    }

    async addConsent(safeConsent) {
        return this.addConsent(safeConsent);
    }

    async getConsent(safeConsentKey) {
        return this.getConsent(safeConsentKey);
    }

    async updateConsent(safeConsent) {
        return this.updateConsent(safeConsent);
    }
}


module.exports = SafeConsentList;