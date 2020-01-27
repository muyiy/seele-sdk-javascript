

```javascript
const sle = require('seele-sdk-javascript')
let subscription = new sle.subscribe({
    "host":"http://117.50.38.29:8036"
});
subscription.sub(subscription.topicList.newBlockHeaders,
    {
    "startHeight" : 1
}
).on('data',function (data) {
    console.log(data.Height);
    if (data.Height >= 10){
        subscription.unsub("newBlockHeaders");
    }
}).on('error',function (error) {
    console.log(error);
    subscription.unsub("newBlockHeaders");
})
```
