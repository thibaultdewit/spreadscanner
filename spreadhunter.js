import _ from 'lodash'
const fs = require('fs');

var SpreadHunter = {
  findSpread : function(data, filename) {
    var file = {}
    _.forEach(data, function(value, key) {
      if(value.length > 1){
        file[key] = value
      }
    });
    var worth = {}
    _.forEach(file, function(value, key) {
      if(value[0].bid > value[1].ask || value[1].bid > value[0].ask){
        worth[key] = value
      }
    });
    fs.writeFile('data.json', JSON.stringify(file), (err) => {
      if (err) throw err;
    });
    fs.writeFile(filename, JSON.stringify(worth), (err) => {
      if (err) throw err;
      console.log('The files have been saved!');
    });
  },
}

export default SpreadHunter
