var mongoose = require("mongoose");

/*Person Schema*/
var persons=new mongoose.Schema({
name:{type:String, index :{unique:true}},
firstname:String,
lastname:String,
type:{type:String,index:true},
department:String,
course:String,
gender:String,
datestarted:String,
dateofbirth:String,
classes:[{type:mongoose.Schema.Types.ObjectId,ref:classlists}]	
});



/*Professor Schema
var professors=new mongoose.Schema({
name:{type:String,index:{unique:true}},
firstname:String,
lastname:String,
type:{type:String,default:"Professor"},
department:String,
gender:String,
datestarted:String,
dateofbirth:String,
classes:{type:mongoose.Schema.Types.ObjectId,ref:classlist}
});
*/
/*ClassList Schema*/


var classlists= new mongoose.Schema({
students:[{
type:mongoose.Schema.Types.ObjectId,
ref:persons
}],
professor:{type:mongoose.Schema.Types.ObjectId,ref:persons},
name:{type:String, index :{unique:true}},
size:Number,
limit:Number
});


var person = mongoose.model("persons",persons);
/*var professor = mongoose.model("professor",professors);*/

var classlist = mongoose.model("classlist",classlists);
module.exports={
	person:person,
	classlist:classlist,
	};
	