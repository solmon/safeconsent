/*
 * SmartContract Chaincode for user consent operations on the hyperledger fabric
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AppMgmt extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger for testing ===========');

        const apps = [
            {
                name: 'Remote Diagnosis',
                ver: '1.0',
                comdate: '01012001',
                status: 'active',
                decomdate: null
            },
            {
                name: 'Remote Diagnosis',
                ver: '1.0',
                comdate: '01012001',
                status: 'active',
                decomdate: null
            }
        ];
        

        for (let i = 0; i < apps.length; i++) {
            apps[i].docType = 'app';
            await ctx.stub.putState('APP' + i, Buffer.from(JSON.stringify(apps[i])));
            console.info('Added <--> ', apps[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }
    
    async queryApp(ctx, appId) {
        const appAsBytes = await ctx.stub.getState(appId); // get the app from chaincode state
        if (!appAsBytes || appAsBytes.length === 0) {
            throw new Error(`${appId} does not exist`);
        }
        console.log(appAsBytes.toString());
        return appAsBytes.toString();
    }

    async createApp(ctx, appId, name, ver, comdate) {
        console.info('============= START : Create App ===========');

        const app = {
            name,
            docType: 'app',
            ver,
            comdate,    
            decomdate: null,
            status: 'active'
        };

        await ctx.stub.putState(appId, Buffer.from(JSON.stringify(app)));
        console.info('============= END : Create App ===========');
    }

    async queryAllApps(ctx) {
        const startKey = 'APP0';
        const endKey = 'APP999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    async queryAppById(ctx, key) {
        console.log('Key is ' + key);
        const res = await ctx.stub.getState(key);
        if (res){
            console.log('Result is\n' + JSON.parse(res.toString()));
            let Record;
            try {
                Record = JSON.parse(res.toString('utf8'));
            } catch (err) {
                console.log(err);
                Record = res.toString('utf8');
            }
            return JSON.stringify([{ key, Record }]);
        }
        else{
            console.err('Did not find the app with appId ' + key);
            return [];
        }
    }

    async decommissionApp(ctx, appId) {
        console.info('============= START : decommissionApp ===========');

        const appAsBytes = await ctx.stub.getState(appId); 
        if (!appAsBytes || appAsBytes.length === 0) {
            throw new Error(`${appId} does not exist`);
        }
        const app = JSON.parse(appAsBytes.toString());
        app.status = 'inactive';

        await ctx.stub.putState(appId, Buffer.from(JSON.stringify(app)));
        console.info('============= END : decommissionApp ===========');
    }

}

module.exports = AppMgmt;
