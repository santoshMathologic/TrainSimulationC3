var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var userModel = require('../../models/user.js');
var roleRoute = require('../role.js');
var q = require('q');
var auth = {

    login: function(req, res) {
        var dbUserObj={};
        var username = req.body.username || '';
        var password = req.body.password || '';

        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }

        // Fire a query to your DB and check if the credentials are valid
        auth.validate(username, password).then(function(result){
            if (result.role === undefined) { // If authentication fails, we send a 401 back
                res.status(403);
                res.json({
                        "result":false,
                        "status":"LOGINFAIL",
                        "message":"Invalid username or password"
                    });
                return;
            }
            else {

                // If authentication is success, we will generate a token
                // and dispatch it to the client
                var token = genToken(result);
                res.cookie('x-access-token', token.token, { expires: new Date(token.expires) });
                res.cookie('x-key', token.user.username);
                res.json(token);
            }     
        });
    },

    // register User
    registerUser: function(req, res) {

        userModel.find({ userName: req.body.userName }, function(error, result) {
            if (error) {
                res.json(error);
            }
            else if(result.length === 0) {
                
                 userModel.create({userName:req.body.userName,firstName:req.body.firstName,lastName:req.body.lastName
                     ,password:req.body.password,email:req.body.email}, function(error, result) {
                    if (error) return error;
                    res.status(201);
                    res.json({
                        "result":true,
                        "status":"CREATED",
                        "message":"User created successfully"
                    });
                })
               
            }
            else{
                res.status(200);
                 res.json({
                     "result":false,
                     "status":"EXISTS",
                     "message":"Username already exists. Please try a different username"    
                });
            }
        })


    },
    validate: function(username, password) {
        // spoofing the DB response for simplicity
        var deferred = q.defer();
        userModel.find({userName:username,password:password},function(error,result){
            
            if(error){
                 console.log(error);
                return error;    
            }
                  
             if (result.length>0) {
                    
                dbUserObj = { // spoofing a userobject from the DB. 
                    name: username,
                    role: result[0]._doc.roleCode,
                    username: username,
                };           
              deferred.resolve(dbUserObj);
        }
            
         else{
             dbUserObj = {role:undefined};
             deferred.resolve(result);
         }   
            
            
        });
        
        return deferred.promise;
    },

    validateUser: function(username) {
        var deferred = q.defer();
        userModel.find({userName:username},function(error,dbUserObj){
            if(error){
                 console.log(error);
                return error;    
            }
            if (dbUserObj.length>0) {
                deferred.resolve(dbUserObj[0]._doc);
            }
            else{
                dbUserObj = null;
                deferred.resolve(dbUserObj);
            }
        });
        
        return deferred.promise;   
    }
}

// private method
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires
    }, require('../../config/secret')());

    return {
        token: token,
        expires: expires,
        user: user
    };
};

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;