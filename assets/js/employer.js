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
					"        			<a data-cmd='updateAdminPicture' data-value='"+profile+"' data-name='"+data[0][1]+"' data-node='"+data[0][0]+"' data-prop='Picture' class='btn waves-effect white-text no-shadow black' style='font-size: 10px;z-index: 1;padding: 0 52px;top:114px;'>Change</a>"+
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

employee = {
	ini:function(){
		var data = account.get();
		data = JSON.parse(data.responseText);
		employee.list(data[0][1]);

		$("#add_employee").on("click",function(){
			employee.add(data[0][1]);			
		});
	},
	get:function(){
		var data = system.html('../assets/harmony/Process.php?get-employee');
		return data;
	},
	add:function(id){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addEmployee").each(function(i,content){
			$("#modal_popUp .modal-content").html(content);
			$('#modal_popUp').openModal('show');		
		    $("select").material_select();

			$("#form_addEmployee").validate({
			    rules: {
			        field_gname: {required: true,maxlength: 50},
			        field_mname: {required: true,maxlength: 50},
			        field_fname: {required: true,maxlength: 50},
			        field_nickname: {required: true,maxlength: 50},
			        field_dob: {required: true,maxlength: 50,checkDate:true},
			        field_gender: {required: true,maxlength: 50},
			        field_address: {required: true,maxlength: 100},
			        field_phone: {required: true,maxlength: 50},
			        field_email: {required: true,maxlength: 100,checkEmail:true},
			        field_position: {required: true,maxlength: 50,},
			        field_employeeID: {required: true,maxlength: 50,validateEmployeeID:true},
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
        			var client = localStorage.getItem('client_id')
        			console.log();
					var data = system.ajax('../assets/harmony/Process.php?set-newPendingEmployee',[_form,id]);
					data.done(function(data){
						console.log(data);
						if(data == 1){
							var text = "<h1>Congratulations</h1>, you are now registered. You can login using <u>"+_form[2]['value']+"</u> as you username and <u>"+
							_form[5]['value']+"</u> as your password. <a href='http://loginocalhost/kaboomRewards/login.html'>Just follow this link</a>";
							var data = system.send_mail(_form[8]['value']+',info@rnrdigitalconsultancy.com','Employee Registration',text);
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
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
	},
	list:function(id){
		var data = system.ajax('../assets/harmony/Process.php?get-employeeByID',id);
		data = JSON.parse(data.responseText);

		var content = "", actions = "";
		$.each(data,function(i,v){
			var profile = ((v[12] == "") || (v[12] == null))?'avatar.jpg':v[12];

			if(Number(v[15]) == 1){
				actions = "<i class='mdi-action-lock-open right black-text' data-position='left' data-delay='50' data-tooltip='Active'></i>";	
			}
			else if(Number(v[15]) == 2){
				actions = "<i class='mdi-action-lock right black-text' data-position='left' data-delay='50' data-tooltip='Pending'></i>";	
			}
			else{
				actions = "<i class='mdi-action-lock right black-text' data-position='left' data-delay='50' data-tooltip='Deactivated'></i>";	
			}
			content += "<tr>"+
						"	<td width='1px'>"+(i+1)+". </td>\n"+
						"	<td><img src='../assets/images/profile/"+profile+"' alt='Thumbnail' class='responsive-img valign profile-image' style='width:50px;'>"+actions+"</td>\n"+
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
		employee.getPoints(id);
		employee.getPointsActivity(id);
		employee.getBuysActivity(id);
		var content = "";
		var data = system.ajax('../assets/harmony/Process.php?get-employeeDetails',id);
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

				if(Number(data[0][15]) == 1){
					status = "Active";
					var actions = "<button disabled data-cmd='deactivateEmployee' data-name='"+data[0][4]+"' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock-open right grey-text'></i>"+
								  "</button>";	
				}
				else if(Number(data[0][15]) == 2){
					status = "Pending";
					var actions = "<button disabled data-cmd='activateEmployee' data-name='"+data[0][4]+"' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock right grey-text'></i>"+
								  "</button>";	
				}
				else{
					status = "Deactivated";
					var actions = "<button disabled data-cmd='activateEmployee' data-name='"+data[0][4]+"' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock right grey-text'></i>"+
								  "</button>";	
				}

				var profile = ((data[0][12] == "") || (data[0][12] == null))?"avatar.jpg":data[0][12];
				content = "<div id='profile-card' class='card'>"+
						"    <div class='card-image waves-effect waves-block waves-light'>"+
						"        <img class='activator' src='../assets/images/user-bg.jpg' alt='user background'>"+
						"    </div>"+
						"    <div class='card-content'>"+
						"        <div class=' responsive-img activator card-profile-image circle'>"+
						"        	<img src='../assets/images/profile/"+profile+"' alt='' class='circle'>"+
						"        	<a data-value='"+profile+"' data-cmd='updateEmployeePicture' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-prop='Picture' class='btn waves-effect white-text no-shadow black' style='font-size: 10px;z-index: 1;padding: 0 12px;top:40px;'>Change</a>"+
						"		 </div>"+
						"        <span class='card-title activator grey-text text-darken-4'>"+data[0][4]+" "+data[0][5]+" "+data[0][3]+" </span>"+
						"			<a data-value='"+JSON.stringify([data[0][4],data[0][5],data[0][3]])+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update account'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 <div class='divider'></div>"+
						"        <p><i class='mdi-action-info-outline cyan-text text-darken-2'></i> Status: "+status+actions+"</p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Nickname: "+data[0][6]+"</span>"+
						"			<a data-value='"+data[0][6]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Nickname' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-work cyan-text text-darken-2'></i> Position: "+data[0][13]+"</span>"+
						"			<a data-value='"+data[0][13]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Phone: "+data[0][9]+"</span>"+
						"			<a data-value='"+data[0][9]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-communication-email cyan-text text-darken-2'></i> Email: "+data[0][10]+"</span>"+
						"			<a data-value='"+data[0][10]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Email' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-map cyan-text text-darken-2'></i> Address: "+data[0][11]+"</span>"+
						"			<a data-value='"+data[0][11]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-cached cyan-text text-darken-2'></i> Gender: "+data[0][7]+"</span>"+
						"			<a data-value='"+data[0][7]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Gender' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-event cyan-text text-darken-2'></i> Date of Birth: "+data[0][8]+"</span>"+
						"			<a data-value='"+data[0][8]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-box cyan-text text-darken-2'></i> Employee ID: "+data[0][1]+"</span>"+
						"			<button disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Employee ID' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-verified-user cyan-text text-darken-2'></i> Password"+"</span>"+
						"			<button disabled data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Password' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update password'>"+
						"				<i class='mdi-editor-mode-edit right grey-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
				$("#profile").html(content);

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
			else if(data.prop == "Nickname"){
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
											var data = system.ajax('../assets/harmony/Process.php?update-employeePicture',[id,$image.cropper("getDataURL")]); // 
											data.done(function(data){
												Materialize.toast('Picture has been changed.',4000);
												system.clearForm();
												App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
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
		$("a[data-cmd='deactivateEmployee']").on('click',function(){
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
					var data = system.ajax('../assets/harmony/Process.php?request-deactivate-employee',[id,remarks]);
					data.done(function(data){
						console.log(data);
						if(data == 1){
							Materialize.toast('Request sent. Wait for the administrator approval.',4000);
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
				var data = system.ajax('../assets/harmony/Process.php?request-activate-employee',id);
				data.done(function(data){
					if(data == 1){
						Materialize.toast('Request sent. Wait for the administrator approval.',4000);
						system.clearForm();
						App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
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
	upload:function(){
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
									var data = [],count = 0, search = [];
									var employeeList = [];

									var employerID = localStorage.getItem('client_id');
									employeeList = system.ajax('../assets/harmony/Process.php?get-employeeByID',employerID);
									employeeList = JSON.parse(employeeList.responseText);
									if(results['data'].length<=2000){
										Materialize.toast("Removing duplicated entries.",2000);
										setTimeout(function(){
											$("#importPreview").html(content);
						                	$("#display_import").removeClass('hidden');

											for(var x=1;x<(results['data'].length-1);x++){
												if(results['data'][x][0] != ""){
													search = system.searchJSON(employeeList,1,results['data'][x][0]);
													if(search.length==0)												
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
												employee.saveUpload(data);
											}
											else{
												$(".display_loading").html("<span class='red-text'>All data are already in the system.</span>");
											}

						                	$("#display_import").removeClass('hidden');
											$("#display_importLoading").addClass('animated zoomOut').html("");
										},1000)
									}
									else{
										Materialize.toast("Too much information. Try uploading up to 2000 rows. ",4000);
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
	saveUpload:function(_data){
        $("#save_import").on("click",function(){
			Materialize.toast('Importing...',4000);
        	$(this).addClass('disabled');
			var data = system.xml("pages.xml");
			$(data.responseText).find("loader2").each(function(i,content){
				$(".display_loading").html(content);
	        	setTimeout(function(){
	        		_data = ($.type(_data) == "array")?JSON.stringify(_data):_data;
        			var client = localStorage.getItem('client_id')
					var data = system.ajax('../assets/harmony/Process.php?set-newBulkEmployeeAdmin',[_data,client]);
					data.done(function(data){
						if(data == 1){
							Materialize.toast('Saved.',4000);
							App.handleLoadPage("#cmd=index;content=focusClient");
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
}

points = {
	ini:function(){
	},
	add:function(id){
		$("#add_points").on("click",function(){
			console.log(id);
			var data = system.xml("pages.xml");
			$(data.responseText).find("addPoints").each(function(i,content){
				$("#modal_confirm .modal-content").html(content);
				$('#modal_confirm .modal-footer').html("");			
				$('#modal_confirm').openModal('show');

				$("#form_addPoints").validate({
				    rules: {
				        field_points: {required: true,checkPositiveNumber:true,checkCompanyPoints:id,maxNumber:1000},
				        field_remarks: {required: true,maxlength: 500},
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
						var data = system.ajax('../assets/harmony/Process.php?set-addPendingPointsEmployer',[_form,id]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								$('#modal_confirm').closeModal();	
								Materialize.toast('Points added. Waiting for the administrator\'s confirmation.',1000,'',function(){
									App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
								});
							}
							else{
								Materialize.toast('Something went wrong. Try again later',4000);
							}
						});
				    }
				});
			});
		});
	},
	upload:function(user){
        var $inputImage = $("#field_file"), status = true, res = "";
        if(window.FileReader){
            $inputImage.on('change',function(){
            	$("#field_file").addClass("disabled");
                var files = this.files, file = files[0].name.split('.');
                if((file[1] == "csv") || (file[1] == "xlsx")){ // 
					var data = system.xml("pages.xml");
					$(data.responseText).find("tablePointsPreview").each(function(i,content){
						$("#field_file").parse({
							config: {
								complete: function(results, file) {
									$("#display_importLoading").removeClass('zoomOut').html("");
							    	system.preloader("#display_importLoading");
									system.loading(true);
									var data = [],count = 0, search = [];
									var employeeList = [];

									var employerID = localStorage.getItem('client_id');
									employeeList = system.ajax('../assets/harmony/Process.php?get-employeeByID',employerID);
									employeeList = JSON.parse(employeeList.responseText);

									if((employeeList.length>0)&& ((results['data'][0].length == 4) && (results['data'][0][3] == 'Points')) && (results['data'].length<=2000)){
										Materialize.toast("Validating data. This may take a minute.",2000);
										setTimeout(function(){
											$("#importPreview").html(content);
						                	$("#display_import").removeClass('hidden');

											for(var x=1;x<(results['data'].length-1);x++){
												if(results['data'][x][0] != ""){
													search = system.searchJSON(employeeList,1,results['data'][x][0]);
													if(search.length==1)												
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
							                                return (full[2]!="")?"<span>"+full[1]+"</span>":null;
							                            }
							                        },
							                        {data: "",
							                            render: function ( data, type, full ){
							                                return (full[1]!="")?"<span>"+full[2]+"</span>":null;
							                            }
							                        },
							                        {data: "",
							                            render: function ( data, type, full ){
							                                return (full[3]!="")?"<span>"+full[3]+"</span>":null;
							                            }
							                        }
							                    ]
							                });

											table.on( 'order.dt search.dt', function () {
											    table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
											        cell.innerHTML = i+1;
											    } );
											} ).draw();

											if(data.length>0){
												points.saveUpload(data);
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
											"&bull; No employees yet; <br/>&bull; Your are uploading too many data; <br/>&bull; You are uploading unformatted CSV file.",
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
	saveUpload:function(_data){	
        $("#save_import").on("click",function(){
			Materialize.toast('Importing...',1000);
        	$(this).addClass('disabled');
			var data = system.xml("pages.xml");
			$(data.responseText).find("loader2").each(function(i,content){
				$(".display_loading").html(content);
	        	setTimeout(function(){
	        		_data = ($.type(_data) == "array")?JSON.stringify(_data):_data;
        			var client = localStorage.getItem('client_id')
					var data = system.ajax('../assets/harmony/Process.php?set-uploadPointsAdmin',[_data,client]);
					data.done(function(data){
						console.log(data);
						if(data == 1){
							Materialize.toast('Saved.',4000);
							App.handleLoadPage("#cmd=index;content=focusClient");
						}
						else{
							Materialize.toast('Cannot process request.',4000);
							$(".display_loading").html("");
						}
					});
	        	},1000);
			});
        });
	}
}