var rpc       = require('./src/js/rpc')
var key       = require('./src/js/key')
var contract  = require('./src/js/contract')
var keystore  = require('./src/js/keystore')
var signature = require('./src/js/signature')
var wallet    = require('./src/js/wallet')
var subscription = require('./src/js/subscription')
// console.log(seeleOFFLINE);

module.exports = {
  rpc:rpc,
  key:key,
  contract:contract,
  subscribe: subscription,
  keystore:keystore,
  signature:signature,
  wallet:wallet
}

// client = new seeleJSONRPC('http://117.50.97.136:18037')
// console.log(client);
// client.getInfo().then( (data)=>{
//   console.log(data);
// }).catch((err)=>{
//   console.log(err);
// })
