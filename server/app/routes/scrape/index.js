'use strict';
var router = require('express').Router();
var scraper = require('website-scraper');
var app = require('../../index.js');
var path = require('path');
var url = require('url');

function getSiteDirname (siteUrl) {
    var urlObj = url.parse(siteUrl);
    var domain = urlObj.host;
    return domain + '-' + new Date().getTime();
}

var directory, staticDirectory;
router.post('/site', function (req, res, next) {

    var url = req.body.url;
    console.log('scraping site', url, 'what is app?', app);
    var root = app.getValue('projectRoot');
    staticDirectory = path.join('/public/tmp/', getSiteDirname(url));
    directory = path.join(root, staticDirectory);
    console.log('heres the root', root, 'and directory', directory);
    scraper.scrape({
        urls: [url],
        directory: directory,
        subdirectories: [
          {directory: 'img', extensions: ['.jpg', '.png', '.svg']},
          {directory: 'js', extensions: ['.js']},
          {directory: 'css', extensions: ['.css']}
        ],
        sources: [
          {selector: 'img', attr: 'src'},
          {selector: 'link[rel="stylesheet"]', attr: 'href'},
          {selector: 'script', attr: 'src'}
        ],
        request: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 4 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19'
          }
        }
    }).then(function(result) {
        console.log('scrape was a success to directory: ', staticDirectory);
        res.json({publicDirectory: staticDirectory});
    }, next)
});

module.exports = router;