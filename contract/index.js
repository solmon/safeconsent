/*
 * Contract Package Export for the user consent
 */

'use strict';

const safeConsentContract = require('./lib/safeconsentcontract.js');
const appMgmtContract = require('./lib/appmgmt.js')

module.exports.contracts = [ safeConsentContract, appMgmtContract ];