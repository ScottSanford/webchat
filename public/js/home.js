$(document).ready(function(){
    $('#favorite').on('submit', function(e) {
        e.preventDefault();
        
        var id = $('#id').val();
        var groupName = $('#group_name').val();

        $.ajax({
            url: '/home',
            type: 'POST',
            data: {
                id: id,
                groupName: groupName
            },
            success: function() {
                console.log(groupName)
            }
        });
    });
});