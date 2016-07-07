'use strict';
var path = require('path');
var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var parseDOM = require('./utils/extractor/domParser');
var _ = require('lodash');
var url = require('url');
var iconv = require('iconv-lite');

module.exports = app;


// Pass our express application pipeline into the configuration
// function located at server/app/configure/index.js
require('./configure')(app);

// Routes that will be accessed via AJAX should be prepended with
// /api so they are isolated from our GET /* wildcard.
app.use('/api', require('./routes'));

// Custom routes will be accessed via AJAX and should be prepended with
// /projectApi so they are isolated from our GET /* wildcard.
app.use('/projectApi', require('../projects'));

/*
 This middleware will catch any URLs resembling a file extension
 for example: .js, .html, .css
 This allows for proper 404s instead of the wildcard '/*' catching
 URLs that bypass express.static because the given file does not exist.
 */

app.use(function (req, res, next) {

    if (path.extname(req.path).length > 0) {
        res.status(404).end();
    } else {
        next(null);
    }

});

app.get('/*', function (req, res, next) {
    let frontEndRoutes = ['control', 'api','charts','login', 'session', 'projects', 'iframe'];
    let url = _.compact(req.url.split('/'));
    console.log("url: ", url);
    if (_.includes(frontEndRoutes, url[0]) || url.length === 0) {
        res.sendFile(app.get('indexHTMLPath'));
    } else {
        next();
    }

});

app.use(function(req,res,next){
    console.log('interceptor')

    let newHeaders = req.headers;
    newHeaders.host = req.session.proxyurl.host;
    newHeaders.referer = req.session.proxyurl.href;
    let newUrl = req.session.proxyurl.protocol + '//' + req.session.proxyurl.hostname + req.originalUrl;
    console.log('new url: ', newUrl);
    let options = {
        method: req.method,
        uri: newUrl
    }
    request(options, function(error, response, html) {
        console.log('it made it through the request')
        if (error) { next(error) }
        if (html) {
            req.session.proxyurl = url.parse(newUrl);
            html = parseDOM(html);
            html = html.replace(/src="\/([a-zA-z0-9])/g, 'src="' + req.session.proxyurl.protocol + "//" + req.session.proxyurl.hostname + '/$1');
            html = html.replace(/href="\/([a-zA-z0-9])/g, 'href="' + req.session.proxyurl.protocol + "//" + req.session.proxyurl.hostname + '/$1');
            html = html.replace(/src="\/?([A-Ga-gI-Zi-z])/g, 'src="' + req.session.proxyurl.protocol + "//" + req.session.proxyurl.hostname + '/$1');
            html = html.replace(/href="\/?([A-Ga-gI-Zi-z])/g, 'href="' + req.session.proxyurl.protocol + "//" + req.session.proxyurl.hostname + '/$1');

            html = html.replace(/src="\/\/"/g, 'src="' + req.session.proxyurl.protocol + '//');
            html = html.replace(/href="\/\/"/g, 'href="' + req.session.proxyurl.protocol + '//');

            let $ = cheerio.load(html);
            let $a = $('a');
            $a.attr('href',function(i, href) {
              let newUrl = '/api/scrape/proxy?proxyurl='+href;
              return newUrl
            });

            $('body').attr('current_url',newUrl);
            $('body').attr('proxy_protocol', req.session.proxyurl.protocol);
            $('body').attr('proxy_hostname', req.session.proxyurl.hostname);
            res.send($.html());
        }
    });

});




// Error catching endware.
app.use(function (err, req, res, next) {
    console.error(err)
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});
