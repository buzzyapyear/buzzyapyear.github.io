/* Utility Functions */

function arrayContains( anArray, anObject ) {
	if ( ( typeof(anArray) == "undefined" ) || ( anArray == null ) ) return false;
	for ( var i=0; i<anArray.length; i++) {
		if ( anArray[i] == anObject ) return true;
	}
	return false;
}

function defaultCurrencyFormat( num ) {
	return currencyFormatWithCents(num, true);
}

function currencyFormat( num ) {
	if (isNaN(num)) num = 0;
	var numFormat = "";

	num = Math.round(num);

	if ( ( typeof(num) != undefined ) && ( num != null ) ) {
		num = "" + num;
		for (var i=num.length; i - 3 >= 0; i -= 3) {
			numFormat = num.substring(i-3,i) + numFormat;
			if ( i - 3 > 0 ) numFormat = "," + numFormat;
		}
		if ( i > 0 ) numFormat = num.substring(0,i) + numFormat;
	}
	return "$" + numFormat;
}

function currencyFormatWithCents( num, ignoreZeroCents  ) {
	if (isNaN(num)) num = 0;

	var sign = "";
	var cents = "00";

	if ( num != 0 ) {
		cents = "" + Math.round( Math.abs(num) * 100 );
		cents = cents.substring(cents.length-2);
	}
	if ( ( cents == "00" ) && ignoreZeroCents ) cents = "";

	num = "" + Math.floor(num);

	for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++) {
		num = num.substring(0,num.length-(4*i+3))+',' + num.substring(num.length-(4*i+3));
	}

	if ( num < 0 ) sign = "-";
	if ( cents != "" ) num += "." + cents;

	return sign + '$' + num;
}
/*
function toUpperAndLower(someString) {
	if (someString.substring(0,1) >="0" && someString.substring(0,1) <= "9")
		return someString.substring(0,2).toUpperCase() + someString.substring(2).toLowerCase();
	else
		return someString.substring(0,1).toUpperCase() + someString.substring(1).toLowerCase();
}
*/
function setHtml( pageItem, value ) {
	if ( ( typeof(pageItem) == "undefined" ) ||
		( pageItem == null ) ||
		( typeof(pageItem.innerHTML) == "undefined" ) )
	{
		return;
	}
	if ( value == null ) return;
	pageItem.innerHTML = value;
}

function setImgSrc( image, src ) {
	if ( typeof(image) == "undefined" ) return;
	if ( ( image == null ) || ( src == null ) ) return;
	image.src = src;
}
/*
function setStyleClass( pageItem, className ) {
	if ( ( typeof(pageItem) == "undefined" ) || ( typeof(className) == "undefined" ) ) return;
	pageItem.className = className; 
}
*/
/* Window Handling Functions */
/*
function openTargetWindow(linkObject, windowName, windowProperties) {
	if ( linkObject != null ) {
		linkObject.target = windowName;
	}
	var targetWindow = window.open("about:blank", windowName, windowProperties);
	if ( targetWindow != null ) {
		targetWindow.focus();
	}
}
*/

function openShowDealersWindow(url) {
	if ( typeof(url) == "undefined" ) url = "about:blank";
	return openWindow(url, "showDealers", "width=500,height=700");
}

function openWindow(url, windowName, windowProperties) {
	var newWindow = window.open(url, windowName, windowProperties);
	if ( newWindow != null ) {
		newWindow.focus();
	}
	return newWindow;
}

/* Vehicle Info Box Functions */

function Vehicle( basePrice, deliveryFee, docFee, accessoriesPrice, loanRate, loanTerm ) {

	function totalPrice() {
		if ( this.basePrice == null ) return 0;
		return this.basePrice + this.deliveryFee + this.docFee + this.accessoriesPrice;
	}

	function monthlyPayment() {
		if ( ( this.loanRate <= 0 ) || ( this.loanTerm == -1 ) ) return -1;
		var totalPayment = this.totalPrice();
		var monthlyRate = this.loanRate / 12.00;
		var exp = Math.pow(1.0 + monthlyRate/100.00, loanTerm);
		var pmt = 0.00;
		if ( this.loanRate != 0.00 ) {
			pmt = monthlyRate/100.00 * totalPayment * exp / (exp - 1);
		}
		else {
			pmt = totalPayment/loanTerm;
		}
		var adjusted = Math.round(pmt * 100.00);
		pmt = adjusted / 100.00;
		return pmt;
	}

	function initDisplay() {
		this.display = new VehicleDisplay( this );
		this.display.update();
	}

	function updateVehicle( updateObject ) {
		for ( var x in updateObject ) {
			if ( typeof(this[x]) != "undefined" ) this[x] = updateObject[x];
		}
		if ( ( typeof(this.display) != "undefined" ) && ( this.display != null ) ) {
			this.display.update();
		}
	}

	this.basePrice = basePrice;
	this.deliveryFee = deliveryFee;
	this.docFee = docFee;
	this.accessoriesPrice = accessoriesPrice;
	this.loanRate = loanRate;
	this.loanTerm = loanTerm;

	this.modelImageSrc = null;

	this.display = null;

	this.totalPrice = totalPrice;
	this.monthlyPayment = monthlyPayment;
	this.initDisplay = initDisplay;
	this.update = updateVehicle;

	return this;
}

function VehicleDisplay( vehicleObject ) {

	function updateDisplay() {
		setHtml( this.basePrice, defaultCurrencyFormat( this.vehicle.basePrice ) );
		setHtml( this.deliveryFee, defaultCurrencyFormat( this.vehicle.deliveryFee ) );
		setHtml( this.docFee, defaultCurrencyFormat( this.vehicle.docFee ) );
		setHtml( this.accessoriesPrice, defaultCurrencyFormat( this.vehicle.accessoriesPrice ) );
		setHtml( this.totalPrice, defaultCurrencyFormat( this.vehicle.totalPrice() ) );

		var monthlyPayment = this.vehicle.monthlyPayment();
		if ( this.vehicle.loanRate > 0 ) {
			monthlyPayment = defaultCurrencyFormat( monthlyPayment );
		}
		else {
			monthlyPayment = "";
		}
		setHtml( this.monthlyPayment, monthlyPayment );

		setImgSrc( this.vehicleImage, this.vehicle.modelImageSrc );
	}

	this.vehicle = vehicleObject;
	this.basePrice = document.getElementById("vehicleBasePrice");
	this.deliveryFee = document.getElementById("vehicleDeliveryFee");
	this.docFee = document.getElementById("vehicleDocFee");
	this.accessoriesPrice = document.getElementById("vehicleAccessoriesPrice");
	this.totalPrice = document.getElementById("vehicleTotalPrice");
	this.monthlyPayment = document.getElementById("monthlyPayment");
	this.update = updateDisplay;

	this.vehicleImage = document.images["vehicleImage"];

	return this;
}

function vehicleDisplayInitialized() {
	if ( typeof(vehicle) != "undefined" && vehicle == null &&
	     typeof(vehicle.display) != "undefined" || vehicle.display != null )
	{
		return true;
	}
	return false;
}

function initVehicleDisplay() {
	if ( typeof(vehicle) != "undefined" ) {
		vehicle.initDisplay();
	}
}

