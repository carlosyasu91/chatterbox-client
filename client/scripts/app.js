$(document).ready(function(){

  var chosenRoom;

  var App = function(){
    this.server = 'https://api.parse.com/1/classes/chatterbox';
    this.friends = [];
  };

  App.prototype.init = function(){
    this.handleSubmit();
  };
  App.prototype.send = function(message){
    var msgObject = {
      username: message.username,
      text: message.text,
      roomname: message.roomname
    };
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(msgObject),
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
            // console.log(data.results[0]);
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

  App.prototype.addFriend = function(friend){
    if(this.friends.indexOf(friend) === -1)
      this.friends.push(friend);
  };

  App.prototype.addMessage = function(message){
    // $('#chats').append();
    var element = $('<p></p>');
    var username = $('<a class="username" href="#"></a>');

    var msg = $('<span ></span>');
    if(this.friends.indexOf(message.username)>-1){
      msg.addClass('makeBold');
    }
    username.text(message.username);
    msg.text(message.text);
    element.append(username);
    element.append(msg);
    // element.text(data.results[i].text);
    $('#chats').append(element);
    element.on('click', function(){
      window.app.addFriend(message.username);
      console.log('clicked');
    });
  };

  App.prototype.addRoom = function(roomName){
    var option = $('<option value ="' + roomName + '">' +roomName + '</option>');
    $('#roomSelect').append(option);
  };

  App.prototype.handleSubmit = function(){
    console.log('called');
    var msg = {
      username: window.location.search.slice(10) || 'anonymous',
      text: $('#send .writtenText').val(),
      roomname: chosenRoom || 'lobby'
    };
    window.app.send(msg);
  };



  var changeName = function(){
    name = $('.name').val();
    window.location.search = '?username='+name;
    console.log(name);
  };
  window.app = new App();
  // app.send('SUP GAR');
  // console.log(app);
  console.log(window.location.search);

  setInterval(app.fetch.bind(app), 1000);

  $('.set-name-btn').on('click', changeName);
  $('#send .submit').on('click', app.handleSubmit);
  

});