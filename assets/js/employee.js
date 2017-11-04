account = {
	ini:function(){
		// this.add();
		account.list();
		account.get();
	},
	get:function(){
		var data = system.html('../assets/harmony/Process.php?get-myAccount');
		return data;
	},
	list:function(){
		var content = "";
		var data = system.html('../assets/harmony/Process.php?get-myAccount');
		data.done(function(data){
			data = JSON.parse(data);
			var id = data[0][0];
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

				$("#myAccount").html(content);
				account.deactivate();
				account.activate();
				account.update();
			}
			$("#display_newAdmin").html(content);
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
						App.handleLoadPage("##cmd=index;content=account");
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
PDS = {
	addPersonalinfo:function(){
		var data = system.xml("pages.xml");
				$(data.responseText).find("addEmployees").each(function(i,content){
					$("#modal .modal-content").html(content);
					$('#modal').openModal('show');		
				    $("select").material_select();

					$("#form_addEmployees").validate({
					    rules: {
					    	field_fname: {required: true,maxlength: 50},
					        field_gname: {required: true,maxlength: 50},
					        field_mname: {required: true,maxlength: 50},			        
					        field_nickname: {required: true,maxlength: 50},
					        field_dob: {required: true,maxlength: 50,checkDate:true},
					        field_gender: {required: true,maxlength: 50},
					        field_phone: {required: true,maxlength: 50},
					        field_email: {maxlength: 100,checkEmail:true},
					        field_cstatus: {required: true,maxlength: 50},
					        field_citizenship: {required: true,maxlength: 30},
					        field_height: {required: true,maxlength: 10},
					        field_weight: {required: true,maxlength: 10},
					        field_btype: {required: true,maxlength: 30},
					        field_gsis: {required: true,maxlength: 20},
					        field_r_address: {required: true,maxlength: 50},
					        field_r_zipcode: {required: true,maxlength: 50},
					        field_r_tele: {required: true,maxlength: 50},
							field_f_surename: {required: true,maxlength: 50},
							field_f_firstname: {required: true,maxlength: 50},
							field_f_middlename: {required: true,maxlength: 50},
							field_m_surename: {required: true,maxlength: 50},
							field_m_firstname: {required: true,maxlength: 50},
							field_m_middlename: {required: true,maxlength: 50},
					        field_position: {required: true,maxlength: 50,},
					        field_employeeID: {required: true,maxlength: 50,validateEmployeeID:true},
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
							var id = localStorage.getItem('myId');
							var company_id = localStorage.getItem('company_id');
							var data = system.ajax('../assets/harmony/Process.php?set-newEmployees',[_form,id,company_id]);
							data.done(function(data){
								console.log(data);


								if(data == 1){
									if(data.responseText != ""){
										Materialize.toast('Saved.',4000);
										system.clearForm();
										 PDS.addFamily();
								    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
				});
	},
	addFamily:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addFamily").each(function(i,content){
			console.log("Family_Background");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addFamily").validate({
			    rules: {
					field_s_surename: {required: true,maxlength: 5},
			    	field_s_firstname: {required: true,maxlength: 50},
			    	field_s_middlename: {required: true,maxlength: 50},
			    	field_s_occupation: {required: true,maxlength: 50},
			    	field_s_employer: {required: true,maxlength: 50},
			    	field_s_business: {required: true,maxlength: 50},
			    	field_s_tele: {required: true,maxlength: 50},

			    	field_f_surename: {required: true,maxlength: 5},
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newFamily',[_form,id]);
					data.done(function(data){
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
								PDS.addChild();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
	addChild:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addAnak").each(function(i,content){
			console.log("Child_Background");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addAnak").validate({
			    rules: {
			    	field_child: {required: true,maxlength: 50},
			    	field_child_dob: {required: true,maxlength: 50,checkDate:true},
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newChild',[_form,id]);
					data.done(function(data){
						console.log(_form);
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
			PDS.addEducation();
		});
	},
	addEducation:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addEducation").each(function(i,content){
			console.log("Educational_Background");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addEducation").validate({
			    rules: {
			    	addEd: {required: true,maxlength: 50},
			    	field_e_name: {required: true,maxlength: 50},
			    	field_e_degree: {required: true,maxlength: 50},
			    	field_e_year: {required: true,maxlength: 50},
			    	field_e_grade: {required: true,maxlength: 50},
			    	field_e_from: {required: true,maxlength: 50},
			    	field_e_to: {required: true,maxlength: 50},
			    	field_e_scholar: {required: true,maxlength: 50},
			    	field_s_name: {required: true,maxlength: 50},
			    	field_s_degree: {required: true,maxlength: 50},
			    	field_s_year: {required: true,maxlength: 50},
			    	field_s_grade: {required: true,maxlength: 50},
			    	field_s_from: {required: true,maxlength: 50},
			    	field_s_to: {required: true,maxlength: 50},
			    	field_s_scholar: {required: true,maxlength: 50},
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newEducation',[_form,id]);
					data.done(function(data){
						console.log(_form);
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
								PDS.addCollege();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
	addCollege:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addCollege").each(function(i,content){
			console.log("Educational_Background");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addCollege").validate({
			    rules: {
			    	field_name: {required: true,maxlength: 50},
			    	field_degree: {required: true,maxlength: 50},
			    	field_year: {required: true,maxlength: 50},
			    	field_grade: {required: true,maxlength: 50},
			    	field_from: {required: true,maxlength: 50},
			    	field_to: {required: true,maxlength: 50},
			    	field_scholar: {required: true,maxlength: 50},
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newCollege',[_form,id]);
					data.done(function(data){
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
		$("a[data-cmd='add_vocational']").on('click',function(){
			PDS.addVocational();
		});
	},
	addVocational:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addVocational").each(function(i,content){
			console.log("Educational_Background");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addVocational").validate({
			    rules: {
			    	field_name: {required: true,maxlength: 50},
			    	field_degree: {required: true,maxlength: 50},
			    	field_year: {required: true,maxlength: 50},
			    	field_grade: {required: true,maxlength: 50},
			    	field_from: {required: true,maxlength: 50},
			    	field_to: {required: true,maxlength: 50},
			    	field_scholar: {required: true,maxlength: 50},
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newVocational',[_form,id]);
					data.done(function(data){
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
			PDS.addGraduate();
		});
	},
	addGraduate:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addGraduate").each(function(i,content){
			console.log("Educational_Background");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addGraduate").validate({
			    rules: {
			    	field_name: {required: true,maxlength: 50},
			    	field_degree: {required: true,maxlength: 50},
			    	field_year: {required: true,maxlength: 50},
			    	field_grade: {required: true,maxlength: 50},
			    	field_from: {required: true,maxlength: 50},
			    	field_to: {required: true,maxlength: 50},
			    	field_scholar: {required: true,maxlength: 50},
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newGraduate',[_form,id]);
					data.done(function(data){
						console.log(_form);
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
			PDS.addCivil();
		});
	},
	addCivil:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addCivilService").each(function(i,content){
			console.log("Civil Service Elegibility");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addCivil").validate({
			    rules: {
			    	field_career: {required: true,maxlength: 50},
			    	field_rating: {required: true,maxlength: 50},
			    	field_doe: {required: true,checkDate:true,maxlength: 50},
			    	field_place: {required: true,maxlength: 50},
			    	field_licence: {required: true,maxlength: 50},
			    	field_date: {required: true,checkDate:true,maxlength: 50},
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newCivilService',[_form,id]);
					data.done(function(data){
						console.log(_form);
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
			PDS.addWork();
		});
	},
	addWork:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addWork").each(function(i,content){
			console.log("Work Experience");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addWork").validate({
			    rules: {
			    	field_to: {required: true,checkDate: true,maxlength: 50},
			    	field_from: {required: true,checkDate: true,maxlength: 50},
			    	field_position: {required: true,maxlength: 50},
			    	field_department: {required: true,maxlength: 50},
			    	field_salary: {required: true,maxlength: 50},
			    	field_salary_grade: {required: true,maxlength: 50},
			    	field_status: {required: true,maxlength: 50},
			    	field_govt: {required: true,maxlength: 50},
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newWork',[_form,id]);
					data.done(function(data){
						console.log(_form);
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
			PDS.addVoluntary();
		});
	},
	addVoluntary:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addVoluntary").each(function(i,content){
			console.log("Voluntary Work");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addVoluntary").validate({
			    rules: {
			    	field_name: {required: true,maxlength: 50},
			    	field_from: {required: true,checkDate: true,maxlength: 50},
			    	field_to: {required: true,checkDate: true,maxlength: 50},
			    	field_number: {required: true,maxlength: 50},
			    	field_position: {required: true,maxlength: 50},
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newVoluntary',[_form,id]);
					data.done(function(data){
						console.log(_form);
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
			PDS.addTraining();
		});
	},
	addTraining:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addTraining").each(function(i,content){
			console.log("Voluntary Work");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addTraining").validate({
			    rules: {
			    	field_title: {required: true,maxlength: 50},
			    	field_from: {required: true,checkDate: true,maxlength: 50},
			    	field_to: {required: true,checkDate: true,maxlength: 50},
			    	field_number: {required: true,maxlength: 50},
			    	field_conducted: {required: true,maxlength: 50},
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newTraining',[_form,id]);
					data.done(function(data){
						console.log(_form);
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
		$("a[data-cmd='add_skills']").on('click',function(){
			PDS.addSkills();
		});
	},
	addSkills:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addskills").each(function(i,content){
			console.log("Special Skills");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addSkills").validate({
			    rules: {
			    	field_skills: {required: true,maxlength: 50},
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newSkills',[_form,id]);
					data.done(function(data){
						console.log(data);

						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
		$("a[data-cmd='add_NonAcademic']").on('click',function(){
			PDS.addNonAcademic();
		});
	},
	addNonAcademic:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addNonAcademic").each(function(i,content){
			console.log("Non-Academic");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addNonAcademic").validate({
			    rules: {
			    	field_non_academic: {required: true,maxlength: 50},
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newNonAcademic',[_form,id]);
					data.done(function(data){
						// console.log(_form);
						// console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
		$("a[data-cmd='add_Membership']").on('click',function(){
			PDS.addMembership();
		});
	},
	addMembership:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addMembership").each(function(i,content){
			console.log("Membership");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addMembership").validate({
			    rules: {
			    	field_association: {required: true,maxlength: 50},
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newMembership',[_form,id]);
					data.done(function(data){
						console.log(_form);
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();							
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
		$("a[data-cmd='add_Questions']").on('click',function(){
			PDS.addQuestions();
		});
	},
	addQuestions:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addQuestions").each(function(i,content){
			console.log("Questions");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_questions").validate({
			    rules: {
			
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newQuestions',[_form,id]);
					data.done(function(data){
						console.log(_form);
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
								PDS.addReferences();
						    	// $(location).attr('href',"#cmd=index;content=focusClient");
						    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
	addReferences:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addReferences").each(function(i,content){
			console.log("References");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_references").validate({
			    rules: {
			    	field_name: {required: true,maxlength: 50},
			    	field_address: {required: true,maxlength: 50},
			    	field_telephone: {required: true,maxlength: 50},
			    	field_tax: {required: true,maxlength: 50},
			    	field_issued_at: {required: true,maxlength: 50},
			    	field_issued_on: {required: true,maxlength: 50},
			    	field_accomplish: {required: true,maxlength: 50},
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newReferences',[_form,id]);
					data.done(function(data){
						
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
		$("a[data-cmd='add_Last']").on('click',function(){
			PDS.addLast();
		});
	},
	addLast:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addLast").each(function(i,content){
			console.log("Last");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_last").validate({
			    rules: {
			    	field_tax: {required: true,maxlength: 50},
			    	field_issued_at: {checkDate: true,required: true,maxlength: 50},
			    	field_issued_on: {checkDate: true,required: true,maxlength: 50},
			    	field_accomplish: {checkDate: true,required: true,maxlength: 50},
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newLast',[_form,id]);
					data.done(function(data){
						
						console.log(data);
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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

	//Details
	personalInfoDetails:function(){
		var content = "";
		var bago = "";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-employeeDetails',id);
		data.done(function(data){
			data = JSON.parse(data);
			console.log(data);
			if(data.length<=0){
					bago = 	"<div class='col s12 m4 l4 input-field right'>"+
							"<a class='btn waves-effect waves-light orange right' data-cmd='add_pds'>Add</a>"+
							"</div>";
				
					$("#display_error").html(bago);
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
						"        	<a data-value='"+profile+"' data-cmd='updateEmployeePicture' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][6]+"' data-node='"+data[0][0]+"' data-prop='Picture' class='btn waves-effect white-text no-shadow black' style='font-size: 10px;z-index: 1;padding: 0 52px;top:114px;'>Change</a>"+
						"		 </div></br>"+
						"        <span class='card-title activator grey-text text-darken-4'>"+data[0][4]+" "+data[0][5]+" "+data[0][6]+" </span>"+
						"			<a data-value='"+JSON.stringify([data[0][4],data[0][5],data[0][3]])+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Account'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 <div class='divider'></div>"+
						"        <p><i class='mdi-action-info-outline cyan-text text-darken-2'></i> Status: "+status+actions+"</p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Place Of Birth: "+data[0][7]+"</span>"+
						"			<a data-value='"+data[0][7]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Place Of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Nickname'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Phone: "+data[0][10]+"</span>"+
						"			<a data-value='"+data[0][10]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Phone'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-cached cyan-text text-darken-2'></i> Gender: "+data[0][8]+"</span>"+
						"			<a data-value='"+data[0][8]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Gender' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Gender'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-event cyan-text text-darken-2'></i> Date of Birth: "+data[0][9]+"</span>"+
						"			<a data-value='"+data[0][9]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Date Of Birth'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Civil Status: "+data[0][15]+"</span>"+
						"			<a data-value='"+data[0][15]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Civil Status' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Civil Status'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Citizenship: "+data[0][16]+"</span>"+
						"			<a data-value='"+data[0][17]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Citizenship' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Citizenship'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-accessibility cyan-text text-darken-2'></i> Height: "+data[0][17]+"</span>"+
						"			<a data-value='"+data[0][17]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Height' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Height'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-accessibility cyan-text text-darken-2'></i> Weight: "+data[0][18]+"</span>"+
						"			<a data-value='"+data[0][18]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Weight' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Weight'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-cached cyan-text text-darken-2'></i> Blood Type: "+data[0][19]+"</span>"+
						"			<a data-value='"+data[0][19]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Blood Type' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Blood Type'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-portrait cyan-text text-darken-2'></i> GSIS ID Number: "+data[0][20]+"</span>"+
						"			<a data-value='"+data[0][20]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='GSIS Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update GSIS ID Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-portrait cyan-text text-darken-2'></i> Pag-Ibig ID Number: "+data[0][20]+"</span>"+
						"			<a data-value='"+data[0][21]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Pag-Ibig ID Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Pag-Ibig ID Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-portrait cyan-text text-darken-2'></i> Philhealth Number: "+data[0][22]+"</span>"+
						"			<a data-value='"+data[0][22]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Philhealth Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Philhealth Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-portrait cyan-text text-darken-2'></i> SSS Number: "+data[0][23]+"</span>"+
						"			<a data-value='"+data[0][23]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='SSS Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update GSIS SSS Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-home cyan-text text-darken-2'></i> Rsisdential Address: "+data[0][24]+"</span>"+
						"			<a data-value='"+data[0][24]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Residential Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Residential Address'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-assignment-ind cyan-text text-darken-2'></i> Zip Code: "+data[0][25]+"</span>"+
						"			<a data-value='"+data[0][25]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Residential Zipcode' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update GSIS SSS Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Telephone Number: "+data[0][26]+"</span>"+
						"			<a data-value='"+data[0][26]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Residential Telephone Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update GSIS SSS Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-home cyan-text text-darken-2'></i> Permanent Address: "+data[0][27]+"</span>"+
						"			<a data-value='"+data[0][27]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Permanent Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update GSIS SSS Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-assignment-ind cyan-text text-darken-2'></i> Zip Code: "+data[0][28]+"</span>"+
						"			<a data-value='"+data[0][28]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Permanent Zipcode' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update GSIS SSS Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Telephone Number: "+data[0][29]+"</span>"+
						"			<a data-value='"+data[0][29]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Permanent Telephone Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update GSIS SSS Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-communication-email cyan-text text-darken-2'></i> Email Address: "+data[0][30]+"</span>"+
						"			<a data-value='"+data[0][30]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Email' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Email Address'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-portrait cyan-text text-darken-2'></i> Agency Employee Number: "+data[0][31]+"</span>"+
						"			<a data-value='"+data[0][31]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Employee Agency Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employee Agency Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-picture-in-picture cyan-text text-darken-2'></i> Tin: "+data[0][32]+"</span>"+
						"			<a data-value='"+data[0][32]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Tin' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Tin'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div><br/>"+
						"		<div class='input-field col s12'>"+
						"			<p><b>Account Information</b></p>"+
						"			<div class='divider'></div>"+
						"		</div>"+
						"		<div class='input-field col s12'>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-work cyan-text text-darken-2'></i> Position: "+data[0][12]+"</span>"+
						"			<a data-value='"+data[0][12]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Position'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
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

				PDS.deactivate();
				PDS.activate();
				PDS.updatePersonalInfo();
				PDS.updatePicture();

				PDS.familyDetails();
				PDS.childDetails();
				PDS.educationalDetails();
				PDS.vocationalDetails();
				PDS.collegeDetails();
				PDS.graduateDetails();
				PDS.civilDetails();
				PDS.workDetails();
				PDS.voluntaryDetails();
				PDS.trainingDetails();
				PDS.skillsDetails();
				PDS.nonAcademicDetails();
				PDS.membershipDetails();
				PDS.questionsDetails();
				PDS.referencesDetails();
				PDS.lastDetails();

			}
		});

		$("a[data-cmd='add_pds']").on('click',function(){
				PDS.addReferences();
			});   		
	},
	familyDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-family',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);

			if(data.length<=0){
				bago = 	"<div id='profile-card' class='card'>"+
						"   <div class='card-content'>"+
						"		<h5>Family Background</h5><br />"+
						"<a class='btn waves-effect waves-light orange left' data-cmd='add_family'>Add</a></br></br>"+
						"</div>"+
						"</div>";
			
				$("#family_background").html(bago);
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content = "<div id='profile-card' class='card'>"+
						"    <div class='card-content'>"+
						"		<h5>Family Background</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-account-circle cyan-text text-darken-2'></i> Spouse's Surename: "+data[0][2]+"</span>"+
						"			<a data-value='"+data[0][2]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Surename' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-circle cyan-text text-darken-2'></i> First Name: "+data[0][3]+"</span>"+
						"			<a data-value='"+data[0][3]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update First Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-circle cyan-text text-darken-2'></i> Middle Name: "+data[0][4]+"</span>"+
						"			<a data-value='"+data[0][4]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Middle Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Middle Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-work  cyan-text text-darken-2'></i> Occupation: "+data[0][5]+"</span>"+
						"			<a data-value='"+data[0][5]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Occupation' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Occupation'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Employer/Bus Name: "+data[0][6]+"</span>"+
						"			<a data-value='"+data[0][6]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Employer/Bus Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-store cyan-text text-darken-2'></i> Business Address: "+data[0][7]+"</span>"+
						"			<a data-value='"+data[0][7]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Business Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Business Address'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Telephone Number: "+data[0][8]+"</span>"+
						"			<a data-value='"+data[0][8]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Telephone Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Telephone Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Father's surname: "+data[0][9]+"</span>"+
						"			<a data-value='"+data[0][9]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Father Surename' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surename'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people  cyan-text text-darken-2'></i> First Name: "+data[0][10]+"</span>"+
						"			<a data-value='"+data[0][10]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Father First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update First Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Middle Name: "+data[0][11]+"</span>"+
						"			<a data-value='"+data[0][11]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Father Middle Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Middle Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people-outline cyan-text text-darken-2'></i> Mother's surename: "+data[0][12]+"</span>"+
						"			<a data-value='"+data[0][12]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Mother Surename' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surename'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people-outline cyan-text text-darken-2'></i> First Name: "+data[0][13]+"</span>"+
						"			<a data-value='"+data[0][13]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Mother First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update First Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people-outline cyan-text text-darken-2'></i> Middle Name: "+data[0][14]+"</span>"+
						"			<a data-value='"+data[0][14]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Mother Middle Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Middle Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
				$("#family_background").html(content);

				// employee.deactivate();
				// employee.activate();
				PDS.updateFamily();
				// employee.updatePicture();
			}

				$("a[data-cmd='add_family']").on('click',function(){
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newFamily',[_form,id]);
								data.done(function(data){
									console.log(data);
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
											$('#modal').closeModal();
									    	// $(location).attr('href',"#cmd=index;content=focusClient");
									    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
				});
		});
	},
	childDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-child',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
		
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>Family Background</h5>"+
							"		<h6>Siblings</h6>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Name Of Child: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateChild' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of Child' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Name Of Child '>"+
							"				<i class='mdi-editor-mode-edit right black-text' data-cmd='value'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Date Of Birth: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateChild' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Birthday' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Date Of Birth'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br>";
							
        		});

        		content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_child'>Add</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#childs").html(content);

				// employee.deactivate();
				// employee.activate();
				PDS.updateChild();
				// employee.updatePicture();

				$("a[data-cmd='add_child']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addChild").each(function(i,content){
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
								var data = system.ajax('../assets/harmony/Process.php?set-newChild',[_form,id]);
								data.done(function(data){
									console.log(_form);
									console.log(data);
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	// $(location).attr('href',"#cmd=index;content=focusClient");
									    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
				});
		});
	},
	educationalDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-education',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
				
			if(data.length<=0){
			bago = 	"<div id='profile-card' class='card'>"+
					"   <div class='card-content'>"+
					"		<h5>Educational Background</h5><br />"+
					"<a class='btn waves-effect waves-light orange left' data-cmd='add_educational'>Add</a></br></br>"+
					"</div>"+
					"</div>";
		
			$("#educational_background").html(bago);
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
						"			<a data-value='"+data[0][2]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of School' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Name Of School'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+data[0][3]+"</span>"+
						"			<a data-value='"+data[0][3]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Degree Course' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Degree Course'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+data[0][4]+"</span>"+
						"			<a data-value='"+data[0][4]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Year Graduated' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Year Graduated'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+data[0][5]+"</span>"+
						"			<a data-value='"+data[0][5]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Highest Grade' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Highest Grade/Level/Units Earned'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Date Of Attendance From: "+data[0][6]+"</span>"+
						"			<a data-value='"+data[0][6]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Elementary Inclusive Date Of Attendance From' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Date Of Attendance To: "+data[0][7]+"</span>"+
						"			<a data-value='"+data[0][7]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Elementary Inclusive Date Of Attendance To' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+data[0][8]+"</span>"+
						"			<a data-value='"+data[0][8]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Scholarship/Non Academics Honor Recieved' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Scholarship/Academics Honors Recieved'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div></br>"+
						"		<h5>Secondary Level</h5>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+data[0][9]+"</span>"+
						"			<a data-value='"+data[0][9]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Name Of School'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+data[0][10]+"</span>"+
						"			<a data-value='"+data[0][10]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Degree' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Degree Course'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+data[0][11]+"</span>"+
						"			<a data-value='"+data[0][11]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Year' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Year Graduated'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+data[0][12]+"</span>"+
						"			<a data-value='"+data[0][12]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Grade' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Highest Grade/Level/Units Earned'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Date Of Attendance From: "+data[0][13]+"</span>"+
						"			<a data-value='"+data[0][13]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Secondary Inclusive Date Of Attendance From' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Date Of Attendance To: "+data[0][14]+"</span>"+
						"			<a data-value='"+data[0][14]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Secondary Inclusive Date Of Attendance To' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+data[0][15]+"</span>"+
						"			<a data-value='"+data[0][15]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Scholarship' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Scholarship/Academics Honors Recieved'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
				$("#educational_background").html(content);

				// employee.deactivate();
				// employee.activate();
				PDS.updateEducation();
				// employee.updatePicture();
			}
				$("a[data-cmd='add_educational']").on('click',function(){
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newEducation',[_form,id]);
								data.done(function(data){
									console.log(_form);
									console.log(data);
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
											$('#modal').closeModal();
									    	// $(location).attr('href',"#cmd=index;content=focusClient");
									    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
				});
		});
	},
	vocationalDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-vocational',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
			
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>Educational Background</h5>"+
							"		<h6>Vocational/Trade Course</h6>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <br />"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of School' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Name Of School'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Degree Course' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Degree Course'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Year Graduated' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Year Graduated'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+value[5]+"</span>"+
							"			<a data-value='"+value[5]+"' data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Highest Grade' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Highest Grade/Level/Units Earned'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Date Of Attendance From: "+value[6]+"</span>"+
							"			<a data-value='"+value[6]+"' data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Date Of Attendance From' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Date Of Attendance To: "+value[7]+"</span>"+
							"			<a data-value='"+value[7]+"' data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Date Of Attendance To' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+value[8]+"</span>"+
							"			<a data-value='"+value[8]+"' data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Scholarship/Non Academics Honor Recieved' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Scholarship/Academics Honors Recieved'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
        		});
				
				content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_vocational'>Add</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#vocational").html(content);

				// employee.deactivate();
				// employee.activate();
				PDS.updateVocational();
				// employee.updatePicture();

				$("a[data-cmd='add_vocational']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addVocationals").each(function(i,content){
						console.log("Vocational");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_addVocationals").validate({
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newVocational',[_form,id]);
								data.done(function(data){
									console.log(data);
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	// $(location).attr('href',"#cmd=index;content=focusClient");
									    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
				});
		});
	},
	collegeDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-college',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);

				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>Educational Background</h5>"+
							"		<h6>College Level</h6>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <br />"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of School' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Name Of School'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Degree Course' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Degree Course'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Year Graduated' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Year Graduated'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+value[5]+"</span>"+
							"			<a data-value='"+value[5]+"' data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Highest Grade' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Highest Grade/Level/Units Earned'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Date Of Attendance From: "+value[6]+"</span>"+
							"			<a data-value='"+value[6]+"' data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Date Of Attendance From' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Date Of Attendance To: "+value[7]+"</span>"+
							"			<a data-value='"+value[7]+"' data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Date Of Attendance To' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+value[8]+"</span>"+
							"			<a data-value='"+value[8]+"' data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Scholarship/Non Academics Honor Recieved' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Scholarship/Academics Honors Recieved'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
        		});
				
				content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_college'>Add</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#college_level").html(content);

				// employee.deactivate();
				// employee.activate();
				PDS.updateCollege();
				// employee.updatePicture();
				$("a[data-cmd='add_college']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addColleges").each(function(i,content){
						console.log("College");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_addColleges").validate({
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newCollege',[_form,id]);
								data.done(function(data){
									console.log(data);
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	// $(location).attr('href',"#cmd=index;content=focusClient");
									    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
				});
		});
	},
	graduateDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-graduate',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
			
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>Educational Background</h5>"+
							"		<h6>Graduate Studies</h6>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <br />"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateGraduate' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of School' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Name Of School'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateGraduate' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Degree Course' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Degree Course'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateGraduate' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Year Graduated' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Year Graduated'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+value[5]+"</span>"+
							"			<a data-value='"+value[5]+"' data-cmd='updateGraduate' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Highest Grade' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Highest Grade/Level/Units Earned'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Date Of Attendance From: "+value[6]+"</span>"+
							"			<a data-value='"+value[6]+"' data-cmd='updateGraduate' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Date Of Attendance From' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Date Of Attendance To: "+value[7]+"</span>"+
							"			<a data-value='"+value[7]+"' data-cmd='updateGraduate' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Date Of Attendance To' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates Of Attendance'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+value[8]+"</span>"+
							"			<a data-value='"+value[8]+"' data-cmd='updateGraduate' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Scholarship/Non Academics Honor Recieved' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Scholarship/Academics Honors Recieved'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
        		});

				content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_graduate'>Add</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#graduate").html(content);

				// employee.deactivate();
				// employee.activate();
				PDS.updateGraduate();
				// employee.updatePicture();

				$("a[data-cmd='add_graduate']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addGraduates").each(function(i,content){
						console.log("Educational_Background");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_addGraduates").validate({
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newGraduate',[_form,id]);
								data.done(function(data){
									console.log(_form);
									console.log(data);
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	// $(location).attr('href',"#cmd=index;content=focusClient");
									    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
				});
		});
	},
	civilDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-civil',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);

				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>Civil Service Eligibility</h5>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <br />"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-communication-quick-contacts-mail cyan-text text-darken-2'></i> Career Service: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateCivil' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Career Service' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Career Service'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-stars cyan-text text-darken-2'></i> Rating: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateCivil' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Rating' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Rating'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Date Of Examinantion: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateCivil' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date Of Examinantion' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Date Of Examinantion'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-maps-place cyan-text text-darken-2'></i> Place Of Examination: "+value[5]+"</span>"+
							"			<a data-value='"+value[5]+"' data-cmd='updateCivil' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Place Of Examination' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Place Of Examination'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-description cyan-text text-darken-2'></i> Number: "+value[6]+"</span>"+
							"			<a data-value='"+value[6]+"' data-cmd='updateCivil' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Number'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Date Of Release: "+value[7]+"</span>"+
							"			<a data-value='"+value[7]+"' data-cmd='updateCivil' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date Of Release' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Date Of Release'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
        		});

				content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_civil'>Add</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#civil").html(content);

				// employee.deactivate();
				// employee.activate();
				PDS.updateCivil();
				// employee.updatePicture();

				$("a[data-cmd='add_civil']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addCivilServices").each(function(i,content){
						console.log("Civil Service Elegibility");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_addCivils").validate({
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newCivilService',[_form,id]);
								data.done(function(data){
									console.log(_form);
									console.log(data);
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	// $(location).attr('href',"#cmd=index;content=focusClient");
									    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
				});
		});
	},
	workDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-work',id);
		data.done(function(data){
			data = JSON.parse(data);
			
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>Work Experience</h5>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <br />"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Inclusive Date Of Attendance From: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Date Of Attendance From' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Inclusive Date Of Attendance To: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Date Of Attendance To' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-assignment-ind cyan-text text-darken-2'></i> Position Title: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position Title' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Position Title'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-work cyan-text text-darken-2'></i> Department/Agency/Office/Company: "+value[5]+"</span>"+
							"			<a data-value='"+value[5]+"' data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Department' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Department/Agency/Office/Company'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-attach-money cyan-text text-darken-2'></i> Monthly Salary: "+value[6]+"</span>"+
							"			<a data-value='"+value[6]+"' data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Monthly Salary' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Monthly Salary'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-grade cyan-text text-darken-2'></i> Salary Grade: "+value[7]+"</span>"+
							"			<a data-value='"+value[7]+"' data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Salary Grade' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Salary Grade'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-info cyan-text text-darken-2'></i> Status Of Appointment: "+value[8]+"</span>"+
							"			<a data-value='"+value[8]+"' data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Status Of Appointment' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Status Of Appointment'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-image-portrait cyan-text text-darken-2'></i> Gov't Service: "+value[9]+"</span>"+
							"			<a data-value='"+value[9]+"' data-cmd='updateWork' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Government Service' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Gov't Service'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
        		});

				content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_work'>Add</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#work").html(content);

				// employee.deactivate();
				// employee.activate();
				PDS.updateWork();
				// employee.updatePicture();

				$("a[data-cmd='add_work']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addWorks").each(function(i,content){
						console.log("Work Experience");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_addWorks").validate({
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newWork',[_form,id]);
								data.done(function(data){
									console.log(_form);
									console.log(data);
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	// $(location).attr('href',"#cmd=index;content=focusClient");
									    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
				});
		});
	},
	voluntaryDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-voluntary',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>Voluntary Work</h5>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <br />"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-maps-map cyan-text text-darken-2'></i> Name & address of organization: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateVoluntary' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Inclusive Date Of Attendance From: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateVoluntary' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Date Of Attendance From' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Position Title'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Inclusive Date Of Attendance To: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateVoluntary' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Date Of Attendance To' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Position Title'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-format-list-numbered cyan-text text-darken-2'></i> Number of Hours: "+value[5]+"</span>"+
							"			<a data-value='"+value[5]+"' data-cmd='updateVoluntary' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Number of hours' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Department/Agency/Office/Company'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-wallet-membership cyan-text text-darken-2'></i> Position: "+value[6]+"</span>"+
							"			<a data-value='"+value[6]+"' data-cmd='updateVoluntary' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Monthly Salary'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
        		});

        		content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_voluntary'>Add</a></br></br>"+
							"</div>"+
							"</div>";

        		
				$("#voluntary").html(content);

				// employee.deactivate();
				// employee.activate();
				PDS.updateVoluntary();
				// employee.updatePicture();

				$("a[data-cmd='add_voluntary']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addVoluntarys").each(function(i,content){
						console.log("Voluntary Work");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_addVoluntarys").validate({
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newVoluntary',[_form,id]);
								data.done(function(data){
									console.log(_form);
									console.log(data);
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	// $(location).attr('href',"#cmd=index;content=focusClient");
									    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
				});
		});
	},
	trainingDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-training',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
			
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>Training Programs</h5>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	"		 <br />"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-description cyan-text text-darken-2'></i> Title Of Seminar: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateTraining' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Title of seminar' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Inclusive Dates'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Inclusive Date Of Attendance From: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateTraining' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Date Of Attendance From' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Position Title'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-insert-invitation cyan-text text-darken-2'></i> Inclusive Date Of Attendance To: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateTraining' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Date Of Attendance To' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Position Title'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-editor-format-list-numbered cyan-text text-darken-2'></i>Number of hours: "+value[5]+"</span>"+
							"			<a data-value='"+value[5]+"' data-cmd='updateTraining' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Number of hours' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Department/Agency/Office/Company'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-people cyan-text cyan-text text-darken-2'></i> Conducted/Sponsored by: "+value[6]+"</span>"+
							"			<a data-value='"+value[6]+"' data-cmd='updateTraining' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Conducted/Sponsored by' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Monthly Salary'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br></br>";
        		});

        		content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_training'>Add</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#training").html(content);

				// employee.deactivate();
				// employee.activate();
				PDS.updateTraining();
				// employee.updatePicture();

				$("a[data-cmd='add_training']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addTrainings").each(function(i,content){
						console.log("Training Programs");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_addTrainings").validate({
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newTraining',[_form,id]);
								data.done(function(data){
									console.log(_form);
									console.log(data);
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	// $(location).attr('href',"#cmd=index;content=focusClient");
									    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
				});
		});
	},
	skillsDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-skills',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);

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
							"			<a data-value='"+value[2]+"' data-cmd='updateSkills' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Special skills/Hobbies' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Special Skills/Hobbies'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p><br /><br />";
        		});

        		content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_skills'>Add</a></br></br>"+
							"</div>"+
							"</div>";

        		
				$("#skills").html(content);

				// employee.deactivate();
				// employee.activate();
				PDS.updateSkills();
				// employee.updatePicture();

				$("a[data-cmd='add_skills']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addskillss").each(function(i,content){
						console.log("Special Skills");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_addSkillss").validate({
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newSkills',[_form,id]);
								data.done(function(data){
									console.log(_form);
									console.log(data);
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	// $(location).attr('href',"#cmd=index;content=focusClient");
									    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
				});
		});
	},
	nonAcademicDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-nonAcademic',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
			
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
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-maps-local-attraction cyan-text text-darken-2'></i> Non-Academic Distinctions/Organization: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateNonAcademic' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Non-Academic distinctions/Organization' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Non-Academic Distinctions/Organization'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p><br /><br />";
        		});

        		content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_nonAcademic'>Add</a></br></br>"+
							"</div>"+
							"</div>";

        		
				$("#non_academic").html(content);

				// employee.deactivate();
				// employee.activate();
				PDS.updateNonAcademic();
				// employee.updatePicture();

				$("a[data-cmd='add_nonAcademic']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addNonAcademics").each(function(i,content){
						console.log("Non-Academic");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_addNonAcademics").validate({
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newNonAcademic',[_form,id]);
								data.done(function(data){
									console.log(_form);
									console.log(data);
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	// $(location).attr('href',"#cmd=index;content=focusClient");
									    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
				});
		});
	},
	membershipDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-membership',id);
		data.done(function(data){
			data = JSON.parse(data);
			
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
							"			<a data-value='"+value[2]+"' data-cmd='updateMembership' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Membership in organization/Association' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Membership in Association/Organization'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p><br /><br />";
        		});

        		content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_membership'>Add</a></br></br>"+
							"</div>"+
							"</div>";

        		
				$("#membership").html(content);

				// employee.deactivate();
				// employee.activate();
				PDS.updateMembership();
				// employee.updatePicture();

				$("a[data-cmd='add_membership']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addMemberships").each(function(i,content){
						console.log("Membership");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_addMemberships").validate({
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newMembership',[_form,id]);
								data.done(function(data){
									// console.log(_form);
									console.log(data);
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	// $(location).attr('href',"#cmd=index;content=focusClient");
									    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
				});
		});
	},
	questionsDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-questions',id);
		data.done(function(data){
			data = JSON.parse(data);

			if(data.length<=0){
				bago = 	"<div id='profile-card' class='card'>"+
						"   <div class='card-content'>"+
						"		<h5>Other Information</h5>"+
						"		<h6>Questions</h6>"+
						"<a class='btn waves-effect waves-light orange left' data-cmd='add_questions'>Add</a></br></br>"+
						"</div>"+
						"</div>";
			
				$("#questions").html(bago);
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content = "<div id='profile-card' class='card'>"+
						"    <div class='card-content'>"+
						"		<h5>Other Information</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-question-answer cyan-text text-darken-2'></i>Within the third degree(for National Government Employees)...?: "+data[0][2]+"</span>"+
						"			<a data-value='"+data[0][2]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Within the third degree(for National Government Employees):appointing authority, recomendiing authority, chief of office/bureau/department or person who has immediate supervision on you in the Office, Bureau or Deaprtment where you will be apointed?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][3]+"</span>"+
						"			<a data-value='"+data[0][3]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 36 A' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-question-answer cyan-text text-darken-2'></i>Within the fourth degree(for Local Government Employees)...?: "+data[0][4]+"</span>"+
						"			<a data-value='"+data[0][4]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Within the fourth degree(for Local Government Employees)appointing authority, recommending authority where you will be apointed?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][5]+"</span>"+
						"			<a data-value='"+data[0][5]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 36 B' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-question-answer cyan-text text-darken-2'></i> Have you ever been formally charged?: "+data[0][6]+"</span>"+
						"			<a data-value='"+data[0][6]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Have you ever been formally charged?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][7]+"</span>"+
						"			<a data-value='"+data[0][7]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 37 A' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-question-answer cyan-text text-darken-2'></i> Have you ever been guilty of any administrative offense?: "+data[0][8]+"</span>"+
						"			<a data-value='"+data[0][8]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Have you ever been guilty of any administrative offense?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][9]+"</span>"+
						"			<a data-value='"+data[0][9]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 37 B' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-question-answer cyan-text text-darken-2'></i>Have you ever been convicted of any crime...?: "+data[0][10]+"</span>"+
						"			<a data-value='"+data[0][10]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Have you ever been convicted of any crime or violation of any law, decree, ordinance or regulation by any court or tribunal?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][11]+"</span>"+
						"			<a data-value='"+data[0][11]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 38' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-question-answer cyan-text text-darken-2'></i> Have you ever been separated from the service..?: "+data[0][12]+"</span>"+
						"			<a data-value='"+data[0][12]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Have you ever been separated from the service in any following modes: resignation, retirement, dropped from the rolls, dismissal, terminantion, end of term, finished contract AWOL or phase out in the public or private sector?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][13]+"</span>"+
						"			<a data-value='"+data[0][13]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 39' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-question-answer cyan-text text-darken-2'></i> Have you been candidate in a national or local election...?: "+data[0][14]+"</span>"+
						"			<a data-value='"+data[0][14]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Have you been candidate in a national or local election(exept Brangay election)?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-detailse cyan-text text-darken-2'></i> If Yes, give details: "+data[0][15]+"</span>"+
						"			<a data-value='"+data[0][15]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 40' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-question-answer cyan-text text-darken-2'></i> Are you a member of any indigenous group?: "+data[0][16]+"</span>"+
						"			<a data-value='"+data[0][16]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Are you a member of any indigenous group?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][17]+"</span>"+
						"			<a data-value='"+data[0][17]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 41 A' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-question-answer cyan-text text-darken-2'></i> Are you differently abled?: "+data[0][18]+"</span>"+
						"			<a data-value='"+data[0][18]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Are you differently abled?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][19]+"</span>"+
						"			<a data-value='"+data[0][19]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 41 B' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-question-answer cyan-text text-darken-2'></i> Are you a solo parent?: "+data[0][20]+"</span>"+
						"			<a data-value='"+data[0][20]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Are you a solo parent?' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> If Yes, give details: "+data[0][21]+"</span>"+
						"			<a data-value='"+data[0][21]+"' data-cmd='updateQuestions' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Details 41 C' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
				$("#questions").html(content);

				// employee.deactivate();
				// employee.activate();
				PDS.updateQuestions();
				// employee.updatePicture();
			}

				$("a[data-cmd='add_questions']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addQuestions").each(function(i,content){
						console.log("Questions");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_questions").validate({
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newQuestions',[_form,id]);
								data.done(function(data){
									console.log(_form);
									console.log(data);
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	// $(location).attr('href',"#cmd=index;content=focusClient");
									    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
				});
		});
	},
	referencesDetails:function(){
		var content="";
		var bago="";
		var other='';
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-references',id);
		data.done(function(data){
			data = JSON.parse(data);
				
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
							"			<a data-value='"+value[2]+"' data-cmd='updateReferences' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Name'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-home cyan-text text-darken-2'></i> Address: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateReferences' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Address'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-settings-phone cyan-text text-darken-2'></i> Telephone Number: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateReferences' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Telephone Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Telephone Number'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p><br />";
        		});

        		content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_references'>Add</a></br></br>"+
							"</div>"+
							"</div>";

        		
				$("#references").html(content);

				// employee.deactivate();
				// employee.activate();
				PDS.updateReferences();
				// employee.updatePicture();

				$("a[data-cmd='add_references']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addReferencess").each(function(i,content){
						console.log("References");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_referencess").validate({
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newReferences',[_form,id]);
								data.done(function(data){
									// console.log(_form);
									console.log(data);
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	// $(location).attr('href',"#cmd=index;content=focusClient");
									    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
				});
		});
	},
	lastDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-last',id);
		data.done(function(data){
			data = JSON.parse(data);
			console.log(data);

			if(data.length<=0){
				bago = 	"<div id='profile-card' class='card'>"+
						"   <div class='card-content'>"+
						"		<h5>Other Information</h5><br />"+
						"<a class='btn waves-effect waves-light orange left' data-cmd='add_last'>Add</a></br></br>"+
						"</div>"+
						"</div>";
			
				$("#last").html(bago);
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content = "<div id='profile-card' class='card'>"+
						"    <div class='card-content'>"+
						"		<h5>Other Information</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-question-answer cyan-text text-darken-2'></i>Community Tax Certificate No.: "+data[0][2]+"</span>"+
						"			<a data-value='"+data[0][2]+"' data-cmd='updateLast' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Community Tax Certificate No.' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> Issued at (mm/dd/yyyy): "+data[0][3]+"</span>"+
						"			<a data-value='"+data[0][3]+"' data-cmd='updateLast' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Issued at' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i>Issued On (mm/dd/yyyy): "+data[0][4]+"</span>"+
						"			<a data-value='"+data[0][4]+"' data-cmd='updateLast' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Issued On' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-details cyan-text text-darken-2'></i> Date Accomplish (mm/dd/yyyy): "+data[0][5]+"</span>"+
						"			<a data-value='"+data[0][5]+"' data-cmd='updateLast' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date Accomplish' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
				$("#last").html(content);

				PDS.updateLast();
			}

				$("a[data-cmd='add_last']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addLast").each(function(i,content){
						console.log("Last");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_last").validate({
						    rules: {
						    	field_tax: {required: true,maxlength: 50},
						    	field_issued_at: {checkDate: true,required: true,maxlength: 50},
						    	field_issued_on: {checkDate: true,required: true,maxlength: 50},
						    	field_accomplish: {checkDate: true,required: true,maxlength: 50},
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newLast',[_form,id]);
								data.done(function(data){
									
									console.log(data);
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	App.handleLoadPage("#cmd=index;content=PDS;"+id);			
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
				});
		});
	},

	//Update
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
												App.handleLoadPage("#cmd=index;content=PDS");
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
	updatePersonalInfo:function(){
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
								App.handleLoadPage("#cmd=index;content=PDS");
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
	updateFamily:function(){
		$("a[data-cmd='updateFamily']").on('click',function(){
			var data = $(this).data();
			var id = data.node;
			console.log(id);

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

			if(data.prop == "Spouse Surename"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-family',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Surename updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=PDS");
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
						var data = system.ajax('../assets/harmony/Process.php?update-family',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('First Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=PDS");
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
						var data = system.ajax('../assets/harmony/Process.php?update-family',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Middle Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=PDS");
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
						var data = system.ajax('../assets/harmony/Process.php?update-family',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Occupation updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=PDS");
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
						var data = system.ajax('../assets/harmony/Process.php?update-family',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Empployer updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=PDS");
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
						var data = system.ajax('../assets/harmony/Process.php?update-family',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Address updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=PDS");
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
						var data = system.ajax('../assets/harmony/Process.php?update-family',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Telephone Number updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=PDS");
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
						var data = system.ajax('../assets/harmony/Process.php?update-family',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Surename updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=PDS");
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
						var data = system.ajax('../assets/harmony/Process.php?update-family',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('First Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=PDS");
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
						var data = system.ajax('../assets/harmony/Process.php?update-family',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Middle Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=PDS");
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
						var data = system.ajax('../assets/harmony/Process.php?update-family',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Surename updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=PDS");
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
						var data = system.ajax('../assets/harmony/Process.php?update-family',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('First Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=PDS");
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
						var data = system.ajax('../assets/harmony/Process.php?update-family',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Middle Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=PDS");
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
	updateChild:function(){
		$("a[data-cmd='updateChild']").on('click',function(){
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

			if(data.prop == "Name Of Child"){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('myname',data.value);
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
							var name = localStorage.getItem('myname');
							var data = system.ajax('../assets/harmony/Process.php?update-child',[name,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Name Of Child updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('myname');	
									App.handleLoadPage("#cmd=index;content=PDS");
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
				localStorage.setItem('bday',data.value);
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
						var bday = localStorage.getItem('bday');
						var data = system.ajax('../assets/harmony/Process.php?update-child',[bday,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Birthday updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('bday');	
								App.handleLoadPage("#cmd=index;content=PDS");

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
	updateEducation:function(){
		$("a[data-cmd='updateEducation']").on('click',function(){
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

			if(data.prop == "Name Of School"){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('myname',data.value);
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
							var name = localStorage.getItem('myname');
							var data = system.ajax('../assets/harmony/Process.php?update-education',[name,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Name Of Child updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('myname');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
			else if(data.prop == "Year Graduated"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('year',data.value);
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
						var year = localStorage.getItem('year');
						var data = system.ajax('../assets/harmony/Process.php?update-education',[year,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Year Graduated updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('year');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Degree Course"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('degree',data.value);
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
						var degree = localStorage.getItem('degree');
						var data = system.ajax('../assets/harmony/Process.php?update-education',[degree,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Degree Course updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('degree');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Highest Grade"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('grade',data.value);
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
						var grade = localStorage.getItem('grade');
						var data = system.ajax('../assets/harmony/Process.php?update-education',[grade,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Highest Grade updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('grade');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Elementary Inclusive Date Of Attendance From"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('dates',data.value);
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
						var dates = localStorage.getItem('dates');
						var data = system.ajax('../assets/harmony/Process.php?update-education',[dates,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Elementary Inclusive Date Of Attendance From updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('dates');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Elementary Inclusive Date Of Attendance To"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('dates',data.value);
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
						var dates = localStorage.getItem('dates');
						var data = system.ajax('../assets/harmony/Process.php?update-education',[dates,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Elementary Inclusive Date Of Attendance To updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('dates');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Scholarship/Non Academics Honor Recieved"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('scholar',data.value);
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
						var scholar = localStorage.getItem('scholar');
						var data = system.ajax('../assets/harmony/Process.php?update-education',[scholar,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Scholarship/Honor Recieved updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('scholar');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Name"){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('myname',data.value);
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
							var name = localStorage.getItem('myname');
							var data = system.ajax('../assets/harmony/Process.php?update-education',[name,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Name Of Child updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('myname');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
			else if(data.prop == "Year"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('year',data.value);
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
						var year = localStorage.getItem('year');
						var data = system.ajax('../assets/harmony/Process.php?update-education',[year,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Year Graduated updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('year');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Degree"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('degree',data.value);
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
						var degree = localStorage.getItem('degree');
						var data = system.ajax('../assets/harmony/Process.php?update-education',[degree,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Degree Course updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('degree');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}			
			else if(data.prop == "Secondary Inclusive Date Of Attendance From"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('dates',data.value);
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
						var dates = localStorage.getItem('dates');
						var data = system.ajax('../assets/harmony/Process.php?update-education',[dates,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Secondary Inclusive Date Of Attendance From updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('dates');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Secondary Inclusive Date Of Attendance To"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('dates',data.value);
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
						var dates = localStorage.getItem('dates');
						var data = system.ajax('../assets/harmony/Process.php?update-education',[dates,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Secondary Inclusive Date Of Attendance To updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('dates');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Grade"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('grade',data.value);
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
						var grade = localStorage.getItem('grade');
						var data = system.ajax('../assets/harmony/Process.php?update-education',[grade,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Highest Grade updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('grade');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Scholarship"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('scholar',data.value);
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
						var scholar = localStorage.getItem('scholar');
						var data = system.ajax('../assets/harmony/Process.php?update-education',[scholar,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Scholarship/Honor Recieved updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('scholar');	
								App.handleLoadPage("#cmd=index;content=PDS");

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
	updateVocational:function(){
		$("a[data-cmd='updateVocational']").on('click',function(){
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

			if(data.prop == "Name Of School"){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('myname',data.value);
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
							var name = localStorage.getItem('myname');
							var data = system.ajax('../assets/harmony/Process.php?update-vocational',[name,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Name Of Child updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('myname');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
			else if(data.prop == "Year Graduated"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('year',data.value);
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
						var year = localStorage.getItem('year');
						var data = system.ajax('../assets/harmony/Process.php?update-vocational',[year,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Year Graduated updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('year');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Degree Course"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('degree',data.value);
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
						var degree = localStorage.getItem('degree');
						var data = system.ajax('../assets/harmony/Process.php?update-vocational',[degree,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Degree Course updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('degree');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Highest Grade"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('grade',data.value);
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
						var grade = localStorage.getItem('grade');
						var data = system.ajax('../assets/harmony/Process.php?update-vocational',[grade,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Highest Grade updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('grade');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Inclusive Date Of Attendance From"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('dates',data.value);
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
						var dates = localStorage.getItem('dates');
						var data = system.ajax('../assets/harmony/Process.php?update-vocational',[dates,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Inclusive Date Of Attendance From updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('dates');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Inclusive Date Of Attendance To"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('dates',data.value);
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
						var dates = localStorage.getItem('dates');
						var data = system.ajax('../assets/harmony/Process.php?update-vocational',[dates,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Inclusive Date Of Attendance To updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('dates');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Scholarship/Non Academics Honor Recieved"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('scholar',data.value);
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
						var scholar = localStorage.getItem('scholar');
						var data = system.ajax('../assets/harmony/Process.php?update-vocational',[scholar,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Scholarship/Honor Recieved updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('scholar');	
								App.handleLoadPage("#cmd=index;content=PDS");

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
	updateCollege:function(){
		$("a[data-cmd='updateCollege']").on('click',function(){
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

			if(data.prop == "Name Of School"){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('myname',data.value);
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
							var name = localStorage.getItem('myname');
							var data = system.ajax('../assets/harmony/Process.php?update-college',[name,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Name Of Child updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('myname');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
			else if(data.prop == "Year Graduated"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('year',data.value);
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
						var year = localStorage.getItem('year');
						var data = system.ajax('../assets/harmony/Process.php?update-college',[year,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Year Graduated updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('year');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Degree Course"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('degree',data.value);
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
						var degree = localStorage.getItem('degree');
						var data = system.ajax('../assets/harmony/Process.php?update-college',[degree,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Degree Course updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('degree');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Highest Grade"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('grade',data.value);
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
						var grade = localStorage.getItem('grade');
						var data = system.ajax('../assets/harmony/Process.php?update-college',[grade,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Highest Grade updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('grade');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Inclusive Date Of Attendance From"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('dates',data.value);
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
						var dates = localStorage.getItem('dates');
						var data = system.ajax('../assets/harmony/Process.php?update-college',[dates,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Inclusive Date Of Attendance From updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('dates');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Inclusive Date Of Attendance To"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('dates',data.value);
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
						var dates = localStorage.getItem('dates');
						var data = system.ajax('../assets/harmony/Process.php?update-college',[dates,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Inclusive Date Of Attendance To updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('dates');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Scholarship/Non Academics Honor Recieved"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('scholar',data.value);
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
						var scholar = localStorage.getItem('scholar');
						var data = system.ajax('../assets/harmony/Process.php?update-college',[scholar,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Scholarship/Honor Recieved updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('scholar');	
								App.handleLoadPage("#cmd=index;content=PDS");

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
	updateGraduate:function(){
		$("a[data-cmd='updateGraduate']").on('click',function(){
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

			if(data.prop == "Name Of School"){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('myname',data.value);
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
							var name = localStorage.getItem('myname');
							var data = system.ajax('../assets/harmony/Process.php?update-graduate',[name,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Name Of Child updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('myname');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
			else if(data.prop == "Year Graduated"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('year',data.value);
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
						var year = localStorage.getItem('year');
						var data = system.ajax('../assets/harmony/Process.php?update-graduate',[year,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Year Graduated updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('year');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Degree Course"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('degree',data.value);
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
						var degree = localStorage.getItem('degree');
						var data = system.ajax('../assets/harmony/Process.php?update-graduate',[degree,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Degree Course updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('degree');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Highest Grade"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('grade',data.value);
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
						var grade = localStorage.getItem('grade');
						var data = system.ajax('../assets/harmony/Process.php?update-graduate',[grade,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Highest Grade updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('grade');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Inclusive Date Of Attendance From"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('dates',data.value);
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
						var dates = localStorage.getItem('dates');
						var data = system.ajax('../assets/harmony/Process.php?update-graduate',[dates,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Inclusive Date Of Attendance From updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('dates');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Inclusive Date Of Attendance To"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('dates',data.value);
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
						var dates = localStorage.getItem('dates');
						var data = system.ajax('../assets/harmony/Process.php?update-graduate',[dates,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Inclusive Date Of Attendance To updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('dates');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Scholarship/Non Academics Honor Recieved"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('scholar',data.value);
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
						var scholar = localStorage.getItem('scholar');
						var data = system.ajax('../assets/harmony/Process.php?update-graduate',[scholar,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Scholarship/Honor Recieved updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('scholar');	
								App.handleLoadPage("#cmd=index;content=PDS");

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
	updateCivil:function(){
		$("a[data-cmd='updateCivil']").on('click',function(){
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

			if(data.prop == "Career Service"){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('career',data.value);
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
							var career = localStorage.getItem('career');
							var data = system.ajax('../assets/harmony/Process.php?update-civil',[career,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Career Service updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('career');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
			else if(data.prop == "Rating"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('rating',data.value);
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
						var rating = localStorage.getItem('rating');
						var data = system.ajax('../assets/harmony/Process.php?update-civil',[rating,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Rating updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('rating');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Date Of Examination"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('doe',data.value);
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
						var doe = localStorage.getItem('doe');
						var data = system.ajax('../assets/harmony/Process.php?update-civil',[doe,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Date Of Examination updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('doe');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Place Of Examination"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('place',data.value);
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
						var place = localStorage.getItem('place');
						var data = system.ajax('../assets/harmony/Process.php?update-civil',[place,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Place Of Examination updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('place');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Number"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('number',data.value);
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
						var number = localStorage.getItem('number');
						var data = system.ajax('../assets/harmony/Process.php?update-civil',[number,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Number updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('number');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Date Of Release"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('doe',data.value);
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
						var doe = localStorage.getItem('doe');
						var data = system.ajax('../assets/harmony/Process.php?update-civil',[doe,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Date Of Release updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('doe');	
								App.handleLoadPage("#cmd=index;content=PDS");

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
	updateWork:function(){
		$("a[data-cmd='updateWork']").on('click',function(){
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

			if(data.prop == "Inclusive Date Of Attendance From"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('dates',data.value);
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
						var dates = localStorage.getItem('dates');
						var data = system.ajax('../assets/harmony/Process.php?update-work',[dates,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Inclusive Date Of Attendance From updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('dates');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Inclusive Date Of Attendance To"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('dates',data.value);
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
						var dates = localStorage.getItem('dates');
						var data = system.ajax('../assets/harmony/Process.php?update-work',[dates,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Inclusive Date Of Attendance To updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('dates');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Position Title"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('title',data.value);
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
						var title = localStorage.getItem('title');
						var data = system.ajax('../assets/harmony/Process.php?update-work',[title,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Position Title updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('title');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Department"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('department',data.value);
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
						var department = localStorage.getItem('department');
						var data = system.ajax('../assets/harmony/Process.php?update-work',[department,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Department updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('department');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Monthly Salary"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('salary',data.value);
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
						var salary = localStorage.getItem('salary');
						var data = system.ajax('../assets/harmony/Process.php?update-work',[salary,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Month Salary updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('salary');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Salary Grade"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('salary',data.value);
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
						var salary = localStorage.getItem('salary');
						var data = system.ajax('../assets/harmony/Process.php?update-work',[salary,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Salary Grade updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('salary');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Status Of Appointment"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('status',data.value);
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
						var status = localStorage.getItem('status');
						var data = system.ajax('../assets/harmony/Process.php?update-work',[status,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Status Of Appointment updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('status');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Government Service"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('service',data.value);
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
						var id = localStorage.getItem('service');
						var data = system.ajax('../assets/harmony/Process.php?update-work',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Government Service updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=PDS");
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
	updateVoluntary:function(){
		$("a[data-cmd='updateVoluntary']").on('click',function(){
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
					$('#modal_confirm').openModal('show');
					localStorage.setItem('name',data.value);
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
							var name = localStorage.getItem('name');
							var data = system.ajax('../assets/harmony/Process.php?update-voluntary',[name,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Name updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('name');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
			else if(data.prop == "Inclusive Date Of Attendance From"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('dates',data.value);
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
						var dates = localStorage.getItem('dates');
						var data = system.ajax('../assets/harmony/Process.php?update-voluntary',[dates,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Inclusive Date Of Attendance From updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('dates');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Inclusive Date Of Attendance To"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('dates',data.value);
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
						var dates = localStorage.getItem('dates');
						var data = system.ajax('../assets/harmony/Process.php?update-voluntary',[dates,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Inclusive Date Of Attendance To updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('dates');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Number of hours"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('hours',data.value);
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
						var hours = localStorage.getItem('hours');
						var data = system.ajax('../assets/harmony/Process.php?update-voluntary',[hours,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Number of Hours updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('hours');	
								App.handleLoadPage("#cmd=index;content=PDS");

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
				localStorage.setItem('position',data.value);
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
						var position = localStorage.getItem('position');
						var data = system.ajax('../assets/harmony/Process.php?update-voluntary',[position,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Position updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('salary');	
								App.handleLoadPage("#cmd=index;content=PDS");

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
	updateTraining:function(){
		$("a[data-cmd='updateTraining']").on('click',function(){
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

			if(data.prop == "Title of seminar"){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('title',data.value);
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
							var title = localStorage.getItem('title');
							var data = system.ajax('../assets/harmony/Process.php?update-training',[title,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Title of seminar updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('title');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
			else if(data.prop == "Inclusive Date Of Attendance From"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('dates',data.value);
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
						var dates = localStorage.getItem('dates');
						var data = system.ajax('../assets/harmony/Process.php?update-training',[dates,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Inclusive Date Of Attendance From updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('dates');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Inclusive Date Of Attendance To"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('dates',data.value);
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
						var dates = localStorage.getItem('dates');
						var data = system.ajax('../assets/harmony/Process.php?update-training',[dates,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Inclusive Date Of Attendance To updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('dates');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Number of hours"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('hours',data.value);
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
						var hours = localStorage.getItem('hours');
						var data = system.ajax('../assets/harmony/Process.php?update-training',[hours,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Number of Hours updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('hours');	
								App.handleLoadPage("#cmd=index;content=PDS");

							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Conducted/Sponsored by"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('conducted',data.value);
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
						var conducted = localStorage.getItem('conducted');
						var data = system.ajax('../assets/harmony/Process.php?update-training',[conducted,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Conducted/Sponsored updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('conducted');	
								App.handleLoadPage("#cmd=index;content=PDS");

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
	updateSkills:function(){
		$("a[data-cmd='updateSkills']").on('click',function(){
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

			if(data.prop == "Special skills/Hobbies"){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('skill',data.value);
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
							var skill = localStorage.getItem('skill');
							var data = system.ajax('../assets/harmony/Process.php?update-skills',[skill,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Special skills/Hobbies updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('skill');	
									App.handleLoadPage("#cmd=index;content=PDS");
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
	updateNonAcademic:function(){
		$("a[data-cmd='updateNonAcademic']").on('click',function(){
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

			if(data.prop == "Non-Academic distinctions/Organization"){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('academic',data.value);
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
							var academic = localStorage.getItem('academic');
							var data = system.ajax('../assets/harmony/Process.php?update-nonAcademic',[academic,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Non-Academic distinctions/Organization updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('academic');	
									App.handleLoadPage("#cmd=index;content=PDS");
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
	updateMembership:function(){
		$("a[data-cmd='updateMembership']").on('click',function(){
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

			if(data.prop == "Membership in organization/Association"){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('membership',data.value);
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
							var membership = localStorage.getItem('membership');
							var data = system.ajax('../assets/harmony/Process.php?update-membership',[membership,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Non-membership distinctions/Organization updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('membership');	
									App.handleLoadPage("#cmd=index;content=PDS");
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
	updateQuestions:function(){
		$("a[data-cmd='updateQuestions']").on('click',function(){
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

			if(data.prop == "Within the third degree(for National Government Employees):appointing authority, recomendiing authority, chief of office/bureau/department or person who has immediate supervision on you in the Office, Bureau or Deaprtment where you will be apointed?"){
					var YN = "<h4>Change "+data.prop+"</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('YN',data.value);
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
							var YN = localStorage.getItem('YN');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[YN,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Questions updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('YN');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Details 36 A"){
					var YN = "<h4>Change Details</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('specify',data.value);
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
							var specify = localStorage.getItem('specify');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[specify,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Details updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('specify');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Within the fourth degree(for Local Government Employees)appointing authority, recommending authority where you will be apointed?"){
					var YN = "<h4>Change "+data.prop+"</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('YN',data.value);
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
							var YN = localStorage.getItem('YN');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[YN,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Questions updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('YN');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Details 36 B"){
					var YN = "<h4>Change Details</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('specify',data.value);
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
							var specify = localStorage.getItem('specify');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[specify,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Details updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('specify');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Have you ever been formally charged?"){
					var YN = "<h4>Change "+data.prop+"</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('YN',data.value);
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
							var YN = localStorage.getItem('YN');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[YN,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Questions updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('YN');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Details 37 A"){
					var YN = "<h4>Change Details</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('specify',data.value);
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
							var specify = localStorage.getItem('specify');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[specify,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Details updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('specify');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Have you ever been guilty of any administrative offense?"){
					var YN = "<h4>Change "+data.prop+"</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('YN',data.value);
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
							var YN = localStorage.getItem('YN');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[YN,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Questions updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('YN');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Details 37 B"){
					var YN = "<h4>Change Details</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('specify',data.value);
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
							var specify = localStorage.getItem('specify');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[specify,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Details updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('specify');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Have you ever been convicted of any crime or violation of any law, decree, ordinance or regulation by any court or tribunal?"){
					var YN = "<h4>Change "+data.prop+"</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('YN',data.value);
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
							var YN = localStorage.getItem('YN');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[YN,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Questions updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('YN');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Details 38"){
					var YN = "<h4>Change Details</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('specify',data.value);
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
							var specify = localStorage.getItem('specify');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[specify,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Details updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('specify');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Have you ever been separated from the service in any following modes: resignation, retirement, dropped from the rolls, dismissal, terminantion, end of term, finished contract AWOL or phase out in the public or private sector?"){
					var YN = "<h4>Change "+data.prop+"</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('YN',data.value);
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
							var YN = localStorage.getItem('YN');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[YN,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Questions updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('YN');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Details 39"){
					var YN = "<h4>Change Details</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('specify',data.value);
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
							var specify = localStorage.getItem('specify');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[specify,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Details updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('specify');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Have you been candidate in a national or local election(exept Brangay election)?"){
					var YN = "<h4>Change "+data.prop+"</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('YN',data.value);
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
							var YN = localStorage.getItem('YN');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[YN,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Questions updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('YN');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Details 40"){
					var YN = "<h4>Change Details</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('specify',data.value);
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
							var specify = localStorage.getItem('specify');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[specify,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Details updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('specify');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Are you a member of any indigenous group?"){
					var YN = "<h4>Change "+data.prop+"</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('YN',data.value);
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
							var YN = localStorage.getItem('YN');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[YN,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Questions updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('YN');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Details 41 A"){
					var YN = "<h4>Change Details</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('specify',data.value);
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
							var specify = localStorage.getItem('specify');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[specify,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Details updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('specify');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Are you differently abled?"){
					var YN = "<h4>Change "+data.prop+"</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('YN',data.value);
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
							var YN = localStorage.getItem('YN');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[YN,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Questions updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('YN');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Details 41 B"){
					var YN = "<h4>Change Details</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('specify',data.value);
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
							var specify = localStorage.getItem('specify');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[specify,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Details updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('specify');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Are you a solo parent?"){
					var YN = "<h4>Change "+data.prop+"</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('YN',data.value);
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
							var YN = localStorage.getItem('YN');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[YN,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Questions updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('YN');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Details 41 C"){
					var YN = "<h4>Change Details</h4>"+
						  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
						  "		<label for='field_"+data.prop+"'> </label>"+
						  "		<input id='field_"+data.prop+"' type='text' name='field_"+data.prop+"' data-error='.error_"+data.prop+"' value='"+data.value+"'>"+
						  "		<div class='error_"+data.prop+"'></div>"+
						  "		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>"+
						  "		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>"+
						  "</form>";
					$("#modal_confirm .modal-content").html(YN);
					$('#modal_confirm').openModal('show');
					localStorage.setItem('specify',data.value);
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
							var specify = localStorage.getItem('specify');
							var data = system.ajax('../assets/harmony/Process.php?update-questions',[specify,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Details updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('specify');	
									App.handleLoadPage("#cmd=index;content=PDS");
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
	updateReferences:function(){
		$("a[data-cmd='updateReferences']").on('click',function(){
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
					$('#modal_confirm').openModal('show');
					localStorage.setItem('name',data.value);
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
							var name = localStorage.getItem('name');
							var data = system.ajax('../assets/harmony/Process.php?update-references',[name,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Name updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('name');	
									App.handleLoadPage("#cmd=index;content=PDS");
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
					localStorage.setItem('addresss',data.value);
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
							var addresss = localStorage.getItem('addresss');
							var data = system.ajax('../assets/harmony/Process.php?update-references',[addresss,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Address updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('addresss');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
				else if(data.prop == "Telephone Number"){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('tel',data.value);
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
							var tel = localStorage.getItem('tel');
							var data = system.ajax('../assets/harmony/Process.php?update-references',[tel,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Telephone Number updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('tel');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
				}
			else if(data.prop == "Community Tax Certificate No."){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('laman',data.value);
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
							var laman = localStorage.getItem('laman');
							var data = system.ajax('../assets/harmony/Process.php?update-references',[laman,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Community Tax Certificate No. updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('laman');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
			}
			else if(data.prop == "Issued at"){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('laman',data.value);
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
							var laman = localStorage.getItem('laman');
							var data = system.ajax('../assets/harmony/Process.php?update-references',[laman,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Date updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('laman');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
			}
			else if(data.prop == "Issued On"){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('laman',data.value);
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
							var laman = localStorage.getItem('laman');
							var data = system.ajax('../assets/harmony/Process.php?update-references',[laman,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Date updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('laman');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
			}
			else if(data.prop == "Date Accomplish"){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('laman',data.value);
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
							var laman = localStorage.getItem('laman');
							var data = system.ajax('../assets/harmony/Process.php?update-references',[laman,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Date updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('laman');	
									App.handleLoadPage("#cmd=index;content=PDS");
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
	updateLast:function(){
		$("a[data-cmd='updateLast']").on('click',function(){
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

			if(data.prop == "Community Tax Certificate No."){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('laman',data.value);
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
							var laman = localStorage.getItem('laman');
							var data = system.ajax('../assets/harmony/Process.php?update-last',[laman,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Community Tax Certificate No. updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('laman');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
			}
			else if(data.prop == "Issued at"){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('laman',data.value);
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
							var laman = localStorage.getItem('laman');
							var data = system.ajax('../assets/harmony/Process.php?update-last',[laman,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Date updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('laman');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
			}
			else if(data.prop == "Issued On"){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('laman',data.value);
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
							var laman = localStorage.getItem('laman');
							var data = system.ajax('../assets/harmony/Process.php?update-last',[laman,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Date updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('laman');	
									App.handleLoadPage("#cmd=index;content=PDS");
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
					    }
					}); 
			}
			else if(data.prop == "Date Accomplish"){
					$('#modal_confirm').openModal('show');
					localStorage.setItem('laman',data.value);
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
							var laman = localStorage.getItem('laman');
							var data = system.ajax('../assets/harmony/Process.php?update-last',[laman,_form]);
							data.done(function(data){
								console.log(data);
								if(data == 1){
									system.clearForm();
									Materialize.toast('Date updated.',4000);
									$('#modal_confirm').closeModal();
									localStorage.removeItem('laman');	
									App.handleLoadPage("#cmd=index;content=PDS");
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
							App.handleLoadPage("#cmd=index;content=PDS");
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
						App.handleLoadPage("#cmd=index;content=PDS");
						$('#modal_confirm').closeModal();	
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});
			});
		})
	},

}
travel = {
	ini:function(){
		travel.pending();
		travel.addTravelForm();
	},
	addTravelForm:function(){
		$("a[data-cmd='add_travel']").on('click',function(){
		var data = system.xml("pages.xml");
				$(data.responseText).find("travelOrder").each(function(i,content){
					$("#modal .modal-content").html(content);
					$('#modal').openModal('show');		
				    $("select").material_select();

					$("#form_me").validate({
					    rules: {
					 		field_date: {required: true,maxlength: 50,checkDate: true},
					        field_name: {required: true,maxlength: 50},
					        field_position: {required: true,maxlength: 50},
					        field_section: {required: true,maxlength: 50},
					        field_destination: {required: true,maxlength: 50},
					        field_departure: {required: true,maxlength: 50},
					        field_arrival: {required: true,maxlength: 50},
					        field_purpose: {required: true,maxlength: 50},
					        field_conducted: {required: true,maxlength: 50},
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
							var id = localStorage.getItem('myId');
							var data = system.ajax('../assets/harmony/Process.php?set-newTravel',[_form,id]);
							data.done(function(data){
								
								if(data == 0){
									Materialize.toast('Cannot process request.',4000);
								}
								else{
									if(data.responseText != ""){
										Materialize.toast('Saved.',4000);
										system.clearForm();
										$('#modal').closeModal();
								    	App.handleLoadPage("#cmd=index;content=travelOrderPending");		
									}
								}
							});
					    }
					});
					$("i[data-cmd='exit_personal']").on('click',function(){
						$('#modal').closeModal();
						$("#modal .modal-content").html("");
					});
				});
			});
	},
	pending:function(){
		var content = "", chips = [],chipsContent = "";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-travelPending',id);
		data = JSON.parse(data.responseText);
		// console.log(data);
		$.each(data,function(i,v){

			if(String(data[0][11]) == "Pending"){
					status = "Pending";
					var actions = "<a data-cmd='updateTravel' data-value='"+data[0][11]+"' data-prop='Status'  data-name='"+data[0][1]+"' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock-open right black-text'></i>"+
								  "</a>";	
				}
			else if(String(data[0][11]) == "Approved"){
					status = "Approved";
					var actions = "<a data-cmd='updateTravel' data-name='"+data[0][1]+"' data-value='"+data[0][11]+"' data-prop='Status' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock right black-text'></i>"+
								  "</a>";	
				}
			else if(String(data[0][11]) == "Disapproved"){
				status = "Disapproved";
				var actions = "<a data-cmd='updateTravel' data-name='"+data[0][1]+"'  data-value='"+data[0][11]+"' data-prop='Status' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
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
		var data = system.ajax('../assets/harmony/Process.php?get-travelApproved',id);
		data = JSON.parse(data.responseText);
		$.each(data,function(i,v){

			if(String(data[0][11]) == "Pending"){
					status = "Pending";
					var actions = "<a data-cmd='updateTravel' data-value='"+data[0][11]+"' data-prop='Status'  data-name='"+data[0][1]+"' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock-open right black-text'></i>"+
								  "</a>";	
				}
			else if(String(data[0][11]) == "Approved"){
					status = "Approved";
					var actions = "<a data-cmd='updateTravel' data-name='"+data[0][1]+"' data-value='"+data[0][11]+"' data-prop='Status' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock right black-text'></i>"+
								  "</a>";	
				}
			else if(String(data[0][11]) == "Disapproved"){
				status = "Disapproved";
				var actions = "<a data-cmd='updateTravel' data-name='"+data[0][1]+"'  data-value='"+data[0][11]+"' data-prop='Status' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
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
		var data = system.ajax('../assets/harmony/Process.php?get-travelDisapproved',id);
		data = JSON.parse(data.responseText);
		$.each(data,function(i,v){

			if(String(data[0][11]) == "Pending"){
					status = "Pending";
					var actions = "<a data-cmd='updateTravel' data-value='"+data[0][11]+"' data-prop='Status'  data-name='"+data[0][1]+"' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock-open right black-text'></i>"+
								  "</a>";	
				}
			else if(String(data[0][11]) == "Approved"){
					status = "Approved";
					var actions = "<a data-cmd='updateTravel' data-name='"+data[0][1]+"' data-value='"+data[0][11]+"' data-prop='Status' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock right black-text'></i>"+
								  "</a>";	
				}
			else if(String(data[0][11]) == "Disapproved"){
				status = "Disapproved";
				var actions = "<a data-cmd='updateTravel' data-name='"+data[0][1]+"'  data-value='"+data[0][11]+"' data-prop='Status' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
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
					var actions = "<button data-cmd='' disabled data-value='"+data[0][11]+"' data-prop='Status'  data-name='"+data[0][1]+"' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Pending' data-cmd='update'>"+
								  "	<i class='mdi-editor-mode-edit right black-text'></i>"+
								  "</button>";	
				}
			else if(String(data[0][11]) == "Approved"){
					status = "Approved";
					var actions = "<button data-cmd='' disabled data-name='"+data[0][1]+"' data-value='"+data[0][11]+"' data-prop='Status' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Approved' data-cmd='update'>"+
								  "	<i class='mdi-editor-mode-edit black-text'></i>"+
								  "</button>";	
				}
			else if(String(data[0][11]) == "Disapproved"){
				status = "Disapproved";
				var actions = "<button data-cmd='' disabled data-name='"+data[0][1]+"'  data-value='"+data[0][11]+"' data-prop='Status' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Disapproved' data-cmd='update'>"+
							  "	<i class='mdi-editor-mode-edit black-text'></i>"+
							  "</button>";	
			}

				content = "<div id='profile-card' class='card'>"+
						"    <div class='card-image waves-effect waves-block waves-light'>"+
						"        <img class='activator' src='../assets/images/user-bg-2.jpeg' alt='user background'>"+
						"    </div>"+
						"    <div class='card-content'>"+
						"		<h5>Travel Order</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-account-circle cyan-text text-darken-2'></i> Date: "+data[0][2]+"</span>"+
						"			<a data-value='"+data[0][2]+"' data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-circle cyan-text text-darken-2'></i> Name: "+data[0][3]+"</span>"+
						"			<a data-value='"+data[0][3]+"' data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-circle cyan-text text-darken-2'></i> Position: "+data[0][4]+"</span>"+
						"			<a data-value='"+data[0][4]+"' data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-work cyan-text text-darken-2'></i> Section: "+data[0][5]+"</span>"+
						"			<a data-value='"+data[0][5]+"' data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Section' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Destination: "+data[0][6]+"</span>"+
						"			<a data-value='"+data[0][6]+"' data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Destination' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-store cyan-text text-darken-2'></i> Date/Time of Departure: "+data[0][7]+"</span>"+
						"			<a data-value='"+data[0][7]+"' data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date/Time of Departure' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Date/Time of Arrival: "+data[0][8]+"</span>"+
						"			<a data-value='"+data[0][8]+"' data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date/Time of Arrival' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Purpose: "+data[0][9]+"</span>"+
						"			<a data-value='"+data[0][9]+"' data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Purpose' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Person(s) to be contacted: "+data[0][10]+"</span>"+
						"			<a data-value='"+data[0][10]+"' data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Persons to be contacted' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><i class='mdi-action-info-outline cyan-text text-darken-2'></i> Recommendation: "+status+actions+"</p>"+	
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Due To: "+data[0][13]+"</span>"+
						"			<button disabled data-value='"+data[0][13]+"' data-cmd='updateTravel' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Due To' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</button>"+
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
	update:function(){
		$("a[data-cmd='updateTravel']").on('click',function(){
			var data = $(this).data();
			// var id = data.node;

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

			if(data.prop == "Date"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-travel',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Date updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusTravelOrder;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Name"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-travel',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusTravelOrder;"+id);
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
						var data = system.ajax('../assets/harmony/Process.php?update-travel',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Position updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusTravelOrder;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Section"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-travel',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Section updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusTravelOrder;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Destination"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-travel',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Destination updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusTravelOrder;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Date/Time of Departure"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-travel',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Date/Time of Departure updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusTravelOrder;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Date/Time of Arrival"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-travel',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Date/Time of Arrival updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusTravelOrder;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Purpose"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-travel',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Purpose updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusTravelOrder;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Persons to be contacted"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-travel',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Persons to be contacted updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusTravelOrder;"+id);
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
		this.pending();
		this.applicationForm();
	},
	applicationForm:function(){
		$("a[data-cmd='add_leave']").on('click',function(){
				var data = system.xml("pages.xml");
				$(data.responseText).find("leave").each(function(i,content){
					$("#modal .modal-content").html(content);
					$('#modal').openModal('show');		
				    $("select").material_select();

					$("#form_leave").validate({
					    rules: {
					 		field_office: {maxlength: 50,required: true},
					 		field_lname: {maxlength: 50,required: true},
					 		field_fname: {maxlength: 50,required: true},
					 		field_mname: {maxlength: 50,required: true},
					 		field_dof: {maxlength: 50,required: true,checkDate: true},
					 		field_position: {maxlength: 50,required: true},
					 		field_salary: {maxlength: 50,required: true},
					 		field_leave: {maxlength: 50,required: true},
					 		field_leaveSpecify: {maxlength: 50},
					 		field_workingDays: {maxlength: 50,required: true},
					 		field_inclusiveDate: {maxlength: 50,required: true,checkDate: true},
					 		field_where: {maxlength: 50,required: true},
					 		field_whereSpecify: {maxlength: 50},
					 		field_commutation: {maxlength: 50,required: true},
					 		field_certification: {maxlength: 50},
					 		field_vacation: {maxlength: 50},
					 		field_sick: {maxlength: 50},
					 		field_total: {maxlength: 50},
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
							var id = localStorage.getItem('myId');
							var data = system.ajax('../assets/harmony/Process.php?set-newLeave',[_form,id]);
							data.done(function(data){
								console.log(data);

								if(data == 0){
									Materialize.toast('Cannot process request.',4000);
								}
								else{
									if(data.responseText != ""){
										Materialize.toast('Saved.',4000);
										system.clearForm();
										$('#modal').closeModal();	
								    	App.handleLoadPage("#cmd=index;content=applicationForLeavePending");

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
		});
	},
	pending:function(){
		var content = "", chips = [],chipsContent = "";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-leavePending',id);
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
		var data = system.ajax('../assets/harmony/Process.php?get-leaveApproved',id);
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
		var data = system.ajax('../assets/harmony/Process.php?get-leaveDisapproved',id);
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
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-account-circle cyan-text text-darken-2'></i> Office/Agency: "+data[0][2]+"</span>"+
						"			<a data-value='"+data[0][2]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Office/Agency' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-circle cyan-text text-darken-2'></i> Last Name: "+data[0][3]+"</span>"+
						"			<a data-value='"+data[0][3]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Last Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-circle cyan-text text-darken-2'></i> First Name: "+data[0][4]+"</span>"+
						"			<a data-value='"+data[0][4]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-work cyan-text text-darken-2'></i> Middle Name: "+data[0][5]+"</span>"+
						"			<a data-value='"+data[0][5]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Middle Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Date of Filling: "+data[0][6]+"</span>"+
						"			<a data-value='"+data[0][6]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date of Filling' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-store cyan-text text-darken-2'></i> Position: "+data[0][7]+"</span>"+
						"			<a data-value='"+data[0][7]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Salary(Monthly): "+data[0][8]+"</span>"+
						"			<a data-value='"+data[0][8]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Salary' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Type of leave: "+data[0][9]+"</span>"+
						"			<a data-value='"+data[0][9]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Type of Leave' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Specify: "+data[0][10]+"</span>"+
						"			<a data-value='"+data[0][10]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Specify' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Number of working days for: "+data[0][11]+"</span>"+
						"			<a data-value='"+data[0][11]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Number of working days' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-store cyan-text text-darken-2'></i> Inclusive Date: "+data[0][12]+"</span>"+
						"			<a data-value='"+data[0][12]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Date' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Where leave will be spent: "+data[0][13]+"</span>"+
						"			<a data-value='"+data[0][13]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Where leave will be spent' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Specify Where: "+data[0][14]+"</span>"+
						"			<a data-value='"+data[0][14]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Specify Where' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Commutation: "+data[0][15]+"</span>"+
						"			<a data-value='"+data[0][15]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Commutation' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Certification of leave credits as of: "+data[0][16]+"</span>"+
						"			<a data-value='"+data[0][16]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Certification of leave credits as of' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-store cyan-text text-darken-2'></i> Vacation(Days): "+data[0][17]+"</span>"+
						"			<a data-value='"+data[0][17]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Vacation' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Sick(Days): "+data[0][18]+"</span>"+
						"			<a data-value='"+data[0][18]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Sick' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Total(Days): "+data[0][19]+"</span>"+
						"			<a data-value='"+data[0][19]+"' data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Total' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Approved For(Day with pay): "+data[0][20]+"</span>"+
						"			<button data-value='"+data[0][20]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Approved For(Day with pay)' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</button>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Approved For(Day without pay): "+data[0][21]+"</span>"+
						"			<button data-value='"+data[0][21]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Approved For(Day without pay)' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</button>"+
						"		 </p>"+						
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-store cyan-text text-darken-2'></i> Approved For(Other(Specify): "+data[0][22]+"</span>"+
						"			<button data-value='"+data[0][22]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Approved For(Other(Specify)' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</button>"+
						"		 </p>"+					
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Recommendation: "+data[0][23]+"</span>"+
						"			<button data-value='"+data[0][23]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Recommendation' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</button>"+
						"		 </p>"+					
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Due To: "+data[0][24]+"</span>"+
						"			<button data-value='"+data[0][24]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Due To' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</button>"+
						"		 </p>"+						
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Due: "+data[0][25]+"</span>"+
						"			<button data-value='"+data[0][25]+"' disabled data-cmd='updateLeave' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Due' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</button>"+
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
	update:function(){
		$("a[data-cmd='updateLeave']").on('click',function(){
			var data = $(this).data();
			// var id = data.node;

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

			if(data.prop == "Office/Agency"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-leave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Office/Agency updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusApplicationForLeave;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Last Name"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-leave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Last Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusApplicationForLeave;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "First Name"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-leave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('First Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusApplicationForLeave;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Middle Name"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-leave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Middle Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusApplicationForLeave;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Date of Filling"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-leave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Date of Filling updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusApplicationForLeave;"+id);
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
						var data = system.ajax('../assets/harmony/Process.php?update-leave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Position updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusApplicationForLeave;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Salary"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-leave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Salary updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusApplicationForLeave;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Type of Leave"){
				var content = "<h4>Change "+data.prop+"</h4>"+
							  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
							  "		<div class='col s12'>"+
							  "		<label for='field_Type of Leave' class='active'>Type of Leave: </label>"+
							  "		<select name='field_Type of Leave'>"+
							  "			<option selected>VACATION</option>"+
							  "			<option>SICK</option>"+
							   "			<option>MATERNITY</option>"+
							    "			<option>OTHER</option>"+
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
						var data = system.ajax('../assets/harmony/Process.php?update-leave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Type of Leave updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusApplicationForLeave;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Specify"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-leave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Specify updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusApplicationForLeave;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Number of working days"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-leave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Number of working days updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusApplicationForLeave;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Inclusive Date"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-leave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Inclusive Date updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusApplicationForLeave;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Where leave will be spent"){
				var content = "<h4>Change "+data.prop+"</h4>"+
							  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
							  "		<div class='col s12'>"+
							  "		<label for='field_Where leave will be spent' class='active'>Type of Leave: </label>"+
							  "		<select name='field_Where leave will be spent'>"+
							  "			<option selected>Within the Philippines</option>"+
							  "			<option>Abroad</option>"+
							  "			<option>In hospital</option>"+
							  "			<option>Out-Patient</option>"+
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
						var data = system.ajax('../assets/harmony/Process.php?update-leave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Where leave will be spent updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusApplicationForLeave;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Specify Where"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-leave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Specify Where updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusApplicationForLeave;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Commutation"){
				var content = "<h4>Change "+data.prop+"</h4>"+
							  "<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>"+
							  "		<div class='col s12'>"+
							  "		<label for='field_Commutation' class='active'>Commutation: </label>"+
							  "		<select name='field_Commutation'>"+
							  "			<option selected>Requested</option>"+
							  "			<option>Not Requested</option>"+
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
						var data = system.ajax('../assets/harmony/Process.php?update-leave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Commutation updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusApplicationForLeave;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Certification of leave credits as of"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-leave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Certification of leave credits as of updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusApplicationForLeave;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Vacation"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-leave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Vacation updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusApplicationForLeave;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Sick"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-leave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Sick updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusApplicationForLeave;"+id);
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Total"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-leave',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Total updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=focusApplicationForLeave;"+id);
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

SALN = {
	ini:function(){
	},
	addPersonalinfo:function(){
		var data = system.xml("pages.xml");
				$(data.responseText).find("addSALNpersonalInfo").each(function(i,content){
					$("#modal .modal-content").html(content);
					$('#modal').openModal('show');		
				    $("select").material_select();

					$("#form_personalInfo").validate({
					    rules: {
							field_lname: {required: true,maxlength: 50},
							field_fname: {required: true,maxlength: 50},
							field_mname: {required: true,maxlength: 50},
							field_office_address: {required: true,maxlength: 50},
							field_position: {required: true,maxlength: 50},
							field_agency: {required: true,maxlength: 50},
							field_address: {required: true,maxlength: 50},
							field_s_lname: {required: true,maxlength: 50},
							field_s_fname: {required: true,maxlength: 50},
							field_s_mname: {required: true,maxlength: 50},
							field_s_position: {required: true,maxlength: 50},
							field_s_office: {required: true,maxlength: 50},
							field_s_address: {required: true,maxlength: 50},
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
							var id = localStorage.getItem('myId');
							var company_id = localStorage.getItem('company_id');
							var data = system.ajax('../assets/harmony/Process.php?set-newSALNpersonalInfo',[_form,id,company_id]);
							data.done(function(data){
								console.log(data);

								if(data == 0){
									Materialize.toast('Cannot process request.',4000);
								}
								else{
									if(data.responseText != ""){
										Materialize.toast('Saved.',4000);
										system.clearForm();
										SALN.addChild();
								    	App.handleLoadPage("#cmd=index;content=SALN;"+id);		
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
	addChild:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addUnmarriedChild").each(function(i,content){
			console.log("Unmarried Child");
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newSALNunmarried',[_form,id]);
					data.done(function(data){
						console.log(data);

						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	App.handleLoadPage("#cmd=index;content=SALN;"+id);			
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
		$("a[data-cmd='add_real']").on('click',function(){
			SALN.addReal();
		});
	},
	addReal:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addReal").each(function(i,content){
			console.log("Real Properties");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_addReal").validate({
			    rules: {
			    	//fields here
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newReal',[_form,id]);
					data.done(function(data){
						console.log(data);

						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	App.handleLoadPage("#cmd=index;content=SALN;"+id);			
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
		$("a[data-cmd='add_personal']").on('click',function(){
			SALN.addPersonal();
		});
	},
	addPersonal:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addPersonal").each(function(i,content){
			console.log("Personal Properties");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_personal").validate({
			    rules: {
			    	//fields here
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newPersonal',[_form,id]);
					data.done(function(data){
						console.log(data);
						
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	App.handleLoadPage("#cmd=index;content=SALN;"+id);			
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
		$("a[data-cmd='add_liabilities']").on('click',function(){
			SALN.addLiabilities();
		});
	},
	addLiabilities:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addLiabilities").each(function(i,content){
			console.log("Liabilities");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_liabilities").validate({
			    rules: {
			    	//fields here
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newLiabilities',[_form,id]);
					data.done(function(data){
						console.log(data);
						
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	App.handleLoadPage("#cmd=index;content=SALN;"+id);			
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
		$("a[data-cmd='add_business']").on('click',function(){
			SALN.addBusiness();
		});
	},
	addBusiness:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addBusiness").each(function(i,content){
			console.log("Business");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_business").validate({
			    rules: {
			    	//fields here
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newBusiness',[_form,id]);
					data.done(function(data){
						console.log(data);
						
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	App.handleLoadPage("#cmd=index;content=SALN;"+id);			
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
		$("a[data-cmd='add_relatives']").on('click',function(){
			SALN.addRelatives();
		});
	},
	addRelatives:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addRelatives").each(function(i,content){
			console.log("Relatives");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_relatives").validate({
			    rules: {
			    	//fields here
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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newRelatives',[_form,id]);
					data.done(function(data){
						console.log(data);
						
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
								$("#modal").closeModal();
						    	App.handleLoadPage("#cmd=index;content=SALN;"+id);			
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
		$("a[data-cmd='add_Other']").on('click',function(){
			SALN.addOther();
		});
	},
	addOther:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addOther").each(function(i,content){
			console.log("Other");
			$("#modal .modal-content").html(content);
			$('#modal').openModal('show');		
		    $("select").material_select();

			$("#form_other").validate({
			    rules: {
		    		field_date: {required: true,checkDate:true,maxlength: 50},
					field_government_issued: {required: true,maxlength: 50},
					field_id_number: {required: true,maxlength: 50},
					field_date_issued: {maxlength: 50},
					field_s_government_issued: {required: true,maxlength: 50},
					field_s_id_number: {required: true,maxlength: 50},
					field_s_date_issued: {checkDate:true,maxlength: 50},

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
					var id = localStorage.getItem('myId');
					var data = system.ajax('../assets/harmony/Process.php?set-newSalnOther',[_form,id]);
					data.done(function(data){
						console.log(data);
						
						if(data == 1){
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
								$("#modal").closeModal();
								$(".lean-overlay").remove();
						    	App.handleLoadPage("#cmd=index;content=SALN;"+id);			
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

	//Details
	personalInfoDetails:function(){
		var content = "";
		var bago = "";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-SALNpersonalInfo',id);
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
					var actions = "<button data-cmd='deactivateEmployee' disabled='' data-name='"+data[0][4]+"' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock-open right grey-text'></i>"+
								  "</button>";	
				}
				else{
					status = "Deactivated";
					var actions = "<button data-cmd='activateEmployee' disabled='' data-name='"+data[0][4]+"' data-node='"+data[0][0]+"' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>"+
								  "	<i class='mdi-action-lock right grey-text'></i>"+
								  "</button>";	
				}

				var profile = ((data[0][10] == "") || (data[0][10] == null))?"avatar.jpg":data[0][10];
				
				content ="<div id='profile-card' class='card'>"+
						"    <div class='card-image waves-effect waves-block waves-light'>"+
						"        <img class='activator' src='../assets/images/user-bg-2.jpeg' alt='user background'>"+
						"    </div>"+
						"    <div class='card-content'>"+
						"        <span class='card-title activator grey-text text-darken-4'>"+data[0][3]+" "+data[0][4]+" "+data[0][5]+" </span>"+
						"			<a data-value='"+JSON.stringify([data[0][3],data[0][4],data[0][5]])+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 <div class='divider'></div>"+
						"        <p><i class='mdi-action-info-outline cyan-text text-darken-2'></i> Status: "+status+actions+"</p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Address: "+data[0][6]+"</span>"+
						"			<a data-value='"+data[0][6]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Position: "+data[0][7]+"</span>"+
						"			<a data-value='"+data[0][7]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-cached cyan-text text-darken-2'></i> Agency/Office: "+data[0][8]+"</span>"+
						"			<a data-value='"+data[0][8]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Office/Agency' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-event cyan-text text-darken-2'></i> Office Address: "+data[0][9]+"</span>"+
						"			<a data-value='"+data[0][9]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Office Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"<h5>SPOUSE</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Family Name: "+data[0][10]+"</span>"+
						"			<a data-value='"+data[0][10]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Last Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> First Name: "+data[0][11]+"</span>"+
						"			<a data-value='"+data[0][11]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-accessibility cyan-text text-darken-2'></i> Middle Initial: "+data[0][12]+"</span>"+
						"			<a data-value='"+data[0][12]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Middle Initial' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-accessibility cyan-text text-darken-2'></i> Position: "+data[0][13]+"</span>"+
						"			<a data-value='"+data[0][13]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-cached cyan-text text-darken-2'></i> Agency/Office: "+data[0][14]+"</span>"+
						"			<a data-value='"+data[0][14]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Agency/Office' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-image-portrait cyan-text text-darken-2'></i> Office Address: "+data[0][15]+"</span>"+
						"			<a data-value='"+data[0][15]+"' data-cmd='updatePersonalInfo' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Office Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
				$("#personalInfo").html(content);

				SALN.updatePersonalInfo();
				SALN.activate();
				SALN.deactivate();

				SALN.unmarriedDetails();
				SALN.realDetails();
				SALN.personalDetails();
				SALN.liabilitiesDetails();
				SALN.businessDetails();
				SALN.relativesDetails();
				SALN.otherDetails();

			}
		});

		$("a[data-cmd='add_personalInfo']").on('click',function(){
			SALN.addPersonalinfo();
		});   		
	},
	unmarriedDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-unmarriedChild',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
		
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card' class='card'>"+
							"   <div class='card-content'>"+
							"		<h5>Unmarried Children Below(18) Years of Age Living in Declarant's Household</h5>";

				$(data).each(function(index,value){
            		// data.length;
            		// console.log(value);
				
				content +=	
							"        <br /><p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Name Of Child: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateUnmarried' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of Child' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Name Of Child '>"+
							"				<i class='mdi-editor-mode-edit right black-text' data-cmd='value'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Date Of Birth: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateUnmarried' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date Of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Date Of Birth'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Age: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateUnmarried' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Age' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Age'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br>";
							
        		});

        		content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_child'>Add</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#unmarriedChild").html(content);

				// employee.deactivate();
				// employee.activate();
				SALN.updateUnmarried();
				// employee.updatePicture();

				$("a[data-cmd='add_child']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addUnmarriedChilds").each(function(i,content){
						console.log("Unmarried Child");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_addAnaks").validate({
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newSALNunmarried',[_form,id]);
								data.done(function(data){
									console.log(data);

									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	App.handleLoadPage("#cmd=index;content=SALN;"+id);			
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
				});
		});
	},
	realDetails:function(){
		var content="";
		var bago="";
		var subTotalA = 0;
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-real',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
		
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
					content +=	"        <br /><p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Description: "+value[2]+"</span>"+
								"			<a data-value='"+value[2]+"' data-cmd='updateReal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Description' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
								"				<i class='mdi-editor-mode-edit right black-text' data-cmd='value'></i>"+
								"			</a>"+
								"		 </p>"+
								"		 <div class='divider'></div>"+
								"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Kind: "+value[3]+"</span>"+
								"			<a data-value='"+value[3]+"' data-cmd='updateReal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Kind' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
								"				<i class='mdi-editor-mode-edit right black-text'></i>"+
								"			</a>"+
								"		 </p>"+
								"		 <div class='divider'></div>"+
								"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Exact Location: "+value[4]+"</span>"+
								"			<a data-value='"+value[4]+"' data-cmd='updateReal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Exact Location' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update '>"+
								"				<i class='mdi-editor-mode-edit right black-text'></i>"+
								"			</a>"+
								"		 </p>"+
								"		 <div class='divider'></div>"+
								"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Assessed Value: "+value[5]+"</span>"+
								"			<a data-value='"+value[5]+"' data-cmd='updateReal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Assessed Value' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
								"				<i class='mdi-editor-mode-edit right black-text'></i>"+
								"			</a>"+
								"		 </p>"+
								"		 <div class='divider'></div>"+
								"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Current Fair Market Value: "+value[6]+"</span>"+
								"			<a data-value='"+value[6]+"' data-cmd='updateReal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Current Fair Market Value' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
								"				<i class='mdi-editor-mode-edit right black-text' data-cmd='value'></i>"+
								"			</a>"+
								"		 </p>"+
								"		 <div class='divider'></div>"+
								"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Acqusition Year: "+value[7]+"</span>"+
								"			<a data-value='"+value[7]+"' data-cmd='updateReal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Acqusition Year' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
								"				<i class='mdi-editor-mode-edit right black-text'></i>"+
								"			</a>"+
								"		 </p>"+
								"		 <div class='divider'></div>"+
								"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Acqusition Mode: "+value[8]+"</span>"+
								"			<a data-value='"+value[8]+"' data-cmd='updateReal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Acqusition Mode' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
								"				<i class='mdi-editor-mode-edit right black-text'></i>"+
								"			</a>"+
								"		 </p>"+
								"		 <div class='divider'></div>"+
								"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Acqusition Cost: "+value[9]+"</span>"+
								"			<a data-value='"+value[9]+"' data-cmd='updateReal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Acqusition Cost' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
								"				<i class='mdi-editor-mode-edit right black-text'></i>"+
								"			</a>"+
								"		 </p>"+
								"		 <div class='divider'></div></br>";
								
        		});
				localStorage.setItem('TotalA',subTotalA);
				
        		content += 	"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Subtotal: "+subTotalA+"</span>"+
        					"		 </p>"+
        					"<a class='btn waves-effect waves-light orange left' data-cmd='add_real'>Add</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#real").html(content);

				// employee.deactivate();
				// employee.activate();
				SALN.updateReal();
				// employee.updatePicture();

				$("a[data-cmd='add_real']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addReals").each(function(i,content){
						console.log("Real Properties");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_addReals").validate({
						    rules: {
						    	//fields here
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newReal',[_form,id]);
								data.done(function(data){
									console.log(data);

									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	App.handleLoadPage("#cmd=index;content=SALN;"+id);			
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
				});
		});
	},
	personalDetails:function(){
		var content="";
		var bago="";
		var subTotalB=0;
		var a = "", b="", totalAssets=0;
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-personal',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
		
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card'>"+
							"   <div class='card-content'>"+
							"		<h6>b. Personal Properties</h6>";

				$(data).each(function(index,value){
            		// data.length;
            		// console.log(value);
					subTotalB = subTotalB + Number(value[4]);
					

				content +=	
							"        <br /><p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Description: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updatePersonal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Description' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right black-text' data-cmd='value'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Year Acquired: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updatePersonal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Year Acquired' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Acquisition Cost/Amount: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updatePersonal' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Acquisition Cost/Amount' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br>";
        		});
				localStorage.setItem('TotalB',subTotalB);
				a = localStorage.getItem('TotalA');
				b = localStorage.getItem('TotalB');
				totalAssets=(Number(a)+Number(b));

        		content += 	"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Subtotal: "+subTotalB+"</span>"+
							"		 </p>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Total Assets(a+b): "+totalAssets+"</span>"+
							"		 </p>"+
        					"<a class='btn waves-effect waves-light orange left' data-cmd='add_personal'>Add</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#personal").html(content);

				// employee.deactivate();
				// employee.activate();
				SALN.updatePersonal();
				// employee.updatePicture();

				$("a[data-cmd='add_personal']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addPersonals").each(function(i,content){
						console.log("Personal Properties");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_personals").validate({
						    rules: {
						    	//fields here
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newPersonal',[_form,id]);
								data.done(function(data){
									console.log(data);
									
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	App.handleLoadPage("#cmd=index;content=SALN;"+id);			
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
				});
		});
	},
	liabilitiesDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-liabilities',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
		
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card'>"+
							"   <div class='card-content'>"+
							"		<h5>Liabilities</h5>";

				$(data).each(function(index,value){
            		// data.length;
            		// console.log(value);
				
				content +=	
							"        <br /><p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Nature: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateLiabilities' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Nature' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right black-text' data-cmd='value'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Name Of Creditors: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateLiabilities' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of Creditors' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Outstanding Balance: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateLiabilities' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Outstanding Balance' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br>";
        		});
				
        		content += 	"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Total Liabilities:</span>"+
							"		 </p>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Net Worth:Total Assets less Total Liabilities=</span>"+
							"		 </p>"+
        					"<a class='btn waves-effect waves-light orange left' data-cmd='add_liabilities'>Add</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#liabilities").html(content);

				// employee.deactivate();
				// employee.activate();
				SALN.updateLiabilities();
				// employee.updatePicture();

				$("a[data-cmd='add_liabilities']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addLiabilitiess").each(function(i,content){
						console.log("Liabilities");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_liabilitiess").validate({
						    rules: {
						    	//fields here
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newLiabilities',[_form,id]);
								data.done(function(data){
									console.log(data);
									
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	App.handleLoadPage("#cmd=index;content=SALN;"+id);			
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
				});
		});
	},
	businessDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-business',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
		
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card'>"+
							"   <div class='card-content'>"+
							"		<h5>Business Interests And Financial Connections</h5>";

				$(data).each(function(index,value){
            		// data.length;
            		// console.log(value);
				
				content +=	
							"        <br /><p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Name Of Entity/Business Enterprise: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateBusiness' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of Entity' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right black-text' data-cmd='value'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Business Address: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateBusiness' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Business Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Nature Of Business /Or Financial Connection: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateBusiness' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Nature Of Business' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Date Of Acquisition Of Interests Or Connector: "+value[5]+"</span>"+
							"			<a data-value='"+value[5]+"' data-cmd='updateBusiness' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date Of Acquisition Of Interests' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br>";
        		});
				
        		content += 	"<a class='btn waves-effect waves-light orange left' data-cmd='add_business'>Add</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#business").html(content);

				// employee.deactivate();
				// employee.activate();
				SALN.updateBusiness();
				// employee.updatePicture();

				$("a[data-cmd='add_business']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addBusinesss").each(function(i,content){
						console.log("Business");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_businesss").validate({
						    rules: {
						    	//fields here
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newBusiness',[_form,id]);
								data.done(function(data){
									console.log(data);
									
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	App.handleLoadPage("#cmd=index;content=SALN;"+id);			
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
				});
		});
	},
	relativesDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-relatives',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
		
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content += "<div id='profile-card'>"+
							"   <div class='card-content'>"+
							"		<h5>Relatives in the Government Service</h5>";

				$(data).each(function(index,value){
            		// data.length;
            		// console.log(value);
				
				content +=	
							"        <br /><p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Name Of Relative: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateRelatives' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of Relative' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right black-text' data-cmd='value'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Relationship: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateRelatives' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Relationship' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Position: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateRelatives' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Name Of Agency/Office And Address: "+value[5]+"</span>"+
							"			<a data-value='"+value[5]+"' data-cmd='updateRelatives' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of Agency/Office And Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div></br>";
        		});
				
        		content += 	"<a class='btn waves-effect waves-light orange left' data-cmd='add_relatives'>Add</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#relatives").html(content);

				// employee.deactivate();
				// employee.activate();
				SALN.updateRelatives();
				// employee.updatePicture();

				$("a[data-cmd='add_relatives']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addRelativess").each(function(i,content){
						console.log("Relatives");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_relatives").validate({
						    rules: {
						    	//fields here
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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newRelatives',[_form,id]);
								data.done(function(data){
									console.log(data);
									
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
									    	App.handleLoadPage("#cmd=index;content=SALN;"+id);			
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
				});
		});
	},
	otherDetails:function(){
		var content="";
		var bago="";
		var id = localStorage.getItem('myId');
		var data = system.ajax('../assets/harmony/Process.php?get-other',id);
		data.done(function(data){
			data = JSON.parse(data);
			// console.log(data);
			if(data.length<=0){
				bago = 	"<div id='profile-card' class='card'>"+
							"<div class='card-content'>"+
								"<h5>Other Information</h5><br />"+
								"<a class='btn waves-effect waves-light orange left' data-cmd='add_other'>Add</a></br></br>"+
							"</div>"+
						"</div>";
			
				$("#other").html(bago);
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				content ="<div id='profile-card' class='card'>"+
						"    <div class='card-image waves-effect waves-block waves-light'>"+
						"        <img class='activator' src='../assets/images/user-bg.jpg' alt='user background'>"+
						"    </div>"+
						"    <div class='card-content'>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Date(dd/mm/yyy): "+data[0][2]+"</span>"+
						"			<a data-value='"+data[0][2]+"' data-cmd='updateOther' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Date' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"<h5>Declarant</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Government Issued ID: "+data[0][3]+"</span>"+
						"			<a data-value='"+data[0][3]+"' data-cmd='updateOther' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Declarant Government Issued ID' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-cached cyan-text text-darken-2'></i> ID No.: "+data[0][4]+"</span>"+
						"			<a data-value='"+data[0][4]+"' data-cmd='updateOther' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Declarant ID No.' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-event cyan-text text-darken-2'></i> Date Issued: "+data[0][5]+"</span>"+
						"			<a data-value='"+data[0][5]+"' data-cmd='updateOther' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Declarant Date Issued' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"<h5>Spouse</h5>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Government Issued ID: "+data[0][6]+"</span>"+
						"			<a data-value='"+data[0][6]+"' data-cmd='updateOther' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Co-Declarant/Spouse Government Issued ID' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> ID No.: "+data[0][7]+"</span>"+
						"			<a data-value='"+data[0][7]+"' data-cmd='updateOther' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Co-Declarant/Spouse ID No.' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-accessibility cyan-text text-darken-2'></i> Date Issued: "+data[0][8]+"</span>"+
						"			<a data-value='"+data[0][8]+"' data-cmd='updateOther' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Co-Declarant/Spouse Date Issued' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"    </div>"+
						"</div>";
        		
				$("#other").html(content);
			}
				// employee.deactivate();
				// employee.activate();
				SALN.updateOther();
				// employee.updatePicture();

				$("a[data-cmd='add_other']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addOther").each(function(i,content){
						console.log("Other");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_other").validate({
						    rules: {
					    		field_date: {required: true,checkDate:true,maxlength: 50},
								field_government_issued: {required: true,maxlength: 50},
								field_id_number: {required: true,maxlength: 50},
								field_date_issued: {maxlength: 50},
								field_s_government_issued: {required: true,maxlength: 50},
								field_s_id_number: {required: true,maxlength: 50},
								field_s_date_issued: {checkDate:true,maxlength: 50},

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
								var id = localStorage.getItem('myId');
								var data = system.ajax('../assets/harmony/Process.php?set-newSalnOther',[_form,id]);
								data.done(function(data){
									console.log(data);
									
									if(data == 1){
										if(data.responseText != ""){
											Materialize.toast('Saved.',4000);
											system.clearForm();
											$("#modal").closeModal();
											$(".lean-overlay").remove();
									    	App.handleLoadPage("#cmd=index;content=SALN;"+id);			
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
				});
		});
	},

	//update
	updatePersonalInfo:function(){
		$("a[data-cmd='updatePersonalInfo']").on('click',function(){
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
							  "			<label for='field_Name'>Family Name: </label>"+
							  "			<input id='field_Name' type='text' name='field_Name' data-error='.error_Name' value='"+data.value[0]+"'>"+
							  "			<div class='error_Name'></div>"+
							  "		</div>"+
							  "		<div class='col s12'>"+
							  "			<label for='field_fname'>First Name: </label>"+
							  "			<input id='field_fname' type='text' name='field_fname' data-error='.error_fname' value='"+data.value[1]+"'>"+
							  "			<div class='error_fname'></div>"+
							  "		</div>"+ 
							  "		<div class='col s12'>"+
							  "			<label for='field_minitial'>Middle Initial: </label>"+
							  "			<input id='field_minitial' type='text' name='field_minitial' data-error='.error_minitial' value='"+data.value[2]+"'>"+
							  "			<div class='error_minitial'></div>"+
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
				        field_minitial: {required: true,maxlength: 50},
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
						var data = system.ajax('../assets/harmony/Process.php?update-saln',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=SALN");
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
						var data = system.ajax('../assets/harmony/Process.php?update-saln',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Address updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=SALN");
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
						var data = system.ajax('../assets/harmony/Process.php?update-saln',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Position updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Office/Agency"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-saln',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Office/Agency updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Office Address"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-saln',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Office Address updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Spouse Last Name"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-saln',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Last Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=SALN");
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
						var data = system.ajax('../assets/harmony/Process.php?update-saln',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('First Name updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Spouse Middle Initial"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-saln',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Middle Initial updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Spouse Position"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-saln',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Position updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Spouse Agency/Office"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-saln',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Agency/Office updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Spouse Office Address"){
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
						var data = system.ajax('../assets/harmony/Process.php?update-saln',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Office Address updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=SALN");
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
	updateUnmarried:function(){
		$("a[data-cmd='updateUnmarried']").on('click',function(){
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

			if(data.prop == "Name Of Child"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('laman',data.value);			
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
						var laman = localStorage.getItem('laman');
						var data = system.ajax('../assets/harmony/Process.php?update-unmarried',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Name updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Date Of Birth"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');			
						var data = system.ajax('../assets/harmony/Process.php?update-unmarried',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Date Of Birth updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Age"){
				$('#modal_confirm').openModal('show');
				localStorage.setItem('laman',data.value);			
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
						var laman = localStorage.getItem('laman');			
						var data = system.ajax('../assets/harmony/Process.php?update-unmarried',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Age updated.',4000);
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=SALN");
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
	updateReal:function(){
		$("a[data-cmd='updateReal']").on('click',function(){
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

			if(data.prop == "Description"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');
						var data = system.ajax('../assets/harmony/Process.php?update-real',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Description updated.',4000);
								$('#modal_confirm').closeModal();
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Kind"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');
						var data = system.ajax('../assets/harmony/Process.php?update-real',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Kind updated.',4000);
								localStorage.removeItem('laman');	
								$('#modal_confirm').closeModal();	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Exact Location"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');
						var data = system.ajax('../assets/harmony/Process.php?update-real',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Exact Location updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Assessed Value"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-real',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Assessed Value updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Current Fair Market Value"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-real',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Current Fair Market Value updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Acqusition Year"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-real',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Acqusition Year updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Acqusition Mode"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-real',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Acqusition Mode updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Acqusition Cost"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-real',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Acqusition Cost updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
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
	updatePersonal:function(){
		$("a[data-cmd='updatePersonal']").on('click',function(){
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

			if(data.prop == "Description"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-personal',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Description updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Year Acquired"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-personal',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Year Acquired updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Acquisition Cost/Amount"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-personal',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Acquisition Cost/Amount updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
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
	updateLiabilities:function(){
		$("a[data-cmd='updateLiabilities']").on('click',function(){
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

			if(data.prop == "Nature"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-liabilities',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Nature updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Name Of Creditors"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-liabilities',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Name Of Creditors updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Outstanding Balance"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-liabilities',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Outstanding Balance updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
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
	updateBusiness:function(){
		$("a[data-cmd='updateBusiness']").on('click',function(){
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

			if(data.prop == "Name Of Entity"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-business',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Name Of Entity updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Business Address"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-business',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Business Address updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Nature Of Business"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-business',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Nature Of Business updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Date Of Acquisition Of Interests"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-business',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Date Of Acquisition Of Interests updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
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
	updateRelatives:function(){
		$("a[data-cmd='updateRelatives']").on('click',function(){
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

			if(data.prop == "Name Of Relative"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-relatives',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Name Of Relative updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Relationship"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-relatives',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Relationship updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
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
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-relatives',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Position updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Name Of Agency/Office And Address"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-relatives',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Name Of Agency/Office And Address updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
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
	updateOther:function(){
		$("a[data-cmd='updateOther']").on('click',function(){
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

			if(data.prop == "Date"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
				$("#form_update").validate({
				    rules: {
				        field_Date: {checkDate: true,required: true,maxlength: 50},
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-salnOther',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Date updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Declarant Government Issued ID"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-salnOther',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Declarant Government Issued ID updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Declarant ID No."){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-salnOther',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Declarant ID No. updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Declarant Date Issued"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-salnOther',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Declarant Date Issued updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Co-Declarant/Spouse Government Issued ID"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-salnOther',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Co-Declarant/Spouse Government Issued ID updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Co-Declarant/Spouse ID No."){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-salnOther',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Co-Declarant/Spouse ID No. updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
			else if(data.prop == "Co-Declarant/Spouse Date Issued"){
				$('#modal_confirm').openModal('show');			
				localStorage.setItem('laman',data.value);
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
						var laman = localStorage.getItem('laman');	
						var data = system.ajax('../assets/harmony/Process.php?update-salnOther',[laman,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Co-Declarant/Spouse Date Issued updated.',4000);
								$('#modal_confirm').closeModal();	
								localStorage.removeItem('laman');	
								App.handleLoadPage("#cmd=index;content=SALN");
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
					var data = system.ajax('../assets/harmony/Process.php?deactivate-saln',[id,remarks]);
					data.done(function(data){
						console.log(data);
						if(data == 1){
							Materialize.toast('Account deactivaded.',4000);
							system.clearForm();
							App.handleLoadPage("#cmd=index;content=SALN");
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
				var data = system.ajax('../assets/harmony/Process.php?activate-saln',id);
				data.done(function(data){
					console.log(data);
					if(data == 1){
						Materialize.toast('Account activaded.',4000);
						system.clearForm();
						App.handleLoadPage("#cmd=index;content=SALN");
						$('#modal_confirm').closeModal();	
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});
			});
		})
	},
}