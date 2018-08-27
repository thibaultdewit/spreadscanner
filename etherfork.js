import axios from 'axios'

var EtherFork = {
  getEtherForkData : function(coin) {
    return new Promise(function(resolve, reject){
      var url = 'https://api.forkdelta.com/returnTicker'
      axios.get(url)
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          console.log('EtherFork ERROR ' + coin)
          reject(error)
        });
    })
  },
}

export default EtherFork;
