<?php 
	$user_id = $_GET['user_id'];
	include('connect_db.php');
	include('tabgen_php_functions.php');
	//$query="select TabTemplate.Name as Template_Name,TABS.Name as Tab_Name,RoleName from TabTemplate,TABS where RoleName='$role' AND Tab.TabTemplate=TabTemplate.Id";
			
	if($conn){
		if(isUserUniversalAccessRight($conn,$user_id)){// if the user has universal access right
			$temporaryQuery="select TabTemplate.Name as Template_Name,Tab.Name as Tab_Name,RoleName,OrganisationUnit 
					from TabTemplate,Tab,OrganisationUnit 
					where Tab.TabTemplate=TabTemplate.Id 
						and OrganisationUnit.Id=Tab.OUId
					order by Tab.Name";
			$res = $conn->query($temporaryQuery);	
			if($res){
				while($row=$res->fetch(PDO::FETCH_ASSOC)){
					$output[]=$row;
				}
				print(json_encode($output));
			}
			
		}else{
			/*$query="select TabTemplate.Name as Template_Name,Tab.Name as Tab_Name,RoleName,OrganisationUnit 
					from TabTemplate,Tab,OrganisationUnit 
					where Tab.TabTemplate=TabTemplate.Id 
						and OrganisationUnit.Id=Tab.OUId 
						and OrganisationUnit='$org_unit'
						and RoleName='$role'
					order by Tab.Name";*/
			$role = getRoleByUserId($conn,$user_id);
			$ou_id =getOuIdByUserId($conn,$user_id);
			$parent_ou_id = getParentOuId($conn,$ou_id);
			
			$own_tabs=findTabs($conn,$role,$ou_id);
			$parent_tabs=findTabs($conn,$role,$parent_ou_id);
			//echo "Parent OU id: ".$parent_ou_id;
			//print json_encode($own_tabs);
			print json_encode(concate_array($own_tabs,$parent_tabs));
			//print json_encode($parent_tabs);
		}
		
	}
function concate_array($arr1,$arr2){
	$res_arr = array();
	$i=0;
	for($i=0;$i<sizeof($arr1);$i++){
		$res_arr[$i]=$arr1[$i];
	}
	$j=0;
	for($j=0;$j<sizeof($arr2);$j++){
		$res_arr[($i+$j)]=$arr2[$j];
	}
	return $res_arr; 	
}
	
function findTabs($conn,$role,$ou_id){
	$query = "select TabTemplate.Name as Template_Name,Tab.Name as Tab_Name,RoleName,OrganisationUnit
			  from TabTemplate,Tab,OrganisationUnit
			  where Tab.TabTemplate=TabTemplate.Id
			  and OrganisationUnit.Id=Tab.OUId
			  and RoleName='$role' 
			  and OUId='$ou_id'";
	$output = null;
	$res = $conn->query($query);
	if($res){
		while($row=$res->fetch(PDO::FETCH_ASSOC)){
			$output[]=$row;
		}	
	}
	return ($output);
}
//function for getting parent OU Id for an organisation
function getParentOuId($conn,$ou_id){
	$query="select ParentOUId from OUHierarchy where OUId='$ou_id'";
	$res = $conn->query($query);
	$row = $res->fetch(PDO::FETCH_ASSOC);
	return $row['ParentOUId'];
}
// function to get OU Id (which the user belong) by providing user Id
function getOuIdByUserId($conn,$user_id){
	$query="select Users.Id as user_id,Users.Username,Teams.Id as Team_id,Teams.Name as team_name,OrganisationUnit.Id as org_unit_id,OrganisationUnit.OrganisationUnit
			from Users,Teams,OrganisationUnit
			where Teams.Id=Users.TeamId 
			and Teams.Name=OrganisationUnit.OrganisationUnit
			and Users.Id='$user_id'";
	$res = $conn->query($query);
	$row = $res->fetch(PDO::FETCH_ASSOC);
	return $row['org_unit_id'];
}
function getRoleByUserId($conn,$user_id){
	$query="select Roles from Users where Id='$user_id'";
	$res = $conn->query($query);
	$row = $res->fetch(PDO::FETCH_ASSOC);
	return $row['Roles'];
}
?>