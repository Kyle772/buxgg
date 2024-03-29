$(document).ready(function () {
    function resizeCheck() {
        var itemWidth = $("#main > .content").width();
        console.log(itemWidth);
        if (itemWidth < 685) {
            console.log("Smaller");
            $("#main .scroll-wrapper > .content").addClass("col").removeClass("row");
            $(".section.roulette").addClass("col").removeClass("row");
            $("#main > .content").addClass("col").removeClass("row");
            console.log("Done");
        }
        if (itemWidth >= 685) {
            console.log("Bigger");
            $("#main > .content > .scroll-wrapper > .content").addClass("row").removeClass("col");
            $(".section.roulette").addClass("row").removeClass("col");
            $("#main > .content > .content").addClass("row").removeClass("col");
            console.log("Done");
        }
    }
    
    //Take from w3Schools https://www.w3schools.com/js/js_cookies.asp
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        console.log("cookie not set");
        return "";
    }
    
    function checkExistCookie(cname) {
        var cookie = getCookie(cname);
        if (cookie == "" ) {
            console.log("Cookie is not assigned on check");
            return false;
        } else {
            console.log("Cookie is assigned on check");
            console.log("- Cookie value is currently " + getCookie(cname));
            return true;
        }
    }
    
    function deleteCookie(cname) {
        console.log("deleting cookie");
        document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    
    function collapseRight() {
        if (checkExistCookie("Sidebarr")) {
            deleteCookie("Sidebarr");
        };
        $(".sidebar-r").addClass("hide");
        $("#main").removeClass("expand-r");
        $(".earners").addClass("expand");
        setCookie("Sidebarr", "false", "1");
        console.log("Sidebar cookie assigned false");
    }
    
    function expandRight() {
        if (checkExistCookie("Sidebarr")) {
            deleteCookie("Sidebarr");
        };
        $(".sidebar-r").removeClass("hide");
        $("#main").addClass("expand-r");
        $(".earners").removeClass("expand");
        setCookie("Sidebarr", "true", "1");
        console.log("Sidebar cookie assigned true")
    }
    
    $(".chat-settings > .arrow").on("click", function () {
        //collapsing
        console.log("arrow clicked");
        collapseRight();
    });
    $("body > .arrow").on("click", function () {
        //expanding
        console.log("arrow clicked");
        expandRight();
    });
    
    if (getCookie("Sidebarr") == "false") {
        collapseRight();
    } else {
        expandRight();
    }
    
    // roulette generator
    var rot = 9.72972972972973;
    $(".roulette .wheel .color").each( function () {
        console.log(rot, $(this).index());
        $(this).css("transform", "rotate(" + rot * $(this).index() + "deg)");
        $(this).css("z-index", $(".roulette .wheel .color").length - $(this).index());
    });
    
    resizeCheck();
    $('.scrollbar-outer').scrollbar();
    new ResizeSensor($("#main > .content"), function () {
        resizeCheck();
        $('.scrollbar-outer').scrollbar();
    });
});

/* Simple scrollbar */

(function (w, d) {
  var raf = w.requestAnimationFrame || w.setImmediate || function (c) { return setTimeout(c, 0); };

  function initEl(el) {
    if (el.hasOwnProperty('data-simple-scrollbar')) return;
    Object.defineProperty(el, 'data-simple-scrollbar', new SimpleScrollbar(el));
  }

  // Mouse drag handler
  function dragDealer(el, context) {
    var lastPageY;

    el.addEventListener('mousedown', function(e) {
      lastPageY = e.pageY;
      el.classList.add('ss-grabbed');
      d.body.classList.add('ss-grabbed');

      d.addEventListener('mousemove', drag);
      d.addEventListener('mouseup', stop);

      return false;
    });

    function drag(e) {
      var delta = e.pageY - lastPageY;
      lastPageY = e.pageY;

      raf(function() {
        context.el.scrollTop += delta / context.scrollRatio;
      });
    }

    function stop() {
      el.classList.remove('ss-grabbed');
      d.body.classList.remove('ss-grabbed');
      d.removeEventListener('mousemove', drag);
      d.removeEventListener('mouseup', stop);
    }
  }

  // Constructor
  function ss(el) {
    this.target = el;
    
    this.bar = '<div class="ss-scroll">';

    this.wrapper = d.createElement('div');
    this.wrapper.setAttribute('class', 'ss-wrapper');

    this.el = d.createElement('div');
    this.el.setAttribute('class', 'ss-content');

    this.wrapper.appendChild(this.el);

    while (this.target.firstChild) {
      this.el.appendChild(this.target.firstChild);
    }
    this.target.appendChild(this.wrapper);

    this.target.insertAdjacentHTML('beforeend', this.bar);
    this.bar = this.target.lastChild;

    dragDealer(this.bar, this);
    this.moveBar();

    this.el.addEventListener('scroll', this.moveBar.bind(this));
    this.el.addEventListener('mouseenter', this.moveBar.bind(this));

    this.target.classList.add('ss-container'); 
      
    var css = window.getComputedStyle(el);
  	if (css['height'] === '0px' && css['max-height'] !== '0px') {
    	el.style.height = css['max-height'];
    }
  }

  ss.prototype = {
    moveBar: function(e) {
      var totalHeight = this.el.scrollHeight,
          ownHeight = this.el.clientHeight,
          _this = this;

      this.scrollRatio = ownHeight / totalHeight;

      raf(function() {
        // Hide scrollbar if no scrolling is possible
        if(_this.scrollRatio >= 1) {
          _this.bar.classList.add('ss-hidden')
        } else {
          _this.bar.classList.remove('ss-hidden')
          _this.bar.style.cssText = 'height:' + (_this.scrollRatio) * 100 + '%; top:' + (_this.el.scrollTop / totalHeight ) * 100 + '%;right:-' + (_this.target.clientWidth - _this.bar.clientWidth) + 'px;';
        }
      });
    }
  }

  function initAll() {
    var nodes = d.querySelectorAll('*[ss-container]');

    for (var i = 0; i < nodes.length; i++) {
      initEl(nodes[i]);
    }
  }

  d.addEventListener('DOMContentLoaded', initAll);
  ss.initEl = initEl;
  ss.initAll = initAll;

  w.SimpleScrollbar = ss;
})(window, document);