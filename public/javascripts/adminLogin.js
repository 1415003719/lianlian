window.onload=function(){
	let loginbtn=$('.loginbtn'),
		loginWarn=$('.loginWarn'),
		usernameT=$('#username'),
		passwordT=$('#password');

	//登录方法
	loginbtn.click(function(){

		let username=$('#username').val().trim(),//获取登录账号和密码，去除空格
		password=$('#password').val().trim();


		//检测登录名和密码是否为空
		if(username==""||username==null){
			loginWarn.text("登录名不能为空！");
			return;
		}else if(password==""||password==null){
			loginWarn.text("密码不能为空！");
			return;
		}else{
			$.post("/admin/loginInfo",{"adminName":username,"password":password},function(result){
				if(result.result==-2){
					loginWarn.text("服务器出错,请稍后再试!");
				}else if(result.result=="-1"){
					loginWarn.text("用户名或者密码错误！");
				}else if(result.result==1){
					window.location="/admin/?type=allRoom&page=0";
				}else{
					return;
				}
			})
		}
	})

	//为输入框添加失焦事件，当输入框内容合法时，隐藏警告框

	//登录名输入框
	usernameT.blur(function(){
		let username=$('#username').val().trim();
		if(username==""||username==null){
			loginWarn.text("登录名不能为空！");
		}else{
			loginWarn.text("");
		}
	});

	//密码输入框
	passwordT.blur(function(){
		let password=$('#password').val().trim(),
			username=$('#username').val().trim();
		if(username==""||username==null){     //如果用户名还是空，则依然显示用户名不能为空！
			loginWarn.text("登录名不能为空！");
		}else if(password==""||password==null){
			loginWarn.text("密码不能为空！");
		}else{
			loginWarn.text("");
		}
	})

}