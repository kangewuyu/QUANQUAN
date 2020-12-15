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
			let dynamic_h=date.format("HH");
			let now_h=new Date().format("HH");
			let dynamic_min=Number(date.format("MM"));
			let now_min=Number(new Date().format("MM"));
			let df=now_min-dynamic_min;
			if (dynamic_h==now_h&&df<1) {
				return "刚刚";
			}
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
					if(date.format("yyyy")===new Date().format("yyyy")){
						return date.format("mm月dd日 HH:MM");
					}
					return date.format("yyyy年mm月dd日 HH:MM");
				}
			}
		}
	}
	/* 根据动态ID查询指定动态评论 */
	$.dynamic_coment=function (dynamic) {
		let text;
		$.ajax({
			url:"http://8.129.177.19:8085/withfriend/dynamic/"+dynamic.dynamicId,
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			async:false,
			success:function(data){
				
				if(data.code=="200"){
					//console.log(data);
					text=data.data;
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
		return text;
	}
	/* 根据动态ID查询指定动态评论*/
	$.comments_ajax=function (that,dynamic,z,page) {
		//console.log(that);
		let text=0;
		if(z==1){
			text=$.dynamic_coment(dynamic);
		}else{
			$.ajax({
				url:"http://8.129.177.19:8085/comment/"+page+"/"+dynamic.dynamicId,
				dataType:'json',//服务器返回json格式数据
				type:'post',//HTTP请求类型
				timeout:10000,//超时时间设置为10秒；
				async:false,
				success:function(data){
					
					if(data.code=="200"){
						//console.log(data);
						text=data.data;
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
		return text;
	}
	/* 生成button */
	$.button_add=function () {
		return $("<button class='Button' type='button'>");
	}
	/* 具体评论显示 */
	$.li_comment=function (list,dynamic) {
		let ul = $("<ul class='nest-comment'></ul>");
		let li_root=$("<li class='nest-comment-rootChild'></li>");
		let div = $("<div class='commetsItem'>");
		/* 评论用户 */
		let div_user=$("<div class='commetsItem-user'></div>");
		div_user.attr("data-comments-user",
		"{'authorName':'"+list.userName+"','authorId':'"+list.userId+"'}");
		/* 'commentId':'"+list.commentId+"', */
		/* 用户昵称 */
		let username_div=$("<div class='username comments-username'></div>");
		let username_a=$("<a class='author-name' href='/QUANQUAN/view/people/user.homepage.html?userId="+list.userId+"' target='_blank'>"+list.userName+"</a>");
		
		username_a.attr("data-personal",list.userId);
		username_div.append(username_a);
		if(list.userId==dynamic.authorId){
			let span_1=$("<span class='role-info'>（作者）</span>")
			username_div.append(span_1);
		}
		username_div.append("&nbsp;:");
		/* 评论内容 */
		let div_message=$("<div class='comment-meassge'></div>");
		/* 评论具体内容 */
		let comment_text=$("<div class='comment-text'></div>");
		let p=$("<p>").html(list.message.replace(/\r\n/g, '<br />'));
		comment_text.append(p);
		
		div_message.append(comment_text);
		div_user.append(username_div,div_message);
		/* 评论发布时间 */
		let time_div=$("<div class='time-div comments-time'></div>");
		let t=Number(list.time);
		let date = new Date(t*1000);
		let time=$("<span class='time'></span>").text($.date_display(date));
		/* 对于评论进行评论 */
		/* let comment_Item=$("<div class='contentItem'>");
		let item_comment=$("<div class='content-comment'></div>");
		let span=$("<span class='iconfont icon-icon-test'></span>");
		item_comment.append(span);
		comment_Item.append(item_comment); */
		//time_div.append(time,comment_Item);
		time_div.append(time);
		div.append(div_user,time_div);
		li_root.append(div);
		ul.append(li_root);
		/* 添加DOM事件 */
		/* comment_Item.click(function(event){
			 event.stopPropagation();
			//评论发布框 
			if ($(this).parent().next().length===0) {
				let comment_id= eval('(' + div_user
				.data("comments-user") + ')');
				let div_input =$("<div></div>");
				div_input.append($.input_comment(that,"写下你的评论",dynamic,comment_id));
				$(this).parent().after(div_input);
				 event.stopPropagation();
				  $(this).parent().next().find("p#comment").focus()
			}else{
				$(this).parent().next().remove();
			}
		}) */
		return ul;
	}
	
	/* 显示评论 */
	$.comment_ul=function (that,dynamic,z) {
		
		let div_1=$("<div class='commentList'>");
		let text=$.comments_ajax(that,dynamic,z,1);
		let tr
		if (z==1) {
			tr=text.comment;
		} else{
			tr=text.list;
		}
		
		//console.log(text);
		//that.children().eq(0).text(text.total+" 条评论");
		//console.log(text);
		for (let list of tr) {
			//console.log(list)
			div_1.append($.li_comment(list,dynamic));
		}
		//console.log(that)
		that.next().append(div_1);
		
		if (text.pages>1) {
			let div_2=$("<div class='commentPages'id='commentPages'>");
			$.fenye(div_2,text);
			that.next().append(div_2);
			div_2.ready(function () {
				let n=1;
				div_2.on("click","button.Button.button-page",function (event) {
					event.stopPropagation();// 阻止默认事件 
					event.preventDefault();//防止事件遍历的该标签上
					$("button.button-plan:disabled").removeAttr("disabled");
					switch ($(this).text()){
						case "上一页":
							n--;
							break;
						case "下一页":
							n++;
							break;
						default:
							n=$(this).text();
							break;
					}
					//button_l=$(".Button.button-page");
					let page=$.comments_ajax(that,dynamic,z,n);
					div_2.empty();
					$.fenye(div_2,page);
					div_1.empty();
					for (let list of page.list) {
						//console.log(list)
						
						div_1.append($.li_comment(list,dynamic));
					}
					
					
					//console.log(n);
				})
			}) 
		}
		
	}
	// 定位div(contenteditable = "true")；超过字数光标定位到末端
	function set_focus(e) {
		//console.log(e)
		e.focus();
		if ($.support.msie) {
		    let range = document.selection.createRange();
		    this.last = range;
		    range.moveToElementText(e[0]);
		    range.select();
		    document.selection.empty(); // 取消选中
		} else {
		    let range = document.createRange();
		    range.selectNodeContents(e[0]);
		    range.collapse(false);
		    let sel = window.getSelection();
		    sel.removeAllRanges();
		    sel.addRange(range);
		}
	}
	
	/* 发布评论框 */
	$.input_comment = function (that,text,dynamic/* ,touser */) {
		let div = $("<div class='input-comment'>");
		let form = $("<form class='comment-form' autocomplete='off'>");
		let div_item = $("<div class='form-item'></div>");
		let label = $("<label class='comment-label'></label>");
		let p_span=$("<p class='p-limit'><span>0</span>/100</p>")
		let input = $("<p contenteditable='true' id='comment'>");
		let span = $("<span class='p-span'>写下你的评论(100字以内)</span>");
		let button = $("<button class='Button button--pink'>发表</button>");
		label.append(p_span,input,span);
		div_item.append(label,button);
		form.append(div_item);
		div.append(form);
		label.click(function () {
			event.stopPropagation();
			event.preventDefault();
			set_focus(input);
			//console.log($(this).children("span"));
			if (input.text().length===0) {
				$(this).children("span").hide(100);
			} 
		})
		label.mouseleave(function () {
			event.stopPropagation();
			event.preventDefault();
			if (input.text().length===0) {
				$(this).children("span").show(500);
			} 
		})
		
		/* 动态字数限制和相应的设置 */
		let lock=true;
		
		/* 解决中文输入法的问题 */
		input.on('compositionstart', function () {
		    event.stopPropagation();
		    event.preventDefault();
			lock = false;
		});
		input.on('compositionend', function (event) {
		    event.stopPropagation();
		    event.preventDefault();
			lock = true;
		    addInput(event, $(this),lock);
		});
		input.on('keyup input propertychange', function (event) {
		    event.stopPropagation();
		    event.preventDefault();
			lock = true;
			addInput(event, $(this),lock);
			if($(this).text().length!==0){
				$(this).next("span").hide(100);
			}else{
				$(this).next("span").show(500);
			}
		});
		input.focus(function (event) {
			event.stopPropagation();
			event.preventDefault();
			//console.log(1);
			//console.log($(this).text().length===0)
			if($(this).text().length===0){
				$(this).next("span").show(500);
			}else{
				$(this).next("span").hide(100);
			}
			
		})
		 
		// 粘贴div(contenteditable = "true")富文本转为纯文本
		input.on("paste", function (e) {
		    e.stopPropagation();
		    e.preventDefault();
		    let text = '', event = (e.originalEvent || e);
		    if (event.clipboardData && event.clipboardData.getData) {
		        text = event.clipboardData.getData('text/plain');
		    } else if (window.clipboardData && window.clipboardData.getData) {
		        text = window.clipboardData.getData('Text');
		    }
		    if (document.queryCommandSupported('insertText')) {
		        document.execCommand('insertText', false, text);
		    } else {
		        document.execCommand('paste', false, text);
		    }
		});
		
		
		let fullContent="";
		// 字数限制
		function addInput(event, then,lock) {
		    let _words = then.text();
		    let _this = then;
		   if (lock) {
		        let num = _words.length;
		        if (num >= 100) {
		            num = 100;
		            if (event.target.style.borderColor == ('red' || 'rgb(205, 205, 205)')) {
		                event.target.innerText = fullContent;
		            } else {
		                event.target.innerText = _words.substring(0, 100);
		                //_this.css('border-color', 'red');
		                then.prev().css('color', 'red');
		                fullContent = _words.substring(0, 100);
		            }
		            set_focus(then);
		        } else {
		            //_this.css('border-color', '#CDCDCD');
		            then.prev().css('color', '#CDCDCD');
		            fullContent = ''
		        }
		        then.prev().children("span").text(num);
		    } else if (fullContent) {
		        // 目标对象：超过100字时候的中文输入法
		        // 原由：虽然不会输入成功，但是输入过程中字母依然会显现在输入框内
		        // 弊端：谷歌浏览器输入法的界面偶尔会闪现
		        event.target.innerText = fullContent;
		        lock = true;
		        set_focus(then);
		    }
		}
		 
		
		/* 提交评论到后台 */
		button.click(function (event) {
			event.stopPropagation()
			event.preventDefault();
			if(input.text().length===0){
				return false;
			}
			
			let fd = new Object();
			fd.message=input.html();
			fd["dynamicId"]=dynamic.dynamicId;
			fd.userName=sessionStorage.getItem("username");
			fd["userId"]=sessionStorage.getItem("userId");
			/* if(typeof touser !=="undefined"){
				fd["toUserId"]=touser.authorId;
				fd.toUserName=touser.authorName;
			} */
			//console.log(JSON.stringify(fd));
			$.ajax({
				url:"http://8.129.177.19:8085/comment/dynamic",
				dataType:'json',//服务器返回json格式数据
				data:JSON.stringify(fd),
				type:'post',//HTTP请求类型
				timeout:10000,//超时时间设置为10秒；
				async:true,
				success:function(data){
					//console.log(data);
					if(data.code=="200"){
						//console.log(data);
						//let text=that.text().split(" ")[0];
						let commentCount=that.parent().prev().children(".content-comment");
						let text=commentCount.text().split(" ")[0];
						text=Number(text)
						text++;
						text=text+" 条评论";
						let span=commentCount.children("span").eq(0);
						commentCount.empty()
						commentCount.append(span,text);
						let d=new Date();
						let time=d.getTime()/1000;
						//that.children().eq(0).text(text);
						fd["time"]=time;
						that.next().children().prepend($.li_comment(fd,dynamic));
						
						input.empty();
						/* let page=$.comments_ajax(that,dynamic,1);
						let pagediv=$("#commentPages");
						pagediv.empty();
						$.fenye(pagediv,page);
						pagediv.prev().empty();
						for (let list of page.list) {
							pagediv.prev().append($.li_comment(that.next(),list,dynamic));
						} */
						
						//console.log();
						//hearder_info(true);
					}
					if (data.code=="401") {
						$.loginDIV();
					}
				},
				error:function(data){
					//hearder_info(false);
					console.log(data);
				}
			})
		})
		return div;
	}
	/* z参数表示是否显示具体评论 1否，2是 */
	$.card_dynamic=function (dynamic,z) {
		let cord = $("<div class='card item-dynamic recommend'>");
		cord.attr("data-content",
				"{'dynamicId':'"+dynamic.dynamicId+"','authorName':'"+dynamic.user.username+"','authorId':'"+dynamic.user.userId+"'}");
		/* 用户框 */
		let cord_author = $("<div class='dynamic-user'></div>");
		/* 动态发布用户头像框 */
		let span = $("<span class='author-pic'></span>");
		let img_src = JSON.parse(dynamic.user.avatarPicture)[0];
		let author_a=$("<a class='author_a' href='/QUANQUAN/view/people/user.homepage.html?userId="+dynamic.user.userId+"' ></a>");
		author_a.attr("data-personal",dynamic.userId);
		let img = $("<img class='author-img' src='http://123.56.160.202/hutquan/headPhoto/"+img_src+"'/>");
		author_a.append(img);
		span.append(author_a);
		/* 用户昵称 */
		let user_div=$("<div class='author-content'></div>");
		let username_div=$("<div class='username dynamic-username'></div>") 
		let username=$("<a class='author-name' target='_blank' href='/QUANQUAN/view/people/user.homepage.html?userId="+dynamic.user.userId+"'>"+dynamic.user.username+"</span>");
		username.attr("data-personal",dynamic.userId);
		username_div.append(username);
		/* 发布时间 */
		let dynamic_time=$("<div class='time-div dynamic-time'>");
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
			let message_content = $("<p class=''></p>").html(dynamic.message.replace(/\r\n/g, '<br />'));
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
		let text_comment;
		text_comment=dynamic.commentCount+" 条评论";
		let commentCount=$("<div class='content-comment'><span class='iconfont icon-icon-test'></span>"+text_comment+"</div>");
		let dynamic_id= eval('(' + cord
		.data("content") + ')');
		
		/*显示动态评论*/
		let comments=$("<div class='comments'>");
		/* 显示评论总数 */
		//console.log(dynamic);
		let div_1=$("<div class='comments-topbar'><h2 class='topbar-title'>最新评论</h2></div>");
		comments.append(div_1);
		let div_2 = $("<div></div>");
		comments.append(div_2);
		div_2.append($.comment_ul(div_1,dynamic_id,z))
		
		//console.log(div_1);
		/* 评论发布框 */
		let div_3 =$("<div></div>");
		div_3.append($.input_comment(div_1,"写下你的评论",dynamic_id));
		
		comments.append(div_3);
		
		message_actions.append(starCount,commentCount);
		cord_content.append(message,message_pic,message_actions,comments);
		/* 判断是否是自己的动态 */
		if (dynamic.self) {
			/* 添加删除按钮 */
			let delete_dynamic = $("<div class='delete-dynamic'><span class='iconfont icon-arrow-down'></span></div>");
			cord.append(delete_dynamic);
		}
		/* 动态框添加 */
		cord.append(cord_author,cord_content);
		//console.log(1);
		/* 赞同动态 */
		starCount.click(function (e) {
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
					async:true,
					success:function(data){
						//console.log(data);
						if (data.code=="200") {
							t.removeClass("button-like");
							t.addClass("button--star");
							t.empty();
							t.append(eq,"赞同 ",data.data);
						}
						if (data.code == '403') {
							$.loginDIV();
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
					async:true,
					success:function(data){
						//console.log(data);
						if (data.code=="200") {
							t.removeClass("button--star");
							t.addClass("button-like");
							t.empty();
							t.append(eq,"已赞同 ",data.data);
						}
						if (data.code == '403') {
							$.loginDIV();
						} 
					},
					error:function(data){
						//hearder_info(false);
						console.log(data);
					}
				})
				
			}
		})
		/* 评论聚焦 */
		commentCount.click(function (event) {
			event.stopPropagation();
			div_2.empty();
			$.comment_ul(div_1,dynamic,z);
			set_focus($(this).parent().next().find("p#comment"));
		})
		/* 添加DOM事件 */
		cord.ready(function(e){
			if(z!=1){
				return false;
			}
			
			message.click(function (event) {
				event.stopPropagation();//阻止事件遍历到该节点上
				event.preventDefault();//阻止默认事件
				let dynamic_id= eval('(' + $(this).parent().parent()
				.data("content") + ')');
				//console.log(dynamic_id);
				let t =$.dynamic_coment(dynamic_id);
				
				let body=$("body");
				body.children("div").eq(2).remove();
				body.css({
				　　"overflow-x":"hidden",
				　　"overflow-y":"hidden"
				});
				let div=$("<div>");
				let div_dynamic=$("<div class='dynamic-content'>");
				let div_item=$("<div class='dynamic-model'>");
				let div_model_inner=$("<div class='dynamci-model-inner'>");
				let em_close=$("<em class='iconfont icon-close'>");
				
				div_model_inner.append($.card_dynamic(t,2))
				div_item.append(div_model_inner,em_close);
				div_dynamic.append(div_item);
				div.append(div_dynamic);
				body.append(div);
				em_close.click(function(){
					
					$(".box.box-dynamic").addClass("box-delete");
					setTimeout(function(){div.remove()},600);
					body.css({
					　　"overflow-x":"auto",
					　　"overflow-y":"auto"
					});
				})
			})
			
			$.a_add=function (css,text,value) {
				let a_div=$("<a class='Button button-item-number' href='/QUANQUAN/view/people/user.homepage.html'>").addClass(css);
				let follows_div=$("<div class='number-itemInner'></div>");
				let follows_name=$("<div class='number-itemName'></div>").text(text);
				let follows_number=$("<strong class='number-itemValue'></strong>").text(value);
				follows_div.append(follows_name,follows_number);
				a_div.append(follows_div)
				return a_div;
			}
			$.user_info=function (user,top,left) {
				let body=$("body");
				body.children("div").eq(2).remove();
				let div = $("<div>");
				let div_div = $("<div class='user-info'>");
				div_div.css({"top":top,"left":left});
				let user_div = $("<div class='havecard'>");
				user_div.attr("data-personal",user.userId);
				let div_header=$("<div class='hoverCard-titlecontainer'>");
				/* 头像 */
				let img_src = JSON.parse(user.avatarPicture)[0];
				let img=$("<img width='70' height='70' src='http://123.56.160.202/hutquan/headPhoto/"+img_src+"'/>");
				let header_usertitle=$("<div class='hovercard-titleText'>");
				/* 用户名称 */
				let header_usertext=$("<div class='titleText-title'></div>");
				let span_user=$("<span></span>");
				let user_a=$("<a href='/QUANQUAN/view/people/user.homepage.html' target='_blank'></a>").text(user.username);
				span_user.append(user_a);
				header_usertext.append(span_user);
				header_usertitle.append(header_usertext);
				div_header.append(img,header_usertitle);
				/* 相应信息 */
				let div_main=$("<div class='hovercard-item'></div>");
				/* 对于的信息 */
				let div_border=$("<div class='hoverNumber'></div>");
				let self=$.a_add("button-self","关注",user.selfFollowCount);
				let follows=$.a_add("button-follows","粉丝",user.followCount)
				div_border.append(self,follows);
				/* 相应操作 */
				let div_footer_button=$("<div class='hovercard-button'></div>");
				let div_add=$("<button class='Button foolwsButton' type='button'></button>");
				let r;
				if (user.followed) {
					div_add.addClass("button--grey");
					r="已关注";
				} else{
					div_add.addClass("button--pink");
					let add_span=$("<span class='iconfont icon-add-select'></span>");
					div_add.append(add_span);
					r="加关注";
				}
				div_add.append(r);
				let div_letter=$("<button class='Button button--write letterButton' type='button'></div>");
				let letter=$("<span class='iconfont icon-xinxi'></span>");
				div_letter.append(letter,"发私信");
				div_footer_button.append(div_add,div_letter);
				div_main.append(div_border);
				if (sessionStorage.getItem("userId")!=user.userId) {
					div_main.append(div_footer_button);
				} 
				user_div.append(div_header,div_main);
				div_div.append(user_div);
				div.append(div_div);
				body.append(div);
				div_add.mouseenter(function (event) {
					event.stopPropagation();//阻止事件遍历到该节点上
					event.preventDefault();//阻止默认事件
					if($(this).text()!=="加关注"){
						$(this).text("取消关注");
					}
				})
				div_add.mouseleave(function (event) {
					event.stopPropagation();//阻止事件遍历到该节点上
					event.preventDefault();//阻止默认事件
					if($(this).text()!=="加关注"){
						$(this).text("已关注");
					}
				})
				div_add.click(function (event) {
					event.stopPropagation();//阻止事件遍历到该节点上
					event.preventDefault();//阻止默认事件
					let number=Number(follows.find("strong").text());
					if($(this).text()!=="加关注"){
						$.ajax({
							url:"http://8.129.177.19:8085/withfriend/remconcern",
							data:{
								"concernUserId":user.userId
							},
							dataType:'json',//服务器返回json格式数据
							type:'get',//HTTP请求类型
							timeout:10000,//超时时间设置为10秒；
							async:true,
							success:function(data){
								console.log(data);
								number--;
								follows.find("strong").text(number);
								div_add.empty();
								let span=$("<span class='iconfont icon-add-select'></span>");
								div_add.removeClass("button--grey");
								div_add.addClass("button--pink");
								div_add.append(span,"加关注");
							},
							error:function(xhr,type,errorThrown){
								
							}
						});
						return;
					}
					$.ajax({
						url:"http://8.129.177.19:8085/withfriend/addconcern",
						data:{
							"concernUserId":user.userId
						},
						dataType:'json',//服务器返回json格式数据
						type:'get',//HTTP请求类型
						timeout:10000,//超时时间设置为10秒；
						async:true,
						success:function(data){
							//console.log(data);
							number++;
							follows.find("strong").text(number);
							div_add.empty();
							div_add.removeClass("button--pink");
							div_add.addClass("button--grey");
							div_add.text("已关注");
						},
						error:function(xhr,type,errorThrown){
							
						}
					});
					return;
				})
			}
			/* 获取相对于父元素的位置 */
			function getOffsetTopByBody (el) {
			  let offsetTop = 0
			  while (el && el.tagName !== 'BODY') {
			    offsetTop += el.offsetTop
			    el = el.offsetParent
			  }
			  return offsetTop
			}
			cord.find("a").mouseenter(function (event) {
				event.stopPropagation();//阻止事件遍历到该节点上
				event.preventDefault();//阻止默认事件
				let top=getOffsetTopByBody($(this)[0]);
				top=top+20;
				let left=$(this).offset().left+10;
				let id=$(this).data("personal");
				$.ajax({
					url:"http://8.129.177.19:8085/user/selectuser/"+id,
					dataType:'json',//服务器返回json格式数据
					type:'get',//HTTP请求类型
					timeout:10000,//超时时间设置为10秒；
					async:false,
					success:function(data){
						//console.log(data);
						if (data.code=="200") {
							$.user_info(data.data,top,left);
						}					
					},
					error:function(data){
						//hearder_info(false);
						console.log(data);
					}
				})
			})
			
			cord.find("a").mouseleave(function (event) {
				event.stopPropagation();//阻止事件遍历到该节点上
				event.preventDefault();//阻止默认事件
				
				let t=$(".user-info");
				if (t.length>0) {
					let h=t.outerHeight();
					let w=t.outerWidth();
					let y=event.offsetY;
					let x=event.offsetX;
					if(x<10||y<20||x>(w+10)||y>(h+20)){
						t.addClass("user-info-delete");
						setTimeout(function () {
							t.parent().remove();
						},400)
					}
					t.mouseleave(function (event) {
						event.stopPropagation();//阻止事件遍历到该节点上
						event.preventDefault();//阻止默认事件
						let t=$(this);
						//console.log(t);
						t.addClass("user-info-delete");
						setTimeout(function () {
							t.parent().remove();
						},400)
					
					})	
				}
				
				
			})
			
			
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
						async:true,
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
		return cord;
	}
	/* 限制动态加载 */
	let dynamic_load = false;
	
	
	$.dynamic_list=function(data){
		let content= $("div.dynamic-list div.content");
		//console.log(data);
		for (let dynamic of data) {
			content.children()
				.eq(content.children()
				.length-1).before(
					$.card_dynamic(dynamic,1));
		}
	}
	
	/* 从后台查询推荐动态 */
	function load(page){
		$.ajax({
			url:"http://8.129.177.19:8085/withfriend/dynamicbytime/"+page,
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			async:true,
			success:function(data){
				//console.log(data);
				if(data.code=="200"){
					
					sessionStorage.setItem("page",data.data.pageNum);
					sessionStorage.setItem("pages",data.data.pages);
					$.dynamic_list(data.data.list);
					/* 动态加载完毕 */
					dynamic_load = false;
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
	$(".content").ready(function () {
		let s=$("nav.dynamic-taps a.dynamic-links-a.is-active").text();
		let l=$(".content").children("div").eq(0).children().length
		//console.log(l)
		if (s==="推荐"&&l===0) {
			dynamic_load=true;
			load(1);
			l=$(".content").children("div").eq(0).children().length
		}
		return false;
	})
	/* 内容切换 */
	$("nav.dynamic-taps a.dynamic-links-a").click(function(){
		$("a.dynamic-links-a").removeClass("is-active");
		$(this).addClass('is-active');
		$("div.content").empty();
		$("div.content").append($("<div></div>"))
		if ($(this).text()==='推荐') {
			load(1);
		}
		if($(this).text()==='热点'){
			$.hotspot();
		}
		if($(this).text()==="关注"){
			$.follow(1);
		}
	})
	/* 热点动态的显示 */
	$.hotspot = function(){
			$.ajax({
				url:"http://8.129.177.19:8085/withfriend/dynamic",
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
	}
	/* 无关注内容 */
	$.follow_not=function () {
		let content= $("div.dynamic-list div.content");
		let div_notFollow=$("<div class='notFollow'></div>");
		let span_not=$("<span class='iconfont icon-kong icon-h6'></span>");
		let div_text=$("<div class='notFollow-text'>还没有关注的人</div>");
		div_notFollow.append(span_not,div_text);
		content.children(content.children().length-1)
			.before(div_notFollow);
		
	}
	$.follow=function (page) {
		$.ajax({
			url:"http://8.129.177.19:8085/withfriend/condynamic/"+page,
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			async:true,
			success:function(data){
				console.log(data);
				if(data.code=="200"){
					if(typeof data.data !== "undefined"){
						sessionStorage.setItem("page",data.data.pageNum);
						sessionStorage.setItem("pages",data.data.pages);
						$.dynamic_list(data.data.list);
					}else{
						$.follow_not();
					}
					
					
					//hearder_info(true);
				}else{
					console.log(data);
					$.loginDIV();
				}
			},
			error:function(data){
				//hearder_info(false);
				
				console.log(data);
			}
		})
	}
	/* 触底加载 */
	$(window).mousewheel(function(){
		if ($(document).height()-$(this).scrollTop()-$(this).height()<500) {
			let page = sessionStorage.getItem("page")
			let pages = sessionStorage.getItem("pages")
			if (!dynamic_load&&page!=pages) {
				dynamic_load = true;
				let t=$(".dynamic-links-a.is-active").text()
				if(t==="推荐"){
					load(page+1);
				}
				if(t==="关注"){
					$.follow(page+1);
				}
				
			}
		} 
	})
})()