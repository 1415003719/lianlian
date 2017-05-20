$('.login').click(function(){
    var username=$('#username').val();
    var password=$('#password').val();
    if(username.length==0){
        $('.warnText').text('用户名不能为空').show();
    }else{
        if(password.length==0){
            $('.warnText').text('密码不能为空').show();
        }else{
                $.post('/users/checkLogin',{"username":username,"password":password},function(data){
                    if(data.result==1){
                        window.location="/users";
                    }else if(data.result==-1){
                        $('.warnText').text('用户名或密码错误').show();
                    }
                })
            }
    }

});

$('#username').blur(function(){
    var this_text=$(this).val();
    if(this_text.length!=0){
        $('.warnText').text('用户名不能为空').hide();
    }else{
        $('.warnText').text('用户名不能为空').show();
    }
})
$('#password').blur(function(){
    var this_text=$(this).val();
    if(this_text.length!=0){
        $('.warnText').text('密码不能为空').hide();
    }else{
        $('.warnText').text('密码不能为空').show();
    }
})