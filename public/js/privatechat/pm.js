$(document).ready(function(){
    var socket = io();

    var paramOne = $.deparam(window.location.pathname);
    var newParam = paramOne.split('.');

    var username = newParam[0];
    $('#receiver_name').text(`@${username}`)
    
    swap(newParam, 0, 1)
    
    var paramTwo = newParam[0] + '.' + newParam[1];

    socket.on('connect', function() {
        var params = {
            room1: paramOne,
            room2: paramTwo,
        }

        socket.emit('join PM', params);
    })

    socket.on('new message', function(data){
        var template = $('#message-template').html();
        var message = Mustache.render(template, {
            text: data.text,
            sender: data.sender
        });

        $('#messages').append(message);
    })

    // Sending event 'createMessage' to the server
    $('#message_form').on('submit', function (e) {
        e.preventDefault();

        var message = $('#msg').val();
        var sender = $('#name-user').val();

        if (message.trim().length > 0) {
            socket.emit('private message', {
                text: message,
                from: sender,
                room: paramOne
            }, function () {
                $('#msg').val('');
            });
        }
    })
});

function swap(input, value1, value2) {
    var temp = input[value1];
    input[value1] = input[value2]
    input[value2] = temp
}