(function () {
	$("#login").click(function(){

		$(".error-text").text("");
		$("#actionForm").submit(function(e){
			console.log(1);
			e.preventDefault();/* 阻止默认事件 */
			login();
		});
	});
	/* 登录 */
		function login(){
			$.ajax({
				url:'http://8.129.177.19:8085/tele/xhLogin',
				data:JSON.stringify($("#actionForm").serializeJson()),
				dataType:'json',//服务器返回json格式数据
				type:'post',//HTTP请求类型
				timeout:10000,//超时时间设置为10秒；
				async:false,
				
				success:function(data){	
					if (data.code == '200') {
						sessionStorage.setItem("token",data.msg);
						localStorage.setItem("setItem",data.msg);
						$(".error-text").text("");
						location.pathname = "/QUANQUAN/index.html";
						console.log(location)
					} else if(data.code=='400'){
						$(".error-text").text("用户名或密码错误");
					}		
				}
			});
		}
})()