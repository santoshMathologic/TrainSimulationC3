var mongoose = require('mongoose');
var userModel = require('../../models/user.js');
var roleModel = require('../../models/role.js');
var privilegeModel = require('../../models/privilege.js');
var q = require('q');

var authUtils = {

    isAuthorized: function(req, dbUser) {
        var deferred = q.defer();



        roleModel.find({ roleCode: dbUser.roleCode }, function(err, dbRoles) {
            if (err) return err;
            if (dbRoles.length > 0) {
                privilegeModel.find({ privilegeCode: dbRoles[0]._doc.privilegeCode }, function(err, dbPrivileges) {

                    if (dbPrivileges.length > 0) {
                        if (dbPrivileges[0]._doc.default) {
                            deferred.resolve(true);
                        }
                        else {
                            deferred.reject(false);
                        }
                    }
                    else {
                        deferred.reject(false);
                    }
                });
            }
            else {
                deferred.reject(false);
            }
        });


        return deferred.promise;
    }
}
module.exports = authUtils;