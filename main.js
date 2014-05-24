var gridster;

$(function() {

  // the name of the last added post
  var last_added = '';
  
  // to control the flow of loading during scroll
  var scrollLoad = true;


  function getOneHtml(post, w) {
    console.log("getting one html");

    var outerDiv = $("<div>", {class: "brick"});
    outerDiv.width(w);

    var img = $("<img />");
    img.attr("src", post.img_src);

    img.on('load', function() {
      console.log("img loaded");
      var ratio = this.width / w;
      h = this.height / ratio;

      $(this).css({'height': h});

      var innerDiv = "<div class='info'><h3><a href='" + post.permalink + "' target='_blank'>" + post.title + "</a></h3></div>";
      outerDiv.append(this.outerHTML).append(innerDiv);

      // return outerDiv[0].outerHTML;
      $("#grid").append(outerDiv[0].outerHTML);
    });
  }


  function requestData(subreddit, callback) {
    // array of objects with link to image, post title, link to reddit
    posts = [];

    var w = $(window).innerWidth() / 3, 
        html = '';

    $.get("http://api.reddit.com/r/" + subreddit + "/top.json?t=week&after="+last_added, function(data) {
      var arr = data.data.children;

      arr.forEach(function(res_post) {
        if (!res_post.data.is_self && (/\.(gif|jpg|jpeg|tiff|png)$/i).test(res_post.data.url)) {

          console.log("looping in requestData");
          
          var post = {
            'title': res_post.data.title,
            'img_src': res_post.data.url,
            'name': res_post.data.name,
            'permalink': 'http://reddit.com/' + res_post.data.permalink
          };

          getOneHtml(post, w);
          
        }
        last_added = res_post.data.name;
      });

      scrollLoad = true;
      console.log("calling callback");
      callback();
    });
  }


  // var buildGrid = function(posts) {
  //   var w = $(window).innerWidth() / 3, 
  //       html = '';

  //   for (var i = 0; i < posts.length; i++) {
  //     console.log(i);
  //     console.log("looping");
  //     var post = posts[i];

  //     var outerDiv = $("<div>", {class: "brick"});
  //     outerDiv.width(w);

  //     var img = $("<img />");
  //     img.attr("src", post.img_src);

  //     img.on('load', function() {
  //       console.log("img loaded");
  //       var ratio = this.width / w;
  //       h = this.height / ratio;

  //       $(this).css({'height': h});

  //       var innerDiv = "<div class='info'><h3><a href='" + post.permalink + "' target='_blank'>" + post.title + "</a></h3></div>";
  //       outerDiv.append(this.outerHTML).append(innerDiv);

  //       console.log(outerDiv);
  //       html += outerDiv[0].outerHTML;
  //     });
  //   }
  // }

  function makeWall() {
    console.log("making wall");
    // $("#grid").append(html);
    
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
      requestData('pics', makeWall);
    }
  });

  requestData('pics', makeWall);

});
