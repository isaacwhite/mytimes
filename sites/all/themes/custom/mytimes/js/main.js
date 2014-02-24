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
              rs += "<h6>" + rendered + "</h6>";
              break;
            case "image":
              rs += "<a class='img-link' target='_blank' href='" + path +"'>";
              rs += "<img class='thumbnail' onerror='this.style.display=";
              rs += "\"none\"' src='" + rendered.normal + "'></a>";
              break;
          }
        } //no else. Keep the blank string. 

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
      r += "<h2><a target='_blank' href='" + path + "' rel='bookmark'>";
      r += title + "</a></h2>" + printCond(author,"author");
      r += printCond(image,"image",path) + "<p>" + body + "</p></article>";

      return r;
    }
    $(document).ready(function () {
      (function showWelcome() {
        var welcomeString = "      __       __            ________  __\n     /  \\     /  |          /        |/  |\n     ##  \\   /## | __    __ ########/ ##/  _____  ____    ______    _______\n     ###  \\ /### |/  |  /  |   ## |   /  |/     \\/    \\  /      \\  /       |\n     ####  /#### |## |  ## |   ## |   ## |###### ####  |/######  |/#######/\n     ## ## ##/## |## |  ## |   ## |   ## |## | ## | ## |##    ## |##      \\\n     ## |###/ ## |## \\__## |   ## |   ## |## | ## | ## |########/  ######  |\n     ## | #/  ## |##    ## |   ## |   ## |## | ## | ## |##       |/     ##/\n     ##/      ##/  ####### |   ##/    ##/ ##/  ##/  ##/  #######/ #######/\n                  /  \\__## |\n                  ##    ##/\n                   ######/";
        welcomeString += "\n\nMyTimes live updates powered by Node.js and socket.io. Backend article aggregation powered by Drupal.";
        welcomeString += "\nCheck out the repo at github.com/isaacwhite/mytimes.";
        console.log(welcomeString);
      })();
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
      });
    });
})(jQuery);