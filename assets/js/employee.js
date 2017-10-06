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
							var id = localStorage.getItem('myId');
							var company_id = localStorage.getItem('company_id');
							var data = system.ajax('../assets/harmony/Process.php?set-newEmployees',[_form,id,company_id]);
							data.done(function(data){
								// console.log(data);

								if(data == 0){
									// console.log(data);
									Materialize.toast('Cannot process request.',4000);
								}
								else{
									if(data.responseText != ""){
										Materialize.toast('Saved.',4000);
										console.log(data);
										system.clearForm();
										// localStorage.setItem('id',);
								    	// $(location).attr(s'href',"#cmd=index;content=focusClient");
								    	App.handleLoadPage("#cmd=index;content=PDS;"+id);
								    	PDS.addFamily();			
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
	addFamily:function(){
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
		$("a[data-cmd='add_graduate']").on('click',function(){
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

				// employee.deactivate();
				// employee.activate();
				// employee.update();
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

			}
		});

		$("a[data-cmd='add_pds']").on('click',function(){
				PDS.addPersonalinfo();
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
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-account-circle cyan-text text-darken-2'></i> Spouse's Surename: "+data[0][1]+"</span>"+
						"			<a data-value='"+data[0][1]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Surename' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-circle cyan-text text-darken-2'></i> First Name: "+data[0][2]+"</span>"+
						"			<a data-value='"+data[0][2]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update First Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-circle cyan-text text-darken-2'></i> Middle Name: "+data[0][3]+"</span>"+
						"			<a data-value='"+data[0][3]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Middle Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Middle Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-work cyan-text text-darken-2'></i> Occupation: "+data[0][4]+"</span>"+
						"			<a data-value='"+data[0][4]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Occupation' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Occupation'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-person cyan-text text-darken-2'></i> Employer/Bus Name: "+data[0][5]+"</span>"+
						"			<a data-value='"+data[0][5]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Employer/Bus Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-store cyan-text text-darken-2'></i> Business Address: "+data[0][6]+"</span>"+
						"			<a data-value='"+data[0][6]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Business Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Business Address'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Telephone Number: "+data[0][7]+"</span>"+
						"			<a data-value='"+data[0][7]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Spouse Telephone Number' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Telephone Number'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Father's surname: "+data[0][8]+"</span>"+
						"			<a data-value='"+data[0][8]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Father Surename' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surename'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> First Name: "+data[0][9]+"</span>"+
						"			<a data-value='"+data[0][9]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Father First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update First Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people cyan-text text-darken-2'></i> Middle Name: "+data[0][10]+"</span>"+
						"			<a data-value='"+data[0][10]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Father Middle Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Middle Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people-outline cyan-text text-darken-2'></i> Mother's surename: "+data[0][11]+"</span>"+
						"			<a data-value='"+data[0][11]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Mother Surename' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surename'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people-outline cyan-text text-darken-2'></i> First Name: "+data[0][12]+"</span>"+
						"			<a data-value='"+data[0][12]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Mother First Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update First Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-people-outline cyan-text text-darken-2'></i> Middle Name: "+data[0][13]+"</span>"+
						"			<a data-value='"+data[0][13]+"' data-cmd='updateFamily' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Mother Middle Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Middle Name'>"+
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
							"		<h5>Family Background</h5>";

				$(data).each(function(index,value){
            		data.length;
            		// console.log(value);
				
				content +=	
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Name Of Child: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateChild' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of Child' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text' data-cmd='value'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-cake cyan-text text-darken-2'></i> Date Of Birth: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateChild' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Birthday' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
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
						"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+data[0][1]+"</span>"+
						"			<a data-value='"+data[0][1]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of School' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+data[0][2]+"</span>"+
						"			<a data-value='"+data[0][2]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Degree Course' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update First Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+data[0][3]+"</span>"+
						"			<a data-value='"+data[0][3]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Year Graduated' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Middle Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+data[0][4]+"</span>"+
						"			<a data-value='"+data[0][4]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Highest Grade' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Occupation'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance: "+data[0][5]+"</span>"+
						"			<a data-value='"+data[0][5]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+data[0][6]+"</span>"+
						"			<a data-value='"+data[0][6]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Scholarship/Non Academics Honor Recieved' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div></br>"+
						"		<h5>Secondary Level</h5>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+data[0][7]+"</span>"+
						"			<a data-value='"+data[0][7]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+data[0][8]+"</span>"+
						"			<a data-value='"+data[0][8]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Degree' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+data[0][9]+"</span>"+
						"			<a data-value='"+data[0][9]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Year' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+data[0][10]+"</span>"+
						"			<a data-value='"+data[0][10]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Grade' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance: "+data[0][11]+"</span>"+
						"			<a data-value='"+data[0][11]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
						"				<i class='mdi-editor-mode-edit right black-text'></i>"+
						"			</a>"+
						"		 </p>"+
						"		 <div class='divider'></div>"+
						"        <p><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+data[0][12]+"</span>"+
						"			<a data-value='"+data[0][12]+"' data-cmd='updateEducation' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Scholarship' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Employer/Bus Name'>"+
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
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+value[1]+"</span>"+
							"			<a data-value='"+value[1]+"' data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of School' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Degree Course' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Year Graduated' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Highest Grade' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance: "+value[5]+"</span>"+
							"			<a data-value='"+value[5]+"' data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+value[6]+"</span>"+
							"			<a data-value='"+value[6]+"' data-cmd='updateVocational' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Scholarship/Non Academics Honor Recieved' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
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
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Name Of School: "+value[1]+"</span>"+
							"			<a data-value='"+value[1]+"' data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Name Of School' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Degree Course: "+value[2]+"</span>"+
							"			<a data-value='"+value[2]+"' data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Degree Course' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Year Graduated: "+value[3]+"</span>"+
							"			<a data-value='"+value[3]+"' data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Year Graduated' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Highest Grade/Level/Units Earned: "+value[4]+"</span>"+
							"			<a data-value='"+value[4]+"' data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Highest Grade' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Inclusive Dates Of Attendance: "+value[5]+"</span>"+
							"			<a data-value='"+value[5]+"' data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Inclusive Dates' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>"+
							"		 <div class='divider'></div>"+
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Scholarship/Academics Honors Recieved: "+value[6]+"</span>"+
							"			<a data-value='"+value[6]+"' data-cmd='updateCollege' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Scholarship/Non Academics Honor Recieved' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
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
        		});

				content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_graduate'>Add</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#graduate").html(content);

				// employee.deactivate();
				// employee.activate();
				// employee.update();
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
        		});

				content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_civil'>Add</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#civil").html(content);

				// employee.deactivate();
				// employee.activate();
				// employee.update();
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

				content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_work'>Add</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#work").html(content);

				// employee.deactivate();
				// employee.activate();
				// employee.update();
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

        		content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_voluntary'>Add</a></br></br>"+
							"</div>"+
							"</div>";

        		
				$("#voluntary").html(content);

				// employee.deactivate();
				// employee.activate();
				// employee.update();
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

        		content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_training'>Add</a></br></br>"+
							"</div>"+
							"</div>";
        		
				$("#training").html(content);

				// employee.deactivate();
				// employee.activate();
				// employee.update();
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
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Special Skills/Hobbies: "+value[1]+"</span>"+
							"			<a data-value='"+value[1]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>";
        		});

        		content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_skills'>Add</a></br></br>"+
							"</div>"+
							"</div>";

        		
				$("#skills").html(content);

				// employee.deactivate();
				// employee.activate();
				// employee.update();
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
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Non-Academic Distinctions/Organization: "+value[1]+"</span>"+
							"			<a data-value='"+value[1]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>";
        		});

        		content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_nonAcademic'>Add</a></br></br>"+
							"</div>"+
							"</div>";

        		
				$("#non_academic").html(content);

				// employee.deactivate();
				// employee.activate();
				// employee.update();
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
							"        <p><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-social-school cyan-text text-darken-2'></i> Membership in Association/Organization: "+value[1]+"</span>"+
							"			<a data-value='"+value[1]+"' data-cmd='updateEmployee' data-name='"+data[0][4]+" "+data[0][5]+" "+data[0][3]+"' data-node='"+data[0][0]+"' data-node='"+data[0][0]+"' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update Surname'>"+
							"				<i class='mdi-editor-mode-edit right black-text'></i>"+
							"			</a>"+
							"		 </p>";
        		});

        		content += "<a class='btn waves-effect waves-light orange left' data-cmd='add_membership'>Add</a></br></br>"+
							"</div>"+
							"</div>";

        		
				$("#membership").html(content);

				// employee.deactivate();
				// employee.activate();
				// employee.update();
				// employee.updatePicture();

				$("a[data-cmd='add_membership']").on('click',function(){
					var data = system.xml("pages.xml");
					$(data.responseText).find("addMembership").each(function(i,content){
						console.log("Membership");
						$("#modal .modal-content").html(content);
						$('#modal').openModal('show');		
					    $("select").material_select();

						$("#form_addMembership").validate({
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
			else if(data.prop == "Inclusive Dates"){
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
								Materialize.toast('Inclusive Dates updated.',4000);
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
			else if(data.prop == "Dates"){
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
								Materialize.toast('Inclusive Dates updated.',4000);
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
			else if(data.prop == "Inclusive Dates"){
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
								Materialize.toast('Inclusive Dates updated.',4000);
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
			else if(data.prop == "Inclusive Dates"){
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
								Materialize.toast('Inclusive Dates updated.',4000);
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

}	