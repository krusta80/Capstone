// Require our models -- these should register the model into mongoose
// so the rest of the application can simply call mongoose.model('User')
// anywhere the User model needs to be used.
require('./user');
require('./app');
require('./schema');
require('./field');
require('./scraperElement');
require('./page');
require('./job');
require('./scraperElementHist');
require('./project');
