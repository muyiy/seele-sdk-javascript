### Instantiate the rpc class & using the methods

```javascript
const sle = require('seele-sdk-javascript')

var web = new sle.rpc('http://192.193.11.10:8029',2)

web.getInfo().then(d=>{
  console.log(d);
}).catch(e=>{
  console.log(e);
})

```

```getInfo``` is a API function whose input and output is defined in [Seele API Documentation](https://seeletech.gitbook.io/wiki/developer/rpc) along with all other functions available on Seele. Every function defined [Seele API Documentation](https://seeletech.gitbook.io/wiki/developer/rpc) is also callable through and instance of this class.
