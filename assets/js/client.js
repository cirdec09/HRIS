client = {
	ini:function(){
		this.add();
	},
	add:function(){
		$("#get-started").on('click',function(){
			console.log('get-started');
			var data = system.xml("account/pages.xml");
			$(data.responseText).find("addEmployees").each(function(i,content){
				$("#modal .modal-content").html(content);
				$('#modal').openModal('show');			

				$("#form_addEmployees").validate({
				    rules: {
						// field_fname: {required: true,maxlength: 50},
						// field_gname: {required: true,maxlength: 50},
						// field_mname: {required: true,maxlength: 50},             
						// field_nickname: {required: true,maxlength: 50},
						// field_dob: {required: true,maxlength: 50,checkDate:true},
						// field_gender: {required: true,maxlength: 50},
						// field_phone: {required: true,maxlength: 50},
						// field_email: {required: true,maxlength: 100,checkEmail:true},
						// field_cstatus: {required: true,maxlength: 50},
						// field_citizenship: {required: true,maxlength: 30},
						// field_height: {required: true,maxlength: 30},
						// field_weight: {required: true,maxlength: 5},
						// field_btype: {required: true,maxlength: 30},
						// field_gsis: {required: true,maxlength: 20},
						// field_r_address: {required: true,maxlength: 50},
						// field_r_zipcode: {required: true,maxlength: 50},
						// field_r_tele: {required: true,maxlength: 50},
						// field_f_surename: {required: true,maxlength: 50},
						// field_f_firstname: {required: true,maxlength: 50},
						// field_f_middlename: {required: true,maxlength: 50},
						// field_m_surename: {required: true,maxlength: 50},
						// field_m_firstname: {required: true,maxlength: 50},
						// field_m_middlename: {required: true,maxlength: 50},
						// field_position: {required: true,maxlength: 50,},
						// field_employeeID: {required: true,maxlength: 50,validateEmployeeID:true},
						// // field_password: {required: true,maxlength: 50,},
				    },
				    errorElement : 'div',
				    errorPlacement: function(error, element) {
						var placement = $(element).data('error');
						if(placement){
							$(placement).append(error)
						} 
						else{
							error.insertAfter(element);
						}
					},
					submitHandler: function (form) {
					var _form = $(form).serializeArray();
					var data = system.ajax('assets/harmony/Process.php?set-newEmployees',_form);
					data.done(function(data){
						console.log(data);
						if(data == 0){
							Materialize.toast('Cannot process request.',4000);
						}
						else{
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
								// localStorage.setItem('id',data);	
							}
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
	}
}