$(document).ready(function(){
    // click the button to upload a file
    $('.upload-btn').on('click', function(){
        // Trigger the file upload input
        $('#upload-input').click();
    });

    $('#upload-input').on('change', function(){
        var uploadInput = $('#upload-input');

        if (uploadInput.val() !== '') {
            var formData = new FormData();

            formData.append('upload', uploadInput[0].files[0]);

            // Send data to the database
            $.ajax({
                url: '/uploadFile',
                type: 'POST', 
                data: formData, 
                processData: false, 
                contentType: false, 
                success: function() {
                    // Empty the data field when successful
                    uploadInput.val('');
                }
            });
        }
    });
});