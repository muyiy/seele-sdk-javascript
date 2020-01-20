var abi     = fs.readJsonSync(path.join(__dirname, 'StemRootchain.json'))
var address = '0x00d39049d839e1700a30a30c8fec717cbe0b0012'
// var abi     = [
//   'a',
//   'b',
//   'c'
// ]

/** @class */
class seeleCONTRACT {
  constructor(address, abi){
    this.address = address
    this.abi     = abi

    for (const name of this.abi) {
      console.log(name);
    }
  }

  codeOf(){

  }
}

var mycon = new seeleCONTRACT(address, abi)
