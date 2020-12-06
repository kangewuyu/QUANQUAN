(function () {
	
	/*日期格式化 */
	Date.prototype.format = function (format) {
		var o = {
			"Y+": this.getFullYear().toString(),        // 年
			"y+": this.getFullYear().toString(),        // 年
			"m+": (this.getMonth() + 1).toString(),     // 月
			"d+": this.getDate().toString(),            // 日
			"H+": this.getHours().toString(),           // 时
			"M+": this.getMinutes().toString(),         // 分
			"S+": this.getSeconds().toString()          // 秒
				// 有其他格式化字符需求可以继续添加，必须转化成字符串
	        }
		if (/(y+)/.test(format)) format = format.replace(RegExp.$1,(this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o) if (new RegExp("(" + k + ")").test(format))format = format.replace(RegExp.$1,RegExp.$1.length == 1 ? o[k] :("00" + o[k]).substr(("" + o[k]).length));
		return format;
	}
	/* 日期显示设置 */
	$.date_display = function(date){
		let dynamic_date= (date).format("yyyy-mm-dd");
		//console.log(dynamic_date);
		let nowdate = new Date().format("yyyy-mm-dd");
		
		//console.log(nowdate);
		if (dynamic_date===nowdate) {
			return date.format("HH:MM");
		} else{
			//console.log(date.getTime())
			let time = date.getTime()+24*60*60*1000;
			//console.log(time);
			dynamic_date = new Date(time).format('yyyy-mm-dd');
			//console.log(dynamic_date);
			if (dynamic_date===nowdate) {
				return "昨天 "+date.format("HH:MM");
			} else{
				//console.log(date.getTime())
				let time = date.getTime()+24*60*60*1000*2;
				//console.log(time);
				dynamic_date = new Date(time).format('yyyy-mm-dd');
				if (dynamic_date===nowdate) {
					return "前天 "+date.format("HH:MM");
				} else{
					return date.format("yyyy-mm-dd HH:MM");
				}
			}
		}
	}
	
	let dynamic_load = false;
	let content = $("div.dynamic-list div.content");
	/* 显示动态 */
	$.dynamic_list=function(data){
		//console.log(data);
		for (let dynamic of data) {
			let cord = $("<div class='card item-dynamic recommend'>");
			cord.attr("data-content",
					"{'dynamicId':'"+dynamic.dynamicId+"','authorName':'"+dynamic.user.username+"'}");
			/* 用户框 */
			let cord_author = $("<div class='dynamic-user'></div>");
			/* 动态发布用户头像框 */
			let span = $("<span class='author-pic'></span>");
			let img_src = JSON.parse(dynamic.user.avatarPicture)[0];
			let author_a=$("<a class='author_a' href='/QUANQUAN/view/people/user.homepage.html' ></a>")
			let img = $("<img class='author-img' src='http://123.56.160.202/hutquan/headPhoto/"+img_src+"'/>")
			author_a.append(img);
			span.append(author_a);
			/* 用户昵称 */
			let user_div=$("<div class='author-content'></div>");
			let username_div=$("<div class='username'></div>") 
			let username=$("<a class='author-name' target='_blank' href='/QUANQUAN/view/people/user.homepage.html'>"+dynamic.user.username+"</span>");
			username_div.append(username);
			/* 发布时间 */
			let dynamic_time=$("<div class='dynamic-time'>");
			let date1 = new Date(dynamic.time*1000);
			
			
			//console.log(date);
			let time=$("<span class='time'>").text($.date_display(date1));
			dynamic_time.append(time);
			user_div.append(username_div,dynamic_time)
			cord_author.append(span,user_div);
			/* 动态内容 */
			let cord_content = $("<div class='dynamic-message'></div>");
			/* 文字内容 */
			let message = $("<div class='text'>");
			//console.log(dynamic.message)
			if (typeof dynamic.message != "undefined") {
				let message_content = $("<span class=''></span>").html(dynamic.message.replace(/\r\n/g, '<br />'));
				message.append(message_content);
			}
			/* 图片内容 */
			let message_pic = $("<div class='message-image'></div>");
			let ul;
			let img_dynamic = JSON.parse(dynamic.images);
			if (img_dynamic.length>0) {
				ul=$("<ul class='dynamic-content-img'></ul>")
				for (let image of img_dynamic) {
					//console.log(image);
					let li=$("<li class='img-list-item'></li>");
					let message_img =$("<img class='dynamic-image' src='http://123.56.160.202/hutquan/dynamicPhoto/"+image+"'/>");
					li.append(message_img)
					ul.append(li);
				}
				message_pic.append(ul);
			}
			/* 动态信息 */
			let message_actions=$("<div class='contentItem'></div>");
			let starCount=$("<button class='Button'></button>");
			let star=$("<span class='iconfont icon-favorites-fill'></span>") 
			let count = dynamic.starCount;
			let text;
			starCount.addClass("button-star");
			if (dynamic.like) {
				starCount.addClass("button-like");
				text = "已赞同 ";
			} else{
				text = '赞同 ';
			}
			starCount.append(star,text,count);
			let commentCount=$("<div class='content-comment'><span class='iconfont icon-icon-test'></span>"+dynamic.commentCount+"条评论</div>");
			message_actions.append(starCount,commentCount);
			
			cord_content.append(message,message_pic,message_actions);
			/* 判断是否是自己的动态 */
			if (dynamic.self) {
				/* 添加删除按钮 */
				let delete_dynamic = $("<div class='delete-dynamic'><span class='iconfont icon-arrow-down'></span></div>");
				cord.append(delete_dynamic);
			}
			/* 动态框添加 */
			cord.append(cord_author,cord_content);
			content.children().eq(content.children().length-1).before(cord);
			
		}
		/* 动态加载完毕 */
		dynamic_load = false;
		/* 添加DOM事件 */
		$("div.card").ready(function(e){
			console.log(1);
			/* 赞同动态 */
			$(".contentItem button").click(function (e) {
				e.stopPropagation();
				let eq = $(this).children().eq(0);
				let dynamic= eval('(' + $(this)
				.parent()
				.parent()
				.parent()
				.data("content") + ')');
				let t=$(this);
				if($(this).hasClass("button-like")){
					
					$.ajax({
						url:"http://8.129.177.19:8085/withfriend/cancellike/"+dynamic.dynamicId,
						dataType:'json',//服务器返回json格式数据
						type:'get',//HTTP请求类型
						timeout:10000,//超时时间设置为10秒；
						success:function(data){
							//console.log(data);
							if (data.code=="200") {
								t.removeClass("button-like");
								t.addClass("button--star");
								t.empty();
								t.append(eq,"赞同 ",data.data);
							}
							if (data.code == '403') {
								let body=$("body");
								body.children("div").eq(body.children("div").length).remove();
								body.append($.loginDIV());
							} 
							
						},
						error:function(data){
							//hearder_info(false);
							console.log(data);
						}
					})
				}else{
					$.ajax({
						url:"http://8.129.177.19:8085/withfriend/like/"+dynamic.dynamicId,
						dataType:'json',//服务器返回json格式数据
						type:'get',//HTTP请求类型
						timeout:10000,//超时时间设置为10秒；
						success:function(data){
							//console.log(data);
							if (data.code=="200") {
								t.removeClass("button--star");
								t.addClass("button-like");
								t.empty();
								t.append(eq,"已赞同 ",data.data);
							}
							if (data.code == '403') {
								let body=$("body");
								body.children("div").eq(body.children("div").length).remove();
								body.append($.loginDIV());
							} 
						},
						error:function(data){
							//hearder_info(false);
							console.log(data);
						}
					})
					
				}
			})
			/* 显示部分评论 */
			
			/* 显示删除按钮 */
			$("div.delete-dynamic").mouseenter(function (event) {
				event.stopPropagation();
				let delete_dynamic = $(this);
				delete_dynamic.children().eq(1).remove()
				let delete_div=$("<div class='delete'>")
				let triangle=$("<span class='triangle'></span>")				
				let div =$("<div><a class='delete-a-dynamic' href='JavaScript:void(0);'>"+
							"<span class='iconfont icon-delete'></span>删除</a></div>");
				delete_div.append(triangle,div);
				delete_dynamic.append(delete_div);
				/* 调用后台删除接口 */
				$("a.delete-a-dynamic").click(function (e) {
					e.stopPropagation();
					//$(this).remove();
					let dynamic= eval('(' + delete_dynamic.parent().data("content") + ')');
					$.ajax({
						url:"http://8.129.177.19:8085/withfriend/delDynamic/"+dynamic.dynamicId,
						dataType:'json',//服务器返回json格式数据
						type:'post',//HTTP请求类型
						timeout:10000,//超时时间设置为10秒；
						success:function(data){
							//console.log(data);
							if(data.code=="200"){
								console.log(data);
								delete_dynamic.parent().addClass('card-delete');
								
								setTimeout (function(){delete_dynamic.parent().remove()},1500); 
								
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
				})
				/* 移除删除按钮 */
				$("div.delete").mouseleave(function () {
					event.stopPropagation();
					//console.log(1)
					$(this).parent().children().eq(1).remove()
				})
			})
			/* 移除删除按钮 */
			$("div.delete-dynamic").mouseleave(function () {
				event.stopPropagation();
				$(this).children().eq(1).remove()
			})
			
			
		})
	}
	
	
	/* 从后台查询推荐动态 */
	$.load = function(page){
		$.ajax({
			url:"http://8.129.177.19:8085/withfriend/dynamicbytime/"+page,
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			async:false,
			success:function(data){
				console.log(data);
				if(data.code=="200"){
					
					sessionStorage.setItem("page",data.data.pageNum);
					sessionStorage.setItem("pages",data.data.pages);
					$.dynamic_list(data.data.list);
					
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
	}
	$.load(1);
	if (sessionStorage.pages>1) {
		$.load(2);
	} 
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
	
	/* 触底加载 */
	$(window).mousewheel(function(){
		if ($(document).height()-$(this).scrollTop()-$(this).height()<1) {
			let page = sessionStorage.page
			let pages = sessionStorage.pages
			if (!dynamic_load&&page!=pages) {
				dynamic_load = true;
				$.load(page+1);
			}
		} 
	})
	
	/* 内容切换 */
	$("nav.dynamic-taps a.dynamic-links-a").click(function(){
		$("a.dynamic-links-a").removeClass("is-active");
		$(this).addClass('is-active');
		$("div.content").empty();
		$("div.content").append($("<div></div>"))
		if ($(this).text()==='推荐') {
			$.load(1);
		}
	})
})()

