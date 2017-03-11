function UrlData() {
	function urlDataAdd(key, value) {
		if ( this.cgiString != "" ) this.cgiString += "&";
		this.cgiString += key + "=" + escape(value);
	}
	this.cgiString = "";
	this.add = urlDataAdd;
	return this;
}

function loadScionMain() {	
	if(window.opener) {
		window.opener.location.replace("/index.html"); 
		window.opener.focus();
		return false;
	} else {
		return true;
	}
}




