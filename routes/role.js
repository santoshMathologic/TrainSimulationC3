var mongoose = require('mongoose');
var roleModel = require('../models/role.js');
var q = require('q');
var roles = {
 
  postRole: function(req,res){
    
      roleModel.create({roleCode:req.body.roleCode},function(err,result){
          if(err) return err;
          else{
              res.json(result);
              console.log(result);
          }
      })
      
  }
  
  
};
 

 
module.exports = roles;