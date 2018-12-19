
// grabs ajax info from form tag
var FormSubmitter = function(form, callback) {
	var self = this;
	this.url = form.attr('action');
	this.methodType = form.attr('method');
	
	
	form.submit(function(){
	    var textarea = $(this).find('textarea');
	    var data = self.updateField(textarea);
	    $.ajax({
            type: self.methodType,
            url: self.url,
            data: data,
            dataType : 'json',
            success: function(result) {
                
    			self.fieldUpdated(textarea, result);
    			callback(result);
    		},
    		error: function() {
    		    self.fieldUpdated(textarea, {status:false,errors:'There was an error connecting to the server'}, parent);
    		}
          });
          return false;
	});
}

var proto = FormSubmitter.prototype;


proto.updateField = function(obj) {
    obj = $(obj);
	var self = this, parent = obj.parent(), data = {}, val;
	

    // remove any previous error messages
	parent.find('.error').hide(function(){
	    $(this).remove();
	})

	// get field value
	if(obj.get(0).tagName == "INPUT" && obj.attr('type') == 'checkbox') {
	    val = obj.attr('checked') ? 1 : 0;
	} else {
	    val = obj.val();
	}
	data[obj.attr('name')] = val;
	
	
	self.addSpinner(parent);
	
	return data;
}



proto.fieldUpdated = function(obj, results) {
    parent = $(obj).parent();
	var img = parent.find('img.label_icon');
	if(results.status) {
	    img.attr('src', '/images/accept.png');
	    obj.val('');
	} else {
	    var error = $('<div class="error" style="padding:5px 0; color:#c72525;"></div>').hide();
	    error.text(results.errors);
	    parent.find('label').after(error);
	    error.show();
	    img.remove();
	}
}

proto.addSpinner = function(parent) {
    var spinnerSrc = '/images/ajax-loader.gif';
    var img = parent.find('img.label_icon');
    if (img.length == 0) {
        img = $('<img class="label_icon" src="' + spinnerSrc + '" style="float:left; margin:2px 0 0 -22px" />');
        parent.prepend(img);
    } else {
        img.attr('src', spinnerSrc);
    }
    
}


