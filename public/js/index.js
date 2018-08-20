var socket = io();
socket.on('connect',function ()  {
  console.log('Connected to server');
});

socket.on('disconnect' ,function () {
    console.log('Disconnected from server');
});
//listening the data emitted from server
// socket.on('newEmail',function (email) {
//   console.log('New Email',email);
// });

socket.on('newMessage',function(message){

  var formattedTime = moment(message.createdAt).format('h:mm a');

  console.log('newMessageEvent: ',message);
  var li = jQuery('<li></li>');
  li.text(`${message.from} ${formattedTime} : ${message.text}`);

  jQuery('#messages').append(li);
});

socket.on('newLocationMessage',function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank"> My Current location </a>');
  li.text(`${message.from} ${formattedTime} :`);
  a.attr('href',message.url);
  li.append(a);
  //li.append(formattedTime);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit',function (e){
  e.preventDefault();
  var messageTextBox = jQuery('[name=message]');

  socket.emit('createMessage',{
    from:'User',
    text:messageTextBox.val()
  },function(){
    //set the value to empty string
      messageTextBox.val('')
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click',function () {
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser');
  }
  //setting the location button to be disabled
  locationButton.attr('disabled','disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position){

    //enable the location button again
    locationButton.removeAttr('disabled').text('Send location');

      console.log(position);
      socket.emit('createLocationMessage',{
        latitude:position.coords.latitude,
        longitude:position.coords.longitude
      });
  },function(){
      locationButton.removeAttr('disabled').text('Send location');
      alert('Unable to fetch location.')
  });
});
