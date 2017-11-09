var myApp=angular.module("myApp",[]);
myApp.controller("myCtrl",function($scope,$http){
	$scope.search='';
	$scope.selectnew='';
$scope.c={
name:'',
size:0
};
$scope.switcher=0;
$scope.index=-1;
$scope.n={
firstname:'',
lastname:'',
type:'',
course:''
};

$scope.cdata=[];

$scope.course=[["CHEMISTRY","BIOLOGY","PSYCHOLOGY","MARINE BIOLOGY","PHILOSOPHY","LIBERAL ARTS"],
["ARCHITECTURE","FINE ARTS","ARTS"],
["MECHANICAL ENGINEERING","COMPUTER ENGINEERING","CIVIL ENGINEERING","ELECTRICAL ENGINEERING"],
["ACCOUNTANCY","MANAGEMENT","LAW"],
["COMPUTER SCIENCE","MATH","APPLIED MATH"]
];

$scope.getcourse =function (){
	var index=-1;
	switch($scope.n.department){
	case "ARTS AND SCIENCES":index =0;
	break;
	case "CAFFA": index =1;
	break;
	case "ENGINEERING":index =2;
	break;
	case "LAW AND ECONOMICS":index=3;
	break;
	case "MATH AND COMPUTER SCIENCE":index =4;
	break;
	}
	var text="<option></option>";
	if(index>-1){
	for(x=0;x<$scope.course[index].length;x++)
	text+="<option value'"+$scope.course[index][x]+"'>"+$scope.course[index][x]+"</option>";
	}
	$("#incourse").html(text);
}
		
		
$scope.hide=function(){
$("#person").css("display","none");
$("#classlist").css("display","none");
};

$scope.showcourse=function(){
	$("#course").css("display","none");	
if($scope.n.type!='' && $scope.n.type=="STUDENT")
$("#course").show();
}

$scope.createnew=function(){	
$("#course").css("display","none");	
$("#classlist").css("display","none");
$("#person").css("display","none");

if($scope.selectnew!=''){

if($scope.selectnew=="Classlist"){
$scope.cstudents=[];
$scope.c.size=0;
$scope.c.limit=1;
$("#classlist").show();
}
else{
$("#person").show();
if($scope.n.type=="Student")
$("#course").show();
$("#submitnew").show();
$("#update").css("display","none");
}
}
};
$scope.studclass=function(index){
var checkbox=document.getElementsByClassName("checkbox");
var value=parseInt(checkbox[index].value);
var i = $scope.cstudents.indexOf(value);
var state=0;
var add=-1; 
	if(i  < 0 ){
		$scope.cstudents.push(value);
		add=1;
	}
	else
		$scope.cstudents.splice(i,1);
	
	$scope.c.size+=add;
	if($scope.c.limit==0)
		$scope.c.limit+=1;
	if($scope.c.size==$scope.c.limit)
	state=1;

	for(i=0;i<checkbox.length;i++){
	if($scope.cstudents.indexOf(parseInt(checkbox[i].value)) < 0)
	checkbox[i].disabled=state;
	}
};


$scope.expandlist = function(){
var checkbox=document.getElementsByClassName("checkbox");	
var state=0;
if($scope.c.size == $scope.c.limit)
	state=1;
	for(i=0;i<checkbox.length;i++){
	if($scope.cstudents.indexOf(parseInt(checkbox[i].value)) < 0)
	checkbox[i].disabled=state;
	}
};

$scope.edit=function(index){
	$("#classlist").css("display","none");
	$("#person").show();
	$("#submitnew").css("display","none");
	$("#update").show();
	$("#course").css("display","none");
	$scope.index=index;
	$scope.n=Object.assign({},$scope.data[index]);
	$scope.n.datestarted=parseInt($scope.n.datestarted);
	$scope.n.dateofbirth=new Date($scope.n.dateofbirth);
	if($scope.n.type=="STUDENT")
	$("#course").show();
};

$scope.update=function(){
	if($scope.n.firstname.length>0 && $scope.n.lastname.length >0 && $scope.n.datestarted && $scope.n.dateofbirth && $scope.data[$scope.index]!=null && $scope.n.department){
	var message= "Update Successful"
	var oldtype=$scope.data[$scope.index].type;
	if($scope.n.type=="PROFESSOR")
	$scope.n.course='';
	console.log($scope.n);
	toupper();
	
	$http.put("/api/Person/"+$scope.data[$scope.index]._id,$scope.n).success(function(response){
		if(response!="err"){
		$scope.data[$scope.index]=response;
		$scope.data[$scope.index].dateofbirth=$scope.data[$scope.index].dateofbirth.slice(0,10);
		updteclassstud();
		updteclassprof();
		var src=0;
		var trget=0;
		if(response.type=="PROFESSOR")
		trget=1;
		if(oldtype=="PROFESSOR")
		src=1;
		$scope.getcourse;
		var i = $scope.type[src].indexOf($scope.index);
		$scope.type[src].splice(i,1);
		for(i=0;i<$scope.type[trget].length && $scope.type[trget][i]<$scope.index;i++);
		for(z=$scope.type[trget].length-1;z>i;z--)
			$scope.type[trget][z+1]=$scope.type[trget][z];
			$scope.type[trget][i]=$scope.index;
		}
		else
		message="Duplication of Names with another Person";
		alert(message);
		$("#person").css("display","none");
	});
	}
	else{
		if($scope.data[$scope.index]==null)
		alert("Person Has been Deleted and is no longer in the Mongodb");
		else
		alert("Missing Input");
	}
	$("#person").css("display","none");
};

$scope.del=function(index){
console.log($scope.data[index]);
$http.delete("/api/PersonDelete/"+$scope.data[index]._id).success(function(response){
var alrt="Person Deleted";
if(!response){
var src=0;
if($scope.data[index].type == "PROFESSOR")
src=1;
$scope.data.splice(index,1);	
$scope.type[0]=[];
$scope.type[1]=[];
splittype();
updteclassprof();
updteclassstud();
}
else 
alrt="Operation Failed Something  Went Wrong";
alert(alrt);
});
$("#classlist").css("display","none");
};

function toupper(){
	$scope.n.firstname=$scope.n.firstname.toUpperCase();
	$scope.n.lastname=$scope.n.lastname.toUpperCase();
	$scope.n.name=$scope.n.firstname+'  '+$scope.n.lastname;
}

$scope.add=function(){
	if($scope.n.firstname.length>0 && $scope.n.lastname.length>0 && $scope.n.datestarted&& $scope.n.dateofbirth){
	if($scope.n.type=="PROFESSOR")
		$scope.n.course='';
	toupper();
	 $scope.insert={
	name:$scope.n.name,
	firstname:$scope.n.firstname,
	lastname:$scope.n.lastname,
	department:$scope.n.department,
	course:$scope.n.course,
	gender:$scope.n.gender,
	datestarted:$scope.n.datestarted,
	dateofbirth:$scope.n.dateofbirth,
	type:$scope.n.type
	};
	
	$http.post("/api/Person",$scope.insert).success(function(response){
	var alrt="Person Added";
	if(response!="err"){
	response.dateofbirth=response.dateofbirth.slice(0,10)
	$scope.data.push(response);
	if(response.type=="STUDENT")
	ndx=0;
	else
	ndx=1;
	for(x=0;x<$scope.type[ndx].length && x<$scope.type[ndx][x]<$scope.data.length-1;x++);
	for(z=$scope.type[ndx].length-1;z>x;z--)
		$scope.type[ndx][z+1]=$scope.type[ndx][z];
		$scope.type[ndx][x]=$scope.data.length-1
	console.log(response);
	$scope.getcourse;
	}
	else
	alrt="Person Already Adedd in Mongodb";
	alert(alrt);
	});
	}
	else
	alert("Missing Input");
	$("#person").css("display","none");
};

$http.get("/api/Person").success(function(response){
		$scope.data=response;
		$scope.type=[[],[]];
		splittype();
		console.log($scope.data);
	});
	
	function splittype(){
		for(i=0;i<$scope.data.length;i++){
			var index=1;
			$scope.data[i].dateofbirth=$scope.data[i].dateofbirth.slice(0,10);
			if($scope.data[i].type=="STUDENT")
			index=0;
			for(x=0;x<$scope.type[index].length && $scope.type[index][x] < i;x++);
			for(z=$scope.type[index].length-1;z>x;z--)
			$scope.type[index][z+1]=$scope.type[index][z];
			$scope.type[index][x]=i;
	}
	};
	
	$scope.view =function(){
		if($scope.selectnew!=''){
		if($scope.selectnew=="Classlist")
		get_class();
		$("#Person").css("display","none");
		$("#Classlist").css("display","none");
		$('#'+$scope.selectnew).show();
		}
	};
	
	function get_class(){
	if($scope.cdata.length<1){
	$http.get("/api/Class").success(function(response){
	$scope.cdata=response;
		updteclassprof();
		updteclassstud();
	});
	}
	console.log($scope.cdata);
	};
	
	$scope.viewstudents=function(index){
	$scope.switcher=!$scope.switcher;
	if($scope.switcher)
	$('#'+$scope.cdata[index]._id).show();	
	else
	$('#'+$scope.cdata[index]._id).hide();
	};
	
	function updteclassprof(){
		for(i=0;i<$scope.cdata.length;i++){
			for(x=0;x<$scope.type[1].length && $scope.data[$scope.type[1][x]]._id != $scope.cdata[i].professor ;x++);
			if(x<$scope.type[1].length)
			$scope.cdata[i].profname = $scope.data[$scope.type[1][x]].name;
			else{
			$scope.cdata[i].profname = "No Professor";
			$scope.cdata[i].professor=null;	
			}
	}
	};
	
	$scope.srch=function(){
		$scope.search=$scope.search.trim();
		var table=document.getElementsByClassName("students");
		for(i=0;i<$scope.data.length;i++)
		table[i].style.display ='';
	
		if($scope.search!=''){
			$scope.search=$scope.search.toUpperCase();
		var name;
		for(i=0;i<$scope.data.length;i++){
		name=$scope.data[i].firstname+''+$scope.data[i].lastname;
		cname=$scope.cdata.name;
		if(name.indexOf($scope.search) < 0)
		table[i].style.display = "none";
		}
		}
	};
	
	function updteclassstud(){
			for(i=0;i<$scope.cdata.length;i++){
				$scope.cdata[i].studnames=[];
				for(x=0;x<$scope.cdata[i].students.length;x++){
						for(z=0;z<$scope.type[0].length && $scope.data[$scope.type[0][z]]._id != $scope.cdata[i].students[x];z++);
						if(z<$scope.type[0].length)
						$scope.cdata[i].studnames.push($scope.data[$scope.type[0][z]].name);
						else
							$scope.cdata[i].students.splice(x,1);
						
				}
			}
		
	};
	
	$scope.addclass = function(){
		console.log($scope.data[$scope.c.professor]._id);
		var insertclass={
			name:$scope.c.name=$scope.c.name.toUpperCase(),
			size:$scope.c.size,
			limit:$scope.c.limit,
			professor:$scope.data[$scope.c.professor]._id
		};
		insertclass.students=[];
		for(i=0;i<$scope.cstudents.length;i++)
		insertclass.students.push($scope.data[$scope.cstudents[i]]._id);
		$http.post("/api/Class",insertclass).success(function(response){
		var alrt="Class Already Exists in Mongodb";
		if(response!="err"){
			$scope.cdata.push(response);
			updteclassprof();
			updteclassstud();
			alrt="Class Successfuly Added";
		}
		alert(alrt);
		});
	$("#classlist").css("display","none");
	};
});
