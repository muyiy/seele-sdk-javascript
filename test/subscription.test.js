const Subscription = require('../src/js/subscription.js')
const assert    = require('chai').assert;

describe('subscription', function() {
  describe('subNewBlockHeaders', function() {
     it('sub topic NewBlockHeaders from specified block height', function() {
         let subscription = new Subscription({
             "host":"http://117.50.38.29:8037"
         });
         let sub = subscription.sub(subscription.topicList.newBlockHeaders,
          {
            "startHeight": 1
          });
         assert.isDefined(sub);
         assert.isDefined(subscription.topics[subscription.topicList.newBlockHeaders]);
         subscription.unsub(subscription.topicList.newBlockHeaders);
         assert.isUndefined(subscription.topics[subscription.topicList.newBlockHeaders]);
     });
     it('sub topic NewBlockHeaders from latest block ', function() {
          let subscription = new Subscription({
              "host":"http://117.50.38.29:8037"
          });
          let sub = subscription.sub(subscription.topicList.newBlockHeaders,
              {});
          assert.isDefined(sub);
          assert.isDefined(subscription.topics[subscription.topicList.newBlockHeaders]);
          subscription.unsub(subscription.topicList.newBlockHeaders);
          assert.isUndefined(subscription.topics[subscription.topicList.newBlockHeaders]);
      });
  });
  describe('subEvent',function(){
      const fs    = require('fs-extra')
      const path  = require('path')
      let abi  = fs.readJsonSync(path.join(__dirname, './resources/StemRootchain.json'))
      let subscription = new Subscription({
          "host":'http://104.218.164.77:8039'
      });
      it('sub topic event from specified block height',function () {
        let sub = subscription.sub(subscription.topicList.event,
            {
                "startHeight" : 1699180,
                "contractAddress":"0x00d39049d839e1700a30a30c8fec717cbe0b0012",
                "abiJSON":JSON.stringify(abi),
                "eventName":"AddOperatorRequest"
            }
        )
          assert.isDefined(sub);
          assert.isDefined(subscription.topics[subscription.topicList.event]);
          subscription.unsub(subscription.topicList.event);
          assert.isUndefined(subscription.topics[subscription.topicList.event]);
    });
      it('sub topic event from current block height',function () {
          let sub = subscription.sub(subscription.topicList.event,
              {
                  "contractAddress":"0x00d39049d839e1700a30a30c8fec717cbe0b0012",
                  "abiJSON":JSON.stringify(abi),
                  "eventName":"AddOperatorRequest"
              }
          )
          assert.isDefined(sub);
          assert.isDefined(subscription.topics[subscription.topicList.event]);
          subscription.unsub(subscription.topicList.event);
          assert.isUndefined(subscription.topics[subscription.topicList.event]);
      })
  });
  describe('subTransaction',function(){
    let subscription = new Subscription({
        "host":'http://117.50.38.29:8036'
    });
    it('sub transaction from specified block height and sub by txhash',function () {
        let sub = subscription.sub(subscription.topicList.transaction,
            {
                "startHeight" : 1784417,
                 "txhash":"0x73fbc90257c21c61a10eda352c7b3c30b4148837d56e460b6cba3215dcf47338"
            }
        )
        assert.isDefined(sub);
        assert.isDefined(subscription.topics[subscription.topicList.transaction]);
        subscription.unsub(subscription.topicList.transaction);
        assert.isUndefined(subscription.topics[subscription.topicList.transaction]);
    });
    it('sub transaction by account (either from or to)',function () {
          let sub = subscription.sub(subscription.topicList.transaction,
              {
                  "startHeight" : 1784417,
                  "account" : "0xf1774c7b15113c6f4d7e1a9a941dc00dc2bf5ed1"
              }
          )
          assert.isDefined(sub);
          assert.isDefined(subscription.topics[subscription.topicList.transaction]);
          subscription.unsub(subscription.topicList.transaction);
          assert.isUndefined(subscription.topics[subscription.topicList.transaction]);
      });
      it('sub transaction by from)',function () {
          let sub = subscription.sub(subscription.topicList.transaction,
              {
                  "startHeight" : 1784417,
                  "from" : "0xf1774c7b15113c6f4d7e1a9a941dc00dc2bf5ed1"
              }
          )
          assert.isDefined(sub);
          assert.isDefined(subscription.topics[subscription.topicList.transaction]);
          subscription.unsub(subscription.topicList.transaction);
          assert.isUndefined(subscription.topics[subscription.topicList.transaction]);
      });
      it('sub transaction by to)',function () {
          let sub = subscription.sub(subscription.topicList.transaction,
              {
                  "startHeight" : 1784417,
                  "to" : "0xf1774c7b15113c6f4d7e1a9a941dc00dc2bf5ed1"
              }
          )
          assert.isDefined(sub);
          assert.isDefined(subscription.topics[subscription.topicList.transaction]);
          subscription.unsub(subscription.topicList.transaction);
          assert.isUndefined(subscription.topics[subscription.topicList.transaction]);
      });
  });
  describe('subDebt',function () {
      let subscription = new Subscription({
          "host":'http://107.150.102.94:8039'
      });
      it('sub debt from specified block height and sub by debthash',function () {
          let sub = subscription.sub(subscription.topicList.debt,
              {
                  "startHeight" : 66912,
                  "debthash":"0x24e5c0d4452336f1575935205f65e208b504fa11d080ff1ca23c63f92959013f"
              }
          )
          assert.isDefined(sub);
          assert.isDefined(subscription.topics[subscription.topicList.debt]);
          subscription.unsub(subscription.topicList.debt);
          assert.isUndefined(subscription.topics[subscription.topicList.debt]);
      });
      it('sub debt from specified block height and sub by account',function () {
          let sub = subscription.sub(subscription.topicList.debt,
              {
                  "startHeight" : 66912,
                  "account" : "0x991d2607883e94caae010904b4704747c4530121"
              }
          )
          assert.isDefined(sub);
          assert.isDefined(subscription.topics[subscription.topicList.debt]);
          subscription.unsub(subscription.topicList.debt);
          assert.isUndefined(subscription.topics[subscription.topicList.debt]);
      });
  })
});
