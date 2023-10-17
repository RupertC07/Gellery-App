let imageInput = document.getElementById("image-input");
let previewImage = document.getElementById("ImagePreview")
let text = document.getElementById("imageText")

imageInput.addEventListener("change", function(event){
    if (event.target.files.length ==0) 
    {

        previewImage.setAttribute("src", "");
        previewImage.style.display="none";
        text.style.display="block";
        return;
    }

    let tempUrl = URL.createObjectURL(event.target.files[0]);
    previewImage.setAttribute("src", tempUrl);
    previewImage.style.display="block";
    text.style.display="none";

})


function navigateToPage() {
    const url = `/PhotoGallery`;
    history.pushState(null, '', url);
    // Perform AJAX request or any other desired action here
}


function getDetails(id)
{

    let parsedId = parseInt(id)
    $.ajax ({

        
        url : "/getDetails",
        method : "POST",
        data : {id:parsedId},
        dataType: 'json',
        success : function (response) 
        {

            if (response.data) 
            {

                if (response.data.length > 0) 
                {
    
                  
                    $('#uploadId').val(response.data[0].id)
                    $('#rem_id').val(response.data[0].id)
                   
                    $('#newCaption').val(response.data[0].caption)
                    $('#uploadedImage').attr("src", response.data[0].upload_path)
    
    
                    
                }
                
            }
           

        }








    });
}

$('#submitForm1').click(()=> {
    $('#formUpdate').submit();
})

$('#submitForm2').click(()=> {
    $('#formDelete').submit();
})



$('#formUpload').submit(function () {
    var allowedExtensions = ["jpg", "jpeg", "png"];

   
    var file  = $('#image-input').val()

    var fileExtension = file.split('.').pop().toLowerCase();



    if (allowedExtensions.indexOf(fileExtension) != -1)
    {
        return true
        
    }
    else
    {

       toastr.warning("INVALID FILE TYPE")
        return false

    }


    



  

   


})



  