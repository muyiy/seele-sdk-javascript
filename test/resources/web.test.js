const WEB     = require('../src/js/web.js');
const assert     = require('chai').assert;


let node     = [ 0, 'http://117.50.97.136:18037', 'http://117.50.97.136:8038', 'http://104.218.164.77:8039', 'http://117.50.97.136:8036']

var web = new WEB(node[1], 3000)
web.getLogs(d=>{
  console.log(d);
}).catch(e=>{
  console.log(e);
})
