const node  = [ 0, 'http://117.50.97.136:18037', 'http://117.50.97.136:8038', 'http://104.218.164.77:8039', 'http://117.50.97.136:8036']
const fs    = require('fs-extra')
const path  = require('path')
const Webs  = require('../../src/js/jsonrpc.js')
const key   = require('../../src/js/key.js')
const Web3  = require('web3')
const web3  = new Web3()

var address = '0x00d39049d839e1700a30a30c8fec717cbe0b0012'
var abi     = fs.readJsonSync(path.join(__dirname, 'StemRootchain.json'))
var shard   = key.shard(address)
var webs    = new Webs(node[shard])
var beg     = 1529189
var end     = 1529189
var name    = 'AddOperatorRequest'

getLogsByRange(beg, end, address, abi, name)

async function getLogsByRange(beg, end, address, abi, name){
  for ( var i = beg ; i <= end ; i++ ){
    await getLogsByHeight(i, address, abi, name);
  }
}

async function getLogsByHeight(height, address, abi, name){
  return webs.getLogs(
          height,
          address,
          JSON.stringify(abi),
          name
        )
        .then(d=>{
          console.log(`height ${height}: ${JSON.stringify(d)}\n`);

          var types   = searchArrayByField(abi, 'name', name)
          var result  = web3.eth.abi.decodeParameters(types.inputs, d[0].data);
          console.log(result);

          var topic   = web3.eth.abi.encodeEventSignature(types)
          console.log(topic);
        })
        .catch(e=>{
          console.log(e);
        })
}

function searchArrayByField(list, field, name){
  for ( var item of list ) {
    if (item[field] == name ) {
      return item
    }
  }
}
