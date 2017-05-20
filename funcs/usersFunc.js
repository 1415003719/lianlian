var formidable=require('formidable');//此中间件处理前台提交的表单数据，进行相应格式化，以便后台方便处理
var session=require('express-session');//此中间件为session，保存用户登录信息
var db=require('./../db/db');//封装好的数据库处理方法


//返回前端首页
exports.getHomePage=function(req,res,next){
	if(req.session.login==1){
		res.render("users/user",{"username":req.session.username});
	}else{
		res.render("users/user");
	}
}


//返回注册页面
exports.getSignPage=function(req,res,next){
	res.render("users/sign");
}

//返回登录页面
exports.getLoginPage=function(req,res,next){
	res.render("users/login");
}

//检查登录信息
exports.checkLogin=function(req,res,next){
	var form=new formidable.IncomingForm();
	form.parse(req,function(err,fields){
		if(err){
			throw err;
			res.json({"result":-2});
		}else{
			db.pool.findUser(fields.username,function(err,result){
				if(err){
					throw err;
					res.json({"result":-2});
				}else{
					if(result.length!=0){
						//接着查密码是否正确
						if(result[0].password==fields.password){
							req.session.login=1;
							req.session.username=fields.username;
							res.json({"result":"1"})
						}else{
							res.json({"result":-1});//密码错误
						}
					}else{
						res.json({"result":-1});//用户名不存在
					}
				}
			})
		}
	})
}

//检查注册信息
exports.checkSign=function(req,res,next){
	var form=new formidable.IncomingForm();
	form.parse(req,function(err,fields){
		if(err){
			throw err;;
			res.json({"result":-2});
		}else{
			db.pool.findUser(fields.username,function(err,result){
				if(err){
					console.log("1")
					throw err;
					res.json({"result":2});
				}else{
					if(result.length==0){
						var userinfo={"username":fields.username,"password":fields.password,"date":new Date()};
						db.pool.insertUser(userinfo,function(err,result){
							if(err){
								console.log("2")
								throw err;
								res.json({"result":-2});
							}else{
								req.session.username=fields.username;
								req.session.login=1;
								res.json({"result":1});
							}
						})
					}else{
						res.json({"result":-1});
					}
				}
			})
		}
	})
}


//根据搜索的关键词查找
exports.searchRoom=function(req,res,next){
	var searchText=req.query.searchText.trim();
	var roomType=req.query.roomType;
	db.pool.search(roomType,function(err,result){
		if(err){
			throw err;
		}else{
			var datas=[];
			for(var i=0;i<result.length;i++){
				var address=result[i].address.trim();
				if(address.indexOf(searchText)>=0){
					datas.push(result[i]);
				}
			}
			res.render("users/showRoom",{"datas":datas});
		}
	})
}

//返回某个房型的全部信息
exports.getRooms=function(req,res,next){
	var type=req.query.type.trim();
	var sendType="";
	if(type=="newroom"){
		sendType="新房"
	}else if(type=="oldroom"){
		sendType="二手房";
	}else{
		sendType="租房";
	}
	db.pool.search(type,function(err,result){
		if(err){
			throw err;
		}else{
			res.render("users/rooms",{"datas":result,"sendType":sendType,"username":req.session.username});
		}
	})
}

//退出登录
exports.loginOut=function(req,res,next){
	req.session.login=null;
	req.session.username=null;
	res.redirect("/users")
}

//我的收藏
exports.getMinePage=function(req,res,next){
	if(req.session.login==1){
		if(req.query.type=="modifyPassword"){
			res.render("users/mine",{"username":req.session.username,"type":"modifyPassword"});
		}else if(req.query.type=="myFavorit"){
			var page=req.query.page;
			if(!page){
				page=0;
			}
			db.pool.findFavorit(req.session.username,page,function(err,result){
				if(err){
					throw err;
				}else{
					res.render("users/mine",{"username":req.session.username,"type":"myFavorit","result":result});
				}
			})
			// res.render("users/mine",{"username":req.session.username,"type":"myFavorit"});
		}else{
			res.render("users/mine",{"username":req.session.username});
		}
	}else{
		res.render("users/user");
	}
}

//修改密码
exports.modifyPassword=function(req,res,next){
	var form=new formidable.IncomingForm();
	form.parse(req,function(err,fields){
		if(err){
			throw err;
		}else{
			if(req.session.login==1){
				var username=req.session.username;
				var password=fields.password.trim();
				var newpassword=fields.newpassword;
				db.pool.findUser(username,function(err,result){
					if(err){
						throw err;
					}else{
						if(password==result[0].password){
							//原始密码正确，可以进行修改
							db.pool.modifyPassword(username,newpassword,function(err,result){
								if(err){
									throw err;
								}else{
									res.render("users/mine",{"username":username})
								}
							})
						}else{
							res.render("users/mine",{"username":username,"type":"modifyPassword","error":"密码错误"});
						}
					}
				})
			}else{
				res.render("users/login");
			}
		}
	})
}

//添加收藏
exports.addFavorit=function(req,res,next){
	if(req.session.login==1){
		var form=new formidable.IncomingForm();
			form.parse(req,function(err,fields){
				if(err){
					throw err;
				}else{
					fields.username=req.session.username;
					db.pool.insertFavorit(fields,function(err,result){
						if(err){
							throw err;
						}else{
							res.json({"result":1});
						}
					})
				}
			})
	}else{
		res.json({"result":-1});//未登录不能进行收藏功能
		}
}

//删除收藏
exports.cancelFavorit=function(req,res,next){
	var form=new formidable.IncomingForm();
	form.parse(req,function(err,fields){
		var id=parseInt(fields.id);
		if(err){
			throw err;
			res.json({"result":-2});
		}else{
			if(req.session.login==1){
				db.pool.cancelFavorit(id,function(err,result){
					if(err){
						throw err;
						res.json({"result":-2});
					}else{
						res.json({"result":1});
					}
				})
			}else{
				res.json({"result":-1});
			}
		}
	})
}
