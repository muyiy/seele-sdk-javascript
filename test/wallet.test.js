const wallet    = require('../src/js/wallet.js');
const assert    = require('chai').assert;
let accounts    = { wallet: wallet }

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
