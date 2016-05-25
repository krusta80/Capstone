'use strict';
var router = require('express').Router();
var scraper = require('website-scraper');
var app = require('../../index.js');
var path = require('path');
var url = require('url');
var http = require('http');
var request = require('request');
var parseDOM = require('../../utils/domParser');



// webscraper mode
function getSiteDirname (siteUrl) {
    var urlObj = url.parse(siteUrl);
    var domain = urlObj.host;
    return domain + '-' + new Date().getTime();
}

var directory, staticDirectory;
router.post('/download', function (req, res, next) {

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

// proxy mode
router.get('/proxy', function(req, res, next) {
  var proxyurl = url.parse(req.query.proxyurl);
  console.log('proxy url ', proxyurl, 'reqquery proxyurl', req.query.proxyurl);

  request(req.query.proxyurl, function(error, response, html) {
    if (error) {
      next(error);
      return;
    }
    html = html.replace(/src="\/([a-zA-z0-9])/g, 'src="' + proxyurl.protocol + "//" + proxyurl.hostname + '/$1');
    html = html.replace(/href="\/([a-zA-z0-9])/g, 'href="' + proxyurl.protocol + "//" + proxyurl.hostname + '/$1');

    res.send(html);

  });
});

router.post('/proxy', function(req, res, next) {
  var proxyurl = url.parse(req.body.proxyurl);
  console.log('proxy url ', proxyurl, 'reqquery proxyurl', req.query.proxyurl);

  request(req.body.proxyurl, function(error, response, html) {
    if (error) {
      next(error);
      return;
    }
    html = parseDOM(html);
    html = html.replace(/src="\/([a-zA-z0-9])/g, 'src="' + proxyurl.protocol + "//" + proxyurl.hostname + '/$1');
    html = html.replace(/href="\/([a-zA-z0-9])/g, 'href="' + proxyurl.protocol + "//" + proxyurl.hostname + '/$1');
    html = html.replace(/src="\/\/"/g, 'src="' + proxyurl.protocol + '//');
    html = html.replace(/href="\/\/"/g, 'href="' + proxyurl.protocol + '//');
    res.send(html);

  });
});

module.exports = router;
