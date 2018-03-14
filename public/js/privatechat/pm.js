$(document).ready(function(){
    var socket = io();

    var paramOne = $.deparam(window.location.pathname);
    var newParam = paramOne.split('.');
    
    swap(newParam, 0, 1)
    
    var paramTwo = newParam[0] + '.' + newParam[1];

    socket.on('connect', function() {
        var params = {
            roo1: paramOne,
            roo2: paramTwo,
        }

        socket.emit('join PM', params);
    })

    // Sending event 'createMessage' to the server
    $('#message_form').on('submit', function (e) {
        e.preventDefault();

        var message = $('#msg').val();
        var sender = $('#name-user').val();

        if (message.trim().length > 0) {
            socket.emit('private message', {
                text: message,
                from: sender
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