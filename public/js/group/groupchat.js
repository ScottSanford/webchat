$(document).ready(function(){
    var socket = io();
    var room = $('#groupName').val();
    var sender = $('#sender').val();

    // create a socket connection
    socket.on('connect', function(){

        var params = {
            room: room,
            name: sender
        }

        // Join a socket channel
        socket.emit('join', params, function(){
            console.log('User has joined this channel')
        })
    });

    socket.on('usersList', function(users){
        var ol = $('<ol></ol>');

        for (i=0; i < users.length; i++) {
            ol.append('<p><a id="val" data-toggle="modal" data-target="#myModal">'+users[i]+'</a></p>');
        }

        $(document).on('click', '#val', function(){
            $('#name').text('@' + $(this).text());
            $('#receiverName').val($(this).text());
            $('#nameLink').attr('href', '/profile/' + $(this).text());
        });

        $('#numValue').text('('+users.length+')')
        $('#users').html(ol);
    });
    
    // Listening on event 'newMessage' from the server 
    socket.on('newMessage', function(data){
        var template = $('#message-template').html();
        var message = Mustache.render(template, {
            text: data.text,
            sender: data.from
        });

        $('#messages').append(message);
    });

    // Sending event 'createMessage' to the server
    $('#message-form').on('submit', function(e){
        e.preventDefault();

        var message = $('#msg').val();

        socket.emit('createMessage', {
            text: message,
            room: room,
            from: sender
        }, function(){
            $('#msg').val('');
        });
    })
});