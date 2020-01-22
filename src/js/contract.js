const Web3  = require('web3')
const web3  = new Web3()

/**@class */
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

module.exports = seeleCONTRACT
