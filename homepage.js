/*Javascript code to associate role to a to a tab
Creating Tabs here*/
$(document).ready(function(){	
	//for creating local tabs
	$("#saveAsscRole2Tab").click(function(){
		$("#saveAsscRole2TabResponse").html("<img src='img/loading.gif'/> Wait Please...");
		var orgunit = $("#sel_org_unit_role_tab").val();
		var role = $("#sel_roles").val();
		var tabs = parseInt($("#no_of_tabs").val()); 
		$.ajax({
				type:"POST",
				url:"createTabs.php",
				data:"role_name="+role+"&no_of_tabs="+tabs+"&orgunit="+orgunit,
				success:function(s){
					$("#saveAsscRole2TabResponse").html(s);		
				}
			});
		return false;
	});	
	//for creating global tabs
	$("#saveGlobalTab").click(function(){
		document.getElementById("saveGlobalTabResponse").innerHTML="<p>Under development...</p>";
		return false;
	});
});

/*JavaScript function for getting Tabs and corresponding Templates assigned for respectives roles of a particular organisation*/
function setTabTemplateLayout(){
	document.getElementById("tabs_template_result").innerHTML="<center><img src='img/loading_data.gif'/></center>";
	//getRoles("roleSelect",$("#orgUnitSelect").val());//getRoles(id,orgunit)
	var orgunit = $("#orgUnitSelect").val();
	var user_role = $("#roleSelect").val();
	$.ajax({
		type: "GET",
		url: "getTabsTemplateAssociation.php",
		data: "orgunit="+orgunit+"&role="+user_role,
		success: function(data){
			if(data.trim()=="false"){//the server returns false when no record found
				document.getElementById("tabs_template_result").innerHTML="<center><p>No record found!</P></center>";
			} 
			else
			{
				/*javascript function for parsing json data and displaying layout for Tab Template Association Update*/
				var arr = jQuery.parseJSON(data);// JSON.parse(data)
				var layout="<table class='table table-hover' align='center'>"+
				"<tr><th></th><th>Tabs</th><th>Tab Templates</th><th style='min-width:80px'></th></tr>";
				var role_name="<td></td>";
				/*getting list of templates created by the admin*/
				$.ajax({
					url: "TemplateList.php",
					success: function(list){
						var templateList=" ";
						if(list!="error" || list!="false"){
							var json_arr = jQuery.parseJSON(list);//parsing template json array
							for(var i=0;i<json_arr.length;i++){
								templateList+="<option>"+json_arr[i].name+"</option>";
							}
							for(var i=0;i<arr.length;i++){	
								if(i==0){
									role_name="<td>"+arr[i].RoleName+"</td>";
								}
								else{
									if(arr[i].RoleName!=arr[i-1].RoleName)
										role_name="<td>"+arr[i].RoleName+"</td>";
									else
										role_name="<td></td>";
								}
								layout+="<tr>"+role_name+"<td><span id='tab_name"+i+"'>"+arr[i].Tab_Name+"</span></td>"+
										"<td><select class='form-control'  onchange='clear();'id='template_name"+i+"'><option>"+arr[i].Template_Name+"</option>"+
										templateList+"</select></td>"+
										"<td><Button class='btn btn-default'"+
											" onclick='updateTemplate(\""+i+"\",\""+arr[i].Tab_Name+"\",\""+arr[i].RoleName+"\",\""+arr[i].OrganisationUnit+"\"); return false;'>Update</Button></td>"+
										"<td><span id='update_status"+i+"' style='min-width:30px'></span></td></tr>";
							}
							layout+="<tr><td align='center' colspan='4'>"+
											"<Button type='submit' class='btn btn-default' id='updateAll'>Update All</Button>"+
										"</td></tr></table>";
							document.getElementById("tabs_template_result").innerHTML="<center>"+layout+"</center>";
							
							$("#updateAll").click(function(){
								/*javascrip code for updating tab templates*/
								var j;
								for(j=0;j<arr.length;j++){
									var tab_name = arr[j].Tab_Name;
									var role_name = arr[j].RoleName;
									updateTemplate(j,tab_name,role_name,arr[j].OrganisationUnit);//updating template
								}
								return false;
							});
						}
					}
				});									
			}
		},
		error: function( xhr, status, errorThrown ) {
			document.getElementById("tabs_template_result").innerHTML="<center><p>Sorry, there was a problem! Try again later</P></center>";
		}
	});	
}
//function for updating template
function updateTemplate(i,tab_name,role_name,orgunit){
	var template_name = $("#template_name"+i).val();
	//alert("Role Name: "+role_name+"Tab Name: "+tab_name+"Template Name: "+template_name);
	document.getElementById("update_status"+i).innerHTML="<img src='img/update_icon.gif'></img>";
	$.ajax({
		type: "POST",
		url: "updateTabs.php",
		data: "role_name="+role_name+"&tab_name="+tab_name+"&template_name="+template_name+"&org_unit="+orgunit+"&index="+i,
		success: function(result){
			var result_data = JSON.parse(result);
			if(result_data.state==true)
				document.getElementById("update_status"+result_data.index).innerHTML="<img src='img/positive.png'/>";	
			else
				document.getElementById("update_status"+result_data.index).innerHTML=result_data.response;
		}
	});
}
// clean up update response field
function clear(){
	//document.getElementById("update_status"+i).innerHTML=" ";
	alert("You have changed ");
}


$(document).ready(function (){
	$('#getTabsTemplate').click(function() {
		setTabTemplateLayout();
		return false;
	});
	$('#orgUnitSelect').change(function(){
		setTabTemplateLayout();	
		return false;
	});
	$('#roleSelect').change(function(){
		setTabTemplateLayout();
		return false;
	});	
});


/* script for creating organisation*/
            $(document).ready(function (){
                $('#submit').click(function() {
                    var orgname=$("#orgname").val();
					var display_name =$("#display_name").val();
					$("#error1").css('color', 'black');
                    $("#error1").html("<img src='img/loading.gif'/> Wait a moment please...");
                    $.ajax({
                        type: "POST",
                        url: "createorg.php",
                        data: "orgname="+orgname+"&display_name="+display_name,
                    
                        success: function(s){  
							//alert(s);						  
                            if(s.trim()=="true")
                            {
								$("#error1").css('color', 'green');
								$("#error1").text("Organization Created ");
								viewOrgs("dropdown","orgnamesel","all");/*this will display drop down list of 
								organisation at the popup dialog for creating Organisation Units*/
								viewOrgs("list","showOrgsList","few");
                                
                            }else if(s.trim()=="false"){
								$("#error1").css('color', 'red');
								$("#error1").text("Oops Some Goes Wrong Please Try Agian");
							} 
							else{
								$("#error1").css('color', 'red');
								$("#error1").text(s);
							}
                        }
                    });				
                    return false;
                });
        
            });
			
/*JavaScript for creating organisation unit*/
/*Validating OU name*/
function validate_ou_name(ou_name)
{
	var regexp1=new RegExp("[^a-z]");
	if(regexp1.test(ou_name))
	{
		document.getElementById("error2").innerHTML="<font color='red'>Only alphabets from a to z are allowed, no numbers,"+
		" no capital latters, no whitespaces</font>";
		return false;
	}
	else return true;
}
$(document).ready(function (){
    $('#createorgunitbtn').click(function() {
				//alert('hh');	
            var orgunit=$("#orgunit").val();
			if(validate_ou_name(orgunit)==true){
				$("#error2").html("<div><img src='img/loading.gif'/></div> Wait Please...");
				$("#error2").css('color', 'black');
				var displaynameunit =$("#displaynameunit").val();
				var orgnamesel =$("#orgnamesel").val();
				if(orgunit.length<4){
				$("#error2").css('color', 'red');
				$("#error2").text("Name of organisation unit should be at least 4 characters length");
				}
				else{
						$.ajax({          
							type: "POST",
							url: "createorgunit.php",
							data: "orgnamesel="+orgnamesel+"&displaynameunit="+displaynameunit+"&orgunit="+orgunit,
						
							success: function(e){  
							//alert(e);      
								if(e.trim()=="true")
								{
									$("#error2").css('color', 'green');
									$("#error2").text("Organization Unit Created ");
									viewOrgUnits("list","showOrgUnits","few");
									viewOrgUnits("dropdown","ousel","all");/*this will display drop down list of 
									organisation units at the popup dialog for creating role*/
									viewOrgUnits("dropdown","OrgUnitList","all");/*this will display drop down list of 
									organisation units at the popup dialog for creating users*/  
									viewOrgUnits("dropdown","sel_org_unit_global_tab","all");//displaying for creating global tab
									viewOrgUnits("dropdown","sel_org_unit_role_tab","all");//displaying for creating role tab
									viewOrgUnits("dropdown","orgUnitSelect","all");
									getRoles("roleSelect",$("#orgUnitSelect").val());
								}else if(e.trim()=="false"){
									$("#error2").css('color', 'red');
									$("#error2").text("Oops Some Goes Wrong Please Try Agian");
								}
								else{
									$("#error2").css('color', 'red');
									$("#error2").text(e);
								}
							}
						});
				}
			}		
			return false;
    });
	$('#createorgunit').on('hidden.bs.modal', function () {
		$("#error2").text("");
	});
});
		
/* Javascript for creating roles*/
    $(document).ready(function (){
		$('#createrole').on('hidden.bs.modal', function () {
			$("#error3").text(" ");
		});
        $('#btnrole').click(function() {
			var rolaname=$("#rolaname").val();
			var ousel =$("#ousel").val();
			//var access =document.getElementById("access_yes").checked;
			//var access =$("#access_yes").val();
			var role_type=$("#roletype").val();
			$("#error3").html("<div><img src='img/loading.gif'/></div> Wait Please...");
			$("#error3").css('color','black');
			$.ajax({
                type: "POST",
                url: "createrole.php",
                data: "rolaname="+rolaname+"&ousel="+ousel+"&role_type="+role_type,    
                success: function(e){ 
					if(e.trim()=="true")
                    {
						$("#error3").css('color','green');
						$("#error3").text("Role Created ");
						viewOrgUnits("dropdown","OrgUnitList","all");/*this will display drop down list of 
						organisation units at the popup dialog for creating users*/
						getRoles("sel_roles",$("#sel_org_unit_role_tab").val());//to display role in Associate Role to Tab
						getRoles("roleSelect",$("#orgUnitSelect").val());//to display role at Tab to TabTemplate
                        getRoles("UserRole",$("#OrgUnitList").val()); //to display role in creating user        
                    }else if(e.trim()=="false"){
						$("#error3").css('color','red');
						$("#error3").text("Oops Some Goes Wrong Please Try Agian");
					}
					else{
						$("#error3").css('color','red');
						$("#error3").text(e);
					}
                }
            });
            return false;
        });
	});
	
/*JavaScript for creating users*/
	$(document).ready(function(){
		$('#CreateUser').click(function(){
			var username = $("#username").val();
			var password = $("#password").val();
			var conf_pwd = $("#conf_pwd").val();
			var email = $("#email").val();
			var org_unit = $("#OrgUnitList").val();
			var user_role = $("#UserRole").val();
			var is_universal = document.getElementById("universal_access_yes").checked;//if the user has access across all other OU
			//var type = true;
			if(username.length==0){
				document.getElementById("error4").innerHTML="Username is blank";
				document.getElementById("error4").style.color="green";
				return false;
			}
			else if(password.length==0){
				document.getElementById("error4").innerHTML="Password is blank";
				document.getElementById("error4").style.color="green";
				return false;
			}
			else if(conf_pwd.length==0){
				document.getElementById("error4").innerHTML="Confirm Password is blank";
				document.getElementById("error4").style.color="green";
				return false;
			}
			else if(conf_pwd!=password){
				document.getElementById("error4").innerHTML="Confirm Password does not match with the password";
				document.getElementById("error4").style.color="green";
				return false;
			}
			else if(email.length==0){
				document.getElementById("error4").innerHTML="Email is blank";
				document.getElementById("error4").style.color="green";
				return false;
			}
			else{
				document.getElementById("error4").innerHTML="<div><img src='img/loading.gif'/></div> Wait Please....";
				document.getElementById("error4").style.color="green";
				$.ajax({
					type: "POST",
					url: "createUsers.php",
					data:"username="+username+"&password="+password+"&conf_pwd="+conf_pwd+
							"&email="+email+"&org_unit="+org_unit+"&Role="+user_role+"&type="+is_universal,    
					success: function(e){  
						if(e.trim()=="true")
						{
							$("#error4").css('color','green');
							$("#error4").text("User Created ");
									
						}else if(e.trim()=="false"){
							$("#error4").css('color','red');
							$("#error4").text("Oops Some Goes Wrong Please Try Agian");
						}
						else{
							$("#error4").css('color','red');
							$("#error4").text(e);
						}
					}
				});
			}
			return false;
		});
	
	});
	
/*JavaScript for finding organisation */		
	$(document).ready(function(){
		$("#search_org").click(function(){
			var org_name = $('#org_name').val();
			$("#find_org_msg").text("Wait please...");
			$.ajax({
				type:"POST",
				url: "find_org.php",
				data: "name="+org_name,
				success: function(e){
						$("#find_org_msg").text(e);
				}
			});
			return false;
		});
	});
/*JavaScript for viewing list of organisation unit*/	
/* Here in this function, 
	"method" --> specifies what type of displaying method i.e.whether the data will be displayed in dropdown manner or simply in html list.
				 This parameter must have only two possible values "list" & "dropdown"
	"id"	 --> specifies the id of the html tag where the retrieved data will be displayed.
	"type"	 --> specifies whether to view only few data or all data, it has only two possible values: 
					"few" --> to display only few list of data &
					"all" --> to display all list of data*/
	function viewOrgUnits(method,id,type){		
			$.ajax({
				type:"GET",
				url: "view_org_unit_list.php",
				//data: "method="+method+"&viewType="+type,
				success: function(data){
					var view=" ";
					var limit=0;				
					if(data.trim()=="error"){
						view=" ";
						document.getElementById(id).innerHTML="<tr><td>We are very sorry that an error occurs, please try again after sometime</td></tr>";
					}
					else{
						var json_arr = JSON.parse(data);
						if(type=="all")
							limit=json_arr.length;
						else {
							limit=(json_arr.length>4?4:json_arr.length);
						}
						if(method=="list"){
							for(var i=0;i<limit;i++){
								view+='<tr><td>'+json_arr[i].organisation_unit+'</td><td align="right">'+
								'<Button type="button" class="btn btn-warning"'+
								' onclick="setDelAction4OrgUnit(\''+json_arr[i].id+'\',\''+json_arr[i].organisation_unit+'\')" id="del_org_unit'+i+'">'+
								'Delete</Button></td></tr>';
							}
						}
						else if(method=="dropdown"){
							for(var i=0;i<limit;i++){
								view+="<option>"+json_arr[i].organisation_unit+"</option>";
							}
						}
					}
					document.getElementById(id).innerHTML=view;
				},
				error: function(x,y,z){
					if(method=="list"){
						document.getElementById(id).innerHTML="<tr><td>We are very sorry that an error occurs, please try again after sometime</td></tr>";
					}
				}
			});
			return false;
	}
	$(document).ready(function(){
		$("#viewAllOrgUnitLists").click(function(){
			document.getElementById("showOrgUnits").innerHTML="<center><img src='img/loading_data.gif'/></center>";
			viewOrgUnits("list","showOrgUnits","all");
		});
	});
	function setDelAction4OrgUnit(id,ou_name){
		var confirm_val = confirm("Are you sure to delete "+ou_name+"?");
		if(confirm_val==true)
		$.ajax({
			type: "POST",
			url: "delete_ou.php",
			data: "org_unit_id="+id,
			success: function(resp){
				if(resp.trim()=="false"){
					alert("Unable to delete Organisation Unit");
				}
				else{
					viewOrgUnits("list","showOrgUnits","all");
				}
			},
			error: function(x,y,z){
				alert("Oops! an error occur.");
			}
		});
	}

/*JavaScript for viewing list of organisations*/	
/* Here in this function, 
	"method" --> specifies what type of displaying method i.e.whether the data will be displayed in dropdown manner or simply in html list.
				 This parameter must have only two possible values "list" & "dropdown"
	"id"	 --> specifies the id of the html tag where the retrieved data will be displayed.
	"type"	 --> specifies whether to view only few data or all data, it has only two possible values: 
					"few" --> to display only few list of data &
					"all" --> to display all list of data*/
	function viewOrgs(method,id,type){
			$.ajax({
				type:"GET",
				url: "view_org_list.php",
				//data: "method="+method+"&viewType="+type,
				success: function(data){
					var view=" ";
					var limit=0;				
					if(data.trim()=="error"){
						view=" ";
						document.getElementById(id).innerHTML="<tr><td>We are very sorry that an error occurs, please try again after sometime.</td></tr>";
					}
					else{
						var json_arr = JSON.parse(data);
						if(type=="all")
							limit=json_arr.length;
						else{ 
							limit=json_arr.length>4?4:json_arr.length;
						}
						if(method=="list"){
							for(var i=0;i<limit;i++){
								view+="<tr><td>"+json_arr[i].name+"</td><td align='right'>"+
								"<Button type='button' class='btn btn-warning'"+
								"onclick='setDelAction4Org(\""+json_arr[i].id+"\",\""+json_arr[i].name+"\"); return false;' id='del_org"+i+"'>"+
								"Delete</Button></td></tr>";
							}
						}
						else if(method=="dropdown"){
							for(var i=0;i<limit;i++){
								view+="<option>"+json_arr[i].name+"</option>";
							}
						}
					}
					document.getElementById(id).innerHTML=view;
				},
				error: function(x,y,z){
					if(method=="list"){
						document.getElementById(id).innerHTML="<tr><td>We are very sorry that an error occurs, please try again after sometime</td></tr>";
					}
				}
			});
			return false;
	}
	$(document).ready(function(){
		$("#viewAllOrgLists").click(function(){
			document.getElementById("showOrgsList").innerHTML="<center><img src='img/loading_data.gif'/></center>";
			viewOrgs("list","showOrgsList","all");
		});
	});
	function setDelAction4Org(id,org_name){
		var confirm_val = confirm("Are you sure to delete "+org_name+"?");
		if(confirm_val==true)
		$.ajax({
			type: "POST",
			url: "delete_org.php",
			data: "org_id="+id,
			success: function(resp){
				if(resp.trim()=="false"){
					alert("Unable to delete Organisation Unit");
				}
				else{
					viewOrgs("list","showOrgsList","all");
					viewOrgUnits("list","showOrgUnits","all");
					window.reload();
				}
			},
			error: function(x,y,z){
				alert("Oops! an error occur.");
			}
		});
	}
	
/*Javascript for creating templates*/
$(document).ready(function(){
		$("#createTemplate").click(function(){
			$("#createTemplateResponse").html("<img src='img/loading_data.gif'/>");
			var template_name = $("#templateName").val();
			var	template = $("#template").val();
			$.ajax({
				type:"POST",
				url:"createTemplate.php",
				data: "template_name="+template_name+"&template="+template,
				success: function(resp){
					$("#createTemplateResponse").text(resp);
					//viewTemplates("dropdown","SelectTemplate","all");
					//window.alert(resp);
					setAssocRole2TabLayout();
				}
			});
			return false;
		});
	});
	
/* Javascript function for viewing list of templates, Here in this function, 
	"method" --> specifies what type of displaying method i.e.whether the data will be displayed in dropdown manner or simply in html list.
				 This parameter must have only two possible values "list" & "dropdown"
	"id"	 --> specifies the id of the html tag where the retrieved data will be displayed.
	"type"	 --> specifies whether to view only few data or all data, it has only two possible values: 
					"few" --> to display only few list of data &
					"all" --> to display all list of data*/
	function viewTemplates(method,id,type){
			$.ajax({
				type:"GET",
				url: "TemplateList.php",
				data: "method="+method+"&viewType="+type,
				success: function(e){
					document.getElementById(id).innerHTML=document.getElementById(id).value+e;	
				}
			});
			return false;
	}
	
	function setTemplates(existingData,method,id,type){
			$.ajax({
				type:"GET",
				url: "TemplateList.php",
				data: "method="+method+"&viewType="+type,
				success: function(e){
					document.getElementById(id).innerHTML=existingData+e;	
				}
			});
			return false;
	}
	
	function getRoles(id,orgunit){
			$.ajax({
				type:"GET",
				url: "getRoles.php",
				data: "org_unit="+orgunit,
				success: function(data){
					if(data.trim()=="false"){
						document.getElementById(id).innerHTML="<option></option>";
					}
					else{
						var arr = JSON.parse(data);
						var roleList=" ";
						for(var i=0;i<arr.length;i++){
							roleList+="<option>"+arr[i].RoleName+"</option>";
						}
						document.getElementById(id).innerHTML=roleList;
					}
				},
				error: function(x,y,z){
					document.getElementById(id).innerHTML="<option></option>";
					//alert("Error in connecting server. Try again later.");
				}
			});
			//alert("Hi fff"+orgunit);
			return false;
	}
	$(document).ready(function(){
		$("#sel_org_unit_role_tab").change(function(){
			getRoles("sel_roles",$("#sel_org_unit_role_tab").val());
		});
		$("#orgUnitSelect").change(function(){
			getRoles("roleSelect",$("#orgUnitSelect").val());
		});
	});
	
	
	

