$(".oneMenu").click(function(){
	$(this).siblings("li").slideToggle(300)
})

$(".twoMenu").click(function(){
	$(".twoMenu").children('a').css({"color":"#000"});
	$(this).children('a').css({"color":"blue"});
})



//添加房产信息脚本
$('.addRoom').click(function(){
	var abouts=$('#abouts').val();
	var address=$('#address').val();
	var price=$('#price').val();
	var roomType=$(".roomType").val();
	var pic=$("#pic").files[0];

	$.post("/admin/addRoom",{"abouts":abouts,"address":address,"price":price,"roomType":roomType,"pic":pic},function(err,result){
		if(err)return;
		console.log(result)
	})
})

//隐藏修改和删除前的房屋类型和id输入框，以便提交到后台
$(".roomtype").hide();
$(".roomid").hide();
$(".currPage").hide();
//把房屋类型和id插入到隐藏的输入框的值
$('#myModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var recipient = button.data('whatever');
  var modal = $(this)
  modal.find('#roomid').val(recipient)
})

$('#deletModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var recipient = button.data('whatever');
  var modal = $(this)
  modal.find('.roomid').val(recipient)
})

//删除用户
$('.deleteUser').click(function(){
	// alert($(this).attr("data-userId"))
	var id=$(this).attr("data-userId");
	$.post("/admin/deleteUser",{"id":id},function(result){
		if(result.result==1){
			window.location.reload();
		}
		return;
	})
})