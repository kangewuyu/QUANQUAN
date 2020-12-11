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
	if (typeof userId !="undefined"&&userId) {
		//console.log(1)
	} else{
		
	}
	 console.log(userId)
	//search_page(1);
	//console.log(user);
	//$.fenye($(".followdPages"),t);
})()