$(document).ready(function(){

  var name;
  var chosenRoom;

  var App = function(){
    this.server = 'https://api.parse.com/1/classes/chatterbox';
  };

  App.prototype.init = function(){

  };
  App.prototype.send = function(message){
    var msgObject = {
      text: message,
      username: name || 'anonymous',
      roomname: chosenRoom || 'lobby'
    };
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  };

  App.prototype.fetch = function(){

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      // jsonp: 'callback',
      contentType: 'application/json',
      data: 'order=-createdAt',
      success: function (data) {
            console.log(data.results[0]);
        // data.results; <-array(
        this.clearMessages();
        for(var i=0;i<data.results.length;i++){
          this.addMessage(data.results[i]);
        }
      }.bind(this),
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch messages');
      }
    });
  };

  App.prototype.clearMessages = function(){
    $('#chats').empty();
  };

  App.prototype.addMessage = function(message){
    // $('#chats').append();
    var element = $('<p></p>');
    var username = $('<b></b>');
    var msg = $('<span></span>');
    username.text(message.username);
    msg.text(message.text);
    element.append(username);
    element.append(msg);
    // element.text(data.results[i].text);
    $('#chats').append(element);
  };

  App.prototype.addRoom = function(roomName){
    var option = $('<option value ="' + roomName + '">' +roomName + '</option>');
    $('#roomSelect').append(option);
  };



  var changeName = function(){
    name = $('.name').val();
    window.location.search = '?username='+name;
  };

  window.app = new App();
  app.send('SUP GAR');
  console.log(app);
  console.log(window.location.search);

  setInterval(app.fetch.bind(app), 1000);

  $('.set-name-btn').on('click', changeName);


});  