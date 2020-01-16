const keystore  = require('../src/js/keystore.js');
const assert     = require('chai').assert;
const fs        = require('fs-extra');
let accounts    = { keystore : keystore }

describe('keystore', function() {
  describe('open', function() {
    it('Return keypair from password and keystore', async function() {
      var keystore = await fs.readJson(`${__dirname}/resources/testkeystore`)
      var pass = 'Il0ve$eele'
      var priv = '0xd10fddbe805f8b6db67ad95443a6e50388a2c942e21d437d40a042514d94405d'
      var pair = await accounts.keystore.open(keystore, pass)
      assert.equal(pair.privateKey, priv)
    });
  });

  describe('lock', function() {
    it('Check if locked is openable', async function() {
      var pass = 'Il0ve$eele'
      var priv = '0xd10fddbe805f8b6db67ad95443a6e50388a2c942e21d437d40a042514d94405d'
      var keystore = await accounts.keystore.lock(priv, pass)
      var pair = await accounts.keystore.open(keystore, pass)
      assert.equal(pair.privateKey, priv)
    });
  });
});
