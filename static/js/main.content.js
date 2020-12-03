(function () {
	
	let list = $(".quanquan-dynamic div.dynamic-list");
	$.ajax({
		url:"http://8.129.177.19:8085/withfriend/dynamicbytime/"+1,
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		async:false,
		success:function(data){
			//console.log(data);
			if(data.code=="200"){
				sessionStorage.setItem("pageNum",data.data.pageNum);
				sessionStorage.setItem("pages",data.data.pages);
				dynamic_list(data.data.list);
				
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
	$.ajax({
		url:"http://8.129.177.19:8085/user/follower",
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		async:false,
		success:function(data){
			console.log(data);
			if(data.code=="200"){
				
				//hearder_info(true);
				
			}else{
				console.log(data);
			}
		},
		/* error:function(data){
			//hearder_info(false);
			console.log(data);
		} */
	})
	/* 显示动态 */
	function dynamic_list(data){
		console.log(data);
		for (let dynamic of data) {
			
			let cord = $("<div class='cord item-dynamic recommend'>");
			cord.attr("data-content",
					"{'dynamicId':'"+dynamic.dynamicId+"','authorName':'"+dynamic.user.username+"'}");
			let cord_author = $("<div class='dynamic-user'></div>");
			let span = $("<span class='author-pic'></span>");
			let img_src = JSON.parse(dynamic.user.avatarPicture)[0];
			let img = $("<img class='author-img' src='http://123.56.160.202/hutquan/headPhoto/"+img_src+"'/>")
			span.append(img)
			let user_div=$("<div class='author-content'></div>");
			let username=$("<span class='author-name'>"+dynamic.user.username+"</span>");
			let follower=$("<button class='Button button--pink'>关注</button>");
			user_div.append(username,follower)
			cord_author.append(span,user_div);
			let cord_content = $("<div class='dynamic-message'></div>");
			let message = $("<div class='text'>");
			let message_content = $("<span class=''></span>").text(dynamic.message);
			message.append(message_content);
			let message_pic = $("<div class='message-image'></div>");
			let ul;
			let img_dynamic = JSON.parse(dynamic.images);
			if (img_dynamic.length>0) {
				ul=$("<ul class=''></ul>")
				for (let image of img_dynamic) {
					//console.log(image);
					let li=$("<li class=''></li>");
					let message_img =$("<img class='dynamic-image' src=''/>");
					li.append(message_img)
					ul.append(li);
				}
				message_pic.append(ul);
			}
			let message_actions=$("<div class='contentItem'></div>");
			let cancellike;
			cord_content.append(message,message_pic,message_actions);
			cord.append(cord_author,cord_content)
			list.append(cord);
		}
	}
	
	
})()

/* 内容切换 */
$("nav.dynamic-taps a.dynamic-links-a").click(function(){
	$("a.dynamic-links-a").removeClass("is-active");
	$(this).addClass('is-active');
})