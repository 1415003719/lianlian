$('.addFavorit').click(function(){
	var roomId=$(this).attr("data-roomId");
	var roomPic=$(this).attr("data-roomPic");
	var roomType=$(this).attr("data-roomType");
	var roomPrice=$(this).attr("data-roomPrice");
	var roomAbouts=$(this).attr("data-roomAbouts");
	var roomAddress=$(this).attr("data-roomAddress");
	$.post("/users/addFavorit",{"roomId":roomId,"roomPic":roomPic,"roomType":roomType,"roomPic":roomPic,"roomAbouts":roomAbouts,"roomAddress":roomAddress,"roomPrice":roomPrice},function(result){
		if(result.result==1){
			return;
		}else if(result.result==-1){
			window.location="/users/login"
		}else{
			alert("添加失败")
		}
	})
})