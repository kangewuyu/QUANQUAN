!function(e,t){
	/* $.ajaxSetup({
		contentType:'application/json',
	}); */
	//location.search=sessionStorage.search;
	
	let dynamic_load=false;
	$.search_dynamic=function (val,page) {
		$.ajax({
			url:"http://8.129.177.19:8085/search/dynamic/"+val+"/"+page,
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				console.log(data)
				if(data.code=="200"){
					sessionStorage.setItem("page",data.data.pageNum);
					sessionStorage.setItem("pages",data.data.pages);
					$.dynamic_list(data.data.list);
					/* 动态加载完毕 */
					dynamic_load = false;
				}else{
					
				}
			},
			
		}); 
	}
	let search = $("input[name='search']");
	search.val(sessionStorage.search);
	//console.log(search.val());
	setTimeout(function () {
		if(sessionStorage.search.length!==0){
			$.search_dynamic(sessionStorage.search,1)
		}
	},10)
	
	
	/* 触底加载 */
	$(window).mousewheel(function(){
		if ($(document).height()-$(this).scrollTop()-$(this).height()<500) {
			let page = sessionStorage.page
			let pages = sessionStorage.pages
			if (!dynamic_load&&page!=pages) {
				dynamic_load = true;
				if (sessionStorage.search.length!=0) {
					$.search_dynamic(page+1);
				} 
				
			}
		}
	})

}();