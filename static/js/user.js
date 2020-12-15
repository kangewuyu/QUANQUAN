(function () {
	let t={
		"pageNum":1201,
		"pages":1211,
	}
	//console.log(location);
	let userId;
	let user=location.href.split("?")[1];
	var pattern='userId=([^&]*)';
	if(typeof user !="undefined"&&user.match(pattern)){
		userId=user.split("=")[1];
    }   
	/*判断是否自己的个人中心 */    
	if (typeof userId !="undefined"&&userId!=sessionStorage.userId) {
		//是
		console.log(1);
	} else{
		//否
	}
	/* t参数表示是否是自己的主页 page表示当前页数*/
	function user_dynamic(page,t){
		if (t==1) {
			$.ajax({
				url:"http://8.129.177.19:8085/user/selfdynamic/",
				dataType:'json',//服务器返回json格式数据
				type:'get',//HTTP请求类型
				timeout:10000,//超时时间设置为10秒；
				async:true,
				success:function(data){
					console.log(data);
					if(data.code=="200"){
						
						//sessionStorage.setItem("page",data.data.pageNum);
						//sessionStorage.setItem("pages",data.data.pages);
						$.dynamic_list(data.data);
						
						//hearder_info(true);
					}else{
						console.log(data);
					}
				},
				error:function(data){
					//hearder_info(false);
					console.log(data);
				}
			})
		} else{
			
		}
	}
	
	 //console.log(userId)
	//search_page(1);
	//console.log(user);
	//$.fenye($(".followdPages"),t);
})()