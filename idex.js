import axios from 'axios'

var IDEX = {
  getIdexTokenData : function(coin) {
    return new Promise(function(resolve, reject) {
      var url = 'https://api-regional.idex.market/returnOrderBook?market=ETH_' + coin
      axios.get(url)
        .then(function (response) {
          var tickerData = {
            exchange : 'idex',
            coin : coin,
            ask : response.data.asks[0].price,
            bid : response.data.bids[0].price
          }
          resolve(tickerData)
        })
        .catch(function (error) {
          console.log('IDEX ERROR ' + coin)
          reject(error)
        });
    })
  },
  returnIdexTicker : function() {
    return new Promise(function(resolve, reject) {
      var url = 'https://api.idex.market/returnTicker'
      axios.get(url)
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          console.log('IDEX ERROR')
          reject(error)
        });
    })
  }
}

export default IDEX
