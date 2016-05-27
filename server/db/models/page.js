var mongoose = require('mongoose');

var rowCellSchema = mongoose.Schema({
  type: String,
  data: String
});

var fieldSchema = mongoose.Schema({
  name: String,
  type: String
});

var pageRowSchema = mongoose.Schema({
  rowData: [rowCellSchema],
  selector: String,
  index: Number
});
var pageSchema = mongoose.Schema({
  fields: [String],
  data: [pageRowSchema],
  created: {
    type: Date,
    default: Date.now
  },
  user: {type: mongoose.Schema.Types.ObjectID, ref: 'User'}
});

pageSchema.statics.newPage = function(grid){
  
};
mongoose.model('Page', pageSchema);
