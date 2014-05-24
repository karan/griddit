var gridster;

$(function() {

  // the name of the last added post
  var last_added = '';

  // array of objects with link to image, post title, link to reddit
  var posts = [];

  // to control the flow of loading during scroll
  var scrollLoad = true;

  var requestData = function() {
    posts = [];
    $.get("http://api.reddit.com/r/pics/top.json?t=week&after="+last_added, function(data) {
      var arr = data.data.children;
      arr.forEach(function(post) {
        if (!post.data.is_self && (/\.(gif|jpg|jpeg|tiff|png)$/i).test(post.data.url)) {
          posts.push({
            'title': post.data.title,
            'img_src': post.data.url,
            'name': post.data.name,
            'permalink': 'http://reddit.com/' + post.data.permalink
          });
        }
        last_added = post.data.name;
      });
      scrollLoad = true;
      buildGrid();
    });
  }

  var buildGrid = function() {
    var deferred = $.Deferred();

    var w = $(window).innerWidth() / 3, 
        html = '';

    for (var i = 0; i < posts.length; i++) {
      console.log("looping");
      var post = posts[i];

      var outerDiv = $("<div>", {class: "brick"});
      outerDiv.width(w);

      var img = $("<img />");
      img.attr("src", post.img_src);

      img.on('load', function() {
        deferred.resolve();
        
        console.log("img loaded");
        var ratio = this.width / w;
        h = this.height / ratio;

        $(this).css({'height': h});

        var innerDiv = "<div class='info'><h3><a href='" + post.permalink + "' target='_blank'>" + post.title + "</a></h3></div>";
        outerDiv.append(this.outerHTML).append(innerDiv);

        html += outerDiv[0].outerHTML;
      });
    }

  }

  var renderImages = function(html) {
    console.log("rendering images");
    $("#grid").append(html);
    
    var wall = new freewall("#grid");
    wall.reset({
      selector: '.brick',
      animate: true,
      cellW: 160,
      cellH: 160,
      onResize: function() {
        wall.fitWidth();
      }
    });
    wall.fitWidth();

    // for scroll bar appear;
    $(window).trigger("resize");
  }

  // infinite scroll
  $(window).scroll(function () { 
    if (scrollLoad && $(window).scrollTop() >= $(document).height() - $(window).height() - 50) {
      scrollLoad = false;
      requestData();
    }
  });

  requestData();

});
