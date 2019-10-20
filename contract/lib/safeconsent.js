'use strict';

// Utility class for ledger Consent
const Consent = require('./../ledger-api/consent.js');

// Enumerate Consent state values
const cpaction = {
    REQUESTED: 0,
    APPROVE: 1,
    DISAPPROVE: 2
};

const cpacl = {
    FULL: 1,
    VIEWONLY: 2
};

/**
 * SafeConsent class extends Consent class
 * Class will be used by application and smart contract to define a Consent
 */
class SafeConsent extends Consent {

    constructor(obj) {
        super(SafeConsent.getClass(), [obj.userId, obj.appId, obj.caseId, obj.docId]);
        obj['host'] = '';
        obj['when'] = '';
        Object.assign(this, obj);        
    }

    /**
     * Basic getters and setters
    */
    getUserId() {
        return this.userId;
    }

    setUserId(userId) {
        this.userId = userId;
    }

    getAppId() {
        return this.appId;
    }

    setAppId(appId) {
        this.appId = appId;
    }

    getCaseId() {
        return this.caseId;
    }

    setCaseId(caseId) {
        this.caseId = caseId;
    }

    getDocId() {
        return this.docId;
    }

    setDocId(docId) {
        this.docId = docId;
    }
    
    getForApp() {
        return this.forApp;
    }

    setForApp(forApp) {
        this.forApp = forApp;
    }

    getForWhom() {
        return this.forWhom;
    }

    setForWhom(forWhom) {
        this.forWhom = forWhom;
    }

    getAcl() {
        return this.acl;
    }

    setAcl(acl) {
        this.acl = acl;
    }

    getFrom() {
        return this.from;
    }

    setFrom(from) {
        this.from = from;
    }
    
    getTo() {
        return this.to;
    }
    setTo(to) {
        this.to = to;
    }

    getHost() {
        return this.host;
    }
    setHost(host) {
        this.host = host;
    }

    getWhen() {
        return this.when;
    }
    setWhen(when) {
        this.when = when;
    }

    /**
     * Useful methods to encapsulate safeconsent states
     */
    setRequested() {
        this.action = cpaction.REQUESTED;
    }

    setAccepted() {
        this.action = cpState.APPROVE;
    }

    setRejected() {
        this.action = cpState.DISAPPROVE;
    }

    isConsentGiven() {
        return this.action === cpState.APPROVE;
    }

    static fromBuffer(buffer) {
        return SafeConsent.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a consent data to safeconsent
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return Consent.deserializeClass(data, SafeConsent);
    }

    /**
     * Factory method to create a safeconsent object
     */
    static createInstance(userId, appId, caseId, docId, forApp,forWhom,acl,from, to) {
        return new SafeConsent({ userId, appId, caseId, docId, forApp,forWhom, acl,from, to });
    }

    static getClass() {
        return 'org.safeconnet.safeconsent';
    }
}

module.exports = SafeConsent;
