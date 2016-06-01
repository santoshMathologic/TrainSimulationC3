
var mongoose = require('mongoose');
var planModel = require('../models/plan.js');
var linkModel = require('../models/link.js');
var q = require('q');
var queryResolver = require('../lib/queryResolver.js');
require('mongoose-query-paginate');

var plans = {

    /**
      The getUserPlan function used for retrive all userPlan
    */
    getUserPlan: function (req, res) {
        var options = {
            perPage: parseInt(req.query.limit) || 10,
            page: parseInt(req.query.page) || 1,
            order: req.query.order || 'planName'
        };
        var query;
        queryResolver.resolveQuery(req.query, planModel, options).then(function (response) {
            res.json(response);
        });
    },

    /**
         The setUserPlan function used for set the UserPlan
    */
    setUserPlan: function (data) {
        var deferred = q.defer();
        planModel.findByIdAndUpdate(data, { 'isLinkGenerated': true }, function (err, post) {
            if (err) console.log(err);
            deferred.resolve(post);
        });
        return deferred.promise;
    },

    /**
          The savePlan function used for save the NewPlan
     */
    savePlan: function (data, res) {
        planModel.create({ planName: data.planName, owner: data.owner, coPlanners: data.coPlanners }, function (err, result) {
            if (err) return err;
            else {
                res.json(result);
            }
        })
    },


    /**
          The createPlan function used for save the NewPlan
     */
    createPlan: function (req, res) {

        planModel.create({ planName: req.body.planName, owner: req.body.owner }, function (err, result) {
            if (err) {
                console.log("Error" + err);
            }
            else {
                res.json(result);
            }
        })
    },

    /**
          The getOnePlan function used for retrive the Plan based on requested Id 
     */
    getOnePlan: function (req, res) {
        var options = {
            perPage: parseInt(req.query.limit) || 10,
            page: parseInt(req.query.page) || 1,
            order: req.query.order || 'planName'

        };
        var query;
        queryResolver.resolveQuery(req.query, planModel, options).then(function (response) {
            res.json(response);
        });
    },
    /**
          The copyPlan() used for copy Existing Plan to New Plan 
     */
    copyPlan: function (req, res) {
        var planId = req.body.planId;
        var savedData = [];
        var planObj = {};
        planObj.planName = req.body.planName;
        planObj.owner = req.body.owner;
        planObj.coPlanners = req.body.coPlanners;
        //creating plan
        planModel.create({ planName: planObj.planName, owner: planObj.owner, coPlanners: planObj.coPlanners },
            function (err, newPlanCreatedResponse) {
                if (err) return err;
                else
                    linkModel.find({ planId: planId }, function (err, docs) {
                        if (err) console.log(err);
                        // assigning all links
                        var links = docs;

                        var newLinks = [];
                        if (links.length > 0) {
                            for (var i = 0; i < links.length; i++) {
                                var linkObj = {};
                                linkObj.linkName = links[i].linkName;
                                linkObj.fromStation = links[i].fromStation;
                                linkObj.toStation = links[i].toStation;
                                linkObj.linkDescription = links[i].linkDescription;
                                linkObj.markDelete = links[i].markDelete;
                                linkObj.planId = newPlanCreatedResponse._id;
                                linkObj.sections = links[i].sections;
                                linkObj.passedStation = links[i].passedStation;
                                //pushing to new array 
                                newLinks.push(linkObj);
                            }
                            linkModel.insertMany(newLinks, function (err, result) {
                                if (err) return err;
                                savedData = result;
                            });
                        }
                    });
                res.json(savedData);
            });

    },
    mergePlan: function (req, res) {
        // find links using array of ids
        linkModel.find({ _id: { $in: req.body.links } }, function (err, docs) {
            if (err) console.log(err);
            var links = docs;
            //delete id and change plan id to new plan id
            for (var i = 0; i < links.length; i++) {
                links[i]["_id"] = null;
                links[i]["planId"] = req.body.planId;
            }
            var planid = req.body.planId;
            //updated plan with isLinkGenerated : true 
            planModel.update({ "_id": planid }, { isLinkGenerated: true }, function (err, res) {
                if (err) console.log(err);
                console.log(res);
            });
            console.log(links);
            //insert all links to db
            linkModel.insertMany(links, function (err, linksRes) {
                if (err) console.log(err);
                res.json(linksRes);
                links = [];
            });
        });
    },
    createCoPlan: function (req, res) {
        var id = req.params.id;
        if (req.body.isUnderReview) {
            planModel.findByIdAndUpdate(id, { isUnderReview: req.body.isUnderReview }, function (err, result) {
                if (err) {
                    console.log("Error" + err);
                }
                else {
                    res.json(result);
                }
            })
        }


        if (req.body.reviewer) {
            planModel.findByIdAndUpdate(id, { reviewer: req.body.reviewer }, function (err, result) {
                if (err) {
                    console.log("Error" + err);
                }
                else {
                    res.json(result);

                    /* res.json({
                         "status": 201,
                         "message": "Updated Successfully",
                         "data" :result 
                     });
                     */


                }
            })
        }


        if (req.body.coPlanners) {
            planModel.findByIdAndUpdate(id, { coPlanners: req.body.coPlanners }, function (err, result) {
                if (err) {
                    console.log("Error" + err);
                }
                else {
                    res.json(result);
                }
            })
        }

    },

    updateReviewer: function (req, res) {
        var id = req.params.id;

        planModel.findByIdAndUpdate(id, { reviewer: req.body.reviewer, isUnderReview: req.body.isUnderReview }, function (err, result) {
            if (err) {
                console.log("Error" + err);
            }
            else {
                res.json(result);
            }
        })

    },

    deletePlan: function (req, res) {
        var id = req.params.id;
        planModel.findByIdAndUpdate(id, { 'markDelete': true }, function (result) {
            res.status(201);
            res.json({
                "status": 200,
                "message": "Delete Plan Successfully"
            })
        }, function (error) {
            console.log("Error in Deleting " + error);
        })

    }
};



module.exports = plans;