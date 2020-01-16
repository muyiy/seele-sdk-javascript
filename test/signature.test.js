const signature  = require('../src/js/signature.js');
const assert     = require('chai').assert;
let accounts    = { signature: signature }

describe('signature', function() {
  describe('signMsg', function() {
    it('Signs a message string', function() {
      var pri   = '0x6f713371e6d5d513fe66b9f6f5974aec46c0a9a5fdd49d24b48128519e6efb1e'
      var msg   = 'seele good'
      var sigE  = 'vBo0McatZ3P1JoGXXiMM6H/zTdEYhHPmMjA+QazPM+Jcxeo7/bBV8mWZseS7FKTG/oSE6fgrbLCRCnOdCpgWDgA='
      var sig   = accounts.signature.signMsg(pri, msg)
      assert.equal(sig,sigE);
    });
  });

  describe('tellMsg', function() {
    it('Returns signing address with signature and hash', function() {
      var sig   = 'vBo0McatZ3P1JoGXXiMM6H/zTdEYhHPmMjA+QazPM+Jcxeo7/bBV8mWZseS7FKTG/oSE6fgrbLCRCnOdCpgWDgA='
      var msg   = 'seele good'
      var addrE = '0x5fc511565316e45e84f3383722a597a01aa80d01'
      var addr  = accounts.signature.tellMsg(sig, msg)
      assert.equal(addr,addrE);
    });
  });

  describe('signTxn', function() {
    it('Signs a transaction Object', function(){
      var pri     = '0x6f713371e6d5d513fe66b9f6f5974aec46c0a9a5fdd49d24b48128519e6efb1e'
      var from    = '0x5fc511565316e45e84f3383722a597a01aa80d01'
      var to      = '0x5fc511565316e45e84f3383722a597a01aa80d01'
      var amount  = 0
      var initTx  = accounts.signature.initTxn(from, to, amount)
      var signTx  = accounts.signature.signTxn(pri, initTx)
      var hash    = signTx.Hash
      var sign    = signTx.Signature.Sig

      var hashE   = "0xf44188948b3e992b8c4b9d09d47c9823886e21106ea289ac36b664270835caef"
      var signE   = "3NhshYXlrBwJT0edhBUxyQoZhGz0lLKQZWHmbExfm4Z2io6F2843LlHxZtwBX97SwcENDV1/KME0Vq1VmqAa7AE="
      assert.equal(hash, hashE)
      assert.equal(sign, signE)
    });
  });

  describe('tellTxn', function() {
    it('Returns signing address with signature and hash', function(){
      var hash    = "0xf44188948b3e992b8c4b9d09d47c9823886e21106ea289ac36b664270835caef"
      var sign    = "3NhshYXlrBwJT0edhBUxyQoZhGz0lLKQZWHmbExfm4Z2io6F2843LlHxZtwBX97SwcENDV1/KME0Vq1VmqAa7AE="

      var addrE   = '0x5fc511565316e45e84f3383722a597a01aa80d01'
      var addr    = accounts.signature.tellTxn(sign, hash)
      assert.equal(addr, addrE);
    });
  });
});
