$(document).ready(function(){
	
	// Form Submit to upload medical file
    $("#med_file_upload").change(med_file_upload_change);
    $("#img_file_upload").change(img_file_upload_change);
    $("#frm_medical_file").submit(frm_medical_file_submit);

    // To delete Medical files
    $('.btn_del_file').click(medicalFileDelete);

    // To edit Medical file name
    $('.btn_edit_file').click(medicalFileUpdate);

	$("#btnCancelMedFileName").click(function(){
		resetMedFileVars();
	});

	$('#medFileModal').on('shown.bs.modal', function (e) {
        $("#med_new_filename").focus();
    });

    $('#medFileModal').on('hidden.bs.modal', function (e) {

    	$('#invalid_medfile_size').fadeOut();
        $('#duplicate_msg').fadeOut();

    	var fileId = $('#medFileModal').data("file-id");
        var fileInput = $('#medFileModal').data("file-input");
    	
    	if(isDefined(fileId) && fileId != ""){
    		// Editing filename
    		editFileName(fileId);
    	}
    	else {
    		uploadFile(fileInput);
    	}

    	resetMedFileVars();
    });

    $('#collapseAddRecords').on('hidden.bs.collapse', function () {
        $("#btnAddRecords").addClass("btn-red");
        $("#btnAddRecords").addClass("btn-danger");
        //$("#btnAddRecords").removeClass("btn-default");
    });

    $('#collapseAddRecords').on('shown.bs.collapse', function () {
        $("#btnAddRecords").removeClass("btn-red");
        $("#btnAddRecords").removeClass("btn-danger");
        //$("#btnAddRecords").addClass("btn-default");        
    });
});

function resetMedFileVars(){
	$("#med_new_filename").val('');
	$('#medFileModal').data("file-ext", '');
	$('#medFileModal').data("file-id", '');
    $('#medFileModal').data("file-input", '');
	$("#med_file_upload").val('');
    $("#img_file_upload").val('');
    $("#file_input").val('');
}

function uploadFile(fileInput){

	var count_duplicate = 0;
    var file_name = $("#med_new_filename").val();
    var fileExt = $('#medFileModal').data("file-ext");

    if (file_name != null && $.trim(file_name) != "" && fileExt != "") {

        // Assembly of filename with ext        
        file_name = file_name + "." + fileExt;

        $("#med_file_name").val(file_name);
        var attachedFiles = $('#' + fileInput).prop('files');

        if(attachedFiles.length > 0){
            var fileItem = attachedFiles[0];
            if (fileItem.size >= 10000000 || fileItem.fileSize >= 10000000) {
                $('#invalid_medfile_size').fadeIn();
            } 
            else {
                $('.m_files').each(function() {
                    var file_str = $(this).data('filename');
                    if (file_str == file_name) {
                        count_duplicate++;
                        $('#duplicate_msg').fadeIn();
                    }
                });

                if (count_duplicate === 0) {
                    $("#file_input").val(fileInput);
                    $("#frm_medical_file").submit();
                }
            }
        }
    }
    $(window).unload(function() {
        $.unblockUI();
    })
}

function editFileName(fileId){

	var fileNameNew = $("#med_new_filename").val();
	var fileExtNew = $('#medFileModal').data("file-ext");

	if (fileNameNew != null && $.trim(fileNameNew) != "" && fileExtNew != "") {
        // Assembly of filename with ext
		fileNameNew = fileNameNew.trim() + "." + fileExtNew;

		$.ajax({
	        url: $("#frm_medical_file").data('update-url'),
	        type: "post",
	        dataType: 'json',
	        data: {
	            file_id: fileId,
	            file_name: fileNameNew,
	            subdomain: $("#subdomain").val()
	        },
	        beforeSend: function(){
	            $(".file-msg").remove();
	            beforeAjax();
	        },
	        success: function(data) {
	            if(data.success){
	                $("#medfile-" + fileId).parent().parent().children('.m_files').first().data("filename", fileNameNew);
	                var lifecode = $("#subdomain").val();
	                var link = "../medical_file/" + lifecode + "/" + fileNameNew;
	                $("#medfile-" + fileId).parent().parent().children('.m_files').first().attr("href", link);
	                $("#medfile-" + fileId).parent().parent().children('.m_files').first().html(fileNameNew);
	            }
	            else {
	                $('#filelist').append('<br /><div class="file-msg">' + data.message + '</div>');
	            }
	        }
	    });
    }
    $(window).unload(function() {
        $.unblockUI();
    })
}

function med_file_upload_change(e) {

    $(".file-msg").remove();

	if($(this).val() != ""){
		
		// We extract the extension
		var filenameAsIs = $(this).val();
		var fileExt = filenameAsIs.split('.').pop();
		var filenameWithoutExt = filenameAsIs.replace("." + fileExt, "");
		$("#med_new_filename").val(filenameWithoutExt.replace(/^.*[\\\/]/, ''));
		$('#medFileModal').data("file-ext", fileExt);
        $('#medFileModal').data("file-input", "med_file_upload");
		$('#medFileModal').modal('show');
	}

    //Send Notification Email to CJ when Medical File Submitted
    var subdomain = $("#subdomain").val();
    var subject="MR1.Us Add Records - Upload File Submitted: "+subdomain;
    var note="User: <b>"+subdomain+"</b> Has Added New File in <b>\"Medical File\"</b>";
    send_notification_email_to_cj2(subject,note);
    $(window).unload(function() {
        $.unblockUI();
    })
}

function img_file_upload_change(e) {

    $(".file-msg").remove();

    if($(this).val() != ""){
        
        // We extract the extension
        var filenameAsIs = $(this).val();
        var fileExt = filenameAsIs.split('.').pop();

        // Only image types allowed
        var fileExtLower = fileExt.toLowerCase();
        if(fileExtLower == 'jpg' || fileExtLower == 'jpeg' || fileExtLower == 'png' || fileExtLower == 'gif')
        {
            var filenameWithoutExt = filenameAsIs.replace("." + fileExt, "");
        
            $("#med_new_filename").val(filenameWithoutExt.replace(/^.*[\\\/]/, ''));
            $('#medFileModal').data("file-ext", fileExt);
            $('#medFileModal').data("file-input", "img_file_upload");
            $('#medFileModal').modal('show');

        }
        else {
            $('#filelist').prepend('<div class="file-msg text-center" style="color:red; margin-bottom: 15px; margin-top: 15px;">Only These Image Types Allowed: jpg, jpeg, png or gif.</div>');
        }
    }


    //Send Notification Email to CJ when new Photograph Submitted
    var subdomain = $("#subdomain").val();
    var subject="MR1.Us Add Records- Photograph Submitted: "+subdomain;
    var note="User: <b>"+subdomain+"</b> Has Added New New Photograph in <b>\"Medical File\"</b>";
    send_notification_email_to_cj2(subject,note);
    $(window).unload(function() {
        $.unblockUI();
    })

}

function frm_medical_file_submit(e){
	
	var baseUrl = $(this).data("base-url");
	var mode = $(this).data("mode");
	var funcForProgress;
	
	if(mode == "pin"){
		funcForProgress = progressHandlingFunctionPinMode;
	}
	else if(mode == "edit"){
		funcForProgress = progressHandlingFunctionEditMode;
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
            $('#progress_status').show();
            $('#invalid_medfile_size').fadeOut();
            $('#duplicate_msg').fadeOut();
            $(".file-msg").remove();
        },
        success: function(data) {
            if(!data.success && data.file_too_large){
                $('#invalid_medfile_size').html(data.message);
                $('#invalid_medfile_size').fadeIn();
            }
            else {
            	// Depending on the page mode
            	var newFileHtml = '';
            	var newFileUrl = baseUrl + 'medical_file/' + data.subdomain + '/' + data.filename;
            	
            	if(mode == "pin"){

	            	newFileHtml = '' + 
	            	'<div class="alert alert-mr1-blue text-left file_name blue-background" style="word-wrap:break-word;" role="alert">' + 
	            	'	<div class="row m_files" style="padding: 5px;" data-filename="' + data.filename + '">' + 
	            	'		<div class="col-md-9 col-sm-10 col-xs-7">' + 
                    '			<a href="' + newFileUrl + '" target="_blank"> ' + data.filename + '</a>' +
	            	'		</div>' + 
	            	'		<div class="col-md-3 col-sm-2 col-xs-5" style="text-align: right;">' + 
	            	'			<a style="padding-right: 15px" data-file_link="' + newFileUrl + '" href="javascript:void(0);" class="send_email"><i class="glyphicon glyphicon-envelope"></i></a>' + 
	            	'			<a style="padding-right: 15px" data-file_link="' + newFileUrl + '" href="javascript:void(0);" class="send_fax"><i class="glyphicon glyphicon-print"></i></a>' + 
	            	'			<a style="margin-left:-2px;" download href="' + newFileUrl + '"><i class="glyphicon glyphicon-download-alt"></i></a>' + 
	            	'		</div>' + 
	            	'	</div>' + 
	            	'</div>' + 
	            	'<div class="gap5y"></div>';

	            	var currHtml = $('#filelist').html();
                    $('#filelist').html(newFileHtml + currHtml);
	            	$(".send_email").click(send_email);
                    $(".send_fax").click(send_fax);
				}
				else if(mode == "edit"){
					
					newFileHtml = '' + 
	            	'<div class="file col-sm-12 col-md-12 edit-mode-medfile-row">' + 
	            	'	<div class="pull-right" style="margin-right: -15px">' + 
                    '		<i class="glyphicon glyphicon-pencil btn_edit_file" style="cursor: pointer;" id="medfile-' + data.fileid + '"></i>' + 
                    '		<i class="glyphicon glyphicon-remove btn_del_file" data-fileid="' + data.fileid + '"></i>&nbsp;&nbsp;' + 
                    '	</div>' + 
                    '	<a class="m_files wrap_word" data-filename="' + data.filename + '" download href="' + newFileUrl + '" data-file-id="' + data.fileid + '">' + data.filename + '</a>' + 
                    '	<div class="clearfix clear"></div>' + 
	            	'</div>';

                    var currHtml = $('#filelist').html();
	            	$('#filelist').html(newFileHtml + currHtml);

					$("#nextmedfileadd").css({
		                "background-color": "red",
		                "color": "white"
		            });

		            $('.btn_edit_file').click(medicalFileUpdate);
		            $('.btn_del_file').click(medicalFileDelete);
				}
            }
            
            $('#progress_status').hide();
        },
        error: function(a,b,c){
        	
        }


    });
    $(window).unload(function() {
        $.unblockUI();
    })
}

function medicalFileUpdate() {
    var file_id = $(this).parent().parent().children('.m_files').first().data("file-id");
    //var file_name = $(this).parent().parent().children('.m_files').first().data("filename");
    var file_name = $(this).parent().parent().children('.m_files').first().html();
    var fileExt = file_name.split('.').pop();
    var filenameWithoutExt2 = file_name.replace("." + fileExt, "");
    var filenameWithoutExt = filenameWithoutExt2.trim();

    $("#med_new_filename").val(filenameWithoutExt.replace(/^.*[\\\/]/, ''));
    $('#medFileModal').data("file-ext", fileExt);
    $('#medFileModal').data("file-id", file_id);
    $('#medFileModal').modal('show');
}

function medicalFileDelete() {
    var elem = $(this);
    var file_id = elem.data("fileid");
    if (confirm("Are You Sure You Wish To Delete?")) {
        $.ajax({
            url: $("#frm_medical_file").data('delete-url'),
            type: "post",
            data: {
                file_id: file_id,
                subdomain: $("#subdomain").val()
            },
            //beforeSend: beforeAjax,
            success: function() {
                elem.parent().parent('div').remove();

                //Send Notification Email to CJ when Medical File Deleted
                var subdomain = $("#subdomain").val();
                var subject="MR1.Us File Deleted: "+subdomain;
                var note="User: <b>"+subdomain+"</b> Has Deleted File in <b>\"Medical File\"</b>";
                send_notification_email_to_cj2(subject,note);
                $(window).unload(function() {
                    $.unblockUI();
                })
            }
        });
    }
}

function progressHandlingFunctionPinMode(e) {
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
  
  	$('#progress_status').html(loadedStatus);
  	$(".blockMsg").html(entireMsg);
}

function progressHandlingFunctionEditMode(e) {
    
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

    $('#progress_status').html(loadedStatus);
  	$(".blockMsg").html(entireMsg);
}

function send_fax(e){
	$("#fax_file_path").val($(this).data("file_link"));
	$("#faxModal").modal("show");
}

function send_email(e){
	$("#file_path").val($(this).data("file_link"));
	$("#emailModal").modal("show");
}

/*Send Notification Email to CJ*/
function send_notification_email_to_cj(subject,note){
    var subdomain = $("#subdomain").val();
    //var subject="User: "+subdomain+" Has Clicked on \"Upload Record\" Button";

    $.ajax({
        url: "https://mr1.us/home/send_notification_to_cj",
        type: "post",
        data: {subject: subject, note: note, subdomain:subdomain},
        success:function(data){
            //alert(data);
        }
    });
    $(window).unload(function() {
        $.unblockUI();
    })
}


/*Send Notification Email to CJ*/
function send_notification_email_to_cj2(subject,note){
    var subdomain = $("#subdomain").val();
    //var subject="User: "+subdomain+" Has Clicked on \"Upload Record\" Button";

    $.ajax({
        url: "https://mr1.us/home/send_notification_to_cj",
        type: "post",
        data: {subject: subject,note: note, subdomain:subdomain},
        success:function(data){
            //alert(data);
        }
    });
    $(window).unload(function() {
        $.unblockUI();
    })
}


/*Send Notification Email to CJ*/
function send_notification_email_to_cj3(subject,note,subdomain){

    $.ajax({
        url: "https://mr1.us/home/send_notification_to_cj",
        type: "post",
        data: {subject: subject,note: note, subdomain:subdomain},
        success:function(data){
            //alert(data);
        }
    });
    $(window).unload(function() {
        $.unblockUI();
    })
}