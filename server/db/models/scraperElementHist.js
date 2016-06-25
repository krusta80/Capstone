'use strict';
var mongoose = require('mongoose');
var Promise = require('bluebird');

var scraperElementSchema = new mongoose.Schema({
    scraperElement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ScraperElement'
    },
    page: {
      type: mongoose.Schema.Types.ObjectId
    },
    fields: {
        type: String
        //         field0: {
        //             index: 0,                       // this is the column #
        //             value: <scraped value>           // scraped value
        //         },
        //         field3: {
        //             index: 3,
        //             value: <scraped value>
        //         }
                //  this is a JSON representation of a map of columns / fields
    },
    jobRunTS: Number,
    createdDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date,
        default: Date.now
    },
    _dup: {
      type: Boolean,
      default: false
    }
});
scraperElementSchema.static.stamp = function(){
  var ts = Date.now();
  return this.find({jobRunTS: {$exists: false}})
  .then(function(elems){
    return Promise.map(elems, function(elem){
      elem.jobRunTS = ts;
      return elem.save();
    });
  });
};

scraperElementSchema.statics.clean = function(){
  return mongoose.model('ScraperElementHist').find({_dup:true})
  .then(function(elems){
    if (elems.length){
      return Promise.map(elems, function(elem){
        return elem.remove();
      });
    }
    return Promise.resolve();
  });
};

// scraperElementSchema.pre('save', function(next){
//   var instance = this;
//   mongoose.model('ScraperElementHist').find({scraperElement : instance.scraperElement}).sort('-createdDate')
//   .then(function(elems){
//     if (elems.length && elems[0].fields === instance.fields)
//       instance._dup = true;
//     next();
//   });
// });

module.exports = mongoose.model('ScraperElementHist', scraperElementSchema);
