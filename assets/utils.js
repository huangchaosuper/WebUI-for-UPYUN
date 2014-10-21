'use strict';
/*
 * utils 
 * author:huangchaosuper@gmail.com
 * date:May 17, 2014
 */
 var CloudServer = 'http://v0.api.upyun.com/';
 var CloudPath = '/';
 var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
 var base64DecodeChars = new Array(
 	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
 	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
 	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
 	52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
 	-1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
 	15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
 	-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
 	41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

 function base64encode(str) {
 	var out, i, len;
 	var c1, c2, c3;
 	len = str.length;
 	i = 0;
 	out = "";
 	while(i < len) {
 		c1 = str.charCodeAt(i++) & 0xff;
 		if(i == len)
 		{
 			out += base64EncodeChars.charAt(c1 >> 2);
 			out += base64EncodeChars.charAt((c1 & 0x3) << 4);
 			out += "==";
 			break;
 		}
 		c2 = str.charCodeAt(i++);
 		if(i == len)
 		{
 			out += base64EncodeChars.charAt(c1 >> 2);
 			out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
 			out += base64EncodeChars.charAt((c2 & 0xF) << 2);
 			out += "=";
 			break;
 		}
 		c3 = str.charCodeAt(i++);
 		out += base64EncodeChars.charAt(c1 >> 2);
 		out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
 		out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
 		out += base64EncodeChars.charAt(c3 & 0x3F);
 	}
 	return out;
 }

 function base64decode(str) {
 	var c1, c2, c3, c4;
 	var i, len, out;
 	len = str.length;
 	i = 0;
 	out = "";
 	while(i < len) {
 		/* c1 */
 		do {
 			c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
 		} while(i < len && c1 == -1);
 		if(c1 == -1)
 			break;
 		/* c2 */
 		do {
 			c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
 		} while(i < len && c2 == -1);
 		if(c2 == -1)
 			break;
 		out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
 		/* c3 */
 		do {
 			c3 = str.charCodeAt(i++) & 0xff;
 			if(c3 == 61)
 				return out;
 			c3 = base64DecodeChars[c3];
 		} while(i < len && c3 == -1);
 		if(c3 == -1)
 			break;
 		out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
 		/* c4 */
 		do {
 			c4 = str.charCodeAt(i++) & 0xff;
 			if(c4 == 61)
 				return out;
 			c4 = base64DecodeChars[c4];
 		} while(i < len && c4 == -1);
 		if(c4 == -1)
 			break;
 		out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
 	}
 	return out;
 }

 function sign(username,password,method, uri, date, length){
 	var sign = method + '&' + uri + '&' + date + '&' + length + '&' + md5(password);
 	return 'UpYun ' + username + ':' + md5(sign);
 }

 function smoothScroll(target) {
 	var scrollContainer = target;
    do { //find scroll container
    	if (!scrollContainer) return;
    	scrollContainer = scrollContainer.parentNode;
    	scrollContainer.scrollTop += 1;
    } while (scrollContainer.scrollTop == 0);

    var targetY = 0;
    do { //find the top of target relatively to the container
    	if (target == scrollContainer) break;
    	targetY += target.offsetTop;
    } while (target = target.offsetParent);

    scroll = function(c, a, b, i) {
    	i++; if (i > 30) return;
    	c.scrollTop = a + (b - a) / 30 * i;
    	setTimeout(function(){ scroll(c, a, b, i); }, 20);
    }
    // start scrolling
    scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
}

 function usage(username,password,path){
 	var authorization = 'Basic ' + base64encode(username+':'+password);
 	var response = $.ajax({
 		url:path,
 		beforeSend: function(XMLHttpRequest) {
 			XMLHttpRequest.setRequestHeader("Authorization",authorization);
 		},
 		crossDomain:true,
 		async:false,
 	});
 	return response.responseText;
 }

 function createFolder(username,password,path){
 	var authorization = 'Basic ' + base64encode(username+':'+password);
 	var response = $.ajax({
 		url:path,
 		beforeSend: function(XMLHttpRequest) {
 			XMLHttpRequest.setRequestHeader("Authorization",authorization);
 			XMLHttpRequest.setRequestHeader("folder","true");
 			XMLHttpRequest.setRequestHeader("mkdir","false");
 		},
 		crossDomain:true,
 	});
 }

 function remove(username,password,path){
 	var authorization = 'Basic ' + base64encode(username+':'+password);
 	$.ajax({
 		type: 'DELETE',
 		url:path,
 		beforeSend: function(XMLHttpRequest) {
 			XMLHttpRequest.setRequestHeader("Authorization",authorization);
 		},
 		crossDomain:true,
 	});
 }

/*
 function upload(username,password,path,data){
 	var authorization = 'Basic ' + base64encode(username+':'+password);
 	var xhr = new XMLHttpRequest();
 	xhr.open('PUT', path, true);
 	xhr.setRequestHeader("Origin","*");
 	xhr.setRequestHeader("Authorization",authorization);
 	xhr.send(data);
 }
*/
 function upload(username,password,path,data){
 	var authorization = 'Basic ' + base64encode(username+':'+password);
 	$.ajax({
 		url: path,
 		type: 'PUT',
 		beforeSend: function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader("Authorization",authorization);
		},
		crossDomain:true,
		data: data,
	});
 }
 function structure(username,password,path){
 	var authorization = 'Basic ' + base64encode(username+':'+password);
 	var response = $.ajax({
 		url:path,
 		beforeSend: function(XMLHttpRequest) {
 			//XMLHttpRequest.setRequestHeader("Origin","*");
 			XMLHttpRequest.setRequestHeader("Authorization",authorization);
 		},
 		crossDomain:true,
 		async:false,
 	});
 	var directoryList = new Array();
 	if(response.responseText){
 		var items = response.responseText.split('\n');
 		for (var i=0;i<items.length;i++){
 			var elements = items[i].split('\t');
 			if(elements.length == 4){
 				var element = new Object();
 				element.name = elements[0];
 				element.type = elements[1];
 				element.size = elements[2];
 				element.date = elements[3];
 				directoryList.push(element);
 			}
 		}
 	}
 	directoryList.sort(function(a,b){return a.type=='N'?1:-1});
 	return directoryList;
 }