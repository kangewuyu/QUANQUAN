(function () {
	$.ajaxSetup({
		contentType:'application/json',
	})
	
	/* 判断当前location 是否为顶层 来禁止frame引用 */
	if(top.location!=self.location){
	     top.location=self.location;
	}
	// 该事件是核心
	
	window.addEventListener('storage', function(event) {
		if (event.key == 'getSessionStorage') {

			// 已存在的标签页会收到这个事件
			localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
			localStorage.removeItem('sessionStorage');
	
		} else if (event.key == 'sessionStorage' && !sessionStorage.length) {
			// 新开启的标签页会收到这个事件
			var data = JSON.parse(event.newValue),
					value;
					//console.log(key)
			for (key in data) {
				sessionStorage.setItem(key, data[key]);
			}
			
		}else if (event.key =='setItem') {
			/* 实现登录后所有页面共享token */
			if (event.newValue!=null) {
				sessionStorage.setItem("token",event.newValue);
			}
			if (!location.href.match("login.html")) {
				window.location.reload();
			}
			
			localStorage.removeItem('setItem');
			
		}else if (event.key=='removeItem') {
			/* 实现退出登录后所有页面移除token */
			sessionStorage.removeItem("token");
			window.location.reload();	
			localStorage.removeItem('removeItem');
			
		}
	});
	/* 禁止回车提交表单 */
	$("input").each(
		function(){
			$(this).keypress( function(e) {
				var key = window.event ? e.keyCode : e.which;
				if(key.toString() == "13"){
					return false;
				}
			});
	});
	/* 转化为json格式 */
	$.fn.serializeJson =  function(filter){
		var serializeObj={};
		var array=this.serializeArray();
		var str=this.serialize();
		$(array).each(function(){
			if(this.name!=filter){
				if(serializeObj[this.name]){
					if($.isArray(serializeObj[this.name])){
						serializeObj[this.name].push(this.value);
					}else{
						serializeObj[this.name]=[serializeObj[this.name],this.value];
					}
				}else{
					serializeObj[this.name]=this.value;
				}
			}
		});
		return serializeObj;
	};
	
	
	
	/* 分页 */
	$.fenye=function (div,text) {
		let pageNum=Number(text.pageNum);
		let pages=Number(text.pages);
		if (pageNum!=1) {
			let button_prev=$.button_add().addClass("Button button-page button-plan button-prev").text("上一页");
			div.append(button_prev);
		}
		if(pages<=5){
			for (let i = 1; i<=pages; i++) {
				let button=$.button_add().addClass("Button button-page button-plan").text(i);
				if (pageNum==i) {
					button.attr('disabled',true);
				}
				div.append(button);
			}
		}else if (pageNum<4) {
			for (let i = 1; i <= 4; i++) {
				let button=$.button_add().addClass("Button button-page button-plan").text(i);
				if (pageNum==i) {
					button.attr('disabled',true);
				}
				div.append(button);
			}
			
			let button_el=$.button_add().addClass("Button button-page button-el").text("...");
			button_el.attr("disabled",true);
			let button_pages=$.button_add().addClass("Button button-page button-plan").text(pages);
			div.append(button_el,button_pages);
		} else if((pageNum+2)>=pages){
			let button=$.button_add().addClass("Button button-page button-plan").text(1);
			let button_el=$.button_add().addClass("Button button-page button-el").text("...");
			button_el.attr("disabled",true);
			div.append(button,button_el);
			for(let i=pages-3;i<=pages;i++){
				let button=$.button_add().addClass("Button button-page button-plan").text(i);
				if (pageNum==i) {
					button.attr('disabled',true);
				}
				div.append(button);
			}
		}else{
			let button=$.button_add().addClass("Button button-page button-plan").text(1);
			let button_el=$.button_add().addClass("Button button-page button-el").text("...");
			button_el.attr("disabled",true);
			div.append(button,button_el);
			for(let i=pageNum-1;i<=pageNum+1;i++){
				let button=$.button_add().addClass("Button button-page button-plan").text(i);
				if (pageNum==i) {
					button.attr('disabled',true);
				}
				div.append(button);
			}
			let button_el_2=$.button_add().addClass("Button button-page button-el").text("...");
			button_el_2.attr("disabled",true);
			let button_pages=$.button_add().addClass("Button button-page button-plan").text(pages);
			div.append(button_el_2,button_pages);
		}
		if(pageNum !=pages){
			let button_prev=$.button_add().addClass("Button button-page button-plan button-next").text("下一页");
			div.append(button_prev);
		}
	}
})()