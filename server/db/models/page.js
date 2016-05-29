var mongoose = require('mongoose');

var rowCellSchema = mongoose.Schema({
  type: String,
  data: String
});

var fieldSchema = mongoose.Schema({
  name: String,
  type: String,
  convert: Boolean
});

var pageRowSchema = mongoose.Schema({
  data: [rowCellSchema],
  selector: String,
  index: Number
});

var gridSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  rows: [pageRowSchema]
});

var pageSchema = mongoose.Schema({
  fields: [fieldSchema],
  grid: [pageRowSchema], //most recent grid
  gridHist: gridSchema,
  created: {
    type: Date,
    default: Date.now
  },
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  url: String
});

pageSchema.statics.createOrUpdate = function(newPage){
  return this.findById(newPage)
  .then(function(page){
    if (page){
      page.grid = newPage.grid;
      return page.save();
    }else{
      return mongoose.model('Page').create(newPage);
    }
  });
};
mongoose.model('Grid', gridSchema);
mongoose.model('Page', pageSchema);
