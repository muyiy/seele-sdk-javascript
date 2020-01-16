/**
  * Accounts deals with the
  * security and usage of privateKey-address pairs'
  */
const { randomBytes }   = require('crypto')
const scrypt            = require('scrypt-js')
const createKeccakHash  = require('keccak')    // for hashing
const RLP               = require('rlp')       // for serialization
const secp256k1         = require('secp256k1') // for elliptic operations
const Web3              = require('web3')
var web3 = new Web3

const shardnum    = 4
const version     = 1
const	ScryptN     = 1 << 18
const	ScryptP     = 1
const	scryptR     = 8
const scryptDKLen = 32

let bip32               = require('bip32')
let bip39               = require('bip39')
let bip44               = require('bip44-constants'), BIP44 = {}
let Base58              = require("base-58")
bip44.splice(450, 0, [ 0x800001c8, 'SEELE', 'Seele' ]) // right before 'AE'
for ( var c of bip44 ) { BIP44[c[1]] = { name: c[2], index: c[0] - 2147483648 } }
bip44 = BIP44

module.exports = {
  wallet: {
    fromWord: accountFromWord,
    fromSeed: accountFromSeed,
    distWord: distributionFromWord,
    distSeed: distributionFromSeed
  },
  key: {
    spawn : generateKeypairByShard,
    shard : shardOfAddress,
    addof : addressOf
  },
  keystore: {
    open: decryptKeystore,
    lock: encryptKeystore
  },
  signature: {
    signMsg: signMessageString,
    signTxn: signTransaction,
    tellMsg: recoverMessageString,
    tellTxn: recoverTransaction,
    initTxn: initiateTransaction
  }
}


function initiateTransaction(from, to, amount){
  //verify from, to, amount, payload?
  return {
        "Type":         0,
        "From":         from,
        "To":           to,
        "Amount":       amount,
        "AccountNonce": 0,
        "GasPrice":     10,
        "GasLimit":     200000,
        "Timestamp":    0,
        "Payload":      ''
  }
}

function signTransaction(prikey, tx){
  var infolist = [
    tx.Type,
    tx.From,
    tx.To,
    tx.Amount,
    tx.AccountNonce,
    tx.GasPrice,
    tx.GasLimit,
    tx.Timestamp,
    tx.Payload
  ]
  // console.log(RLP.encode(infolist));
  var hash = "0x"+createKeccakHash('keccak256').update(RLP.encode(infolist)).digest().toString('hex')
  var signature = secp256k1.sign(Buffer.from(hash.slice(2), 'hex'), Buffer.from(prikey.slice(2), 'hex'))
  var sign = Buffer.concat([signature.signature, Buffer.from([signature.recovery])]).toString('base64')
  var Data = tx
  var txDone = {
    "Hash": hash,
    "Data": Data,
    "Signature": {
      "Sig": sign,
    }
  }
  return txDone
}

function signMessageString(prikey, msg){
  var hash      = createKeccakHash('keccak256').update(RLP.encode(msg)).digest().toString('hex')
  var signature = secp256k1.sign(Buffer.from(hash, 'hex'), Buffer.from(prikey.slice(2), 'hex'))
  var sign      = Buffer.concat([signature.signature, Buffer.from([signature.recovery])]).toString('base64')
  return sign
}

function recoverTransaction(sign, hash){
  var totalB= Buffer.from(sign, 'base64')
  var signB = totalB.slice(0,64)
  var rcvrB = totalB.slice(64)
  var hashB = Buffer.from(hash.slice(2), 'hex')
  var rcvr  = [...rcvrB]
  var pubk  = secp256k1.recover(hashB, signB, rcvr[0], false).slice(1)
  var addr  = publicToAddress('0x'+pubk.toString('hex'))
  return addr
}

function recoverMessageString(sign, msg){
  var totalB= Buffer.from(sign, 'base64')
  var signB = totalB.slice(0,64)
  var rcvrB = totalB.slice(64)
  var hashB = Buffer.from(createKeccakHash('keccak256').update(RLP.encode(msg)).digest().toString('hex'), 'hex')
  var rcvr  = [...rcvrB]
  var pubk  = secp256k1.recover(hashB, signB, rcvr[0], false).slice(1)
  var addr  = publicToAddress('0x'+pubk.toString('hex'))
  return addr
}

function distributionFromWord(word, depth){
  return distributionFromSeed(bip39.mnemonicToSeedSync(word), depth)
}

function distributionFromSeed(seed, depth){
  var i = 0, shards = []
  var root = bip32.fromSeed(seed);
  while ( i < depth ) {
    var path = `m/44'/${bip44.SEELE.index}'/0'/0/${i}`
    // console.log(path);
    var node = root.derivePath(path)
    var priv = '0x'+node.privateKey.toString('hex')
    var addr = addressOf(priv)
    var shrd = shardOfAddress(addr)
    shards.push({
      'index': i,
      'shard': shrd,
      'address': addr
    })
    i++;
  }
  return shards;
}

function accountFromSeed(seed){
  // check seed validity
  var seedB = Buffer.from(seed, 'hex')
  var account = []
  var root = bip32.fromSeed(seedB);
  for ( var shard = 1 ; shard <= shardnum ; shard++ ){
    var info = {
      shard: null,
      privateKey: null,
      address: null
    }, i = 0;
    while( info.shard != shard ){
      var path = `m/44'/${bip44.SEELE.index}'/0'/0/${i}`
      var node = root.derivePath(path)
      var priv = '0x'+node.privateKey.toString('hex')
      var addr = addressOf(priv)
      var shrd = shardOfAddress(addr)
      info.shard      = shrd
      info.privateKey = priv
      info.address    = addr
      info.index      = i
      i++;
    }
    account.push(info)
  }
  return account
}

function accountFromWord(word){
  // check word validity
  return accountFromSeed(bip39.mnemonicToSeedSync(word).toString('hex'))
}

function randHex(len){
  var maxlen = 8,
      min = Math.pow(16,Math.min(len,maxlen)-1)
      max = Math.pow(16,Math.min(len,maxlen)) - 1,
      n   = Math.floor( Math.random() * (max-min+1) ) + min,
      r   = n.toString(16);
  while ( r.length < len ) {
     r = r + randHex( len - maxlen );
  }
  return r;
};

function decryptKeyfileSub(keyfile, pass, html){}

function encryptKeyfileSub(privkey, pass, html){}

async function decryptKeystore(keyfile, pass, html){
  //check version
  if ( keyfile.version!= version ) {
    throw 'error: keyversion mistmatch'
  }
  return new Promise(function(resolve, reject) {
    try {
      const mac = keyfile.crypto.mac
      const ciphertext = Buffer.from(keyfile.crypto.ciphertext,'hex')
      const iv = Buffer.from(keyfile.crypto.iv,'hex')
      const salt = Buffer.from(keyfile.crypto.salt,'hex')
      const bpass = Buffer.from(pass,'utf8')

      let scryptKey = []
      scrypt(bpass, salt, ScryptN, scryptR, ScryptP, scryptDKLen, function(error, progress, key) {
          if (error) {
            console.log("Error: " + error);
          } else if (key) {
            const crypto = require('crypto');
            const decipher = crypto.createDecipheriv('aes-128-ctr', Buffer.from(key.slice(0,16)), iv)
            var res = decipher.update(ciphertext,'utf8','hex')
            const oubuf = secp256k1.publicKeyCreate(Buffer.from(res,'hex'), false).slice(1);
            var publicKey = createKeccakHash('keccak256').update(RLP.encode(oubuf)).digest().slice(12).toString('hex')
            var addr = "0x"+publicKey.replace(/.$/i,"1")
            var prik = "0x"+res.toString('hex')
            const keypair = {
              "privateKey":prik,
              "address":addr
            }
            // console.log(keypair);
            return resolve(keypair)
          } else {
            // update UI with progress complete
            // console.log(progress.toFixed(2)*100,"%");
          }
        })
    } catch(e) {
      reject(e)
    }
  });
}

async function encryptKeystore(privatekey, pass, html){
  return new Promise(function(resolve, reject) {
    const salt = randHex(64)
    const iv = randHex(32)
    const passb = Buffer.from(pass,'utf8')
    const saltb = Buffer.from(salt, 'hex')
    const ivb = Buffer.from(iv,"hex")

    scrypt(passb, saltb, ScryptN, scryptR, ScryptP, scryptDKLen, function(error, progress, key) {
        if (error) {
          console.log("Error: " + error);
        } else if (key) {
          // console.log("Found: " + key);
          const crypto = require('crypto');
          prib = Buffer.from(privatekey.slice(2),'hex')
          const cipher = crypto.createDecipheriv('aes-128-ctr', Buffer.from(key.slice(0,16)), ivb)
          var ciphertx = cipher.update(prib,'utf8','hex')
          const p1 = Buffer.from(key.slice(16,32))
          const p2 = Buffer.from(ciphertx,'hex')
          const mac = "0x"+createKeccakHash('keccak256').update(p1).update(p2).digest().toString('hex')
          const oubuf = secp256k1.publicKeyCreate(prib, false).slice(1);
          var publicKey = createKeccakHash('keccak256').update(RLP.encode(oubuf)).digest().slice(12).toString('hex')
          const pubk = "0x"+publicKey.replace(/.$/i,"1")

          const keyfile = {
                  "version": version,
                  "address": pubk,
                  "crypto": {
                          "ciphertext": ciphertx,
                          "iv": iv,
                          "salt": salt,
                          "mac": mac
                  }
          }
          // console.log(keyfile);
          resolve(keyfile)
        } else {
          // update UI with progress complete
          // console.log(parseInt(progress*100).toString(),"%");
        }
      })

  });
}

async function validPub(pubkey){
    if (!(/^(0x)?[0-9a-f]{40}$/.test(pubkey) || /^(0x)?[0-9A-F]{40}$/.test(pubkey))) {
      return false;
    }
    return true
  }

async function txValidity(tx){
    if (typeof tx.to !== 'string' || tx.to.length!=42 || tx.to.slice(0,2)!="0x"){
      throw "invalid receiver address, should be of length 42 with prefix 0x"
      return false
    }
    if (typeof tx.payload !== 'string'){
      throw "invalid payload"
      return false
    }
    if (typeof tx.nonce !== 'number' || tx.nonce < 0) {
      console.log(typeof tx.nonce)
      throw "invalid nonce"
      return false
    }
    if (typeof tx.amount !== 'number' || tx.amount < 0) {
      console.log(typeof tx.amount)
      throw "invalid amount"
      return false
    }
    if (typeof tx.price !== 'number' || tx.price < 0) {
      console.log(typeof tx.price)
      throw "invalid price"
      return false
    }
    if (typeof tx.limit !== 'number' || tx.limit < 0) {
      console.log(typeof tx.limit)
      throw "invalid limit"
      return false
    }
    return true

    //nonce, amount, price and limit must be positive integers
  }

function publicToAddress(pub){
  var buf = Buffer.from(pub.slice(2), 'hex');
  var add = "0x" + createKeccakHash('keccak256').update(RLP.encode(buf)).digest().slice(12).toString('hex').replace(/.$/i,"1")
  return add;
}

function privateToPublic(privateKey){
  if (privateKey.length!=66){throw "privatekey string should be of lenth 66"}
  if (privateKey.slice(0,2)!="0x"){throw "privateKey string should start with 0x"}
  const inbuf = Buffer.from(privateKey.slice(2), 'hex');
  if (!secp256k1.privateKeyVerify(inbuf)){throw "invalid privateKey"}
  const oubuf = secp256k1.publicKeyCreate(inbuf, false).slice(1);
  return '0x'+oubuf.toString('hex')
}

function publicKeyOfSub(privateKey){
  return web3.eth.accounts.privateKeyToAccount(privateKey).address
}

function addressOf(pri){
    var pub = privateToPublic(pri)
    var add = publicToAddress(pub)
    return add
}

function shardOfAddress(address){
  var sum = 0
  var buf = Buffer.from(address.substring(2), 'hex')
  for (const pair of buf.entries()) {if (pair[0] < 18){sum += pair[1]}}
  sum += (buf.readUInt16BE(18) >> 4)
  return (sum % shardnum) + 1
}

function generateKeypair(){
    let privKey
    do { privKey = randomBytes(32) } while (!secp256k1.privateKeyVerify(privKey))

    // get the public key in a compressed format
    let pubKey = secp256k1.publicKeyCreate(privKey)
    pubKey = secp256k1.publicKeyConvert(pubKey, false).slice(1)

    // Only take the lower 160bits of the hash
    let address = createKeccakHash('keccak256').update(RLP.encode(pubKey)).digest().slice(-20)
    address[19] = address[19]&0xF0|1

    return {
        "address" : "0x" + address.toString('hex'),
        "privateKey" : "0x" + privKey.toString('hex'),
    }
}

function generateKeypairSub(){
  let privKey
  do { privKey = randomBytes(32) } while (!secp256k1.privateKeyVerify(privKey))
  var privateKey = "0x" + privKey.toString('hex')

  return {
    "publicKey" : publicKeyOfSub(privateKey),
    "privateKey" : privateKey,
  }
}

function generateKeypairByShard(shardnum){
  var shard = shardnum || 1;
  let keypair
  if ( /^[1-4]$/.test(shard) ) {
    do{
      keypair = generateKeypair()
    } while (shardOfAddress(keypair.address) != shard)
    return keypair
  } else {
    return generateKeypair()
  }
}
