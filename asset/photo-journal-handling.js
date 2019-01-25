$(document).ready(function(){
	
	// Form Submit to upload medical file
    $("#photo_file_upload").change(photo_file_upload_change);
    $("#frm_photo_file").submit(frm_photo_file_submit);

    // To delete photos
    $('.pj_photo_remove').click(photoJournalDelete);

    // To edit photo name
    $('.pj_photo_edit').click(photoJournalEdit);

	$("#btnCancelPhotoFileName").click(function(){
		resetPhotoFileVars();
	});

	$('#photoJournalModal').on('shown.bs.modal', function (e) {
        $("#photo_new_filename").focus();
    });

    $('#photoJournalModal').on('hidden.bs.modal', function (e) {

    	$('#invalid_size').fadeOut();
        $('#duplicate_msg').fadeOut();

    	var fileId = $('#photoJournalModal').data("file-id");
    	
    	if(isDefined(fileId) && fileId != ""){
    		// Editing filename
    		editPhoto(fileId);
    	}
    	else {
    		uploadPhoto();
    	}

    	resetPhotoFileVars();
    });
});

function resetPhotoFileVars(){
	$("#photo_new_filename").val('');
	$('#photoJournalModal').data("file-ext", '');
	$('#photoJournalModal').data("file-id", '');
	$("#photo_file_upload").val('');
}

function uploadPhoto(){

	var count_duplicate = 0;
    var file_name = $("#photo_new_filename").val();
    var fileExt = $('#photoJournalModal').data("file-ext");

    if (file_name != null && $.trim(file_name) != "" && fileExt != "") {

        // Assembly of filename with ext        
        file_name = file_name + "." + fileExt;

        $("#photo_file_name").val(file_name);
        var attachedFiles = $('#photo_file_upload').prop('files');

        if(attachedFiles.length > 0){
            var fileItem = attachedFiles[0];
            
            if($.inArray(fileExt, ['gif','png','jpg','jpeg','bmp','tif', 'GIF','PNG','JPG','JPEG','BMP','TIF']) == -1) {
                $('#invalid_extention').fadeIn();
            }
            else if (fileItem.size >= (8*1024*1024) || fileItem.fileSize >= (8*1024*1024)) {
                $('#invalid_size').fadeIn();
            } 
            else {
                $('.p_files').each(function() {
                    var file_str = $(this).data('filename');
                    if (file_str == file_name) {
                        count_duplicate++;
                        $('#duplicate_msg').fadeIn();
                    }
                });

                if (count_duplicate === 0) {
                    $("#frm_photo_file").submit();
                }
            }
        }
    }
    $(window).unload(function() {
        $.unblockUI();
    })
}

function editPhoto(fileId){

	var fileNameNew = $("#photo_new_filename").val();
	var fileExtNew = $('#photoJournalModal').data("file-ext");

	if (fileNameNew != null && $.trim(fileNameNew) != "" && fileExtNew != "") {
        // Assembly of filename with ext
		fileNameNew = fileNameNew + "." + fileExtNew;

		$.ajax({
	        url: $("#frm_photo_file").data('update-url'),
	        type: "post",
	        dataType: 'json',
	        data: {
	            photo_journal_id: fileId,
	            file_name: fileNameNew,
	            subdomain: $("#subdomain").val()
	        },
	        beforeSend: function(){
	            $(".file-msg").remove();
	            beforeAjax();
	        },
	        success: function(data) {
	            if(data.success){
	                //$("#pj-photo-" + fileId).data("filename", data.filename);
	                var lifecode = $("#subdomain").val();
	                var link = "../photo_journal/" + lifecode + "/" + data.filename;
	                $("#pj-photo-" + fileId).children('.a_url').attr("href", link);
	                $("#pj-photo-" + fileId).children('.a_url').children().attr("src", link);
	                $("#pj-photo-" + fileId).children('.a_tooltip').attr("href", link);
	                $("#pj-photo-" + fileId).children('.a_tooltip').attr("title", data.filename);
	                $("#pj-photo-" + fileId).children('.a_tooltip').html(data.preview_filename);
                    $("#pj-photo-" + fileId).data("filename", link);
	            }
	            else {
	                $('#filelist_photo').prepend('<br /><div class="file-msg">' + data.message + '</div>');
	            }
	        }
	    });
    }
    $(window).unload(function() {
        $.unblockUI();
    })
}

function photo_file_upload_change(e) {
	
	if($(this).val() != ""){
		
		// We extract the extension
		var filenameAsIs = $(this).val();
		var fileExt = filenameAsIs.split('.').pop();
		var filenameWithoutExt = filenameAsIs.replace("." + fileExt, "");
		
		$("#photo_new_filename").val(filenameWithoutExt.replace(/^.*[\\\/]/, ''));
		$('#photoJournalModal').data("file-ext", fileExt);
		$('#photoJournalModal').modal('show');
	}
}

function frm_photo_file_submit(e){
	
	var baseUrl = $(this).data("base-url");
	var mode = $(this).data("mode");
	var funcForProgress;
	
	if(mode == "pin"){
		funcForProgress = photoProgressHandlingPinMode;
	}
	else if(mode == "edit"){
		funcForProgress = photoProgressHandlingEditMode;
	}

	e.preventDefault();
    $.ajax({
        url: $(this).data("upload-url"),
        type: 'POST',
        dataType: 'json',
        xhr: function() { // Custom XMLHttpRequest
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) { // Check if upload property exists
                myXhr.upload.addEventListener('progress', funcForProgress, false); // For handling the progress of the upload
            }
            return myXhr;
        },
        data: new FormData(this),
        processData: false,
        contentType: false,
        beforeSend: function() {
        	fileUploadingAjax();
            $('#progress_status_photo').show();
            $('#invalid_extention').fadeOut();
            $('#invalid_size').fadeOut();
        },
        success: function(data) {
            if(!data.success && data.file_too_large){
                $('#invalid_size').html(data.message);
                $('#invalid_size').fadeIn();
            }
            else {
            	// Depending on the page mode
            	var newPhotoHtml = '';
            	var newPhotoUrl = baseUrl + 'photo_journal/' + data.subdomain + '/' + data.filename;
            	var thumbnail = baseUrl + 'photo_journal/' + data.subdomain + '/thumbnail/' + data.filename;

            	if(mode == "pin"){

	            	newPhotoHtml = '' + 
	            	'<div id="pj-photo-' + data.photo_journal_id + '" class="p_files text-left col-lg-3 col-sm-6 col-xs-6 gap5y" data-file_name="' + data.filename + '">' + 	            	
	            	'	<a title="' + data.filename + '" href="' + newPhotoUrl + '" target="_blank"> ' + 
	            	'		<img class="thumbnail img-responsive1" style="margin: 0" width="' + data.width + '" height="' + data.heigh + '" src="' + thumbnail + '">' +
	            	'	</a>' + 
	            	'	<a style="word-wrap:break-word;" href="javascript://" data-toggle="tooltip" title="' + data.filename + '">' + data.preview_filename + '</a>' + 
	            	'</div>';

	            	addPhotoToScreen(newPhotoHtml);


/*                    //Send Notification Email to CJ
                    var subdomain2 = $data.subdomain;
                    var subject="New \"Phone Journal\" Added By: "+subdomain2+" ";
                    var note="User: <b>"+subdomain2+"</b> Has Added New <b>\"Phone Journal\"</b> Entry";
                    send_notification_email_to_cj(subject,note);*/

				}
				else if(mode == "edit"){
					
					newPhotoHtml = '' + 
	            	'<div id="pj-photo-' + data.photo_journal_id + '" data-file-id="' + data.photo_journal_id + '" class="text-left col-lg-3 col-sm-6 col-xs-6 gap5y p_files" data-filename="' + data.filename + '">' + 	            	
	            	'	<a title="' + data.filename + '" href="' + newPhotoUrl + '" target="_blank" class="a_url"> ' + 
	            	'		<img class="thumbnail img-responsive1" style="margin: 0" width="' + data.width + '" height="' + data.heigh + '" src="' + thumbnail + '">' +
	            	'	</a>' + 
	            	'	<a style="word-wrap:break-word;" href="javascript://" data-toggle="tooltip" class="a_tooltip" title="' + data.filename + '">' + data.preview_filename + '</a>&nbsp;' + 
	            	'	<i data-photo-journal-id="' + data.photo_journal_id + '" class="glyphicon glyphicon-pencil pj_photo_edit" data-photo-id="' + data.photo_journal_id + '"></i>' + 
	            	'	<div class="cross">' + 
	            	'		<i id="' + data.photo_journal_id + '" class="glyphicon glyphicon-remove pj_photo_remove" data-photo-id="' + data.photo_journal_id + '"></i>' + 
	            	'	</div>' + 
	            	'</div>';

					$("#nextphotojournal").css({
		                "background-color": "red",
		                "color": "white"
		            });

                    $('.pj_photo_edit').unbind('click');
                    $('.pj_photo_remove').unbind('click');

					addPhotoToScreen(newPhotoHtml);
		            
                    $('.pj_photo_edit').click(photoJournalEdit);
                    $('.pj_photo_remove').click(photoJournalDelete);
				}
            }
            
            $('#progress_status_photo').hide();
        },
        error: function(a,b,c){
        	
        }
    });
    $(window).unload(function() {
        $.unblockUI();
    })
}

function addPhotoToScreen(newPhotoHtml){
	if($("#filelist_photo").children().length == 0 || $("#filelist_photo").children().last().children().length == 4){
		var currHtml = $('#filelist_photo').html();
        $("#filelist_photo").html(currHtml + '<div class="row">' + newPhotoHtml + '</div>');	
	}
	else if($("#filelist_photo").children().last().children().length < 4) {
		$("#filelist_photo").children().last().append(newPhotoHtml);
	}
    $(window).unload(function() {
        $.unblockUI();
    })
}

function photoJournalEdit() {
    var file_id = $(this).data("photo-id");
    var file_name = $(this).parent().data("filename");
    var fileExt = file_name.split('.').pop();
    var filenameWithoutExt = file_name.replace("." + fileExt, "");

    $("#photo_new_filename").val(filenameWithoutExt.replace(/^.*[\\\/]/, ''));
    $('#photoJournalModal').data("file-ext", fileExt);
    $('#photoJournalModal').data("file-id", file_id);
    $('#photoJournalModal').modal('show');
}

function photoJournalDelete() {
    
    var elem = $(this);
    var photo_journal_id = elem.data("photo-id");
    if (confirm("Are You Sure You Wish To Delete?")) {
        $.ajax({
            url: $("#frm_photo_file").data('delete-url'),
            type: "post",
            data: {
                photo_journal_id: photo_journal_id,
                subdomain: $("#subdomain").val()
            },
            beforeSend: beforeAjax,
            success: function() {
                elem.parent().parent('div').remove();
            }
        });
    }
    $(window).unload(function() {
        $.unblockUI();
    })
}

function photoProgressHandlingPinMode(e) {
  	var done = e.loaded,
    	total = e.total;
  	var msg = '';
  
  	if (total > 5000000) {
  		msg = ' (Large Files May Upload Slowly)';
  	}
  
  	var sam = (done * 100) / total;
  	var percentage = Math.round(sam);
  	var loadedStatus = 'Loading ' + percentage + '%' + msg;
  	var entireMsg = loadedStatus;

  	if(percentage == 100){
  		entireMsg += '. Completing request...'
  	}
  
  	$('#progress_status_photo').html(loadedStatus);
  	$(".blockMsg").html(entireMsg);
}

function photoProgressHandlingEditMode(e) {
    
    var done = e.position || e.loaded,
        total = e.totalSize || e.total;
    var msg = '';
    
    if (total > 1000000) {
        msg = ' (Large Files May Upload Slowly)';
    }

    var percentage = Math.floor((done * 100) / total);
    var loadedStatus = 'Loading ' + percentage + '%' + msg;
  	var entireMsg = loadedStatus;

    if(percentage == 100){
  		entireMsg += '. Completing request...'
  	}

    $('#progress_status_photo').html(loadedStatus);
  	$(".blockMsg").html(entireMsg);
}