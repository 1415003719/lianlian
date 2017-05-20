$('.sign').click(function(){
    var username=$('#username').val();
    var password=$('#password').val();
    var rpassword=$('#surepassword').val();
    if(username.length==0){
        $('.warnText').text('用户名不能为空').show();
    }else{
        if(password.length==0){
            $('.warnText').text('密码不能为空').show();
        }else{
            if(rpassword.length==0){
                $('.warnText').text('密码不能为空').show();
            }else if(password!==rpassword){
                $('.warnText').text('两次密码不一致').show();
            }else{
                $.post('/users/checkSign',{"username":username,"password":password},function(data){
                    if(data.result==1){
                        window.location="/users";
                    }else if(data.result==-1){
                        $('.warnText').text('用户名已经存在').show();
                    }
                })
            }
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
$('#surepassword').blur(function(){
    var this_text=$(this).val();
    if(this_text.length!=0){
        if($('#password').val()!=this_text){
            $('.warnText').text('两次密码不一致').show();
        }else{
            $('.warnText').text('密码不能为空').hide();
        }
    }else{
        $('.warnText').text('密码不能为空').show();
    }
})