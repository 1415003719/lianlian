$('.modify').click(function(){
	var password=$('#password').val();
	var newpassword=$('#newpassword').val();
	if(password && newpassword){
		$('.modifyForm').submit();
	}else{
		$('.warnText').text("密码不能为空！");
		return;
	}
})

$(".cancelFavorit").click(function(){
	var id=$(this).attr("data-favoritId");
	$.post("/users/cancelFavorit",{"id":id},function(result){
		if(result.result==1){
			window.location="/users/mine/?type=myFavorit";
		}else{
			window.location="/users/login";
		}
		
	});
})