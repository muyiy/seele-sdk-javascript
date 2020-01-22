### Instantiate the rpc class & using the methods

```javascript
const sle = require('seele-sdk-javascript')

var web = sle.rpc('http://192.193.11.10:8029',2)

web.getInfo().then(d=>{
  console.log(d);
}).catch(e=>{
  console.log(e);
})

```

```getInfo``` is a API function whose input and output is defined in [Seele API Documentation]() along with all other functions available on Seele. Every function defined [Seele API Documentation]() is also callable through and instance of this class.
