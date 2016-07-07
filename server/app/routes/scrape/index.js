
var router = require('express').Router();
var scraper = require('website-scraper');
var app = require('../../index.js');
var path = require('path');
var url = require('url');
var http = require('http');
var request = require('request');
var cheerio = require('cheerio');
var parseDOM = require('../../utils/extractor/domParser');


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
    }, next);
});

function convertToUrl(url, obj) {
  var str = '';
  for (var key in obj) {
      if (str === '') {
          str += "&";
      }
      str += key + "=" + obj[key];
  }
  return str;
}

// proxy mode
router.get('/proxy', function(req, res, next) {
  let proxyurl;
  if (!req.query.proxyurl) {
    proxyurl = req.session.proxyurl;
    console.log('proxyurl', proxyurl);
  } else {
    proxyurl = url.parse(req.query.proxyurl);
  }


  req.session.proxyurl = proxyurl;
  console.log('GET proxy url: ', req.query.proxyurl);
  var keys = Object.keys(req.query);
  var newurl = keys.reduce(function(url, key) {
    if (key === "proxyurl") {
      return url += req.query[key];
    } else {
      var obj = {};
      obj[key] = req.query[key];
      return url += convertToUrl(url, obj);
    }
  }, '');

  request(newurl, function(error, response, html) {
    if (error) { next(error); }
    html = parseDOM(html);
    // prepends the the sources to have the base url
    html = html.replace(/src="\/([a-zA-z0-9])/g, 'src="' + proxyurl.protocol + "//" + proxyurl.hostname + '/$1');
    html = html.replace(/href="\/([a-zA-z0-9])/g, 'href="' + proxyurl.protocol + "//" + proxyurl.hostname + '/$1');
    html = html.replace(/src="\/?([A-Ga-gI-Zi-z])/g, 'src="' + proxyurl.protocol + "//" + proxyurl.hostname + '/$1');
    html = html.replace(/href="\/?([A-Ga-gI-Zi-z])/g, 'href="' + proxyurl.protocol + "//" + proxyurl.hostname + '/$1');

    html = html.replace(/src="\/\/"/g, 'src="' + proxyurl.protocol + '//');
    html = html.replace(/href="\/\/"/g, 'href="' + proxyurl.protocol + '//');
    // html = html.replace(/<script/g, '<noscript');
    // html = html.replace(/<\/script>/g, '</noscript>');

    // cheerio to modify all a tags with the proxy
    let $ = cheerio.load(html);
    let x = $('a');
    for (let i = 0; i < x.length; i++) {
      let href = x[i].attribs.href;
      x[i].attribs.href =  '/api/scrape/proxy?proxyurl=' + href;
    }
    // let $forms = $('form');
    // $forms.attr('action', function(z, action) {
    //   return '/api/scrape/proxy?proxyurl=' + action;
    // });
    $('body').attr('current_url',newurl);
    $('body').attr('proxy_protocol', proxyurl.protocol);
    $('body').attr('proxy_hostname', proxyurl.hostname);
    res.send($.html());
  });
});

router.post('/proxy', function(req, res, next) {
  if (req.query.proxyurl) {
    var proxyurl = url.parse(req.query.proxyurl);
  } else {
    var proxyurl = url.parse(req.body.proxyurl);
  }
  let _url = req.body.proxyurl || req.query.proxyurl;
  req.session.proxyurl = proxyurl;
  if (req.body.appAction) {
    request.post({url: req.query.proxyurl, method: 'POST'}, function(error, response, html) {
      res.send(html);
    });
  } else {
    console.log('POST reqquery proxyurl', _url);

    request(_url, function(error, response, html) {    if (error) { next(error); }
      html = parseDOM(html);
      html = html.replace(/src="\/([a-zA-z0-9])/g, 'src="' + proxyurl.protocol + "//" + proxyurl.hostname + '/$1');
      html = html.replace(/href="\/([a-zA-z0-9])/g, 'href="' + proxyurl.protocol + "//" + proxyurl.hostname + '/$1');
      html = html.replace(/src="\/?([A-Ga-gI-Zi-z])/g, 'src="' + proxyurl.protocol + "//" + proxyurl.hostname + '/$1');
      html = html.replace(/href="\/?([A-Ga-gI-Zi-z])/g, 'href="' + proxyurl.protocol + "//" + proxyurl.hostname + '/$1');

      html = html.replace(/src="\/\/"/g, 'src="' + proxyurl.protocol + '//');
      html = html.replace(/href="\/\/"/g, 'href="' + proxyurl.protocol + '//');

      // html = html.replace(/<script/g, '<noscript');
      // html = html.replace(/<\/script>/g, '</noscript>');

      let $ = cheerio.load(html);
      let $a = $('a');
      $a.attr('href',function(i, href) {
        let newUrl = '/api/scrape/proxy?proxyurl='+href;
        return newUrl
      });
      // let $forms = $('form');
      // $forms.attr('action', function(z, action) {
      //   return '/api/scrape/proxy?proxyurl=' + action;
      // });
      $('body').attr('current_url',req.body.proxyurl);
      $('body').attr('proxy_protocol', proxyurl.protocol);
      $('body').attr('proxy_hostname', proxyurl.hostname);
      res.send($.html());

    });
  }


});

module.exports = router;
