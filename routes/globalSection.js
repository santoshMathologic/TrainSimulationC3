var mongoose = require('mongoose');
var sectionModel = require('../models/globalSection.js');
var q = require('q');
var queryResolver = require('../lib/queryResolver.js');
require('mongoose-query-paginate');

var globalSections = {
 
  createGlobalSections: function(data){
    
      sectionModel.insertMany(data,function(err,result){
          if(err) console.log(err);
          else{              
             return result;       
                  
        }
      })
      
  },
  
  getGlobalSections: function(req,res) {
        var options = {
            perPage: parseInt(req.query.limit) || 10,
            page: parseInt(req.query.page) || 1
        };
        var query;
        queryResolver.resolveQuery(req.query, sectionModel, options).then(function(response) {
            res.json(response);
        });
    },
  
      deleteTrainSections: function(data){
        var deferred =q.defer();
        sectionModel.remove({ trainNo: { $in: data } }, function(err, docs) {
            if (err) console.log(err);
            deferred.resolve(docs);
        });
        return deferred.promise;
    }
  
  
};
 

 
module.exports = globalSections;