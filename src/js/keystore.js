const scrypt            = require('scrypt-js')
const secp256k1         = require('secp256k1') // for elliptic operations
const createKeccakHash  = require('keccak')    // for hashing
const RLP               = require('rlp')       // for serialization

const version     = 1
const	ScryptN     = 1 << 18
const	ScryptP     = 1
const	scryptR     = 8
const scryptDKLen = 32

/** @namespace*/
var keystore = {
  /**
   * @method
   * @param {object} keyfile Keystore object in json format
   * @param {string} pass Password to decrypt Keystore
   * @return {object} privateKey and address pair from decryption
   * @example
   *
   * keystore.open()
   * // returns
   * //
   */
  open : async function decryptKeystore(keyfile, pass){
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
  },


  /**
   * @method
   * @param {string} privatekey PrivateKey to encrypt
   * @param {string} pass Password used to encrypt privateKey
   * @return {object} Keystore file
   * @example
   * 
   * keystore.lock()
   * // returns
   * //
   */
  lock : async function encryptKeystore(privatekey, pass){
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

module.exports = keystore
