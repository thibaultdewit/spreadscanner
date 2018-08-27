import DDEX from './ddex.js'
import IDEX from './idex.js'
import EtherFork from './etherfork.js'
import SpreadHunter from './spreadhunter.js'
import _ from 'lodash'

const fs = require('fs');
const EtherForkDeltaTokens = require('./EtherForkDeltaTokensRepository.js')

function app() {
  var promises = []
  var coinData = {}
  DDEX.getDdexList().then(coins => {
    for(var x = 0; x < coins.length; x++){
      if(coins[x] != coins[x].toUpperCase()){
        console.log(coins[x])
      }
      var coin = coins[x]
      var ddexPromise = new Promise(function(resolve, reject) {
        DDEX.getDdexData(coin)
          .then(result => {
            if(coinData[result.coin]){
              coinData[result.coin].push(result)
              resolve('worked')
            } else {
              coinData[result.coin] = [result]
              resolve('worked')
            }
          })
          .catch(error => {
            if(error.response){
              console.log('DDEX Error 1')
              console.log(error.response.data)
              reject()
            } else {
              console.log('DDEX Error 2')
              console.log(error)
              reject()
            }
          })
      })
      promises.push(ddexPromise)
      var idexPromise = new Promise(function(resolve, reject) {
        IDEX.getIdexTokenData(coin.toUpperCase())
          .then(result => {
            if(coinData[result.coin]){
              coinData[result.coin].push(result)
              resolve('worked')
            } else {
              coinData[result.coin] = [result]
              resolve('worked')
            }
          })
          .catch(error => {
            if(error.response){
              console.log('IDEX Error 1')
              console.log(error.response.data)
              reject()
            } else {
              console.log('IDEX Error 2')
              console.log(error)
              reject()
            }
          })
      })
      promises.push(idexPromise)
    }
    Promise.all(promises.map(p => p.catch(e => e)))
      .then(results => {
        SpreadHunter.findSpread(coinData, 'ddex-idex.json')
      })
      .catch(e => console.log(e));
  })
}

function tokensDict(tokensArray) {
  var tokenAddressData = {}
  var etherForkTokenData = []
  var promises = []
  _.forEach(tokensArray, function(token) {
    tokenAddressData = Object.assign(tokenAddressData, {[token.addr] : token.name})
  });
  EtherFork.getEtherForkData()
    .then(data => {
      _.forIn(data.data, function(value, key) {
        var etherForkToken = {
          exchange : 'EtherForkDelta',
          coin : tokenAddressData[value.tokenAddr],
          ask : value.ask,
          bid : value.bid
        }
        etherForkTokenData.push(etherForkToken)
      })
      console.log(etherForkTokenData.length)
      assembleTheGiants(etherForkTokenData)
    })
}

function assembleTheGiants(etherForkArray) {
  console.log('in assemble the giants')
  var coinData = {}
  var promises = []
  var errors = 0
  _.forEach(etherForkArray, function(value) {
    var idexPromise = new Promise(function(resolve, reject) {
      IDEX.getIdexTokenData(value.coin)
        .then(result => {
          coinData[result.coin] = [result, value]
          resolve('worked here')
        })
        .catch(error => {
          if(error.response){
            // console.log('IDEX with EtherFork 1')
            // console.log(error.response.data)
            errors++
            reject()
          } else {
            // console.log('IDEX with EtherFork 2')
            // console.log(error)
            errors++
            reject()
          }
        })
    })
    promises.push(idexPromise)
  })
  Promise.all(promises.map(p => p.catch(e => e)))
    .then(results => {
      console.log('promises.all over')
      console.log(coinData)
      SpreadHunter.findSpread(coinData, 'forkdelta-idex.json')
    })
    .catch(e => console.log(e));
}



// ----------------------------------------------------
// functions calls

// tokensDict(EtherForkDeltaTokens)

// readJson()

app()
