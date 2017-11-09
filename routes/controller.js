var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var person=require("../models/models").person;
var classlist = require("../models/models").classlist;

/*Person Operations*/
router.post("/Person",function(req,res){
	var nperson = new  person(req.body);
	nperson.save(function(err){
	console.log(nperson);
	res.json((err)?"err":nperson);
	});
});

router.get("/Person",function(req,res){
	 person.find({},function(err,cperson){
	console.log(cperson);
	res.json(cperson);
	
});
});

router.put("/Person/:id",function(req,res){
	person.findById(req.params.id,function(err,cperson){
		
	classlist.find({"_id":{$in:cperson.classes}},function(err,classes){
		var x;
		
		for(i=0;i<classes.length;i++){
		if(cperson.type != req.body.type){
		if(cperson.type=="STUDENT"){
		classes[i].students.splice(classes[i].indexOf(cperson._id),1);
		classes[i].size-=1;
		}
		else
			classes[i].professor = null;
			classes[i].save();
		}
		
		}
		console.log(classes);
	});
	
	cperson.name=req.body.name;
	cperson.firstname=req.body.firstname;
	cperson.lastname=req.body.lastname;
	cperson.department=req.body.department;
	cperson.course=req.body.course;
	cperson.gender=req.body.gender;
	cperson.datestarted=req.body.datestarted;
    cperson.dateofbirth=req.body.dateofbirth;
	cperson.type=req.body.type;
	cperson.save(function(err){
	console.log(cperson);
	res.json((err)?"err":req.body);
	});
	});
	
});

router.delete("/PersonDelete/:id",function(req,res){
	person.findById(req.params.id,function(err,cperson){	
	cperson.remove(function(err){
	
	classlist.find({"_id":{$in:cperson.classes}},function(err,classes){
		var x;
		
		for(i=0;i<classes.length;i++){
		if(cperson.type=="STUDENT"){
		classes[i].students.splice(classes[i].students.indexOf(cperson._id),1);
		classes[i].size-=1;
		}
		else
		classes[i].professor = null;
		classes[i].save();
		
		}
		console.log(classes);
	});
	
	console.log(req.body);
	res.json(parseInt(err));
	});
	});
});
/*Class operations*/
router.post("/Class",function(req,res){
	var nclass = new  classlist(req.body);
	console.log(nclass);
	nclass.save(function(err){
	var ret="err"
	if(!err){
	var persons=nclass.students;
	persons.push(nclass.professor);
	person.find({
    "_id": { $in:persons}
	},
	function(err,persons){
	for(i=0;i<persons.length;i++){
    persons[i].classes.push(nclass._id);
	persons[i].save();
	
	}

	console.log(persons);
	});
	ret=nclass;
	}
	res.json(ret);
	});
});

router.get("/Class",function(req,res){
classlist.find({},function(err,classes){
	console.log(classes);
	res.json(classes);
});
	
});

module.exports = router;