var system = function(){
	"use strict";

	return {
		ini:function(){
			
			$(document).ready(function(){
			    $('.tooltipped').tooltip({delay: 50});
			});
			setTimeout(function(){
				system.loading(true);
				$('#content-login').addClass('animated slideInUp');
			},1000);
			login.ini();
		},
		ajax:function(url,data){
	        return $.ajax({
		        type: "POST",
		        url: url,
		        data: {data: data},
		        async: !1,
		        cache:false,
		        error: function() {
		            console.log("Error occured")
		        }
		    });
		},
		html:function(url){
	        return $.ajax({
		        type: "POST",
		        url: url,
                dataType: 'html',
		        async: !1,
		        cache:false,
		        error: function() {
		            console.log("Error occured")
		        }
		    });
		},
		xml:function(url){
	        return $.ajax({
		        type: "POST",
		        url: url,
                dataType: 'xml',
		        async: !1,
		        cache:false
		    });
		},
		send_mail:function(email,subject,message,callback){
			return system.ajax('../assets/harmony/Process.php?send-mail',[email,subject,message]);
		},
		loading: function(_switch){
			if(_switch){ // show loader
				$('#loader-wrapper').addClass('animated zoomOut');
				setTimeout(function(){
					$("#loader-wrapper").addClass("hide-on-med-and-up hide-on-med-and-down");
				},1000);
			}
			else{
				setTimeout(function(){
					$("#loader-wrapper").removeClass("hide-on-med-and-up hide-on-med-and-down");
				},1000);
				$("#loader-wrapper").removeClass("zoomOut");
				$('#loader-wrapper').addClass('animated zoomIn');
			}
		},
		loader: function(_switch){
			if(_switch){ // show loader
				$(".progress").removeClass("hide-on-med-and-up hide-on-med-and-down");
				console.log('x');
			}
			else{
				$(".progress").addClass("hide-on-med-and-up hide-on-med-and-down");
				console.log('x');
			}
		},
		preloader:function(div){
			var data = system.xml("pages.xml");
			$(data.responseText).find("loader").each(function(i,content){
				$(div).html(content);
			});
		},
		block:function(status){
			if(status){
				$("#block-control").addClass('block-content')
			}
			else{
				$("#block-control").removeClass('block-content')
			}
		},
		clearForm:function(){
			$("form").find('input:text, input:password, input:file, select, textarea').val('');
			$("form").find('error').html('');
			$("form").find('input:text, input:password, input:file, select, textarea').removeClass("valid");
		    $("form").find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
		},
        searchJSON: function(obj, key, val) {
		    var objects = [];
		    for (var i in obj) {
		        if (!obj.hasOwnProperty(i)) continue;
		        if (typeof obj[i] == 'object') {
		            objects = objects.concat(this.searchJSON(obj[i], key, val));
		        } else if (i == key && obj[key] == val) {
		            objects.push(obj);
		        }
		    }
		    return objects;
		},
 		forceLogout:function(_function){ //300000
			$(document).idle({
				onIdle: function(){
					Materialize.toast('Force log out initiated.',1000,'',function(){
						_function();						
					});
				},
				idle: 50000000000
			});
		}
	}
}();

login = {
	ini:function(){
	    // login.check();
		login.page();
		login.validate();
	},
	validate:function(){
	    $("#form_login").validate({
	        rules: {
	            field_empID: {required: true,maxlength: 100},
	            field_password: {required: true,maxlength: 50},
	        },
	        errorElement : 'div',
	        errorPlacement: function(error, element) {
				var placement = $(element).data('error');
				if(placement){
					$(placement).append(error)
				} 
				else{
					error.insertAfter(element);
				}
			},
			submitHandler: function (form) {
				var _form = $(form).serializeArray();
				var data = system.ajax('assets/harmony/Process.php?login',_form);
				data.done(function(data){
					data = JSON.parse(data);
					console.log(data);
					if(data[0] == 'Deactivated'){
						Materialize.toast('Account Deactivated.',4000);
					}
					else if(data[0] == 'Active'){
						localStorage.setItem("hash",data[1]);
						Materialize.toast('Success',4000,'',function(){
					    	$(location).attr('href','account/');
						});
					}
					else{
						Materialize.toast('Login Failed.',4000);
					}
				});
	        }
		}); 
	},
	page:function(){
		var documentHeight = $(window).height();
		$(".wrapper.overlap-gradient").attr({"style":"height:"+documentHeight+"px;"}); // margin-top: 5%;

		$(window).resize(function(){
			documentHeight = $(document).height();
			$(".wrapper.overlap-gradient").attr({"style":"height:"+documentHeight+"px;"});
		});
	},
	kill:function(){
		var data = system.ajax('../assets/harmony/Process.php?kill-session',"");
		data.done(function(data){
			console.log(data);
			if(data == 1){
		    	$(location).attr('href','../');			
			}
			else{
				Materialize.toast('Cannot process request.',4000);
				$(".display_loading").html("");
			}
		});
	},
	check:function(){
		var data = system.ajax('../assets/harmony/Process.php?chkUserLogin',"");
		data.done(function(data){
			if(data == 0){
		    	$(location).attr('href','../');							
			}
		});
	},
	market:function(){
	    $("#form_login").validate({
	        rules: {
	            field_empID: {required: true,maxlength: 100},
	            field_password: {required: true,maxlength: 50},
	        },
	        errorElement : 'div',
	        errorPlacement: function(error, element) {
				var placement = $(element).data('error');
				if(placement){
					$(placement).append(error)
				} 
				else{
					error.insertAfter(element);
				}
			},
			submitHandler: function (form) {
				var _form = $(form).serializeArray();
				var data = system.ajax('assets/harmony/Process.php?marketLogin',_form);
				data.done(function(data){
					if(data == "Active"){
						localStorage.setItem("hash",data);
						Materialize.toast('Success.',4000);
				    	$("#display_cart").removeClass("bounceOutUp");
				    	$("#display_login").addClass("bounceOutUp");
				    	$("#display_cart").addClass("bounceInUp");
				    	$("#display_login").parent().addClass('hidden');
				    	market.ini();
					}
					else if(data == "Deactivated"){
						Materialize.toast('Account is deactivated.',4000);
					}
					else{
						Materialize.toast('Login Failed.',4000);
					}
				});
	        }
		}); 
	}
};