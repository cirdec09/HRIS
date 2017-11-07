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
				        field_email: {maxlength: 50,},
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
				"        <span class='activator grey-text text-darken-4' style='font-size:20px;'>"+data[1]+" </span>"+
				"			<a data-cmd='updateCompany' data-value='"+data[1]+"' data-name='"+data[1]+"' data-node='"+data[0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update account'>"+
				"				<i class='mdi-editor-mode-edit right black-text'></i>"+
				"			</a>"+
				"		 <div class='divider'></div>"+
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
						"        <img class='activator' src='../assets/images/user-bg-2.jpeg' alt='user background'>"+
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



				print += "<div class='card'>"+
							"<table style='border-collapse:collapse;width:100%;border:2px solid black;height:100px;'>"+
								"<tr>"+
									"<td style='width:65%;vertical-align:top;font-size:60%;font-family:sans-serif;'>CS FORM 212(Revised 2005)</td>"+
									"<td style='width:10%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:25%;font-size:60%;font-family:sans-serif;'></td>"+
								"</tr>"+
								"<tr>"+
									"<td style='vertical-align:center;font-weight:800;font-family:sans-serif;' colspan='3'><font size='5'><center>PERSONAL DATA SHEET</center></td>"+
								"</tr>"+
								"<tr>"+
									"<td style='width:60%;font-size:60%;font-family:sans-serif;'>Print legibly. Mark appropriate boxes <input type='checkbox' /> with &#x2714; and use separate sheet if necessary<font></td>"+
									"<td style='width:10%;background-color:black;color:white;font-size:60%;font-family:sans-serif;'><center>1. CS ID No.</center></td>"+
									"<td style='width:25%;border:1px solid black;font-size:60%;font-family:sans-serif;'></td>"+
								"</tr>"+
        					"</table>"+
   							"<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
								"<tr>"+
									"<td style='width:100%;background-color:black;color:white;font-size:90%;font-family:sans-serif;'>l. PERSONAL INFORMATION</td>"+
								"</tr>"+
        					"</table>"+
							"<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
								"<tr>"+
								    "<td style='background-color: #a5aeaf;font-size:60%;font-family:sans-serif;' height='17'>2. SURNAME</td>"+     
									"<td style='width:25%;border: 1px solid black;word-wrap: break-word;font-size:60%;font-family:sans-serif;' colspan='3' height='17'>&nbsp;&nbsp;"+data[0][4]+"</td>"+
								"</tr>"+
								"<tr>"+
								    "<td style='background-color: #a5aeaf;font-size:60%;font-family:sans-serif;' height='17'><center>FIRST NAME</center></td>"+
									"<td style='width:25%;border: 1px solid black;word-wrap: break-word;font-size:60%;font-family:sans-serif;' colspan='3' height='17'>&nbsp;&nbsp;"+data[0][5]+"</td>"+
								"</tr>"+
								"<tr>"+
								    "<td style='width:22%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;' height='17'><center>MIDDLE NAME</center></td>"+
								    "<td style='width:25%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>&nbsp;&nbsp;"+data[0][6]+"</td>"+
								    "<td style='width:33%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>3. NAME EXTENSION(e.g. Jr.,Sr.)</td>"+
									"<td style='width:20%;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'></td>"+
								"</tr>"+
								"<tr>"+
								    "<td style='width:22%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>4. DATE OF BIRTH</td>"+
								    "<td style='width:25%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][9]+"</td>"+
								    "<td style='width:33%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;'  height='17'>16. RESIDENTIAL ADDRESS</td>"+
									"<td style='width:20%;font-size:60%;font-family:sans-serif;border: 1px solid black;' rowspan='3' height='17'>"+data[0][24]+"</td>"+
								"</tr>"+
								"<tr>"+
								    "<td style='width:22%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>5. PLACE OF BIRTH</td>"+
								    "<td style='width:25%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][7]+"</td>"+
								    "<td style='width:33%;font-size:60%;font-family:sans-serif;background-color: #a5aeaf;' height='17'></td>"+
								"</tr>"+
							
								"<tr>"+
								    "<td style='width:22%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>6. SEX</td>"+
								    "<td style='width:25%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'><center><input type='checkbox' "+((String(data[0][8]) == 'Male')? 'checked=true' : '')+" id='myCheckbox'>Male&nbsp;&nbsp;&nbsp;&nbsp;<input type='checkbox' "+((String(data[0][8]) == 'Female')? 'checked=true' : '')+">Female</center></td>"+
								    "<td style='width:33%;font-size:60%;font-family:sans-serif;background-color: #a5aeaf;' height='17'></td>"+
								"</tr>"+
								"<tr>"+
								    "<td style='width:22%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;' height='17'>7. CIVIL STATUS</td>"+
								    "<td style='width:25%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' rowspan='3' height='17'>"+
								    	"<input type='checkbox' "+((String(data[0][15]) == 'Single')? 'checked=true' : '')+" >Single&nbsp;&nbsp;&nbsp;<input type='checkbox' "+((String(data[0][15]) == 'Widowed')? 'checked=true' : '')+" >Widowed<br />"+
								    	"<input type='checkbox' "+((String(data[0][15]) == 'Married')? 'checked=true' : '')+" >Married<input type='checkbox' "+((String(data[0][15]) == 'Separated')? 'checked=true' : '')+" >Separated<br />"+
								    	"<input type='checkbox' "+((String(data[0][15]) == 'Anulled')? 'checked=true' : '')+" >Anulled<input type='checkbox' "+((String(data[0][15]) == 'Other')? 'checked=true' : '')+" >Other"+
								    "</td>"+
								    "<td style='width:33%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;text-align:right;' height='17'>ZIP CODE</td>"+
									"<td style='width:20%;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>"+data[0][25]+"</td>"+
								"</tr>"+
								"<tr>"+
								    "<td style='width:22%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;' height='17'></td>"+
								    "<td style='width:33%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>17. TELEPHONE NO.</td>"+
									"<td style='width:20%;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>"+data[0][26]+"</td>"+
								"</tr>"+
								"<tr>"+
								    "<td style='width:22%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;' height='17'></td>"+
								    "<td style='width:33%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;' height='17'>18. PERMAMANENT ADDRESS</td>"+
									"<td style='width:20%;font-size:60%;font-family:sans-serif;border: 1px solid black;' rowspan='3' height='17'>"+data[0][27]+"</td>"+
								"</tr>"+
								"<tr>"+
								    "<td style='width:22%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;'><font size='2' height='17'>8. CITIZENSHIP</font></td>"+
								    "<td style='width:25%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][16]+"</td>"+
								    "<td style='width:33%;font-size:60%;font-family:sans-serif;background-color: #a5aeaf;' height='17'></td>"+
								"</tr>"+
								"<tr>"+
								    "<td style='width:22%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>9. HEIGHT (m)</td>"+
								    "<td style='width:25%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][17]+"</td>"+
								    "<td style='width:33%;font-size:60%;font-family:sans-serif;background-color: #a5aeaf;' height='17'></td>"+
								"</tr>"+
								"<tr>"+
								    "<td style='width:22%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>10. WEIGHT (kg)</td>"+
								    "<td style='width:25%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][18]+"</td>"+
								    "<td style='width:33%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;text-align:right;' height='17'>ZIP CODE</td>"+
									"<td style='width:20%;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>"+data[0][28]+"</td>"+
								"</tr>"+
								"<tr>"+
								    "<td style='width:22%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>11. BLOOD TYPE</td>"+
								    "<td style='width:25%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][19]+"</td>"+
								    "<td style='width:33%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>19. TELEPHONE NO.</td>"+
									"<td style='width:20%;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>"+data[0][29]+"</td>"+
								"</tr>"+
								"<tr>"+
								    "<td style='width:22%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>12. GSIS ID NO.</td>"+
								    "<td style='width:25%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][20]+"</td>"+
								    "<td style='width:33%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>20. E-MAIL ADDRESS (if any)</td>"+
									"<td style='width:20%;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>"+data[0][30]+"</td>"+
								"</tr>"+
								"<tr>"+
								    "<td style='width:22%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>13. PAG-IBIG ID NO.</td>"+
								    "<td style='width:25%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][21]+"</td>"+
								    "<td style='width:33%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>21. CELLPHONE NO.</td>"+
									"<td style='width:20%;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>"+data[0][10]+"</td>"+
								"</tr>"+
								"<tr>"+
								    "<td style='width:22%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>14. PHILHEALTH ID NO.</td>"+
								    "<td style='width:25%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][22]+"</td>"+
								    "<td style='width:33%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>22. AGENCY EMPLOYEE NO.</td>"+
									"<td style='width:20%;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>"+data[0][31]+"</td>"+
								"</tr>"+
								"<tr>"+
								    "<td style='width:22%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>15. SSS NO.</td>"+
								    "<td style='width:25%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][23]+"</td>"+
								    "<td style='width:33%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>23. TIN</td>"+
									"<td style='width:20%;font-size:60%;font-family:sans-serif;border: 1px solid black;' height='17'>"+data[0][32]+"</td>"+
								"</tr>"+
							"</table>";
				
				if(String(data[0][8]) == 'Male'){
					$('#myCheckbox').attr('checked', true);
				}
				else{
					$('#myCheckbox').attr('checked', false);
				}				
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
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-account-circle cyan-text text-darken-2'></i> Spouse's Surname: "+data[0][2]+"</span>"+
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
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Father's Surname: "+data[0][9]+"</span>"+
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
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people-outline cyan-text text-darken-2'></i> Mother's Surname: "+data[0][12]+"</span>"+
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

				print +="<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:100%;font-size:90%;font-family:sans-serif;background-color:black;color:white;'>ll. FAMILY BACKGROUND</td>"+
							"</tr>"+
        				"</table>"+
        				"<table style='border-collapse:collapse;width:50%;display: inline-table;border:2px solid black;'>"+
							"<tr>"+
							    "<td style='width:18%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;word-wrap: break-word;' height='17'><center>24. SPOUSE'S SURNAME</center></td>"+     
								"<td style='width:32%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][2]+"</td>"+
							"</tr>"+
							"<tr>"+
							    "<td style='width:18%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;word-wrap: break-word;' height='17'><center>FIRST NAME</center></td>"+     
								"<td style='width:32%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][3]+"</td>"+
							"</tr>"+
							"<tr>"+
							    "<td style='width:18%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;word-wrap: break-word;' height='17'><center>MIDDLE NAME</center></td>"+     
								"<td style='width:32%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][4]+"</td>"+
							"</tr>"+
							"<tr>"+
							    "<td style='width:18%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'><center>OCCUPATION</center></td>"+     
								"<td style='width:32%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][5]+"</td>"+
							"</tr>"+
							"<tr>"+
							    "<td style='width:18%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'><center>EMPLOYER/BUS NAME</center></td>"+     
								"<td style='width:32%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][6]+"</td>"+
							"</tr>"+
							"<tr>"+
							    "<td style='width:18%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'><center>BUSINESS ADDRESS</center></td>"+     
								"<td style='width:32%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][7]+"</td>"+
							"</tr>"+
							"<tr>"+
							    "<td style='width:18%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'><center>TELEPHONE N0.</center></td>"+     
								"<td style='width:32%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][8]+"</td>"+
							"</tr>"+
							"<tr>"+
							    "<td style='width:18%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' colspan='2' height='17'><center style='color:red;' >(Continue on the separate sheet if necessary)</center></td>"+     
							"</tr>"+
							"<tr>"+
							    "<td style='width:18%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;word-wrap: break-word;' height='17'>26. FATHER SURNAME</td>"+     
								"<td style='width:32%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][9]+"</td>"+
							"</tr>"+
							"<tr>"+
							    "<td style='width:18%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;word-wrap: break-word;' height='17'><center>FIRST NAME</center></td>"+     
								"<td style='width:32%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][10]+"</td>"+
							"</tr>"+
							"<tr>"+
							    "<td style='width:18%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;word-wrap: break-word;' height='17'><center>MIDDLE NAME</center></td>"+     
								"<td style='width:32%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][11]+"</td>"+
							"</tr>"+
							"<tr>"+
							    "<td style='width:18%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;' colspan='2' height='17'>27. MOTHER'S MAIDEN NAME</td>"+     
							"</tr>"+
							"<tr>"+
							    "<td style='width:18%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;word-wrap: break-word;' height='17'><center>SURNAME</center></td>"+     
								"<td style='width:32%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][12]+"</td>"+
							"</tr>"+
							"<tr>"+
							    "<td style='width:18%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;word-wrap: break-word;' height='17'><center>FIRST NAME</center></td>"+     
								"<td style='width:32%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][13]+"</td>"+
							"</tr>"+
							"<tr>"+
							    "<td style='width:18%;background-color: #a5aeaf;font-size:60%;word-wrap: break-word;' height='17'><center>MIDDLE NAME</center></td>"+     
								"<td style='width:32%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'>"+data[0][14]+"</td>"+
							"</tr>"+
						"</table>";
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

				print += "<table style='border-collapse:collapse;width:50%;float:right;border:2px solid black;'>"+
							"<tr>"+
							    "<td style='width:30%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'height='17'><center>25. NAME OF CHILD</font> (Write full name and list all)</center></td>"+     
								"<td style='width:20%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='17'height='17'><center>DATE OF BIRTH (mm/dd/yyyy)</center></td>"+
							"</tr>";
						

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;float:left;' class='truncate'> <i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Name Of Child: "+value[2]+"</span>"+
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

        		$(data).each(function(index,value){
        			print +="<tr>"+
							    "<td style='width:30%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;'height='17'><center>"+value[2]+"</center></td>"+     
								"<td style='width:20%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;'height='17'><center>"+value[3]+"</center></td>"+
							"</tr>";
							
        		});

        		for (i = 0; i < (13-data.length); i++) {
 					print +="<tr>"+
							    "<td style='width:30%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;'height='17'><center><br /></center></td>"+     
								"<td style='width:20%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;'height='17'><center></center></td>"+
							"</tr>";
				}

        		print +="<tr>"+
						    "<td style='font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' colspan='2' height='17'><center style='color:red;' >(Continue on the separate sheet if necessary)</center></td>"+
						"</tr>"+
						"</table>";

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
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Date Of Attendance From: "+data[0][6]+"</span>"+
						"			<button data-value='"+data[0][6]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Date Of Attendance To: "+data[0][7]+"</span>"+
						"			<button data-value='"+data[0][7]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+data[0][8]+"</span>"+
						"			<button data-value='"+data[0][8]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Scholarship/Non Academics Honor Recieved' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Scholarship/Academics Honors Recieved'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div></br>"+
						"		<h5>Secondary Level</h5>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+data[0][9]+"</span>"+
						"			<button data-value='"+data[0][9]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Name Of School'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+data[0][10]+"</span>"+
						"			<button data-value='"+data[0][10]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Degree' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Degree Course'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+data[0][11]+"</span>"+
						"			<button data-value='"+data[0][11]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Year' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Year Graduated'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+data[0][12]+"</span>"+
						"			<button data-value='"+data[0][12]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Grade' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update  Highest Grade/Level/Units Earned'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance: "+data[0][13]+"</span>"+
						"			<button data-value='"+data[0][13]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance: "+data[0][14]+"</span>"+
						"			<button data-value='"+data[0][14]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+data[0][15]+"</span>"+
						"			<button data-value='"+data[0][15]+"' disabled data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Scholarship' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Scholarship/Academics Honors Recieved'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
				$("#educational_background").html(content);


				print +="<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:100%;font-size:90%;font-family:sans-serif;background-color:black;color:white;'>lll. EDUCATIONAL BACKGROUND</td>"+
							"</tr>"+
        				"</table>"+
						"<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
							    "<td style='width:15%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' rowspan='2'><center>28. LEVEL</center></td>"+     
								"<td style='width:17%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' rowspan='2'><center>NAME OF SCHOOL (Write in full)</center></td>"+
								"<td style='width:9%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' rowspan='2'><center>DEGREE COURSE (Write in full)</center></td>"+     
								"<td style='width:12.5%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' rowspan='2'><center>YEAR GRADUATED (If graduated)</center></td>"+
								"<td style='width:16%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' rowspan='2'><center>HIGHEST GRADE/ LEVEL/ UNITS EARNED <br />(If not graduated)</center></td>"+     
								"<td style='width:7%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' colspan='2'><center>INCLUSIVE DATES</center></td>"+
								"<td style='width:12.5%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' rowspan='2'><center>SCHOLARSHIP/ ACADEMIC HONORS RECIEVED</center></td>"+
							"</tr>"+
							"<tr>"+    
								"<td style='width:7%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;'><center>FROM</center></td>"+
								"<td style='width:7%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;'><center>To</center></td>"+
							"</tr>"+
							"<tr>"+
							    "<td style='width:15%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>ELEMENTARY</center></td>"+     
								"<td style='width:17%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][2]+"</center></td>"+
								"<td style='width:9%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][3]+"</center></td>"+     
								"<td style='width:12.5%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][4]+"</center></td>"+
								"<td style='width:16%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][5]+"</center></td>"+     
								"<td style='width:7%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][6]+"</center></td>"+
								"<td style='width:7%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][7]+"</center></td>"+
								"<td style='width:12.5%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][8]+"</center></td>"+
							"</tr>"+
							"<tr>"+
							    "<td style='width:15%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>SECONDARY</center></font></td>"+     
								"<td style='width:17%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][9]+"</center></td>"+
								"<td style='width:9%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][10]+"</center></td>"+     
								"<td style='width:12.5%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][11]+"</center></td>"+
								"<td style='width:16%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][12]+"</center></td>"+     
								"<td style='width:7%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][13]+"</center></td>"+
								"<td style='width:7%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][14]+"</center></td>"+
								"<td style='width:12.5%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][15]+"</center></td>"+
							"</tr>";
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
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance From: "+value[6]+"</span>"+
							"			<button data-value='"+value[6]+"' disabled data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance To: "+value[7]+"</span>"+
							"			<button data-value='"+value[7]+"' disabled data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+value[8]+"</span>"+
							"			<button data-value='"+value[8]+"' disabled data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Scholarship/Non Academics Honor Recieved' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Scholarship/Academics Honors Recieved'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
							"</div>"+
							"</div>";
        		});

				$(data).each(function(index,value){
            		print +="<tr>"+
							    "<td style='width:15%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>VOCATIONAL/ TRADE COURSE</center></td>"+     
								"<td style='width:17%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][2]+"</center></td>"+
								"<td style='width:9%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][3]+"</center></td>"+     
								"<td style='width:12.5%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][4]+"</center></td>"+
								"<td style='width:16%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][5]+"</center></td>"+     
								"<td style='width:7%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][6]+"</center></td>"+
								"<td style='width:7%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][7]+"</center></td>"+
								"<td style='width:12.5%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][8]+"</center></td>"+
							"</tr>";
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
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance From: "+value[6]+"</span>"+
							"			<button data-value='"+value[6]+"' disabled data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance To: "+value[7]+"</span>"+
							"			<button data-value='"+value[7]+"' disabled data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+value[8]+"</span>"+
							"			<button data-value='"+value[8]+"' disabled data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Scholarship/Non Academics Honor Recieved' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Scholarship/Academics Honors Recieved'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
							"</div>"+
							"</div>";
        		});

            		print +="<tr>"+
							    "<td style='width:15%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>COLLEGE</center></td>"+     
								"<td style='width:17%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][2]+"</center></td>"+
								"<td style='width:9%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][3]+"</center></td>"+     
								"<td style='width:12.5%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][4]+"</center></td>"+
								"<td style='width:16%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][5]+"</center></td>"+     
								"<td style='width:7%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][6]+"</center></td>"+
								"<td style='width:7%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][7]+"</center></td>"+
								"<td style='width:12.5%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][8]+"</center></td>"+
							"</tr>";
        		
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
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance From: "+value[6]+"</span>"+
							"			<button data-value='"+value[6]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance To: "+value[7]+"</span>"+
							"			<button data-value='"+value[7]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+value[8]+"</span>"+
							"			<button data-value='"+value[8]+"' disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Scholarship/Academics Honors Recieved'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
							"</div>"+
							"</div>";
        		});

				$(data).each(function(index,value){
            		print +="<tr>"+
							    "<td style='width:15%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>GRADUATE STUDIES</center></td>"+     
								"<td style='width:17%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][2]+"</center></td>"+
								"<td style='width:9%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][3]+"</center></td>"+     
								"<td style='width:12.5%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][4]+"</center></td>"+
								"<td style='width:16%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][5]+"</center></td>"+     
								"<td style='width:7%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][6]+"</center></td>"+
								"<td style='width:7%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][7]+"</center></td>"+
								"<td style='width:12.5%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' height='50'><center>"+data[0][8]+"</center></td>"+
							"</tr>";
        		});
        			print +="<tr>"+
							    "<td style='font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' colspan='8'><center style='color:red;' >(Continue on the separate sheet if necessary)</center></td>"+
							"</tr>"+
						"</table>"+
						"<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='font-size:60%;font-family:sans-serif;width:100%;text-align:right;'>Page 1 of 4</td>"+
							"</tr>"+
        				"</table><br /><br /><br /><br /><br /><br />";
        		
				$("#graduate").html(content);
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

				print += "<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:100%;background-color: #a5aeafbackground-color: #a5aeaf;font-size:90%;font-family:sans-serif;background-color:black;color:white;'>lV. CIVIL SERVICE</td>"+
							"</tr>"+
        				"</table>"+
        				"<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:20%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><center>29. CAREER SERVICE/ RA 1080 (BOARD/BAR) UNDER SPECIAL LAWS/CES/CSEE</center></td>"+
								"<td style='width:11%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><center>RATING</center></td>"+
								"<td style='width:15%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><center>DATE OF EXAMINATION/ CONFERMENT</center></td>"+
								"<td style='width:30%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><center>PLACE OF EXAMINATION</center></td>"+
								"<td style='width:24%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' colspan='2'><center>LICENSE (if applicable)</center></td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:12%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'><center>NUMBER</center></td>"+
								"<td style='width:12%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'><center>DATE OF RELEASE</center></td>"+
							"</tr>";

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

				$(data).each(function(index,value){
            		print +="<tr>"+
								"<td style='width:20%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+value[2]+"</center></td>"+
								"<td style='width:11%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+value[3]+"</center></td>"+
								"<td style='width:15%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+value[4]+"</center></td>"+
								"<td style='width:30%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+value[5]+"</center></td>"+
								"<td style='width:12%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+value[6]+"</center></td>"+
								"<td style='width:12%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+value[7]+"</center></td>"+
							"</tr>";
        		});

        		for (i = 0; i < (7-data.length); i++) {
 					print +="<tr>"+
								"<td style='width:20%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center><br /></center></td>"+
								"<td style='width:11%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center></center></td>"+
								"<td style='width:15%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center></center></td>"+
								"<td style='width:30%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center></center></td>"+
								"<td style='width:12%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center></center></td>"+
								"<td style='width:12%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center></center></td>"+
							"</tr>";
				}

        		print +="<tr>"+
						    "<td style='font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' colspan='6'><center style='color:red;' >(Continue on the separate sheet if necessary)</center></td>"+
						"</tr>"+
        				"</table>";
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
				print += "<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:100%;font-size:90%;font-family:sans-serif;background-color:black;color:white;'>V. WORK EXPERIENCE (Include private employment. Start from your current work.)</td>"+
							"</tr>"+
        				"</table>"+
        				"<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:24%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' colspan='2'><center>30. INCLUSIVE DATES (mm/dd/yyyy)</center></td>"+
								"<td style='width:18%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><center>POSITION TITLE (Write in full)</center></td>"+
								"<td style='width:18%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><center>DEPARTMENT/ AGENCY/ OFFICE/ COMPANY/ (Write in full)</center></td>"+
								"<td style='width:10%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><center>MONTHLY SALARY</center></td>"+
								"<td style='width:10%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><center>SALARY GRADE & STEP INCREMENT (Format 0-00)</center></td>"+
								"<td style='width:10%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><center>STATUS OF APPOINTMENT</center></td>"+
								"<td style='width:10%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><center>GOV'T SERVICE (Yes / No)</center></td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:12%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'><center>From</center></td>"+
								"<td style='width:12%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'><center>To</center></td>"+
							"</tr>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Inclusive Date Of Attendance From: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Inclusive Date Of Attendance To: "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-assignment-ind cyan-text text-darken-2'></i> Position Title: "+value[4]+"</span>"+
							"			<button data-value='"+value[4]+"' disabled data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position Title' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-work cyan-text text-darken-2'></i> Department/Agency/Office/Company: "+value[5]+"</span>"+
							"			<button data-value='"+value[5]+"' disabled data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Department' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-attach-money cyan-text text-darken-2'></i> Monthly Salary: "+value[6]+"</span>"+
							"			<button data-value='"+value[6]+"' disabled data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Monthly Salary' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-grade cyan-text text-darken-2'></i> Salary Grade: "+value[7]+"</span>"+
							"			<button data-value='"+value[7]+"' disabled data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Salary Grade' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-info cyan-text text-darken-2'></i> Status Of Appointment: "+value[8]+"</span>"+
							"			<button data-value='"+value[8]+"' disabled data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Status Of Appointment' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-image-portrait cyan-text text-darken-2'></i> Gov't Service: "+value[9]+"</span>"+
							"			<button data-value='"+value[9]+"' disabled data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Government Service' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
        		});

				$(data).each(function(index,value){
            		print +="<tr>"+
								"<td style='width:12%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+data[0][2]+"</center></td>"+
								"<td style='width:12%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+data[0][3]+"</center></td>"+
								"<td style='width:18%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+data[0][4]+"</center></td>"+
								"<td style='width:18%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+data[0][5]+"</center></td>"+
								"<td style='width:10%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+data[0][6]+"</center></td>"+
								"<td style='width:10%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+data[0][7]+"</center></td>"+
								"<td style='width:10%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+data[0][8]+"</center></td>"+
								"<td style='width:10%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+data[0][9]+"</center></td>"+
							"</tr>";
        		});

        		for (i = 0; i < (20-data.length); i++) {
 					print +="<tr>"+
								"<td style='width:12%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center><br /></center></td>"+
								"<td style='width:12%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center></center></td>"+
								"<td style='width:18%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center></center></td>"+
								"<td style='width:18%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center></center></td>"+
								"<td style='width:10%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center></center></td>"+
								"<td style='width:10%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center></center></td>"+
								"<td style='width:10%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center></center></td>"+
								"<td style='width:10%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center></center></td>"+
							"</tr>";
				}

				content += 	"</div>"+
							"</div>";

				print +="<tr>"+
						    "<td style='border: 1px solid black;word-wrap: break-word;' colspan='8'><center style='color:red;' >(Continue on the separate sheet if necessary)</center></td>"+
						"</tr>"+
						"</table>"+
						"<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:100%;text-align:right;'><font size='2'>CS FORM 212 (Rvised 2005), Page 2 of 4</font></td>"+
							"</tr>"+
        				"</table><br /><br /><br /><br /><br /><br /><br /><br />";
        		
				$("#work").html(content);
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

				print +="<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:100%;font-size:70%;font-family:sans-serif;background-color:black;color:white;;'>Vl. VOLUNTARY WORK OR INVOLVEMENT IN CIVIC/ OR NON-GOVERNMENT/ PEOPLE/ VOLUNTARY ORGANIZATION/S</td>"+
							"</tr>"+
        				"</table>"+
        				"<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:35%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><center>31. NAME & ADDRESS OF ORGANIZATION (Write in full)</center></td>"+
								"<td style='width:26%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' colspan='2'><center>INCLUSIVE DATES (mm/dd/yyyy)</center></td>"+
								"<td style='width:13%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><center>NUMBER OF HOURS</center></td>"+
								"<td style='width:26%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><center>POSITION/ NATURE OF WORK</center></td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:13%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'><center>From</center></td>"+
								"<td style='width:13%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'><center>To</center></td>"+
							"</tr>";

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
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Inclusive Date Of Attendance From: "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updateVoluntary' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Date Of Attendance From' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Inclusive Date Of Attendance To: "+value[4]+"</span>"+
							"			<button data-value='"+value[4]+"' disabled data-cmd='updateVoluntary' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Date Of Attendance To' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-format-list-numbered cyan-text text-darken-2'></i> Number of Hours: "+value[5]+"</span>"+
							"			<button data-value='"+value[5]+"' disabled data-cmd='updateVoluntary' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Number of hours' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-wallet-membership cyan-text text-darken-2'></i> Position: "+value[6]+"</span>"+
							"			<button data-value='"+value[6]+"' disabled data-cmd='updateVoluntary' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
        		});

        		$(data).each(function(index,value){
            		print +="<tr>"+
								"<td style='width:35%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+value[2]+"</center></td>"+
								"<td style='width:13%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+value[3]+"</center></td>"+
								"<td style='width:13%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+value[4]+"</center></td>"+
								"<td style='width:13%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+value[5]+"</center></td>"+
								"<td style='width:26%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+value[6]+"</center></td>"+
							"</tr>";
        		});
        		for (i = 0; i < (5-data.length); i++) {
 					print +="<tr>"+
								"<td style='width:35%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center><br /></center></td>"+
								"<td style='width:13%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center></center></td>"+
								"<td style='width:13%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center></center></td>"+
								"<td style='width:13%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center></center></td>"+
								"<td style='width:26%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center></center></td>"+
							"</tr>";
				}

        		content += 	"</div>"+
							"</div>";

        		
				print +="<tr>"+
						    "<td style='font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' colspan='5'><center style='color:red;' >(Continue on the separate sheet if necessary)</center></td>"+
						"</tr>"+
						"</table>";
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

				print +="<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
						"<tr>"+
							"<td style='width:100%;font-size:90%;font-family:sans-serif;background-color:black;color:white;'>Vll. TRAINING PROGRAMS (Start from the most recent training.)</td>"+
						"</tr>"+
    				"</table>"+
    				"<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
						"<tr>"+
							"<td style='width:35%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><center>31. NAME & ADDRESS OF ORGANIZATION (Write in full)</center></td>"+
							"<td style='width:26%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' colspan='2'><center>INCLUSIVE DATES OF ATTENDANCE (mm/dd/yyyy)</center></td>"+
							"<td style='width:13%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><center>NUMBER OF HOURS</center></td>"+
							"<td style='width:26%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><center>CONDUCTED/ SPONSORED BY<br />(Write in full)</center></td>"+
						"</tr>"+
						"<tr>"+
							"<td style='width:13%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'><center>From</center></td>"+
							"<td style='width:13%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'><center>To</center></td>"+
						"</tr>";
				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-description cyan-text text-darken-2'></i> Title Of Seminar: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateTraining' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Title of seminar' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Inclusive Date Of Attendance From: "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updateTraining' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Inclusive Date Of Attendance To: "+value[4]+"</span>"+
							"			<button data-value='"+value[4]+"' disabled data-cmd='updateTraining' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-format-list-numbered cyan-text text-darken-2'></i> Number of hours: "+value[5]+"</span>"+
							"			<button data-value='"+value[5]+"' disabled data-cmd='updateTraining' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Number of hours' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-people cyan-text text-darken-2'></i> Conducted/Sponsored by: "+value[6]+"</span>"+
							"			<button data-value='"+value[6]+"' disabled data-cmd='updateTraining' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Conducted/Sponsored by' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
							"</div>"+
							"</div>";
        		});

        		$(data).each(function(index,value){
            		print +="<tr>"+
								"<td style='width:35%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center>"+value[2]+"</center></td>"+
								"<td style='width:13%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center>"+value[3]+"</center></td>"+
								"<td style='width:13%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center>"+value[4]+"</center></td>"+
								"<td style='width:13%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center>"+value[5]+"</center></td>"+
								"<td style='width:26%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center>"+value[6]+"</center></td>"+
							"</tr>";
        		});
        		for (i = 0; i < (13-data.length); i++) {
 					print +="<tr>"+
								"<td style='width:35%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center><br /></center></td>"+
								"<td style='width:13%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center></center></td>"+
								"<td style='width:13%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center></center></td>"+
								"<td style='width:13%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center></center></td>"+
								"<td style='width:26%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center></center></td>"+
							"</tr>";
				}

        		print +="<tr>"+
						    "<td style='font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;' colspan='5'><center style='color:red;' >(Continue on the separate sheet if necessary)</center></td>"+
						"</tr>"+
						"</table>";
        		
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

				print +="<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:100%;font-size:90%;font-family:sans-serif;background-color:black;color:white;'>Vlll. OTHER INFORMATION</td>"+
							"</tr>"+
    					"</table>"+
    					"<table style='border-collapse:collapse;width:30%;float:left;border:2px solid black;'>"+
    					"<tr>"+
							"<td style='width:30%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black;'><center>33. Special Skills/Hobbies</center></td>"+
						"</tr>";
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
        		$(data).each(function(index,value){
            		print +="<tr>"+
								"<td style='width:30%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+value[2]+"</center></td>"+
							"</tr>";				
        		});
        		for (i = 0; i < (5-data.length); i++) {
 					print +="<tr>"+
								"<td style='width:30%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center><br /></center></td>"+
							"</tr>";
				}
        		print +="</table>";
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
				print +="<table style='border-collapse:collapse;width:35%;float:left;border:2px solid black;'>"+
						"<tr>"+
							"<td style='width:35%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'><center><34. Non-Academic Distinction<br /></center></td>"+
						"</tr>";
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
        		$(data).each(function(index,value){
            		print +="<tr>"+
								"<td style='width:35%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='30'><center>"+value[2]+"</center></td>"+
							"</tr>";
							
        		});
        		for (i = 0; i < (5-data.length); i++) {
 					print +="<tr>"+
								"<td style='width:35%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center><br /></center></td>"+
							"</tr>";
				}
				$("#non_academic").html(content);
				print +="</table>";
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
				print += "<table style='border-collapse:collapse;width:35%;float:right;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:35%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'><center>35. Membership in Association/Organization (Write in full)</center></td>"+
							"</tr>";
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
        		$(data).each(function(index,value){
            		print +="<tr>"+
								"<td style='width:35%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center>"+value[2]+"</center></td>"+
							"</tr>";	
        		});
        		for (i = 0; i < (5-data.length); i++) {
 					print +="<tr>"+
								"<td style='width:35%;font-size:60%;font-family:sans-serif;border:1px solid black' height='30'><center><br /></center></td>"+
							"</tr>";
				}
				$("#membership").html(content);
				print +="</table>"+
						"<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
							    "<td style='width:100%;font-size:60%;font-family:sans-serif;border: 1px solid black;word-wrap: break-word;'><center style='color:red;' >(Continue on the separate sheet if necessary)</center></td>"+
							"</tr>"+
						"</table>"+
						"<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:100%;font-size:60%;font-family:sans-serif;text-align:right;'>CS FORM 212 (Rvised 2005), Page 3 of 4</td>"+
							"</tr>"+
        				"</table><br /><br /><br /><br /><br /><br /><br /><br />";
			}
		});

		var content="";
		var data = system.ajax('../assets/harmony/Process.php?get-questions',id);
		data.done(function(data){
			data = JSON.parse(data);
				console.log(data);
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
				print +="<table style='border-collapse:collapse;float:left;width:75%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:75%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'>36. Are you related by consanguinity or affinity to any of the following:<br /><br />a. Within the third degree(for National Government Employees):<br />appointing authority, recomendiing authority, chief of office/bureau/department or person who has immediate supervision on you in the Office, Bureau or Deaprtment where you will be apointed?<br /><br />b. Within the fourth degree(for Local Government Employees):<br />appointing authority, recommending authority where you will be apointed?<br /><br /></td>"+
							"</tr>"+
						"</table>"+
						"<table style='border-collapse:collapse;float:right;width:25%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;'><font size='2'><input type='checkbox' "+((String(data[0][2]) == 'Yes')? 'checked=true' : '')+" >Yes&nbsp;&nbsp;<input type='checkbox' "+((String(data[0][2]) == 'No')? 'checked=true' : '')+">No<br />If Yes, give details:</font></td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;height:28px;'><font size='2'><u>"+data[0][3]+"</u></font></td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;'><font size='2'><input type='checkbox' "+((String(data[0][4]) == 'Yes')? 'checked=true' : '')+">Yes&nbsp;&nbsp;<input type='checkbox' "+((String(data[0][4]) == 'No')? 'checked=true' : '')+">No<br />If Yes, give details:</font></td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;'><font size='2'><u>"+data[0][5]+"</u></font></td>"+
							"</tr>"+
						"</table>"+

						"<table style='border-collapse:collapse;float:left;width:75%;border:2px solid black;'>"+
						"<tr>"+
							"<td style='width:75%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'>37. a. Have you ever been formally charged?<br /><br /><br /><br /><br /><br />b. Have you ever been guilty of any administrative offense?<br /><br /><br /><br /></td>"+
						"</tr>"+
						"</table>"+
						"<table style='border-collapse:collapse;float:right;width:25%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;'><input type='checkbox' "+((String(data[0][6]) == 'Yes')? 'checked=true' : '')+">Yes&nbsp;&nbsp;<input type='checkbox' "+((String(data[0][6]) == 'No')? 'checked=true' : '')+">No<br />If Yes, give details:</td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;height:20px;'><u>"+data[0][7]+"</u></td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;'><input type='checkbox' "+((String(data[0][8]) == 'Yes')? 'checked=true' : '')+">Yes&nbsp;&nbsp;<input type='checkbox' "+((String(data[0][8]) == 'No')? 'checked=true' : '')+">No<br />If Yes, give details:</td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;height:22px;'><u>"+data[0][9]+"</u></td>"+
							"</tr>"+
						"</table>"+

						"<table style='border-collapse:collapse;float:left;width:75%;border:2px solid black;'>"+
						"<tr>"+
							"<td style='width:75%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'>38. Have you ever been convicted of any crime or violation of any law, decree, ordinance or regulation by any court or tribunal?<br /><br /><br /><br /></td>"+
						"</tr>"+
						"</table>"+
						"<table style='border-collapse:collapse;float:right;width:25%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;'><input type='checkbox' "+((String(data[0][10]) == 'Yes')? 'checked=true' : '')+">Yes&nbsp;&nbsp;<input type='checkbox' "+((String(data[0][10]) == 'No')? 'checked=true' : '')+">No<br />If Yes, give details:</td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;height:22px;'><u>"+data[0][11]+"</u></td>"+
							"</tr>"+
						"</table>"+

						"<table style='border-collapse:collapse;float:left;width:75%;border:2px solid black;'>"+
						"<tr>"+
							"<td style='width:75%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'>39. Have you ever been separated from the service in any following modes: resignation, retirement, dropped from the rolls, dismissal, terminantion, end of term, finished contract AWOL or phase out in the public or private sector?<br /><br /><br /></td>"+
						"</tr>"+
						"</table>"+
						"<table style='border-collapse:collapse;float:right;width:25%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;'><input type='checkbox' "+((String(data[0][12]) == 'Yes')? 'checked=true' : '')+">Yes&nbsp;&nbsp;<input type='checkbox' "+((String(data[0][12]) == 'No')? 'checked=true' : '')+">No<br />If Yes, give details:</td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;height:10px;'><u>"+data[0][13]+"</u></td>"+
							"</tr>"+
						"</table>"+

						"<table style='border-collapse:collapse;float:left;width:75%;border:2px solid black;'>"+
						"<tr>"+
							"<td style='width:75%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'>40. Have you been candidate in a national or local election(exept Brangay election)?<br /><br /><br /><br /></td>"+
						"</tr>"+
						"</table>"+
						"<table style='border-collapse:collapse;float:right;width:25%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;'><input type='checkbox' "+((String(data[0][14]) == 'Yes')? 'checked=true' : '')+">Yes&nbsp;&nbsp;<input type='checkbox' "+((String(data[0][14]) == 'No')? 'checked=true' : '')+">No<br />If Yes, give details:</td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;height:12px;'><u>"+data[0][15]+"</u></td>"+
							"</tr>"+
						"</table>"+

						"<table style='border-collapse:collapse;float:left;width:75%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:75%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;'>41. Pursuant to: (a) Indigenous People's Act(RA8371); (b) Magna Carta for Disabled Persons(RA7277); and (c) Solo Parents Welfare Act of 2000 (RA8972), please answer the following items:</td>"+
							"</tr>"+
								"<tr>"+
								"<td style='width:75%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;'><br />a. Are you a member of any indigenous group?<br /><br /></td>"+
							"</tr>"+
								"<tr>"+
								"<td style='width:75%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;'><br />b. Are you differently abled?<br /><br /></td>"+
							"</tr>"+
								"<tr>"+
								"<td style='height:40px;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;width:75%;'>c. Are you a solo parent?<br /></td>"+
							"</tr>"+
						"</table>"+
						"<table style='border-collapse:collapse;float:right;width:25%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;'><br /><input type='checkbox' "+((String(data[0][16]) == 'Yes')? 'checked=true' : '')+">Yes&nbsp;&nbsp;<input type='checkbox' "+((String(data[0][16]) == 'No')? 'checked=true' : '')+">No<br />If Yes, please specify:<u>"+data[0][15]+"</u><br /><br /></td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;'><input type='checkbox' "+((String(data[0][18]) == 'Yes')? 'checked=true' : '')+">Yes&nbsp;&nbsp;<input type='checkbox' "+((String(data[0][18]) == 'No')? 'checked=true' : '')+">No<br />If Yes, please specify:<u>"+data[0][17]+"</u><br /><br /></td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;height:36px;'><input type='checkbox'"+((String(data[0][20]) == 'Yes')? 'checked=true' : '')+">Yes&nbsp;&nbsp;<input type='checkbox'"+((String(data[0][20]) == 'No')? 'checked=true' : '')+">No<br />If Yes, please specify:<u>"+data[0][19]+"</u></td>"+
							"</tr>"+
						"</table>";
			}
		});

		var content="";
		var other="";
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
				print +="<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:100%;color:black;font-size:12px;font-family:sans-serif;'><font size='2'>42. REFERENCES <n style='color:red;'> (Person not related to consanguinity or affinity to applicant/apointee)</n></td>"+
							"</tr>"+
    					"</table>"+
    					"<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:27%;font-family:sans-serif;background-color: #a5aeaf;border:1px solid black'><font size='2'><center>NAME</center></td>"+
								"<td style='width:30%;font-family:sans-serif;background-color: #a5aeaf;border:1px solid black'><font size='2'><center>ADDRESS</center></font></td>"+
								"<td style='width:20%;font-family:sans-serif;background-color: #a5aeaf;border:1px solid black'><font size='2'><center>TEL NO.</center></font></td>"+
								"<td style='width:23%;font-family:sans-serif;background-color: #a5aeaf;border:1px solid black' rowspan='5'><font size='2'><center>ID picture witin the last 6 months 3.5 cm x 4.5 cm (Passport size)<br />Computer generated or xerox copy of picture is not acceptable</center></font></td>"+
							"</tr>";
				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-person cyan-text text-darken-2'></i> Name: "+value[2]+"</span>"+
							"			<button data-value='"+value[2]+"' disabled data-cmd='updateReferences' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Name'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-home cyan-text text-darken-2'></i> Address: "+value[3]+"</span>"+
							"			<button data-value='"+value[3]+"' disabled data-cmd='updateReferences' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Address'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-settings-phone cyan-text text-darken-2'></i> Telephone Number: "+value[4]+"</span>"+
							"			<button data-value='"+value[4]+"' disabled data-cmd='updateReferences' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Telephone Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Telephone Number'>"+
							"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
							"			</button>"+
							"		 </p>"+
							"		 <div class='divider'></div>";
        		});
        		$(data).each(function(index,value){
            		print +="<tr>"+
								"<td style='width:27%;font-family:sans-serif;border:1px solid black'><font size='2'><center>"+data[0][2]+"</center></font></td>"+
								"<td style='width:30%;font-family:sans-serif;border:1px solid black'><font size='2'><center>"+data[0][3]+"</center></font></td>"+
								"<td style='width:20%;font-family:sans-serif;border:1px solid black'><font size='2'><center>"+data[0][4]+"</center></font></td>"+
							"</tr>";
        		});
        		for (i = 0; i < (3-data.length); i++) {
 					print +="<tr>"+
								"<td style='width:27%;font-family:sans-serif;border:1px solid black'><font size='2'><center><br /></center></font></td>"+
								"<td style='width:30%;font-family:sans-serif;border:1px solid black'><font size='2'><center></center></font></td>"+
								"<td style='width:20%;font-family:sans-serif;border:1px solid black'><font size='2'><center></center></font></td>"+
							"</tr>";
				}
        		print +="<tr>"+
							"<td style='width:72%;font-family:sans-serif;border:1px solid black' colspan='3'><font size='2'>43. I declare under oath that this Personal Data Sheet has been accomplish by me, and is a true, correct and complete statement pursuant to the provisions of pertinent laws, rules and regulation of the Republic of the Philippines.<br /><br />I also authorized the agency head/ authorized representative to verify/ validate to contents stated herein.I trust that this information shall remain confedential.</font></td>"+
						"</tr>"+
						"</table>";

        		content += "</div>"+
							"</div>";
				$("#references").html(content);

				other = "<div id='profile-card' class='card'>"+
						"    <div class='card-content'>"+
						"		<h5>Other Information</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-question-answer cyan-text text-darken-2'></i> Community Tax Certificate No.: "+data[0][5]+"</span>"+
						"			<button data-value='"+data[0][5]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Within the third degree(for National Government Employees):appointing authority, recomendiing authority, chief of office/bureau/department or person who has immediate supervision on you in the Office, Bureau or Deaprtment where you will be apointed?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> Issued at (mm/dd/yyyy): "+data[0][6]+"</span>"+
						"			<button data-value='"+data[0][6]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 36 A' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> Issued On (mm/dd/yyyy): "+data[0][7]+"</span>"+
						"			<button data-value='"+data[0][7]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Within the fourth degree(for Local Government Employees)appointing authority, recommending authority where you will be apointed?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> Date Accomplish (mm/dd/yyyy): "+data[0][8]+"</span>"+
						"			<button data-value='"+data[0][8]+"' disabled data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 36 B' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
							"</div>"+
						"</div>";
				$("#last").html(other);
			}
		});

		var content="";
		var bago="";
		var data = system.ajax('../assets/harmony/Process.php?get-last',id);
		data.done(function(data){
		data = JSON.parse(data);
			console.log(data);

				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content = "<div id='profile-card' class='card'>"+
						"    <div class='card-content'>"+
						"		<h5>Other Information</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-question-answer cyan-text text-darken-2'></i>Community Tax Certificate No.: "+data[0][2]+"</span>"+
						"			<button data-value='"+data[0][2]+"' disabled='' data-cmd='updateLast' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Community Tax Certificate No.' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> Issued at (mm/dd/yyyy): "+data[0][3]+"</span>"+
						"			<button data-value='"+data[0][3]+"' disabled='' data-cmd='updateLast' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Issued at' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i>Issued On (mm/dd/yyyy): "+data[0][4]+"</span>"+
						"			<button data-value='"+data[0][4]+"' disabled='' data-cmd='updateLast' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Issued On' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> Date Accomplish (mm/dd/yyyy): "+data[0][5]+"</span>"+
						"			<button data-value='"+data[0][5]+"' disabled='' data-cmd='updateLast' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date Accomplish' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
				$("#last").html(content);

				print += "<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:4%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:40%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:32%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:21%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:4%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:40%;font-family:sans-serif;border:1px solid black'><center><font size='2'>"+data[0][2]+"</font></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:32%;border:1px solid black' rowspan='4'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:21%;border:1px solid black;' rowspan='7'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:4%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:40%;font-family:sans-serif;border:1px solid black'><center><font size='2'>COMMUNITY TAX CERTIFICATE NO.</font></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
							"</tr>"+
								"<tr>"+
								"<td style='width:4%'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:40%;'><center></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
							"</tr>"+
								"<tr>"+
								"<td style='width:4%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:40%;font-family:sans-serif;border:1px solid black'><center><font size='2'>"+data[0][3]+"</font></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
							"</tr>"+
								"<tr>"+
								"<td style='width:4%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:40%;font-family:sans-serif;border:1px solid black'><center><font size='2'>ISSUED AT</font></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:32%;font-family:sans-serif;border:1px solid black'><center><font size='2'>SIGNATURE<span style='color:red;'>(Sign inside the box)</span></center></font></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
							"</tr>"+
								"<tr>"+
								"<td style='width:4%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:40%;'><center></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:32%;'><center></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
							"</tr>"+
								"<tr>"+
								"<td style='width:4%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:40%;font-family:sans-serif;border:1px solid black'><center><font size='2'>"+data[0][4]+"</font></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:32%;font-family:sans-serif;border:1px solid black'><center><font size='2'>"+data[0][5]+"</font></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
							"</tr>"+
								"<tr>"+
								"<td style='width:4%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:40%;font-family:sans-serif;border:1px solid black'><center><font size='2'>ISSUED ON (mm/dd/yyyy)</font></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:32%;font-family:sans-serif;border:1px solid black'><center><font size='2'>DATE OF ACCOMPLISHED</font></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:21%;'><center>RIGHT THUMB</center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
							"</tr>"+
								"<tr>"+
								"<td style='width:4%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:40%;'><center></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:32%;'><center></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
								"<td style='width:21%;'><center></center></td>"+
								"<td style='width:1%;'><center><span style='color:white;'>1</span></center></td>"+
							"</tr>"+
						"</table>"+
						"<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:100%;;text-align:right;font-family:sans-serif;' height='20'></td>"+
							"</tr>"+
        				"</table>"+
						"<table style='border-collapse:collapse;width:100%;border:2px solid black;'>"+
							"<tr>"+
								"<td style='width:100%;text-align:right;font-family:sans-serif;'><font size='2'>CS FORM 212 (Rvised 2005), Page 4 of 4</font></td>"+
							"</tr>"+
        				"</table>";
		});

		print +="</div>";
		// $("#print").html(print);

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
						"        <img class='activator' src='../assets/images/user-bg-2.jpeg' alt='user background'>"+
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
						"		<a href='#cmd=index;content=focusSALNdetails;"+v[1]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='0' data-tooltip='Show Details' data-cmd='update'>"+
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
		var print = "";
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
						"        <img class='activator' src='../assets/images/user-bg-2.jpeg' alt='user background'>"+
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
						"<h5>SPOUSE</h5>"+
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
						"<h5>Other Information</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-store-mall-directory cyan-text text-darken-2'></i> As Of Date: "+data[0][17]+"</span>"+
						"			<button disabled data-value='"+data[0][17]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Agency/Office' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
				$("#personalInfo").html(content);

				print +="<div id='profile-card' class='card'>"+
							"<div>"+
									"<span style='font-size:60%;font-family:sans-serif;position: absolute;right: 0px;width: 145px;'>Revised as of January 2015</span><br />"+
									"<span style='font-size:60%;font-family:sans-serif;position: absolute;right: 0px;width: 145px;'>Per CSC Resolution No. 1500088</span><br />"+
									"<span style='font-size:60%;font-family:sans-serif;position: absolute;right: 0px;width: 145px;' >Promugated on January 23, 2015</span>"+
							"</div><br />"+
							"<span style='font-size:110%;font-family:sans-serif;'><center><b>SWORN STATEMENT OF ASSETS, LIABILITIES AND NET WORTH</b></center></span>"+
							"<table style='border-collapse: collapse;width:40%;height:10%;' align='center'>"+
								"<tr>"+
									"<td style='width:15%;font-size:70%;font-family:sans-serif;'>As of</td>"+
									"<td style='width:85%;font-size:70%;font-family:sans-serif;border-bottom:1px solid black;'><center>"+data[0][17]+"</center></td>"+
								"</tr>"+
								"<tr>"+
									"<td style='width:15%;font-size:70%;font-family:sans-serif;'></td>"+
									"<td style='width:85%;font-size:70%;font-family:sans-serif;'><center>(Required by R.A 6713)</center></td>"+
								"</tr>"+
							"</table><br />"+
							"<span style='font-size:65%;font-family:sans-serif;padding-left:7%;'><b>Note:</b> Husband and wife are both public officials and employees may file the required statements jointly or separately.</span><br />"+
							"<span style='font-size:65%;font-family:sans-serif;'><center><c><input type='checkbox' /> Joint Filing</c><e style='padding-left:5%;'><input type='checkbox' "+((String(data[0][18]) == 'Separate Filing')? 'checked=true' : '')+" /> Separate Filing</e><e style='padding-left:5%;'><input type='checkbox' "+((String(data[0][18]) == 'Not Applicable')? 'checked=true' : '')+" /> Not Applicable</e></center></span><br />"+
							"<table style='border-collapse: collapse;width:100%;height:10%;'>"+
								"<tr>"+
									"<td style='width:10%;font-size:60%;font-family:sans-serif;'><b>Declarant: </b></td>"+
									"<td style='width:1%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:19%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;word-wrap: break-word;'><center>"+data[0][3]+"</center></td>"+
									"<td style='width:15%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;word-wrap: break-word;'><center>"+data[0][4]+"</center></td>"+
									"<td style='width:3%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;word-wrap: break-word;'><center>"+data[0][5]+"</center></td>"+
									"<td style='width:5%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:19%;font-size:60%;font-family:sans-serif;'><b>POSITION:</b></td>"+
									"<td style='width:1%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:26%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;word-wrap: break-word;'> "+data[0][7]+"</td>"+
								"</tr>"+
								"<tr>"+
									"<td style='width:10%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:1%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:19%;font-size:60%;font-family:sans-serif;'><center>(Family Name)</center></td>"+
									"<td style='width:15%;font-size:60%;font-family:sans-serif;'><center>(First Name)</center></td>"+
									"<td style='width:3%;font-size:60%;font-family:sans-serif;'><center>(M.I)</center></td>"+
									"<td style='width:5%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:19%;font-size:60%;font-family:sans-serif;'><b>AGENCY/OFFICE:</b></td>"+
									"<td style='width:1%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:26%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;word-wrap: break-word;'> "+data[0][8]+"</td>"+
								"</tr>"+
								"<tr>"+
									"<td style='width:10%;font-size:60%;font-family:sans-serif;'><b>ADDRESS:</b></td>"+
									"<td style='width:1%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:19%;border-bottom:1px solid black;font-size:60%;font-family:sans-serif;' colspan='3'> "+data[0][6]+"</td>"+
									"<td style='width:5%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:19%;font-size:60%;font-family:sans-serif;'><b>OFFICE ADDRESS:</b></td>"+
									"<td style='width:1%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:26%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;word-wrap: break-word;'> "+data[0][9]+"</td>"+
								"</tr>"+
							"</table><br />"+
							"<table style='border-collapse: collapse;width:100%;height:10%;'>"+
								"<tr>"+
									"<td style='width:10%;font-size:60%;font-family:sans-serif;'><b>Declarant: </b></td>"+
									"<td style='width:1%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:19%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;word-wrap: break-word;'><center>"+data[0][10]+"</center></td>"+
									"<td style='width:15%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;word-wrap: break-word;'><center>"+data[0][11]+"</center></td>"+
									"<td style='width:3%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;word-wrap: break-word;'><center>"+data[0][12]+"</center></td>"+
									"<td style='width:5%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:19%;font-size:60%;font-family:sans-serif;'><b>POSITION:</b></td>"+
									"<td style='width:1%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:26%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;word-wrap: break-word;'> "+data[0][13]+"</td>"+
								"</tr>"+
								"<tr>"+
									"<td style='width:10%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:1%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:19%;font-size:60%;font-family:sans-serif;'><center>(Family Name)</center></td>"+
									"<td style='width:15%;font-size:60%;font-family:sans-serif;'><center>(First Name)</center></td>"+
									"<td style='width:3%;font-size:60%;font-family:sans-serif;'><center>(M.I)</center></td>"+
									"<td style='width:5%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:19%;font-size:60%;font-family:sans-serif;'><b>AGENCY/OFFICE:</b></td>"+
									"<td style='width:1%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:26%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;word-wrap: break-word;'> "+data[0][14]+"</td>"+
								"</tr>"+
								"<tr>"+
									"<td style='width:10%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:1%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:19%;font-size:60%;font-family:sans-serif;' colspan='3'></td>"+
									"<td style='width:5%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:19%;font-size:60%;font-family:sans-serif;'><b>OFFICE ADDRESS:</b></td>"+
									"<td style='width:1%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:26%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;word-wrap: break-word;'> "+data[0][15]+"</td>"+
								"</tr>"+
							"</table><br />";

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

				print += "<table style='border-collapse: collapse;width:100%;'>"+
								"<tr>"+
									"<td style='border-bottom:1px solid black;'></td>"+
								"</tr>"+
								"<tr>"+
									"<td style='border-bottom:1px solid black;'></td>"+
								"</tr>"+
							"</table><br />"+					
							"<span style='font-size:85%;font-family:sans-serif;'><b><center><u>UNMARRIED CHILDREN BELOW EIGHTEEN(18) YEARS OF AGE LIVING IN DECLARANT'S HOUSEHOLD</u></center></b></span><br />"+
							"<table style='border-collapse: collapse;width:85%;'  align='center'>"+
								"<tr>"+
									"<td style='width:38%;font-size:60%;font-family:sans-serif;'><b><center>NAME </center></b></td>"+
									"<td style='width:5%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:18%;font-size:60%;font-family:sans-serif;'><b><center>DATE OF BIRTH </center></b></td>"+
									"<td style='width:5%;font-size:60%;font-family:sans-serif;'></td>"+
									"<td style='width:10%;font-size:60%;font-family:sans-serif;'><b><center>AGE </center></b></td>"+
								"</tr>";
				$(data).each(function(index,value){		
				content +=	"<br /><p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-person cyan-text text-darken-2'></i> Name Of Child: "+value[2]+"</span>"+
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

        		$(data).each(function(index,value){
            		// data.length;
            		// console.log(value);
				
					print +="<tr>"+
								"<td style='width:38%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;word-wrap: break-word;'> <center>"+value[2]+"</center></td>"+
								"<td style='width:5%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:18%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;word-wrap: break-word;'> <center>"+value[3]+"</center></td>"+
								"<td style='width:5%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:10%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;word-wrap: break-word;'> <center>"+value[4]+"</center></td>"+
							"</tr>";
							
        		});

        		for (i = 0; i < (4-data.length); i++) {
 					print +="<tr>"+
								"<td style='width:38%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;word-wrap: break-word;'> <center><br /></center></td>"+
								"<td style='width:5%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:18%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;word-wrap: break-word;'> <center></center></td>"+
								"<td style='width:5%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:10%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;word-wrap: break-word;'> <center></center></td>"+
							"</tr>";
				}

        		content += 		"</div>"+
							"</div>";

        		print += 		"</table><br />"+
        						"<table style='border-collapse: collapse;width:100%;'>"+
									"<tr>"+
										"<td style='border-bottom:1px solid black;'></td>"+
									"</tr>"+
									"<tr>"+
										"<td style='border-bottom:1px solid black;'></td>"+
									"</tr>"+
								"</table><br />";

				$("#unmarriedChild").html(content);
			}
		});

		var content="";
		var bago="";
		var subTotalA = 0;
		var subTotalAprint = 0;
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

				print +=	"<span style='font-size:80%;font-family:sans-serif;'><b><center><u>ASSETS, LIABILITIES AND NETWORTH</u></center></b></span>"+
							"<span style='font-size:65%;font-family:sans-serif;'><center>(Including those of the spouse and unmarried children below eighteen(18)</center></span>"+
							"<span style='font-size:70%;font-family:sans-serif;'><b>1. ASSETS</b></span><br />"+
							"<span style='padding-left:5%;font-size:70%;font-family:sans-serif;'><b>a. Real Properties*</b></span><br /><br />"+
							"<table style='border-collapse: collapse;width:100%;border:1px solid black;'>"+
								"<tr>"+
									"<td style='width:15%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><br /><center><b>DESCRIPTION</b><br />"+
										"(e.g. lot, house and lot, condominuim and improvements)</center>"+
									"</td>"+
									"<td style='width:15%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><br /><center><b>KIND</b><br />"+
										"(e.g. residential, commercial, industrial, agricultural and mixed use)</center>"+
									"</td>"+
									"<td style='width:15%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><br /><b><center>EXACT LOCATION</center></b></td>"+
									"<td style='width:10%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'><br /><b><center>ASSESED VALUE</center></b></td>"+
									"<td style='width:16%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'><br /><b><center>CURRENT FAIR MARKET VALUE</center></b></td>"+
									"<td style='width:16%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' colspan='2'><center><b>ACQUISITION</b></center></td>"+
									"<td style='width:10%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' rowspan='2'><center><b>ACQUISITION COST</b></center></td>"+

								"</tr>"+
								"<tr>"+
									"<td style='width:21%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black' colspan='2'><center>(As found in the Tax Destination of Real Property)</center></td>"+
									"<td style='width:8%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'><center><b>YEAR</b></center></td>"+
									"<td style='width:8%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black'><center><b>MODE</b></center></td>"+
								"</tr>";
							
							

				$(data).each(function(index,value){
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
				
				$(data).each(function(index,value){
					subTotalAprint = subTotalAprint + Number(value[9]);

				print +="<tr>"+
							"<td style='width:15%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center>"+value[2]+"</center></td>"+
							"<td style='width:15%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center>"+value[3]+"</center></td>"+
							"<td style='width:15%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center>"+value[4]+"</center></td>"+
							"<td style='width:10%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center>"+value[5]+"</center></td>"+
							"<td style='width:16%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center>"+value[6]+"</center></td>"+
							"<td style='width:8%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center>"+value[7]+"</center></td>"+
							"<td style='width:8%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center>"+value[8]+"</center></td>"+
							"<td style='width:10%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center>"+value[9]+"</center></td>"+
						"</tr>";					
        		});

        		for (i = 0; i < (4-data.length); i++) {
 					print +="<tr>"+
								"<td style='width:15%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center><br /></center></td>"+
								"<td style='width:15%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center></center></td>"+
								"<td style='width:15%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center></center></td>"+
								"<td style='width:10%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center></center></td>"+
								"<td style='width:16%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center></center></td>"+
								"<td style='width:8%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center></center></td>"+
								"<td style='width:8%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center></center></td>"+
								"<td style='width:10%;font-size:60%;font-family:sans-serif;border:1px solid black' height='40'><center></center></td>"+
							"</tr>";
				}

				localStorage.setItem('TotalA',subTotalA);
        		content += 	"        <p><span style='width:80%;font-size:60%;font-family:sans-serif;display: inline-block;' class='truncate'> <i class='mdi-editor-attach-money cyan-text text-darken-2'></i> Subtotal: &#8369; "+subTotalA+"</span>"+
        					"		 </p>"+
							"</div>"+
							"</div>";

				print +="</table><br />"+
						"<table style='border-collapse: collapse;width:100%;>"+
							"<tr>"+
								"<td style='width:15%;font-size:60%;font-family:sans-serif;'><center></center></td>"+
								"<td style='width:15%;font-size:60%;font-family:sans-serif;'><center></center></td>"+
								"<td style='width:15%;font-size:60%;font-family:sans-serif;'><center></center></td>"+
								"<td style='width:10%;font-size:60%;font-family:sans-serif;'><center></center></td>"+
								"<td style='width:16%;font-size:60%;font-family:sans-serif;'><center></center></td>"+
								"<td style='width:13%;font-size:60%;font-family:sans-serif;'><center><b>Subtotal:</b></center></td>"+
								"<td style='width:12%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;'><center>&#8369; "+subTotalAprint+"</center></td>"+
							"</tr>"+
						"</table>";
						
        		
				$("#real").html(content);
			}
		});

		var content="";
		var bago="";
		var subTotalB=0;
		var subTotalBprint=0;
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
							"		<h6>b. Personal Properties</h6><br />";

				print +="<span style='font-size:70%;font-family:sans-serif;padding-left:5%;'><b>b. Personal Properties*</b></span><br /><br />"+
						"<table style='border-collapse: collapse;width:100%;border:1px solid black;'>"+
								"<tr>"+
									"<td style='width:50%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black;'><b><center>DESCRIPTION</center></b></td>"+
									"<td style='width:30%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black;'><b><center>YEAR ACQUIRED</center></b></td>"+
									"<td style='width:20%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black;'><b><center>ACQUISITION COST/AMOUNT</center></b></td>"+
								"</tr>";

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

        		$(data).each(function(index,value){
            		// data.length;
            		// console.log(value);
					subTotalBprint = subTotalBprint + Number(value[4]);

				print +="<tr>"+
							"<td style='width:50%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center>"+value[2]+"</center></td>"+
							"<td style='width:30%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center>"+value[3]+"</center></td>"+
							"<td style='width:20%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center>"+value[4]+"</center></td>"+
						"</tr>";
						
        		});

    			for (i = 0; i < (4-data.length); i++) {
 					print +="<tr>"+
								"<td style='width:50%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center><br /></center></td>"+
								"<td style='width:30%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center></center></td>"+
								"<td style='width:20%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center></center></td>"+
							"</tr>";
				}
        		
				localStorage.setItem('TotalB',subTotalB);
				a = localStorage.getItem('TotalA');
				b = localStorage.getItem('TotalB');
				totalAssets=(Number(a)+Number(b));

				print +="</table><br />"+
    					"<table style='border-collapse: collapse;width:100%;'>"+
	    					"<tr>"+
								"<td style='width:50%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:30%;font-size:60%;font-family:sans-serif;text-align:right;'><b>Subtotal:</b></td>"+
								"<td style='width:20%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;'><center>&#8369; "+subTotalBprint+"</center></td>"+
							"</tr>"+
        				"</table><br />"+
        				"<table style='border-collapse: collapse;width:100%;'>"+
							"<tr>"+
								"<td style='width:50%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:30%;font-size:60%;font-family:sans-serif;text-align:right;'><b>TOTAL ASSETS(a+b):</b></td>"+
								"<td style='width:20%;font-size:60%;font-family:sans-serif;border-bottom:2px solid black;'><center>&#8369; "+totalAssets+"</center></td>"+
							"</tr>"+
        				"</table>"+
						"<span style='font-size:60%;font-family:sans-serif;'>* Additional sheet/s may be used, if necessary</span><br />"+
						"<span style='font-size:60%;font-family:sans-serif;'><center><i>Page 1 of ___</i></center></span><br /><br /><br /><br /><br /><br /><br /><br /><br />";

        		content += 	"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-attach-money cyan-text text-darken-2'></i> Subtotal: &#8369; "+subTotalB+"</span>"+
							"		 </p>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-maps-local-atm cyan-text text-darken-2'></i> Total Assets(a+b): &#8369; "+totalAssets+"</span>"+
							"		 </p>"+
							"</div>"+
							"</div>";
        		
				$("#personal").html(content);
			}
		});

		var content="";
		var bago="";
		var totalLiabilitiesPrint=0;
		var a = "", b="", netWorth=0;
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

				print +="<span style='padding-left:5%;font-size:70%;font-family:sans-serif;'><b>2. LIABILITIES*</b></span><br /><br />"+
						"<table style='border-collapse: collapse;width:100%;border:1px solid black;'>"+
								"<tr>"+
									"<td style='width:50%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black;'><b><center>NATURE</center></b></td>"+
									"<td style='width:30%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black;'><b><center>NAME OF CREDITORS</center></b></td>"+
									"<td style='width:20%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black;'><b><center>OUTSTANDING BALANCE</center></b></td>"+
								"</tr>";

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

        		$(data).each(function(index,value){
					totalLiabilitiesPrint = totalLiabilitiesPrint + Number(value[4]);
				print +="<tr>"+
							"<td style='width:50%;font-size:60%;font-family:sans-serif;border:1px solid black;'><center>"+value[2]+"</center></td>"+
							"<td style='width:30%;font-size:60%;font-family:sans-serif;border:1px solid black;'><center>"+value[3]+"</center></td>"+
							"<td style='width:20%;font-size:60%;font-family:sans-serif;border:1px solid black;'><center>"+value[4]+"</center></td>"+
						"</tr>";
        		});
        		for (i = 0; i < (4-data.length); i++) {
 					print +="<tr>"+
							"<td style='width:50%;font-size:60%;font-family:sans-serif;border:1px solid black;'><center><br /></center></td>"+
							"<td style='width:30%;font-size:60%;font-family:sans-serif;border:1px solid black;'><center></center></td>"+
							"<td style='width:20%;font-size:60%;font-family:sans-serif;border:1px solid black;'><center></center></td>"+
						"</tr>";
				}
				netWorth=(totalAssets-totalLiabilitiesPrint);


        		print +="</table><br />"+
    					"<table style='border-collapse: collapse;width:100%;'>"+
	    					"<tr>"+
								"<td style='width:50%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:30%;font-size:60%;font-family:sans-serif;text-align:right;'><b>TOTAL LIABILITIES:</b></td>"+
								"<td style='width:20%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;'><center>&#8369; "+totalLiabilitiesPrint+"</center></td>"+
							"</tr>"+
        				"</table><br />"+
        				"<table style='border-collapse: collapse;width:100%;'>"+
							"<tr>"+
								"<td style='width:30%;'></td>"+
								"<td style='width:50%;text-align:right;font-size:60%;font-family:sans-serif;'><b>NER WORTH: Total Assets less Total Liabilities= </b></td>"+
								"<td style='width:20%;border-bottom:2px solid black;font-size:60%;font-family:sans-serif;'><center>&#8369; "+netWorth+"</center></td>"+
							"</tr>"+
        				"</table><br />";
				
        		content += 	"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-attach-money cyan-text text-darken-2'></i> Total Liabilities: &#8369; "+totalLiabilitiesPrint+"</span>"+
							"		 </p>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-maps-local-atm cyan-text text-darken-2'></i> Net Worth:Total Assets less Total Liabilities= &#8369; "+netWorth+"</span>"+
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

				print +="<span style='font-size:80%;font-family:sans-serif;'><b><center><u>BUSINESS INTERESTS AND FINANCIAL CONNECTIONS</u></center></b></span>"+
						"<span style='font-size:65%;font-family:sans-serif;'><center><i>(of Declarant's spouse/ Unmarried Children Below Eighteen(18) years of Age Living in Declarant's Household)</i></center></span>"+
						"<span style='font-size:65%;font-family:sans-serif;'><center><c><input type='checkbox' /> I/ We do not have any business interest or financial connection.</c></center></span><br />"+
						"<table style='border-collapse: collapse;width:100%;border:1px solid black;'>"+
							"<tr>"+
								"<th style='width:25%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black;'><b><center>NAME OF ENTITY/BUSINESS ENTERPRISE</center></b></td>"+
								"<th style='width:25%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black;'><b><center>BUSINESS ADDRESS</center></b></th>"+
								"<th style='width:25%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black;'><b><center>NATURE OF BUSINESS INTEREST &/OR FINANCIAL CONNECTION</center></b></th>"+
								"<th style='width:25%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black;'><b><center>DATE OF ACQUISITION OF INTEREST OR CONNECTION</center></b></th>";
							"</tr>";

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

        		$(data).each(function(index,value){
            	print +="<tr>"+
							"<td style='width:25%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center>"+value[2]+"</center></td>"+
							"<td style='width:25%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center>"+value[3]+"</center></td>"+
							"<td style='width:25%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center>"+value[4]+"</center></td>"+
							"<td style='width:25%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center>"+value[5]+"</center></td>"+
						"</tr>";
        		});

        		for (i = 0; i < (4-data.length); i++) {
 					print +="<tr>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center><br /></center></td>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center></center></td>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center></center></td>"+
								"<td style='width:25%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center></center></td>"+
							"</tr>";
				}

        		print +="</table><br />";
				
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

				print +="<span style='font-size:80%;font-family:sans-serif;'><b><center><u>RELATIVES IN THE GOVERNMENT SERVICE</u></center></b></span>"+
						"<span style='font-size:65%;font-family:sans-serif;'><center><i>(within the Fourth Degree of Consanguinity or Affinity. Include also Bias, Balae and Inso)</i></center></span>"+
						"<span style='font-size:65%;font-family:sans-serif;'><center><c><input type='checkbox' /> I/ We do not know of any relative/s in the government service)</c></center></span><br />"+
						"<table style='border-collapse: collapse;width:100%;border:1px solid black;'>"+
							"<tr>"+
								"<th style='width:30%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black;'><b><center>NAME OF RELATIVE</center></b></td>"+
								"<th style='width:15%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black;'><b><center>RELATIONSHIP</center></b></th>"+
								"<th style='width:15%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black;'><b><center>POSITION</center></b></th>"+
								"<th style='width:40%;background-color: #a5aeaf;font-size:60%;font-family:sans-serif;border:1px solid black;'><b><center>NAME OF AGENCY/OFFICE AND ADDRESS</center></b></th>";
							"</tr>";
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

        		$(data).each(function(index,value){
            	print +="<tr>"+
							"<td style='width:30%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center>"+value[2]+"</center></td>"+
							"<td style='width:15%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center>"+value[3]+"</center></td>"+
							"<td style='width:15%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center>"+value[4]+"</center></td>"+
							"<td style='width:40%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center>"+value[5]+"</center></td>"+
						"</tr>";
        		});
        		for (i = 0; i < (4-data.length); i++) {
 					print +="<tr>"+
								"<td style='width:30%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center><br /></center></td>"+
								"<td style='width:15%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center></center></td>"+
								"<td style='width:15%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center></center></td>"+
								"<td style='width:40%;font-size:60%;font-family:sans-serif;border:1px solid black;' height='40'><center></center></td>"+
							"</tr>";
				}

        		print +="</table><br />";

        		content += 	"</div>"+
							"</div>";
        		
				$("#relatives").html(content);
			}
		});

		var content="";
		var bago="";
		var data = system.ajax('../assets/harmony/Process.php?get-other',id);
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

				content ="<div id='profile-card' class='card'>"+
						"    <div class='card-content'>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Date(dd/mm/yyy): "+data[0][2]+"</span>"+
						"			<button data-value='"+data[0][2]+"' disabled='' data-cmd='updateOther' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"<h5>Declarant</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Government Issued ID: "+data[0][3]+"</span>"+
						"			<button data-value='"+data[0][3]+"' disabled='' data-cmd='updateOther' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Declarant Government Issued ID' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-cached cyan-text text-darken-2'></i> ID No.: "+data[0][4]+"</span>"+
						"			<button data-value='"+data[0][4]+"' disabled='' data-cmd='updateOther' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Declarant ID No.' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-event cyan-text text-darken-2'></i> Date Issued: "+data[0][5]+"</span>"+
						"			<button data-value='"+data[0][5]+"' disabled='' data-cmd='updateOther' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Declarant Date Issued' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"<h5>Spouse</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Government Issued ID: "+data[0][6]+"</span>"+
						"			<button data-value='"+data[0][6]+"' disabled='' data-cmd='updateOther' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Co-Declarant/Spouse Government Issued ID' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> ID No.: "+data[0][7]+"</span>"+
						"			<button data-value='"+data[0][7]+"' disabled='' data-cmd='updateOther' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Co-Declarant/Spouse ID No.' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-accessibility cyan-text text-darken-2'></i> Date Issued: "+data[0][8]+"</span>"+
						"			<button data-value='"+data[0][8]+"' disabled='' data-cmd='updateOther' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Co-Declarant/Spouse Date Issued' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
        		
				$("#other").html(content);
				print +="<p style='text-indent: 50px;font-size:60%;font-family:sans-serif;'>I hereby certify that these are true and correct statements of my assets, liabilities, net worth, business interests and financial connections,including those of my spouse and unmarried children below (18) years of age living in my household, and that to the best of my knowledge, the above-enumerated are names of my relatives in the government within the fourth civil degree of consanguinity or affinity.</p>"+
        				"<p style='text-indent: 50px;font-size:60%;font-family:sans-serif;'>I hereby authorize the Ombdsman or his/her duly authorized representative to obtain and secure from all appropriate governemnt agencies, including the Bureau of Internal Revenue such documents that may show my assets, liabilities, net worth, business interests and financial connections, to include those of my spouse and unmarried children below 18 years of age living with me in my household covering previous years to include the year I first assumed office in government.</p>"+
						"<table style='border-collapse: collapse;width:100%;'>"+
							"<tr>"+
								"<td style='width:5%;font-size:60%;font-family:sans-serif;'><b>Date: </b></td>"+
								"<td style='width:5%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:20%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;'><center>"+data[0][2]+"</center></td>"+
								"<td style='width:70%;font-size:60%;font-family:sans-serif;'></td>"+
							"</tr>"+
        				"</table><br /><br />"+
        				"<table style='border-collapse: collapse;width:100%;'>"+
							"<tr>"+
								"<td style='width:47%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;'></td>"+
								"<td style='width:6%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:47%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;'></td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:47%;font-size:60%;font-family:sans-serif;'><center><i>(Signiture of Applicant)</i></center></td>"+
								"<td style='width:6%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:47%;font-size:60%;font-family:sans-serif;'><center><i>(Signiture of Co-Declarant/Spouse)</i></center></td>"+
							"</tr>"+
        				"</table><br />"+
        				"<table style='border-collapse: collapse;width:100%;'>"+
							"<tr>"+
								"<td style='width:22%;font-size:60%;font-family:sans-serif;'>Government Issued ID:</td>"+
								"<td style='width:1%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:23%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;'><center>"+data[0][3]+"</center></td>"+
								"<td style='width:8%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:22%;font-size:60%;font-family:sans-serif;'>Government Issued ID:</td>"+
								"<td style='width:1%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:23%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;'><center>"+data[0][4]+"</center></td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:22%;font-size:60%;font-family:sans-serif;'>ID No.:</td>"+
								"<td style='width:1%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:23%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;'><center>"+data[0][5]+"</center></td>"+
								"<td style='width:8%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:22%;font-size:60%;font-family:sans-serif;'>ID No.:</td>"+
								"<td style='width:1%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:23%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;'><center>"+data[0][6]+"</center></td>"+
							"</tr>"+
							"<tr>"+
								"<td style='width:22%;font-size:60%;font-family:sans-serif;'>Date Issued:</td>"+
								"<td style='width:1%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:23%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;'><center>"+data[0][7]+"</center></td>"+
								"<td style='width:8%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:22%;font-size:60%;font-family:sans-serif;'>Date Issued::</td>"+
								"<td style='width:1%;font-size:60%;font-family:sans-serif;'></td>"+
								"<td style='width:23%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;'><center>"+data[0][8]+"</center></td>"+
							"</tr>"+
        				"</table><br /><br />"+
        				"<table style='border-collapse: collapse;width:100%;'>"+
							"<tr>"+
								"<td style='width:33%;font-size:60%;font-family:sans-serif;text-indent: 20px;'><b>SUBSCRIBE AND SWORN</b> to before me this</td>"+
								"<td style='width:9%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;'><center></center></td>"+
								"<td style='width:8%;font-size:60%;font-family:sans-serif;'><center>day of</center></td>"+
								"<td style='width:20%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;'><center></center></td>"+
								"<td style='width:30%;font-size:60%;font-family:sans-serif;'>, affiant exhibiting to me the above-stated</td>"+
							"</tr>"+
        				"</table>"+
        				"<table style='border-collapse: collapse;width:100%;'>"+
							"<tr>"+
								"<td style='font-size:60%;font-family:sans-serif;'> government issued identification card.</td>"+
							"</tr>"+
        				"</table><br /><br />"+
        				"<table style='border-collapse: collapse;width:100%;'>"+
							"<tr>"+
								"<td style='width:45%;font-size:60%;font-family:sans-serif;'><center></center></td>"+
								"<td style='width:40%;font-size:60%;font-family:sans-serif;border-bottom:1px solid black;'></td>"+
								"<td style='width:15%;font-size:60%;font-family:sans-serif;'></td>"+							
							"</tr>"+
							"<tr>"+
								"<td style='width:45%;font-size:60%;font-family:sans-serif;'><center></center></td>"+
								"<td style='width:40%;font-size:60%;font-family:sans-serif;'><center><i>(Person Administering Oath)</i></center></td>"+
								"<td style='width:15%;font-size:60%;font-family:sans-serif;'></td>"+							
							"</tr>"+
        				"</table>"+
						"<span style='font-size:60%;font-family:sans-serif;'><center><i>Page 2 of ___</i></center></span>";
			}
		});
		
		// $("#salnPrint").html(print);
		$("a[data-cmd='print_saln']").on('click',function(){
			$(print).print();
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
						"        <img class='activator' src='../assets/images/user-bg-2.jpeg' alt='user background'>"+
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
						"        <img class='activator' src='../assets/images/user-bg-2.jpeg' alt='user background'>"+
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
							"<table style='border-collapse: collapse;width:100%;'>"+
	  							"<tr>"+
	  								"<td style='width:100%;font-size:100%;font-family:sans-serif;'><center>Republic of the Philippines</center></td>"+
								"</tr>"+
								"<tr>"+
	  								"<td style='width:100%;font-size:100%;font-family:sans-serif;'><center><b>MUNICIPALITY OF MABINI</b></center></td>"+
								"</tr>"+
								"<tr>"+
	  								"<td style='width:100%;font-size:100%;font-family:sans-serif;'><center>PANGASINAN</center></td>"+
								"</tr>"+
							"</table><br /><br />"+

							"<table style='border-collapse: collapse;width:100%;'>"+
	  							"<tr>"+
	  								"<td style='width:100%;font-size:140%;font-family:sans-serif;font-weight:700;'><center>TRAVEL ORDER</center></td>"+
								"</tr>"+
							"</table><br /><br />"+

							"<table style='border-collapse: collapse;width:100%;'>"+
	  							"<tr>"+
	  								"<td style='width:100%;text-align:right;font-size:90%;font-family:sans-serif;'>Date: <u>"+data[0][2]+"</u></td>"+
								"</tr>"+
							"</table><br />"+

							"<table style='border-collapse: collapse;width:100%;'>"+
	  							"<tr>"+
	  								"<td style='width:25%;font-size:90%;font-family:sans-serif;'>Name:</td>"+
	  								"<td style='border-bottom: 1px solid black;width:65%;font-size:90%;font-family:sans-serif;'>"+data[0][3]+"</td>"+
	  								"<td style='width:10%;font-size:90%;font-family:sans-serif;'></td>"+
								"</tr>"+
							"</table><br />"+
							"<table style='border-collapse: collapse;width:100%;'>"+
	  							"<tr>"+
	  								"<td style='width:25%;font-size:90%;font-family:sans-serif;'>Position:</td>"+
	  								"<td style='border-bottom: 1px solid black;width:65%;font-size:90%;font-family:sans-serif;'>"+data[0][4]+"</td>"+
	  								"<td style='width:10%;font-size:90%;font-family:sans-serif;'></td>"+
								"</tr>"+
							"</table><br />"+
							"<table style='border-collapse: collapse;width:100%;'>"+
	  							"<tr>"+
	  								"<td style='width:25%;font-size:90%;font-family:sans-serif;'>Section:</td>"+
	  								"<td style='border-bottom: 1px solid black;width:65%;font-size:90%;font-family:sans-serif;'>"+data[0][5]+"</td>"+
	  								"<td style='width:10%;font-size:90%;font-family:sans-serif;'></td>"+
								"</tr>"+
							"</table><br />"+
							"<table style='border-collapse: collapse;width:100%;'>"+
	  							"<tr>"+
	  								"<td style='width:25%;font-size:90%;font-family:sans-serif;'>Destination:</td>"+
	  								"<td style='border-bottom: 1px solid black;width:65%;font-size:90%;font-family:sans-serif;'>"+data[0][6]+"</td>"+
	  								"<td style='width:10%;font-size:90%;font-family:sans-serif;'></td>"+
								"</tr>"+
							"</table><br />"+
							"<table style='border-collapse: collapse;width:100%;'>"+
	  							"<tr>"+
	  								"<td style='width:25%;font-size:90%;font-family:sans-serif;'>Date/Time of Departure:</td>"+
	  								"<td style='border-bottom: 1px solid black;width:65%;font-size:90%;font-family:sans-serif;'>"+data[0][7]+"</td>"+
	  								"<td style='width:10%;font-size:90%;font-family:sans-serif;'></td>"+
								"</tr>"+
							"</table><br />"+
							"<table style='border-collapse: collapse;width:100%;'>"+
	  							"<tr>"+
	  								"<td style='width:25%;font-size:90%;font-family:sans-serif;'>Date/Time of Arrival:</td>"+
	  								"<td style='border-bottom: 1px solid black;width:65%;font-size:90%;font-family:sans-serif;'>"+data[0][8]+"</td>"+
	  								"<td style='width:10%;font-size:90%;font-family:sans-serif;'></td>"+
								"</tr>"+
							"</table><br />"+
							"<table style='border-collapse: collapse;width:100%;'>"+
	  							"<tr>"+
	  								"<td style='width:25%;font-size:90%;font-family:sans-serif;'>Purpose:</td>"+
	  								"<td style='border-bottom: 1px solid black;width:65%;font-size:90%;font-family:sans-serif;'>"+data[0][9]+"</td>"+
	  								"<td style='width:10%;font-size:90%;font-family:sans-serif;'></td>"+
								"</tr>"+
							"</table><br />"+
							"<table style='border-collapse: collapse;width:100%;'>"+
	  							"<tr>"+
	  								"<td style='width:25%;font-size:90%;font-family:sans-serif;'>Person(s) to be contacted:</td>"+
	  								"<td style='border-bottom: 1px solid black;width:65%;font-size:90%;font-family:sans-serif;'>"+data[0][10]+"</td>"+
	  								"<td style='width:10%;font-size:90%;font-family:sans-serif;'></td>"+
								"</tr>"+
							"</table><br /><br /><br /><br /><br />"+

							"<table style='border-collapse: collapse;width:100%;'>"+
	  							"<tr>"+
	  								"<td style='width:71%;text-align:right;font-size:100%;font-family:sans-serif;'>Approved:</td>"+
	  								"<td style='width:29%;font-size:110%;font-family:sans-serif;'></td>"+
								"</tr>"+
							"</table><br />"+
							"<table style='border-collapse: collapse;width:100%;'>"+
	  							"<tr>"+
	  								"<td style='width:71%;text-align:right;font-size:105%;font-family:sans-serif;'></td>"+
	  								"<td style='width:29%;font-size:105%;font-family:sans-serif;'><center>ALIMAR R. BRIANA</center></td>"+
								"</tr>"+
							"</table>"+
							"<table style='border-collapse: collapse;width:100%;'>"+
	  							"<tr>"+
	  								"<td style='width:71%;text-align:right;font-size:105%;font-family:sans-serif;'></td>"+
	  								"<td style='width:29%;font-size:105%;font-family:sans-serif;'><center>Municipal Mayor</center></td>"+
								"</tr>"+
							"</table><br />"+
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
						"        <img class='activator' src='../assets/images/user-bg-2.jpeg' alt='user background'>"+
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
						"        <img class='activator' src='../assets/images/user-bg-2.jpeg' alt='user background'>"+
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
									"<p style='margin-top:5%;font-size:130%;font-family:sans-serif;text-align: center;'><b>APPLICATION FOR LEAVE</b></p><br/>"+
								"</div>"+
								"<table style='border-collapse: collapse;width:100%;'>"+
									"<tr style='border: 1px solid black;height:60px;'>"+
		    							"<td style='border: 1px solid black;width:50%;'>"+
			    							"<span style='font-size:80%;font-family:sans-serif;'>&nbsp;1. Office/Agency:</span><br />"+
			    							"<span style='font-size:80%;font-family:sans-serif;'><center>Local Government Unit, Mabini Pangasinan</center></span>"+
		    							"</td>"+
		   							 	"<td style='width:20%;'>"+
			    							"<span style='font-size:80%;font-family:sans-serif;'>&nbsp;2. Name (Last)</span><br />"+
			    							"<span style='font-size:80%;font-family:sans-serif;'><center>"+data[0][3]+"</center></span>"+
		    							"</td>"+
		    							"<td style='width:18%;text-align:center;'>"+
			    							"<span style='font-size:80%;font-family:sans-serif;'>(First)</span><br />"+
			    							"<span style='font-size:80%;font-family:sans-serif;'>"+data[0][4]+"</span>"+
		    							"</td>"+
		    							"<td style='width:13%;text-align:center;'>"+
			    							"<span style='font-size:80%;font-family:sans-serif;'>(Middle)</span><br />"+
			    							"<span style='font-size:80%;font-family:sans-serif;'>"+data[0][5]+"</span>"+
		    							"</td>"+
		  							"</tr'>"+

									"<table style='border-collapse: collapse;width:100%;'>"+
			  							"<tr style='width:100%;'>"+
			  								"<td height='50' style='border: 1px solid black;width:16%;'>"+
				    							"<span style='font-size:80%;font-family:sans-serif;'>&nbsp;3. Date of Filling</span><br />"+
				    							"<span style='font-size:80%;font-family:sans-serif;'><center> "+data[0][6]+"</center></span>"+
			    							"</td>"+
			    							"<td height='50' style='border: 1px solid black;width:18%;'>"+
				    							"<span style='font-size:80%;font-family:sans-serif;'>&nbsp;4. Position</span><br />"+
				    							"<span style='font-size:80%;font-family:sans-serif;'><center> "+data[0][7]+"</center></span>"+
			    							"</td>"+
			    							"<td height='50' style='border: 1px solid black;width:16%;'>"+
				    							"<span style='font-size:80%;font-family:sans-serif;'>&nbsp;5. Salary (Monthly)</span><br />"+
				    							"<span style='font-size:80%;font-family:sans-serif;'><center> "+data[0][8]+"</center></span>"+
			    							"</td>"+
										"</tr>"+
									"</table>"+

									"<table style='border-collapse: collapse;width:100%;'>"+
			  							"<tr style='width:100%;'>"+
			  								"<td height='60' style='border: 1px solid black;width:50%;'>"+
				    							"<span style='font-size:80%;font-family:sans-serif;'>&nbsp;6. a. <b>TYPE OF LEAVE: "+data[0][9]+"</b></span><br /><br />"+
				    							"<span style='font-size:80%;font-family:sans-serif;'>&nbsp;&nbsp;Specify: <u>"+data[0][10]+" Vacation</u></span>"+
			    							"</td>"+
			    							"<td height='60' style='border: 1px solid black;width:50%;word-wrap: break-word;'>"+
				    							"<span style='font-size:80%;font-family:sans-serif;'>&nbsp;6. b. <b>WHERE WILL BE SPENT:</b> "+data[0][13]+"</span><br /><br />"+
				    							"<span style='font-size:80%;font-family:sans-serif;'>&nbsp;&nbsp;Specify: <u>"+data[0][14]+"</u></span>"+
			    							"</td>"+
										"</tr>"+
									"</table>"+

									"<table style='border-collapse: collapse;width:100%;'>"+
			  							"<tr style='width:100%;'>"+
			  								"<td style='border: 1px solid black;width:50%;'>"+
				    							"<span style='font-size:80%;font-family:sans-serif;'>&nbsp;6. c. <b>NUMBER OF WORKING DAYS APPLIED FOR:</b> <u>"+data[0][11]+"</u></span><br /><br />"+
				    							"<span style=''></span><br /><br />"+
				    							"<span style='font-size:80%;font-family:sans-serif;'>&nbsp;&nbsp;INCLUSIVE DATE: <u>"+data[0][12]+"</u></span>"+
			    							"</td>"+
			    							"<td style='border: 1px solid black;width:50%;'>"+
				    							"<span style='font-size:80%;font-family:sans-serif;'><br />&nbsp;6. d. COMMUTATION: "+data[0][15]+"</span><br /><br /><br />"+
				    							"<table style='border-collapse: collapse;width:50%;' align='center'>"+
						  							"<tr>"+
						  								"<td height='20' style='border-bottom: 1px solid black;width:50%;'>"+
						    							"</td>"+
													"</tr>"+
													"<tr>"+
						  								"<td height='15' style='font-size:80%;font-family:sans-serif;'><center>(Signature of Applicant)</center>"+
						    							"</td>"+
													"</tr>"+
												"</table>"+
			    							"</td>"+
										"</tr>"+
									"</table>"+

									"<table style='border-collapse: collapse;width:100%;'>"+
			  							"<tr style='width:100%;'>"+
			  								"<td height='30' style='border: 1px solid black;width:50%;'>"+
				    							"<span style='font-size:80%;font-family:sans-serif;'><center>7. DETAILS OF ACTION ON APPLICATION</center></span>"+
			    							"</td>"+				    							
										"</tr>"+
									"</table>"+

										"<table style='border-collapse: collapse;width:100%;'>"+
				  							"<tr style='width:100%;'>"+
				  								"<td style='border: 1px solid black;width:50%;'>"+
					    							"<span style='font-size:80%;font-family:sans-serif;'>&nbsp;7. a. <b>CERTIFICATION OF LEAVE CREDITS<br style='' />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AS OF:</b> <u>"+data[0][16]+"</u></span><br /><br />"+					    							
													"<table style='border-collapse: collapse;width:100%;border: 1px solid black;'>"+
														"<tr>"+								
								    							"<td style='font-size:80%;font-family:sans-serif;border: 1px solid black;'><center>VACATION</center></td>"+
								    							"<td style='font-size:80%;font-family:sans-serif;border: 1px solid black;'><center>SICK</center></td>"+	
								    							"<td style='font-size:80%;font-family:sans-serif;border: 1px solid black;'><center>TOTAL</center></td>"+    
							    						"</tr>"+
							    						"<tr>"+								
								    							"<td style='font-size:80%;font-family:sans-serif;border: 1px solid black;'><center>"+data[0][17]+"</center></td>"+
								    							"<td style='font-size:80%;font-family:sans-serif;border: 1px solid black;'><center>"+data[0][18]+"</center></td>"+	
								    							"<td style='font-size:80%;font-family:sans-serif;border: 1px solid black;'><center>"+data[0][19]+"</center></td>"+    
							    						"</tr>"+
							    						"<tr>"+								
								    							"<td style='font-size:80%;font-family:sans-serif;border: 1px solid black;'><center>DAYS</center></td>"+
								    							"<td style='font-size:80%;font-family:sans-serif;border: 1px solid black;'><center>DAYS</center></td>"+	
								    							"<td style='font-size:80%;font-family:sans-serif;border: 1px solid black;'><center>DAYS</center></td>"+    
							    						"</tr>"+
					    							"</table>"+
					    							"<br /><br /><span style='font-size:80%;font-family:sans-serif;'><center>KEITH C. BALINTOS</center></span>"+
					    							"<span style='font-size:80%;font-family:sans-serif;'><center>OIC-HRMO</center></span>"+
					    						"</td>"+
				    							"<td style='border: 1px solid black;width:50%;word-wrap: break-word;'>"+
					    							"<span style='font-size:80%;font-family:sans-serif;'><br />&nbsp;7.b. <b>RECOMMENDATION:</b> "+data[0][23]+"</span><br /><br /><br />"+
					    							"<span style='font-size:80%;font-family:sans-serif;'>&nbsp;&nbsp;&nbsp;&nbsp;Disapproved Due To: <u>"+data[0][24]+"</u></span><br /><br /><br /><br /><br />"+
													"<table style='border-collapse: collapse;width:50%;' align='center'>"+
							  							"<tr>"+
							  								"<td height='20' style='border-bottom: 1px solid black;width:50%;'>"+
							    							"</td>"+
														"</tr>"+
														"<tr>"+
							  								"<td height='15' style='font-size:80%;font-family:sans-serif;'><center>(Signature of Applicant)</center>"+
							    							"</td>"+
														"</tr>"+
													"</table>"+
				    							"</td>"+
											"</tr>"+
										"</table>"+

										"<table style='border-collapse: collapse;width:100%;'>"+
				  							"<tr style='width:100%;'>"+
				  								"<td style='border: 1px solid black;width:50%;'>"+
					    							"<span style='font-size:80%;font-family:sans-serif;'><br />&nbsp;7. c <b>APPROVED FOR:</b></span><br /><br />"+
					    							"<span style='font-size:80%;font-family:sans-serif;'>&nbsp;&nbsp;&nbsp;&nbsp;<u>"+data[0][20]+"</u>&nbsp;days with pay</span><br />"+
					    							"<span style='font-size:80%;font-family:sans-serif;'>&nbsp;&nbsp;&nbsp;&nbsp;<u>"+data[0][21]+"</u>&nbsp;days without pay</span><br />"+
					    							"<span style='font-size:80%;font-family:sans-serif;'>&nbsp;&nbsp;&nbsp;&nbsp;<u>"+data[0][22]+"</u>&nbsp;other(Specify)</span><br />"+
					    							"<span style='font-size:80%;font-family:sans-serif;'></span><br />"+
				    							"</td>"+
				    							"<td style='border: 1px solid black;width:50%;word-wrap: break-word;vertical-align:top;'>"+
					    							"<span style='font-size:80%;font-family:sans-serif;'><br />&nbsp;7. d. <b>DISAPPROVED DUE TO:</b> </span><br /><br />"+
					    							"<span style='font-size:80%;font-family:sans-serif;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<u>"+data[0][22]+"</u></span>"+
				    							"</td>"+
											"</tr>"+
										"</table><br /<br />"+

									"<p style='font-size:100%;font-family:sans-serif;margin-top:5%;text-align: center;'><b>ALIMAR R. BRIANA</b></p>"+
									"<p style='font-size:100%;font-family:sans-serif;margin-top:-2%;text-align: center;'>Municipal Mayor</p>"+
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