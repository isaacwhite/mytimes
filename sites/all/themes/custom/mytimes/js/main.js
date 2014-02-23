(function ($){
  "use strict";
    function renderItem(socketData) {
      var title, nid, path, section, subsection, author, image, body, s;
      s = socketData;
      title = s.title;
      nid = s.nid;
      path = s.path;
      section = s.section.rendered;
      subsection = s.subsection.rendered;
      body = s.body;
      image = s.image;
    }
    $(document).ready(function() {
      var socket = Drupal.Nodejs.socket;
      socket.on("message", function(data) {
        var type = data.data.subject;
        var messageData = JSON.parse(data.data.body);
        console.log(type);
        console.log(messageData);
      });
    });
})(jQuery);