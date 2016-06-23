app.directive('initRipples', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var withRipples = [
        '.btn:not(.withoutripple)',
        '.card-image',
        '.navbar a:not(.withoutripple)',
        'a',
        '.nav-tabs a:not(.withoutripple)',
        '.withripple',
        '.menulinks li'
      ].join(',');

      setTimeout(function() {
        console.log("ripple effect", $(element).find(withRipples));
        $(element).find(withRipples).ripples();
      },50)

    }
  };
});
