module.exports = function(pageId, userId) {
  return {
    title: 'my test project',
    user: userId,
    jobs: [{
      title: 'Product watcher',
      description: 'watches the fluctuations of price for a certain product over a period of time',
      pages: [pageId]
    }]
  };
};
