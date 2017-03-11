<!--
//if you want to have email validation the name of that form field must be "email"
//otherwise any form field names are acceptable

//checks to make certain important info has been input

function checkForInfo(f,r) {
	r = r.split(",")
	var sError = "";
	for (j=0;j<r.length;j++){
		if ((f[r[j]].name == "email")){
			if ((f[r[j]].value == "")){
				if (sError == "") {
					sError = "You must supply this information:\n"
					sError = sError + r[j]
				} else {
					sError = sError + ", " + r[j]
				}
			} else if (!isEmail(f[r[j]].value)){
				if (sError == "") {
					sError = "You must supply a valid email address"
				} else {
					sError = sError + ", a valid email address"
				}
			}
		} else if ((f[r[j]].value == "")){
			if (sError == "") {
				sError = "You must supply this information:\n"
				sError = sError + r[j]
			} else {
				sError = sError + ", " + r[j]
			}
		}
	}
	if (!sError) return true;
	if (sError) {
		alert(sError+".");
		return false;
	}
}
// check for valid email
function isEmail(str) {
  // are regular expressions supported?
  var supported = 0;
  if (window.RegExp) {
    var tempStr = "a";
    var tempReg = new RegExp(tempStr);
    if (tempReg.test(tempStr)) supported = 1;
  }

  if (!supported) 
    return (str.indexOf(".") > 2) && (str.indexOf("@") > 0);
  var r1 = new RegExp("(@.*@)|(\\.\\.)|(@\\.)|(^\\.)");
  var r2 = new RegExp("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$");
  return (!r1.test(str) && r2.test(str));
}
//-->