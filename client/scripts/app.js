$(document).ready(function(){

  var chosenRoom;

  var App = function(){
    this.server = 'https://api.parse.com/1/classes/chatterbox';
    this.friends = [];
    this.rooms = [];
  };

  App.prototype.init = function(){
    // this.handleSubmit();
    // this.fetch();


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

  App.prototype.fetch = function(roomName){
    var dataString = 'order=-createdAt&limit=300';
    if(roomName){
      dataString += '&where={"roomname":"' + roomName + '"}';
    }
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      // jsonp: 'callback',
      contentType: 'application/json',
      data: dataString ,
      success: function (data) {
            // console.log(data.results[0]);
        // data.results; <-array(
        for(var j=0;j<data.results.length;j++){
          if(this.rooms.indexOf(data.results[j].roomname) === -1){
            this.addRoom(data.results[j].roomname);
          }
        }
        this.clearMessages();
        for(var i=0;i<data.results.length;i++){
          // if(data.results[i].roomname === this.chosenRoom){
            this.addMessage(data.results[i]);
          // }
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
    // message.roomname
    var element = $('<p class="chat"></p>');
    var username = $('<a class="username" href="#"></a>');

    var msg = $('<span></span>');
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
    });
  };

  App.prototype.addRoom = function(roomName){
    this.rooms.push(roomName);
    var option = $('<option value ="' + roomName + '">' +roomName + '</option>');
    $('#roomSelect').append(option);
  };

  App.prototype.changeRoom = function(roomname){
    this.chosenRoom = roomname;
  };

  App.prototype.handleSubmit = function(event){
    var msg = {
      username: window.location.search.slice(10) || 'anonymous',
      text: $('#send .writtenText').val(),
      roomname: this.chosenRoom || 'lobby'
    };
    this.send(msg);
    event.preventDefault();
    $('.writtenText').val('');
  };

  App.prototype.startSpinner = function(){

  };

  App.prototype.stopSpinner = function(){

  };



  var changeName = function(){
    name = $('.name').val();
    window.location.search = '?username='+name;
  };
  window.app = new App();
  app.init();
  setInterval(function(){
   app.fetch(app.chosenRoom); 
  }, 1000);

  $('.set-name-btn').on('click', changeName);
  $('#send').on('submit', function(event){
    app.handleSubmit(event);
  });
  $('#send .submit').on('click', app.handleSubmit.bind(app));
  $('.addRoomname').on('click', function(){
    app.addRoom($('.writtenRoomName').val());
    app.changeRoom($('.writtenRoomName').val());
  });
  $('#roomSelect').change(function(){
    app.changeRoom($('#roomSelect').val());
  });

});