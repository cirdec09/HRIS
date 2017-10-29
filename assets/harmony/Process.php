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
				if($query[0][5] == 1){
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
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_employee WHERE department_id = '{$data}'");

			print_r(json_encode($query));
		}

		if(isset($_GET['get-listEmployeeSALN'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_saln_personalInfo WHERE department_id = '{$data}'");

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

		if(isset($_GET['get-departments'])){
			$query = $function->PDO(true,"SELECT * FROM tbl_department");
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

		if(isset($_GET['get-travelPending'])){
			$data = $_POST['data'];
			$status = "Pending";

			$query = $function->PDO(true,"SELECT * FROM tbl_travel WHERE employee_id = '{$data}' AND status = '{$status}' ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-adminTravelPending'])){
			$data = $_POST['data'];
			$status = "Pending";
			$query = $function->PDO(true,"SELECT * FROM tbl_travel WHERE status = '{$status}' ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-travel'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_travel WHERE id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-leave'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_leave WHERE id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-travelApproved'])){
			$data = $_POST['data'];
			$status = "Approved";

			$query = $function->PDO(true,"SELECT * FROM tbl_travel WHERE employee_id = '{$data}' AND status = '{$status}' ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-adminTravelApproved'])){
			$data = $_POST['data'];
			$status = "Approved";
			$query = $function->PDO(true,"SELECT * FROM tbl_travel WHERE status = '{$status}' ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-travelDisapproved'])){
			$data = $_POST['data'];
			$status  = "Disapproved";

			$query = $function->PDO(true,"SELECT * FROM tbl_travel WHERE employee_id = '{$data}' AND status = '{$status}' ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-adminTravelDisapproved'])){
			$data = $_POST['data'];
			$status  = "Disapproved";
			$query = $function->PDO(true,"SELECT * FROM tbl_travel WHERE status = '{$status}' ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-adminLeavePending'])){
			$data = $_POST['data'];
			$status  = "Pending";

			$query = $function->PDO(true,"SELECT * FROM tbl_leave WHERE status = '{$status}' ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-leavePending'])){
			$data = $_POST['data'];
			$status  = "Pending";

			$query = $function->PDO(true,"SELECT * FROM tbl_leave WHERE employee_id = '{$data}' AND status = '{$status}' ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-leaveApproved'])){
			$data = $_POST['data'];
			$status  = "Approved";

			$query = $function->PDO(true,"SELECT * FROM tbl_leave WHERE employee_id = '{$data}' AND status = '{$status}' ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-adminLeaveApproved'])){
			$data = $_POST['data'];
			$status  = "Approved";

			$query = $function->PDO(true,"SELECT * FROM tbl_leave WHERE status = '{$status}' ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-leaveDisapproved'])){
			$data = $_POST['data'];
			$status  = "Disapproved";

			$query = $function->PDO(true,"SELECT * FROM tbl_leave WHERE employee_id = '{$data}' AND status = '{$status}' ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-adminLeaveDisapproved'])){
			$data = $_POST['data'];
			$status  = "Disapproved";

			$query = $function->PDO(true,"SELECT * FROM tbl_leave WHERE status = '{$status}' ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-employee'])){
			$user = $function->getUser();
			$query = $function->PDO(true,"SELECT * FROM tbl_employees WHERE status = 1 ORDER BY `date` DESC");
			print_r(json_encode($query));
		}

		// if(isset($_GET['get-printPDS'])){
		// 	$data = $_POST['data'];
		// 	$query = $function->PDO(true,"SELECT * FROM tbl_employees INNER JOIN tbl_family ON tbl_employees.employee_id = tbl_family.employee_id INNER JOIN tbl_child ON tbl_employees.employee_id = tbl_child.employee_id INNER JOIN tbl_education ON tbl_employees.employee_id = tbl_education.employee_id INNER JOIN tbl_vocational ON tbl_employees.employee_id = tbl_vocational.employee_id");
		// 	print_r(json_encode($query));
		// }

		if(isset($_GET['get-SALNpersonalInfo'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_saln_personalInfo WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-adminSALNpersonalInfo'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_saln_personalInfo WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-unmarriedChild'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_saln_unmarried_child WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-adminUnmarriedChild'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_saln_unmarried_child WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-real'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_saln_real WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-adminReal'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_saln_real WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-personal'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_saln_personal WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-adminPersonal'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_saln_personal WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-liabilities'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_saln_liabilities WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-adminLiabilities'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_saln_liabilities WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-business'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_saln_business WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-adminBusiness'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_saln_business WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-relatives'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_saln_relatives WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-other'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_saln_other WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-adminRelatives'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_saln_relatives WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-employeeDetails'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_employees WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-family'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_family WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-child'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_child WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-education'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_education WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-vocational'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_vocational WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-college'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_college WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-graduate'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_graduate WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-civil'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_civil WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-work'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_work WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-voluntary'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_voluntary WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-training'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_training WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-skills'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_skills WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-nonAcademic'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_non_academic WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-membership'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_membership WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-questions'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_questions WHERE employee_id = '{$data}'");
			print_r(json_encode($query));
		}
		if(isset($_GET['get-references'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_references WHERE employee_id = '{$data}'");
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
			$query = $function->PDO(true,"SELECT COUNT(*),department_id FROM tbl_employees GROUP BY department_id");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-allAccountCount'])){
			$query = $function->PDO(true,"SELECT COUNT(*),department_id FROM tbl_employee GROUP BY department_id");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-allSALNcount'])){
			$query = $function->PDO(true,"SELECT COUNT(*),department_id FROM tbl_saln_personalInfo GROUP BY department_id");
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
			$query = $function->PDO(true,"SELECT * FROM tbl_employees WHERE department_id = '{$data}' ORDER BY department_id");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-accountByID'])){
			$data = $_POST['data'];
			$query = $function->PDO(true,"SELECT * FROM tbl_employee WHERE company_id = '{$data}' ORDER BY company_id");
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
			$department = $data[0];

			$password = sha1($data[1][2]['value']);
			$query = $function->PDO(false,"INSERT INTO tbl_employee(id,department_id,name,username,password,status,`date`) VALUES ('{$id}','{$department}','{$data[1][0]['value']}','{$data[1][1]['value']}','{$password}','1','{$date}')");
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
	        $id = $function->PDO_IDGenerator('tbl_family','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_family(id,employee_id,s_surename,s_firstname,s_middlename,s_occupation,s_employer,s_business,s_tele,f_surename,f_firstname,f_middlename,m_surename,m_firstname,m_middlename) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}','{$data[0][6]['value']}','{$data[0][7]['value']}','{$data[0][8]['value']}','{$data[0][9]['value']}','{$data[0][10]['value']}','{$data[0][11]['value']}','{$data[0][12]['value']}')");
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
	        $id = $function->PDO_IDGenerator('tbl_education','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_education(id,employee_id,e_name,e_degree,e_year,e_grade,e_from,e_to,e_scholar,s_name,s_degree,s_year,s_grade,s_from,s_to,s_scholar) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}','{$data[0][6]['value']}','{$data[0][7]['value']}','{$data[0][8]['value']}','{$data[0][9]['value']}','{$data[0][10]['value']}','{$data[0][11]['value']}','{$data[0][12]['value']}','{$data[0][13]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newVocational'])){
			$data = $_POST['data'];
	        $id = $function->PDO_IDGenerator('tbl_vocational','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_vocational(id,employee_id,name,degree,year,grade,date_from,date_to,scholar) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}','{$data[0][6]['value']}')");
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
	        $id = $function->PDO_IDGenerator('tbl_college','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_college(id,employee_id,name,degree,year,grade,date_from,date_to,scholar) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}','{$data[0][6]['value']}')");
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
	        $id = $function->PDO_IDGenerator('tbl_graduate','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_graduate(id,employee_id,name,degree,year,grade,date_from,date_to,scholar) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}','{$data[0][6]['value']}')");
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
			$id = $function->PDO_IDGenerator('tbl_civil','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_civil(id,employee_id,career,rating,doe,place,l_number,dor) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}')");
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
			$id = $function->PDO_IDGenerator('tbl_work','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_work(id,employee_id,inclusive_date,position,department,monthly_salary,salary_grade,appointment,service) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}','{$data[0][6]['value']}')");
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
			$id = $function->PDO_IDGenerator('tbl_voluntary','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_voluntary(id,employee_id,name,inclusive_date,hours,position) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}')");
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
			$id = $function->PDO_IDGenerator('tbl_training','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_training(id,employee_id,title,inclusive_date,hours,conducted) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newSkills'])){
			$data = $_POST['data'];
			$id = $function->PDO_IDGenerator('tbl_skills','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_skills(id,employee_id,skills) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newNonAcademic'])){
			$data = $_POST['data'];
			$id = $function->PDO_IDGenerator('tbl_non_academic','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_non_academic(id,employee_id,non_academic) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newMembership'])){
			$data = $_POST['data'];
			$id = $function->PDO_IDGenerator('tbl_membership','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_membership(id,employee_id,membership) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newQuestions'])){
			$data = $_POST['data'];
			$id = $function->PDO_IDGenerator('tbl_questions','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_questions(id,employee_id,36A_YN,36A_details,36B_YN,36B_details,37A_YN,37A_details,37B_YN,37B_details,38_YN,38_details,39_YN,39_details,40_YN,40_details,41A_YN,41A_details,41B_YN,41B_details,41C_YN,41C_details) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}','{$data[0][6]['value']}','{$data[0][7]['value']}','{$data[0][8]['value']}','{$data[0][9]['value']}','{$data[0][10]['value']}','{$data[0][11]['value']}','{$data[0][12]['value']}','{$data[0][13]['value']}','{$data[0][14]['value']}','{$data[0][15]['value']}','{$data[0][16]['value']}','{$data[0][17]['value']}','{$data[0][18]['value']}','{$data[0][19]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newReferences'])){
			$data = $_POST['data'];
			$id = $function->PDO_IDGenerator('tbl_references','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_references(id,employee_id,name,address,tel) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newSALNpersonalInfo'])){
			$data = $_POST['data'];
			$id = $function->PDO_IDGenerator('tbl_saln_personalInfo','id');
			$date = $function->PDO_DateAndTime();
			$employee_id = $data[1];
			$company_id = $data[2];
			
			$query = $function->PDO(false,"INSERT INTO tbl_saln_personalInfo(id,employee_id,department_id,lname,fname,minitial,address,position,agency,office_address,s_lname,s_fname,s_minitial,s_position,s_agency,s_office_address,status) VALUES ('{$id}','{$employee_id}','{$company_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}','{$data[0][6]['value']}','{$data[0][7]['value']}','{$data[0][8]['value']}','{$data[0][9]['value']}','{$data[0][10]['value']}','{$data[0][11]['value']}','{$data[0][12]['value']}','1')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newSALNunmarried'])){
			$data = $_POST['data'];
			$id = $function->PDO_IDGenerator('tbl_saln_unmarried_child','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_saln_unmarried_child(id,employee_id,name,dob,age) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newReal'])){
			$data = $_POST['data'];
			$id = $function->PDO_IDGenerator('tbl_saln_real','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_saln_real(id,employee_id,description,kind,location,assessed,current,acquisition_year,acquisition_mode,acquisition_cost) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}','{$data[0][6]['value']}','{$data[0][7]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newPersonal'])){
			$data = $_POST['data'];
			$id = $function->PDO_IDGenerator('tbl_saln_personal','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_saln_personal(id,employee_id,description,year,cost) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newLiabilities'])){
			$data = $_POST['data'];
			$id = $function->PDO_IDGenerator('tbl_saln_liabilities','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_saln_liabilities(id,employee_id,nature,creditors,balance) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newBusiness'])){
			$data = $_POST['data'];
			$id = $function->PDO_IDGenerator('tbl_saln_business','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_saln_business(id,employee_id,name,address,nature,date_interest) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newRelatives'])){
			$data = $_POST['data'];
			$id = $function->PDO_IDGenerator('tbl_saln_relatives','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_saln_relatives(id,employee_id,name,relationship,position,agency) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newSalnOther'])){
			$data = $_POST['data'];
			$id = $function->PDO_IDGenerator('tbl_saln_other','id');
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_saln_other(id,employee_id,dates,goverment_issued,id_number,date_issued,s_goverment_issued,s_id_number,s_date_issued) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}','{$data[0][6]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newLeave'])){
			$data = $_POST['data'];
			$id = $function->PDO_IDGenerator('tbl_leave','id');
			$date = $function->PDO_DateAndTime();
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_leave(id,employee_id,office,lname,fname,mname,DateOfFiling,position,salary,type_leave,specify_leave,working_days,inclusive_date,spent,specify_where,commutation,certification,vacation,sick,total,with_pay,without_pay,other_specify,status,recommendation_due_to,due_to,`date`) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}','{$data[0][6]['value']}','{$data[0][7]['value']}','{$data[0][8]['value']}','{$data[0][9]['value']}','{$data[0][10]['value']}','{$data[0][11]['value']}','{$data[0][12]['value']}','{$data[0][13]['value']}','{$data[0][14]['value']}','{$data[0][15]['value']}','{$data[0][16]['value']}','{$data[0][17]['value']}','','','','Pending','','','{$date}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newTravel'])){
			$data = $_POST['data'];
			$id = $function->PDO_IDGenerator('tbl_travel','id');
			$date = $function->PDO_DateAndTime();
			$employee_id = $data[1];
			
			$query = $function->PDO(false,"INSERT INTO tbl_travel(id,employee_id,my_date,name,position,section,destination,departure,arrival,purpose,contacted,status,`date`,due) VALUES ('{$id}','{$employee_id}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][4]['value']}','{$data[0][5]['value']}','{$data[0][6]['value']}','{$data[0][7]['value']}','{$data[0][8]['value']}','Pending','{$date}','')");
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
			$id = $function->PDO_IDGenerator('tbl_employees','id');
			$date = $function->PDO_DateAndTime();
			$department = $data[2];
	        $employee_id = $data[1];
			
			
			$query = $function->PDO(false,"INSERT INTO tbl_employees(id,employee_id,employee_number,department_id,family_name,given_name,middle_name,place_of_birth,gender,date_of_birth,contact_number,picture,position,status,`date`,cstatus,citizenship,height,weight,btype,gsis,pagibig,philhealth,sss,r_address,r_zipcode,r_tele,p_address,p_zipcode,p_tele,email_address,agency_num,tin) VALUES ('{$id}','{$employee_id}','{$data[0][26]['value']}','{$department}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][5]['value']}','{$data[0][4]['value']}','{$data[0][6]['value']}','avatar.jpg','{$data[0][25]['value']}','1','{$date}','{$data[0][7]['value']}','{$data[0][8]['value']}','{$data[0][9]['value']}','{$data[0][10]['value']}','{$data[0][11]['value']}','{$data[0][12]['value']}','{$data[0][13]['value']}','{$data[0][14]['value']}','{$data[0][15]['value']}','{$data[0][16]['value']}','{$data[0][17]['value']}','{$data[0][18]['value']}','{$data[0][19]['value']}','{$data[0][20]['value']}','{$data[0][21]['value']}','{$data[0][22]['value']}','{$data[0][23]['value']}','{$data[0][24]['value']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($data);
			}
		}

		if(isset($_GET['set-newEmployee'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$user = $data[2];
	        $id = $data[1];
	        // print_r($data);
			// $password = sha1($data[0][27]['value']);
			
			$query = $function->PDO(false,"INSERT INTO tbl_employees(id,employee_id,company_id,family_name,given_name,middle_name,nickname,gender,date_of_birth,contact_number
				,picture,position,status,`date`,cstatus,citizenship,height,weight,btype,gsis,pagibig,philhealth,sss,r_address,r_zipcode,r_tele,p_address,p_zipcode,p_tele,email_address,agency_num,tin) VALUES ('{$id}','{$data[0][26]['value']}','{$user}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][2]['value']}','{$data[0][3]['value']}','{$data[0][5]['value']}','{$data[0][4]['value']}','{$data[0][6]['value']}','avatar.jpg','{$data[0][25]['value']}','1','{$date}','{$data[0][7]['value']}','{$data[0][8]['value']}','{$data[0][9]['value']}','{$data[0][10]['value']}','{$data[0][11]['value']}','{$data[0][12]['value']}','{$data[0][13]['value']}','{$data[0][14]['value']}','{$data[0][15]['value']}','{$data[0][16]['value']}','{$data[0][17]['value']}','{$data[0][18]['value']}','{$data[0][19]['value']}','{$data[0][20]['value']}','{$data[0][21]['value']}','{$data[0][22]['value']}','{$data[0][23]['value']}','{$data[0][24]['value']}']}')");
			if($query->execute()){
					echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($data);
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
				$place = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_employees SET place_of_birth = '{$place}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Place of Birth is updated to {$place}.","Update");
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

		if(isset($_GET['update-family'])){
			$data = $_POST['data'];
			$user = $data[0];
			
			if($data[1][0]['name'] == "field_Spouse Surename"){
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
		}

		if(isset($_GET['update-child'])){
			$data = $_POST['data'];
			$ref = $data[0];
			
			if($data[1][0]['name'] == "field_Name Of Child"){
				$name = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_child SET child = '{$name}' WHERE child = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Name is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Birthday"){
				$dob = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_child SET dob = '{$dob}' WHERE dob = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Birthdate is updated to {$dob}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-education'])){
			$data = $_POST['data'];
			$ref = $data[0];
			
			if($data[1][0]['name'] == "field_Name Of School"){
				$name = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_education SET e_name = '{$name}' WHERE e_name = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Name of School is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Degree Course"){
				$degree = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_education SET e_degree = '{$degree}' WHERE e_degree = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Degree Course is updated to {$degree}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Year Graduated"){
				$year = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_education SET e_year = '{$year}' WHERE e_year = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Year Graduated is updated to {$year}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Highest Grade"){
				$grade = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_education SET e_grade = '{$grade}' WHERE e_grade = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Highest Grade is updated to {$grade}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Elementary Inclusive Date Of Attendance From"){
				$dates = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_education SET e_from = '{$dates}' WHERE e_from = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Inclusive Dates is updated to {$dates}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Elementary Inclusive Date Of Attendance To"){
				$dates = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_education SET e_to = '{$dates}' WHERE e_to = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Inclusive Dates is updated to {$dates}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Scholarship/Non Academics Honor Recieved"){
				$scholar = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_education SET e_scholar = '{$scholar}' WHERE e_scholar = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Scholarship/Non Academics Honor Recieved is updated to {$scholar}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Name"){
				$name = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_education SET s_name = '{$name}' WHERE s_name = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Name of School is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Degree"){
				$degree = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_education SET s_degree = '{$degree}' WHERE s_degree = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Degree Course is updated to {$degree}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Year"){
				$year = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_education SET s_year = '{$year}' WHERE s_year = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Year Graduated is updated to {$year}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Grade"){
				$grade = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_education SET s_grade = '{$grade}' WHERE s_grade = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Highest Grade is updated to {$grade}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Secondary Inclusive Date Of Attendance From"){
				$dates = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_education SET s_from = '{$dates}' WHERE s_from = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Inclusive Dates is updated to {$dates}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Secondary Inclusive Date Of Attendance To"){
				$dates = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_education SET s_to = '{$dates}' WHERE s_to = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Inclusive Dates is updated to {$dates}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Scholarship"){
				$scholar = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_education SET s_scholar = '{$scholar}' WHERE s_scholar = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Scholarship/Non Academics Honor Recieved is updated to {$scholar}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-college'])){
			$data = $_POST['data'];
			$ref = $data[0];
			
			if($data[1][0]['name'] == "field_Name Of School"){
				$name = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_college SET name = '{$name}' WHERE name = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Name of School is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Degree Course"){
				$degree = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_college SET degree = '{$degree}' WHERE degree = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Degree Course is updated to {$degree}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Year Graduated"){
				$year = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_college SET year = '{$year}' WHERE year = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Year Graduated is updated to {$year}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Highest Grade"){
				$grade = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_college SET grade = '{$grade}' WHERE grade = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Highest Grade is updated to {$grade}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Inclusive Date Of Attendance From"){
				$dates = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_college SET date_from = '{$dates}' WHERE date_from = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Inclusive Dates is updated to {$dates}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Inclusive Date Of Attendance To"){
				$dates = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_college SET date_to = '{$dates}' WHERE date_to = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Inclusive Dates is updated to {$dates}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Scholarship/Non Academics Honor Recieved"){
				$scholar = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_college SET scholar = '{$scholar}' WHERE scholar = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Scholarship/Non Academics Honor Recieved is updated to {$scholar}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-graduate'])){
			$data = $_POST['data'];
			$ref = $data[0];
			
			if($data[1][0]['name'] == "field_Name Of School"){
				$name = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_graduate SET name = '{$name}' WHERE name = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Name of School is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Degree Course"){
				$degree = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_graduate SET degree = '{$degree}' WHERE degree = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Degree Course is updated to {$degree}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Year Graduated"){
				$year = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_graduate SET year = '{$year}' WHERE year = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Year Graduated is updated to {$year}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Highest Grade"){
				$grade = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_graduate SET grade = '{$grade}' WHERE grade = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Highest Grade is updated to {$grade}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Inclusive Date Of Attendance From"){
				$dates = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_graduate SET date_from = '{$dates}' WHERE date_from = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Inclusive Dates is updated to {$dates}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Inclusive Date Of Attendance To"){
				$dates = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_graduate SET date_to = '{$dates}' WHERE date_to = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Inclusive Dates is updated to {$dates}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Scholarship/Non Academics Honor Recieved"){
				$scholar = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_graduate SET scholar = '{$scholar}' WHERE scholar = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Scholarship/Non Academics Honor Recieved is updated to {$scholar}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-vocational'])){
			$data = $_POST['data'];
			$ref = $data[0];
			
			if($data[1][0]['name'] == "field_Name Of School"){
				$name = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_vocational SET name = '{$name}' WHERE name = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Name of School is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Degree Course"){
				$degree = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_vocational SET degree = '{$degree}' WHERE degree = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Degree Course is updated to {$degree}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Year Graduated"){
				$year = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_vocational SET year = '{$year}' WHERE year = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Year Graduated is updated to {$year}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Highest Grade"){
				$grade = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_vocational SET grade = '{$grade}' WHERE grade = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Highest Grade is updated to {$grade}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Inclusive Date Of Attendance From"){
				$dates = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_vocational SET date_from = '{$dates}' WHERE date_from = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Inclusive Dates is updated to {$dates}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Inclusive Date Of Attendance To"){
				$dates = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_vocational SET date_to = '{$dates}' WHERE date_to = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Inclusive Dates is updated to {$dates}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Scholarship/Non Academics Honor Recieved"){
				$scholar = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_vocational SET scholar = '{$scholar}' WHERE scholar = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Scholarship/Non Academics Honor Recieved is updated to {$scholar}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-civil'])){
			$data = $_POST['data'];
			$ref = $data[0];
			
			if($data[1][0]['name'] == "field_Career Service"){
				$career = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_civil SET career = '{$career}' WHERE career = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Career Service is updated to {$career}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Rating"){
				$rating = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_civil SET rating = '{$rating}' WHERE rating = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Rating is updated to {$rating}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Date Of Examination"){
				$doe = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_civil SET doe = '{$doe}' WHERE doe = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Date Of Examination is updated to {$doe}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Place Of Examination"){
				$place = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_civil SET place = '{$place}' WHERE place = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Place Of Examination is updated to {$place}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Number"){
				$l_number = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_civil SET l_number = '{$l_number}' WHERE l_number = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Number is updated to {$l_number}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Date Of Release"){
				$dor = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_civil SET dor = '{$dor}' WHERE dor = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Date Of Release is updated to {$dor}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-work'])){
			$data = $_POST['data'];
			$ref = $data[0];
			
			if($data[1][0]['name'] == "field_Inclusive Date Of Attendance From"){
				$dates = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_work SET date_from = '{$dates}' WHERE date_from = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Inclusive Dates is updated to {$dates}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Inclusive Date Of Attendance To"){
				$dates = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_work SET date_to = '{$dates}' WHERE date_to = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Inclusive Dates is updated to {$dates}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Position Title"){
				$position = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_work SET position = '{$position}' WHERE position = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Position Title is updated to {$position}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Department"){
				$department = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_work SET department = '{$department}' WHERE department = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Department is updated to {$department}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Monthly Salary"){
				$monthly = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_work SET monthly_salary = '{$monthly}' WHERE monthly_salary = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Monthly Salary is updated to {$monthly}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Salary Grade"){
				$salary = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_work SET salary_grade = '{$salary}' WHERE salary_grade = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Salary Grade is updated to {$salary}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Status Of Appointment"){
				$appointment = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_work SET appointment = '{$appointment}' WHERE appointment = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Status Of Appointment is updated to {$appointment}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Government Service"){
				$service = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_work SET service = '{$service}' WHERE service = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Government Service is updated to {$service}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-voluntary'])){
			$data = $_POST['data'];
			$ref = $data[0];
			
			if($data[1][0]['name'] == "field_Inclusive Date Of Attendance From"){
				$dates = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_voluntary SET date_from = '{$dates}' WHERE date_from = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Inclusive Dates is updated to {$dates}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Inclusive Date Of Attendance To"){
				$dates = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_voluntary SET date_to = '{$dates}' WHERE date_to = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Inclusive Dates is updated to {$dates}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Inclusive Dates"){
				$date = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_voluntary SET inclusive_date = '{$date}' WHERE inclusive_date = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Inclusive Dates are updated to {$date}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Number of hours"){
				$hours = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_voluntary SET hours = '{$hours}' WHERE hours = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Number of hour is updated to {$hours}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Position"){
				$position = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_voluntary SET position = '{$position}' WHERE position = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Position is updated to {$position}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-training'])){
			$data = $_POST['data'];
			$ref = $data[0];
			
			if($data[1][0]['name'] == "field_Title of seminar"){
				$title = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_training SET title = '{$title}' WHERE title = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Title of seminar is updated to {$title}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Inclusive Date Of Attendance From"){
				$dates = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_training SET date_from = '{$dates}' WHERE date_from = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Inclusive Dates is updated to {$dates}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Inclusive Date Of Attendance To"){
				$dates = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_training SET date_to = '{$dates}' WHERE date_to = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Inclusive Dates is updated to {$dates}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Number of hours"){
				$hours = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_training SET hours = '{$hours}' WHERE hours = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Number of hour is updated to {$hours}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Conducted/Sponsored by"){
				$conducted = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_training SET conducted = '{$conducted}' WHERE conducted = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Conducted/Sponsored is updated to {$conducted}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-skills'])){
			$data = $_POST['data'];
			$ref = $data[0];
			
			if($data[1][0]['name'] == "field_Special skills/Hobbies"){
				$skill = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_skills SET skills = '{$skill}' WHERE skills = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Special Skill is updated to {$skill}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-nonAcademic'])){
			$data = $_POST['data'];
			$ref = $data[0];
			
			if($data[1][0]['name'] == "field_Non-Academic distinctions/Organization"){
				$non_academic = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_non_academic SET non_academic = '{$non_academic}' WHERE non_academic = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Non-Academic Distinction is updated to {$non_academic}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-membership'])){
			$data = $_POST['data'];
			$ref = $data[0];
			
			if($data[1][0]['name'] == "field_Membership in organization/Association"){
				$membership = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_membership SET membership = '{$membership}' WHERE membership = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Membership in organization/Association is updated to {$membership}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-questions'])){
			$data = $_POST['data'];
			$ref = $data[0];
			
			if($data[1][0]['name'] == "field_Within the third degree(for National Government Employees):appointing authority, recomendiing authority, chief of office/bureau/department or person who has immediate supervision on you in the Office, Bureau or Deaprtment where you will be apointed?"){
				$YN = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 36A_YN = '{$YN}' WHERE 36A_YN = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Question is updated to {$YN}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Details 36 A"){
				$details = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 36A_details = '{$details}' WHERE 36A_details = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Details is updated to {$details}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Within the fourth degree(for Local Government Employees)appointing authority, recommending authority where you will be apointed?"){
				$question = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 36B_YN = '{$question}' WHERE 36B_YN = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"36B_YN is updated to {$question}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Details 36 B"){
				$details = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 36B_details = '{$details}' WHERE 36B_details = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Details is updated to {$details}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Have you ever been formally charged?"){
				$question = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 37A_YN = '{$question}' WHERE 37A_YN = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"36B_YN is updated to {$question}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Details 37 A"){
				$details = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 37A_details = '{$details}' WHERE 37A_details = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Details is updated to {$details}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Have you ever been guilty of any administrative offense?"){
				$question = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 37B_YN = '{$question}' WHERE 37B_YN = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"36B_YN is updated to {$question}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Details 37 B"){
				$details = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 37B_details = '{$details}' WHERE 37B_details = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Details is updated to {$details}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Have you ever been convicted of any crime or violation of any law, decree, ordinance or regulation by any court or tribunal?"){
				$question = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 38_YN = '{$question}' WHERE 38_YN = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"36B_YN is updated to {$question}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Details 38"){
				$details = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 38_details = '{$details}' WHERE 38_details = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Details is updated to {$details}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Have you ever been separated from the service in any following modes: resignation, retirement, dropped from the rolls, dismissal, terminantion, end of term, finished contract AWOL or phase out in the public or private sector?"){
				$question = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 39_YN = '{$question}' WHERE 39_YN = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"36B_YN is updated to {$question}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Details 39"){
				$details = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 39_details = '{$details}' WHERE 39_details = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Details is updated to {$details}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Have you been candidate in a national or local election(exept Brangay election)?"){
				$question = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 40_YN = '{$question}' WHERE 40_YN = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"36B_YN is updated to {$question}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Details 40"){
				$details = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 40_details = '{$details}' WHERE 40_details = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Details is updated to {$details}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Are you a member of any indigenous group?"){
				$question = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 41A_YN = '{$question}' WHERE 41A_YN = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"36B_YN is updated to {$question}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Details 41 A"){
				$details = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 41A_details = '{$details}' WHERE 41A_details = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Details is updated to {$details}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Are you differently abled?"){
				$question = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 41B_YN = '{$question}' WHERE 41B_YN = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"36B_YN is updated to {$question}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Details 41 B"){
				$details = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 41B_details = '{$details}' WHERE 41B_details = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Details is updated to {$details}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Are you a solo parent?"){
				$question = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 41C_YN = '{$question}' WHERE 41C_YN = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"36B_YN is updated to {$question}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			elseif($data[1][0]['name'] == "field_Details 41 C"){
				$details = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_questions SET 41C_details = '{$details}' WHERE 41C_details = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Details is updated to {$details}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			
		}

		if(isset($_GET['update-references'])){
			$data = $_POST['data'];
			$ref = $data[0];
			
			if($data[1][0]['name'] == "field_Name"){
				$name = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_references SET name = '{$name}' WHERE name = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Name is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Address"){
				$address = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_references SET address = '{$address}' WHERE address = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Address is updated to {$address}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Telephone Number"){
				$tel = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_references SET tel = '{$tel}' WHERE tel = '{$ref}';");
				if($query->execute()){
					$log = $function->log2($ref,"Telephone Number is updated to {$tel}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-travel'])){
			$data = $_POST['data'];
			$user = $data[0];

			if($data[1][0]['name'] == "field_Date"){
				$date = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_travel SET my_date = '{$date}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Date is updated to {$date}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Name"){
				$name = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_travel SET name = '{$name}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Name is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Position"){
				$position = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_travel SET position = '{$position}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Position is updated to {$position}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Section"){
				$section = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_travel SET section = '{$section}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Section is updated to {$section}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Destination"){
				$destination = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_travel SET destination = '{$destination}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Destination is updated to {$destination}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Date/Time of Departure"){
				$departure = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_travel SET departure = '{$departure}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Departure is updated to {$departure}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Date/Time of Arrival"){
				$arrival = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_travel SET arrival = '{$arrival}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Arrival is updated to {$arrival}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Purpose"){
				$purpose = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_travel SET purpose = '{$purpose}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Purpose is updated to {$purpose}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Persons to be contacted"){
				$person = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_travel SET contacted = '{$person}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"person is updated to {$person}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}

		}

		if(isset($_GET['update-adminStatus'])){
			$data = $_POST['data'];
			$user = $data[0];

			if($data[1][0]['name'] == "field_Status"){
				$status = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_travel SET status = '{$status}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Status is updated to {$status}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Due To"){
				$due = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_travel SET due = '{$due}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Due To is updated to {$due}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}

		}

		if(isset($_GET['update-adminLeave'])){
			$data = $_POST['data'];
			$user = $data[0];

			if($data[1][0]['name'] == "field_Approved For(Day with pay)"){
				$pay = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET with_pay = '{$pay}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Pay is updated to {$pay}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Approved For(Day without pay)"){
				$pay = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET without_pay = '{$pay}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Pay is updated to {$pay}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Approved For(Other(Specify))"){
				$other = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET other_specify = '{$other}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Other is updated to {$other}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Recommendation"){
				$recommendation = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET status = '{$recommendation}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Recommendation is updated to {$recommendation}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Due To"){
				$due = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET recommendation_due_to = '{$due}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Due is updated to {$due}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Due"){
				$due = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET due_to = '{$due}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Due To is updated to {$due}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}

		}

		if(isset($_GET['update-saln'])){
			$data = $_POST['data'];
			$user = $data[0];

			if($data[1][0]['name'] == "field_Name"){

				$query = $function->PDO(false,"UPDATE tbl_saln_personalInfo  SET lname = '{$data[1][0]['value']}', fname = '{$data[1][1]['value']}', minitial = '{$data[1][2]['value']}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Name is updated to {$data[1][0]['value']} {$data[1][1]['value']} {$data[1][2]['value']}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Address"){
				$address = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_personalInfo SET address = '{$address}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Address is updated to {$address}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Position"){
				$position = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_personalInfo SET position = '{$position}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Position is updated to {$position}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Office/Agency"){
				$agency = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_personalInfo SET agency = '{$agency}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Office/Agency is updated to {$agency}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Office Address"){
				$office = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_personalInfo SET office_address = '{$office}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Office Address is updated to {$office}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Spouse Last Name"){
				$name = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_personalInfo SET s_lname = '{$name}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"name is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Spouse First Name"){
				$name = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_personalInfo SET s_fname = '{$name}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"name is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Spouse Middle Initial"){
				$name = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_personalInfo SET s_minitial = '{$name}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"name is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Spouse Position"){
				$position = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_personalInfo SET s_position = '{$position}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Position is updated to {$position}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Spouse Agency/Office"){
				$agency = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_personalInfo SET s_agency = '{$agency}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Agency is updated to {$agency}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Spouse Office Address"){
				$office = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_personalInfo SET s_office_address = '{$office}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Office is updated to {$office}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			

		}

		if(isset($_GET['update-unmarried'])){
			$data = $_POST['data'];
			$user = $data[0];

			if($data[1][0]['name'] == "field_Name Of Child"){
				$name = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_unmarried_child SET name = '{$name}' WHERE name = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Name of Child is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Date Of Birth"){
				$dob = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_unmarried_child SET dob = '{$dob}' WHERE dob = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"dob is updated to {$dob}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Age"){
				$age = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_unmarried_child SET age = '{$age}' WHERE age = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Age is updated to {$age}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-real'])){
			$data = $_POST['data'];
			$user = $data[0];

			if($data[1][0]['name'] == "field_Description"){
				$description = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_real SET description = '{$description}' WHERE description = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Description is updated to {$description}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Kind"){
				$kind = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_real SET kind = '{$kind}' WHERE kind = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Kind is updated to {$kind}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Exact Location"){
				$location = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_real SET location = '{$location}' WHERE location = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Location is updated to {$location}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Assessed Value"){
				$assesesed = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_real SET assessed = '{$assesesed}' WHERE assessed = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Assesesed is updated to {$assesesed}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Current Fair Market Value"){
				$current = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_real SET current = '{$current}' WHERE current = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"current is updated to {$current}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Acqusition Year"){
				$year = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_real SET acquisition_year = '{$year}' WHERE acquisition_year = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Year is updated to {$year}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Acqusition Mode"){
				$mode = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_real SET acquisition_mode = '{$mode}' WHERE acquisition_mode = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Mode is updated to {$mode}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Acqusition Cost"){
				$cost = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_real SET acquisition_cost = '{$cost}' WHERE acquisition_cost = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Cost is updated to {$cost}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-personal'])){
			$data = $_POST['data'];
			$user = $data[0];

			if($data[1][0]['name'] == "field_Description"){
				$description = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_personal SET description = '{$description}' WHERE description = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Description is updated to {$description}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Year Acquired"){
				$year = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_personal SET year = '{$year}' WHERE year = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Year is updated to {$year}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Acquisition Cost/Amount"){
				$cost = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_personal SET cost = '{$cost}' WHERE cost = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Cost is updated to {$cost}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-liabilities'])){
			$data = $_POST['data'];
			$user = $data[0];

			if($data[1][0]['name'] == "field_Nature"){
				$nature = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_liabilities SET nature = '{$nature}' WHERE nature = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Nature is updated to {$nature}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Name Of Creditors"){
				$creditors = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_liabilities SET creditors = '{$creditors}' WHERE creditors = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Creditors is updated to {$creditors}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Outstanding Balance"){
				$balance = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_liabilities SET balance = '{$balance}' WHERE balance = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Balance is updated to {$balance}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}	
		}

		if(isset($_GET['update-business'])){
			$data = $_POST['data'];
			$user = $data[0];

			if($data[1][0]['name'] == "field_Name Of Entity"){
				$entity = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_business SET name = '{$entity}' WHERE name = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Entity is updated to {$entity}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Business Address"){
				$address = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_business SET address = '{$address}' WHERE address = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Address is updated to {$address}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Nature Of Business"){
				$nature = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_business SET nature = '{$nature}' WHERE nature = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Nature is updated to {$nature}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}	
			else if($data[1][0]['name'] == "field_Date Of Acquisition Of Interests"){
				$interest = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_business SET date_interest = '{$interest}' WHERE date_interest = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"interest is updated to {$interest}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}	
		}

		if(isset($_GET['update-relatives'])){
			$data = $_POST['data'];
			$user = $data[0];

			if($data[1][0]['name'] == "field_Name Of Relative"){
				$relative = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_relatives SET name = '{$relative}' WHERE name = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Relative is updated to {$relative}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Relationship"){
				$relationship = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_relatives SET relationship = '{$relationship}' WHERE relationship = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Relationship is updated to {$relationship}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Position"){
				$position = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_relatives SET position = '{$position}' WHERE position = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Position is updated to {$position}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}	
			else if($data[1][0]['name'] == "field_Name Of Agency/Office And Address"){
				$agency = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_relatives SET agency = '{$agency}' WHERE agency = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Agency is updated to {$agency}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}	
		}

		if(isset($_GET['update-salnOther'])){
			$data = $_POST['data'];
			$user = $data[0];

			if($data[1][0]['name'] == "field_Date"){
				$relative = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_other SET dates = '{$relative}' WHERE dates = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Date is updated to {$relative}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Declarant Government Issued ID"){
				$governmentIssued = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_other SET goverment_issued = '{$governmentIssued}' WHERE goverment_issued = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Goverment Issued is updated to {$governmentIssued}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Declarant ID No."){
				$number = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_other SET id_number = '{$number}' WHERE id_number = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"ID Number is updated to {$number}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}	
			else if($data[1][0]['name'] == "field_Declarant Date Issued"){
				$date = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_other SET date_issued = '{$date}' WHERE date_issued = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Date is updated to {$date}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}	
			else if($data[1][0]['name'] == "field_Co-Declarant/Spouse Government Issued ID"){
				$issued = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_other SET s_goverment_issued = '{$issued}' WHERE s_goverment_issued = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Government Issued is updated to {$issued}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Co-Declarant/Spouse ID No."){
				$number = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_other SET s_id_number = '{$number}' WHERE s_id_number = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"ID Number is updated to {$number}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}	
			else if($data[1][0]['name'] == "field_Co-Declarant/Spouse Date Issued"){
				$date = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_saln_other SET s_date_issued = '{$date}' WHERE s_date_issued = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Date Issued is updated to {$date}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-leave'])){
			$data = $_POST['data'];
			$user = $data[0];

			if($data[1][0]['name'] == "field_Office/Agency"){
				$office = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET office = '{$office}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Office/Agency is updated to {$office}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Last Name"){
				$name = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET lname = '{$name}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Last Name is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_First Name"){
				$name = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET fname = '{$name}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"First Name is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Middle Name"){
				$name = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET mname = '{$name}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Middle Name is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Date of Filling"){
				$filling = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET DateOfFiling = '{$filling}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Date of Filling is updated to {$filling}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Position"){
				$position = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET position = '{$position}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Position is updated to {$position}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Salary"){
				$salary = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET salary = '{$salary}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Salary is updated to {$salary}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Type of Leave"){
				$leave = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET type_leave = '{$leave}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Leave is updated to {$leave}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Specify"){
				$leave = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET specify_leave = '{$leave}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Leave is updated to {$leave}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Number of working days"){
				$working = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET working_days = '{$working}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Working days is updated to {$working}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Inclusive Date"){
				$date = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET inclusive_date = '{$date}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"inclusive Date is updated to {$date}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Where leave will be spent"){
				$spent = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET spent = '{$spent}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Spent is updated to {$spent}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Specify Where"){
				$specify = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET specify_where = '{$specify}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Specify Where is updated to {$specify}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Commutation"){
				$commutation = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET commutation = '{$commutation}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Commutation is updated to {$commutation}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Certification of leave credits as of"){
				$certification = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET certification = '{$certification}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Certification is updated to {$certification}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Vacation"){
				$vacation = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET vacation = '{$vacation}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Vacation is updated to {$vacation}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Sick"){
				$sick = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET sick = '{$sick}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Sick is updated to {$sick}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Total"){
				$total = $data[1][0]['value'];
				$query = $function->PDO(false,"UPDATE tbl_leave SET total = '{$total}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Total is updated to {$total}.","Update");
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

		    if(isset($_GET['activate-saln'])){
				$user = $function->getUser();
		    	$data = $_POST['data'];
				$query = $function->PDO(false,"UPDATE tbl_saln_personalInfo SET status = '1' WHERE id = '{$data}';");
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

		    if(isset($_GET['deactivate-saln'])){
				$user = $function->getUser();
		    	$data = $_POST['data'];
				$remarks = json_encode($data);
				$query = $function->PDO(false,"UPDATE tbl_saln_personalInfo SET status = '0' WHERE id = '{$data[0]}';");
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