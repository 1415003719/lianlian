var express = require('express');
var router = express.Router();
var funcs=require('./../funcs/usersFunc');
/* GET users listing. */
router.get('/',funcs.getHomePage);
router.get('/login',funcs.getLoginPage);
router.get('/sign',funcs.getSignPage);
router.post('/checkLogin',funcs.checkLogin);
router.post('/checkSign',funcs.checkSign);
router.get('/searchRoom',funcs.searchRoom);
router.get('/rooms',funcs.getRooms);
router.get('/loginOut',funcs.loginOut);
router.get('/mine',funcs.getMinePage);
router.post('/modifyPassword',funcs.modifyPassword);
router.post('/addFavorit',funcs.addFavorit);
router.post('/cancelFavorit',funcs.cancelFavorit);
module.exports = router;
