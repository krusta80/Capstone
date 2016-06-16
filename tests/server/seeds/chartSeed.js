var mongoose = require('mongoose');

var page1Id = mongoose.Types.ObjectId(),
  page2Id = mongoose.Types.ObjectId();

function makeHistElement(pageId, count){
  var runDate = new Date(2016,6,1);
  var rtn = [];
  while (count--){
    runDate.setDate(runDate.getDate() + 1);
    rtn.push({
      page: page1Id,
      fields: JSON.stringify({
        price:{
          index: 0,
          value: 'Our price $' + Math.round((Math.random() + 1) * 10)
       },
       reviews: {
         index: 1,
         value: Math.round((Math.random() * 4)).toString()
       }
      }),
      jobRunTS: runDate
    });
  }
  return rtn;
}

module.exports = makeHistElement;
