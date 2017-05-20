var mysql=require('mysql');//引入mysql模块



var pool  = mysql.createPool({       //创建一个连接池对象
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'lianlian'
});

//查找
pool.findRoom=function(roomtype,page,limit,callback){
	var data={"items":[],"count":0,"currPage":0};
	pool.query("select count(*) AS count from "+roomtype,function(err,result){
				if(err) callback(err,null);
				data.count=Math.ceil(result[0].count/limit);
				page=page<0?0:page;
				page=page>data.count-1?data.count-1:page;
				data.currPage=page;
				if(data.count==0){
					callback(null,data);
				}else{
					pool.query("select * from "+roomtype+" order by id desc limit "+(page*limit)+","+limit,function(err,allRooms){
						if(err) callback(err,null);
						data.items=allRooms;
						callback(null,data);
					})	
				}
			})
}


//添加
pool.insertRoom=function(roomType,roomInfo,callback){
	pool.query('INSERT INTO '+roomType+' SET ?',roomInfo,function(err,result){
			if(err)callback(err,null);
			callback(null,result);
		})
}

// 修改
pool.updateRoom=function(roomType,id,updatInfo,callback){
	pool.query("update "+roomType+" set abouts=?,address=?,price=?,roomPic=? where id="+id,updatInfo,function(err,result){
		if(err){
			callback(err,null);
		}else{
			callback(null,result);
		}
	})
}


//删除
pool.deletRoom=function(roomType,id,callback){
	pool.query("delete from "+roomType+" where id="+id,function(err,result){
		if(err){
			callback(err,null);
		}else{
			callback(null,result);
		}
	})
}

//查找user表
pool.findUser=function(username,callback){
	pool.query("select * from users where username =?",[username],function(err,result){
		if(err){
			callback(err,null);
		}else{
			callback(null,result);
		}
	})
}
//注册用户
pool.insertUser=function(userinfo,callback){
	pool.query("insert into users set ?",userinfo,function(err,result){
		if(err){
			callback(err,null);
		}else{
			callback(null,result);
		}
	})
}

//按地址名查找房屋
pool.search=function(type,callback){
	if(type!=="allType"){
		pool.query("select * from "+type,function(err,result){
			if(err){
				callback(err,null);
			}else{
				callback(null,result);
			}
		})
	}else{
		pool.query("select * from newRoom",function(err,roomsOne){
			if(err){
				callback(err,null);
			}else{
				pool.query("select * from oldRoom",function(err,roomsTwo){
					if(err){
						callback(err,null)
					}else{
						pool.query("select * from rentRoom",function(err,roomsThree){
							if(err){
								callback(err,null)
							}else{
								var result=roomsThree.concat(roomsOne,roomsTwo);
								callback(null,result);
							}
						})
					}
				})
			}
		})
	}
}

//修改密码
pool.modifyPassword=function(username,newpassword,callback){
	pool.query("update users set password =? where username =?",[newpassword,username],function(err,result){
		if(err){
			callback(err,null);
		}else{
			callback(null,result);
		}
	})
}

//添加收藏
pool.insertFavorit=function(infos,callback){
	pool.query("insert into favorit set ?",infos,function(err,result){
		if(err){
			callback(err,null);
		}else{
			callback(null,result);
		}
	})
}

//查找我的收藏
pool.findFavorit=function(username,page,callback){
	var limit=3;
	var data={"items":[],"count":0,"currPage":0};
	pool.query("select count(*) AS count from favorit where username = "+username,function(err,result){
				if(err) callback(err,null);
				data.count=Math.ceil(result[0].count/limit);
				page=page<0?0:page;
				page=page>data.count-1?data.count-1:page;
				data.currPage=page;
				if(data.count==0){
					callback(null,data);
				}else{
					pool.query("select * from favorit where username =? order by id desc limit "+(page*limit)+","+limit,[username],function(err,allRooms){
						if(err) callback(err,null);
						data.items=allRooms;
						callback(null,data);
					})	
				}
			})
}

//删除收藏
pool.cancelFavorit=function(id,callback){
	pool.query("delete from favorit where id="+id,function(err,result){
		if(err){
			callback(err,null);
		}else{
			callback(null,result);
		}
	})
}
//分页查找用户表
pool.findUserByPage=function(page,limit,callback){
	var data={"items":[],"count":0,"currPage":0};
	pool.query("select count(*) AS count from users",function(err,result){
				if(err) callback(err,null);
				data.count=Math.ceil(result[0].count/limit);
				page=page<0?0:page;
				page=page>data.count-1?data.count-1:page;
				data.currPage=page;
				if(data.count==0){
					callback(null,data);
				}else{
					pool.query("select * from users order by id desc limit "+(page*limit)+","+limit,function(err,allRooms){
						if(err) callback(err,null);
						data.items=allRooms;
						callback(null,data);
					})	
				}
			})
}

//删除用户
pool.deleteUser=function(id,callback){
	pool.query("delete from users where id ="+id,function(err,result){
		if(err){
			callback(err,null);
		}else{
			callback(null,result);
		}
	})
}

//更新背景图
pool.bgSet=function(path,callback){
	pool.query("insert into backgroundImg set ?",{"pic":path,"date":new Date()},function(err,result){
		if(err){
			callback(err,null);
		}else{
			callback(null,result);
		}
	})
}
exports.pool=pool;//暴露出pool，供别的文件使用
