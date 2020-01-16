const accounts  = require('../src/js/accounts.js');
const assert    = require('chai').assert;
const fs        = require('fs-extra');

describe('Accounts Tests', function() {
  describe('wallet', function() {
    describe('fromWord', function() {
      it('Return account, array of keypair-information, from mnemonic word', function() {
        var generated = accounts.wallet.fromWord('hurdle broccoli blast rug mixed expire soldier able maze heavy jeans equip')
        var expected = [
          {
            shard: 1,
            privateKey: '0x6f713371e6d5d513fe66b9f6f5974aec46c0a9a5fdd49d24b48128519e6efb1e',
            address: '0x5fc511565316e45e84f3383722a597a01aa80d01',
            index: 1
          },
          {
            shard: 2,
            privateKey: '0xa457b3adedecddacfa1b08f97a6ed8e25b5ed4b1a9692d725c5ed87bd80e36a1',
            address: '0xac5d5a1fc5ebbea4f2044b33be0587deb333c771',
            index: 3
          },
          {
            shard: 3,
            privateKey: '0x19350808989722ee84dda5fe20686ca8af5cf7671e5193d3e0cddf039901a3da',
            address: '0x14130ff8b350230ca326fd468ae8b413efb55891',
            index: 2
          },
          {
            shard: 4,
            privateKey: '0xb168d0823a616d111ba4abf4c27bb9331d3326dedde270d9b0bc77b767c6744e',
            address: '0x05df8b2bf801195092f218dde48c8d41ff280091',
            index: 0
          }
        ]
        assert.equal(generated[0].address, expected[0].address)
        assert.equal(generated[1].address, expected[1].address)
        assert.equal(generated[2].address, expected[2].address)
        assert.equal(generated[3].address, expected[3].address)
      });
    });
    describe('fromSeed', function() {
      it('Return account, array of keypair-information, from mnemonic word', function(){
        var generated = accounts.wallet.fromSeed('ffa23615912356a185e369b0130fbc76b06edc102a33b18e09aecdb9fd9bcf146f9f6e93354797cc366e0433ac734350b5da61d5ac01c1de7c21d3e71e959fa0')
        var expected = [
          {
            shard: 1,
            privateKey: '0x6f713371e6d5d513fe66b9f6f5974aec46c0a9a5fdd49d24b48128519e6efb1e',
            address: '0x5fc511565316e45e84f3383722a597a01aa80d01',
            index: 1
          },
          {
            shard: 2,
            privateKey: '0xa457b3adedecddacfa1b08f97a6ed8e25b5ed4b1a9692d725c5ed87bd80e36a1',
            address: '0xac5d5a1fc5ebbea4f2044b33be0587deb333c771',
            index: 3
          },
          {
            shard: 3,
            privateKey: '0x19350808989722ee84dda5fe20686ca8af5cf7671e5193d3e0cddf039901a3da',
            address: '0x14130ff8b350230ca326fd468ae8b413efb55891',
            index: 2
          },
          {
            shard: 4,
            privateKey: '0xb168d0823a616d111ba4abf4c27bb9331d3326dedde270d9b0bc77b767c6744e',
            address: '0x05df8b2bf801195092f218dde48c8d41ff280091',
            index: 0
          }
        ]
        assert.equal(generated[0].address, expected[0].address)
        assert.equal(generated[1].address, expected[1].address)
        assert.equal(generated[2].address, expected[2].address)
        assert.equal(generated[3].address, expected[3].address)
      });
    });
  });

  describe('key', function() {
    describe('shard', function() {
      it('Return shard of address', function() {
        assert.equal(accounts.key.shard('0x15dcb0a38ae4aef2bd88def8c3588a1196d0d2b1'), 1);
        assert.equal(accounts.key.shard('0x6bce7e284bd2b884d55f86a6af02a40c067f68f1'), 2);
        assert.equal(accounts.key.shard('0x74fef56b59998f0d6fcc3da76163a0f466081fd1'), 3);
        assert.equal(accounts.key.shard('0x3dd6ed2b8ffbe21bb1a848b95caaf01234244c71'), 4);
      });
    });
    describe('addof', function() {
      it('Return address of privatekey', function() {
        assert.equal(accounts.key.addof('0x75aa4a29c343e3e61bb2f5541838988803ca54a47a9ad22b5a7409954bac75b2'), '0x15dcb0a38ae4aef2bd88def8c3588a1196d0d2b1');
        assert.equal(accounts.key.addof('0xcab645d1ef8b93e8b18b5955c0a69695d1d402b1be2e963d3ad433901f02cd56'), '0x6bce7e284bd2b884d55f86a6af02a40c067f68f1');
        assert.equal(accounts.key.addof('0xd10fddbe805f8b6db67ad95443a6e50388a2c942e21d437d40a042514d94405d'), '0x74fef56b59998f0d6fcc3da76163a0f466081fd1');
        assert.equal(accounts.key.addof('0x88be348a7e632640bb8fb82e8c2df90d3a1a32497d995134aadba0acd39afd8e'), '0x3dd6ed2b8ffbe21bb1a848b95caaf01234244c71');
      });
    });
    describe('spawn', function() {
      it('Generate privatekey-address-pair from shard', function(){
        assert.equal(accounts.key.spawn(1).address.length, 42);
        assert.equal(accounts.key.spawn(1).privateKey.length, 66);
      });
    });
  });

  describe('keystore', function() {
    describe('open', function() {
      it('Return keypair from password and keystore', async function() {
        var keystore = await fs.readJson(`${__dirname}/resources/testkeystore`)
        var pass = 'Il0ve$eele'
        var priv = '0xd10fddbe805f8b6db67ad95443a6e50388a2c942e21d437d40a042514d94405d'
        var pair = await accounts.keystore.open(keystore, pass)
        assert.equal(pair.privateKey, priv)
      });
    });

    describe('lock', function() {
      it('Check if locked is openable', async function() {
        var pass = 'Il0ve$eele'
        var priv = '0xd10fddbe805f8b6db67ad95443a6e50388a2c942e21d437d40a042514d94405d'
        var keystore = await accounts.keystore.lock(priv, pass)
        var pair = await accounts.keystore.open(keystore, pass)
        assert.equal(pair.privateKey, priv)
      });
    });
  });

  describe('signature', function() {
    describe('signMsg', function() {
      it('Signs a message string', function() {
        var pri   = '0x6f713371e6d5d513fe66b9f6f5974aec46c0a9a5fdd49d24b48128519e6efb1e'
        var msg   = 'seele good'
        var sigE  = 'vBo0McatZ3P1JoGXXiMM6H/zTdEYhHPmMjA+QazPM+Jcxeo7/bBV8mWZseS7FKTG/oSE6fgrbLCRCnOdCpgWDgA='
        var sig   = accounts.signature.signMsg(pri, msg)
        assert.equal(sig,sigE);
      });
    });

    describe('tellMsg', function() {
      it('Returns signing address with signature and hash', function() {
        var sig   = 'vBo0McatZ3P1JoGXXiMM6H/zTdEYhHPmMjA+QazPM+Jcxeo7/bBV8mWZseS7FKTG/oSE6fgrbLCRCnOdCpgWDgA='
        var msg   = 'seele good'
        var addrE = '0x5fc511565316e45e84f3383722a597a01aa80d01'
        var addr  = accounts.signature.tellMsg(sig, msg)
        assert.equal(addr,addrE);
      });
    });

    describe('signTxn', function() {
      it('Signs a transaction Object', function(){
        var pri     = '0x6f713371e6d5d513fe66b9f6f5974aec46c0a9a5fdd49d24b48128519e6efb1e'
        var from    = '0x5fc511565316e45e84f3383722a597a01aa80d01'
        var to      = '0x5fc511565316e45e84f3383722a597a01aa80d01'
        var amount  = 0
        var initTx  = accounts.signature.initTxn(from, to, amount)
        var signTx  = accounts.signature.signTxn(pri, initTx)
        var hash    = signTx.Hash
        var sign    = signTx.Signature.Sig

        var hashE   = "0xf44188948b3e992b8c4b9d09d47c9823886e21106ea289ac36b664270835caef"
        var signE   = "3NhshYXlrBwJT0edhBUxyQoZhGz0lLKQZWHmbExfm4Z2io6F2843LlHxZtwBX97SwcENDV1/KME0Vq1VmqAa7AE="
        assert.equal(hash, hashE)
        assert.equal(sign, signE)
      });
    });

    describe('tellTxn', function() {
      it('Returns signing address with signature and hash', function(){
        var hash    = "0xf44188948b3e992b8c4b9d09d47c9823886e21106ea289ac36b664270835caef"
        var sign    = "3NhshYXlrBwJT0edhBUxyQoZhGz0lLKQZWHmbExfm4Z2io6F2843LlHxZtwBX97SwcENDV1/KME0Vq1VmqAa7AE="

        var addrE   = '0x5fc511565316e45e84f3383722a597a01aa80d01'
        var addr    = accounts.signature.tellTxn(sign, hash)
        assert.equal(addr, addrE);
      });
    });
  });

  describe('sub', function() {});
});
