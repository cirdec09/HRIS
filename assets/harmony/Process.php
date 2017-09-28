<?php
//secure this file
include("Functions.php");
session_start();
$function = new DatabaseClasses;

    if (isset($_GET['kill-session'])){
        print_r(session_destroy());
    }

	if(isset($_GET['chkConnection'])){
		print_r($function->chkConnection());
	}

	if(isset($_GET['chkUserLogin'])){
		if(isset($_SESSION['kaboom']))
			print_r($_SESSION['kaboom']);
		else
			print_r("0");
	}

	if(isset($_GET['restoreTablesFromFile'])){
		$data = $_POST['data'];
		print_r($data);
		$query = $function->PDO(false,$data);
		if($query->execute()){
			echo 1;
		}
		else{
			echo 0;
		}
	}

	if(isset($_GET['login'])){
		$data = $_POST['data'];
		$username = $data[0]['value'];
		$password = sha1($data[1]['value']);
		$date = new DateTime();
		$hash = $date->getTimestamp();
		$query = $function->PDO(true,"SELECT * FROM tbl_admin WHERE username = '{$username}' AND password = '{$password}'");
		if(count($query)>0){
			if($query[0][6] == 1){
				$_SESSION["kaboom"] = [$username,$password,$hash];
				print_r(json_encode(["Active","admin"]));
			}
			else{
				print_r(json_encode(["Deactivated",1]));
			}
		}
		else{
			$query = $function->PDO(true,"SELECT * FROM tbl_employee WHERE username = '{$username}' AND password = '{$password}'");
			if(count($query)>0){
				if($query[0][4] == 1){
					$_SESSION["kaboom"] = [$username,$password,$hash];
					print_r(json_encode(["Active","employee"]));
				}
				else{
					print_r(json_encode(["Deactivated",2]));
				}
			}
			else{
				print_r(json_encode(["Failed",2]));
			}
		}
	}

	if(isset($_GET['marketLogin'])){
		$data = $_POST['data'];
		$username = $data[0]['value'];
		$password = sha1($data[1]['value']);
		$date = new DateTime();
		$hash = $date->getTimestamp();
		$query = $function->PDO(true,"SELECT * FROM tbl_employees WHERE employee_id = '{$username}' AND password = '{$password}'");

		if(count($query)>0){
			if($query[0][15] == 0){
				print_r("Deactivated");				
			}
			else{
				$_SESSION["kaboom"] = [$username,$password,$hash];
				print_r("Active");				
			}
		}
		else{
			echo 0;
		}
	}

	if(isset($_GET['validatePassword'])){
		$data = $_POST['data'];
		$count = 0;
		$password = sha1($data);
		$query = $function->PDO(true,"SELECT count(*) FROM tbl_admin WHERE password = '{$password}'");
		$count = $count + $query[0][0];
		print_r($count);
	}

	if(isset($_GET['validateUsername'])){
		$data = $_POST['data'];
		$count = 0;
		$query = $function->PDO(true,"SELECT count(*) FROM tbl_admin WHERE username = '{$data}'");
		$count = $count + $query[0][0];
		print_r($count);
	}

	if(isset($_GET['validateEmployeeID'])){
		$data = $_POST['data'];
		$count = 0;
		$query = $function->PDO(true,"SELECT count(*) FROM tbl_employees WHERE employee_id = '{$data}'");
		$count = $count + $query[0][0];
		print_r($count);
	}

	if(isset($_GET['validateCompanyPoints'])){
		$data = $_POST['data'];
		$data = explode("-", $data);
		// print_r($data[0]);
		$query = $function->PDO(true,"SELECT * FROM tbl_pointbalance WHERE id = '{$data[0]}'");
		if(count($query)>0){
			print_r($query[0][1]);
		}
		else{
			echo 0;
		}
	}

	//getters
		if(isset($_GET['get-listAdmin'])){
			$data = $function->getAdmin();
			$query = $function->PDO(true,"SELECT * FROM tbl_admin WHERE id != '{$data}' ORDER BY status DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-listEmployeeAccount'])){
			$query = $function->PDO(true,"SELECT * FROM tbl_employee WHERE status = 1 ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-admin'])){
			$query = $function->PDO(true,"SELECT * FROM tbl_admin WHERE username = '{$_SESSION['kaboom'][0]}' AND password = '{$_SESSION['kaboom'][1]}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-employeeAccount'])){
			$query = $function->PDO(true,"SELECT * FROM tbl_employee ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-myAccount'])){
			$query = $function->PDO(true,"SELECT * FROM tbl_employee WHERE username = '{$_SESSION['kaboom'][0]}' AND password = '{$_SESSION['kaboom'][1]}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-employeePoints'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_points WHERE id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-employeePointsAdmin'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_points WHERE id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-employeePointsActivityAdmin'])){
			$data = $_POST['data'];
			$info = $function->PDO(true,"SELECT * FROM tbl_employees WHERE id = '{$data}'");
			$employer_id = $info[0][2];
			$employee_id = $info[0][1];

			$query = $function->PDO(true,"SELECT * FROM tbl_pointsactivity WHERE id LIKE '{$employer_id}_%' AND employee_id = '{$info[0][1]}' ORDER BY date DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-employeeBuysActivityAdmin'])){
			$data = $_POST['data'];
			$info = $function->PDO(true,"SELECT * FROM tbl_employees WHERE id = '{$data}'");
			$employer_id = $info[0][2];
			$employee_id = $info[0][0];

			$query = $function->PDO(true,"SELECT * FROM tbl_orders WHERE employee_id = '{$employee_id}' ORDER BY order_date DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-employerAccount'])){
			$query = $function->PDO(true,"SELECT * FROM tbl_employer WHERE username = '{$_SESSION['kaboom'][0]}' AND password = '{$_SESSION['kaboom'][1]}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-products'])){
			$query = $function->PDO(true,"SELECT * FROM tbl_product WHERE qty>0 AND status = 1 ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-productDetails'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_product WHERE id = '{$data}'");

			print_r(json_encode($query));
		}

		if(isset($_GET['get-employeeAccounttDetails'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_employee WHERE id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-orders'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_orderdetails LEFT JOIN tbl_product ON tbl_orderdetails.product_id = tbl_product.id WHERE tbl_orderdetails.order_id = '{$data}' ORDER BY `order_date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-clients'])){
			$query = $function->PDO(true,"SELECT * FROM tbl_department WHERE status = 1 ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-clientDetails'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_department WHERE id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-employees'])){
			$user = $function->getUser();
			$query = $function->PDO(true,"SELECT * FROM tbl_employees WHERE employer_id = '{$user}' AND status = 1 ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-employee'])){
			$user = $function->getUser();
			$query = $function->PDO(true,"SELECT * FROM tbl_employees WHERE status = 1 ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		// if(isset($_GET['get-employeeDetails'])){
		// 	$data = $_POST['data'];
		// 	$query = $function->PDO(true,"SELECT * FROM tbl_employees INNER JOIN tbl_family ON tbl_employees.id = tbl_family.id ");
		// 	print_r(json_encode($query));
		// }

		if(isset($_GET['get-employeeDetails'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_employees WHERE id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-family'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_family WHERE id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-child'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_child WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-education'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_education WHERE id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-college'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_college WHERE id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-graduate'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_graduate WHERE id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-civil'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_civil WHERE id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-work'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_work WHERE id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-voluntary'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_voluntary WHERE id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-training'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_training WHERE id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-other'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_other WHERE id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-department'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_other WHERE id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-allEmployee'])){
			$query = $function->PDO(true,"SELECT * FROM tbl_employees WHERE status = 1 ORDER BY employer_id ASC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-allEmployeeCount'])){
			$query = $function->PDO(true,"SELECT COUNT(*),company_id FROM tbl_employees GROUP BY company_id");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-employerByID'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_employer WHERE company_id = '{$data}' ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-companyByID'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_department WHERE id = '{$data}' ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-companyPointsBalance'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_pointbalance WHERE id = '{$data}'");
			if(count($query)>0){
				print_r(json_encode($query));
			}	
			else{
				$queryInsert = $function->PDO(false,"INSERT INTO tbl_pointbalance(id,balance,reset,status) VALUES ('{$data}',100,100,1)");
				if($queryInsert->execute()){
					$log = $function->log("Points Balance","admin","Added point balance to ".$data);
					$query = $function->PDO(true,"SELECT * FROM tbl_pointbalance WHERE id = '{$data}'");
					print_r(json_encode($query));
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['get-employeeByID'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_employees WHERE company_id = '{$data}' ORDER BY company_id");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-confirmByID'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_accountconfirmation WHERE company_id = '{$data}'AND sent = 0 ORDER BY company_id");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-validateConfirmStatus'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT COUNT(*) FROM tbl_accountconfirmation WHERE id = '{$data}' ORDER BY company_id");
			print_r($query[0][0]);
		}

		if(isset($_GET['get-confirmStatus'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT COUNT(*) FROM tbl_accountconfirmation WHERE company_id = '{$data}' AND sent = 0 ORDER BY company_id");
			print_r($query[0][0]);
		}

		if(isset($_GET['get-searchByEmployeeID'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_employees WHERE id = '{$data}' AND status = 1 ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-confirmAccountStatus'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_accountconfirmation WHERE company_id = '{$data}' AND sent = 0 ORDER BY company_id");
			$email = $query[0][4];
	        $subject =  "Kaboom Rewards - Account confirmation";
	        $message = "<div style='margin:0 auto; padding:20px; text-align:center;font-family:helvetica neue,helvetica,arial,sans-serif; width:500px; border:dashed 1px #ccc;'>
				            <h1>Welcome!</h1>
				            <p>Before we get started...</p>
				            <p>Please take a second to make sure we’ve got your email right.</p>
				            <a href='http://myrewards.rnrdigitalconsultancy.com/account/confirm.html#".$query[0][0]."&".$query[0][1]."&".$query[0][2]."' style='font-family:helvetica neue,helvetica,arial,sans-serif;font-weight:bold;font-size:18px;line-height:22px;color:#ffffff;text-decoration:none;display:block;text-align:center;max-width:400px;overflow:hidden;text-overflow:ellipsis;background: #f00480;padding: 10px;margin: 0 auto;border-radius: 2px;' target='_blank'>
				                Confirm your email
				            </a><br/><br/><br/>
				            <a style='font-size: 10px; color:#333' href='http://myrewards.rnrdigitalconsultancy.com/account/confirm.html#".$query[0][0]."&".$query[0][1]."&".$query[0][2]."'>Confirmation button isn't working? Click here</a>
				        </div>";

			$mail = $function->mail($email.', rufo.gabrillo@gmail.com, info@rnrdigitalconsultancy.com',$subject,$message);
			if($mail == 1){
				$queryUpdate = $function->PDO(false,"UPDATE tbl_accountconfirmation SET sent = '1' WHERE id = '{$query[0][0]}';");
				if($queryUpdate->execute()){
					$log = $function->log2($query[0][0],"Employee account confirmation sent.","Account Confirmation");
					print_r(count($query)-1);
				}
			}
		}

	//setters
		if(isset($_GET['set-newAdmin'])){
	        $id = $function->PDO_IDGenerator('tbl_admin','id');
			$date = $function->PDO_DateAndTime();
			$data = $_POST['data'];

			$password = sha1($data[3]['value']);
			$query = $function->PDO(false,"INSERT INTO tbl_admin(id,name,username,password,capabilities,email,status,`date`,picture) VALUES ('{$id}','{$data[0]['value']}','{$data[2]['value']}','{$password}','Administrator','{$data[1]['value']}','1','{$date}','avatar.jpg')");
			if($query->execute()){
				$log = $function->log("add","admin","Added admin with an ID of ".$id);
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newEmployeeAccount'])){
	        $id = $function->PDO_IDGenerator('tbl_employee','id');
			$date = $function->PDO_DateAndTime();
			$data = $_POST['data'];

			$password = sha1($data[2]['value']);
			$query = $function->PDO(false,"INSERT INTO tbl_employee(id,name,username,password,status,`date`) VALUES ('{$id}','{$data[0]['value']}','{$data[1]['value']}','{$password}','1','{$date}')");
			if($query->execute()){
				$log = $function->log("add","employee account","Added employee account with an ID of ".$id);
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newProductAdmin'])){
			$data = $_POST['data'];
	        $id = $function->PDO_IDGenerator('tbl_product','id');
			$date = $function->PDO_DateAndTime();

			$user = $function->getAdmin();
			$query = $function->PDO(false,"INSERT INTO tbl_product(id,product_name,qty,price,category,description,image,status,`date`,addedby,lastupdateby) VALUES ('{$id}','{$data[0]['value']}','{$data[1]['value']}','{$data[2]['value']}','{$data[4]['value']}','{$data[3]['value']}','default.jpg','0','{$date}','{$user}','{$user}')");
			if($query->execute()){
				$function->log("add",$user,"Added product with an ID of ".$id);
				echo json_encode([1,$id]);
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}	

	// if(isset($_GET['set-newClient'])){
	// 		$data = $_POST['data'];
	//         $companyID = $function->PDO_IDGenerator('tbl_department','id');
	// 		$date = $function->PDO_DateAndTime();
	// 	    $id = $companyID.'-0';
	// 		$password = sha1($data[8]['value']);

	// 		$query = $function->PDO(false,"INSERT INTO tbl_department(id,company_name,address,email,contact_number,logo,status,`date`) VALUES ('{$companyID}','{$data[0]['value']}','{$data[3]['value']}','{$data[2]['value']}','{$data[1]['value']}','logo.png','1','{$date}'); INSERT INTO tbl_employer(id,company_id,name,email,constact_number,picture,username,password,status,`date`) VALUES ('{$id}','{$companyID}','{$data[4]['value']}','{$data[6]['value']}','{$data[5]['value']}','avatar.png','{$data[7]['value']}','{$password}','1','{$date}')");
	// 		if($query->execute()){
	// 			$function->log("add","Admin","Added employer with an id of \'".$id."\' in tbl_employer.");
	// 			echo 1;
	// 		}
	// 		else{
	// 			$Data = $query->errorInfo();
	// 			print_r($Data);
	// 		}
	// 	}
		if(isset($_GET['set-newClient'])){
			$data = $_POST['data'];
	        $companyID = $function->PDO_IDGenerator('tbl_department','id');
			$date = $function->PDO_DateAndTime();
		    $id = $companyID.'-0';
			$password = sha1($data[3]['value']);

			$query = $function->PDO(false,"INSERT INTO tbl_department(id,company_name,address,email,contact_number,logo,status,`date`) VALUES ('{$companyID}','{$data[0]['value']}','{$data[3]['value']}','{$data[2]['value']}','{$data[1]['value']}','logo.png','1','{$date}')");
			if($query->execute()){
				$function->log("add","Admin","Added employer with an id of \'".$id."\' in tbl_employer.");
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newFamily'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_family(id,s_surename,s_firstname,s_middlename,s_occupation,s_employer,s_business,s_tele,f_surename,f_firstname,f_middlename,m_surename,m_firstname,m_middlename) VALUES ('{$id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}','{$data[0][6]['value']}','{$data[0][7]['value']}','{$data[0][8]['value']}','{$data[0][9]['value']}','{$data[0][10]['value']}','{$data[0][11]['value']}','{$data[0][12]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newEducation'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_education(id,e_name,e_degree,e_year,e_grade,e_dates,e_scholar,s_name,s_degree,s_year,s_grade,s_dates,s_scholar,v_name,v_degree,v_year,v_grade,v_dates,v_scholar) VALUES ('{$id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}','{$data[0][6]['value']}','{$data[0][7]['value']}','{$data[0][8]['value']}','{$data[0][9]['value']}','{$data[0][10]['value']}','{$data[0][11]['value']}','{$data[0][12]['value']}','{$data[0][13]['value']}','{$data[0][14]['value']}','{$data[0][15]['value']}','{$data[0][16]['value']}','{$data[0][17]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newCollege'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_college(id,name,degree,year,grade,dates,scholar) VALUES ('{$id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newGraduate'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_graduate(id,name,degree,year,grade,dates,scholar) VALUES ('{$id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newChild'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$employee_id = $data[1];
			$id = $function->PDO_IDGenerator('tbl_child','id');
			
			$query = $function->PDO(false,"INSERT INTO tbl_child(id,employee_id,child,dob) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newCivilService'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_civil(id,career,rating,doe,place,l_number,dor) VALUES ('{$id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}		
		if(isset($_GET['set-newWork'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_work(id,inclusive_date,position,department,monthly_salary,salary_grade,appointment,service) VALUES ('{$id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}','{$data[0][6]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newVoluntary'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_voluntary(id,name,inclusive_date,hours,position) VALUES ('{$id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newTraining'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_training(id,title,inclusive_date,hours,conducted) VALUES ('{$id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newOther'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_other(id,skills,academic,membership) VALUES ('{$id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}
		
		if(isset($_GET['set-newEmployees'])){
			$data = $_POST['data'];
			print_r($data);
			$date = $function->PDO_DateAndTime();
			$user = 'data';
	        $id = $function->PDO_IDGenerator('tbl_employees','id');
			
			
			$query = $function->PDO(false,"INSERT INTO tbl_employees(id,employee_id,company_id,family_name,given_name,middle_name,nickname,gender,date_of_birth,contact_number
				,picture,position,status,`date`,cstatus,citizenship,height,weight,btype,gsis,pagibig,philhealth,sss,r_address,r_zipcode,r_tele,p_address,p_zipcode,p_tele,email_address,agency_num,tin) VALUES ('{$id}','{$data[26]['value']}','{$data[27]['value']}','{$data[0]['value']}','{$data[1]['value']}','{$data[2]['value']}','{$data[3]['value']}','{$data[5]['value']}','{$data[4]['value']}','{$data[6]['value']}','avatar.png','{$data[25]['value']}','1','{$date}','{$data[7]['value']}','{$data[8]['value']}','{$data[9]['value']}','{$data[10]['value']}','{$data[11]['value']}','{$data[12]['value']}','{$data[13]['value']}','{$data[14]['value']}','{$data[15]['value']}','{$data[16]['value']}','{$data[17]['value']}','{$data[18]['value']}','{$data[19]['value']}','{$data[20]['value']}','{$data[21]['value']}','{$data[22]['value']}','{$data[23]['value']}','{$data[24]['value']}')");
			if($query->execute()){
					echo $id;
			}
			else{
				$Data = $query->errorInfo();
				echo 0;
			}
		}

		if(isset($_GET['set-newEmployee'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$user = $data[1];
	        $id = $function->PDO_IDGenerator('tbl_employees','id');
			// $password = sha1($data[0][27]['value']);
			
			$query = $function->PDO(false,"INSERT INTO tbl_employees(id,employee_id,company_id,family_name,given_name,middle_name,nickname,gender,date_of_birth,contact_number
				,picture,position,status,`date`,cstatus,citizenship,height,weight,btype,gsis,pagibig,philhealth,sss,r_address,r_zipcode,r_tele,p_address,p_zipcode,p_tele,email_address,agency_num,tin) VALUES ('{$id}','{$data[0][26]['value']}','{$user}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][5]['value']}','{$data[0][4]['value']}','{$data[0][6]['value']}','avatar.jpg','{$data[0][25]['value']}','1','{$date}','{$data[0][7]['value']}','{$data[0][8]['value']}','{$data[0][9]['value']}','{$data[0][10]['value']}','{$data[0][11]['value']}','{$data[0][12]['value']}','{$data[0][13]['value']}','{$data[0][14]['value']}','{$data[0][15]['value']}','{$data[0][16]['value']}','{$data[0][17]['value']}','{$data[0][18]['value']}','{$data[0][19]['value']}','{$data[0][20]['value']}','{$data[0][21]['value']}','{$data[0][22]['value']}','{$data[0][23]['value']}','{$data[0][24]['value']}']}')");
			if($query->execute()){
					echo $id;
			}
			else{
				$Data = $query->errorInfo();
				echo 0;
			}
		}	

		if(isset($_GET['set-newBulkEmployee'])){
			$q1 = ""; $count = 0;
			$date = $function->PDO_DateAndTime();
			$user = $function->getUser();
			$numEmployees = $function->PDO(true,"SELECT * FROM tbl_employees WHERE company_id = '{$user}'");
			$count = count($numEmployees);

			$data = $_POST['data'];
			$data = json_decode($data);

			foreach ($data as $key => $value) {
				$dob = date("m/j/Y",strtotime($value[3]));
				$email = (count($value)>5)?$function->escape($value[5]):"";
		        $id = $user.'-'.($count++);
		        $password = sha1($id);
		        if((count($data)-1) <= $key){
					$q1 .= "('{$id}',{$function->escape($value[0])},'{$user}','{$password}',{$function->escape($value[2])},{$function->escape($value[1])},{$function->escape($value[4])},'{$dob}',{$email},'1','{$date}')";
		        }
		        else{
					$q1 .= "('{$id}',{$function->escape($value[0])},'{$user}','{$password}',{$function->escape($value[2])},{$function->escape($value[1])},{$function->escape($value[4])},'{$dob}',{$email},'1','{$date}'),";
		        }
			}

			$log = $function->log("add",$user,"adding bulk employee in tbl_employer.");

			$query = $function->PDO(false,"INSERT INTO  tbl_employees(id,employee_id,employer_id,password,family_name,given_name,gender,date_of_birth,email_address,status,`date`) VALUES".$q1);
			if($query->execute()){
				$function->log($log,$user,"Added ".(count($data))." employee in tbl_employer.");
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}	

		if(isset($_GET['set-newBulkEmployeeAdmin'])){
			$q1 = ""; $q2 = "";
			$date = $function->PDO_DateAndTime();
			$data = $_POST['data'];
			$user = $data[1];

			$numEmployees = $function->PDO(true,"SELECT COUNT(*) FROM tbl_employees WHERE company_id = '{$user}';");
			$count = $numEmployees[0][0];
			$data = json_decode($data[0]);

			foreach ($data as $key => $value) {
				$dob = date("m/j/Y",strtotime($value[3]));
				$email = (count($value)>5)?$function->escape($value[5]):"";
		        $id = $user.'-'.($count++);
		        $password = sha1($id);
				$points = $function->PDO(true,"SELECT * FROM tbl_points WHERE employee_id = {$function->escape($value[0])} AND company_id = '{$user}';");
		        if((count($data)-1) <= $key){
					$q1 .= "('{$id}',{$function->escape($value[0])},'{$user}','{$password}',{$function->escape($value[2])},{$function->escape($value[1])},{$function->escape($value[4])},'{$dob}',{$email},1,'{$date}')";
					if(count($points)==0){
						$q2 .= "('{$id}',{$function->escape($value[0])},'{$user}',0)";
					}
		        }
		        else{
					$q1 .= "('{$id}',{$function->escape($value[0])},'{$user}','{$password}',{$function->escape($value[2])},{$function->escape($value[1])},{$function->escape($value[4])},'{$dob}',{$email},1,'{$date}'),";
					if(count($points)==0){
						$q2 .= "('{$id}',{$function->escape($value[0])},'{$user}',0),";
					}
		        }
			}

			$query = $function->PDO(false,"INSERT INTO tbl_employees(id,empolyee_id,company_id,password,family_name,given_name,gender,date_of_birth,email_address,status,`date`) VALUES".$q1.";");
			if($query->execute()){
				$query2 = $function->PDO(false,"INSERT INTO tbl_points(id,employee_id,company_id,points) VALUES".$q2.";");
				if($query2->execute()){
					$log = $function->log("add","Admin","Added ".(count($data))." employee in tbl_employer.");
					echo 1;
				}
				else{
					$query3 = $function->PDO(false,"DELETE tbl_employees WHERE company_id = '{$user}';");
					echo 0;
					$Data = $query2->errorInfo();
					print_r($Data);
				}
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}	

		if(isset($_GET['set-BulkEmployee'])){
			$q1 = ""; $q2 = "";
			$date = $function->PDO_DateAndTime();
			$data = $_POST['data'];
			$company_id = $data[1];

			$numEmployees = $function->PDO(true,"SELECT COUNT(*) FROM tbl_employees WHERE company_id = '{$company_id}';");
			$count = $numEmployees[0][0];
			$data = json_decode($data[0]);

			foreach ($data as $key => $value) {
				$dob = date("m/j/Y",strtotime($value[3]));
				$email = (count($value)>5)?strtolower($function->escape($value[5])):"";
		        $id = $company_id.'-'.($count++);
		        $password = sha1($id);
		        if((count($data)-1) <= $key){
					$q1 .= "('{$id}',{$function->escape($value[0])},'{$company_id}',{$function->escape($value[2])},{$email},'',0)";
		        }
		        else{
					$q1 .= "('{$id}',{$function->escape($value[0])},'{$company_id}',{$function->escape($value[2])},{$email},'',0),";
		        }
			}

			$query = $function->PDO(false,"INSERT INTO tbl_accountconfirmation(id,employee_id,company_id,name,email,meta_data,sent) VALUES".$q1.";");
			if($query->execute()){
				$log = $function->log("Add Employees","Admin","Added ".(count($data))." employees to company with an id "+$company_id);
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}	

		if(isset($_GET['set-uploadPointsAdmin'])){
			$q1 = "";$q2 = "";
			$date = $function->PDO_DateAndTime();
			$data = $_POST['data'];
			$user = $data[1];
			$numEmployees = $function->PDO(true,"SELECT COUNT(*) FROM tbl_pointsactivity");
			$count = $numEmployees[0][0];

			$data = json_decode($data[0]);

			foreach($data as $key => $value){
				$points = (int)$value[3];
		        $id = $user.'-'.($count++);
				$email = (count($value)>5)?$function->escape($value[2]):"";

				$currentPoints = $function->PDO(true,"SELECT * FROM tbl_points WHERE employee_id = {$function->escape($value[0])};");
				$newpoints = ((count($currentPoints)>0)?$currentPoints[0][2]:0)+$points;

				$q1 .= "UPDATE tbl_points SET points = '{$newpoints}' WHERE employee_id = {$function->escape($value[0])} AND company_id = '{$user}';";
		        if((count($data)-1) <= $key){
					$q2 .= "('{$id}','{$points}','admin',{$function->escape($value[0])},'{$date}','')";
		        }
		        else{
					$q2 .= "('{$id}','{$points}','admin',{$function->escape($value[0])},'{$date}',''),";
		        }
			}

			$query = $function->PDO(false,$q1);
			if($query->execute()){
				$query2 = $function->PDO(false,"INSERT INTO tbl_pointsactivity(id,points,addedby,employee_id,`date`,remarks) VALUES".$q2);
				if($query2->execute()){
					$log = $function->log("add","admin","adding bulk points employees");
					echo 1;
				}
				else{
					$Data = $query2->errorInfo();
					print_r($Data);
				}
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}	

		if(isset($_GET['set-addPointsAdmin'])){
			$date = $function->PDO_DateAndTime();
			$data = $_POST['data'];
			$employee_id = $data[1];
			$quantity = $function->PDO(true,"SELECT COUNT(*) FROM tbl_pointsactivity");
			$count = $quantity[0][0];
			$points = (int)$data[0][0]['value'];
			$currentPoints = $function->PDO(true,"SELECT * FROM tbl_points WHERE id = '{$employee_id}';");
			$newpoints = $currentPoints[0][2]+$points;
	        $id = $currentPoints[0][3].'-'.($count+1);

			$query = $function->PDO(false,"UPDATE tbl_points SET points = '{$newpoints}' WHERE id = '{$employee_id}' AND company_id = '{$currentPoints[0][3]}';");
			if($query->execute()){
				$query2 = $function->PDO(false,"INSERT INTO tbl_pointsactivity(id,points,addedby,employee_id,`date`,remarks) VALUES('{$id}','{$points}','admin','{$currentPoints[0][1]}','{$date}','{$data[0][1]['value']}')");
				if($query2->execute()){
					$log = $function->log("add","admin","adding '{$points}' points employees");
					echo 1;
				}
				else{
					$Data = $query2->errorInfo();
					print_r($Data);
				}
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}	

		if(isset($_GET['set-orders'])){
			$q1 = ""; $q2 = ""; $q3 = ""; $points = 0; $spent = 0;
			$data = $_POST['data'];
			$user = $function->getEmployee();
			$date = $function->PDO_DateAndTime();
	        $orderID = $function->PDO_IDGenerator('tbl_orders','id');
			$numProd = $function->PDO(true,"SELECT COUNT(*) FROM tbl_orderdetails");
			$count = $numProd[0][0];

			foreach ($data as $key => $value) {
				$qty = $value[1][1];
				$points = $points + $qty;
		        $id = $user.'-'.($count++);
				$prodQty = $function->PDO(true,"SELECT * FROM tbl_product WHERE id = '{$value[1][0]}';");
				$_prodQty = $prodQty[0][2]-$qty;

				$spent = $spent + $prodQty[0][3] * $qty;

		        if((count($data)-1) <= $key){
					$q1 .= "('{$id}',{$qty},'{$value[1][0]}','{$orderID}','{$date}','',1)";
					$q2 .= "UPDATE tbl_product SET qty = '{$_prodQty}' WHERE id = '{$value[1][0]}'";
		        }
		        else{
					$q1 .= "('{$id}',{$qty},'{$value[1][0]}','{$orderID}','{$date}','',1),";
					$q2 .= "UPDATE tbl_product SET qty = '{$_prodQty}' WHERE id = '{$value[1][0]}'";
		        }
			}

			$currentPoints = $function->PDO(true,"SELECT * FROM tbl_points WHERE id = '{$user}';");
			$newpoints = $currentPoints[0][2]-$spent;
			if($newpoints>=0){
				$query = $function->PDO(false,"INSERT INTO tbl_orders(id,employee_id,order_date,date_delivered,status) VALUES ('{$orderID}','{$user}','{$date}','',1); INSERT INTO tbl_orderdetails(id,qty,product_id,order_id,order_date,order_delivered,status) VALUES ".$q1.";".$q2.";");
				if($query->execute()){
					$_query = $function->PDO(false,"UPDATE tbl_points SET points = '{$newpoints}' WHERE id = '{$user}';");
					if($_query->execute()){
						$log = $function->log("add",$user,"Placed orders. Order ID: "+$orderID);
						echo 1;
					}
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else{
				echo 2;
			}
		}

		if(isset($_GET['set-newPendingEmployee'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$user = $data[1];
			$numEmployees = $function->PDO(true,"SELECT COUNT(*) FROM tbl_employees WHERE company_id = '{$user}';");
			$count = $numEmployees[0][0];
		    $id = $user.'-'.($count++);
			$password = sha1($data[0][11]['value']);
			
			$query = $function->PDO(false,"INSERT INTO tbl_employees(id,employee_id,company_id,family_name,given_name,middle_name,nickname,gender,date_of_birth,contact_number,	email_address,address,picture,position,password,status,`date`) VALUES ('{$id}','{$data[0][10]['value']}','{$user}','{$data[0][2]['value']}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][3]['value']}','{$data[0][5]['value']}','{$data[0][4]['value']}','{$data[0][7]['value']}','{$data[0][8]['value']}','{$data[0][6]['value']}','avatar.jpg','{$data[0][9]['value']}','{$password}','2','{$date}')");
			if($query->execute()){
				$query2 = $function->PDO(false,"INSERT INTO tbl_points(id,employee_id,company_id,points) VALUES ('{$id}',{$function->escape($data[0][10]['value'])},'{$user}',0)");
				if($query2->execute()){
					$function->log("add","Employer","Added employee with an id of \'".$id."\' in tbl_employees.");
					echo 1;
				}
				else{
					$query3 = $function->PDO(false,"DELETE tbl_employees WHERE id = '{$id}';");
					echo 0;
					$Data = $query2->errorInfo();
					print_r($Data);
				}
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}	

		if(isset($_GET['set-newPendingEmployee'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$user = $data[1];
			$numEmployees = $function->PDO(true,"SELECT COUNT(*) FROM tbl_employees WHERE company_id = '{$user}';");
			$count = $numEmployees[0][0];
		    $id = $user.'-'.($count++);
			$password = sha1($data[0][11]['value']);
			
			$query = $function->PDO(false,"INSERT INTO tbl_employees(id,employee_id,company_id,family_name,given_name,middle_name,nickname,gender,date_of_birth,contact_number,	email_address,address,picture,position,password,status,`date`) VALUES ('{$id}','{$data[0][10]['value']}','{$user}','{$data[0][2]['value']}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][3]['value']}','{$data[0][5]['value']}','{$data[0][4]['value']}','{$data[0][7]['value']}','{$data[0][8]['value']}','{$data[0][6]['value']}','avatar.jpg','{$data[0][9]['value']}','{$password}','2','{$date}')");
			if($query->execute()){
				$query2 = $function->PDO(false,"INSERT INTO tbl_points(id,employee_id,company_id,points) VALUES ('{$id}',{$function->escape($data[0][10]['value'])},'{$user}',0)");
				if($query2->execute()){
					$function->log("add","Employer","Added employee with an id of \'".$id."\' in tbl_employees.");
					echo 1;
				}
				else{
					$query3 = $function->PDO(false,"DELETE tbl_employees WHERE id = '{$id}';");
					echo 0;
					$Data = $query2->errorInfo();
					print_r($Data);
				}
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}	

		if(isset($_GET['set-addPendingPointsAdmin'])){
	        $id = $function->PDO_IDGenerator('tbl_request','id');
			$date = $function->PDO_DateAndTime();
			$user = $function->getUser();
			$data = $_POST['data'];
			$_id = explode("-", $data[1]);
			$query = $function->PDO(true,"SELECT * FROM tbl_pointbalance WHERE id = '{$_id[0]}'");

			if($query[0][1]>=$data[0][0]['value']){
				$newBalance = (int)$query[0][1] - (int)$data[0][0]['value'];
				$query2 = $function->PDO(false,"INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Add Points','{$user}','{$data[1]}','{$data[0][0]['value']}','{$data[0][1]['value']}','0','{$date}'); UPDATE tbl_pointbalance SET balance = '{$newBalance}' WHERE id = '{$_id[0]}'");
				if($query2->execute()){
					$log = $function->log2($data[1],"Added points to "+$data[1]+"Waiting for admin's confirmation.","Points");
					echo 1;
				}
				else{
					$Data = $query2->errorInfo();
					print_r($Data);
				}
			}
			else{
				echo 0;
			}
		}

		if(isset($_GET['set-addPendingPointsEmployer'])){
	        $id = $function->PDO_IDGenerator('tbl_request','id');
			$date = $function->PDO_DateAndTime();
			$user = $function->getUser();
			$data = $_POST['data'];
			$_id = explode("-", $data[1]);
			$query = $function->PDO(true,"SELECT * FROM tbl_pointbalance WHERE id = '{$_id[0]}'");

			if($query[0][1]>=$data[0][0]['value']){
				$newBalance = (int)$query[0][1] - (int)$data[0][0]['value'];
				$query2 = $function->PDO(false,"INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Add Points','{$user}','{$data[1]}','{$data[0][0]['value']}','{$data[0][1]['value']}','0','{$date}'); UPDATE tbl_pointbalance SET balance = '{$newBalance}' WHERE id = '{$_id[0]}'");
				if($query2->execute()){
					$log = $function->log2($data[1],"Added points to "+$data[1]+"Waiting for admin's confirmation.","Points");
					echo 1;
				}
				else{
					$Data = $query2->errorInfo();
					print_r($Data);
				}
			}
			else{
				echo 0;
			}
		}

		if(isset($_GET['set-confirmEmployeeAccount'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$tempAccount = $function->PDO(true,"SELECT * FROM tbl_accountconfirmation WHERE id = '{$data[1]}'");

			$user = $function->escape($data[1]);
			$company_id = $tempAccount[0][2];
			$employee_id = $tempAccount[0][1];
			$email = $function->escape($tempAccount[0][4]);
			$password = sha1($data[0][8]['value']);
			$numEmployees = $function->PDO(true,"SELECT COUNT(*) FROM tbl_employees WHERE company_id = '{$company_id}';");
			$count = $numEmployees[0][0];
		    $id = $company_id.'-'.($count++);

			$query = $function->PDO(false,"INSERT INTO tbl_employees(id,employee_id,company_id,family_name,given_name,middle_name,nickname,gender,date_of_birth,contact_number,	email_address,address,picture,position,password,status,`date`) VALUES ('{$id}','{$employee_id}','{$company_id}',{$function->escape($data[0][0]['value'])},{$function->escape($data[0][1]['value'])},{$function->escape($data[0][2]['value'])},{$function->escape($data[0][3]['value'])},{$function->escape($data[0][4]['value'])},{$function->escape($data[0][5]['value'])},{$function->escape($data[0][7]['value'])},{$email},{$function->escape($data[0][6]['value'])},'avatar.jpg','Employee','{$password}','1','{$date}'); INSERT INTO tbl_points(id,employee_id,company_id,points) VALUES ('{$id}','{$employee_id}','{$company_id}',0); DELETE FROM tbl_accountconfirmation WHERE id = '{$data[1]}'");
			if($query->execute()){
				$function->log("Confirmation",$id,"Confirmed account");
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

    // update
		if(isset($_GET['update-admin'])){
			$data = $_POST['data'];
			$user = $function->getAdmin();
			$session = $_SESSION['kaboom'];
			if($data[0]['name'] == "field_Name"){
				$name = $data[0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_admin SET name = '{$name}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Name is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[0]['name'] == "field_Email"){
				$email = $data[0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_admin SET email = '{$email}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Email Updated","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[0]['name'] == "field_Username"){
				$username = $data[0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_admin SET username = '{$username}' WHERE id = '{$user}';");
				if($query->execute()){
					$_SESSION["kaboom"] = [$username,$session[1],$session[2]];
					$log = $function->log2($user,"Username Updated","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[0]['name'] == "field_Password"){
				$password = sha1($data[0]['value']);
				$query = $function->PDO(false,"UPDATE tbl_admin SET password = '{$password}' WHERE id = '{$user}';");
				if($query->execute()){
					$_SESSION["kaboom"] = [$session[0],$password,$session[2]];
					$log = $function->log2($user,"Password updated","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-employeeAccount'])){
			$data = $_POST['data'];
			$user = $data[0];

			if($data[1][0]['name'] == "field_Name"){
				$name = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employee SET name = '{$name}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Name is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Username"){
				$username = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employee SET username = '{$username}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Username Updated","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Password"){
				$password = sha1($data[1][0]['value']);
				$query = $function->PDO(false,"UPDATE tbl_employee SET password = '{$password}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Password updated","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-adminPicture'])){
			$data = $_POST['data'];
			$user = $function->getAdmin();
			$session = $_SESSION['kaboom'];
			$picture = $function->saveImage($user,$data[1]);
			$query = $function->PDO(false,"UPDATE tbl_admin SET picture = '{$picture}' WHERE id = '{$user}';");
			if($query->execute()){
				$log = $function->log2($user,"Picture is updated to {$picture}.","Update");
				echo 1;
			}
			else{
				unlink('../images/profile/'.$picture);
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['update-company'])){
			$data = $_POST['data'];
			$user = $data[0];

			if($data[1][0]['name'] == "field_Name"){
				$name = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_department SET company_name = '{$name}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Name is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Email"){
				$email = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_department SET email = '{$email}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Email is updated to {$email}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Phone"){
				$phone = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_department SET contact_number = '{$phone}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Phone is updated to {$phone}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-employer'])){
			$data = $_POST['data'];
			$user = $data[0];

			if($data[1][0]['name'] == "field_Name"){
				$name = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employer SET name = '{$name}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Name is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Email"){
				$email = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employer SET email = '{$email}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Email is updated to {$email}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Username"){
				$username = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employer SET username = '{$username}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Username is updated to {$username}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Phone"){
				$phone = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employer SET constact_number = '{$phone}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Phone is updated to {$phone}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-employerProfile'])){
			$data = $_POST['data'];
			$user = $data[0];
			$session = $_SESSION['kaboom'];
			// print_r($data);
			// print_r($session);

			if($data[1][0]['name'] == "field_Username"){
				$username = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employer SET username = '{$username}' WHERE id = '{$user}';");
				if($query->execute()){
					$_SESSION["kaboom"] = [$username,$session[1],$session[2]];
					$log = $function->log2($user,"Username is updated to {$username}.","Update");
					echo 1;
				}                         
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Password"){
				$password = sha1($data[1][0]['value']);
				$query = $function->PDO(false,"UPDATE tbl_employer SET password = '{$password}' WHERE id = '{$user}';");
				if($query->execute()){
					$_SESSION["kaboom"] = [$session[0],$password,$session[2]];
					$log = $function->log2($user,"Password updated","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-employerPicture'])){
			$data = $_POST['data'];
			$user = $data[0];

			$picture = $function->saveImage($user,$data[1]);
			$query = $function->PDO(false,"UPDATE tbl_employer SET picture = '{$picture}' WHERE id = '{$user}';");
			if($query->execute()){
				$log = $function->log2($user,"Picture is updated to {$picture}.","Update");
				echo 1;
			}
			else{
				unlink('../images/profile/'.$picture);
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['update-employerCompanyLogo'])){
			$data = $_POST['data'];
			$user = $data[0];

			$picture = $function->saveImage($user,$data[1]);
			$query = $function->PDO(false,"UPDATE tbl_department SET 	logo = '{$picture}' WHERE id = '{$user}';");
			if($query->execute()){
				$log = $function->log2($user,"Logo is updated to {$picture}.","Update");
				echo 1;
			}
			else{
				unlink('../images/profile/'.$picture);
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['update-employes'])){
			$data = $_POST['data'];
			$num = $data[0];

			if($data[1][0]['name'] == "field_Name Of Child"){
				$child = $data[1][0]['value'];
				print_r($data);
				$query = $function->PDO(false,"UPDATE tbl_employees SET child = '{$child}' WHERE id = '{$num}';");
				if($query->execute()){
					$log = $function->log2($user,"child is updated to {$child}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-employee'])){
			$data = $_POST['data'];
			$user = $data[0];
			// print_r($data);

			if($data[1][0]['name'] == "field_gname"){
				$query = $function->PDO(false,"UPDATE tbl_employees  SET family_name = '{$data[1][2]['value']}', given_name = '{$data[1][0]['value']}', middle_name = '{$data[1][1]['value']}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Name is updated to {$data[1][0]['value']} {$data[1][1]['value']} {$data[1][2]['value']}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Place Of Birth"){
				$nickname = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET nickname = '{$nickname}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Nickname is updated to {$nickname}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Position"){
				$position = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET position = '{$position}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Position is updated to {$position}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Phone"){
				$phone = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET contact_number = '{$phone}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Phone is updated to {$phone}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Email"){
				$email = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET email_address = '{$email}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Email is updated to {$email}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Gender"){
				$gender = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET gender = '{$gender}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Gender is updated to {$gender}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Civil Status"){
				$cstatus = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET cstatus = '{$cstatus}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Civil Status is updated to {$cstatus}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Citizenship"){
				$citizenship = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET citizenship = '{$citizenship}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Citizenship is updated to {$citizenship}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Height"){
				$height = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET height = '{$height}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Height is updated to {$height}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Weight"){
				$weight = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET weight = '{$weight}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Weight is updated to {$weight}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Blood Type"){
				$btype = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET btype = '{$btype}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Blood Type is updated to {$btype}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_GSIS Number"){
				$gsis = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET gsis = '{$gsis}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"GSIS ID Number is updated to {$gsis}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Pag-Ibig ID Number"){
				$pagibig = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET pagibig = '{$pagibig}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Pag-Ibig ID Number is updated to {$pagibig}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Philhealth Number"){
				$philhealth = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET philhealth = '{$philhealth}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Philhealth Number is updated to {$philhealth}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_SSS Number"){
				$sss = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET sss = '{$sss}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"SSS ID Number is updated to {$sss}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Residential Address"){
				$r_address = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET r_address = '{$r_address}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Residential Address is updated to {$r_address}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Residential Zipcode"){
				$r_zipcode = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET r_zipcode = '{$r_zipcode}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Zipcode is updated to {$r_zipcode}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Residential Telephone Number"){
				$r_tele = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET r_tele = '{$r_tele}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Telephone Number is updated to {$r_tele}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Permanent Address"){
				$p_address = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET p_address = '{$p_address}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Permanent Address is updated to {$p_address}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Permanent Zipcode"){
				$p_zipcode = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET p_zipcode = '{$p_zipcode}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Zipcode is updated to {$p_zipcode}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Permanent Telephone Number"){
				$p_tele = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET p_tele = '{$p_tele}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Telephone Number is updated to {$p_tele}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Employee Agency Number"){
				$agency_num = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET agency_num = '{$agency_num}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Telephone Number is updated to {$agency_num}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Tin"){
				$tin = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET tin = '{$tin}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Telephone Number is updated to {$tin}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Spouse Surename"){
				$s_surename = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_family SET s_surename = '{$s_surename}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Spouse's Surname is updated to {$s_surename}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Spouse First Name"){
				$s_firstname = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_family SET s_firstname = '{$s_firstname}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"First Name is updated to {$s_firstname}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Spouse Middle Name"){
				$s_middlename = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_family SET s_middlename = '{$s_middlename}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Middle Name is updated to {$s_middlename}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Spouse Occupation"){
				$s_occupation = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_family SET s_occupation = '{$s_occupation}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Occupation is updated to {$s_occupation}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Spouse Employer/Bus Name"){
				$s_employer = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_family SET s_employer = '{$s_employer}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Employer/Bus Name is updated to {$s_employer}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Spouse Business Address"){
				$s_business = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_family SET s_business = '{$s_business}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Business Address is updated to {$s_business}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Spouse Telephone Number"){
				$s_tele = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_family SET s_tele = '{$s_tele}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Telephone Number is updated to {$s_tele}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Father Surename"){
				$f_surename = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_family SET f_surename = '{$f_surename}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Surename is updated to {$f_surename}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Father First Name"){
				$f_firstname = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_family SET f_firstname = '{$f_firstname}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Surename is updated to {$f_firstname}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Father Middle Name"){
				$f_middlename = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_family SET f_middlename = '{$f_middlename}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Surename is updated to {$f_middlename}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Mother Surename"){
				$m_surename = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_family SET m_surename = '{$m_surename}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Surename is updated to {$m_surename}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Mother First Name"){
				$m_firstname = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_family SET m_firstname = '{$m_firstname}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Surename is updated to {$m_firstname}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Mother Middle Name"){
				$m_middlename = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_family SET m_middlename = '{$m_middlename}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Surename is updated to {$m_middlename}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			//child
			else if($data[1][0]['name'] == "field_Name Of Child"){
				$child = $data[1][0]['value'];
				print_r($data);
				$query = $function->PDO(false,"UPDATE tbl_child SET child = '{$child}' WHERE id = '{$num}';");
				if($query->execute()){
					$log = $function->log2($user,"Surename is updated to {$child}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			// else if($data[1][0]['name'] == "field_Birthday"){
			// 	$dob = $data[1][0]['value'];
			// 	$query = $function->PDO(false,"UPDATE tbl_child SET dob = '{$dob}' WHERE id = '{$user}';");
			// 	if($query->execute()){
			// 		$log = $function->log2($user,"Surename is updated to {$dob}.","Update");
			// 		echo 1;
			// 	}
			// 	else{
			// 		$Data = $query->errorInfo();
			// 		print_r($Data);
			// 	}
			// }
			else if($data[1][0]['name'] == "field_dob"){
				$date_of_birth = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET date_of_birth = '{$date_of_birth}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Gender is updated to {$date_of_birth}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}
		
		if(isset($_GET['update-employeePicture'])){
			$data = $_POST['data'];
			$user = $data[0];

			$picture = $function->saveImage($user,$data[1]);
			$query = $function->PDO(false,"UPDATE tbl_employees SET picture = '{$picture}' WHERE id = '{$user}';");
			if($query->execute()){
				$log = $function->log2($user,"Picture is updated to {$picture}.","Update");
				echo 1;
			}
			else{
				unlink('../images/profile/'.$picture);
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['update-requestEmployee'])){
			$data = $_POST['data'];
			$user = $data[0];
	        $id = $function->PDO_IDGenerator('tbl_request','id');
			$date = $function->PDO_DateAndTime();

			if($data[1][0]['name'] == "field_gname"){
				$value = json_encode([$data[1][2]['value'],$data[1][0]['value'],$data[1][1]['value']]);
				$value = $function->escape($value);
				$query = $function->PDO(false,"INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Update Employee Account','{$user}','Admin',{$value},'Name','0','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to update employee account");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Nickname"){
				$value =  $function->escape($data[1][0]['value']);
				$query = $function->PDO(false,"INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Update Employee Account','{$user}','Admin',{$value},'Nickname','0','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to update employee account");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Position"){
				$value =  $function->escape($data[1][0]['value']);
				$query = $function->PDO(false,"INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Update Employee Account','{$user}','Admin',{$value},'Position','0','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to update employee account");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Phone"){
				$value =  $function->escape($data[1][0]['value']);
				$query = $function->PDO(false,"INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Update Employee Account','{$user}','Admin',{$value},'Contact Number','0','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to update employee account");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Email"){
				$value =  $function->escape($data[1][0]['value']);
				$query = $function->PDO(false,"INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Update Employee Account','{$user}','Admin',{$value},'Email','0','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to update employee account");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Address"){
				$value =  $function->escape($data[1][0]['value']);
				$query = $function->PDO(false,"INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Update Employee Account','{$user}','Admin',{$value},'Address','0','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to update employee account");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Gender"){
				$value =  $function->escape($data[1][0]['value']);
				$query = $function->PDO(false,"INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Update Employee Account','{$user}','Admin',{$value},'Gender','0','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to update employee account");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_dob"){
				$value =  $function->escape($data[1][0]['value']);
				$query = $function->PDO(false,"INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Update Employee Account','{$user}','Admin',{$value},'Date of Birth','0','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to update employee account");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Password"){
				$session = $_SESSION['kaboom'];
				$password = sha1($data[1][0]['value']);
				$query = $function->PDO(false,"UPDATE tbl_employees SET password = '{$password}' WHERE id = '{$user}';");
				if($query->execute()){
					$_SESSION["kaboom"] = [$session[0],$password,$session[2]];
					$log = $function->log2($user,"Password updated","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}
		
		if(isset($_GET['update-requestEmployeePicture'])){
			$data = $_POST['data'];
			$user = $data[0];
	        $id = $function->PDO_IDGenerator('tbl_request','id');
			$date = $function->PDO_DateAndTime();

			$picture = $function->saveImage($user,$data[1]);
			$query = $function->PDO(false,"INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Update Employee Account','{$user}','Admin','{$picture}','Profile Picture','0','{$date}')");
			if($query->execute()){
				$log = $function->log("request",$user,"Request to update employee account");
				echo 1;
			}
			else{
				unlink('../images/profile/'.$picture);
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['update-product'])){
			$data = $_POST['data'];
			$id = $data[0];

			if($data[1][0]['name'] == "field_product"){
				$query = $function->PDO(false,"UPDATE tbl_product SET product_name = '{$data[1][0]['value']}' WHERE id = '{$id}';");
				if($query->execute()){
					$log = $function->log2($id,"Product name is updated to {$data[1][0]['value']}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_price"){
				$query = $function->PDO(false,"UPDATE tbl_product SET price = '{$data[1][0]['value']}' WHERE id = '{$id}';");
				if($query->execute()){
					$log = $function->log2($id,"Product price is updated to {$data[1][0]['value']}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_qty"){
				$query = $function->PDO(false,"UPDATE tbl_product SET qty = '{$data[1][0]['value']}' WHERE id = '{$id}';");
				if($query->execute()){
					$log = $function->log2($id,"Product SKU is updated to {$data[1][0]['value']}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_categories"){
				$query = $function->PDO(false,"UPDATE tbl_product SET category = '{$data[1][0]['value']}' WHERE id = '{$id}';");
				if($query->execute()){
					$log = $function->log2($id,"Product categories are updated to {$data[1][0]['value']}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_description"){
				$query = $function->PDO(false,"UPDATE tbl_product SET description = '{$data[1][0]['value']}' WHERE id = '{$id}';");
				if($query->execute()){
					$log = $function->log2($id,"Product description are updated to {$data[1][0]['value']}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_status"){
				$query = $function->PDO(false,"UPDATE tbl_product SET status = '{$data[1][0]['value']}' WHERE id = '{$id}';");
				if($query->execute()){
					$log = $function->log2($id,"Product status is updated to {$data[1][0]['value']}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}
		
		if(isset($_GET['update-productPicture'])){
			$data = $_POST['data'];
			$id = $data[0];

			// print_r($data);

			$picture = $function->saveProductImage($id,$data[1]);
			$query = $function->PDO(false,"UPDATE tbl_product SET picture = '{$picture}' WHERE id = '{$id}';");
			if($query->execute()){
				$log = $function->log2($id,"Product picture is updated to {$picture}.","Update");
				echo 1;
			}
			else{
				unlink('../images/products/'.$picture);
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

	    // activate account
		    if(isset($_GET['activate-admin'])){
				$user = $function->getUser();
		    	$data = $_POST['data'];
				$query = $function->PDO(false,"UPDATE tbl_admin SET status = '1' WHERE id = '{$data}';");
				if($query->execute()){
					$log = $function->log2($user,"Activating admin account","Active");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		    if(isset($_GET['activate-employer'])){
				$user = $function->getUser();
		    	$data = $_POST['data'];
				$query = $function->PDO(false,"UPDATE tbl_employer SET status = '1' WHERE id = '{$data}';");
				if($query->execute()){
					$log = $function->log2($user,"Activating admin account","Active");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		    if(isset($_GET['activate-employee'])){
				$user = $function->getUser();
		    	$data = $_POST['data'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET status = '1' WHERE id = '{$data}';");
				if($query->execute()){
					$log = $function->log2($user,"Activating employee account","Active");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		     if(isset($_GET['activate-employeeAccount'])){
				$user = $function->getUser();
		    	$data = $_POST['data'];
				$query = $function->PDO(false,"UPDATE tbl_employee SET status = '1' WHERE id = '{$data}';");
				if($query->execute()){
					$log = $function->log2($user,"Activating employee account","Active");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		    if(isset($_GET['request-activate-employee'])){
				$data = $_POST['data'];
		        $id = $function->PDO_IDGenerator('tbl_request','id');
				$date = $function->PDO_DateAndTime();
				$user = $function->getUser();
				$employee_id = $data[0];

				$query = $function->PDO(false,"INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Deactivate Employee','{$user}','{$employee_id}','1','{$data[1]}','1','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to activate employee ".$employee_id);
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

	    // de-activate account
		    if(isset($_GET['deactivate-admin'])){
				$user = $function->getUser();
		    	$data = $_POST['data'];
				$query = $function->PDO(false,"UPDATE tbl_admin SET status = '0' WHERE id = '{$data[0]}';");
				if($query->execute()){
					$log = $function->log2($user,$data[1],"Deactivate");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		    if(isset($_GET['deactivate-employer'])){
				$user = $function->getUser();
		    	$data = $_POST['data'];
				$remarks = json_encode($data);
				$query = $function->PDO(false,"UPDATE tbl_employer SET status = '0' WHERE id = '{$data[0]}';");
				if($query->execute()){
					$log = $function->log2($user,$remarks,"Deactivate");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		    if(isset($_GET['deactivate-employee'])){
				$user = $function->getUser();
		    	$data = $_POST['data'];
				$remarks = json_encode($data);
				$query = $function->PDO(false,"UPDATE tbl_employees SET status = '0' WHERE id = '{$data[0]}';");
				if($query->execute()){
					$log = $function->log2($user,$remarks,"Deactivate");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		    if(isset($_GET['deactivate-employeeAccount'])){
				$user = $function->getUser();
		    	$data = $_POST['data'];
				$remarks = json_encode($data);
				$query = $function->PDO(false,"UPDATE tbl_employee SET status = '0' WHERE id = '{$data[0]}';");
				if($query->execute()){
					$log = $function->log2($user,$remarks,"Deactivate");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		    if(isset($_GET['request-deactivate-employee'])){
				$data = $_POST['data'];
		        $id = $function->PDO_IDGenerator('tbl_request','id');
				$date = $function->PDO_DateAndTime();
				$user = $function->getUser();
				$employee_id = $data[0];

				$query = $function->PDO(false,"INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Deactivate Employee','{$user}','{$employee_id}','0','{$data[1]}','1','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to deactivate employee ".$employee_id);
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		// request

		   	/*
				status code:
					0. pending
					1. accepted
					2. declined
					3. invisible
		   	*/

			if(isset($_GET['get-requestAccountUpdate'])){
				$data = $_POST['data'];
				$account = [];
				$requests = [];
				$val = [];
				$q1 = $function->PDO(true,"SELECT DISTINCT(request_by) FROM tbl_request LIMIT {$data[1]}, {$data[0]}");
				foreach ($q1 as $i => $v) {
					$account = $function->PDO(true,"SELECT * FROM tbl_employees WHERE id = '{$v[0]}'");
					$requests = $function->PDO(true,"SELECT * FROM tbl_request WHERE request_by = '{$v[0]}' AND header = 'Update Employee Account' AND status = 0");
					if(count($requests)>0){
						$val[] = [$account[0],$requests];
					}
				}
				print_r(json_encode($val));
			}

			if(isset($_GET['get-requestPoints'])){
				$data = $_POST['data'];
				$account = [];
				$requests = [];
				$val = [];
				$q1 = $function->PDO(true,"SELECT DISTINCT(request_to) FROM tbl_request LIMIT {$data[1]}, {$data[0]}");
				foreach ($q1 as $i => $v) {
					$account = $function->PDO(true,"SELECT * FROM tbl_employees WHERE id = '{$v[0]}'");
					$requests = $function->PDO(true,"SELECT * FROM tbl_request WHERE request_to = '{$v[0]}' AND header = 'Add Points' AND status = 0");
					if(count($requests)>0){
						$val[] = [$account[0],$requests];
					}
				}
				print_r(json_encode($val));
			}

		    if(isset($_GET['request-approve'])){
		    	$data = $_POST['data'];
				$q1 = $function->PDO(true,"SELECT * FROM tbl_request WHERE id = '{$data['request']}'");
		    	if($q1[0][5] == 'Name'){
		    		$names = json_decode($q1[0][4]);
		    		$id = $q1[0][2];
					$query = $function->PDO(false,"UPDATE tbl_employees SET family_name = '{$names[0]}', given_name = '{$names[1]}', middle_name = '{$names[2]}' WHERE id = '{$id}'; UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
					if($query->execute()){
						$log = $function->log2($id,"Name has been changed.","Accepted Request");
						echo 1;
					}
					else{
						$Data = $query->errorInfo();
						print_r($Data);
					}
		    	}
		    	else if($q1[0][5] == 'Nickname'){
		    		$value = $q1[0][4];
		    		$id = $q1[0][2];
					$query = $function->PDO(false,"UPDATE tbl_employees SET nickname = '{$value}' WHERE id = '{$id}'; UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
					if($query->execute()){
						$log = $function->log2($id,"Nickname has been changed.","Accepted Request");
						echo 1;
					}
					else{
						$Data = $query->errorInfo();
						print_r($Data);
					}
		    	}
		    	else if($q1[0][5] == 'Position'){
		    		$value = $q1[0][4];
		    		$id = $q1[0][2];
					$query = $function->PDO(false,"UPDATE tbl_employees SET 	position = '{$value}' WHERE id = '{$id}'; UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
					if($query->execute()){
						$log = $function->log2($id,"Position has been changed.","Accepted Request");
						echo 1;
					}
					else{
						$Data = $query->errorInfo();
						print_r($Data);
					}
		    	}
		    	else if($q1[0][5] == 'Contact Number'){
		    		$value = $q1[0][4];
		    		$id = $q1[0][2];
					$query = $function->PDO(false,"UPDATE tbl_employees SET contact_number = '{$value}' WHERE id = '{$id}'; UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
					if($query->execute()){
						$log = $function->log2($id,"Contact Number has been changed.","Accepted Request");
						echo 1;
					}
					else{
						$Data = $query->errorInfo();
						print_r($Data);
					}
		    	}
		    	else if($q1[0][5] == 'Date of Birth'){
		    		$value = $q1[0][4];
		    		$id = $q1[0][2];
					$query = $function->PDO(false,"UPDATE tbl_employees SET date_of_birth = '{$value}' WHERE id = '{$id}'; UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
					if($query->execute()){
						$log = $function->log2($id,"Date  of birth has been changed.","Accepted Request");
						echo 1;
					}
					else{
						$Data = $query->errorInfo();
						print_r($Data);
					}
		    	}
		    	else if($q1[0][5] == 'Email'){
		    		$value = $q1[0][4];
		    		$id = $q1[0][2];
					$query = $function->PDO(false,"UPDATE tbl_employees SET email_address = '{$value}' WHERE id = '{$id}'; UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
					if($query->execute()){
						$log = $function->log2($id,"Email has been changed.","Accepted Request");
						echo 1;
					}
					else{
						$Data = $query->errorInfo();
						print_r($Data);
					}
		    	}
		    	else if($q1[0][5] == 'Address'){
		    		$value = $q1[0][4];
		    		$id = $q1[0][2];
					$query = $function->PDO(false,"UPDATE tbl_employees SET 	address = '{$value}' WHERE id = '{$id}'; UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
					if($query->execute()){
						$log = $function->log2($id,"Address has been changed.","Accepted Request");
						echo 1;
					}
					else{
						$Data = $query->errorInfo();
						print_r($Data);
					}
		    	}
		    	else if($q1[0][5] == 'Gender'){
		    		$value = $q1[0][4];
		    		$id = $q1[0][2];
					$query = $function->PDO(false,"UPDATE tbl_employees SET 	gender = '{$value}' WHERE id = '{$id}'; UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
					if($query->execute()){
						$log = $function->log2($id,"Gender has been changed.","Accepted Request");
						echo 1;
					}
					else{
						$Data = $query->errorInfo();
						print_r($Data);
					}
		    	}
		    	else if($q1[0][5] == 'Profile Picture'){
		    		$value = $q1[0][4];
		    		$id = $q1[0][2];
					$query = $function->PDO(false,"UPDATE tbl_employees SET picture = '{$value}' WHERE id = '{$id}'; UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
					if($query->execute()){
						$log = $function->log2($id,"Picture has been changed.","Accepted Request");
						echo 1;
					}
					else{
						$Data = $query->errorInfo();
						print_r($Data);
					}
		    	}
		    }

		    if(isset($_GET['request-cancel'])){
		    	// print_r($q1);
		    	$data = $_POST['data'];
	    		$id = $data['node'];
				$query = $function->PDO(false,"UPDATE tbl_request SET status = '2' WHERE id = '{$data['request']}';");
				if($query->execute()){
						$log = $function->log2($id,"Request to change has been cancelled.","Cancelled Request");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		    if(isset($_GET['request-approvePoints'])){
		    	$data = $_POST['data'];
				$date = $function->PDO_DateAndTime();
				$quantity = $function->PDO(true,"SELECT COUNT(*) FROM tbl_pointsactivity");
				$q1 = $function->PDO(true,"SELECT * FROM tbl_request WHERE id = '{$data['request']}'");
				$count = $quantity[0][0];
				$employee_id = $data['node'];
				$points = (int)$q1[0][4];
				$currentPoints = $function->PDO(true,"SELECT * FROM tbl_points WHERE id = '{$employee_id}';");
				$newpoints = $currentPoints[0][2]+$points;
		        $id = $currentPoints[0][3].'-'.($count+1);

				$query = $function->PDO(false,"UPDATE tbl_points SET points = '{$newpoints}' WHERE id = '{$employee_id}' AND company_id = '{$currentPoints[0][3]}'; INSERT INTO tbl_pointsactivity(id,points,addedby,employee_id,`date`,remarks) VALUES('{$id}','{$points}','admin','{$currentPoints[0][1]}','{$date}','No remarks'); UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
				if($query->execute()){
					$log = $function->log2($employee_id,"Points has been added.","Points Request");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		    if(isset($_GET['request-cancelPoints'])){
		    	$data = $_POST['data'];
				$employee_id = $data['node'];
				$q1 = $function->PDO(true,"SELECT * FROM tbl_request WHERE id = '{$data['request']}'");
				$q2 = $function->PDO(true,"SELECT * FROM tbl_points WHERE id = '{$employee_id}';"); // just to get comany id
				$company_id = $q2[0][3];
				$queryPointBalance = $function->PDO(true,"SELECT * FROM tbl_pointbalance WHERE id = '{$company_id}'");
		    	$newBalance = (int)$q1[0][4] + (int)($queryPointBalance[0][1]);

				$query = $function->PDO(false,"UPDATE tbl_pointbalance SET balance = '{$newBalance}' WHERE id = '{$company_id}'; UPDATE tbl_request SET status = '2' WHERE id = '{$data['request']}';");
				if($query->execute()){
					$log = $function->log2($employee_id,"Points has been added.","Points Request");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

    //backups
	    if(isset($_GET['buckup-db'])){
			$db = $function->db_buckup();
	    	// print_r($db);
	        $file = sha1('rufongabrillojr').'-'.time().'.sql';
	        $handle = fopen('../db/'.$file, 'w+');

	        if(fwrite($handle, $db)){
	        	fclose($handle);
	        	print_r(json_encode([1,$file]));
	        }
	    }	

	    if(isset($_GET['get-dbFiles'])){
	    	$dir = '../db';$_files = [];$data = "";
			$files = array_diff(scandir($dir), array('..', '.'));
			foreach ($files as $i => $v){
				$data = stat($dir."/".$v);
				$data = date("F j, Y",$data['mtime']);
				$_files[] = [$v,$data];
			}
			// print_r($_files);
			print_r(json_encode($_files));
	    }
	    
	    if(isset($_GET['send-mail'])){
	    	$data = $_POST['data'];

	        $headers  = 'MIME-Version: 1.0' . "\r\n";
	        $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	        $headers .= 'From: KABOOM REWARDS <kaboomrewards.com>' . "\r\n";
	        $receiver = $data[0];
	        $subject =  $data[1];
	        $message = $data[2];

	        $result = mail($data[0],$subject,$message,$headers);
	        print_r($result);
	    }
?>