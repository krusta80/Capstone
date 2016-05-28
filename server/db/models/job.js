var mongoose = require('mongoose');

var jobSchema = mongoose.Schema({
  pages: [mongoose.model('Page').schema],
  created:{
    type: Date,
    default: Date.now
  },
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

mongoose.model('Job', jobSchema);
