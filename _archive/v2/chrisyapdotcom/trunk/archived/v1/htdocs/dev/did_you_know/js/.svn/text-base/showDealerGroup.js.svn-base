function showDealerGroup(groupNumber) {
	var dealerDiv = document.getElementById("dealerGroupLayer" + groupNumber);
	dealerDiv.style.display = "block";
	var i = 1;
	do {
		dealerDiv = document.getElementById("dealerGroupLayer" + i);
		if ( typeof(dealerDiv) == "undefined" ) {
			dealerDiv = null;
		}
		if ( ( dealerDiv != null ) && ( i != groupNumber ) ) {
				dealerDiv.style.display = "none";
		}
		i++;
	}
	while ( dealerDiv != null )
}