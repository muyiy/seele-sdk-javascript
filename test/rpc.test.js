const RPC   = require('../src/js/rpc.js');
const assert    = require('chai').assert;
const rpc = new RPC('http://117.50.97.136:8037', 2)
// const rpc = new RPC('http://127.0.0.1:8037', 2)

describe('rpc', function(){
  describe('getinfo', function(){
    it('gets information related to node', async function(){
      // var info = await rpc.getBlockTransactions('',3000)
      var info = await rpc.getInfo()
      // uncomment below to see info
      // console.log(info);
      assert.isAtMost(info.Shard, 4)
      // assert.equal(1,1)
    })
  })
})
