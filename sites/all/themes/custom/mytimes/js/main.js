(function ($){
  "use strict";
  function renderItem(socketData) {
    function printCond(rendered,className,path) {
      var rs = "";//shorted varname for returnString
      if(rendered && rendered.length !== 0) { //strings, objects, and arrays
        switch(className) {
          case "section":
          case "subsection":
            rs += "<h4 class='" + className + "'>";
            rs += rendered + "</h4>";
            break;
          case "author":
            rs += "<h6><div class='updated'>" + rendered + "</div></h6>";
            break;
          case "image":
            rs += "<a class='img-link article-view' target='_blank' href='" + path +"'>";
            rs += "<img class='thumbnail' onerror='this.style.display=";
            rs += "\"none\"' src='" + rendered.normal + "'></a>";
            break;
        }
      } else if (className === "author") {
        //we've got an empty author
        rs += "<h6 class='no-author'></h6>";
      }//no else. Keep the blank string.
      return rs;
    }
    var s = socketData,
        title = s.title,
        nid = s.nid,
        path = s.path,
        section = s.section.rendered,
        subsection = s.subsection.rendered,
        author = s.author,
        image = s.image,
        body = s.body,
        date = s.date,
        r; //return value
        
    r =  "<article data-nid='" + nid + "' data-updated='" + date + "'>";
    r += "<header>" + printCond(section,"section");
    r += printCond(subsection,"subsection") + "</header>";
    r += "<h2><a target='_blank' class='article-view' href='" + path + "' rel='bookmark'>";
    r += title + "</a></h2>" + printCond(author,"author");
    r += printCond(image,"image",path) + "<p>" + body + "</p></article>";

    return r;
  }
  $(document).ready(function () {

    //WELCOME MESSAGE
    (function showWelcome() {
      var welcomeString = "      __       __            ________  __\n     /  \\     /  |          /        |/  |\n     ##  \\   /## | __    __ ########/ ##/  _____  ____    ______    _______\n     ###  \\ /### |/  |  /  |   ## |   /  |/     \\/    \\  /      \\  /       |\n     ####  /#### |## |  ## |   ## |   ## |###### ####  |/######  |/#######/\n     ## ## ##/## |## |  ## |   ## |   ## |## | ## | ## |##    ## |##      \\\n     ## |###/ ## |## \\__## |   ## |   ## |## | ## | ## |########/  ######  |\n     ## | #/  ## |##    ## |   ## |   ## |## | ## | ## |##       |/     ##/\n     ##/      ##/  ####### |   ##/    ##/ ##/  ##/  ##/  #######/ #######/\n                  /  \\__## |\n                  ##    ##/\n                   ######/";
      welcomeString += "\n\nMyTimes live updates powered by Node.js and socket.io. Backend article aggregation powered by Drupal.";
      welcomeString += "\nCheck out the repo at github.com/isaacwhite/mytimes.";
      console.log(welcomeString);
    })();//doesn't need to be referenced anywhere else.
    
    //SOCKETS
    try{ //setup sockets, but don't let it break everything else if they are not running.
      var socket = Drupal.Nodejs.socket;
      socket.on("message", function (data) {
        var type = data.data.subject,
            messageData = JSON.parse(data.data.body),
            itemString;
        if(type === "new_post") {
          console.log("New post received via websockets");
          itemString = renderItem(messageData);
          //we assume it is the most recent item.
          $(".view-content article").last().remove();
          $(".view-content").prepend(itemString);
        } else if (type === "post_revision") {
          console.log("received update to existing post!");
          itemString = renderItem(messageData); //we're going to replace the existing item with the updated one.
          var nid = messageData.nid;
          var toUpdate = $(".view-content").find("[data-nid='" + nid + "']");
          $(toUpdate).replaceWith(itemString);
          console.log("replaced item with nid=" + nid);
        }//next we should try to revaluate the sort when items are added to be safe.
        //whenever we get a new message, we must update elements again.
        clearIntervalsAndAttach();
      });
    } catch(e) {
      console.log("failure with socket updates");
      console.log(e);
    }

    //TIMING
    //set up an interval check every minute.
    var intervalPeriod = 1000 * 60;//1 minute in milliseconds.
    var intervals = [];
    function clearIntervalsAndAttach() {
      for(var i; i<intervals.length; i++) {
        clearInterval(intervals[i]); //clear the intervals
      }
      intervals = [];
      attachDateUpdates();
    }
    function attachDateUpdates() {
      $(".view-articles-on-nytimes-com article").each(function() {
        var that = this;
        function update() {
          var unixString, timeString, result, currentTime, unix3Hrs, recent;
          unixString = $(that).data("updated");
          timeString = moment(unixString,"X").fromNow();
          result = $(that).find("h6 .updated");
          currentTime = moment().format("X");
          unix3Hrs = 60 * 3;
          recent = false;
          //3 hours, in unix time.
          if(currentTime - unixString < unix3Hrs) {
            recent = true;
          }
          if(result.length > 0) {
            $(that).find("h6 .updated").contents(timeString);
          } else {
            $(that).find("h6").append("<div class='updated'>" +
              timeString + "</div>");
            result = $(that).find("h6 .updated");
          }
          if(recent && !$(result).hasClass("recent")) {
            $(that).find("h6 .updated").addClass("recent");
          }
          if(!recent && $(result).hasClass("recent")) {
            $(that).find("h6 .updated").removeClass("recent");
          }
        }
        update();
        intervals.push(setInterval(update,intervalPeriod));
      });
    }

    //listener for pager events
    $(document).ajaxComplete(function() {
      clearIntervalsAndAttach(); //call the dates again.
    });

    //call attachDateUpdates on load
    attachDateUpdates();
 
    //CLICK HANDLERS
    //ARTICLE CLICK HANDLER
    $("body").on("click","a.article-view",function(e) {
      e.preventDefault();
      console.log(e);
      var url = e.currentTarget.href;
      var width = $(document).width();
      var left = width * 0.15;
      $(this).css({overflow:"hidden"});
      var iframeString = "<iframe class='article-window' src='" + url +"'></iframe><div class='iframe-background'></div>";
      var closeButton = "<a class='close-iframe' href='#'>x</a>";
      $("body").append(iframeString);
      $("body").append(closeButton);
      $(".article-window").css({left:left + "px"});
        //process opening of window
    });

    //CLOSE BUTTON HANDLER 
    $("body").on("click","a.close-iframe",function(e) {
      e.preventDefault();
      $(e.srcElement).remove();
      $(".article-window,.iframe-background").animate({opacity:0},300,function() {
        $(this).remove();
        $("body").css({overflow:"initial"});
      });
    });
  });
})(jQuery);