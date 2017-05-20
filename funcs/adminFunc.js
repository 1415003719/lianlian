var formidable=require('formidable');//此中间件处理前台提交的表单数据，进行相应格式化，以便后台方便处理
var session=require('express-session');//此中间件为session，保存用户登录信息
var db=require('./../db/db');//封装好的数据库处理方法
var path=require('path');
var fs=require('fs');
// 封装了路由的各个方法

//检测管理员登录密码是否正确
exports.loginInfo=function(req,res,next){
	var form=new formidable.IncomingForm();
	form.parse(req,function(err,fields){
		db.pool.query('select * from admins where adminname=? and password=?',[fields.adminName,fields.password], function (error, results, fields) {
		  if (error) throw error;
		  if(results.length!=0){
		  	req.session.results=results;
		  	req.session.adminLogin=1;
		  	res.json({"result":"1"});
		  }else{
		  	// res.json({"result":"-1"});
		  	res.json({"result":"-1"});
		  }
		});
	})
	
}

//返回管理员主页面
exports.getAdminPage=function(req,res,next){
	console.log(req.session.adminLogin)
	if(req.session.adminLogin==1){
		var types=req.query.type;
			types=types;
		if(types=="allRoom"){
			var page=req.query.page,
				roomType=req.query.roomType;
			const limit=4;
			if(!page){
				page=0;
			}else{
				page=parseInt(page);
			}
			roomType=roomType || "newRoom";//如果没有给出roomType参数，则默认为newRoom；
			db.pool.findRoom(roomType,page,limit,function(err,data){
				if(err)throw err;
				res.render("admin/admin",{"type":"allRoom","data":data,"roomType":roomType});
			})
		}else if(types=="addRoom"){
			res.render("admin/admin",{"type":"addRoom"});
		}else if(types=="allUser"){
			var page=req.query.page,
				roomType=req.query.roomType;
			const limit=4;
			if(!page){
				page=0;
			}else{
				page=parseInt(page);
			}
			db.pool.findUserByPage(page,limit,function(err,data){
				if(err){
					throw err;
				}else{
					res.render("admin/admin",{"type":"allUser","datas":data});
				}
			})
		}else if(types=="bgSet"){
			res.render("admin/admin",{"type":"bgSet"});
		}else{
			res.redirect("/admin/?type=allRoom&page=0");
		}
	}else{
		res.redirect('/admin/login');
	}
}

//接收后台传来的房产信息
exports.addRoom=function(req,res,next){
	var uploads="./../public/images/room";
	var form=new formidable.IncomingForm();
	form.encoding = 'utf-8';  
    //设置文件存储路径  
    form.uploadDir = "./public/images/room";  
    //保留后缀  
    form.keepExtensions = true; 
	form.parse(req,function(err,fields,files){
		var picpath=files.pic.path;
		var splitPath=picpath.split("\\");
			splitPath.shift();
			splitPath=splitPath.join("\/");
		var roomInfo={"roomType":fields.roomType,"roomPic":splitPath,"abouts":fields.abouts,"address":fields.address,"price":fields.price}
		// db.pool.query('INSERT INTO rooms SET ?',roomInfo,function(err,result){
		// 	if(err){
		// 		throw err;
		// 		res.render("error");
		// 		return;
		// 	}else{
		// 		res.redirect("/admin");
		// 	}
		// })
		if(fields.roomType=="新房"){
			db.pool.insertRoom("newRoom",roomInfo,function(err,result){
				if(err){
					throw err;
					res.render("error");
				}else{
					res.redirect("/admin/?type=allRoom&page=0");
				}
			})
		}else if(fields.roomType=="二手房"){
			db.pool.insertRoom("oldRoom",roomInfo,function(err,result){
				if(err){
					throw err;
					res.render("error");
				}else{
					res.redirect("/admin/?type=allRoom&page=0&roomType=oldRoom");
				}
			})
		}else if(fields.roomType=="租房"){
			db.pool.insertRoom("rentRoom",roomInfo,function(err,result){
				if(err){
					throw err;
					res.render("error");
				}else{
					res.redirect("/admin/?type=allRoom&page=0&roomType=rentRoom");
				}
			})
		}else{
			res.render("error");
		}
	})
}

//更新房产信息
exports.updateRoom=function(req,res,next){
	var uploads="./../public/images/room";
	var form=new formidable.IncomingForm();
	form.encoding = 'utf-8';  
    //设置文件存储路径  
    form.uploadDir = "./public/images/room";  
    //保留后缀  
    form.keepExtensions = true; 
	form.parse(req,function(err,fields,files){
		var picpath=files.pic.path;
		var splitPath=picpath.split("\\");
			splitPath.shift();
			splitPath=splitPath.join("\/");
		var page=parseInt(fields.currPage);
		var id=parseInt(fields.roomid);
		var roomInfo=[fields.abouts,fields.address,fields.price,splitPath];
		db.pool.updateRoom(fields.roomtype,id,roomInfo,function(err,result){
			if(err){
				throw err;
				return;
			}else{
				picpath=null;
				splitPath=null;
				id=null;
				res.redirect("/admin/?type=allRoom&page="+page+"&roomType="+fields.roomtype);
			}
		})
	})
}

//删除某个房型
exports.deletRoom=function(req,res,next){
	var form=new formidable.IncomingForm();
	form.parse(req,function(err,fields){
		var page=parseInt(fields.currPage);
		var roomid=parseInt(fields.roomid);
		if(err){
			throw err;
		}else{
			db.pool.deletRoom(fields.roomtype,roomid,function(err,result){
				if(err){
					throw err;
				}else{
					res.redirect("/admin/?type=allRoom&page="+page+"&roomType="+fields.roomtype);
				}
			})
		}
	})
}

//删除用户
exports.deleteUser=function(req,res,next){
	var form=new formidable.IncomingForm();
	form.parse(req,function(err,fields){
		if(err){
			throw err;
		}else{
			var id=parseInt(fields.id);
			db.pool.deleteUser(id,function(err,result){
				if(err){
					throw err;
				}else{
					res.json({"result":1});
				}
			})
		}
	})
}

//退出登录
exports.loginOut=function(req,res,next){
		req.session.adminLogin=null;
		req.session.result=null;
		res.redirect("/admin/login");
}

//设置背景图
exports.bgSet=function(req,res,next){
	var uploads="./public/images/bg/";
	var form=new formidable.IncomingForm();
	form.encoding = 'utf-8';  
    //设置文件存储路径  
    form.uploadDir = uploads;  
    //保留后缀  
    form.keepExtensions = true; 
	form.parse(req,function(err,fields,files){
		var picpath=files.pic.path;
		var splitPath=picpath.split("\\");
			splitPath.shift();
			splitPath=splitPath.join("\/");
		var extname=path.extname(files.pic.name);
		var oldpath = path.normalize(files.pic.path);
            //新的路径
        var newpath = uploads+"bannerV2"+extname;
            //改名
        fs.rename(oldpath,newpath,function (err) {
            if(err){
                throw  Error("改名失败");
            }
            db.pool.bgSet(splitPath,function(err,result){
				if(err){
					throw err;
					return;
				}else{
					res.redirect("/admin");
				}
			})
           
        });
	})

}