const fs    = require('fs-extra')
const path  = require('path')
const Web3  = require('web3')
const web3  = new Web3()
var abi     = fs.readJsonSync(path.join(__dirname, 'StemRootchain.json'))
var address = '0x00d39049d839e1700a30a30c8fec717cbe0b0012'

/** @class */
class seeleCONTRACT {
  constructor(address, abi){
    this.address = address
    this.abi     = abi

    abi.forEach((item, i) => {
      this[item.name] = function(){
        return this.codeOf(item, ...arguments)
      }
    });

  }

  codeOf(cmd){
    var contract = new web3.eth.Contract(this.abi)
    var args = Array.prototype.slice.call(arguments, 1)
    try {
      if ( cmd.type === 'function' ){
        var byts = contract.methods[cmd.name](...args).encodeABI() || '0x00'
      }
    } catch(e) {
      console.log(e);
    }
    return {
      byteCode: byts,
      methodInfo: cmd
    }
  }
}

var mycon = new seeleCONTRACT(address, abi)
console.log(mycon.AddOperatorRequest('0x03bcaf796fe8cffd90ddbe0baeb21ab83a3a43e1','0x03bcaf796fe8cffd90ddbe0baeb21ab83a3a43e1'));
