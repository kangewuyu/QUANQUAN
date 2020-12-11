(function () {

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
	/* 页面滚动事件 */
	$(window).scroll(function(){
		let scrollTop=$(document).scrollTop()||$(window).scrollTop();  
		let header = $("header");
		if(scrollTop*1>0){
			
			header.addClass("is-fixed").css({"width":"100%","top":"0"});
			if(header.next()===null||typeof header.next()=='undefined'||header.next().length===0){
				header.parent().append(
					$("<div class='holder' style='position: relative;inset: 0px; display: block; float: none; margin: 0px; height: 60px;'></div>"));
			}
		}else{
			header.parent().children().eq(1).remove();
		   	header.removeClass("is-fixed").css({"width":"","top":""});
		}
		if (scrollTop*1>$(window).height()/2) {
			$("#base .backtop").addClass("backtop--hiden");
		} else{
			$("#base .backtop").removeClass("backtop--hiden");
		}
	})
	/* 页面回滚 */
	$("#base .backtop").click(function () {
		$("html,body").animate({scrollTop: 0}, 1000);
	})
	
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