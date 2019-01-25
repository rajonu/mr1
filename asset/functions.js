function isDefined(variable){
  return typeof variable !== 'undefined';
}

/*function beforeAjax(){
  $.blockUI({ 
    css: { 
      border: 'none', 
      padding: '0px', 
      backgroundColor: '#000', 
      '-webkit-border-radius': '5px', 
      '-moz-border-radius': '5px', 
      opacity: .5 
    },
    message: '<img src="' + $("#utilParameters").data('spinner-url') + '" alt="Loading...">'
  });
}*/

function beforeAjax(){
  $.blockUI({
    css: { 
      border: 'none', 
      padding: '10px', 
      color: '#FFF',
      backgroundColor: '#F00', 
      '-webkit-border-radius': '5px', 
      '-moz-border-radius': '5px'
    },
    overlayCSS:  { 
      backgroundColor: '#FFF', 
      opacity: .7
    },
    message: 'Loading...'
  });
}

function fileUploadingAjax(){
  $.blockUI({
    css: { 
      border: 'none', 
      padding: '10px', 
      color: '#FFF',
      backgroundColor: '#F00', 
      '-webkit-border-radius': '5px', 
      '-moz-border-radius': '5px'
    },
    overlayCSS:  { 
      backgroundColor: '#FFF', 
      opacity: .7
    },
    message: 'Loading 0%'
  });
}

// unblock when ajax activity stops 
$(document).ajaxStop($.unblockUI);

/*function ajaxComplete(){
	$.unblockUI();
}*/