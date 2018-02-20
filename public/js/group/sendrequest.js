$(document).ready(function(){
    var socket = io();

    var room = $('#groupName').val();
    var sender = $('#sender').val();
    
    socket.on('connect', function(){
        var params = {
            sender: sender
        };

        socket.emit('joinRequest', params, function(){
            console.log('Joined!')
        })
    });

    socket.on('newFriendRequest', function(friend){
        $('#reload').load(location.href + ' #reload');
    })

    $('#add_friend').on('submit', function(e){
        e.preventDefault();

        var receiverName = $('#receiverName').val();

        $.ajax({
            url: '/group/' + room,
            type: 'POST',
            data: {receiverName: receiverName},
            success: function() {
                // this makes it real time
                socket.emit('friendRequest', {
                    receiver: receiverName,
                    sender: sender
                }, function(){
                    console.log('Request sent')
                });
            }
        });
    })

});