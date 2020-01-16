const createKeccakHash  = require('keccak')
const RLP               = require('rlp')
const secp256k1         = require('secp256k1')
let bip32               = require('bip32')
let bip39               = require('bip39')
let bip44               = require('bip44-constants'), BIP44 = {}
let Base58              = require('base-58')
const key               = require('./key')
bip44.splice(450, 0, [ 0x800001c8, 'SEELE', 'Seele' ]) // right before 'AE'
for ( var c of bip44 ) { BIP44[c[1]] = { name: c[2], index: c[0] - 2147483648 } }
bip44 = BIP44

const maxShard    = 4

/** @namespace*/
var wallet = {


  /**
   * @method
   * @param {string} word A string of mnemonic words
   * @return {object} Account object containing 4 keypairs, one from each of 4 shards
   * @example
   * wallet.fromWord()
   * // returns
   */
  fromWord: function accountFromWord(word){
    // check word validity
    return this.fromSeed(bip39.mnemonicToSeedSync(word).toString('hex'))
  },


  /**
   * @method
   * @param {string} seed A string of seed in base 58
   * @return {object} Account object containing 4 keypairs, one from each of 4 shards
   * @example
   * wallet.fromSeed()
   * // returns
   */
  fromSeed: function accountFromSeed(seed){
    // check seed validity
    var seedB = Buffer.from(seed, 'hex')
    var account = []
    var root = bip32.fromSeed(seedB);
    for ( var shard = 1 ; shard <= maxShard ; shard++ ){
      var info = {
        shard: null,
        privateKey: null,
        address: null
      }, i = 0;
      while( info.shard != shard ){
        var path = `m/44'/${bip44.SEELE.index}'/0'/0/${i}`
        var node = root.derivePath(path)
        var priv = '0x'+node.privateKey.toString('hex')
        var addr = key.addof(priv)
        var shrd = key.shard(addr)
        info.shard      = shrd
        info.privateKey = priv
        info.address    = addr
        info.index      = i
        i++;
      }
      account.push(info)
    }
    return account
  },


  /**
   * @method
   * @param {string} word A string of mnemonic words
   * @param {number} depth The number of addresses to discover
   * @return {object} Object containing shard distribution and address by index
   * @example
   * wallet.distWord()
   * // returns
   */
  distWord: function distributionFromWord(word, depth){
    return this.distSeed(bip39.mnemonicToSeedSync(word), depth)
  },


  /**
   * @method
   * @param {string} seed A string of seed in base 58
   * @param {number} depth The number of addresses to discover
   * @return {object} Object containing shard distribution and address by index
   * @example
   * wallet.distSeed()
   * // returns
   */
  distSeed: function distributionFromSeed(seed, depth){
    var i = 0, shards = []
    var root = bip32.fromSeed(seed);
    while ( i < depth ) {
      var path = `m/44'/${bip44.SEELE.index}'/0'/0/${i}`
      // console.log(path);
      var node = root.derivePath(path)
      var priv = '0x'+node.privateKey.toString('hex')
      var addr = key.addof(priv)
      var shrd = key.shard(addr)
      shards.push({
        'index': i,
        'shard': shrd,
        'address': addr
      })
      i++;
    }
    return shards;
  }
}


module.exports = wallet
