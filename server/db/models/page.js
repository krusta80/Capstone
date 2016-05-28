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
  data: [rowCellSchema],
  selector: String,
  index: Number
});
var pageSchema = mongoose.Schema({
  fields: [fieldSchema],
  grid: [pageRowSchema],
  created: {
    type: Date,
    default: Date.now
  },
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  url: String
});

mongoose.model('Page', pageSchema);
