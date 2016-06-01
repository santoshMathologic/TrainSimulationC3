var mongoose = require('mongoose');
var privilegeModel = require('../models/privilege.js');
var q = require('q');

var privileges = {
 
  postPrivilege: function(req,res){
    
      privilegeModel.create({code:req.body.code},function(err,result){
          if(err) return err;
          else{
              res.json(result);
              console.log(result);
          }
      });
      
  }
  
  
};
 

 
module.exports = privileges;