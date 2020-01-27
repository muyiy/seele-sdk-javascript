### Generating payload with contract class

```javascript
const sle = require('seele-sdk-javascript')
var contract = new sle.contract(abi, address)

// The abi would be abi generated from solidity contract compilation, if the method of the abi is an event (instead of a function, which this feature is designed for) The byteCode field of result would be undefined
var result = contract.yourMethod(...yourArguments)
console.log(result);

```
The ```byteCode``` field can then be used for call's payload or transaction's payload as further documented in [Seele API Documentation](https://seeletech.gitbook.io/wiki/developer/rpc).
