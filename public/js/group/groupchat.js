$(document).ready(function(){
    var socket = io();
    var room = $('#groupName').val();

    // create a socket connection
    socket.on('connect', function(){
        console.log('Yea! User connected')

        var params = {
            room: room
        }

        // Join a socket channel
        socket.emit('join', params, function(){
            console.log('User has joined this channel')
        })
    });
    
    // Listening on event 'newMessage' from the server 
    socket.on('newMessage', function(data){
        console.log(data)
    });

    // Sending event 'createMessage' to the server
    $('#message-form').on('submit', function(e){
        e.preventDefault();

        var message = $('#msg').val();

        socket.emit('createMessage', {
            text: message,
            room: room
        }, function(){
            $('#msg').val('');
        });
    })
});