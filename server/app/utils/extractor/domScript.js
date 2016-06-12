module.exports =
  function() {
    $(document).ready(function() {
      // event binders
      function bindMouseEnterEvent() {
        $('body').off('mouseenter').on('mouseenter', '*', function(ev) {
          $('body').find('*').removeClass('__activate');
          $(this).addClass('__activate');
          //window.parent.messenger.hover(dataCompiler(ev.currentTarget)); // sets to the window messenger object
        });
      }

      bindMouseEnterEvent();
      $('body').on('mouseleave', '*', function(ev) {
        bindMouseEnterEvent();
        $(this).removeClass('__activate');
      });

      $('body').on('click','*', function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        $(this).addClass('__clickActivate');
        var coordinates = {x: ev.clientX, y: ev.clientY};
        window.parent.messenger.click(dataCompiler(ev.currentTarget),coordinates); // sets to the window messenger object
      });

      // data stuff
      // need to map out any given event handler to its current target
      // extract the contents into a json format...
      // all attributes will be come a key value pair
      // all inner elements will become content
      // send it on hover

      function dataCompiler(element) {
        var output;
        var attributes = getAttributes(element);
        var content = getContent(element);
        var aggregate = attributes.concat(content);
        aggregate = dataIndexer(aggregate);
        var selectorPath = getSelectorPath(element);

        return {
          selector: selectorPath.selector,
          selectorIndex: selectorPath.selectorIndex,
          elements: aggregate,
          repeats: selectorPath.repeating
        };
      }

      function dataIndexer(array) {
        for (var i = 0; i < array.length; i++) {
          if (array[i].attr === "content") {
            break;
          }
          array[i]['index'] = i;
          array[i]['name'] = 'field' + i;
        }
        return array;
      }

      function getAttributes(element) {
        // this compiles and gets all the attributes on given element
        var attributes;
        var output = [];
        $.each(element.attributes, function( index, attr ) {
          if (attr.value) {
            attributes = {};
            attributes['attr'] = attr.name;
            attributes['value'] = attr.value;
            attributes['attributeName'] = attr.name;
            output.push(attributes);
          }
        });
        return output;
      }

      function getContent(element) {
        // gets the content from the element
        var content = {};
        var output = [];
        var children = $(element).find('*');
        var innerHTML = "";
        if (children.length >= 5) {
          content['content'] = "Too many elements - narrow your search";
          output.push(content);
          return output;
        }
        if (children.length > 0) {
          for (var i = 0; i < children.length; i++) {
            // allow user to choose from each one
            if (children[i].innerHTML) {
              var obj = {};
              obj['value'] = children[i].textContent;
              obj['attr'] = 'text';
              output.push(obj);
            }
          }
          innerHTML += element.textContent;
        } else {
          // no children
          innerHTML += element.textContent;
        }
        content = {
          value: innerHTML,
          index: -1,
          attr: 'content'
        };
        output.push(content);
        // content['additionalTargets'] = additionalTargets;
        return output;
      }

      function getSelectorPath(element) {
        var selector = $(element).first().parentsUntil("html").andSelf().map(function(){
              return this.tagName;
            }).get().join(">");
        //finding repeating
        var repeating = $(selector);
        var repeats = $.map(repeating, function(elem, i){
            return {
              selector: selector,
              selectorIndex: i
            };
        });
        //console.log('repeating', repeating);
        return {selector: selector, selectorIndex: $(repeating).index(element), repeating: repeats};
      }

    });
};
