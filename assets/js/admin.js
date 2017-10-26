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
		$("a[data-cmd='updateEmployeeAccountPicture']").on('click',function(){
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
			$("#display_clientList").html("<h5 class='center'>No Departments to Show</h5>");
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
				});

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
	list:function(id){
		var data = system.ajax('../assets/harmony/Process.php?get-employeeByID',id);
		data = JSON.parse(data.responseText);
		console.log(data);
		var content = "", actions = "";
		$.each(data,function(i,v){
			var profile = ((v[11] == "") || (v[11] == null))?'avatar.jpg':v[11];
			if(Number(v[12]) == 1){
				actions = "<i class='mdi-action-lock-open right black-text' data-position='left' data-delay='50' data-tooltip='Active'></i>";	
			}
			else{
				actions = "<i class='mdi-action-lock right black-text' data-position='left' data-delay='50' data-tooltip='Deactivated'></i>";	
			}

			content += "<tr>"+
						"	<td width='1px'>"+(i+1)+". </td>\n"+
						"	<td><img src='../assets/images/profile/"+profile+"' alt='Thumbnail' class='responsive-img valign profile-image' style='width:50px;'></td>\n"+
						"	<td width='200px'><p>"+v[2]+"</p></td>\n"+
						"	<td width='200px'><p>"+v[4]+"</p></td>\n"+
						"	<td width='200px'><p>"+v[5]+"</p></td>\n"+
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
		var print = "";
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

				if(Number(data[0][13]) == 1){
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

				var profile = ((data[0][11] == "") || (data[0][11] == null))?"avatar.jpg":data[0][11];
				content = "<div id='profile-card' class='card'>"+
						"    <div class='card-image waves-effect waves-block waves-light'>"+
						"        <img class='activator' src='../assets/images/s5.png' alt='user background'>"+
						"    </div>"+
						"    <div class='card-content'>"+
						"        <div class=' responsive-img activator card-profile-image circle'>"+
						"        	<img src='../assets/images/profile/"+profile+"' alt='' class='circle'>"+
						"		 </div></br>"+
						"        <span class='card-title activator grey-text text-darken-4'>"+data[0][5]+" "+data[0][6]+" "+data[0][4]+" </span>"+
						"			<button data-value='"+JSON.stringify([data[0][4],data[0][5],data[0][3]])+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Account'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 <div class='divider'></div>"+
						"        <p><i class='mdi-action-info-outline cyan-text text-darken-2'></i> Status: "+status+actions+"</p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Place Of Birth: "+data[0][7]+"</span>"+
						"			<button data-value='"+data[0][7]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Place Of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Nickname'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Phone: "+data[0][10]+"</span>"+
						"			<button data-value='"+data[0][10]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Phone'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-cached cyan-text text-darken-2'></i> Gender: "+data[0][8]+"</span>"+
						"			<button data-value='"+data[0][8]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Gender' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Gender'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-event cyan-text text-darken-2'></i> Date of Birth: "+data[0][9]+"</span>"+
						"			<button data-value='"+data[0][9]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Date Of Birth'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Civil Status: "+data[0][15]+"</span>"+
						"			<button data-value='"+data[0][15]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Civil Status' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Civil Status'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Citizenship: "+data[0][16]+"</span>"+
						"			<button data-value='"+data[0][16]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Citizenship' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Citizenship'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-accessibility cyan-text text-darken-2'></i> Height: "+data[0][17]+"</span>"+
						"			<button data-value='"+data[0][17]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Height' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Height'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-accessibility cyan-text text-darken-2'></i> Weight: "+data[0][18]+"</span>"+
						"			<button data-value='"+data[0][18]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Weight' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Weight'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-cached cyan-text text-darken-2'></i> Blood Type: "+data[0][19]+"</span>"+
						"			<button data-value='"+data[0][19]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Blood Type' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Blood Type'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-portrait cyan-text text-darken-2'></i> GSIS ID Number: "+data[0][20]+"</span>"+
						"			<button data-value='"+data[0][20]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='GSIS Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update GSIS ID Number'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-portrait cyan-text text-darken-2'></i> Pag-Ibig ID Number: "+data[0][21]+"</span>"+
						"			<button data-value='"+data[0][21]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Pag-Ibig ID Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Pag-Ibig ID Number'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-portrait cyan-text text-darken-2'></i> Philhealth Number: "+data[0][22]+"</span>"+
						"			<button data-value='"+data[0][22]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Philhealth Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Philhealth Number'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-portrait cyan-text text-darken-2'></i> SSS Number: "+data[0][23]+"</span>"+
						"			<button data-value='"+data[0][23]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='SSS Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update GSIS SSS Number'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-home cyan-text text-darken-2'></i> Rsisdential Address: "+data[0][24]+"</span>"+
						"			<button data-value='"+data[0][24]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Residential Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Residential Address'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-assignment-ind cyan-text text-darken-2'></i> Zip Code: "+data[0][25]+"</span>"+
						"			<button data-value='"+data[0][25]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Residential Zipcode' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Zip Code'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Telephone Number: "+data[0][26]+"</span>"+
						"			<button data-value='"+data[0][26]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Residential Telephone Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Telephone Number'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-home cyan-text text-darken-2'></i> Permanent Address: "+data[0][27]+"</span>"+
						"			<button data-value='"+data[0][27]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Permanent Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Permanent Address'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-assignment-ind cyan-text text-darken-2'></i> Zip Code: "+data[0][28]+"</span>"+
						"			<button data-value='"+data[0][28]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Permanent Zipcode' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Zip Code'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Telephone Number: "+data[0][29]+"</span>"+
						"			<button data-value='"+data[0][29]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Permanent Telephone Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Telephone Number'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-communication-email cyan-text text-darken-2'></i> Email Address: "+data[0][30]+"</span>"+
						"			<button data-value='"+data[0][30]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Email' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Email Address'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-portrait cyan-text text-darken-2'></i> Agency Employee Number: "+data[0][31]+"</span>"+
						"			<button data-value='"+data[0][31]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Employee Agency Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employee Agency Number'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-picture-in-picture cyan-text text-darken-2'></i> Tin: "+data[0][32]+"</span>"+
						"			<button data-value='"+data[0][32]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Tin' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Tin'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div><br/>"+
						"		<div class='input-field col s12'>"+
						"			<p><b>Account Information</b></p>"+
						"			<div class='divider'></div>"+
						"		</div>"+
						"		<div class='input-field col s12'>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-work cyan-text text-darken-2'></i> Position: "+data[0][12]+"</span>"+
						"			<button data-value='"+data[0][12]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Position'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-box cyan-text text-darken-2'></i> Employee ID: "+data[0][2]+"</span>"+
						"			<button disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Employee ID' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employee ID'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
				$("#personal_information").html(content);

				print += "<div id='profile-card' class='card'>"+
							"<div class='card-content'>"+
								"<font size='4'>"+
								"<table style='border-collapse: collapse;width:100%;'>"+

									"<td style='border: 1px solid black;'><p style='text-align: center;'><font size='6'><b>Personal Data Sheet</b></font></p>"+
										"<span style='text-align: left;'><font size='1'>Print Legibly. Mark appropriate boxes with / and use separate sheet if necessary.<span style='padding-left:29.2%;'></span><span style='background-color:black ! important;'>1. CS ID No.</span> <input style='width:17.7%;'/></font></span>"+
									"</td>"+
		  							
								"</table>"+
								"</font>"+
							"</div>"+
						"</div>";
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
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-account-circle cyan-text text-darken-2'></i> Spouse's Surename: "+data[0][2]+"</span>"+
						"			<button data-value='"+data[0][2]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Surename' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-circle cyan-text text-darken-2'></i> First Name: "+data[0][3]+"</span>"+
						"			<button data-value='"+data[0][3]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update First Name'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-circle cyan-text text-darken-2'></i> Middle Name: "+data[0][4]+"</span>"+
						"			<button data-value='"+data[0][4]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Middle Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Middle Name'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-work cyan-text text-darken-2'></i> Occupation: "+data[0][5]+"</span>"+
						"			<button data-value='"+data[0][5]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Occupation' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Occupation'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Employer/Bus Name: "+data[0][6]+"</span>"+
						"			<button data-value='"+data[0][6]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Employer/Bus Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-store cyan-text text-darken-2'></i> Business Address: "+data[0][7]+"</span>"+
						"			<button data-value='"+data[0][7]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Business Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Business Address'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Telephone Number: "+data[0][8]+"</span>"+
						"			<button data-value='"+data[0][8]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Telephone Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Telephone Number'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Father's surname: "+data[0][9]+"</span>"+
						"			<button data-value='"+data[0][9]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Father Surename' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surename'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> First Name: "+data[0][10]+"</span>"+
						"			<button data-value='"+data[0][10]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Father First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update First Name'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Middle Name: "+data[0][11]+"</span>"+
						"			<button data-value='"+data[0][11]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Father Middle Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Middle Name'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people-outline cyan-text text-darken-2'></i> Mother's surename: "+data[0][12]+"</span>"+
						"			<button data-value='"+data[0][12]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Mother Surename' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surename'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people-outline cyan-text text-darken-2'></i> First Name: "+data[0][13]+"</span>"+
						"			<button data-value='"+data[0][13]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Mother First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update First Name'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people-outline cyan-text text-darken-2'></i> Middle Name: "+data[0][14]+"</span>"+
						"			<abuttondata-value='"+data[0][14]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Mother Middle Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Middle Name'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
				$("#family_background").html(content);

				print += "<div id='profile-card' class='card'>"+
						"    <div class='card-content'>"+
						"		<h5>Family Background</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-account-circle cyan-text text-darken-2'></i> Spouse's Surename: "+data[0][2]+"</span>"+
						"			<button data-value='"+data[0][2]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Surename' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-circle cyan-text text-darken-2'></i> First Name: "+data[0][3]+"</span>"+
						"			<button data-value='"+data[0][3]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update First Name'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-circle cyan-text text-darken-2'></i> Middle Name: "+data[0][4]+"</span>"+
						"			<button data-value='"+data[0][4]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Middle Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Middle Name'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-work cyan-text text-darken-2'></i> Occupation: "+data[0][5]+"</span>"+
						"			<button data-value='"+data[0][5]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Occupation' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Occupation'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Employer/Bus Name: "+data[0][6]+"</span>"+
						"			<button data-value='"+data[0][6]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Employer/Bus Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-store cyan-text text-darken-2'></i> Business Address: "+data[0][7]+"</span>"+
						"			<button data-value='"+data[0][7]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Business Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Business Address'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Telephone Number: "+data[0][8]+"</span>"+
						"			<button data-value='"+data[0][8]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Telephone Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Telephone Number'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Father's surname: "+data[0][9]+"</span>"+
						"			<button data-value='"+data[0][9]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Father Surename' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surename'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> First Name: "+data[0][10]+"</span>"+
						"			<button data-value='"+data[0][10]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Father First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update First Name'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Middle Name: "+data[0][11]+"</span>"+
						"			<button data-value='"+data[0][11]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Father Middle Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Middle Name'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people-outline cyan-text text-darken-2'></i> Mother's surename: "+data[0][12]+"</span>"+
						"			<button data-value='"+data[0][12]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Mother Surename' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surename'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people-outline cyan-text text-darken-2'></i> First Name: "+data[0][13]+"</span>"+
						"			<button data-value='"+data[0][13]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Mother First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update First Name'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people-outline cyan-text text-darken-2'></i> Middle Name: "+data[0][14]+"</span>"+
						"			<abuttondata-value='"+data[0][14]+"' disabled data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Mother Middle Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Middle Name'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"    </div>"+
						"</div>";

				// employee.deactivate();
				// employee.activate();
				// employee.updateFamily();
				// employee.updatePicture();
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
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateChild' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of Child' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Name of child'>"+
							"				<i class='mdi-editor-mode-edit right grey-text' data-cmd='value'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Date Of Birth: "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updateChild' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Birthday' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Date Of Birth'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br>";		

        		});

        		content += 	"</div>"+
							"</div>";
				$("#childs").html(content);
			}
		});

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
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+data[0][2]+"</span>"+
						"			<button data-value='"+data[0][2]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of School' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Name Of School'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+data[0][3]+"</span>"+
						"			<button data-value='"+data[0][3]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Degree Course' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Degree Course'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+data[0][4]+"</span>"+
						"			<button data-value='"+data[0][4]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Year Graduated' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Year Graduated'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+data[0][5]+"</span>"+
						"			<button data-value='"+data[0][5]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Highest Grade' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update  Highest Grade/Level/Units Earned'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance: "+data[0][6]+"</span>"+
						"			<button data-value='"+data[0][6]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+data[0][7]+"</span>"+
						"			<button data-value='"+data[0][7]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Scholarship/Non Academics Honor Recieved' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Scholarship/Academics Honors Recieved'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div></br>"+
						"		<h5>Secondary Level</h5>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+data[0][8]+"</span>"+
						"			<button data-value='"+data[0][8]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Name Of School'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+data[0][9]+"</span>"+
						"			<button data-value='"+data[0][9]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Degree' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Degree Course'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+data[0][10]+"</span>"+
						"			<button data-value='"+data[0][10]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Year' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Year Graduated'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+data[0][11]+"</span>"+
						"			<button data-value='"+data[0][11]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Grade' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update  Highest Grade/Level/Units Earned'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance: "+data[0][12]+"</span>"+
						"			<button data-value='"+data[0][12]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+data[0][13]+"</span>"+
						"			<button data-value='"+data[0][13]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Scholarship' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Scholarship/Academics Honors Recieved'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
				$("#educational_background").html(content);

				// employee.deactivate();
				// employee.activate();
				// employee.updateEducation();
				// employee.updatePicture();
			}
		});

		var content="";
		var data = system.ajax('../assets/harmony/Process.php?get-vocational',id);
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
							"		<h5>Vocational/Trade Course</h5>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of School' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Name Of School'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Degree Course' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Degree Course'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+value[4]+"</span>"+
							"			<button data-value='"+value[4]+"' disabled data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Year Graduated' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Year Graduated'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+value[5]+"</span>"+
							"			<button data-value='"+value[5]+"' disabled data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Highest Grade' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update  Highest Grade/Level/Units Earned'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance: "+value[6]+"</span>"+
							"			<button data-value='"+value[6]+"' disabled data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+value[7]+"</span>"+
							"			<button data-value='"+value[7]+"' disabled data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Scholarship/Non Academics Honor Recieved' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Scholarship/Academics Honors Recieved'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
							"</div>"+
							"</div>";
        		});
        		
				$("#vocational").html(content);

				// employee.deactivate();
				// employee.activate();
				// employee.updateVocational();
				// employee.updatePicture();
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
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of School' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Name Of School'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Degree Course' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Degree Course'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+value[4]+"</span>"+
							"			<button data-value='"+value[4]+"' disabled data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Year Graduated' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Year Graduated'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+value[5]+"</span>"+
							"			<button data-value='"+value[5]+"' disabled data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Highest Grade' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update  Highest Grade/Level/Units Earned'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance: "+value[6]+"</span>"+
							"			<button data-value='"+value[6]+"' disabled data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+value[7]+"</span>"+
							"			<button data-value='"+value[7]+"' disabled data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Scholarship/Non Academics Honor Recieved' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Scholarship/Academics Honors Recieved'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
							"</div>"+
							"</div>";
        		});
        		
				$("#college_level").html(content);

				// employee.deactivate();
				// employee.activate();
				// employee.updateCollege();
				// employee.updatePicture();
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
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Name Of School'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Degree Course'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+value[4]+"</span>"+
							"			<button data-value='"+value[4]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Year Graduated'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+value[5]+"</span>"+
							"			<button data-value='"+value[5]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update  Highest Grade/Level/Units Earned'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance: "+value[6]+"</span>"+
							"			<button data-value='"+value[6]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+value[7]+"</span>"+
							"			<button data-value='"+value[7]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Scholarship/Academics Honors Recieved'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
							"</div>"+
							"</div>";
        		});
        		
				$("#graduate").html(content);

				// employee.deactivate();
				// employee.activate();
				// // employee.update();
				// employee.updatePicture();
			}
		});
		//end
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
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-communication-quick-contacts-mail cyan-text text-darken-2'></i> Career Service: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateCivil' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Career Service' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-stars cyan-text text-darken-2'></i> Rating: "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updateCivil' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Rating' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Date Of Examinantion: "+value[4]+"</span>"+
							"			<button data-value='"+value[4]+"' disabled data-cmd='updateCivil' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date Of Examinantion' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-maps-place cyan-text text-darken-2'></i> Place Of Examination: "+value[5]+"</span>"+
							"			<button data-value='"+value[5]+"' disabled data-cmd='updateCivil' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Place Of Examination' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-description cyan-text text-darken-2'></i> Number: "+value[6]+"</span>"+
							"			<button data-value='"+value[6]+"' disabled data-cmd='updateCivil' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Date Of Release: "+value[7]+"</span>"+
							"			<button data-value='"+value[7]+"' disabled data-cmd='updateCivil' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date Of Release' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
							"</div>"+
							"</div>";
        		});
        		
				$("#civil").html(content);

				// employee.deactivate();
				// employee.activate();
				// employee.updateCivil();
				// employee.updatePicture();
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
				
				content +=	"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Inclusive Dates: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-assignment-ind cyan-text text-darken-2'></i> Position Title: "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position Title' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-work cyan-text text-darken-2'></i> Department/Agency/Office/Company: "+value[4]+"</span>"+
							"			<button data-value='"+value[4]+"' disabled data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Department' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-attach-money cyan-text text-darken-2'></i> Monthly Salary: "+value[5]+"</span>"+
							"			<button data-value='"+value[5]+"' disabled data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Monthly Salary' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-grade cyan-text text-darken-2'></i> Salary Grade: "+value[6]+"</span>"+
							"			<button data-value='"+value[6]+"' disabled data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Salary Grade' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-info cyan-text text-darken-2'></i> Status Of Appointment: "+value[7]+"</span>"+
							"			<button data-value='"+value[7]+"' disabled data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Status Of Appointment' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-image-portrait cyan-text text-darken-2'></i> Gov't Service: "+value[8]+"</span>"+
							"			<button data-value='"+value[8]+"' disabled data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Government Service' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
        		});

				content += 	"</div>"+
							"</div>";
        		
				$("#work").html(content);

				// employee.deactivate();
				// employee.activate();
				// employee.updateWork();
				// employee.updatePicture();
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
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-maps-map cyan-text text-darken-2'></i> Name & address of organization: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateVoluntary' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Inclusive Dates(from-to): "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updateVoluntary' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-format-list-numbered cyan-text text-darken-2'></i> Number of Hours: "+value[4]+"</span>"+
							"			<button data-value='"+value[4]+"' disabled data-cmd='updateVoluntary' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Number of hours' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-wallet-membership cyan-text text-darken-2'></i> Position: "+value[5]+"</span>"+
							"			<button data-value='"+value[5]+"' disabled data-cmd='updateVoluntary' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
        		});

        		content += 	"</div>"+
							"</div>";

        		
				$("#voluntary").html(content);

				// employee.deactivate();
				// employee.activate();
				// employee.updateVoluntary();
				// employee.updatePicture();
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
				
				content +=	"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-description cyan-text text-darken-2'></i> Title of seminar: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateTraining' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Title of seminar' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Inclusive Dates: "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updateTraining' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-format-list-numbered cyan-text text-darken-2'></i> Number of hours: "+value[4]+"</span>"+
							"			<button data-value='"+value[4]+"' disabled data-cmd='updateTraining' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Number of hours' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-people cyan-text text-darken-2'></i> Conducted/Sponsored by: "+value[5]+"</span>"+
							"			<button data-value='"+value[5]+"' disabled data-cmd='updateTraining' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Conducted/Sponsored by' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
							"</div>"+
							"</div>";
        		});
        		
				$("#training").html(content);

				// employee.deactivate();
				// employee.activate();
				// employee.updateTraining();
				// employee.updatePicture();
			}
		});

		var content="";
		var data = system.ajax('../assets/harmony/Process.php?get-skills',id);
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
							"		<h5>Other Information</h5>"+
							"		<h6>Special Skills/Hobbies</h6>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-maps-directions-walk cyan-text text-darken-2'></i> Special Skills/Hobbies: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateSkills' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Special skills/Hobbies' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"
							"</div>"+
							"</div>";
        		});
        		
				$("#skills").html(content);

				// employee.deactivate();
				// employee.activate();
				// employee.updateSkills();
				// employee.updatePicture();
			}
		});

		var content="";
		var data = system.ajax('../assets/harmony/Process.php?get-nonAcademic',id);
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
							"		<h5>Other Information</h5>"+
							"		<h6>Non-Academic Distinctions/Recognition</h6>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-maps-local-attraction cyan-text text-darken-2'></i> Non-Academic distinctions/Organization: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateNonAcademic' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Non-Academic distinctions/Organization' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>";
							"</div>"+
							"</div>";
        		});
        		
				$("#non_academic").html(content);

				// employee.deactivate();
				// employee.activate();
				// employee.updateNonAcademic();
				// employee.updatePicture();
			}
		});

		var content="";
		var data = system.ajax('../assets/harmony/Process.php?get-membership',id);
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
							"		<h5>Other Information</h5>"+
							"		<h6>Membership in Association/Organization</h6>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-group cyan-text text-darken-2'></i> Membership in Association/Organization: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateMembership' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Membership in organization/Association' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>";
							"</div>"+
							"</div>";
        		});
        		
				$("#membership").html(content);

				// employee.deactivate();
				// employee.activate();
				// employee.updateMembership();
				// employee.updatePicture();
			}
		});

		var content="";
		var data = system.ajax('../assets/harmony/Process.php?get-questions',id);
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

				content = "<div id='profile-card' class='card'>"+
						"    <div class='card-content'>"+
						"		<h5>Other Information</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-question-answer cyan-text text-darken-2'></i>Within the third degree(for National Government Employees)...?: "+data[0][2]+"</span>"+
						"			<button data-value='"+data[0][2]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Within the third degree(for National Government Employees):appointing authority, recomendiing authority, chief of office/bureau/department or person who has immediate supervision on you in the Office, Bureau or Deaprtment where you will be apointed?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][3]+"</span>"+
						"			<button data-value='"+data[0][3]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 36 A' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-question-answer cyan-text text-darken-2'></i>Within the fourth degree(for Local Government Employees)...?: "+data[0][4]+"</span>"+
						"			<button data-value='"+data[0][4]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Within the fourth degree(for Local Government Employees)appointing authority, recommending authority where you will be apointed?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][5]+"</span>"+
						"			<button data-value='"+data[0][5]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 36 B' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-question-answer cyan-text text-darken-2'></i> Have you ever been formally charged?: "+data[0][6]+"</span>"+
						"			<button data-value='"+data[0][6]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Have you ever been formally charged?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][7]+"</span>"+
						"			<button data-value='"+data[0][7]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 37 A' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-question-answer cyan-text text-darken-2'></i> Have you ever been guilty of any administrative offense?: "+data[0][8]+"</span>"+
						"			<button data-value='"+data[0][8]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Have you ever been guilty of any administrative offense?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][9]+"</span>"+
						"			<button data-value='"+data[0][9]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 37 B' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-question-answer cyan-text text-darken-2'></i>Have you ever been convicted of any crime...?: "+data[0][10]+"</span>"+
						"			<button data-value='"+data[0][10]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Have you ever been convicted of any crime or violation of any law, decree, ordinance or regulation by any court or tribunal?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][11]+"</span>"+
						"			<button data-value='"+data[0][11]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 38' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-question-answer cyan-text text-darken-2'></i> Have you ever been separated from the service..?: "+data[0][12]+"</span>"+
						"			<button data-value='"+data[0][12]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Have you ever been separated from the service in any following modes: resignation, retirement, dropped from the rolls, dismissal, terminantion, end of term, finished contract AWOL or phase out in the public or private sector?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][13]+"</span>"+
						"			<button data-value='"+data[0][13]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 39' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-question-answer cyan-text text-darken-2'></i> Have you been candidate in a national or local election...?: "+data[0][14]+"</span>"+
						"			<button data-value='"+data[0][14]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Have you been candidate in a national or local election(exept Brangay election)?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][15]+"</span>"+
						"			<button data-value='"+data[0][15]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 40' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-question-answer cyan-text text-darken-2'></i> Are you a member of any indigenous group?: "+data[0][16]+"</span>"+
						"			<button data-value='"+data[0][16]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Are you a member of any indigenous group?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][17]+"</span>"+
						"			<button data-value='"+data[0][17]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 41 A' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-question-answer cyan-text text-darken-2'></i> Are you differently abled?: "+data[0][18]+"</span>"+
						"			<button data-value='"+data[0][18]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Are you differently abled?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][19]+"</span>"+
						"			<button data-value='"+data[0][19]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 41 B' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-question-answer cyan-text text-darken-2'></i> Are you a solo parent?: "+data[0][20]+"</span>"+
						"			<button data-value='"+data[0][20]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Are you a solo parent?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][21]+"</span>"+
						"			<button data-value='"+data[0][21]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 41 C' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
				$("#questions").html(content);
			}
		});

		var content="";
		var data = system.ajax('../assets/harmony/Process.php?get-references',id);
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

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>Other Information</h5>"+
							"		<h6>References</h6>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-person cyan-text text-darken-2'></i> Name: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateReferences' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Name'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-home cyan-text text-darken-2'></i> Address: "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updateReferences' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Address'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-settings-phone cyan-text text-darken-2'></i> Telephone Number: "+value[4]+"</span>"+
							"			<button data-value='"+value[4]+"' disabled data-cmd='updateReferences' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Telephone Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Telephone Number'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p><br />";
        		});

        		content += "</div>"+
							"</div>";

        		
				$("#references").html(content);
			}
		});

		$("#printme").html(print);

		$("a[data-cmd='print_pds']").on('click',function(){
			$(print).print();
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
		this.departmentList();
	},
	get:function(){
		var data = system.html('../assets/harmony/Process.php?get-employeeAccount');
		return data;
	},
	accounts:function(id){
		var content = "", chips = [],chipsContent = "";
		var data = system.ajax('../assets/harmony/Process.php?get-listEmployeeAccount',id);
		data = JSON.parse(data.responseText);
		$.each(data,function(i,v){
			if(Number(v[5]) == 1){
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
						"	<td>"+v[2]+"</td>"+
						"	<td>"+v[3]+"</td>"+
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
	departmentList:function(){
		var content = "", search;
		var data = client.get();
		data = JSON.parse(data.responseText);
		if(data.length>0){			
			var getEmployee = system.ajax('../assets/harmony/Process.php?get-allAccountCount',"");
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
						"		<th>#</th><th>Department</th><th>Number of Account</th><th>Status</th><th></th>"+
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
		    	$(location).attr('href','#cmd=index;content=focus_account;'+data);			
			});
		}
		else{
			$("#display_clientList").html("<h5 class='center'>No Departments to show.</h5>");
		}
	},
	add:function(id){
		$("#add_account").on('click',function(){
			var data = system.xml("pages.xml");
			$(data.responseText).find("addAccount_employee").each(function(i,content){
				$("#modal_popUp .modal-content").html(content);
				$('#modal_popUp').openModal('show');

				$("#field_password").on('focus',function(){
					$("#note_password").removeClass('zoomOut hidden').addClass("zoomIn");
				}).on('blur',function(){
					$("#note_password").removeClass('zoomIn').addClass('zoomOut hidden');
				});

				$("#field_username").on('focus',function(){
					$("#note_username").removeClass('zoomOut hidden').addClass("zoomIn");
				}).on('blur',function(){
					$("#note_username").removeClass('zoomIn').addClass('zoomOut hidden');
				});			

				$("#form_addAcccount_employee").validate({
				    rules: {
				        field_name: {required: true,maxlength: 50},
				        field_email: {required: true,maxlength: 50,checkEmail:true},
				        field_username: {required: true,maxlength: 50},
				        field_password: {required: true,maxlength: 50},
				        // field_username: {required: true,maxlength: 50,checkUsername:true,validateUsername:true},
				        // field_password: {required: true,maxlength: 50,checkPassword:true,validatePassword:true},
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
						var data = system.ajax('../assets/harmony/Process.php?set-newEmployeeAccount',[id,_form]);
						data.done(function(data){
							console.log(_form);
							console.log(data);
							if(data == 1){
								if(data.responseText != ""){
									system.clearForm();
									Materialize.toast('Saved.',4000);
									App.handleLoadPage("#cmd=index;content=focus_account");
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
			
				if(Number(data[0][5]) == 1){
					status = "Active";
					var actions = "<a data-cmd='deactivateEmployee' data-name='"+data[0][2]+"' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock-open right black-text'></i>"+
								  "</a>";	
				}
				else{
					status = "Deactivated";
					var actions = "<a data-cmd='activateEmployee' data-name='"+data[0][2]+"' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock right black-text'></i>"+
								  "</a>";	
				}

				content =  "<div id='profile-card' class='card'>"+
						"    <div class='card-image waves-effect waves-block waves-light'>"+
						"        <img class='activator' src='../assets/images/user-bg.jpg' alt='user background'>"+
						"    </div>"+
						"    <div class='card-content'>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Name: "+data[0][2]+"</span>"+
						"			<a data-cmd='updateEmployeeAccount' data-value='"+data[0][2]+"' data-name='"+data[0][1]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update email'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><i class='mdi-action-info-outline cyan-text text-darken-2'></i> Status: "+status+actions+"</p>"+

						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Username: "+data[0][3]+"</span>"+
						"			<a data-cmd='updateEmployeeAccount' data-value='"+data[0][3]+"' data-name='"+data[0][1]+"' data-node='"+data[0][0]+"' data-prop='Username' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update uaername'>"+
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

				$("#details").html(content);
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

SALN ={
	ini:function(){

	},
	departmentList:function(){
		var content = "", search;
		var data = client.get();
		data = JSON.parse(data.responseText);
		if(data.length>0){			
			var getEmployee = system.ajax('../assets/harmony/Process.php?get-allSALNcount',"");
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
						"		<th>#</th><th>Department</th><th>Number of Employee</th><th>Status</th><th></th>"+
						"	</tr>"+
						"</thead>"+
						"</tbody>"+
							content+
						"</tbody>"+
						"</table>";
			$("#display_departmentList").html(content);

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
		    	$(location).attr('href','#cmd=index;content=focusSALN;'+data);			
			});
		}
		else{
			$("#display_departmentList").html("<h5 class='center'>No Departments to show.</h5>");
		}
	},
	saln:function(id){
		var content = "", chips = [],chipsContent = "";
		var data = system.ajax('../assets/harmony/Process.php?get-listEmployeeSALN',id);
		data = JSON.parse(data.responseText);
		$.each(data,function(i,v){
			if(Number(v[16]) == 1){
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
						"	<td>"+v[3]+"</td>"+
						"	<td>"+v[4]+"</td>"+
						"	<td>"+status+"</td>"+
						"	<td width='1px'>"+
						"		<a href='#cmd=index;content=focusSALNdetails;"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='0' data-tooltip='Show Details' data-cmd='update'>"+
						"			<i class='mdi-navigation-more-vert right black-text'></i>"+
						"		</a>"+
						"	</td>"+
						"</tr>";
		});

		content = "<table class='table bordered center' id='products'>"+
					"<thead>"+
					"	<tr>"+
					"		<th>#</th><th>Family Name</th><th>First Name</th><th>Status</th><th></th>"+
					"	</tr>"+
					"</thead>"+
					"</tbody>"+
						content+
					"</tbody>"+
					"</table>";
		$("#display_saln").html(content);

		var table = $('#products').DataTable({
	        "order": [[ 0, 'asc' ]],
	        "drawCallback": function ( settings ) {
	            var api = this.api();
	            var rows = api.rows( {page:'current'} ).nodes();
	            var last=null;
	        }
	    });
	},
	details:function(id){
		var content = "";
		var bago = "";
		var data = system.ajax('../assets/harmony/Process.php?get-adminSALNpersonalInfo',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);

			if(data.length<=0){
					bago = 	"<div class='col s12 m4 l4 input-field right'>"+
							"<a class='btn waves-effect waves-light orange right' data-cmd='add_personalInfo'>Add</a>"+
							"</div>";
				
					$("#display_error").html(bago);
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				if(Number(data[0][16]) == 1){
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
				
				content ="<div id='profile-card' class='card'>"+
						"    <div class='card-image waves-effect waves-block waves-light'>"+
						"        <img class='activator' src='../assets/images/user-bg.jpg' alt='user background'>"+
						"    </div>"+
						"    <div class='card-content'>"+
						"        <span class='card-title activator grey-text text-darken-4'>"+data[0][3]+" "+data[0][4]+" "+data[0][5]+" </span>"+
						"			<button disabled data-value='"+JSON.stringify([data[0][3],data[0][4],data[0][5]])+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 <div class='divider'></div>"+
						"        <p><i class='mdi-action-info-outline cyan-text text-darken-2'></i> Status: "+status+actions+"</p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-home cyan-text text-darken-2'></i> Address: "+data[0][6]+"</span>"+
						"			<button disabled data-value='"+data[0][6]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-person-outline cyan-text text-darken-2'></i> Position: "+data[0][7]+"</span>"+
						"			<button disabled data-value='"+data[0][7]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-store-mall-directory cyan-text text-darken-2'></i> Agency/Office: "+data[0][8]+"</span>"+
						"			<button disabled data-value='"+data[0][8]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Office/Agency' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-home cyan-text text-darken-2'></i> Office Address: "+data[0][9]+"</span>"+
						"			<button disabled data-value='"+data[0][9]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Office Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Family Name: "+data[0][10]+"</span>"+
						"			<button disabled data-value='"+data[0][10]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Last Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> First Name: "+data[0][11]+"</span>"+
						"			<button disabled data-value='"+data[0][11]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Middle Initial: "+data[0][12]+"</span>"+
						"			<button disabled data-value='"+data[0][12]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Middle Initial' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person-outline cyan-text text-darken-2'></i> Position: "+data[0][13]+"</span>"+
						"			<button disabled data-value='"+data[0][13]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-store-mall-directory cyan-text text-darken-2'></i> Agency/Office: "+data[0][14]+"</span>"+
						"			<button disabled data-value='"+data[0][14]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Agency/Office' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-home cyan-text text-darken-2'></i> Office Address: "+data[0][15]+"</span>"+
						"			<button disabled data-value='"+data[0][15]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Office Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
				$("#personalInfo").html(content);

				// SALN.activate();
				// SALN.deactivate();

				}
		});
		
		var content="";
		var bago="";
		var data = system.ajax('../assets/harmony/Process.php?get-adminUnmarriedChild',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
				
			if(data.length<=0){
					bago = 	"<div class='col s12 m4 l4 input-field right'>"+
							"<a class='btn waves-effect waves-light orange right' data-cmd='add_personalInfo'>Add</a>"+
							"</div>";
				
					$("#display_error").html(bago);
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>Unmarried Children Below(18) Years of Age Living in Declarant's Household</h5>";

				$(data).each(function(index,value){
            		// data.length;
            		// console.log(value);
				
				content +=	"        <br /><p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-person cyan-text text-darken-2'></i> Name Of Child: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateUnmarried' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of Child' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Name Of Child '>"+
							"				<i class='mdi-editor-mode-edit right grey-text' data-cmd='value'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Date Of Birth: "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updateUnmarried' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date Of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Date Of Birth'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-toggle-check-box cyan-text text-darken-2'></i> Age: "+value[4]+"</span>"+
							"			<button data-value='"+value[4]+"' disabled data-cmd='updateUnmarried' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Age' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Age'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br>";
							
        		});

        		content += 	"</div>"+
							"</div>";
        		
				$("#unmarriedChild").html(content);
			}
		});

		var content="";
		var bago="";
		var subTotalA = 0;
		var data = system.ajax('../assets/harmony/Process.php?get-adminReal',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
		
			if(data.length<=0){
				bago = 	"<div class='col s12 m4 l4 input-field right'>"+
						"<a class='btn waves-effect waves-light orange right' data-cmd='add_personalInfo'>Add</a>"+
						"</div>";
			
				$("#display_error").html(bago);
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card'>"+
							"   <div class='card-content'>"+
							"		<h5>Assets</h5>"+
							"		<h6>a. Real Properties</h6>";

				$(data).each(function(index,value){
            		// data.length;
            		// console.log(value);
					subTotalA = subTotalA + Number(value[9]);

				content +=	"        <br /><p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-description cyan-text text-darken-2'></i> Description: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateReal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Description' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text' data-cmd='value'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-image-landscape cyan-text text-darken-2'></i> Kind: "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updateReal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Kind' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-maps-place cyan-text text-darken-2'></i> Exact Location: "+value[4]+"</span>"+
							"			<button data-value='"+value[4]+"' disabled data-cmd='updateReal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Exact Location' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update '>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-attach-money cyan-text text-darken-2'></i> Assessed Value: "+value[5]+"</span>"+
							"			<button data-value='"+value[5]+"' disabled data-cmd='updateReal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Assessed Value' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-maps-local-atm cyan-text text-darken-2'></i> Current Fair Market Value: "+value[6]+"</span>"+
							"			<button data-value='"+value[6]+"' disabled data-cmd='updateReal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Current Fair Market Value' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text' data-cmd='value'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Acqusition Year: "+value[7]+"</span>"+
							"			<button data-value='"+value[7]+"' disabled data-cmd='updateReal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Acqusition Year' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-mode-comment cyan-text text-darken-2'></i> Acqusition Mode: "+value[8]+"</span>"+
							"			<button data-value='"+value[8]+"' disabled data-cmd='updateReal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Acqusition Mode' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-attach-money cyan-text text-darken-2'></i> Acqusition Cost: "+value[9]+"</span>"+
							"			<button data-value='"+value[9]+"' disabled data-cmd='updateReal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Acqusition Cost' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br>";
							
        		});
				localStorage.setItem('TotalA',subTotalA);
        		content += 	"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-attach-money cyan-text text-darken-2'></i> Subtotal: "+subTotalA+"</span>"+
        					"		 </p>"+
							"</div>"+
							"</div>";
        		
				$("#real").html(content);
			}
		});

		var content="";
		var bago="";
		var subTotalB=0;
		var a = "", b="", totalAssets=0;
		var data = system.ajax('../assets/harmony/Process.php?get-adminPersonal',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
			
			if(data.length<=0){
				bago = 	"<div class='col s12 m4 l4 input-field right'>"+
						"<a class='btn waves-effect waves-light orange right' data-cmd='add_personalInfo'>Add</a>"+
						"</div>";
			
				$("#display_error").html(bago);
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card'>"+
							"   <div class='card-content'>"+
							"		<h6>b. Personal Properties</h6>";

				$(data).each(function(index,value){
            		// data.length;
            		// console.log(value);
					subTotalB = subTotalB + Number(value[4]);

				content +=	"        <br /><p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-description cyan-text text-darken-2'></i> Description: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updatePersonal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Description' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text' data-cmd='value'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Year Acquired: "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updatePersonal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Year Acquired' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-attach-money cyan-text text-darken-2'></i> Acquisition Cost/Amount: "+value[4]+"</span>"+
							"			<button data-value='"+value[4]+"' disabled data-cmd='updatePersonal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Acquisition Cost/Amount' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br>";
        		});
				localStorage.setItem('TotalB',subTotalB);
				a = localStorage.getItem('TotalA');
				b = localStorage.getItem('TotalB');
				totalAssets=(Number(a)+Number(b));

        		content += 	"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-attach-money cyan-text text-darken-2'></i> Subtotal: "+subTotalB+"</span>"+
							"		 </p>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-maps-local-atm cyan-text text-darken-2'></i> Total Assets(a+b): "+totalAssets+"</span>"+
							"		 </p>"+
							"</div>"+
							"</div>";
        		
				$("#personal").html(content);
			}
		});

		var content="";
		var bago="";
		var data = system.ajax('../assets/harmony/Process.php?get-adminLiabilities',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
		
			if(data.length<=0){
				bago = 	"<div class='col s12 m4 l4 input-field right'>"+
						"<a class='btn waves-effect waves-light orange right' data-cmd='add_personalInfo'>Add</a>"+
						"</div>";
			
				$("#display_error").html(bago);
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card'>"+
							"   <div class='card-content'>"+
							"		<h5>Liabilities</h5>";

				$(data).each(function(index,value){
            		// data.length;
            		// console.log(value);
				
				content +=	"        <br /><p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-picture-in-picture cyan-text text-darken-2'></i> Nature: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateLiabilities' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Nature' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text' data-cmd='value'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-communication-quick-contacts-mail cyan-text text-darken-2'></i> Name Of Creditors: "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updateLiabilities' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of Creditors' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-attach-money cyan-text text-darken-2'></i> Outstanding Balance: "+value[4]+"</span>"+
							"			<button data-value='"+value[4]+"' disabled data-cmd='updateLiabilities' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Outstanding Balance' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br>";
        		});
				
        		content += 	"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-attach-money cyan-text text-darken-2'></i> Total Liabilities:</span>"+
							"		 </p>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-maps-local-atm cyan-text text-darken-2'></i> Net Worth:Total Assets less Total Liabilities=</span>"+
							"		 </p>"+
							"</div>"+
							"</div>";
        		
				$("#liabilities").html(content);
			}
		});

		var content="";
		var bago="";
		var data = system.ajax('../assets/harmony/Process.php?get-adminBusiness',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
			if(data.length<=0){
				bago = 	"<div class='col s12 m4 l4 input-field right'>"+
						"<a class='btn waves-effect waves-light orange right' data-cmd='add_personalInfo'>Add</a>"+
						"</div>";
			
				$("#display_error").html(bago);
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card'>"+
							"   <div class='card-content'>"+
							"		<h5>Business Interests And Financial Connections</h5>";

				$(data).each(function(index,value){
            		// data.length;
            		// console.log(value);
				
				content +="        <br /><p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Name Of Entity/Business Enterprise: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateBusiness' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of Entity' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text' data-cmd='value'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-home cyan-text text-darken-2'></i> Business Address: "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updateBusiness' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Business Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-label cyan-text text-darken-2'></i> Nature Of Business /Or Financial Connection: "+value[4]+"</span>"+
							"			<button data-value='"+value[4]+"' disabled data-cmd='updateBusiness' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Nature Of Business' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-event cyan-text text-darken-2'></i> Date Of Acquisition Of Interests Or Connector: "+value[5]+"</span>"+
							"			<button data-value='"+value[5]+"' disabled data-cmd='updateBusiness' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date Of Acquisition Of Interests' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br>";
        		});
				
        		content += 	"</div>"+
							"</div>";
        		
				$("#business").html(content);
			}
		});

		var content="";
		var bago="";
		var data = system.ajax('../assets/harmony/Process.php?get-adminRelatives',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
		
			if(data.length<=0){
				bago = 	"<div class='col s12 m4 l4 input-field right'>"+
						"<a class='btn waves-effect waves-light orange right' data-cmd='add_personalInfo'>Add</a>"+
						"</div>";
			
				$("#display_error").html(bago);
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card'>"+
							"   <div class='card-content'>"+
							"		<h5>Relatives in the Government Service</h5>";

				$(data).each(function(index,value){
            		// data.length;
            		// console.log(value);
				
				content +=	"        <br /><p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-face-unlock cyan-text text-darken-2'></i> Name Of Relative: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateRelatives' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of Relative' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text' data-cmd='value'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-group cyan-text text-darken-2'></i> Relationship: "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updateRelatives' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Relationship' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-location-city cyan-text text-darken-2'></i> Position: "+value[4]+"</span>"+
							"			<button data-value='"+value[4]+"' disabled data-cmd='updateRelatives' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-toggle-radio-button-on cyan-text text-darken-2'></i> Name Of Agency/Office And Address: "+value[5]+"</span>"+
							"			<button data-value='"+value[5]+"' disabled data-cmd='updateRelatives' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of Agency/Office And Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br>";
        		});
				
        		content += 	"</div>"+
							"</div>";
        		
				$("#relatives").html(content);
			}
		});
	},
}

travel = {
	ini:function(){

	},
	pending:function(){
		var content = "", chips = [],chipsContent = "";
		var data = system.ajax('../assets/harmony/Process.php?get-adminTravelPending',"");
		data = JSON.parse(data.responseText);

		$.each(data,function(i,v){

			if(String(v[11]) == "Pending"){
					status = "Pending";
					var actions = "<a data-cmd='deactivateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock-open right black-text'></i>"+
								  "</a>";	
				}
			else if(String(v[11]) == "Approved"){
					status = "Approved";
					var actions = "<a data-cmd='activateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock right black-text'></i>"+
								  "</a>";	
				}
			else if(String(v[11]) == "Disapproved"){
				status = "Disapproved";
				var actions = "<a data-cmd='activateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
							  "	<i class='mdi-action-lock right black-text'></i>"+
							  "</a>";	
			}

			var prodPicture = ((v[10] == "") || (v[10] == null))?"default.png":v[10];
			content += "<tr>"+
						"	<td width='1px'>"+(i+1)+". </td>"+
						"	<td width='250px'>"+v[3]+"</td>"+
						"	<td width='180px'>"+v[6]+"</td>"+
						"	<td>"+v[9]+"</td>"+
						"	<td>"+status+"</td>"+
						"	<td>"+v[12]+"</td>"+
						"	<td width='1px'>"+
						"		<a href='#cmd=index;content=focusTravelOrder;"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='0' data-tooltip='Show Details' data-cmd='update'>"+
						"			<i class='mdi-navigation-more-vert right black-text'></i>"+
						"		</a>"+
						"	</td>"+
						"</tr>";
		});

		content = "<table class='table bordered center' id='products'>"+
					"<thead>"+
					"	<tr>"+
					"		<th>#</th><th>Name</th><th>Destination</th><th>Purpose</th><th>Status</th><th>Date</th><th></th>"+
					"	</tr>"+
					"</thead>"+
					"</tbody>"+
						content+
					"</tbody>"+
					"</table>";
		$("#pending").html(content);

		var table = $('#products').DataTable({
	        "order": [[ 0, 'asc' ]],
	        "drawCallback": function ( settings ) {
	            var api = this.api();
	            var rows = api.rows( {page:'current'} ).nodes();
	            var last=null;
	        }
	    });
	},
	approved:function(){
		var content = "", chips = [],chipsContent = "";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-adminTravelApproved',"");
		data = JSON.parse(data.responseText);
		$.each(data,function(i,v){

			if(String(v[11]) == "Pending"){
					status = "Pending";
					var actions = "<a data-cmd='deactivateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock-open right black-text'></i>"+
								  "</a>";	
				}
			else if(String(v[11]) == "Approved"){
					status = "Approved";
					var actions = "<a data-cmd='activateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock right black-text'></i>"+
								  "</a>";	
				}
			else if(String(v[11]) == "Disapproved"){
				status = "Disapproved";
				var actions = "<a data-cmd='activateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
							  "	<i class='mdi-action-lock right black-text'></i>"+
							  "</a>";	
			}
			var prodPicture = ((v[10] == "") || (v[10] == null))?"default.png":v[10];
			content += "<tr>"+
						"	<td width='1px'>"+(i+1)+". </td>"+
						"	<td width='250px'>"+v[3]+"</td>"+
						"	<td width='180px'>"+v[6]+"</td>"+
						"	<td>"+v[9]+"</td>"+
						"	<td>"+status+"</td>"+
						"	<td>"+v[12]+"</td>"+
						"	<td width='1px'>"+
						"		<a href='#cmd=index;content=focusTravelOrderApproved;"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='0' data-tooltip='Show Details' data-cmd='update'>"+
						"			<i class='mdi-navigation-more-vert right black-text'></i>"+
						"		</a>"+
						"	</td>"+
						"</tr>";
		});

		content = "<table class='table bordered center' id='products'>"+
					"<thead>"+
					"	<tr>"+
					"		<th>#</th><th>Name</th><th>Destination</th><th>Purpose</th><th>Status</th><th>Date</th><th></th>"+
					"	</tr>"+
					"</thead>"+
					"</tbody>"+
						content+
					"</tbody>"+
					"</table>";
		$("#approved").html(content);

		var table = $('#products').DataTable({
	        "order": [[ 0, 'asc' ]],
	        "drawCallback": function ( settings ) {
	            var api = this.api();
	            var rows = api.rows( {page:'current'} ).nodes();
	            var last=null;
	        }
	    });
	},
	disapproved:function(){
		var content = "", chips = [],chipsContent = "";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-adminTravelDisapproved',"");
		data = JSON.parse(data.responseText);
		$.each(data,function(i,v){

			if(String(v[11]) == "Pending"){
					status = "Pending";
					var actions = "<a data-cmd='deactivateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock-open right black-text'></i>"+
								  "</a>";	
				}
			else if(String(v[11]) == "Approved"){
					status = "Approved";
					var actions = "<a data-cmd='activateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock right black-text'></i>"+
								  "</a>";	
				}
			else if(String(v[11]) == "Disapproved"){
				status = "Disapproved";
				var actions = "<a data-cmd='activateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
							  "	<i class='mdi-action-lock right black-text'></i>"+
							  "</a>";	
			}
			var prodPicture = ((v[10] == "") || (v[10] == null))?"default.png":v[10];
			content += "<tr>"+
						"	<td width='1px'>"+(i+1)+". </td>"+
						"	<td width='250px'>"+v[3]+"</td>"+
						"	<td width='180px'>"+v[6]+"</td>"+
						"	<td>"+v[9]+"</td>"+
						"	<td>"+status+"</td>"+
						"	<td>"+v[12]+"</td>"+
						"	<td width='1px'>"+
						"		<a href='#cmd=index;content=focusTravelOrder;"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='0' data-tooltip='Show Details' data-cmd='update'>"+
						"			<i class='mdi-navigation-more-vert right black-text'></i>"+
						"		</a>"+
						"	</td>"+
						"</tr>";
		});

		content = "<table class='table bordered center' id='products'>"+
					"<thead>"+
					"	<tr>"+
					"		<th>#</th><th>Name</th><th>Destination</th><th>Purpose</th><th>Status</th><th>Date</th><th></th>"+
					"	</tr>"+
					"</thead>"+
					"</tbody>"+
						content+
					"</tbody>"+
					"</table>";
		$("#disapproved").html(content);

		var table = $('#products').DataTable({
	        "order": [[ 0, 'asc' ]],
	        "drawCallback": function ( settings ) {
	            var api = this.api();
	            var rows = api.rows( {page:'current'} ).nodes();
	            var last=null;
	        }
	    });
	},
	travelDetails:function(){
		var content="";
		var bago="";
		var data = system.ajax('../assets/harmony/Process.php?get-travel',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);

			if(String(data[0][11]) == "Pending"){
					status = "Pending";
					var actions = "<a data-cmd='updateTravel' data-value='"+data[0][11]+"' data-prop='Status'  data-name='"+data[0][1]+"' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
								  "	<i class='mdi-editor-mode-edit right black-text'></i>"+
								  "</a>";	
				}
			else if(String(data[0][11]) == "Approved"){
					status = "Approved";
					var actions = "<a data-cmd='updateTravel' data-name='"+data[0][1]+"' data-value='"+data[0][11]+"' data-prop='Status' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-editor-mode-edit right black-text'></i>"+
								  "</a>";	
				}
			else if(String(data[0][11]) == "Disapproved"){
				status = "Disapproved";
				var actions = "<a data-cmd='updateTravel' data-name='"+data[0][1]+"'  data-value='"+data[0][11]+"' data-prop='Status' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
							  "	<i class='mdi-editor-mode-edit right black-text'></i>"+
							  "</a>";	
			}

				content = "<div id='profile-card' class='card'>"+
						"    <div class='card-image waves-effect waves-block waves-light'>"+
						"        <img class='activator' src='../assets/images/user-bg.jpg' alt='user background'>"+
						"    </div>"+
						"    <div class='card-content'>"+
						"		<h5>Travel Order</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Date: "+data[0][2]+"</span>"+
						"			<button data-value='"+data[0][2]+"' disabled data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person-outline cyan-text text-darken-2'></i> Name: "+data[0][3]+"</span>"+
						"			<button data-value='"+data[0][3]+"' disabled data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-local-parking cyan-text text-darken-2'></i> Position: "+data[0][4]+"</span>"+
						"			<button data-value='"+data[0][4]+"' disabled data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-portrait cyan-text text-darken-2'></i> Section: "+data[0][5]+"</span>"+
						"			<button data-value='"+data[0][5]+"' disabled data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Section' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-directions-bus cyan-text text-darken-2'></i> Destination: "+data[0][6]+"</span>"+
						"			<button data-value='"+data[0][6]+"' disabled data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Destination' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Date/Time of Departure: "+data[0][7]+"</span>"+
						"			<button data-value='"+data[0][7]+"' disabled data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date/Time of Departure' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Date/Time of Arrival: "+data[0][8]+"</span>"+
						"			<button data-value='"+data[0][8]+"' disabled data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date/Time of Arrival' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-file-cloud-done cyan-text text-darken-2'></i> Purpose: "+data[0][9]+"</span>"+
						"			<button data-value='"+data[0][9]+"' disabled data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Purpose' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Person(s) to be contacted: "+data[0][10]+"</span>"+
						"			<button data-value='"+data[0][10]+"' disabled data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Persons to be contacted' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><i class='mdi-toggle-check-box cyan-text text-darken-2'></i> Recommendation: "+status+actions+"</p>"+	
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-format-align-justify cyan-text text-darken-2'></i> Due To: "+data[0][13]+"</span>"+
						"			<a data-value='"+data[0][13]+"' data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Due To' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+		
						"    </div>"+
						"</div>";
				$("#pendingDetails").html(content);

				// employee.deactivate();
				// employee.activate();
				travel.update();
				// employee.updatePicture();
		});
	},
	travelApprovedDetails:function(){
		var print = "";
		var content="";
		var bago="";
		var data = system.ajax('../assets/harmony/Process.php?get-travel',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);

			if(String(data[0][11]) == "Pending"){
					status = "Pending";
					var actions = "<a data-cmd='updateTravel' data-value='"+data[0][11]+"' data-prop='Status'  data-name='"+data[0][1]+"' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
								  "	<i class='mdi-editor-mode-edit right black-text'></i>"+
								  "</a>";	
				}
			else if(String(data[0][11]) == "Approved"){
					status = "Approved";
					var actions = "<a data-cmd='updateTravel' data-name='"+data[0][1]+"' data-value='"+data[0][11]+"' data-prop='Status' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-editor-mode-edit right black-text'></i>"+
								  "</a>";	
				}
			else if(String(data[0][11]) == "Disapproved"){
				status = "Disapproved";
				var actions = "<a data-cmd='updateTravel' data-name='"+data[0][1]+"'  data-value='"+data[0][11]+"' data-prop='Status' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
							  "	<i class='mdi-editor-mode-edit right black-text'></i>"+
							  "</a>";	
			}

				content = "<div id='profile-card' class='card'>"+
						"    <div class='card-image waves-effect waves-block waves-light'>"+
						"        <img class='activator' src='../assets/images/user-bg.jpg' alt='user background'>"+
						"    </div>"+
						"    <div class='card-content'>"+
						"		<h5>Travel Order</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-account-circle cyan-text text-darken-2'></i> Date: "+data[0][2]+"</span>"+
						"			<button data-value='"+data[0][2]+"' disabled data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-circle cyan-text text-darken-2'></i> Name: "+data[0][3]+"</span>"+
						"			<button data-value='"+data[0][3]+"' disabled data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-circle cyan-text text-darken-2'></i> Position: "+data[0][4]+"</span>"+
						"			<button data-value='"+data[0][4]+"' disabled data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-work cyan-text text-darken-2'></i> Section: "+data[0][5]+"</span>"+
						"			<button data-value='"+data[0][5]+"' disabled data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Section' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Destination: "+data[0][6]+"</span>"+
						"			<button data-value='"+data[0][6]+"' disabled data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Destination' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-store cyan-text text-darken-2'></i> Date/Time of Departure: "+data[0][7]+"</span>"+
						"			<button data-value='"+data[0][7]+"' disabled data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date/Time of Departure' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Date/Time of Arrival: "+data[0][8]+"</span>"+
						"			<button data-value='"+data[0][8]+"' disabled data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date/Time of Arrival' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Purpose: "+data[0][9]+"</span>"+
						"			<button data-value='"+data[0][9]+"' disabled data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Purpose' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Person(s) to be contacted: "+data[0][10]+"</span>"+
						"			<button data-value='"+data[0][10]+"' disabled data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Persons to be contacted' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><i class='mdi-action-info-outline cyan-text text-darken-2'></i> Recommendation: "+status+actions+"</p>"+	
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Due To: "+data[0][13]+"</span>"+
						"			<a data-value='"+data[0][13]+"' data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Due To' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+		
						"    </div>"+
						"</div>";
				$("#pendingDetails").html(content);

				travel.update();

				print = "<div id='profile-card' class=''>"+
						"    <div class=''>"+
							"<form id='form_me' class='formValidate' method='get' action='' novalidate='novalidate'>"+
							"<div class='row'>"+
								"<div class='col offset-m1 offset-l1 s12 m10 l10'>"+
									"<div class='row'>"+
										"<div class='input-field col s12'>"+
											"<p style='font-size:20px;text-align: center;'><font size='5'>Republic of the Philippines</font></p>"+
											"<p style='margin-top:-3%;text-align: center;' ><font size='5'><b>MUNICIPALITY OF MABINI</font></b></p>"+
											"<p style='margin-top:-3%;text-align: center;' ><font size='5'>PANGASINAN</font></p>"+
											"<p style='margin-top:5%;text-align: center;' ><font size='6'><b>TRAVEL ORDER</b></font></p><br/>"+
										"</div>"+
										"<font size='5'>"+
										"<div class='row'>"+
											"<div class='input-field col s12'>"+
												"<label style='display:block; width:x; height:y; text-align:right;'>Date: <u>"+data[0][2]+"</u></label>"+						        
											"</div>"+
										"</div><br />"+
										"<div class='row'>"+
											"<div class='input-field col s12'>"+
												"<label >Name: <span style='width:70%;display:inline-block;border-bottom:solid black;border-bottom-width:1px;'>"+data[0][3]+"</span></label> "+
											"</div><br />"+
											"<div class='input-field col s12'>"+
												"<label for='field_position'>Position: <span style='width:67%;display:inline-block;border-bottom:solid black;border-bottom-width:1px;'>"+data[0][4]+"</span></label>"+						       
											"</div><br />"+
											"<div class='input-field col s12'>"+
												"<label for='field_section'>Section: <span style='width:67.8%;display:inline-block;border-bottom:solid black;border-bottom-width:1px;'>"+data[0][5]+"</span></label>"+						         
											"</div>"+
										"</div><br />"+
										"<div class='row'>"+
											"<div class='input-field col s12'>"+
												"<label for='field_destination'>Destination: <span style='width:62.6%;display:inline-block;border-bottom:solid black;border-bottom-width:1px;'>"+data[0][6]+"</span></label>"+						        	
											"</div><br />"+
											"<div class='input-field col s12'>"+
												"<label for='field_departure'>Date/Time of Departure: <span style='width:46.3%;display:inline-block;border-bottom:solid black;border-bottom-width:1px;'>"+data[0][7]+"</span></label>"+						         	
											"</div><br />"+
											"<div class='input-field col s12'>"+
												"<label for='field_arrival'>Date/Time of Arrival: <span style='width:50%;display:inline-block;border-bottom:solid black;border-bottom-width:1px;'>"+data[0][8]+"</span></label>"+				          	
											"</div>"+
										"</div><br />"+
										"<div class='row'>"+
											"<div class='input-field col s12'>"+
												"<label for='field_purpose'>Purpose: <span style='width:67.3%;display:inline-block;border-bottom:solid black;border-bottom-width:1px;'>"+data[0][9]+"</span></label>"+					           
											"</div><br />"+
											"<div class='input-field col s12'>"+
												"<label for='field_conducted'>Person(s) to be contacted: <span style='width:44.8%;display:inline-block;border-bottom:solid black;border-bottom-width:1px;'>"+data[0][10]+"</span></label>"+						            	
											"</div>"+
										"</div><br /><br /><br />"+
										"</font>"+
										"<div class='row'>"+
											"<div class='col s4 offset-s6'>"+
												"<span style='padding-left:50%;'><font size='5'>Approved:</font></span>"+
											"</div><br /><br />"+
											"<div class='col s4 offset-s7 center'>"+
												"<font size='5'>"+
												"<span style='padding-left:63%;'><b>ALIMAR R. BRIANA</b></span><br />"+
												"<span style='padding-left:67%;'>Municipal Mayor</span>"+
												"</font>"+
											"</div>"+
										"</div>"+
									"</div><br /><br />"+
								"</div>"+
							"</div>"+
						"</form>"+
						"    </div>"+
						"</div>";
		});	
			
		
		
		$("a[data-cmd='print_travel']").on('click',function(){
			$(print).print();
		});
	},
	update:function(id){
		$("a[data-cmd='updateTravel']").on('click',function(){
			var data = $(this).data();
			var id = data.node;
			// console.log(data);

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

			if(data.prop == "Status"){
				var content = "<h4>Change "+data.prop+"</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<div class='col s12'>"+
						  "		<label for='field_Status' class='active'>Recommendation: </label>"+
						  "		<select name='field_Status'>"+
						  "			<option selected>Approved</option>"+
						  "			<option>Disapproved</option>"+
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
						var data = system.ajax('../assets/harmony/Process.php?update-adminStatus',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Recommendation updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=travelOrderApproved");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Due To"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-adminStatus',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Due updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=travelOrderPending");
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

leave = {
	ini:function(){
	},
	pending:function(){
		var content = "", chips = [],chipsContent = "";
		var data = system.ajax('../assets/harmony/Process.php?get-adminLeavePending',"");
		data = JSON.parse(data.responseText);
		$.each(data,function(i,v){
			var prodPicture = ((v[10] == "") || (v[10] == null))?"default.png":v[10];

			if(String(v[23]) == "Pending"){
					status = "Pending";
					var actions = "<a data-cmd='deactivateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock-open right black-text'></i>"+
								  "</a>";	
				}
			else if(String(v[23]) == "Approved"){
					status = "Approved";
					var actions = "<a data-cmd='activateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock right black-text'></i>"+
								  "</a>";	
				}
			else if(String(v[23]) == "Disapproved"){
				status = "Disapproved";
				var actions = "<a data-cmd='activateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
							  "	<i class='mdi-action-lock right black-text'></i>"+
							  "</a>";	
			}

			content += "<tr>"+
						"	<td width='1px'>"+(i+1)+". </td>"+
						"	<td width='150px'>"+v[3]+"</td>"+
						"	<td>"+v[6]+"</td>"+
						"	<td>"+v[9]+"</td>"+
						"	<td>"+status+"</td>"+
						"	<td>"+v[26]+"</td>"+
						"	<td width='1px'>"+
						"		<a href='#cmd=index;content=focusApplicationForLeave;"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='0' data-tooltip='Show Details' data-cmd='update'>"+
						"			<i class='mdi-navigation-more-vert right black-text'></i>"+
						"		</a>"+
						"	</td>"+
						"</tr>";
		});

		content = "<table class='table bordered center' id='products'>"+
					"<thead>"+
					"	<tr>"+
					"		<th>#</th><th>Last Name</th><th>Date Of Filing</th><th>Type of Leave</th><th>Status</th><th>Date</th><th></th>"+
					"	</tr>"+
					"</thead>"+
					"</tbody>"+
						content+
					"</tbody>"+
					"</table>";
		$("#pending").html(content);

		var table = $('#products').DataTable({
	        "order": [[ 0, 'asc' ]],
	        "drawCallback": function ( settings ) {
	            var api = this.api();
	            var rows = api.rows( {page:'current'} ).nodes();
	            var last=null;
	        }
	    });
	},
	approved:function(){
		var content = "", chips = [],chipsContent = "";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-adminLeaveApproved',"");
		data = JSON.parse(data.responseText);
		$.each(data,function(i,v){
			var prodPicture = ((v[10] == "") || (v[10] == null))?"default.png":v[10];

			if(String(v[23]) == "Pending"){
					status = "Pending";
					var actions = "<a data-cmd='deactivateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock-open right black-text'></i>"+
								  "</a>";	
				}
			else if(String(v[23]) == "Approved"){
					status = "Approved";
					var actions = "<a data-cmd='activateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock right black-text'></i>"+
								  "</a>";	
				}
			else if(String(v[23]) == "Disapproved"){
				status = "Disapproved";
				var actions = "<a data-cmd='activateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
							  "	<i class='mdi-action-lock right black-text'></i>"+
							  "</a>";	
			}

			content += "<tr>"+
						"	<td width='1px'>"+(i+1)+". </td>"+
						"	<td width='150px'>"+v[3]+"</td>"+
						"	<td>"+v[6]+"</td>"+
						"	<td>"+v[9]+"</td>"+
						"	<td>"+status+"</td>"+
						"	<td>"+v[26]+"</td>"+
						"	<td width='1px'>"+
						"		<a href='#cmd=index;content=focusApplicationForLeaveApproved;"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='0' data-tooltip='Show Details' data-cmd='update'>"+
						"			<i class='mdi-navigation-more-vert right black-text'></i>"+
						"		</a>"+
						"	</td>"+
						"</tr>";
		});

		content = "<table class='table bordered center' id='products'>"+
					"<thead>"+
					"	<tr>"+
					"		<th>#</th><th>Last Name</th><th>Date Of Filing</th><th>Type of Leave</th><th>Status</th><th>Date</th><th></th>"+
					"	</tr>"+
					"</thead>"+
					"</tbody>"+
						content+
					"</tbody>"+
					"</table>";
		$("#approved").html(content);

		var table = $('#products').DataTable({
	        "order": [[ 0, 'asc' ]],
	        "drawCallback": function ( settings ) {
	            var api = this.api();
	            var rows = api.rows( {page:'current'} ).nodes();
	            var last=null;
	        }
	    });
	},
	disapproved:function(){
		var content = "", chips = [],chipsContent = "";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-adminLeaveDisapproved',"");
		data = JSON.parse(data.responseText);
		$.each(data,function(i,v){
			var prodPicture = ((v[10] == "") || (v[10] == null))?"default.png":v[10];

			if(String(v[23]) == "Pending"){
					status = "Pending";
					var actions = "<a data-cmd='deactivateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock-open right black-text'></i>"+
								  "</a>";	
				}
			else if(String(v[23]) == "Approved"){
					status = "Approved";
					var actions = "<a data-cmd='activateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock right black-text'></i>"+
								  "</a>";	
				}
			else if(String(v[23]) == "Disapproved"){
				status = "Disapproved";
				var actions = "<a data-cmd='activateAdmin' data-name='"+v[1]+"' data-node='"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
							  "	<i class='mdi-action-lock right black-text'></i>"+
							  "</a>";	
			}

			content += "<tr>"+
						"	<td width='1px'>"+(i+1)+". </td>"+
						"	<td width='150px'>"+v[3]+"</td>"+
						"	<td>"+v[6]+"</td>"+
						"	<td>"+v[9]+"</td>"+
						"	<td>"+status+"</td>"+
						"	<td>"+v[26]+"</td>"+
						"	<td width='1px'>"+
						"		<a href='#cmd=index;content=focusApplicationForLeave;"+v[0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='0' data-tooltip='Show Details' data-cmd='update'>"+
						"			<i class='mdi-navigation-more-vert right black-text'></i>"+
						"		</a>"+
						"	</td>"+
						"</tr>";
		});

		content = "<table class='table bordered center' id='products'>"+
					"<thead>"+
					"	<tr>"+
					"		<th>#</th><th>Last Name</th><th>Date Of Filing</th><th>Type of Leave</th><th>Status</th><th>Date</th><th></th>"+
					"	</tr>"+
					"</thead>"+
					"</tbody>"+
						content+
					"</tbody>"+
					"</table>";
		$("#disapproved").html(content);

		var table = $('#products').DataTable({
	        "order": [[ 0, 'asc' ]],
	        "drawCallback": function ( settings ) {
	            var api = this.api();
	            var rows = api.rows( {page:'current'} ).nodes();
	            var last=null;
	        }
	    });
	},
	leaveDetails:function(){
		var content="";
		var bago="";
		var data = system.ajax('../assets/harmony/Process.php?get-leave',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);

				content = "<div id='profile-card' class='card'>"+
						"    <div class='card-image waves-effect waves-block waves-light'>"+
						"        <img class='activator' src='../assets/images/user-bg.jpg' alt='user background'>"+
						"    </div>"+
						"    <div class='card-content'>"+
						"		<h5>Application For Leave</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-store cyan-text text-darken-2'></i> Office/Agency: "+data[0][2]+"</span>"+
						"			<button data-value='"+data[0][2]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Office/Agency' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-communication-contacts cyan-text text-darken-2'></i> Last Name: "+data[0][3]+"</span>"+
						"			<button data-value='"+data[0][3]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Last Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-communication-contacts cyan-text text-darken-2'></i> First Name: "+data[0][4]+"</span>"+
						"			<button data-value='"+data[0][4]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-communication-contacts cyan-text text-darken-2'></i> Middle Name: "+data[0][5]+"</span>"+
						"			<button data-value='"+data[0][5]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Middle Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-notification-event-note cyan-text text-darken-2'></i> Date of Filling: "+data[0][6]+"</span>"+
						"			<button data-value='"+data[0][6]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Filling' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-local-parking cyan-text text-darken-2'></i> Position: "+data[0][7]+"</span>"+
						"			<button data-value='"+data[0][7]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-local-atm cyan-text text-darken-2'></i> Salary(Monthly): "+data[0][8]+"</span>"+
						"			<button data-value='"+data[0][8]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Salary' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-dehaze cyan-text text-darken-2'></i> Type of leave: "+data[0][9]+"</span>"+
						"			<button data-value='"+data[0][9]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Type of Leave' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-content-content-paste cyan-text text-darken-2'></i> Specify: "+data[0][10]+"</span>"+
						"			<button data-value='"+data[0][10]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Specify' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-filter-3 cyan-text text-darken-2'></i> Number of working days for: "+data[0][11]+"</span>"+
						"			<button data-value='"+data[0][11]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Number of working days' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-notification-event-note cyan-text text-darken-2'></i> Inclusive Date: "+data[0][12]+"</span>"+
						"			<button data-value='"+data[0][12]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Date' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-directions-bike cyan-text text-darken-2'></i> Where leave will be spent: "+data[0][13]+"</span>"+
						"			<button data-value='"+data[0][13]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Where leave will be spent' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-directions-car cyan-text text-darken-2'></i> Specify Where: "+data[0][14]+"</span>"+
						"			<button data-value='"+data[0][14]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Specify Where' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-directions-bus cyan-text text-darken-2'></i> Commutation: "+data[0][15]+"</span>"+
						"			<button data-value='"+data[0][15]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Commutation' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-local-post-office cyan-text text-darken-2'></i> Certification of leave credits as of: "+data[0][16]+"</span>"+
						"			<button data-value='"+data[0][16]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Certification of leave credits as of' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-local-mall cyan-text text-darken-2'></i> Vacation(Days): "+data[0][17]+"</span>"+
						"			<button data-value='"+data[0][17]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Vacation' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-local-hospital cyan-text text-darken-2'></i> Sick(Days): "+data[0][18]+"</span>"+
						"			<button data-value='"+data[0][18]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Sick' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-toggle-radio-button-on cyan-text text-darken-2'></i> Total(Days): "+data[0][19]+"</span>"+
						"			<button data-value='"+data[0][19]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Total' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-toggle-check-box cyan-text text-darken-2'></i> Approved For(Day with pay): "+data[0][20]+"</span>"+
						"			<a data-value='"+data[0][20]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Approved For(Day with pay)' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-toggle-check-box cyan-text text-darken-2'></i> Approved For(Day without pay): "+data[0][21]+"</span>"+
						"			<a data-value='"+data[0][21]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Approved For(Day without pay)' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+						
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-toggle-check-box cyan-text text-darken-2'></i> Approved For(Other(Specify): "+data[0][22]+"</span>"+
						"			<a data-value='"+data[0][22]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Approved For(Other(Specify)' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+					
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-notification-mms cyan-text text-darken-2'></i> Recommendation: "+data[0][23]+"</span>"+
						"			<a data-value='"+data[0][23]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Recommendation' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+					
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-announcement cyan-text text-darken-2'></i> Due To: "+data[0][24]+"</span>"+
						"			<a data-value='"+data[0][24]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Due To' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+						
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-announcement cyan-text text-darken-2'></i> Due: "+data[0][25]+"</span>"+
						"			<a data-value='"+data[0][25]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Due' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+				
						"    </div>"+
						"</div>";
				$("#leaveDetails").html(content);

				// employee.deactivate();
				// employee.activate();
				leave.update();
				// employee.updatePicture();
		});
	},
	leaveApprovedDetails:function(){
		var content="";
		var bago = "";
		var print = "";
		var data = system.ajax('../assets/harmony/Process.php?get-leave',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);

				content = "<div id='profile-card' class='card'>"+
						"    <div class='card-image waves-effect waves-block waves-light'>"+
						"        <img class='activator' src='../assets/images/user-bg.jpg' alt='user background'>"+
						"    </div>"+
						"    <div class='card-content'>"+
						"		<h5>Application For Leave</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-store cyan-text text-darken-2'></i> Office/Agency: "+data[0][2]+"</span>"+
						"			<button data-value='"+data[0][2]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Office/Agency' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-communication-contacts cyan-text text-darken-2'></i> Last Name: "+data[0][3]+"</span>"+
						"			<button data-value='"+data[0][3]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Last Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-communication-contacts cyan-text text-darken-2'></i> First Name: "+data[0][4]+"</span>"+
						"			<button data-value='"+data[0][4]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-communication-contacts cyan-text text-darken-2'></i> Middle Name: "+data[0][5]+"</span>"+
						"			<button data-value='"+data[0][5]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Middle Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-notification-event-note cyan-text text-darken-2'></i> Date of Filling: "+data[0][6]+"</span>"+
						"			<button data-value='"+data[0][6]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Filling' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-local-parking cyan-text text-darken-2'></i> Position: "+data[0][7]+"</span>"+
						"			<button data-value='"+data[0][7]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-local-atm cyan-text text-darken-2'></i> Salary(Monthly): "+data[0][8]+"</span>"+
						"			<button data-value='"+data[0][8]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Salary' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-dehaze cyan-text text-darken-2'></i> Type of leave: "+data[0][9]+"</span>"+
						"			<button data-value='"+data[0][9]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Type of Leave' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-content-content-paste cyan-text text-darken-2'></i> Specify: "+data[0][10]+"</span>"+
						"			<button data-value='"+data[0][10]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Specify' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-filter-3 cyan-text text-darken-2'></i> Number of working days for: "+data[0][11]+"</span>"+
						"			<button data-value='"+data[0][11]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Number of working days' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-notification-event-note cyan-text text-darken-2'></i> Inclusive Date: "+data[0][12]+"</span>"+
						"			<button data-value='"+data[0][12]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Date' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-directions-bike cyan-text text-darken-2'></i> Where leave will be spent: "+data[0][13]+"</span>"+
						"			<button data-value='"+data[0][13]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Where leave will be spent' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-directions-car cyan-text text-darken-2'></i> Specify Where: "+data[0][14]+"</span>"+
						"			<button data-value='"+data[0][14]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Specify Where' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-directions-bus cyan-text text-darken-2'></i> Commutation: "+data[0][15]+"</span>"+
						"			<button data-value='"+data[0][15]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Commutation' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-local-post-office cyan-text text-darken-2'></i> Certification of leave credits as of: "+data[0][16]+"</span>"+
						"			<button data-value='"+data[0][16]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Certification of leave credits as of' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-local-mall cyan-text text-darken-2'></i> Vacation(Days): "+data[0][17]+"</span>"+
						"			<button data-value='"+data[0][17]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Vacation' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-local-hospital cyan-text text-darken-2'></i> Sick(Days): "+data[0][18]+"</span>"+
						"			<button data-value='"+data[0][18]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Sick' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-toggle-radio-button-on cyan-text text-darken-2'></i> Total(Days): "+data[0][19]+"</span>"+
						"			<button data-value='"+data[0][19]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Total' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-toggle-check-box cyan-text text-darken-2'></i> Approved For(Day with pay): "+data[0][20]+"</span>"+
						"			<a data-value='"+data[0][20]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Approved For(Day with pay)' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-toggle-check-box cyan-text text-darken-2'></i> Approved For(Day without pay): "+data[0][21]+"</span>"+
						"			<a data-value='"+data[0][21]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Approved For(Day without pay)' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+						
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-toggle-check-box cyan-text text-darken-2'></i> Approved For(Other(Specify): "+data[0][22]+"</span>"+
						"			<a data-value='"+data[0][22]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Approved For(Other(Specify)' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+					
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-notification-mms cyan-text text-darken-2'></i> Recommendation: "+data[0][23]+"</span>"+
						"			<a data-value='"+data[0][23]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Recommendation' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+					
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-announcement cyan-text text-darken-2'></i> Due To: "+data[0][24]+"</span>"+
						"			<a data-value='"+data[0][24]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Due To' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+						
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-announcement cyan-text text-darken-2'></i> Due: "+data[0][25]+"</span>"+
						"			<a data-value='"+data[0][25]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Due' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+				
						"    </div>"+
						"</div>";
				$("#leaveDetails").html(content);

				print = "<div id='profile-card' class='card'>"+
							"<div class='card-content'>"+
								"<div class='input-field col s12'>"+
									"<p style='margin-top:5%;text-align: center;'><font size='5'><b>APPLICATION FOR LEAVE</b></font></p><br/>"+
								"</div>"+
								"<font size='4'>"+
								"<table style='border-collapse: collapse;width:100%;'>"+
									"<tr style='border: 1px solid black;height:50px;'>"+
		    							"<td style='border: 1px solid black;width:50%;'>"+
			    							"<span style=''>1. Office/Agency:</span><br />"+
			    							"<span style=''><center> <b>Local Government Unit, Mabini Pangasinan</b></center></span>"+
		    							"</td>"+
		   							 	"<td style='border: 1px solid black;width:20%;'>"+
			    							"<span style=''>2. Name (Last)</span><br />"+
			    							"<span style=''><center>"+data[0][3]+"</center></span>"+
		    							"</td>"+
		    							"<td style='border: 1px solid black;width:18%;text-align:center;'>"+
			    							"<span style=''>(First)</span><br />"+
			    							"<span style=''>"+data[0][4]+"</span>"+
		    							"</td>"+
		    							"<td style='border: 1px solid black;width:13%;text-align:center;'>"+
			    							"<span style=''>(Middle)</span><br />"+
			    							"<span style=''>"+data[0][5]+"</span>"+
		    							"</td>"+

		  							"</tr'>"+
										"<table style='border-collapse: collapse;width:100%;'>"+
				  							"<tr style='width:100%;'>"+
				  								"<td style='border: 1px solid black;width:16%;'>"+
					    							"<span style=''>3. Date of Filling</span><br />"+
					    							"<span style=''><center> "+data[0][6]+"</center></span>"+
				    							"</td>"+
				    							"<td style='border: 1px solid black;width:18%;'>"+
					    							"<span style=''>4. Position</span><br />"+
					    							"<span style=''><center> "+data[0][7]+"</center></span>"+
				    							"</td>"+
				    							"<td style='border: 1px solid black;width:16%;'>"+
					    							"<span style=''>5. Salary (Monthly)</span><br />"+
					    							"<span style=''><center> "+data[0][8]+"</center></span>"+
				    							"</td>"+
											"</tr>"+
										"</table>"+
										"<table style='border-collapse: collapse;width:100%;table-layout: fixed;'>"+
				  							"<tr style='width:100%;'>"+
				  								"<td style='border: 1px solid black;width:50%;'>"+
					    							"<span style=''>6.a. <b>TYPE OF LEAVE: "+data[0][9]+"</b></span><br /><br />"+
					    							"<span style=''>&nbsp;&nbsp;Specify: <u>"+data[0][10]+" Vacation</u></span>"+
				    							"</td>"+
				    							"<td style='border: 1px solid black;width:50%;word-wrap: break-word;'>"+
					    							"<span style=''>6.b. <b>WHERE WILL BE SPENT:</b> "+data[0][13]+"</span><br /><br />"+
					    							"<span style=''>&nbsp;&nbsp;Specify: <u>"+data[0][14]+"</u></span>"+
				    							"</td>"+
											"</tr>"+
										"</table>"+
										"<table style='border-collapse: collapse;width:100%;'>"+
				  							"<tr style='width:100%;'>"+
				  								"<td style='border: 1px solid black;width:50%;'>"+
					    							"<span style=''>6.c. <b>NUMBER OF WORKING DAYS APPLIED FOR:</b> <u>"+data[0][11]+"</u></span><br /><br />"+
					    							"<span style=''>&nbsp;&nbsp;INCLUSIVE DATE: <u>"+data[0][12]+"</u></span>"+
				    							"</td>"+
				    							"<td style='border: 1px solid black;width:50%;'>"+
					    							"<span style=''>6.d. COMMUTATION: "+data[0][15]+"</span><br /><br /><br />"+
					    							"<center><hr style='background-color:black;width:50%;'></hr>"+
													"<span>(Signature of Applicant)</span></center>"+
				    							"</td>"+
											"</tr>"+
										"</table>"+
										"<table style='border-collapse: collapse;width:100%;'>"+
				  							"<tr style='width:100%;'>"+
				  								"<td style='border: 1px solid black;width:50%;'>"+
					    							"<span style=''><center>7. DETAILS OF ACTION ON APPLICATION</center></span>"+
				    							"</td>"+				    							
											"</tr>"+
										"</table>"+
										"<table style='border-collapse: collapse;width:100%;table-layout: fixed;'>"+
				  							"<tr style='width:100%;'>"+
				  								"<td style='border: 1px solid black;width:50%;'>"+
					    							"<span style=''>7.a. <b>CERTIFICATION OF LEAVE CREDITS AS OF:</b> <u>"+data[0][16]+"</u></span><br /><br />"+					    							
													"<table style='border-collapse: collapse;width:100%;'>"+
														"<tr>"+								
								    							"<td style='border: 1px solid black;'><center>VACATION</center></td>"+
								    							"<td style='border: 1px solid black;'><center>SICK</center></td>"+	
								    							"<td style='border: 1px solid black;'><center>TOTAL</center></td>"+    
							    						"</tr>"+
							    						"<tr>"+								
								    							"<td style='border: 1px solid black;'><center>"+data[0][17]+"</center></td>"+
								    							"<td style='border: 1px solid black;'><center>"+data[0][18]+"</center></td>"+	
								    							"<td style='border: 1px solid black;'><center>"+data[0][19]+"</center></td>"+    
							    						"</tr>"+
							    						"<tr>"+								
								    							"<td style='border: 1px solid black;'><center>DAYS</center></td>"+
								    							"<td style='border: 1px solid black;'><center>DAYS</center></td>"+	
								    							"<td style='border: 1px solid black;'><center>DAYS</center></td>"+    
							    						"</tr>"+
					    							"</table>"+
					    							"<br /><br /><span style=''><center>KEITH C. BALINTOS</center></span>"+
					    							"<span style=''><center>OIC-HRMO</center></span>"+
					    						"</td>"+
				    							"<td style='border: 1px solid black;width:50%;word-wrap: break-word;'>"+
					    							"<span style=''>7.a. <b>RECOMMENDATION:</b> "+data[0][23]+"</span><br /><br /><br />"+
					    							"<span style=''>&nbsp;&nbsp;Disapproved due to: <u>"+data[0][24]+"</u></span><br /><br /><br /><br /><br />"+
													"<center><hr style='background-color:black;width:50%;'></hr>"+
													"<span>(Signature of Applicant)</span></center>"+
				    							"</td>"+
											"</tr>"+
										"</table>"+
										"<table style='border-collapse: collapse;width:100%;table-layout: fixed;'>"+
				  							"<tr style='width:100%;'>"+
				  								"<td style='border: 1px solid black;width:50%;'>"+
					    							"<span style=''>7.c <b>APPROVED FOR:</b></span><br /><br />"+
					    							"<span style=''>&nbsp;<u>"+data[0][20]+"</u>&nbsp;days with pay</span><br />"+
					    							"<span style=''>&nbsp;<u>"+data[0][21]+"</u>&nbsp;days without pay</span><br />"+
					    							"<span style=''>&nbsp;<u>"+data[0][22]+"</u>&nbsp;other(Specify)</span><br />"+
				    							"</td>"+
				    							"<td style='border: 1px solid black;width:50%;word-wrap: break-word;vertical-align:top;'>"+
					    							"<span style=''>7.d. <b>DISAPPROVED DUE TO:</b> </span><br /><br />"+
					    							"<span style=''>&nbsp;&nbsp;<u>The rush reports submitted on thursday</u></span>"+
				    							"</td>"+
											"</tr>"+
										"</table><br /<br />"+
									"<p style='margin-top:5%;text-align: center;'><font size='5'><b>ALIMAR R. BRIANA</b></font></p>"+
									"<p style='margin-top:-3%;text-align: center;'><font size='5'>Municipal Mayor</font></p>"+
		  							"</font>"+
								"</table>"+
							"</div>"+
						"</div>";
				// $('#print').html(print);

				$("a[data-cmd='print_leave']").on('click',function(){
					$(print).print();
				});

		});
	},
	update:function(id){
		$("a[data-cmd='updateLeave']").on('click',function(){
			var data = $(this).data();
			var id = data.node;
			// console.log(data);

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

			if(data.prop == "Approved For(Day with pay)"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-adminLeave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Approved For(Day with pay) updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=applicationForLeavePending");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Approved For(Day without pay)"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-adminLeave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Approved For(Day without pay) updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=applicationForLeavePending");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Approved For(Other(Specify))"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-adminLeave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Approved For(Other(Specify) updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=applicationForLeavePending");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Recommendation"){
				var content = "<h4>Change "+data.prop+"</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<div class='col s12'>"+
						  "		<label for='field_Recommendation' class='active'>Recommendation: </label>"+
						  "		<select name='field_Recommendation'>"+
						  "			<option selected>Approved</option>"+
						  "			<option>Disapproved</option>"+
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
						var data = system.ajax('../assets/harmony/Process.php?update-adminLeave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Recommendation updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=applicationForLeavePending");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Due To"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-adminLeave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Due To updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=applicationForLeavePending");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Due"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-adminLeave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Due updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=applicationForLeavePending");
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