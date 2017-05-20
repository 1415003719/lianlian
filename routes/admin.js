var express = require('express');
var router = express.Router();
var funcs=require('./../funcs/adminFunc');


/* GET admin page. */
router.get('/',funcs.getAdminPage);
router.get('/login',function(req,res,next){
	res.render('admin/adminLogin');
});
router.post('/addRoom',funcs.addRoom);
router.post('/deletRoom',funcs.deletRoom);
router.post('/updateRoom',funcs.updateRoom);
router.post('/loginInfo',funcs.loginInfo);
router.post('/deleteUser',funcs.deleteUser);
router.get('/loginOut',funcs.loginOut);
router.post('/bgSet',funcs.bgSet);
module.exports = router;
