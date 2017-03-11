function CheckBoxManager(optionMap, imageNameKey, imageSrc, imageType, formName, formField) {
	this.optionMap = optionMap;
	this.imageNameKey = imageNameKey;
	this.imageSrc = imageSrc;
	this.imageType = imageType;
	this.formName = formName;
	this.formField = formField;
	this.onKey = "on";
	this.offKey = "off";
}

function RadioButtonManager(optionMap, imageNameKey, imageSrc, imageType, formField) {
	this.optionMap = optionMap;
	this.imageNameKey = imageNameKey;
	this.imageSrc = imageSrc;
	this.imageType = imageType;
	this.formField = formField;
	this.onKey = "on";
	this.offKey = "off";
}

function updateOptionImages(checkBoxManager) {
	var optionMap = checkBoxManager.optionMap;
	for (var i in optionMap) {
		var image = document.images[checkBoxManager.imageNameKey + i];
		var imageSrc = optionImageSrc(checkBoxManager, optionMap[i]);
		setTimeout("document.images[\"" + checkBoxManager.imageNameKey + i + "\"].src = \"" + imageSrc + "\";", 10);
	}
}

function optionImageSrc(checkBoxManager, option) {
	var key = checkBoxManager.offKey;
	if ( option.selected ) {
		key = checkBoxManager.onKey
	}
	return checkBoxManager.imageSrc + "_" + key + "." + checkBoxManager.imageType;
}

function setOptionsInForm(checkBoxManager) {
	var form = document.forms[checkBoxManager.formName];
/*
for (var i=0; i < document.forms.length; i++) {
	for (var x in document.forms[i]) {
		var f = document.forms[i];
	}
}
*/
	var formNodes = form.childNodes;
	for (var i=0; i < formNodes.length; i++) {
		if ( ( formNodes[i].nodeName.toLowerCase() == "input" ) &&
			 ( formNodes[i].name == checkBoxManager.formField ) )
		{
			form.removeChild(formNodes[i]);
			i--;
		}
	}
	for (var optionId in checkBoxManager.optionMap) {
		var option = checkBoxManager.optionMap[optionId];
		if ( option.selected ) {
			addHiddenField(form, checkBoxManager.formField, option.id);
		}
	}
}

function addHiddenField(form, fieldName, fieldValue) {
	var hiddenField = document.createElement("input");
	hiddenField.name = fieldName;
	hiddenField.type = "hidden";
	form.appendChild(hiddenField);
	hiddenField.value = fieldValue;
}

function handleOptionClick(checkBoxManager, optionId) {
	var option = checkBoxManager.optionMap["" + optionId];
	if ( typeof(option) == "undefined" ) return;
	option.selected = ! option.selected;
	updateOptionImages(checkBoxManager);
}

		function submitCompareVehicles() {
			
			var form = document.forms[compareVehicleManager.formName];
			form.target = "_blank";
			setOptionsInForm(compareVehicleManager);
			if(form.elements.length == 0){
				document.getElementById('noSelect').style.display = "block";
				return;
			}else{
				document.forms[compareVehicleManager.formName].submit();
			}

}
