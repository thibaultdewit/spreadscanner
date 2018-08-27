import axios from 'axios'

var DDEX = {
  getDdexData : function(coin) {
    return new Promise(function(resolve, reject){
      var url = 'https://api.ddex.io/v2/markets/' + coin + '-ETH/orderbook'
      axios.get(url)
        .then(function (response) {
          var tickerData = {
            exchange : 'ddex',
            coin : coin,
            ask : response.data.data.orderBook.asks[0].price,
            bid : response.data.data.orderBook.bids[0].price
          }
          resolve(tickerData)
        })
        .catch(function (error) {
          console.log('DDEX ERROR ' + coin)
          reject(error)
        });
    })
  },

  getDdexList : function() {
    var coins = []
    return new Promise(function(resolve, reject){
      axios.get('https://api.ddex.io/v2/markets/tickers')
        .then(function (response) {
          var ddexRawCoins = response.data.data.tickers
          for(var x = 0; x < ddexRawCoins.length; x++){
            var coin = ddexRawCoins[x].pair.substring(0, ddexRawCoins[x].pair.length - 4)
            coins.push(coin)
          }
          resolve(coins)
        })
        .catch(function (error) {
          console.log(error);
        });
    })
  },
  test : function() {
    console.log('testing export/import')
  }
}

export default DDEX;
