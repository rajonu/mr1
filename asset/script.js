$(document).ready(function() {
	// Since the file selection button is not shown on the page,
	// we will use avatar click as a file button click.
	$('#preview1 img').on('click', function(){
		$('#image_file').trigger('click');
	});
	
	
	if ($('input[name="txtemail"]').val()) {
		$('input[name="txtmail"]').val($('input[name="txtemail"]').val());
	}
        
        /*$('#image_file').bind('change', function(e) {

            //this.files[0].size gets the size of your file.
            alert(this.files[0].size);
            e.preventDefault();

          });*/

    $("textarea").keyup(AutoGrowTextArea);
});

// convert bytes into friendly format
function bytesToSize(bytes) {
	var sizes = ['Bytes', 'KB', 'MB'];
	if (bytes == 0) return 'n/a';
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

// check for selected crop region
function checkForm() {
/*	if (parseInt($('#w').val())) {
		$('#upload_form').removeAttr('target');
		return true;
	}
	
	$('.error').html('Please select a crop region and then press Upload').show();
	return false;
*/
return true;
};

// update info by cropping (onChange and onSelect events handler)
function updateInfo(e) {
	$('#x1').val(e.x);
	$('#y1').val(e.y);
	$('#x2').val(e.x2);
	$('#y2').val(e.y2);
	$('#w').val(e.w);
	$('#h').val(e.h);
};

// clear info by cropping (onRelease event handler)
function clearInfo() {
	$('.info #w').val('');
	$('.info #h').val('');
};

function fileSelectHandler() {
        $('.size_alert').hide();
         $('.img_alert').hide();
         $('.img_dimention').hide();
	if ($('#image_file').val()) {
            
                var imgSize = $('#image_file')[0].files[0].size;
                //alert('imgSize :'+imgSize);
                
                if(imgSize > (8*1024*1024))
                {
                    $('.size_alert').show();
                    return false;
                }
               
                var filename= $('#image_file').val();
                var extension=filename.substr(filename.lastIndexOf('.')+1).toLowerCase();
                //alert(extension);
                if(extension !='jpg' && extension !='png' && extension!='jpeg'){
                    $('.img_alert').show();
                    return false;
                }
                
		$('.step2').hide();
		$('.loading').show();
		var formObj = $('#upload_form');
		var formURL = 'load_img?mode=preload';
		
		formObj.attr('action', formURL);
		
		if(window.FormData !== undefined) {
			var formData = new FormData(formObj[0]);
			
			$.ajax({
				url: formURL,
				type: 'POST',
                xhr: function() {  // Custom XMLHttpRequest
                    var myXhr = $.ajaxSettings.xhr();
                    if(myXhr.upload){ // Check if upload property exists
                        myXhr.upload.addEventListener('progress',proc, false); // For handling the progress of the upload
                    }
                    return myXhr;
                },
				data: formData,
				beforeSend: beforeAjax,
				mimeType: 'multipart/form-data',
				dataType: 'json',
				contentType: false,
				cache: false,
				processData:false,
				success: function(json) {
                    if(json.error=='yes'){
                        $('#preview1').show();
                        $('.img_dimention').show();
                        $("#myProgress").hide();
                    }
                    else{
                        step2(json);
                    }
				}
			});
			
			return false;
		} else {
			var iframeId = 'unique' + (new Date().getTime());
			var iframe = $('<iframe src="javascript:false;" name="'+iframeId+'" />');
			iframe.hide();
			formObj.attr('target', iframeId);
			iframe.appendTo('body');
			iframe.load(function(e){
				var doc = getDoc(iframe[0]);
				var docRoot = doc.body ? doc.body : doc.documentElement;
				var data = docRoot.innerHTML;
				
				//data is returned from server
				step2(JSON.parse(data));
			});
			formObj[0].submit();
			
			return false;
		}
	}
}
function proc(e){
    var done = e.loaded, total = e.total;
    var msg = '';
    if(total>100000){
        msg = '(Large Files May Upload Slowly)';
    }
    
    $('#myProgress').html('Loading '+(Math.floor((done*100)/total)) + '% '+msg);
}

function getDoc(frame) {
	var doc = null;
	
	// IE8 cascading access check
	try {
		if (frame.contentWindow) {
			doc = frame.contentWindow.document;
		}
	} catch(err) {}
	
	if (doc) { // successful getting content
		return doc;
	}
	
	try { // simply checking may throw in ie8 under ssl or mismatched protocol
		doc = frame.contentDocument ? frame.contentDocument : frame.document;
	} catch(err) {
		// last attempt
		doc = frame.document;
	}
	
	return doc;
}

function step2(data) {
	var oImage = document.getElementById('preview');
	oImage.src = data.filename;
        var n_height=160;
if(data.height<160)
    n_height=data.height;
    
var adjusted_width=(data.width/data.height)*n_height;

	//Triple-check if both width and heights are normally initialized in all browsers
        //alert('height :'+data.height);
        //alert('Width :'+data.width);
	oImage.height = data.height;
	oImage.width = data.width;
	$(oImage).css('width', data.width+'px');
	$(oImage).css('height', data.height+'px');
	$(oImage).css('max-width', adjusted_width+'px');
	$(oImage).css('max-height', '160px');
	//$(oImage).css('max-width', '500px');
	//$(oImage).css('max-height', '500px');
	
	// Hide current image
	$('#preview1').hide();
	$('.loading').hide();

//  debugging xif data:  //$("#txtmedicalsummary").val(JSON.stringify(data.exif));
	
	// Create variables (in this scope) to hold the Jcrop API and image size
	var jcrop_api, boundx, boundy;
	
	// destroy Jcrop if it is existed
	if (typeof jcrop_api != 'undefined') {
		jcrop_api.destroy();
	}
	
	$.Jcrop('#preview').destroy();
	$('.jcrop-holder').remove();
	$('#preview').css('visibility', 'visible');
	
	// initialize Jcrop
	$('#preview').Jcrop({
		minSize: [64, 64], // min crop size
		boxWidth: data.width, 
		boxHeight: data.height,
		trueSize: [data.width, data.height],
		aspectRatio : 1, // keep aspect ratio 1:1
		bgFade: true, // use fade effect
		bgOpacity: .3, // fade opacity
		onChange: updateInfo,
		onSelect: updateInfo,
		onRelease: clearInfo,
               
	}, function(){
		// use the Jcrop API to get the real image size
		var bounds = this.getBounds();
		boundx = bounds[0];
		boundy = bounds[1];

		// Store the Jcrop API in the jcrop_api variable
		jcrop_api = this;
		
		min = Math.min(data.width, data.height);
		
		if (typeof data.sx != 'undefined' && typeof data.sy != 'undefined' && typeof data.ex != 'undefined' && typeof data.ey != 'undefined') {
			bound_sx = data.sx;
			bound_ex = data.ex;
			bound_sy = data.sy;
			bound_ey = data.ey;
		} else {
			// Show default bounds
			if (min < 64) {
				bound_sx = data.width == min ? 0 : data.width / 2 - min / 2;
				bound_ex = data.width == min ? data.width : data.width / 2 + min / 2;
				bound_sy = data.height == min ? 0 : data.height / 2 - min / 2;
				bound_ey = data.height == min ? data.height : data.height / 2 + min / 2;
			} else {
				bound_sx = data.width / 2 - min / 4;
				bound_ex = data.width / 2 + min / 4;
				bound_sy = data.height / 2 - min / 4;
				bound_ey = data.height / 2 + min / 4;
			}
		}
		
		//jcrop_api.setSelect([bound_sx, bound_sy, bound_ex, bound_ey]);
                //console.log(bound_sx+'='+ bound_sy+'='+ bound_ex+'='+ bound_ey);
                jcrop_api.setSelect([(bound_sx-30), 20, bound_ex, bound_ey]);
		$('#upload_form').attr('action', 'load_img?mode=upload');
		
		if ($('#upload_form input[name="image_name"]').length) {
			$('#upload_form input[name="image_name"]').val(data.filepath);
		} else {
			$('#upload_form').append('<input type="hidden" name="image_name" id="image_name" value="' + data.filepath + '">');
		}
	});
	
	$('.step2').fadeIn(500);
}

function rotating(direction) {
	if (direction == 'cw' || direction == 'ccw') {
		rotate_direction = direction;
	} else {
		rotate_direction = 'cw';
	}
	
	$.ajax({
		url: 'load_img?mode=rotate&direction=' + rotate_direction,
		type: 'POST',
		data: [ $('#x1').serialize(), $('#y1').serialize(), $('#x2').serialize(), $('#y2').serialize(), $('#image_name').serialize() ].join('&'),
		dataType: 'json',
		success: function(json) {
			if (typeof json.error == 'undefined') {
				step2(json)
			} else {
				$('#upload_form .error').html(json.error);
			}
		}
	});
}

/ *if pin and password entered, then next button will be red coloured */
function pinpassfilled()
{
    $(document).ready(function () {
        //var singleValues = $( "#name" ).val();
        var pin = $( "#txtpin" ).val();
        var pass = $( "#txtpass" ).val();
        if(pin!="" || pass!=""){$("#next").css({"background-color": "red", "color":"white"});}
        else{$("#next").css({"background-color": "white", "color": "black"});}

    });
}

function contactfilled(serial)
{
    $(document).ready(function () {

        var person = $( "#txtperson"+serial ).val();
/*        if(person!="")
        {
            $("#txtperson"+serial).css({"border-color":"#66afe9"});
        }
        else{$("#txtperson"+serial).css({"border-color":"#ff0000"});}*/
        var phone = $( "#txtphone"+serial ).val();
        var email = $( "#txtemail"+serial ).val();
        if(person!="" && phone!="" && email!=""){$("#nextcontact").css({"background-color": "red", "color":"white"}); }
        else
        {$("#nextcontact").css({"background-color": "white", "color": "black"});}

    });
}

function drcontactfilled(serial)
{
    $(document).ready(function () {

        var doctorname = $( "#doctorname"+serial ).val();
        var doctorphone = $( "#doctorphone"+serial ).val();
        var doctoremail = $( "#doctoremail"+serial ).val();
        var doctorfax = $( "#doctorfax"+serial ).val();
        var doctoraddress = $( "#doctoraddress"+serial ).val();
        var doctornote = $( "#doctornote"+serial ).val();
        if(doctorname!="" && doctorphone!="" && doctoremail!="" && doctorfax!="" && doctoraddress!="" && doctornote!=""){$("#nextdrcontact").css({"background-color": "red", "color":"white"}); }
        else
        {$("#nextdrcontact").css({"background-color": "white", "color": "black"});}

    });
}
/*Personal Medical Information Form FIll Up*/
function performfil()
{
    $(document).ready(function () {
        $("#nextperformfil").css({"background-color": "red", "color":"white"});

    });
}
/*Medical Information Form Fill Up*/
function medformfil()
{
    $(document).ready(function () {
        $("#nextmedformfill").css({"background-color": "red", "color":"white"});

    });
}
function living_will_color_change()
{
    $(document).ready(function () {
        $("#living_will_color_changes").css({"background-color": "red", "color":"white"});


    });
}

function AutoGrowTextArea(textField)
{
    if (textField.clientHeight < textField.scrollHeight)
    {
        textField.style.height = textField.scrollHeight + "px";
        if (textField.clientHeight < textField.scrollHeight)
        {
            textField.style.height =
                (textField.scrollHeight * 2 - textField.clientHeight) + "px";
        }
    }
} 

$('#txtmedicalsummary').autoResize();
$('#txtmedicines').autoResize();
$('#txtallergies').autoResize();
$('#txtinsurance').autoResize();
$('#txtorgan').autoResize();
$('#med_info_vaccines').autoResize();
$('#txtmedicalinfoafterpin').autoResize();
$('#txthometown').autoResize();
$('#per_inf_nation').autoResize();
$('#txtlanguages').autoResize();
$('#txtreligion').autoResize();
$('#txtotherpersonalinfo').autoResize();
$('#txtpersonalinfoafterpin').autoResize();
$('.mlhdraddress').autoResize();
$('.mlhdrnote').autoResize();

/* Auto Expanding Textarea Box */
/*
$(function() {
    $("[id^='txtmedicalsummary']").flexible();
});
$("[id^='txtmedicalsummary']").trigger('updateHeight');

$(function() {
    $("[id^='txtmedicines']").flexible();
});
$("[id^='txtmedicines']").trigger('updateHeight');

$(function() {
    $("[id^='txtallergies']").flexible();
});
$("[id^='txtallergies']").trigger('updateHeight');

$(function() {
    $("[id^='txtinsurance']").flexible();
});
$("[id^='txtinsurance']").trigger('updateHeight');

$(function() {
    $("[id^='txtorgan']").flexible();
});
$("[id^='txtorgan']").trigger('updateHeight');

$(function() {
    $("[id^='med_info_vaccines']").flexible();
});
$("[id^='med_info_vaccines']").trigger('updateHeight');

$(function() {
    $("[id^='txtmedicalinfoafterpin']").flexible();
});
$("[id^='txtmedicalinfoafterpin']").trigger('updateHeight');

$(function() {
    $("[id^='txtmedicines']").flexible();
});
$("[id^='txtmedicines']").trigger('updateHeight');

$(function() {
    $("[id^='txthometown']").flexible();
});
$("[id^='txthometown']").trigger('updateHeight');

$(function() {
    $("[id^='per_inf_nation']").flexible();
});
$("[id^='per_inf_nation']").trigger('updateHeight');

$(function() {
    $("[id^='txtlanguages']").flexible();
});
$("[id^='txtlanguages']").trigger('updateHeight');

$(function() {
    $("[id^='txtreligion']").flexible();
});
$("[id^='txtreligion']").trigger('updateHeight');

$(function() {
    $("[id^='txtotherpersonalinfo']").flexible();
});
$("[id^='txtotherpersonalinfo']").trigger('updateHeight');

$(function() {
    $("[id^='txtpersonalinfoafterpin']").flexible();
});
$("[id^='txtpersonalinfoafterpin']").trigger('updateHeight');

$(function() {
    $("[class^='mlhdraddress']").flexible();
});
$("[class^='mlhdraddress']").trigger('updateHeight');

$(function() {
    $("[class^='mlhdrnote']").flexible();
});
$("[class^='mlhdrnote']").trigger('updateHeight');
*/