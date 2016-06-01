var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './uploads' });


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
var auth = require('./auth/auth.js');
var plans = require('./plans.js');
var user = require('./users.js');
var trainList = require('./trainList.js');
var trainStation = require('./trainStation.js');
var newUpload = require('./newUpload.js');
var privilege = require('./privilege.js');
var role = require('./role.js');
var userPlanSection = require('./userPlanSection.js');
var globalSection = require('./globalSection.js');
var links = require('./link.js');
var mergeLinks = require('./mergeLink.js');
/*
 * Routes that can be accessed by any one
 * 
 */


router.get('/sample', function (req, res) {
  res.send('sample');
});


router.post('/login', auth.login);
router.post('/register', auth.registerUser);



/*
 * Routes for Access UserPlan 
 */
router.get('/api/v1/plans', plans.getUserPlan);
router.get('/api/v1/plans/getOnePlan', plans.getOnePlan);
router.post('/api/v1/plan/', plans.createPlan);
router.put('/api/v1/coPlan/:id', plans.createCoPlan);
router.put('/api/v1/plan/updateReviewer/:id', plans.updateReviewer);
router.put('/api/v1/plan/deletePlan/:id', plans.deletePlan);
router.post('/api/v1/copyPlan',plans.copyPlan);
router.post('/api/v1/mergePlan',plans.mergePlan);







/**
 * Routes to create privileges
 */

router.post('/api/v1/privilege', privilege.postPrivilege);
router.post('/api/v1/role', role.postRole);

/*
Routes for Train List
 */

router.post('/api/v1/trainList', trainList.createTrainList);
router.get('/api/v1/trainList', trainList.getTrainList);


/*
Routes for Train Station
 */
router.get('/api/v1/trainStation', trainStation.findTrain);

/**
 * Routes to handle User Plan Sections
 */

router.post('/api/v1/userPlanSection', userPlanSection.createUserPlanSection);
router.get('/api/v1/userPlanSections/', userPlanSection.getUserPlanSection);
router.get('/api/v1/userPlanSectionsList', userPlanSection.getUserPlanSections);
router.post('/api/v1/saveCopiedUserPlanSection/', userPlanSection.saveCopiedUserPlanSection);
router.delete('/api/v1/deleteuserPlanSection/:trainNo', userPlanSection.removeUserPlanSection);

/**
 * Routes to handle links
 */

router.post('/api/v1/links', links.generateLink);
router.post('/api/v1/links/mergeLinks', links.mergeLinks);
router.get('/api/v1/links', links.findLinks);
router.get('/api/v1/links/list', links.list);
router.get('/api/v1/getLinksWithUserPlanId', links.getLinksWithUserPlanId);

/**
 * Routes for autoconnecting links
 */

router.get('/api/v1/links/getLinks', mergeLinks.mergeLinks);
router.get('/api/v1/links/autoConnectLinks', mergeLinks.autoConnectLinks);

/**
 * Routes to handle global Plan Sections
 */
router.get('/api/v1/globalSections', globalSection.getGlobalSections);

/*
Routes to handle file uploads
 */
router.post('/api/v1/newUpload/', upload.single('file'), newUpload.createNewUpload);
router.get('/api/v1/newUpload/', newUpload.getAllUploads);
router.post('/api/v1/newUpload/:id', newUpload.processUpload);

/*
 * Routes that can be accessed only by authenticated & authorized users
 */

router.get('/api/v1/admin/users', user.getUsers);
router.put('/api/v1/admin/user/', user.updateUser);
router.put('/api/v1/admin/user/:id', user.deleteUser);

module.exports = router;
