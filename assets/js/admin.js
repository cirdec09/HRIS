account = {
	ini:function(){
		this.add();
		this.list();
	},
	management:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addAccount").each(function(i,content){
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');			
		});
	},
	list:function(){
		var content = "";
		var data = system.html('../assets/harmony/Process.php?get-admin');
		data.done(function(data){
			data = JSON.parse(data);
			var profile = (data[0][8] == "")?'avatar.jpg':data[0][8];
			content ="<div class='col s12 m6 l12'>"+
				        "<div id='profile-account' class='card'>"+
				            "<div class='row'>"+
				                "<div class='col s2'>"+
				    "       		<div class='responsive-img activator card-profile-image circle' style='margin-top:15px;'>"+
					"        			<img src='../assets/images/profile/"+profile+"' alt='' class='circle center'>"+
					"        			<a data-cmd='updateEmployeeAccountPicture' data-value='"+profile+"' data-name='"+data[0][1]+"' data-node='"+data[0][0]+"' data-prop='Picture' class='btn waves-effect white-text no-shadow black' style='font-size: 10px;z-index: 1;padding: 0 52px;top:114px;'>Change</a>"+
					"		 		</div>"+
				    " 			</div>"+
				                "<div class='col s10'>"+
				    "		 	<div class='' style='margin-top:20px;'></div>"+
				   	"        			<span class='card-title activator grey-text text-darken-4'>"+data[0][1]+" </span>"+
					"					<a data-cmd='updateAdmin' data-value='"+data[0][1]+"' data-name='"+data[0][1]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update name'>"+
					"						<i class='mdi-editor-mode-edit right black-text'></i>"+
					"					</a>"+
					"		 	<div class='divider'></div>"+
					"		 	<div class='' style='margin-top:20px;'></div>"+
					"        	<span style='display: inline-block;font-size:20px;' class='truncate'><i class='mdi-communication-email cyan-text text-darken-2'></i> Email: "+data[0][5]+"</span>"+
					"				<a data-cmd='updateAdmin' data-value='"+data[0][5]+"' data-name='"+data[0][1]+"' data-node='"+data[0][0]+"' data-prop='Email' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update email'>"+
					"					<i class='mdi-editor-mode-edit right black-text'></i>"+
					"				</a>"+									
					"		 	<div class='divider'></div>"+
					"		 	<div class='' style='margin-top:10px;'></div>"+					
					"        	<span style='display: inline-block;font-size:20px;' class='truncate'><i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Username: "+data[0][2]+"</span>"+
					"				<a data-cmd='updateAdmin' data-value='"+data[0][2]+"' data-name='"+data[0][1]+"' data-node='"+data[0][0]+"' data-prop='Username' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update uaername'>"+
					"					<i class='mdi-editor-mode-edit right black-text'></i>"+
					"				</a>"+
					"		 	<div class='divider'></div>"+
					"		 	<div class='' style='margin-top:10px;'></div>"+
					"        	<span style='display: inline-block;font-size:20px;' class='truncate'><i class='mdi-action-verified-user cyan-text text-darken-2'></i> Password"+"</span>"+
					"				<a data-cmd='updateAdmin' data-name='"+data[0][1]+"' data-node='"+data[0][0]+"' data-prop='Password' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update password'>"+
					"					<i class='mdi-editor-mode-edit right black-text'></i>"+
					"				</a>"+
				
				                "</div>"+
				            "</div>"+
				        "</div>"+
			    	"</div>";
			$("#display_newAdmin").html(content);
		});

		content = "";
		var data = system.html('../assets/harmony/Process.php?get-listAdmin');
		var actions = "", status = "";
		data.done(function(data){
			data = JSON.parse(data);
			$.each(data,function(i,v){
				if(Number(v[6]) == 1){
					status = "Active";
					var actions = "<a data-cmd='deactivateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock-open right black-text'></i>"+
								  "</a>";	
				}
				else{
					status = "Deactivated";
					var actions = "<a data-cmd='activateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock right black-text'></i>"+
								  "</a>";	
				}
				content += "<tr>"+
							"	<td>"+v[1]+"</td>"+
							"	<td>Admin</td>"+
							"	<td>"+status+"</td>"+
							"	<td>"+actions+"</td>"+
							"</tr>";
			})	

			content = "<table class='table bordered'>"+
						"	<tr>"+
						"		<th>Name</th><th>Role</th><th>Status</th><th></th>"+
						"	</tr>"+content+"</table>";
			$("#display_adminList").html(content);

			account.deactivate();
			account.activate();
		});
		account.update();
		account.updatePicture();
	},
	add:function(){
		$("#add_client").on('click',function(){
			var data = system.xml("pages.xml");
			$(data.responseText).find("addAccount").each(function(i,content){
				$("#modal_popUp .modal-content").html(content);
				$('#modal_popUp').openModal('show');			

				$("#form_registerAdmin").validate({
				    rules: {
				        field_name: {required: true,maxlength: 50},
				        field_email: {required: true,maxlength: 50,checkEmail:true},
				        field_username: {required: true,maxlength: 50,checkUsername:true,validateUsername:true},
				        field_password: {required: true,maxlength: 50,checkPassword:true,validatePassword:true},
				        // field_capabilities: {required: true,maxlength: 500},
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
						var data = system.ajax('../assets/harmony/Process.php?set-newAdmin',_form);
						data.done(function(data){
							if(data == 1){
								if(data.responseText != ""){
									system.clearForm();
									Materialize.toast('Saved.',4000);
									App.handleLoadPage("#cmd=index;content=account");
								}
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			});
		});
	},
	update:function(){
		$("a[data-cmd='updateAdmin']").on('click',function(){
			var data = $(this).data();
			console.log(data);

			var content = "<h5>Change "+data.prop+"</h5>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'>"+data.prop+": </label>"+
						  "		<input id='field_"+data.prop+"' value='"+data.value+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm .modal-footer').html("");			

			if(data.prop == "Name"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Name: {required: true,maxlength: 50},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-admin',_form);
							ajax.done(function(ajax){
								if(ajax == 1){
									system.clearForm();
									Materialize.toast('Name updated.',4000);
									$('#modal_confirm').closeModal();	
									App.handleLoadPage("#cmd=index;content=account");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}			
			else if(data.prop == "Email"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-admin',_form);
							ajax.done(function(ajax){
								if(ajax == 1){
									system.clearForm();
									Materialize.toast('Email updated.',4000);
									$('#modal_confirm').closeModal();	
									App.handleLoadPage("#cmd=index;content=account");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}
			else if(data.prop == "Username"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Username: {required: true,maxlength: 50,checkUsername:true,validateUsername:true},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-admin',_form);
							ajax.done(function(ajax){
								if(ajax == 1){
									system.clearForm();
									Materialize.toast('Username updated.',4000);
									$('#modal_confirm').closeModal();	
									App.handleLoadPage("#cmd=index;content=account");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}
			else if(data.prop == "Password"){
				$('#modal_confirm').openModal('show');			
				$("#field_Password").val("");
				$("#field_Password").attr({"type":"password"});
				$("#form_update").append("<p><input type='checkbox' id='showPassword'><label for='showPassword'>Show password</label></p>");

				$("#showPassword").on("click",function(){
					if($(this).is(':checked')){
						$("#field_Password").attr({"type":"text"});						
					}
					else{
						$("#field_Password").attr({"type":"password"});						
					}
				})

				$("#form_update").validate({
				    rules: {
				        field_Password: {required: true,maxlength: 50,checkPassword:true,validatePassword:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-admin',_form);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Password updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=account");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
		});
	},
	updatePicture:function(){
		$("a[data-cmd='updateAdminPicture']").on('click',function(){
			var data = $(this).data();
			console.log(data);

			var picture = "../assets/images/avatar.jpg";
			var content = "<h4>Change "+data.prop+"</h4>"+
  							"	<div class='row'>"+
  							"		<div class='col s12'>"+
							"			<div id='profile_picture2' class='ibox-content no-padding border-left-right '></div>"+
							"		</div>"+
							"	</div>";
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm').removeClass('modal-fixed-footer');			
			$('#modal_confirm .modal-footer').remove();			
			$('#modal_confirm').openModal('show');			

    		var content =   "<div class='image-crop col s12' style='margin-bottom:5px;'>"+
							"	<img width='100%' src='"+picture+"'>"+
							"</div>"+
							"<div class='btn-group col s12'>"+
							"	<label for='inputImage' class='btn blue btn-floating btn-flat tooltipped' data-tooltip='Load image' data-position='top'>"+
							"		<input type='file' accept='image/*' name='file' id='inputImage' class='hide'>"+
							"		<i class='large mdi-editor-publish'></i>"+
							"	</label>"+
							"	<button class='btn blue btn-floating btn-flat tooltipped' data-cmd='cancel' type='button' data-tooltip='Cancel' data-position='top'>"+
							"		<i class='mdi-navigation-close'></i>"+
							"	</button>"+
							"	<button class='btn blue btn-floating btn-flat hidden tooltipped right' data-cmd='save' type='button' data-tooltip='Save' data-position='top'>"+
							"		<i class='mdi-content-save'></i>"+
							"	</button>"+
							"</div>";
    		$("#profile_picture2").html(content);
			$('.tooltipped').tooltip({delay: 50});

            var $inputImage = $("#inputImage");
            var status = true;
            if(window.FileReader){
                $inputImage.change(function() {
                    var fileReader = new FileReader(),
                            files = this.files,
                            file;

                    file = files[0];

                    if (/^image\/\w+$/.test(file.type)) {
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function () {
                            $inputImage.val("");

				            var $image = $(".image-crop > img")
				            $($image).cropper({
				            	aspectRatio: 1/1,
							    autoCropArea: 0.80,
							    preview: ".avatar-preview",
							    built: function () {
			    		    		$(".cropper-container").attr({'style':'left:0px !important;top:0px;width:100%;height:100%;'});

							    	$("button[data-cmd='save']").removeClass('hidden');
							    	$("button[data-cmd='rotate']").removeClass('hidden');
							    	
						            $("button[data-cmd='save']").click(function(){									    	
								    	$(this).html("<i class='mdi-content-save'></i>").addClass('disabled');

								    	console.log("saving...");
								    	if(status){
											var data = system.ajax('../assets/harmony/Process.php?update-adminPicture',["picture",$image.cropper("getDataURL")]); // 
											data.done(function(data){
												console.log(data);
												Materialize.toast('Picture has been changed.',4000);
												system.clearForm();
												App.handleLoadPage("#cmd=index;content=account");
												$('#modal_confirm').closeModal();	
											});
								    		status = false;
								    	}
						            });
							    }
							});

                            $image.cropper("reset", true).cropper("replace", this.result);

				            $("button[data-cmd='rotate']").click(function(){
				            	var data = $(this).data('option');
					        	$image.cropper('rotate', data);
				            });

                        };
                    }
                    else{
                        showMessage("Please choose an image file.");
                    }
                });
            }
            else{
                $inputImage.addClass("hide");
            }	            
            $("button[data-cmd='cancel']").click(function(){
				$('#modal_confirm').closeModal();	
            });
		});
	},
	deactivate:function(){
		$("a[data-cmd='deactivateAdmin']").on('click',function(){
			var id = $(this).data('node');
			var content = "Are you sure DEACTIVATE "+$(this).data('name')+"'s account?<br/>"+
						  "<label for='field_description'>Remarks: </label>"+
						  "<textarea class='materialize-textarea' data-field='field_description' name='field_description'></textarea>";
			$("#modal_confirm .modal-content").html(content);
			$("#modal_confirm .modal-footer").html("<a class='waves-effect waves-red red white-text btn-flat modal-action modal-close'>Cancel</a>"+
												   "<a data-cmd='button_proceed' class='waves-effect waves-grey btn-flat modal-action'>Proceed</a>");
			$('#modal_confirm').openModal('show');			

			$("a[data-cmd='button_proceed']").on("click",function(){
				var remarks = $("textarea[data-field='field_description']").val();
				if(remarks.length == 0){
						Materialize.toast('Remarks is required.',4000);
				}
				else if(remarks.length > 800){
						Materialize.toast('Statement is too long.',4000);
				}
				else{
					var data = system.ajax('../assets/harmony/Process.php?deactivate-admin',[id,remarks]);
					data.done(function(data){
						// console.log(data);
						if(data == 1){
							Materialize.toast('Account deactivaded.',4000);
							system.clearForm();
							App.handleLoadPage("#cmd=index;content=account");
							$('#modal_confirm').closeModal();	
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
				}
			});
		})
	},
	activate:function(){
		$("a[data-cmd='activateAdmin']").on('click',function(){
			var id = $(this).data('node');
			$("#modal_confirm .modal-content").html("Arey you sure ACTIVATE "+$(this).data('name')+"'s account?");
			$("#modal_confirm .modal-footer").html("<a class='waves-effect waves-red red white-text btn-flat modal-action modal-close'>Cancel</a>"+
												   "<a data-cmd='button_proceed' class='waves-effect waves-grey btn-flat modal-action modal-close'>Proceed</a>");
			$('#modal_confirm').openModal('show');			

			$("a[data-cmd='button_proceed']").on("click",function(){
				var data = system.ajax('../assets/harmony/Process.php?activate-admin',id);
				data.done(function(data){
					console.log(data);
					if(data == 1){
						Materialize.toast('Account activaded.',4000);
						system.clearForm();
						App.handleLoadPage("#cmd=index;content=account");
						$('#modal_confirm').closeModal();	
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});
			});
		})
	}
}

client = {
	ini:function(){
		client.list();
		client.add();
	},
	get:function(){
		var data = system.html('../assets/harmony/Process.php?get-clients');
		return data;
	},
	list:function(){
		var content = "", search;
		var data = client.get();
		data = JSON.parse(data.responseText);
		if(data.length>0){			
			var getEmployee = system.ajax('../assets/harmony/Process.php?get-allEmployeeCount',"");
			getEmployee = JSON.parse(getEmployee.responseText);
			$.each(data,function(i,v){
				search = system.searchJSON(getEmployee,1,v[0]);
				search = (search.length > 0)?search[0][0]:0;
				// var logo = (v[7] == "")?'avatar.jpg':v[7];
				content += "<tr>"+
							"	<td width='1px'>"+(i+1)+". </td>"+
							"	<td width='400px'>"+v[1]+"</td>"+
							"	<td>"+search+"</td>"+
							"	<td width='10px'>Active</td>"+
							"	<td width='1px'>"+
							"		<a data-cmd='update' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Show'>"+
							"			<i class='mdi-navigation-more-vert right black-text'></i>"+
							"		</a>"+
							"	</td>"+
							"</tr>";
			})	

			content = "<table class='table bordered' id='products'>"+
						"<thead>"+
						"	<tr>"+
						"		<th>#</th><th>Department</th><th>Number of Employees</th><th>Status</th><th></th>"+
						"	</tr>"+
						"</thead>"+
						"</tbody>"+
							content+
						"</tbody>"+
						"</table>";
			$("#display_clientList").html(content);

			var table = $('#products').DataTable({
		        "order": [[ 0, 'asc' ]],
		        bLengthChange: false,
		        iDisplayLength: -1,
		        "drawCallback": function ( settings ) {
		            var api = this.api();
		            var rows = api.rows( {page:'current'} ).nodes();
		            var last=null;
		        }
		    });

			$('.dataTable').on('click', 'tbody tr', function() {
				var data = table.row(this).data();
				data = $.parseHTML(data[4]);
				// console.log(data[0].dataset.node);
				data = data[0].dataset.node;
		    	$(location).attr('href','#cmd=index;content=focusClient;'+data);			
			});
		}
		else{
			$("#display_clientList").html("<h5 class='center'>No Clients to show.</h5>");
		}
	},
	listGrid:function(){
		var data = system.xml("pages.xml");
		var _content = "";
		$(data.responseText).find("product").each(function(i,content){
			for(x=0;x<=100;x++){
				_content += content.innerHTML;
			}
			$("#products").html(_content);
		});
	},
	add:function(){
		$("#add_client").on('click',function(){
			var data = system.xml("pages.xml");
			$(data.responseText).find("addClient").each(function(i,content){
				$("#modal_popUp .modal-content").html(content);
				$('#modal_popUp').openModal('show');		

				$("#field_password").on('focus',function(){
					$("#note_password").removeClass('zoomOut hidden').addClass("zoomIn");
				}).on('blur',function(){
					$("#note_password").removeClass('zoomIn').addClass('zoomOut hidden');
				})

				$("#form_addClient").validate({
				    rules: {
				        field_name: {required: true,maxlength: 50},
				        field_phone: {maxlength: 50},
				        field_email: {maxlength: 50,checkEmail:true},
				        field_address: {maxlength: 50},
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
						var data = system.ajax('../assets/harmony/Process.php?set-newClient',_form);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								if(data.responseText != ""){
									Materialize.toast('Saved.',4000);
									system.clearForm();
									App.handleLoadPage("#cmd=index;content=clients");
								}
							}
							else{
								Materialize.toast('Cannot process request.',4000);								
							}
						});
				    }
				});
			});
		})
	},
	companyProfile(data){
		data = data[0];
		if(Number(data[5]) == 1){
			status = "Active";
			var actions = "<a data-cmd='deactivateEmployer' data-name='"+data[1]+"' data-node='"+data[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
						  "	<i class='mdi-action-lock-open right black-text'></i>"+
						  "</a>";	
		}
		else{
			status = "Deactivated";
			var actions = "<a data-cmd='activateEmployer' data-name='"+data[1]+"' data-node='"+data[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
						  "	<i class='mdi-action-lock right black-text'></i>"+
						  "</a>";	
		}

		var profile = ((data[7] == "") || data[7] == null)?"avatar.jpg":data[7];

		content = "<div id='profile-card' class='card'>"+
				"    <div class='card-content'>"+
				"        <span class='card-title activator grey-text text-darken-4'>"+data[1]+" </span>"+
				"			<a data-cmd='updateCompany' data-value='"+data[1]+"' data-name='"+data[1]+"' data-node='"+data[0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update account'>"+
				"				<i class='mdi-editor-mode-edit right black-text'></i>"+
				"			</a>"+
				"		 <div class='divider'></div>"+
				"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Phone: "+data[4]+"</span>"+
				"			<a data-cmd='updateCompany' data-value='"+data[4]+"' data-name='"+data[1]+"' data-node='"+data[0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>"+
				"				<i class='mdi-editor-mode-edit right black-text'></i>"+
				"			</a>"+
				"		 </p>"+
				"		 <div class='divider'></div>"+
				"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-communication-email cyan-text text-darken-2'></i> Email: "+data[3]+"</span>"+
				"			<a data-cmd='updateCompany' data-value='"+data[3]+"' data-name='"+data[1]+"' data-node='"+data[0]+"' data-prop='Email' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update email'>"+
				"				<i class='mdi-editor-mode-edit right black-text'></i>"+
				"			</a>"+
				"		 </p>"+
				"		 <div class='divider'></div>"+
				"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-room cyan-text text-darken-2'></i> Address: "+data[2]+"</span>"+
				"			<a data-cmd='updateCompany' data-value='"+data[2]+"' data-name='"+data[1]+"' data-node='"+data[0]+"' data-prop='Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update address'>"+
				"				<i class='mdi-editor-mode-edit right black-text'></i>"+
				"			</a>"+
				"		 </p>"+
				"    </div>"+
				"</div>";
		$("#companyProfile").html(content);	
	},
	details:function(id){
		// client.getConfirm(id);
		var _this = this;
		var content = "";
		var getEmployer = system.ajax('../assets/harmony/Process.php?get-clientDetails',id);
		getEmployer.done(function(data_getEmployer){
			data_getEmployer = JSON.parse(data_getEmployer);

			var getEmployer = system.ajax('../assets/harmony/Process.php?get-employerByID',id);
			getEmployer = JSON.parse(getEmployer.responseText);

			var getEmployees = system.ajax('../assets/harmony/Process.php?get-employeeByID',id);
			getEmployees = JSON.parse(getEmployees.responseText);

			_this.companyProfile(data_getEmployer);
			// _this.accountProfile(getEmployer);

			if(getEmployees.length > 0){
				employee.list(id);
			}
			else{
				$("#employees").html("<div class='col s12 center'>No employees yet</div>");
			}
		});

		$("a[data-cmd='add_employee']").on('click',function(){
			employee.add(id);
		});

		$("#options a[data-cmd='bulk_upload']").on('click',function(){
	    	employee.addChild(id);			
		});

		$("#options a[data-cmd='points_upload']").on('click',function(){
	    	$(location).attr('href','#cmd=index;content=upload_points;'+id);			
		});

		_this.deactivate();
		_this.activate();
		_this.update();
		// _this.updatePicture();
	},
	update:function(){
		$("a[data-cmd='updateEmployer']").on('click',function(){
			var data = $(this).data();
			var id = data.node;

			var content = "<h5>Change "+data.prop+"</h5>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'>"+data.prop+": </label>"+
						  "		<input id='field_"+data.prop+"' value='"+data.value+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm .modal-footer').html("");			

			if(data.prop == "Name"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Name: {required: true,maxlength: 50},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the product name.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-employer',[id,_form]);
							ajax.done(function(ajax){
								console.log(ajax);
								if(ajax == 1){
									system.clearForm();
									Materialize.toast('Name updated.',4000);
									$('#modal_confirm').closeModal();	
									App.handleLoadPage("#cmd=index;content=focusClient");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}			
			else if(data.prop == "Phone"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Name: {required: true,maxlength: 50},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-employer',[id,_form]);
							ajax.done(function(ajax){
								if(ajax == 1){
									system.clearForm();
									Materialize.toast('Phone updated.',4000);
									$('#modal_confirm').closeModal();	
									App.handleLoadPage("#cmd=index;content=focusClient");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}			
			else if(data.prop == "Email"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-employer',[id,_form]);
							ajax.done(function(ajax){
								if(ajax == 1){
									system.clearForm();
									Materialize.toast('Email updated.',4000);
									$('#modal_confirm').closeModal();	
									App.handleLoadPage("#cmd=index;content=focusClient");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}
			else if(data.prop == "Address"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-employer',[id,_form]);
							ajax.done(function(ajax){
								if(ajax == 1){
									system.clearForm();
									Materialize.toast('Address updated.',4000);
									$('#modal_confirm').closeModal();	
									App.handleLoadPage("#cmd=index;content=focusClient");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}
			else if(data.prop == "Username"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Username: {required: true,maxlength: 50,checkUsername:true,validateUsername:true},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-employer',[id,_form]);
							ajax.done(function(ajax){
								if(ajax == 1){
									system.clearForm();
									Materialize.toast('Username updated.',4000);
									$('#modal_confirm').closeModal();	
									App.handleLoadPage("#cmd=index;content=focusClient");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}
			else if(data.prop == "Password"){
				$('#modal_confirm').openModal('show');			
				$("#field_Password").attr({"type":"password"});
				$("#form_update").append("<p><input type='checkbox' id='showPassword'><label for='showPassword'>Show password</label></p>");

				$("#showPassword").on("click",function(){
					if($(this).is(':checked')){
						$("#field_Password").attr({"type":"text"});						
					}
					else{
						$("#field_Password").attr({"type":"password"});						
					}
				})

				$("#form_update").validate({
				    rules: {
				        field_Password: {required: true,maxlength: 50,checkPassword:true,validatePassword:true},
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
						var ajax = system.ajax('../assets/harmony/Process.php?update-employer',[id,_form]);
						ajax.done(function(ajax){
							if(ajax == 1){
								system.clearForm();
								Materialize.toast('Password updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusClient");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
		});

		$("a[data-cmd='updateCompany']").on('click',function(){
			var data = $(this).data();
			var id = data.node;

			var content = "<h5>Change "+data.prop+"</h5>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'>"+data.prop+": </label>"+
						  "		<input id='field_"+data.prop+"' value='"+data.value+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm .modal-footer').html("");			

			if(data.prop == "Name"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Name: {required: true,maxlength: 50},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-company',[id,_form]);
							ajax.done(function(ajax){
								console.log(ajax);
								if(ajax == 1){
									system.clearForm();
									Materialize.toast('Name updated.',4000);
									$('#modal_confirm').closeModal();	
									App.handleLoadPage("#cmd=index;content=focusClient");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}			
			else if(data.prop == "Phone"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Name: {required: true,maxlength: 50},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-company',[id,_form]);
							ajax.done(function(ajax){
								if(ajax == 1){
									system.clearForm();
									Materialize.toast('Phone updated.',4000);
									$('#modal_confirm').closeModal();	
									App.handleLoadPage("#cmd=index;content=focusClient");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}			
			else if(data.prop == "Email"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-company',[id,_form]);
							ajax.done(function(ajax){
								if(ajax == 1){
									system.clearForm();
									Materialize.toast('Email updated.',4000);
									$('#modal_confirm').closeModal();	
									App.handleLoadPage("#cmd=index;content=focusClient");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}
			else if(data.prop == "Address"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Address: {required: true,maxlength: 100},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-company',[id,_form]);
							ajax.done(function(ajax){
								console.log(ajax);
								if(ajax == 1){
									system.clearForm();
									Materialize.toast('Address updated.',4000);
									$('#modal_confirm').closeModal();	
									App.handleLoadPage("#cmd=index;content=focusClient");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}
		});
	},
	updatePicture:function(){
		$("a[data-cmd='updateEmployerPicture']").on('click',function(){
			var data = $(this).data();
			console.log(data);
			var id = data.node;
			var picture = "../assets/images/profile/avatar.jpg";
			var content = "<h4>Change "+data.prop+"</h4>"+
  							"	<div class='row'>"+
  							"		<div class='col s12'>"+
							"			<div id='profile_picture2' class='ibox-content no-padding border-left-right '></div>"+
							"		</div>"+
							"	</div>";
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm').removeClass('modal-fixed-footer');			
			$('#modal_confirm .modal-footer').remove();			
			$('#modal_confirm').openModal('show');			

    		var content =   "<div class='image-crop col s12' style='margin-bottom:5px;'>"+
							"	<img width='100%' src='"+picture+"'>"+
							"</div>"+
							"<div class='btn-group col s12'>"+
							"	<label for='inputImage' class='btn blue btn-floating btn-flat tooltipped' data-tooltip='Load image' data-position='top'>"+
							"		<input type='file' accept='image/*' name='file' id='inputImage' class='hide'>"+
							"		<i class='large mdi-editor-publish'></i>"+
							"	</label>"+
							"	<button class='btn blue btn-floating btn-flat tooltipped' data-cmd='cancel' type='button' data-tooltip='Cancel' data-position='top'>"+
							"		<i class='mdi-navigation-close'></i>"+
							"	</button>"+
							"	<button class='btn blue btn-floating btn-flat hidden tooltipped right' data-cmd='save' type='button' data-tooltip='Save' data-position='top'>"+
							"		<i class='mdi-content-save'></i>"+
							"	</button>"+
							"</div>";
    		$("#profile_picture2").html(content);
			$('.tooltipped').tooltip({delay: 50});

            var $inputImage = $("#inputImage");
            var status = true;
            if(window.FileReader){
                $inputImage.change(function() {
                    var fileReader = new FileReader(),
                            files = this.files,
                            file;

                    file = files[0];

                    if (/^image\/\w+$/.test(file.type)) {
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function () {
                            $inputImage.val("");

				            var $image = $(".image-crop > img")
				            $($image).cropper({
				            	aspectRatio: 1/1,
							    autoCropArea: 0.80,
							    preview: ".avatar-preview",
							    built: function () {
			    		    		$(".cropper-container").attr({'style':'left:0px !important;top:0px;width:100%;height:100%;'});

							    	$("button[data-cmd='save']").removeClass('hidden');
							    	$("button[data-cmd='rotate']").removeClass('hidden');
							    	
						            $("button[data-cmd='save']").click(function(){									    	
								    	$(this).html("<i class='mdi-action-cached icon-spin'></i>").addClass('disabled');
								    	if(status){
											var data = system.ajax('../assets/harmony/Process.php?update-employerPicture',[id,$image.cropper("getDataURL")]); // 
											data.done(function(data){
												Materialize.toast('Picture has been changed.',4000);
												system.clearForm();
												App.handleLoadPage("#cmd=index;content=focusClient;"+id);
												$('#modal_confirm').closeModal();	
											});
								    		status = false;
								    	}
						            });
							    }
							});

                            $image.cropper("reset", true).cropper("replace", this.result);

				            $("button[data-cmd='rotate']").click(function(){
				            	var data = $(this).data('option');
					        	$image.cropper('rotate', data);
				            });

                        };
                    }
                    else{
                        showMessage("Please choose an image file.");
                    }
                });
            }
            else{
                $inputImage.addClass("hide");
            }	            
            $("button[data-cmd='cancel']").click(function(){
				$('#modal_confirm').closeModal();	
            });
		});

		$("a[data-cmd='updateCompanyLogo']").on('click',function(){
			var data = $(this).data();
			console.log(data);
			var id = data.node;
			var picture = "../assets/images/profile/avatar.jpg";
			var content = "<h4>Change "+data.prop+"</h4>"+
  							"	<div class='row'>"+
  							"		<div class='col s12'>"+
							"			<div id='profile_picture2' class='ibox-content no-padding border-left-right '></div>"+
							"		</div>"+
							"	</div>";
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm').removeClass('modal-fixed-footer');			
			$('#modal_confirm .modal-footer').remove();			
			$('#modal_confirm').openModal('show');			

    		var content =   "<div class='image-crop col s12' style='margin-bottom:5px;'>"+
							"	<img width='100%' src='"+picture+"'>"+
							"</div>"+
							"<div class='btn-group col s12'>"+
							"	<label for='inputImage' class='btn blue btn-floating btn-flat tooltipped' data-tooltip='Load image' data-position='top'>"+
							"		<input type='file' accept='image/*' name='file' id='inputImage' class='hide'>"+
							"		<i class='large mdi-editor-publish'></i>"+
							"	</label>"+
							"	<button class='btn blue btn-floating btn-flat tooltipped' data-cmd='cancel' type='button' data-tooltip='Cancel' data-position='top'>"+
							"		<i class='mdi-navigation-close'></i>"+
							"	</button>"+
							"	<button class='btn blue btn-floating btn-flat hidden tooltipped right' data-cmd='save' type='button' data-tooltip='Save' data-position='top'>"+
							"		<i class='mdi-content-save'></i>"+
							"	</button>"+
							"</div>";
    		$("#profile_picture2").html(content);
			$('.tooltipped').tooltip({delay: 50});

            var $inputImage = $("#inputImage");
            var status = true;
            if(window.FileReader){
                $inputImage.change(function() {
                    var fileReader = new FileReader(),
                            files = this.files,
                            file;

                    file = files[0];

                    if (/^image\/\w+$/.test(file.type)) {
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function () {
                            $inputImage.val("");

				            var $image = $(".image-crop > img")
				            $($image).cropper({
				            	aspectRatio: 1/1,
							    autoCropArea: 0.80,
							    preview: ".avatar-preview",
							    built: function () {
			    		    		$(".cropper-container").attr({'style':'left:0px !important;top:0px;width:100%;height:100%;'});

							    	$("button[data-cmd='save']").removeClass('hidden');
							    	$("button[data-cmd='rotate']").removeClass('hidden');
							    	
						            $("button[data-cmd='save']").click(function(){									    	
								    	$(this).html("<i class='mdi-action-cached icon-spin'></i>").addClass('disabled');
								    	if(status){
											var data = system.ajax('../assets/harmony/Process.php?update-employerCompanyLogo',[id,$image.cropper("getDataURL")]); // 
											data.done(function(data){
												Materialize.toast('Picture has been changed.',4000);
												system.clearForm();
												App.handleLoadPage("#cmd=index;content=focusClient;"+id);
												$('#modal_confirm').closeModal();	
											});
								    		status = false;
								    	}
						            });
							    }
							});

                            $image.cropper("reset", true).cropper("replace", this.result);

				            $("button[data-cmd='rotate']").click(function(){
				            	var data = $(this).data('option');
					        	$image.cropper('rotate', data);
				            });

                        };
                    }
                    else{
                        showMessage("Please choose an image file.");
                    }
                });
            }
            else{
                $inputImage.addClass("hide");
            }	            
            $("button[data-cmd='cancel']").click(function(){
				$('#modal_confirm').closeModal();	
            });
		});
	},
	deactivate:function(){
		$("a[data-cmd='deactivateEmployer']").on('click',function(){
			var id = $(this).data('node');
			var content = "Arey you sure DEACTIVATE "+$(this).data('name')+"'s account?<br/>"+
						  "<label for='field_description'>Remarks: </label>"+
						  "<textarea class='materialize-textarea' data-field='field_description' name='field_description'></textarea>";
			$("#modal_confirm .modal-content").html(content);
			$("#modal_confirm .modal-footer").html("<a class='waves-effect waves-red red white-text btn-flat modal-action modal-close'>Cancel</a>"+
												   "<a data-cmd='button_proceed' class='waves-effect waves-grey btn-flat modal-action'>Proceed</a>");
			$('#modal_confirm').openModal('show');			

			$("a[data-cmd='button_proceed']").on("click",function(){
				var remarks = $("textarea[data-field='field_description']").val();
				if(remarks.length == 0){
						Materialize.toast('Remarks is required.',4000);
				}
				else if(remarks.length > 800){
						Materialize.toast('Statement is too long.',4000);
				}
				else{
					var data = system.ajax('../assets/harmony/Process.php?deactivate-employer',[id,remarks]);
					data.done(function(data){
						console.log(data);
						if(data == 1){
							Materialize.toast('Account deactivaded.',4000);
							system.clearForm();
							App.handleLoadPage("#cmd=index;content=focusClient");
							$('#modal_confirm').closeModal();	
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
				}
			});
		})
	},
	activate:function(){
		$("a[data-cmd='activateEmployer']").on('click',function(){
			var id = $(this).data('node');
			$("#modal_confirm .modal-content").html("Arey you sure ACTIVATE "+$(this).data('name')+"'s account?");
			$("#modal_confirm .modal-footer").html("<a class='waves-effect waves-red red white-text btn-flat modal-action modal-close'>Cancel</a>"+
												   "<a data-cmd='button_proceed' class='waves-effect waves-grey btn-flat modal-action modal-close'>Proceed</a>");
			$('#modal_confirm').openModal('show');			

			$("a[data-cmd='button_proceed']").on("click",function(){
				var data = system.ajax('../assets/harmony/Process.php?activate-employer',id);
				data.done(function(data){
					if(data == 1){
						Materialize.toast('Account activaded.',4000);
						system.clearForm();
						App.handleLoadPage("#cmd=index;content=focusClient");
						$('#modal_confirm').closeModal();	
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});
			});
		})
	},
	view:function(id){
		var content = "";
		var getEmployee = system.ajax('../assets/harmony/Process.php?get-searchByEmployeeID',id);
		getEmployee.done(function(data){
			data = JSON.parse(data);
			var profile = (data[0][14] == "")?"avatar.jpg":data[0][14];
			var position = ((data[0][4] == "") || data[0][4] == null)?"Not assigned":data[0][4];
			var address = ((data[0][13] == "") || data[0][13] == null)?"Not assigned":data[0][13];
			var contactNumber = ((data[0][11] == "") || data[0][11] == null)?"Not assigned":data[0][11];

			content = "<div class='row'>"+
					"<div class=''>"+
					"	<div class='col s3 m2 l2'>"+
					"		<img src='../assets/images/avatar.jpg' alt='Employee logo' class='circle center responsive-img valign profile-image'>"+
					"	</div>"+
					"	<div class='col s9 m10 l10'>"+
					"		<ul class='collection with-header'>"+
					"			<li class='collection-header'>"+
					"				<h4>"+data[0][6]+" "+data[0][5]+" <small>"+data[0][1]+"</small></h4>"+
					"			</li>"+
					"			<li class='collection-item'>"+
					"        		<div><i class='mdi-action-perm-identity cyan-text text-darken-2'></i> "+position+"</div>"+
					"			</li>"+
					"			<li class='collection-item'>"+
					"        		<div><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> "+contactNumber+"</div>"+
					"			</li>"+
					"			<li class='collection-item'>"+
					"        		<div><i class='mdi-communication-email cyan-text text-darken-2'></i> "+data[0][12]+"</div>"+
					"			</li>"+
					"			<li class='collection-item'>"+
					"        		<div><i class='mdi-action-room cyan-text text-darken-2'></i> "+address+"</div>"+
					"			</li>"+
					"			<li class='collection-item'>"+
					"        		<div><i class='mdi-social-cake cyan-text text-darken-2'></i> "+data[0][10]+"</div>"+
					"			</li>"+
					"		</ul>"+
					"	</div>";
			$("#modal_popUp .modal-content").html(content);
			$('#modal_popUp').openModal('show');			
		});
	},	
	sendAccount:function(count){
		// system.send_mail('rufo.gabrillo@gmail.com','Testing email capability','Test test');
		var loop = 0;
		do{
			loop++;
			console.log(loop);
			var data = system.send_mail('rufo.gabrillo@gmail.com','Testing email capability','Test test');
			console.log();
		}
		while(count<10);
	},
	getConfirmCount:function(id){
		var value = 0;
		var data = system.ajax('../assets/harmony/Process.php?get-confirmStatus',id);
		data.done(function(data){
			value = data;
		});
		return value;
	},
	sendConfirm:function(id){
		var data = system.ajax('../assets/harmony/Process.php?get-confirmAccountStatus',id);
		data.done(function(data){
			// console.log(data);
			if(data <= 0){
				location.reload(true);
			}
			else{
				client.getConfirm(id);
			}
		}).fail(function(data){
			// console.log(data);
			Materialize.toast('Sending account confirmation will resume in less than a minute.',30000,'',function(){
				location.reload(true);
			});
		});
	}
}

employee = {
	get:function(){
		var data = system.html('../assets/harmony/Process.php?get-employee');
		return data;
	},
	add:function(id){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addEmployee").each(function(i,content){
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addEmployee").validate({
			    rules: {
			  //   	field_fname: {required: true,maxlength: 50},
			  //       field_gname: {required: true,maxlength: 50},
			  //       field_mname: {required: true,maxlength: 50},			        
			  //       field_nickname: {required: true,maxlength: 50},
			  //       field_dob: {required: true,maxlength: 50,checkDate:true},
			  //       field_gender: {required: true,maxlength: 50},
			  //       field_phone: {required: true,maxlength: 50},
			  //       // field_email: {required: true,maxlength: 100,checkEmail:true},
			  //       field_cstatus: {required: true,maxlength: 50},
			  //       field_citizenship: {required: true,maxlength: 30},
			  //       field_height: {required: true,maxlength: 30},
			  //       field_weight: {required: true,maxlength: 5},
			  //       field_btype: {required: true,maxlength: 30},
			  //       field_gsis: {required: true,maxlength: 20},
			  //       field_r_address: {required: true,maxlength: 50},
			  //       field_r_zipcode: {required: true,maxlength: 50},
			  //       field_r_tele: {required: true,maxlength: 50},
					// field_f_surename: {required: true,maxlength: 50},
					// field_f_firstname: {required: true,maxlength: 50},
					// field_f_middlename: {required: true,maxlength: 50},
					// field_m_surename: {required: true,maxlength: 50},
					// field_m_firstname: {required: true,maxlength: 50},
					// field_m_middlename: {required: true,maxlength: 50},
			  //       field_position: {required: true,maxlength: 50,},
			  //       field_employeeID: {required: true,maxlength: 50,validateEmployeeID:true},
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
					var data = system.ajax('../assets/harmony/Process.php?set-newEmployee',[_form,id]);
					data.done(function(data){
						console.log(data);
						if(data == 0){
							console.log(data);
							Materialize.toast('Cannot process request.',4000);
						}
						else{
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
								localStorage.setItem('id',data);
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=focusClient;"+id);
						    	employee.addFamily(id);			
							}
						}
					});
			    }
			});
		});
		$("i[data-cmd='exit_personal']").on('click',function(){
			$('#modal').closeModal();
			$("#modal .modal-content").html("");
		});
	},
	addFamily:function(id){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addFamily").each(function(i,content){
			console.log("Family_Background");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addFamily").validate({
			    rules: {
			    	field_f_surename: {required: true,maxlength: 50},
			    	field_f_firstname: {required: true,maxlength: 50},
			    	field_f_middlename: {required: true,maxlength: 50},
			    	field_m_surename: {required: true,maxlength: 50},
			    	field_m_firstname: {required: true,maxlength: 50},
			    	field_m_middlename: {required: true,maxlength: 50},
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
					var me = localStorage.getItem('id');
					var data = system.ajax('../assets/harmony/Process.php?set-newFamily',[_form,me]);
					data.done(function(data){
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
								employee.addChild(id);
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=focusClient;"+id);			
							}
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
			    }
			});
		});
		$("i[data-cmd='exit_personal']").on('click',function(){
			$('#modal').closeModal();
			$("#modal .modal-content").html("");
			$('.lean-overlay').remove();
		});
	},
	addChild:function(id){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addAnak").each(function(i,content){
			console.log("Child_Background");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addAnak").validate({
			    rules: {
			    	field_child: {maxlength: 50},
			    	field_child_dob: {maxlength: 50,checkDate:true},
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
					var me = localStorage.getItem('id');
					console.log(me);
					var data = system.ajax('../assets/harmony/Process.php?set-newChild',[_form,me]);
					data.done(function(data){
						console.log(_form);
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=focusClient;"+id);			
							}
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
			    }
			});
		});
		$("i[data-cmd='exit_personal']").on('click',function(){
			$('#modal').closeModal();
			$("#modal .modal-content").html("");
			$('.lean-overlay').remove();
		});
		$("a[data-cmd='add_education']").on('click',function(){
			employee.addEducation(id);
		});
	},
	addEducation:function(id){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addEducation").each(function(i,content){
			console.log("Educational_Background");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addEducation").validate({
			    rules: {
			    	field_e_name: {maxlength: 50},
			    	field_e_grades: {maxlength: 50},
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
					var me = localStorage.getItem('id');
					console.log(me);
					var data = system.ajax('../assets/harmony/Process.php?set-newEducation',[_form,me]);
					data.done(function(data){
						console.log(_form);
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
								employee.addCollege(id);
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=focusClient;"+id);			
							}
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
			    }
			});
		});
		$("i[data-cmd='exit_personal']").on('click',function(){
			$('#modal').closeModal();
			$("#modal .modal-content").html("");
			$('.lean-overlay').remove();
		});
	},
	addCollege:function(id){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addCollege").each(function(i,content){
			console.log("Educational_Background");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addCollege").validate({
			    rules: {
			    	field_e_name: {maxlength: 50},
			    	field_e_grades: {maxlength: 50},
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
					var me = localStorage.getItem('id');
					console.log(me);
					var data = system.ajax('../assets/harmony/Process.php?set-newCollege',[_form,me]);
					data.done(function(data){
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=focusClient;"+id);			
							}
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
			    }
			});
		});
		$("i[data-cmd='exit_personal']").on('click',function(){
			$('#modal').closeModal();
			$("#modal .modal-content").html("");
			$('.lean-overlay').remove();
		});
		$("a[data-cmd='add_graduate']").on('click',function(){
			employee.addGraduate(id);
		});
	},
	addGraduate:function(id){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addGraduate").each(function(i,content){
			console.log("Educational_Background");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addGraduate").validate({
			    rules: {
			    	field_e_name: {maxlength: 50},
			    	field_e_grades: {maxlength: 50},
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
					var me = localStorage.getItem('id');
					console.log(me);
					var data = system.ajax('../assets/harmony/Process.php?set-newGraduate',[_form,me]);
					data.done(function(data){
						console.log(_form);
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=focusClient;"+id);			
							}
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
			    }
			});
		});
		$("i[data-cmd='exit_personal']").on('click',function(){
			$('#modal').closeModal();
			$("#modal .modal-content").html("");
			$('.lean-overlay').remove();
		});
		$("a[data-cmd='add_civil']").on('click',function(){
			employee.addCivil(id);
		});
	},
	addCivil:function(id){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addCivilService").each(function(i,content){
			console.log("Civil Service Elegibility");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addCivil").validate({
			    rules: {
			    	field_e_name: {maxlength: 50},
			    	field_e_grades: {maxlength: 50},
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
					var me = localStorage.getItem('id');
					console.log(me);
					var data = system.ajax('../assets/harmony/Process.php?set-newCivilService',[_form,me]);
					data.done(function(data){
						console.log(_form);
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=focusClient;"+id);			
							}
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
			    }
			});
		});
		$("i[data-cmd='exit_personal']").on('click',function(){
			$('#modal').closeModal();
			$("#modal .modal-content").html("");
			$('.lean-overlay').remove();
		});
		$("a[data-cmd='add_work']").on('click',function(){
			employee.addWork(id);
		});
	},
	addWork:function(id){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addWork").each(function(i,content){
			console.log("Work Experience");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addWork").validate({
			    rules: {
			    	field_e_name: {maxlength: 50},
			    	field_e_grades: {maxlength: 50},
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
					var me = localStorage.getItem('id');
					console.log(me);
					var data = system.ajax('../assets/harmony/Process.php?set-newWork',[_form,me]);
					data.done(function(data){
						console.log(_form);
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=focusClient;"+id);			
							}
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
			    }
			});
		});
		$("i[data-cmd='exit_personal']").on('click',function(){
			$('#modal').closeModal();
			$("#modal .modal-content").html("");
			$('.lean-overlay').remove();
		});
		$("a[data-cmd='add_voluntary']").on('click',function(){
			employee.addVoluntary(id);
		});
	},
	addVoluntary:function(id){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addVoluntary").each(function(i,content){
			console.log("Voluntary Work");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addVoluntary").validate({
			    rules: {
			    	field_e_name: {maxlength: 50},
			    	field_e_grades: {maxlength: 50},
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
					var me = localStorage.getItem('id');
					console.log(me);
					var data = system.ajax('../assets/harmony/Process.php?set-newVoluntary',[_form,me]);
					data.done(function(data){
						console.log(_form);
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=focusClient;"+id);			
							}
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
			    }
			});
		});
		$("i[data-cmd='exit_personal']").on('click',function(){
			$('#modal').closeModal();
			$("#modal .modal-content").html("");
			$('.lean-overlay').remove();
		});
		$("a[data-cmd='add_training']").on('click',function(){
			employee.addTraining(id);
		});
	},
	addTraining:function(id){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addTraining").each(function(i,content){
			console.log("Voluntary Work");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addTraining").validate({
			    rules: {
			    	field_e_name: {maxlength: 50},
			    	field_e_grades: {maxlength: 50},
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
					var me = localStorage.getItem('id');
					console.log(me);
					var data = system.ajax('../assets/harmony/Process.php?set-newTraining',[_form,me]);
					data.done(function(data){
						console.log(_form);
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=focusClient;"+id);			
							}
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
			    }
			});
		});
		$("i[data-cmd='exit_personal']").on('click',function(){
			$('#modal').closeModal();
			$("#modal .modal-content").html("");
			$('.lean-overlay').remove();
		});
		$("a[data-cmd='add_other']").on('click',function(){
			employee.addOther(id);
		});
	},
	addOther:function(id){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addOther").each(function(i,content){
			console.log("Other Skills");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addOther").validate({
			    rules: {
			    	field_e_name: {maxlength: 50},
			    	field_e_grades: {maxlength: 50},
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
					var me = localStorage.getItem('id');
					console.log(me);
					var data = system.ajax('../assets/harmony/Process.php?set-newOther',[_form,me]);
					data.done(function(data){
						console.log(_form);
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=focusClient;"+id);			
							}
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
			    }
			});
		});
		$("i[data-cmd='exit_personal']").on('click',function(){
			localStorage.removeItem('id');
			$('#modal').closeModal();
			$("#modal .modal-content").html("");
			$('.lean-overlay').remove();
		});
	},
	list:function(id){
		var data = system.ajax('../assets/harmony/Process.php?get-employeeByID',id);
		data = JSON.parse(data.responseText);
		var content = "", actions = "";
		$.each(data,function(i,v){
			var profile = ((v[10] == "") || (v[10] == null))?'avatar.jpg':v[10];
			if(Number(v[12]) == 1){
				actions = "<i class='mdi-action-lock-open right black-text' data-position='left' data-delay='50' data-tooltip='Active'></i>";	
			}
			else{
				actions = "<i class='mdi-action-lock right black-text' data-position='left' data-delay='50' data-tooltip='Deactivated'></i>";	
			}

			content += "<tr>"+
						"	<td width='1px'>"+(i+1)+". </td>\n"+
						"	<td><img src='../assets/images/profile/"+profile+"' alt='Thumbnail' class='responsive-img valign profile-image' style='width:50px;'></td>\n"+
						"	<td width='200px'><p>"+v[1]+"</p></td>\n"+
						"	<td width='200px'><p>"+v[3]+"</p></td>\n"+
						"	<td width='200px'><p>"+v[4]+"</p></td>\n"+
						"	<td>\n"+
						"		<a data-studentID='"+v[1]+"' data-node='"+v[0]+"' data-cmd='view' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Show Details'>\n"+
						"			<i class='mdi-navigation-more-vert right black-text'></i>"+
						"		</a>\n"+
						"	</td>\n"+
						"</tr>\n";
		})	

		$("#employees table tbody").html(content);
		var table = $('#employees table').DataTable({
	        "order": [[ 0, 'asc' ]],
	        "drawCallback": function ( settings ) {
	            var api = this.api();
	            var rows = api.rows( {page:'current'} ).nodes();
	            var last=null;
	        }
	    });

		$('.dataTable').on('click', 'tbody tr', function() {
			var data = table.row(this).data();
			data = $.parseHTML(data[5]);
	    	$(location).attr('href','#cmd=index;content=focusEmployee;'+data[0].dataset.node);			
		});
	},
	details:function(id){
		// points.add(id);
		// employee.getPoints(id);
		// employee.getPointsActivity(id);
		// employee.getBuysActivity(id);
		var content = "";
		var data = system.ajax('../assets/harmony/Process.php?get-employeeDetails',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
			if(data.length<=0){
				var data = system.xml("pages.xml");
				$(data.responseText).find("errorContent").each(function(i,content){
					$("#display_error").html(content);
				});
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				if(Number(data[0][12]) == 1){
					status = "Active";
					var actions = "<a data-cmd='deactivateEmployee' data-name='"+data[0][4]+"' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock-open right black-text'></i>"+
								  "</a>";	
				}
				else{
					status = "Deactivated";
					var actions = "<a data-cmd='activateEmployee' data-name='"+data[0][4]+"' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock right black-text'></i>"+
								  "</a>";	
				}

				var profile = ((data[0][10] == "") || (data[0][10] == null))?"avatar.jpg":data[0][10];
				content = "<div id='profile-card' class='card'>"+
						"    <div class='card-image waves-effect waves-block waves-light'>"+
						"        <img class='activator' src='../assets/images/s5.png' alt='user background'>"+
						"    </div>"+
						"    <div class='card-content'>"+
						"        <div class=' responsive-img activator card-profile-image circle'>"+
						"        	<img src='../assets/images/profile/"+profile+"' alt='' class='circle'>"+
						"        	<a data-value='"+profile+"' data-cmd='updateEmployeePicture' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-prop='Picture' class='btn waves-effect white-text no-shadow black' style='font-size: 10px;z-index: 1;padding: 0 52px;top:114px;'>Change</a>"+
						"		 </div></br>"+
						"        <span class='card-title activator grey-text text-darken-4'>"+data[0][4]+" "+data[0][5]+" "+data[0][3]+" </span>"+
						"			<a data-value='"+JSON.stringify([data[0][4],data[0][5],data[0][3]])+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Account'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 <div class='divider'></div>"+
						"        <p><i class='mdi-action-info-outline cyan-text text-darken-2'></i> Status: "+status+actions+"</p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Place Of Birth: "+data[0][6]+"</span>"+
						"			<a data-value='"+data[0][6]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Place Of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Nickname'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Phone: "+data[0][9]+"</span>"+
						"			<a data-value='"+data[0][9]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Phone'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-cached cyan-text text-darken-2'></i> Gender: "+data[0][7]+"</span>"+
						"			<a data-value='"+data[0][7]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Gender' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Gender'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-event cyan-text text-darken-2'></i> Date of Birth: "+data[0][8]+"</span>"+
						"			<a data-value='"+data[0][8]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Date Of Birth'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Civil Status: "+data[0][14]+"</span>"+
						"			<a data-value='"+data[0][14]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Civil Status' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Civil Status'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Citizenship: "+data[0][15]+"</span>"+
						"			<a data-value='"+data[0][15]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Citizenship' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Citizenship'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-accessibility cyan-text text-darken-2'></i> Height: "+data[0][16]+"</span>"+
						"			<a data-value='"+data[0][16]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Height' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Height'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-accessibility cyan-text text-darken-2'></i> Weight: "+data[0][17]+"</span>"+
						"			<a data-value='"+data[0][17]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Weight' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Weight'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-cached cyan-text text-darken-2'></i> Blood Type: "+data[0][18]+"</span>"+
						"			<a data-value='"+data[0][18]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Blood Type' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Blood Type'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-portrait cyan-text text-darken-2'></i> GSIS ID Number: "+data[0][19]+"</span>"+
						"			<a data-value='"+data[0][19]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='GSIS Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update GSIS ID Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-portrait cyan-text text-darken-2'></i> Pag-Ibig ID Number: "+data[0][20]+"</span>"+
						"			<a data-value='"+data[0][20]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Pag-Ibig ID Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Pag-Ibig ID Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-portrait cyan-text text-darken-2'></i> Philhealth Number: "+data[0][21]+"</span>"+
						"			<a data-value='"+data[0][21]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Philhealth Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Philhealth Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-portrait cyan-text text-darken-2'></i> SSS Number: "+data[0][22]+"</span>"+
						"			<a data-value='"+data[0][22]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='SSS Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update GSIS SSS Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-home cyan-text text-darken-2'></i> Rsisdential Address: "+data[0][23]+"</span>"+
						"			<a data-value='"+data[0][23]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Residential Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Residential Address'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-assignment-ind cyan-text text-darken-2'></i> Zip Code: "+data[0][24]+"</span>"+
						"			<a data-value='"+data[0][24]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Residential Zipcode' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update GSIS SSS Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Telephone Number: "+data[0][25]+"</span>"+
						"			<a data-value='"+data[0][25]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Residential Telephone Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update GSIS SSS Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-home cyan-text text-darken-2'></i> Permanent Address: "+data[0][26]+"</span>"+
						"			<a data-value='"+data[0][26]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Permanent Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update GSIS SSS Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-assignment-ind cyan-text text-darken-2'></i> Zip Code: "+data[0][27]+"</span>"+
						"			<a data-value='"+data[0][27]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Permanent Zipcode' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update GSIS SSS Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Telephone Number: "+data[0][28]+"</span>"+
						"			<a data-value='"+data[0][28]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Permanent Telephone Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update GSIS SSS Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-communication-email cyan-text text-darken-2'></i> Email Address: "+data[0][29]+"</span>"+
						"			<a data-value='"+data[0][29]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Email' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Email Address'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-portrait cyan-text text-darken-2'></i> Agency Employee Number: "+data[0][30]+"</span>"+
						"			<a data-value='"+data[0][30]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Employee Agency Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employee Agency Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-picture-in-picture cyan-text text-darken-2'></i> Tin: "+data[0][31]+"</span>"+
						"			<a data-value='"+data[0][31]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Tin' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Tin'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div><br/>"+
						"		<div class='input-field col s12'>"+
						"			<p><b>Account Information</b></p>"+
						"			<div class='divider'></div>"+
						"		</div>"+
						"		<div class='input-field col s12'>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-work cyan-text text-darken-2'></i> Position: "+data[0][11]+"</span>"+
						"			<a data-value='"+data[0][11]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Position'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-box cyan-text text-darken-2'></i> Employee ID: "+data[0][1]+"</span>"+
						"			<button disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Employee ID' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employee ID'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
				$("#personal_information").html(content);

				employee.deactivate();
				employee.activate();
				employee.update();
				employee.updatePicture();
			}
		});
		var content="";
		var data = system.ajax('../assets/harmony/Process.php?get-family',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
			if(data.length<=0){
				var data = system.xml("pages.xml");
				$(data.responseText).find("errorContent").each(function(i,content){
					$("#display_error").html(content);
				});
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content = "<div id='profile-card' class='card'>"+
						"    <div class='card-content'>"+
						"		<h5>Family Background</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-account-circle cyan-text text-darken-2'></i> Spouse's Surename: "+data[0][1]+"</span>"+
						"			<a data-value='"+data[0][1]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Surename' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-circle cyan-text text-darken-2'></i> First Name: "+data[0][2]+"</span>"+
						"			<a data-value='"+data[0][2]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update First Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-circle cyan-text text-darken-2'></i> Middle Name: "+data[0][3]+"</span>"+
						"			<a data-value='"+data[0][3]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Middle Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Middle Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-work cyan-text text-darken-2'></i> Occupation: "+data[0][4]+"</span>"+
						"			<a data-value='"+data[0][4]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Occupation' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Occupation'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Employer/Bus Name: "+data[0][5]+"</span>"+
						"			<a data-value='"+data[0][5]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Employer/Bus Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-store cyan-text text-darken-2'></i> Business Address: "+data[0][6]+"</span>"+
						"			<a data-value='"+data[0][6]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Business Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Business Address'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Telephone Number: "+data[0][7]+"</span>"+
						"			<a data-value='"+data[0][7]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Telephone Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Telephone Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Father's surname: "+data[0][8]+"</span>"+
						"			<a data-value='"+data[0][8]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Father Surename' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surename'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> First Name: "+data[0][9]+"</span>"+
						"			<a data-value='"+data[0][9]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Father First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update First Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Middle Name: "+data[0][10]+"</span>"+
						"			<a data-value='"+data[0][10]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Father Middle Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Middle Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people-outline cyan-text text-darken-2'></i> Mother's surename: "+data[0][11]+"</span>"+
						"			<a data-value='"+data[0][11]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Mother Surename' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surename'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people-outline cyan-text text-darken-2'></i> First Name: "+data[0][12]+"</span>"+
						"			<a data-value='"+data[0][12]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Mother First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update First Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people-outline cyan-text text-darken-2'></i> Middle Name: "+data[0][13]+"</span>"+
						"			<a data-value='"+data[0][13]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Mother Middle Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Middle Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
				$("#family_background").html(content);

				employee.deactivate();
				employee.activate();
				employee.update();
				employee.updatePicture();
			}
		});
		var content="";
		var data = system.ajax('../assets/harmony/Process.php?get-child',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
			if(data.length<=0){
				var data = system.xml("pages.xml");
				$(data.responseText).find("errorContent").each(function(i,content){
					$("#display_error").html(content);
				});
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>Child</h5>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Name Of Child: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of Child' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text' data-cmd='value'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Date Of Birth: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Birthday' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br>";
							
        		});

        		content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_child'>New</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#childs").html(content);

				employee.deactivate();
				employee.activate();
				employee.update();
				employee.updatePicture();

		$("a[data-cmd='add_child']").on('click',function(){
					// var data = system.xml("pages.xml");
					// $(data.responseText).find("addChild").each(function(i,content){
					// 	console.log("Child_Background");
					// 	$("#modal .modal-content").html(content);
					// 	$('#modal').openModal('show');		
					//     $("select").material_select();

					// 	$("#form_addAnak").validate({
					// 	    rules: {
					// 	    	field_child: {maxlength: 50},
					// 	    	field_child_dob: {maxlength: 50,checkDate:true},
					// 	    },
					// 	    errorElement : 'div',
					// 	    errorPlacement: function(error, element) {
					// 			var placement = $(element).data('error');
					// 			if(placement){
					// 				$(placement).append(error)
					// 			} 
					// 			else{
					// 				error.insertAfter(element);
					// 			}
					// 		},
					// 		submitHandler: function (form) {
					// 			var _form = $(form).serializeArray();
					// 			var data = system.ajax('../assets/harmony/Process.php?set-newChild',[_form,id]);
					// 			data.done(function(data){
					// 				console.log(_form);
					// 				console.log(data);
					// 				if(data == 1){
					// 					if(data.responseText != ""){
					// 						Materialize.toast('Saved.',4000);
					// 						system.clearForm();
					// 				    	// $(location).attr('href',"#cmd=index;content=focusClient");
					// 				    	App.handleLoadPage("#cmd=index;content=focusClient;"+id);			
					// 					}
					// 				}
					// 				else{
					// 					Materialize.toast('Cannot process request.',4000);
					// 				}
					// 			});
					// 	    }
					// 	});
					// });
					// $("i[data-cmd='exit_personal']").on('click',function(){
					// 	$('#modal').closeModal();
					// 	$("#modal .modal-content").html("");
					// 	$('.lean-overlay').remove();
					// });
				});
			}
		});

		// var content="";
		// var data = system.ajax('../assets/harmony/Process.php?get-child',id);
		// data.done(function(data){
		// 	data = JSON.parse(data);
		// 	// console.log(data);
		// 	if(data.length<=0){
		// 		var data = system.xml("pages.xml");
		// 		$(data.responseText).find("errorContent").each(function(i,content){
		// 			$("#display_error").html(content);
		// 		});
		// 	}
		// 	else{
		// 		$("#display_employeeDetails").removeClass('hidden');
		// 		$("#display_error").addClass('hidden');

		// 		content += "<div id='profile-card' class='card'>"+
		// 					"   <div class='card-content'>"+
		// 					"		<h3><b><center>PERSONAL DATA SHEET</center></b></h3>"+
		// 					"		<h5 class='left'>Print legibly. Mark appropriate boxes with '/' <span style='padding-left:30%;'>1. CS ID No.<input /></span></h5>"+
		// 					"		<h5 class='left'>l. PERSONAL INFORMATION</h5>"+
		// 					"</div>"+
		// 					"</div>";
        		
		// 		$("#printme").html(content);

		// 		employee.deactivate();
		// 		employee.activate();
		// 		employee.update();
		// 		employee.updatePicture();

		// 		$("a[data-cmd='print']").on('click',function(){
		// 			$("#printme").print();
		// 		});
		// 		// $("i[data-cmd='value']").on('click',function(){
		// 		// 	console.log(data);
		// 		// });
		// 	}
		// });

		var content="";
		var data = system.ajax('../assets/harmony/Process.php?get-education',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
			if(data.length<=0){
				var data = system.xml("pages.xml");
				$(data.responseText).find("errorContent").each(function(i,content){
					$("#display_error").html(content);
				});
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content = "<div id='profile-card' class='card'>"+
						"    <div class='card-content'>"+
						"		<h5>Educational Background</h5>"+
						"		 <div class='divider'></div></br>"+
						"		<h5>Elementary Level</h5>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+data[0][1]+"</span>"+
						"			<a data-value='"+data[0][1]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+data[0][2]+"</span>"+
						"			<a data-value='"+data[0][2]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Gender' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update First Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+data[0][3]+"</span>"+
						"			<a data-value='"+data[0][3]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Middle Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+data[0][4]+"</span>"+
						"			<a data-value='"+data[0][4]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Occupation'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance: "+data[0][5]+"</span>"+
						"			<a data-value='"+data[0][5]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+data[0][6]+"</span>"+
						"			<a data-value='"+data[0][6]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div></br>"+
						"		<h5>Secondary Level</h5>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+data[0][7]+"</span>"+
						"			<a data-value='"+data[0][7]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+data[0][8]+"</span>"+
						"			<a data-value='"+data[0][8]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+data[0][9]+"</span>"+
						"			<a data-value='"+data[0][9]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+data[0][10]+"</span>"+
						"			<a data-value='"+data[0][10]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance: "+data[0][11]+"</span>"+
						"			<a data-value='"+data[0][11]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+data[0][12]+"</span>"+
						"			<a data-value='"+data[0][12]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div></br>"+
						"		<h5>Vocational/Trade Course</h5>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+data[0][13]+"</span>"+
						"			<a data-value='"+data[0][13]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i>Degree Course: "+data[0][14]+"</span>"+
						"			<a data-value='"+data[0][14]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i>Year Graduated: "+data[0][15]+"</span>"+
						"			<a data-value='"+data[0][15]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+data[0][16]+"</span>"+
						"			<a data-value='"+data[0][16]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance: "+data[0][17]+"</span>"+
						"			<a data-value='"+data[0][17]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+data[0][18]+"</span>"+
						"			<a data-value='"+data[0][18]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
				$("#educational_background").html(content);

				employee.deactivate();
				employee.activate();
				employee.update();
				employee.updatePicture();
			}
		});
		
		var content="";
		var data = system.ajax('../assets/harmony/Process.php?get-college',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
			if(data.length<=0){
				var data = system.xml("pages.xml");
				$(data.responseText).find("errorContent").each(function(i,content){
					$("#display_error").html(content);
				});
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>College Level</h5>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+value[1]+"</span>"+
							"			<a data-value='"+value[1]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance: "+value[5]+"</span>"+
							"			<a data-value='"+value[5]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+value[6]+"</span>"+
							"			<a data-value='"+value[6]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
							"</div>"+
							"</div>";
        		});
        		
				$("#college_level").html(content);

				employee.deactivate();
				employee.activate();
				employee.update();
				employee.updatePicture();
			}
		});

		var content="";
		var data = system.ajax('../assets/harmony/Process.php?get-graduate',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
			if(data.length<=0){
				var data = system.xml("pages.xml");
				$(data.responseText).find("errorContent").each(function(i,content){
					$("#display_error").html(content);
				});
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>Graduate Studies</h5>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+value[1]+"</span>"+
							"			<a data-value='"+value[1]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance: "+value[5]+"</span>"+
							"			<a data-value='"+value[5]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+value[6]+"</span>"+
							"			<a data-value='"+value[6]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
							"</div>"+
							"</div>";
        		});
        		
				$("#vocational").html(content);

				employee.deactivate();
				employee.activate();
				employee.update();
				employee.updatePicture();
			}
		});

		var content="";
		var data = system.ajax('../assets/harmony/Process.php?get-civil',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
			if(data.length<=0){
				var data = system.xml("pages.xml");
				$(data.responseText).find("errorContent").each(function(i,content){
					$("#display_error").html(content);
				});
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>Civil Service Eligibility</h5>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Career Service: "+value[1]+"</span>"+
							"			<a data-value='"+value[1]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Rating: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Date Of Examinantion: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Place Of Examination: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Number: "+value[5]+"</span>"+
							"			<a data-value='"+value[5]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Date Of Release: "+value[6]+"</span>"+
							"			<a data-value='"+value[6]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
							"</div>"+
							"</div>";
        		});
        		
				$("#vocational").html(content);

				employee.deactivate();
				employee.activate();
				employee.update();
				employee.updatePicture();
			}
		});

		var content="";
		var data = system.ajax('../assets/harmony/Process.php?get-work',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
			if(data.length<=0){
				var data = system.xml("pages.xml");
				$(data.responseText).find("errorContent").each(function(i,content){
					$("#display_error").html(content);
				});
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>Work Experience</h5>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates: "+value[1]+"</span>"+
							"			<a data-value='"+value[1]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Position Title: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Department/Agency/Office/Company: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Monthly Salary: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Salary Grade: "+value[5]+"</span>"+
							"			<a data-value='"+value[5]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Status Of Appointment: "+value[6]+"</span>"+
							"			<a data-value='"+value[6]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Gov't Service: "+value[7]+"</span>"+
							"			<a data-value='"+value[7]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
        		});

				content += "<a class='btn waves-effect waves-light orange left' data-cmd=''>New</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#work").html(content);

				employee.deactivate();
				employee.activate();
				employee.update();
				employee.updatePicture();
			}
		});

		var content="";
		var data = system.ajax('../assets/harmony/Process.php?get-voluntary',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
			if(data.length<=0){
				var data = system.xml("pages.xml");
				$(data.responseText).find("errorContent").each(function(i,content){
					$("#display_error").html(content);
				});
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>Voluntary Work</h5>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates: "+value[1]+"</span>"+
							"			<a data-value='"+value[1]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Position Title: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Department/Agency/Office/Company: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Monthly Salary: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
        		});

        		content += "<a class='btn waves-effect waves-light orange left' data-cmd=''>New</a></br></br>"+
							"</div>"+
							"</div>";

        		
				$("#voluntary").html(content);

				employee.deactivate();
				employee.activate();
				employee.update();
				employee.updatePicture();
			}
		});

		var content="";
		var data = system.ajax('../assets/harmony/Process.php?get-training',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
			if(data.length<=0){
				var data = system.xml("pages.xml");
				$(data.responseText).find("errorContent").each(function(i,content){
					$("#display_error").html(content);
				});
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>Training Programs</h5>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates: "+value[1]+"</span>"+
							"			<a data-value='"+value[1]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Position Title: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Department/Agency/Office/Company: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Monthly Salary: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
							"</div>"+
							"</div>";
        		});
        		
				$("#training").html(content);

				employee.deactivate();
				employee.activate();
				employee.update();
				employee.updatePicture();
			}
		});

		var content="";
		var data = system.ajax('../assets/harmony/Process.php?get-other',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
			if(data.length<=0){
				var data = system.xml("pages.xml");
				$(data.responseText).find("errorContent").each(function(i,content){
					$("#display_error").html(content);
				});
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>Other Information</h5>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Special Skills/Hobbies: "+value[1]+"</span>"+
							"			<a data-value='"+value[1]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Non-Academic Distinctions/Recognition: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Membership in Association/Organization: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
							"</div>"+
							"</div>";
        		});
        		
				$("#other").html(content);

				employee.deactivate();
				employee.activate();
				employee.update();
				employee.updatePicture();
			}
		});

	},
	update:function(){
		$("a[data-cmd='updateEmployee']").on('click',function(){
			var data = $(this).data();
			var id = data.node;

			var content = "<h4>Change "+data.prop+"</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'>"+data.prop+": </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm .modal-footer').html("");			
			$('.lean-overlay').remove();

			if(data.prop == "Name"){
				var content = "<h4>Change "+data.prop+"</h4>"+
							  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
							  "		<div class='col s12'>"+
							  "			<label for='field_gname'>Given Name: </label>"+
							  "			<input id='field_gname' type='text' name='field_gname' data-error='.error_gname' value='"+data.value[0]+"'>"+
							  "			<div class='error_gname'></div>"+
							  "		</div>"+
							  "		<div class='col s12'>"+
							  "			<label for='field_mname'>Middle Name: </label>"+
							  "			<input id='field_mname' type='text' name='field_mname' data-error='.error_mname' value='"+data.value[1]+"'>"+
							  "			<div class='error_mname'></div>"+
							  "		</div>"+ 
							  "		<div class='col s12'>"+
							  "			<label for='field_fname'>Family Name: </label>"+
							  "			<input id='field_fname' type='text' name='field_fname' data-error='.error_fname' value='"+data.value[2]+"'>"+
							  "			<div class='error_fname'></div>"+
							  "		</div>"+
							  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
							  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
							  "</form>";
				$("#modal_confirm .modal-content").html(content);
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_gname: {required: true,maxlength: 50},
				        field_mname: {required: true,maxlength: 50},
				        field_fname: {required: true,maxlength: 50},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}			
			else if(data.prop == "Place Of Birth"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Nickname: {required: true,maxlength: 50},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}			
			else if(data.prop == "Position"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Nickname: {required: true,maxlength: 50},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}			
			else if(data.prop == "Phone"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Name: {required: true,maxlength: 50},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}			
			else if(data.prop == "Email"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Email updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Citizenship"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Citizenship updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Height"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Height updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Weight"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Weight updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Blood Type"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Blood Type updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "GSIS Number"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('GSIS ID Number updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Pag-Ibig ID Number"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Pag-Ibig ID Number updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Philhealth Number"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Philhealth Number updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "SSS Number"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('SSS Number updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Residential Address"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Residential Address updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Residential Zipcode"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Zip Code updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Residential Telephone Number"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Telephone Number updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Permanent Address"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Permanent Address updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Permanent Zipcode"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Zip Code updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Permanent Telephone Number"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Telephone Number updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Employee Agency Number"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Agency Employee Number updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Tin"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Tin updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			//Family_Background Update
			else if(data.prop == "Spouse Surename"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Surename updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Spouse First Name"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('First Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Spouse Middle Name"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Middle Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Spouse Occupation"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Occupation updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Spouse Employer/Bus Name"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Empployer updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Spouse Business Address"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Address updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Spouse Telephone Number"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Telephone Number updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Father Surename"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Surename updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Father First Name"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('First Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Father Middle Name"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Middle Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Mother Surename"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Surename updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Mother First Name"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('First Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Mother Middle Name"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Middle Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Mother Middle Name"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Middle Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			//child
			else if(data.prop == "Name Of Child"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employes',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Name Of Child updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Birthday"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Birthday updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Gender"){
				var content = "<h4>Change "+data.prop+"</h4>"+
							  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
							  "		<div class='col s12'>"+
							  "		<label for='field_gender' class='active'>Gender: </label>"+
							  "		<select name='field_Gender'>"+
							  "			<option selected>Male</option>"+
							  "			<option>Female</option>"+
							  "		</select>"+
							  "		</div>"+
							  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
							  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
							  "</form>";
				$("#modal_confirm .modal-content").html(content);
				$('#modal_confirm').openModal('show');			
			    $("select").material_select();
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Gender updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}

			else if(data.prop == "Civil Status"){
				var content = "<h4>Change "+data.prop+"</h4>"+
							  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
							  "		<div class='col s12'>"+
							  "		<label for='field_cstatus' class='active'>Civil Status: </label>"+
							  "		<select name='field_Civil Status'>"+
							  "			<option selected>Single</option>"+
							  "			<option>Married</option>"+
							   "			<option>Anulled</option>"+
							    "			<option>Widowed</option>"+
							     "			<option>Separated</option>"+
							  "		</select>"+
							  "		</div>"+
							  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
							  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
							  "</form>";
				$("#modal_confirm .modal-content").html(content);
				$('#modal_confirm').openModal('show');			
			    $("select").material_select();
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Civil Status updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}

			else if(data.prop == "Date of Birth"){
				var content = "<h4>Change "+data.prop+"</h4>"+
							  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
							  "		<label for='field_dob'>Date of birth: </label>"+
							  "		<input id='field_dob' type='text' name='field_dob' data-error='.error_dob' value='"+data.value+"'>"+
							  "		<div class='error_dob'></div>"+
							  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
							  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
							  "</form>";
				$("#modal_confirm .modal-content").html(content);
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_dob: {required: true,maxlength: 50,checkDate:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Date of birth updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
		});
	},
	updatePicture:function(){
		$("a[data-cmd='updateEmployeePicture']").on('click',function(){
			var data = $(this).data();
			console.log("Change Picture");
			var id = data.node;
			var picture = "../assets/images/profile/avatar.jpg";
			var content = "<h4>Change "+data.prop+"</h4>"+
  							"	<div class='row'>"+
  							"		<div class='col s12'>"+
							"			<div id='profile_picture2' class='ibox-content no-padding border-left-right '></div>"+
							"		</div>"+
							"	</div>";
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm').removeClass('modal-fixed-footer');			
			$('#modal_confirm .modal-footer').remove();			
			$('#modal_confirm').openModal('show');			
			$(".lean-overlay").remove();
			
    		var content =   "<div class='image-crop col s12' style='margin-bottom:5px;'>"+
							"	<img width='100%' src='"+picture+"'>"+
							"</div>"+
							"<div class='btn-group col s12'>"+
							"	<label for='inputImage' class='btn blue btn-floating btn-flat tooltipped' data-tooltip='Load image' data-position='top'>"+
							"		<input type='file' accept='image/*' name='file' id='inputImage' class='hide'>"+
							"		<i class='large mdi-editor-publish'></i>"+
							"	</label>"+
							"	<button class='btn blue btn-floating btn-flat tooltipped' data-cmd='cancel' type='button' data-tooltip='Cancel' data-position='top'>"+
							"		<i class='mdi-navigation-close'></i>"+
							"	</button>"+
							"	<button class='btn blue btn-floating btn-flat hidden tooltipped right' data-cmd='save' type='button' data-tooltip='Save' data-position='top'>"+
							"		<i class='mdi-content-save'></i>"+
							"	</button>"+
							"</div>";
    		$("#profile_picture2").html(content);
			$('.tooltipped').tooltip({delay: 50});

            var $inputImage = $("#inputImage");
            var status = true;
            if(window.FileReader){
                $inputImage.change(function() {
                    var fileReader = new FileReader(),
                            files = this.files,
                            file;

                    file = files[0];

                    if (/^image\/\w+$/.test(file.type)) {
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function () {
                            $inputImage.val("");

				            var $image = $(".image-crop > img")
				            $($image).cropper({
				            	aspectRatio: 1/1,
							    autoCropArea: 0.80,
							    preview: ".avatar-preview",
							    built: function () {
			    		    		$(".cropper-container").attr({'style':'left:0px !important;top:0px;width:100%;height:100%;'});

							    	$("button[data-cmd='save']").removeClass('hidden');
							    	$("button[data-cmd='rotate']").removeClass('hidden');
							    	
						            $("button[data-cmd='save']").click(function(){									    	
								    	$(this).html("<i class='mdi-action-cached icon-spin'></i>").addClass('disabled');
								    	if(status){
											var data = system.ajax('../assets/harmony/Process.php?update-employeePicture',[id,$image.cropper("getDataURL")]); // 
											data.done(function(data){
												Materialize.toast('Picture has been changed.',4000);
												system.clearForm();
												App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
												$('#modal_confirm').closeModal();
												$('.lean-overlay').remove();	
											});
								    		status = false;
								    	}
						            });
							    }
							});

                            $image.cropper("reset", true).cropper("replace", this.result);

				            $("button[data-cmd='rotate']").click(function(){
				            	var data = $(this).data('option');
					        	$image.cropper('rotate', data);
				            });

                        };
                    }
                    else{
                        showMessage("Please choose an image file.");
                    }
                });
            }
            else{
                $inputImage.addClass("hide");
            }	            
            $("button[data-cmd='cancel']").click(function(){
				$('#modal_confirm').closeModal();
				$('.lean-overlay').remove();	
            });
		});
	},
	deactivate:function(){
		$("a[data-cmd='deactivateEmployee']").on('click',function(){
			var id = $(this).data('node');
			var content = "Arey you sure DEACTIVATE "+$(this).data('name')+"'s account?<br/>"+
						  "<label for='field_description'>Remarks: </label>"+
						  "<textarea class='materialize-textarea' data-field='field_description' name='field_description'></textarea>";
			$("#modal_confirm .modal-content").html(content);
			$("#modal_confirm .modal-footer").html("<a class='waves-effect waves-red red white-text btn-flat modal-action modal-close'>Cancel</a>"+
												   "<a data-cmd='button_proceed' class='waves-effect waves-grey btn-flat modal-action'>Proceed</a>");
			$('#modal_confirm').openModal('show');			
			$('.lean-overlay').remove();

			$("a[data-cmd='button_proceed']").on("click",function(){
				var remarks = $("textarea[data-field='field_description']").val();
				if(remarks.length == 0){
						Materialize.toast('Remarks is required.',4000);
				}
				else if(remarks.length > 800){
						Materialize.toast('Statement is too long.',4000);
				}
				else{
					var data = system.ajax('../assets/harmony/Process.php?deactivate-employee',[id,remarks]);
					data.done(function(data){
						console.log(data);
						if(data == 1){
							Materialize.toast('Account deactivaded.',4000);
							system.clearForm();
							App.handleLoadPage("#cmd=index;content=focusEmployee");
							$('#modal_confirm').closeModal();	
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
				}
			});
		})
	},
	activate:function(){
		$("a[data-cmd='activateEmployee']").on('click',function(){
			var id = $(this).data('node');
			$("#modal_confirm .modal-content").html("Arey you sure ACTIVATE "+$(this).data('name')+"'s account?");
			$("#modal_confirm .modal-footer").html("<a class='waves-effect waves-red red white-text btn-flat modal-action modal-close'>Cancel</a>"+
												   "<a data-cmd='button_proceed' class='waves-effect waves-grey btn-flat modal-action modal-close'>Proceed</a>");
			$('#modal_confirm').openModal('show');			

			$("a[data-cmd='button_proceed']").on("click",function(){
				var data = system.ajax('../assets/harmony/Process.php?activate-employee',id);
				data.done(function(data){
					if(data == 1){
						Materialize.toast('Account activaded.',4000);
						system.clearForm();
						App.handleLoadPage("#cmd=index;content=focusClient");
						$('#modal_confirm').closeModal();	
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});
			});
		})
	},
	getPoints:function(id){
		var data = system.ajax('../assets/harmony/Process.php?get-employeePointsAdmin',id);
		data.done(function(data){
			data = JSON.parse(data);
			data = (data.length<=0)?0:data[0][2];
			$("#employees h2 span.actual-points").html(data)
		});
	},
	getPointsActivity:function(id){
		var content = "";
		var data = system.ajax('../assets/harmony/Process.php?get-employeePointsActivityAdmin',id);
		data.done(function(data){
			data = JSON.parse(data);
			if(data.length<=0){
				$("#pointsActivity").html("<h4 class='center'>No points activity</h4>");
			}
			else{
				$.each(data,function(i,v){
					content += "<tr>"+
								"	<td width='1px'>"+(i+1)+". </td>"+
								"	<td>"+v[1]+"</td>"+
								"	<td>"+v[2]+"</td>"+
								"	<td>"+v[5]+"</td>"+
								"	<td>"+v[3]+"</td>"+
								"</tr>";
				})					
				$("#pointsActivity table tbody").html(content);

				var table = $('#pointsActivity table').DataTable({
			        "order": [[ 0, 'asc' ]],
			        "drawCallback": function ( settings ) {
			            var api = this.api();
			            var rows = api.rows( {page:'current'} ).nodes();
			            var last=null;
			        }
			    });
			}
		});
	},
	getBuysActivity:function(id){
		var content = "";
		var data = system.ajax('../assets/harmony/Process.php?get-employeeBuysActivityAdmin',id);
		data.done(function(data){
			data = JSON.parse(data);
			if(data.length<=0){
				$("#buyingActivity").html("<h4 class='center'>No buying activity</h4>");
			}
			else{
				$.each(data,function(i,v){
					content += "<tr>"+
								"	<td width='1px'>"+(i+1)+". </td>"+
								"	<td width='20%'>"+v[0].substring(0,6)+"...</td>"+
								"	<td width='30%'>"+v[2]+"</td>"+
								"	<td width='30%'>"+v[3]+"</td>"+
								"	<td width='30%'>For Delivery</td>"+
								"	<td width='9%'>"+
								"		<a data-cmd='showOrder' data-node='"+v[0]+"' data-meta='"+JSON.stringify([v[0],v[2],v[3],"For Delivery"])+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='0' data-tooltip='Show details'>"+
								"			<i class='mdi-navigation-more-vert right black-text'></i>"+
								"		</a>"+
								"	</td>"+
								"</tr>";
				})					
				$("#buyingActivity table tbody").html(content);

				var table = $('#buyingActivity table').DataTable({
			        "order": [[ 0, 'asc' ]],
			        "drawCallback": function ( settings ) {
			            var api = this.api();
			            var rows = api.rows( {page:'current'} ).nodes();
			            var last=null;
			        }
			    });

				$("a[data-cmd='showOrder']").on('click',function(){
					var data = $(this).data();
					var content = "";
					console.log(data);
					$("#modal_popUp table").remove();

					var subTotal = 0;
					var orders = system.ajax('../assets/harmony/Process.php?get-orders',data.node);
					orders.done(function(orders){
						var orders = JSON.parse(orders);
						content = "<thead><tr>"+
								  "<th class='center'></th>"+						
								  "<th class='center'>Product</th>"+						
								  "<th class='center'>Quantity</th>"+						
								  "<th class='center'>Price</th>"+						
								  "<th class='center'>Total</th>"+						
								  "</tr></thead>";						

						$.each(orders,function(i,v){
							var product = ((v[17] == "") || (v[17] == null))?"default.png":v[17];
							subTotal = subTotal + (v[10]*v[1]);
							content += "<tr>"+
									  "<td class='center'><img src='../assets/images/products/"+product+"' alt='Thumbnail' class='valign profile-image' width='80px'></td>"+						
									  "<td class='center'>"+v[8]+"</td>"+						
									  "<td class='center'>"+v[1]+"</td>"+						
									  "<td class='center'>"+v[10]+"</td>"+						
									  "<td class='center'>"+(v[10]*v[1])+"</td>"+						
									  "</tr>";						
						})
						$('#modal_popUp .modal-content').html('<strong>Order ID:</strong> '+data.meta[0]+'<br/><strong>Order Date:</strong> '+data.meta[1]+'<br/>\n<strong>Order Delivered:</strong> '+data.meta[2]+'<br/>\n<strong>Status:</strong> '+data.meta[3]+'');			
						$("#modal_popUp .modal-footer").before("<table class='striped bordered highlight'>"+content+"<tr><td colspan='4'><strong class='right' >Total</strong></td><td class='center'>"+subTotal+"</td></tr></table>");
						$("#modal_popUp .modal-footer").html("<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Close</a>");
						$('#modal_popUp').openModal('show');			

						console.log(orders);
					});
				});
			}
		});
	},
	upload:function(_id){
        var $inputImage = $("#field_file"), status = true, res = "";
        if(window.FileReader){
            $inputImage.on('change',function(){
            	$("#field_file").addClass("disabled");
                var files = this.files, file = files[0].name.split('.');
                if((file[1] == "csv") || (file[1] == "xlsx")){ // 
					var data = system.xml("pages.xml");
					$(data.responseText).find("tableEmployeePreview").each(function(i,content){
						$("#field_file").parse({
							config: {
								complete: function(results, file) {
									$("#display_importLoading").removeClass('zoomOut').html("");
							    	system.preloader("#display_importLoading");
									system.loading(true);
									var data = [],count = 0, search = [], search2 = [];
									var employeeList = [];

									employeeList = system.ajax('../assets/harmony/Process.php?get-employeeByID',_id);
									employeeList = JSON.parse(employeeList.responseText);
									confirmList = system.ajax('../assets/harmony/Process.php?get-confirmByID',_id);
									confirmList = JSON.parse(confirmList.responseText);

									if((results['data'][0].length == 6) && (results['data'][0][5] == 'EMAIL') && (results['data'].length<=2000)){
										Materialize.toast("Removing duplicated entries.",2000);
										setTimeout(function(){
											$("#importPreview").html(content);
						                	$("#display_import").removeClass('hidden');

											for(var x=1;x<(results['data'].length-1);x++){
												if(results['data'][x][0] != ""){
													search = system.searchJSON(employeeList,1,results['data'][x][0]);
													search2 = system.searchJSON(confirmList,1,results['data'][x][0]);

													if((search.length==0) && (search2.length==0))												
														data.push(results['data'][x]);
												}
											}

							                var table = $('#importPreview table').DataTable({
							                    data: data,
										        "order": [[ 0, 'asc' ]],
										        deferRender:    true,
										        iDisplayLength: 100,
												sScrollY:        "300px",
												sScrollX:        "100%",
												bScrollCollapse: true,
							                    columns: [
							                        {data: "",
							                            render: function ( data, type, full ){
							                            	count++;
							                                return count+".";
							                            }
							                        },
							                        {data: "",
							                            render: function ( data, type, full ){
							                                return (full[0]!="")?"<span>"+full[0]+"</span>":null;
							                            }
							                        },
							                        {data: "",
							                            render: function ( data, type, full ){
							                                return (full[2]!="")?"<span>"+full[2]+"</span>":null;
							                            }
							                        },
							                        {data: "",
							                            render: function ( data, type, full ){
							                                return (full[1]!="")?"<span>"+full[1]+"</span>":null;
							                            }
							                        },
							                        {data: "",
							                            render: function ( data, type, full ){
							                                return (full[3]!="")?"<span>"+full[3]+"</span>":null;
							                            }
							                        },
							                        {data: "",
							                            render: function ( data, type, full ){
							                                return (full[4]!="")?"<span>"+full[4]+"</span>":null;
							                            }
							                        },
							                        {data: "",
							                            render: function ( data, type, full ){
							                                return (full[5]!="")?"<span>"+full[5]+"</span>":null;
							                            }
							                        },
							                    ],
							                });

											table.on( 'order.dt search.dt', function () {
											    table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
											        cell.innerHTML = i+1;
											    } );
											} ).draw();


											if(data.length>0){
												employee.saveUpload(_id,data);
											}
											else{
												$(".display_loading").html("<span class='red-text'>All data are already in the system.</span>");
											}

						                	$("#display_import").removeClass('hidden');
											$("#display_importLoading").addClass('animated zoomOut').html("");
										},1000)
									}
									else{
										Materialize.toast("It seems that you are uploading a data that is not validated or<br/> either of the following:<br/>"+
											"&bull; Your are uploading too many data; <br/>&bull; You are uploading unformatted CSV file.",
											10000);
					                	$("#display_import").addClass('hidden');
										$("#display_importLoading").addClass('animated zoomOut').html("");
									}
								}
							},
							before: function(file, inputElem){
								$("#display_excelFile").html(file.name);
							},
							error: function(err, file, inputElem, reason){
								Materialize.toast("MS Excel file is corrupted.",4000);
			                	$("#display_import").addClass('hidden');
								$("#display_importLoading").html("");
							},
						});
					});
                }
                else{
                	$("#display_import").addClass('hidden');
					$("#display_excelFile").html("");
					Materialize.toast("MS Excel file is not valid. Try a CSV file.",4000);
                }
            });
        }
        else{
            $inputImage.addClass("hide");
        }	 			
	},
	saveUpload:function(_id,_data){
        $("#save_import").on("click",function(){
			Materialize.toast('Importing...',4000);
        	$(this).addClass('disabled');
			var data = system.xml("pages.xml");
			$(data.responseText).find("loader2").each(function(i,content){
				$(".display_loading").html(content);
	        	setTimeout(function(){
	        		_data = ($.type(_data) == "array")?JSON.stringify(_data):_data;
					var data = system.ajax('../assets/harmony/Process.php?set-BulkEmployee',[_data,_id]);
					data.done(function(data){
						console.log(data);
						if(data == 1){
							Materialize.toast('Saved.',4000);
							App.handleLoadPage("#cmd=index;content=focusClient;"+_id);
						}
						else{
							Materialize.toast('Cannot process request.',4000);
							$(".display_loading").html("");
						}
					});
	        	},1000);
			});
        });
	},
	confirm:function(){
		console.log('xx');
	}
}

employee_Account = {
	ini:function(){
		this.add();
		this.list();
	},
	get:function(){
		var data = system.html('../assets/harmony/Process.php?get-employeeAccount');
		return data;
	},
	list:function(){
		var content = "", chips = [],chipsContent = "";
		var data = employee_Account.get();
		data = JSON.parse(data.responseText);
		$.each(data,function(i,v){
			if(Number(v[4]) == 1){
					status = "Active";
					var actions = "<a data-cmd='deactivateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock-open right black-text'></i>"+
								  "</a>";	
				}
				else{
					status = "Deactivated";
					var actions = "<a data-cmd='activateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock right black-text'></i>"+
								  "</a>";	
				}
			content += "<tr>"+
						"	<td width='1px'>"+(i+1)+". </td>"+
						"	<td>"+v[1]+"</td>"+
						"	<td>"+v[2]+"</td>"+
						"	<td>"+status+"</td>"+
						"	<td width='1px'>"+
						"		<a href='#cmd=index;content=focusEmployeeAccount;"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='0' data-tooltip='Show Details' data-cmd='update'>"+
						"			<i class='mdi-navigation-more-vert right black-text'></i>"+
						"		</a>"+
						"	</td>"+
						"</tr>";
		});

		content = "<table class='table bordered center' id='products'>"+
					"<thead>"+
					"	<tr>"+
					"		<th>#</th><th>Name</th><th>Username</th><th>Status</th><th></th>"+
					"	</tr>"+
					"</thead>"+
					"</tbody>"+
						content+
					"</tbody>"+
					"</table>";
		$("#display_account").html(content);

		var table = $('#products').DataTable({
	        "order": [[ 0, 'asc' ]],
	        "drawCallback": function ( settings ) {
	            var api = this.api();
	            var rows = api.rows( {page:'current'} ).nodes();
	            var last=null;
	        }
	    });
	},
	add:function(){
		$("#add_account").on('click',function(){
			var data = system.xml("pages.xml");
			$(data.responseText).find("addAccount_employee").each(function(i,content){
				$("#modal_popUp .modal-content").html(content);
				$('#modal_popUp').openModal('show');			

				$("#form_addAcccount_employee").validate({
				    rules: {
				        field_name: {required: true,maxlength: 50},
				        field_email: {required: true,maxlength: 50,checkEmail:true},
				        field_username: {required: true,maxlength: 50,checkUsername:true,validateUsername:true},
				        field_password: {required: true,maxlength: 50,checkPassword:true,validatePassword:true},
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
						var data = system.ajax('../assets/harmony/Process.php?set-newEmployeeAccount',_form);
						data.done(function(data){
							if(data == 1){
								if(data.responseText != ""){
									system.clearForm();
									Materialize.toast('Saved.',4000);
									$('#modal').closeModal();
									App.handleLoadPage("#cmd=index;content=employee_account");
								}
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			});
		});
	},
	details:function(id){
		var content = "";
		var data = system.ajax('../assets/harmony/Process.php?get-employeeAccounttDetails',id);
		data.done(function(data){

			data = JSON.parse(data);
			if(data.length<=0){
				var data = system.xml("pages.xml");
				$(data.responseText).find("errorContent").each(function(i,content){
					$("#display_error").html(content);
				});
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');
			
				if(Number(data[0][4]) == 1){
					status = "Active";
					var actions = "<a data-cmd='deactivateEmployee' data-name='"+data[0][4]+"' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock-open right black-text'></i>"+
								  "</a>";	
				}
				else{
					status = "Deactivated";
					var actions = "<a data-cmd='activateEmployee' data-name='"+data[0][4]+"' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock right black-text'></i>"+
								  "</a>";	
				}

				content =  "<div id='profile-card' class='card'>"+
						"    <div class='card-content'>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Name: "+data[0][1]+"</span>"+
						"			<a data-cmd='updateEmployeeAccount' data-value='"+data[0][1]+"' data-name='"+data[0][1]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update email'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><i class='mdi-action-info-outline cyan-text text-darken-2'></i> Status: "+status+actions+"</p>"+

						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Username: "+data[0][2]+"</span>"+
						"			<a data-cmd='updateEmployeeAccount' data-value='"+data[0][2]+"' data-name='"+data[0][1]+"' data-node='"+data[0][0]+"' data-prop='Username' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update uaername'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-verified-user cyan-text text-darken-2'></i> Password"+"</span>"+
						"			<a data-cmd='updateEmployeeAccount' data-name='"+data[0][1]+"' data-node='"+data[0][0]+"' data-prop='Password' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update password'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"    </div>"+
						"</div>";

				$("#product").html(content);
				employee_Account.deactivate();
				employee_Account.activate();
				employee_Account.update();
			}
		});
	},
	deactivate:function(){
		$("a[data-cmd='deactivateEmployee']").on('click',function(){
			var id = $(this).data('node');
			var content = "Arey you sure DEACTIVATE "+$(this).data('name')+"'s account?<br/>"+
						  "<label for='field_description'>Remarks: </label>"+
						  "<textarea class='materialize-textarea' data-field='field_description' name='field_description'></textarea>";
			$("#modal_confirm .modal-content").html(content);
			$("#modal_confirm .modal-footer").html("<a class='waves-effect waves-red red white-text btn-flat modal-action modal-close'>Cancel</a>"+
												   "<a data-cmd='button_proceed' class='waves-effect waves-grey btn-flat modal-action'>Proceed</a>");
			$('#modal_confirm').openModal('show');			
			$('.lean-overlay').remove();

			$("a[data-cmd='button_proceed']").on("click",function(){
				var remarks = $("textarea[data-field='field_description']").val();
				if(remarks.length == 0){
						Materialize.toast('Remarks is required.',4000);
				}
				else if(remarks.length > 800){
						Materialize.toast('Statement is too long.',4000);
				}
				else{
					var data = system.ajax('../assets/harmony/Process.php?deactivate-employeeAccount',[id,remarks]);
					data.done(function(data){
						console.log(data);
						if(data == 1){
							Materialize.toast('Account deactivaded.',4000);
							system.clearForm();
							App.handleLoadPage("#cmd=index;content=focusEmployeeAccount");
							$('#modal_confirm').closeModal();	
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
				}
			});
		})
	},
	activate:function(){
		$("a[data-cmd='activateEmployee']").on('click',function(){
			var id = $(this).data('node');
			$("#modal_confirm .modal-content").html("Arey you sure ACTIVATE "+$(this).data('name')+"'s account?");
			$("#modal_confirm .modal-footer").html("<a class='waves-effect waves-red red white-text btn-flat modal-action modal-close'>Cancel</a>"+
												   "<a data-cmd='button_proceed' class='waves-effect waves-grey btn-flat modal-action modal-close'>Proceed</a>");
			$('#modal_confirm').openModal('show');			

			$("a[data-cmd='button_proceed']").on("click",function(){
				var data = system.ajax('../assets/harmony/Process.php?activate-employeeAccount',id);
				data.done(function(data){
					if(data == 1){
						Materialize.toast('Account activaded.',4000);
						system.clearForm();
						App.handleLoadPage("#cmd=index;content=focusEmployeeAccount");
						$('#modal_confirm').closeModal();	
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});
			});
		})
	},
	update:function(){
		$("a[data-cmd='updateEmployeeAccount']").on('click',function(){
			var data = $(this).data();
			var id = data.node;

			var content = "<h5>Change "+data.prop+"</h5>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'>"+data.prop+": </label>"+
						  "		<input id='field_"+data.prop+"' value='"+data.value+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm .modal-footer').html("");			

			if(data.prop == "Name"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employeeAccount',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployeeAccount;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Username"){
				$('#modal_confirm').openModal('show');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employeeAccount',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Username updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployeeAccount;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Password"){
				$('#modal_confirm').openModal('show');			
				$("#field_Password").val("");
				$("#field_Password").attr({"type":"password"});
				$("#form_update").append("<p><input type='checkbox' id='showPassword'><label for='showPassword'>Show password</label></p>");

				$("#showPassword").on("click",function(){
					if($(this).is(':checked')){
						$("#field_Password").attr({"type":"text"});						
					}
					else{
						$("#field_Password").attr({"type":"password"});						
					}
				})

				$("#form_update").validate({
				    rules: {
				        field_Password: {required: true,maxlength: 50,checkPassword:true,validatePassword:true},
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
						var data = system.ajax('../assets/harmony/Process.php?update-employeeAccount',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Password updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusEmployeeAccount");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
		});
	},
}