module.exports =
  function() {
    $(document).ready(function() {
      // event binders
      function bindMouseEnterEvent() {
        $('body').off('mouseenter').on('mouseenter', '*', function(ev) {
          $('body').find('*').removeClass('__activate');
          $(this).addClass('__activate');
          window.parent.messenger.hover(dataCompiler(ev.currentTarget)); // sets to the window messenger object
          
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
        var selectorPath = getSelectorPath(element);

        return {
          selector: selectorPath.selector,
          elements: content.concat(attributes)
        }
      }

      function getAttributes(element) {
        // this compiles and gets all the attributes on given element
        var attributes;
        var output = [];
        $.each(element.attributes, function( index, attr ) {
          if (attr.value) {
            attributes = {};
            attributes[attr.name] = attr.value;
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
              var target = 'target' + (i+1);
              var obj = {};
              obj[target] = children[i].textContent;
              output.push(obj);
            }
          }
          innerHTML += element.textContent; 
        } else {
          // no children
          innerHTML += element.textContent;
        }
        content['content'] = innerHTML;
        output.push(content);
        // content['additionalTargets'] = additionalTargets;
        return output;
      }

      function getSelectorPath(element) {
        var selector = $(element).first().parentsUntil("html").andSelf().map(function(){
              return this.tagName;
            }).get().join(">");

        var id = $(element).attr("id");
        if (id) {
          selector += "#"+ id;
        }
        // TODO : selector index here

        var classNames = $(element).attr("class");
        if (classNames) {
          selector += "." + $.trim(classNames).replace(/\s/gi, ".");
        }
        return {selector: selector};
      }

    });
};
