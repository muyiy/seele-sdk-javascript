const fs     = require('fs-extra')
const path   = require('path')
const assert = require('chai').assert;
const sle   = require('../sle')

// class

describe('contract', function(){
  describe('constructor', function(){
    it('Returns byte code of method called from abi', function(){
      var abi     = fs.readJsonSync(path.join(__dirname, 'resources', 'StemRootchain.json'))
      var address = '0x00d39049d839e1700a30a30c8fec717cbe0b0012'
      var mycon = new sle.contract(address, abi)
      var result = mycon.addOperatorRequest('0x03bcaf796fe8cffd90ddbe0baeb21ab83a3a43e1','0x03bcaf796fe8cffd90ddbe0baeb21ab83a3a43e1')
      var expectedByte = '0x1f96367100000000000000000000000003bcaf796fe8cffd90ddbe0baeb21ab83a3a43e100000000000000000000000003bcaf796fe8cffd90ddbe0baeb21ab83a3a43e1'
      assert.equal(result.byteCode, expectedByte)
    })
  })
})
