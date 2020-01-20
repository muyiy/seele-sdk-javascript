const Rpc   = require('../src/js/rpc.js');
const assert    = require('chai').assert;

const rpc = new Rpc('http://117.50.97.136:8037', 2)
// console.log(rpc);
rpc.getBlock('',-1,true).then(d=>{
  console.log(d);
}).catch(e=>{
  console.log(e);
})


// describe('rpc', function(){
//   describe('getInfo', function(){
//     it('returns node information', async function(){
//       try {
//         var info = await rpc.getInfo()
//       } catch(e){
//         console.log(e);
//       }
//       assert.equal(info.Shard, 2);
//     })
//   })
// });
