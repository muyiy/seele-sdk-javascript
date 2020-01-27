

"use strict";

const SEELE_SUBSCRIPTION_TOPICS
    = {"newBlockHeaders":"newBlockHeaders",
    "transaction":"transaction",
    "debt" : "debt",
    "event":"event"} ;

const seele = require("./rpc.js");
const wallet = require("./wallet.js");
const utils = require("./key");
const EventEmitter = require("eventemitter3")
const web3abi = require("web3-eth-abi")

/**@class */
class Subscription {
    /**
     * @method
     * @param {object} options An object, must specified field host
     * @return {object} Subscription object
     * @example
     * new Subscription({"host":"127.0.0.1:8037"})
     * // returns
     */
    constructor(options) {
        this.topicList = SEELE_SUBSCRIPTION_TOPICS;
        this.id = new Date().getTime();
        this.host = options.host;
        this.topics = {};
    }

    sub(topicName,topicOptions){
        console.log("call sub",topicName);
        if ( SEELE_SUBSCRIPTION_TOPICS[topicName] == undefined) {
            console.log("invalid topic name")
            return
        }
        let eventEmitter = new EventEmitter();
        if (topicName == SEELE_SUBSCRIPTION_TOPICS.newBlockHeaders){
            if (this.topics[topicName]){
                clearInterval(this.topics[topicName])
            }
            let subId = listenBlockHeaders(this.host,topicOptions,eventEmitter)
            this.topics[topicName] = subId
        }else if (topicName == SEELE_SUBSCRIPTION_TOPICS.event){
            if (this.topics[topicName]){
                clearInterval(this.topics[topicName])
            }
            let subId = listenLogs(this.host,topicOptions,eventEmitter)
            if (typeof(subId)=="string"){
                console.log("sub topic failed");
            }else{
                this.topics[topicName] = subId
            }
        }else if (topicName ==SEELE_SUBSCRIPTION_TOPICS.transaction){
            if (this.topics[topicName]){
                clearInterval(this.topics[topicName])
            }
            let subId = listenTransaction(this.host,topicOptions,eventEmitter)
            if (typeof(subId)=="string"){
                console.log("sub topic failed");
            }else{
                this.topics[topicName] = subId
            }
        }else if (topicName ==SEELE_SUBSCRIPTION_TOPICS.debt){
            if (this.topics[topicName]){
                clearInterval(this.topics[topicName])
            }
            let subId = listenDebt(this.host,topicOptions,eventEmitter)
            if (typeof(subId)=="string"){
                console.log("sub topic failed");
            }else{
                this.topics[topicName] = subId
            }
        }
        return eventEmitter;
    }

    unsub(topicName){
        if (this.topics[topicName]){
            clearInterval(this.topics[topicName]);
            delete this.topics[topicName];
            return true;
        }else if (SEELE_SUBSCRIPTION_TOPICS[topicName]==undefined) {
            console.log("topic name invalid:"+topicName);
            return false;
        }else{
            console.log("topic not subscribed:"+topicName);
            return false;
        }
    }
}

let listenBlockHeaders = function(host,options,eventEmitter){
    //options.startHeight: start listen from this block height
    let startHeight = -1;
    if (options != undefined  && options.startHeight != undefined) {
        startHeight = options.startHeight;
    }
    let blockHeight = startHeight
    return setInterval(function () {
         let seeleJSONRPC = new seele(host);
            try {
                let result = seeleJSONRPC.sendSync("getBlock", '', blockHeight, false)
                if (result.header!=undefined && result.header.Height!=undefined){
                    eventEmitter.emit('data',result.header);
                    blockHeight = result.header.Height + 1;
                }else{
                    eventEmitter.emit('error',"no header info")
                }
            }catch (e) {
                eventEmitter.emit('error',e.toString())
            }
    },15*1000)

}

let validateLogsTopicParams = function (host,options){
    if (options == undefined) {
        return new Error("option is undefined");
    }
    let contractAddress = options.contractAddress;
    if (contractAddress == undefined) {
        return new Error("option contractAddress is undefined");
    }
    let abiJSON = options.abiJSON;
    if (abiJSON == undefined) {
        return new Error("option abiJSON is undefined");
    }
    let eventName = options.eventName;
    if (eventName == undefined) {
        return new Error("option eventName is undefined");
    }
    let startHeight = -1;
    let seeleJSONRPC = new seele(host);
    if (options.startHeight != undefined) {
        startHeight = options.startHeight;
    }else{
        //get current block height as startHeight
        let retryTimes = 0;
        do{
            try{
                let result = seeleJSONRPC.sendSync("getBlock","",-1,false);
                if (result.header!=undefined && result.header.Height!=undefined){
                    options.startHeight = result.header.Height;
                    startHeight = options.startHeight
                }
            }catch (e) {
                retryTimes++;
                if (retryTimes>=10){
                    return e;
                }
            }
        }while(startHeight==-1);
    }
    return null;
}
let listenLogs = function (host,options,eventEmitter) {
    let err = validateLogsTopicParams(host,options);
    if (err != null && err != ""){
        return err.toString();
    }
    let blockHeight = options.startHeight;
    let seeleJSONRPC = new seele(host);
    return setInterval(function () {
        try {
            let result = seeleJSONRPC.sendSync("getLogs", blockHeight, options.contractAddress, options.abiJSON, options.eventName)
            if (result != undefined && result.length > 0){
                console.log(result);
                eventEmitter.emit('data',result);
            }
            blockHeight = blockHeight + 1;
        }catch (e) {
            eventEmitter.emit('error',e.toString())
        }
    },1*1000)
}

let validateTransactionTopicParams = function (host,options){
    if (options == undefined) {
        return new Error("option is undefined");
    }
    let from = options.from;
    let to = options.to;
    let account = options.account;
    if (from != undefined && !utils.valid(from)){
        return new Error("option from address is invalid");
    }
    if (to != undefined && !utils.valid(to)){
        return new Error("option to address is invalid");
    }
    if (account != undefined && !utils.valid(account)){
        return new Error("option to address is invalid");
    }
    let txhash = options.txhash;
    if (txhash == undefined && from == undefined && to ==undefined && account == undefined){
        return new Error("subscription transaction should define at least one option:from, to, or txhash, account");
    }

    let startHeight = -1;
    let seeleJSONRPC = new seele(host);
    if (options.startHeight != undefined) {
        startHeight = options.startHeight;
    }else{
        //get current block height as startHeight
        let retryTimes = 0;
        do{
            try{
                let result = seeleJSONRPC.sendSync("getBlock",host,"",-1,false);
                if (result.header!=undefined && result.header.Height!=undefined){
                    options.startHeight = result.header.Height;
                    startHeight = options.startHeight
                }
            }catch (e) {
                retryTimes++;
                if (retryTimes>=10){
                    return e;
                }
            }
        }while(startHeight==-1);
    }
    return null;
}
let listenTransaction = function(host, options, eventEmitter) {
    let err = validateTransactionTopicParams(host,options);
    if (err != null && err != ""){
        return err.toString();
    }
    let blockHeight = options.startHeight;
    let seeleJSONRPC = new seele(host);
    return setInterval(function () {
        try {
            console.log("blockHeight:"+blockHeight);
            let result = seeleJSONRPC.sendSync("getBlockByHeight", blockHeight, true)
            if (result != undefined ){
                // first check txhash
                if (options.txhash != undefined){
                    let tx = filterTxhashFromBlock(result,options.txhash);
                    if(tx != "") {
                        eventEmitter.emit('data',tx);
                    }
                }else if(options.account != undefined){
                    // second check account ( from or to ), txs or debts
                    let txs = filterAccountTxsFromBlock(result,options.account);
                    if(txs.length > 0) {
                        eventEmitter.emit('data',result);
                    }
                }else{
                    // third check from or to
                    let txs = filterAddressTxsFromBlock(result,options.from,options.to);
                    if(txs.length > 0) {
                        eventEmitter.emit('data',result);
                    }
                }
            }
            blockHeight = blockHeight + 1;
        }catch (e) {
            eventEmitter.emit('error',e.toString())
        }
    },5*1000)
}


let validateDebtTopicParams = function (host,options){
    if (options == undefined) {
        return new Error("option is undefined");
    }
    let account = options.account;
    if (account != undefined && !utils.valid(account)){
        return new Error("option to address is invalid");
    }
    let debthash = options.debthash;
    if (debthash == undefined && account == undefined){
        return new Error("subscription debt should define at least one option:debthash, account");
    }

    let startHeight = -1;
    let seeleJSONRPC = new seele(host,2);
    if (options.startHeight != undefined) {
        startHeight = options.startHeight;
    }else{
        //get current block height as startHeight
        let retryTimes = 0;
        do{
            try{
                let result = seeleJSONRPC.sendSync("getBlock",host,"",-1,false);
                if (result.header!=undefined && result.header.Height!=undefined){
                    options.startHeight = result.header.Height;
                    startHeight = options.startHeight
                }
            }catch (e) {
                retryTimes++;
                if (retryTimes>=10){
                    return e;
                }
            }
        }while(startHeight==-1);
    }
    return null;
}
let listenDebt = function(host, options, eventEmitter) {
    let err = validateDebtTopicParams(host,options);
    if (err != null && err != ""){
        return err.toString();
    }
    let blockHeight = options.startHeight;
    let seeleJSONRPC = new seele(host);
    return setInterval(function () {
        try {
            let result = seeleJSONRPC.sendSync("getBlockByHeight", blockHeight, true)
            if (result != undefined ){
                // first check txhash
                if (options.debthash != undefined){
                    let debt = filterDebthashFromBlock(result,options.debthash);
                    if(debt != "") {
                        eventEmitter.emit('data',debt);
                    }
                }else if(options.account != undefined){
                    // second check account
                    let debts = filterAccountDebtsFromBlock(result,options.account);
                    if(debts.length > 0) {
                        eventEmitter.emit('data',debts);
                    }
                }
            }
            blockHeight = blockHeight + 1;
        }catch (e) {
            eventEmitter.emit('error',e.toString())
        }
    },5*1000)
}

function filterTxhashFromBlock(block,txhash){
    let txs = block.transactions;
    for (var i=0; i< txs.length; i++){
        if(txs[i].hash==txhash){
            return txs[i];
        }
    }
    return "";
}

function filterAccountTxsFromBlock(block,account){
    let txs = block.transactions;
    let retTxs = [];
    for (var i=0; i< txs.length; i++){
        if(txs[i].from==account || txs[i].to==account){
            retTxs.push(txs[i]);
        }
    }
    return retTxs;
}

function filterAddressTxsFromBlock(block,from,to) {
    let txs = block.transactions;
    let retTxs = [];
    for (var i=0; i< txs.length; i++){
        if(from != undefined && to == undefined && txs[i].from==from){ // only filter from
            retTxs.push(txs[i]);
        }else if (from == undefined && to != undefined && txs[i].to==to){ // only filter to
            retTxs.push(txs[i]);
        }else if (from != undefined && to != undefined && txs[i].from==from && txs[i].to==to){
            retTxs.push(txs[i]);
        } // filter both from and to
    }
    return retTxs;
}

function filterDebthashFromBlock(block,debthash){
    let debts = block.debts;
    for (var i=0; i< debts.length; i++){
        if(debts[i].Hash==debthash){
            return debts[i];
        }
    }
    return "";
}
function filterAccountDebtsFromBlock(block,account){
    let debts = block.debts;
    let retDebts = [];
    for (var i=0; i< debts.length; i++){
        if(debts[i].Data.Account==account){
            retDebts.push(debts[i]);
        }
    }
    return retDebts;
}
module.exports = Subscription;