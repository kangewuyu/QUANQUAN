
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