(function ($){
  "use strict";
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