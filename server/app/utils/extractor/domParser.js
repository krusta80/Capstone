var cheerio = require('cheerio'),
  script = require('./domScript');

var STYLE =
`<style type="text/css">
  .__activate {
    border: 1px solid red !important;
  }
</style>`;


// var SELECTOR =
// `<div class="elem-highlight"></div>`;

function inject(html){
  var $ = cheerio.load(html);
  //Grab text and image elements
  // var elements = $('span,a, p, h3, img');
  // elements.each(function(elem){
  //   if ($(this).text() || $(this).attr('src') || $(this).attr('href') )
  //     $(this).wrap(SELECTOR);
  // });
  //inject css
  $('head').append(STYLE);
  $('body').append('<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>');
  var SCRIPT = $('<script>$(' + script.toString() + ')</script>');
  $('body').append(SCRIPT);

  return $.html();
}
module.exports = inject;
