function exobiValidate() {
		
	var fullForm = $('realname','email','comments');
	var fullFormList = $A(fullForm);
	var required = $('email','comments');	
	var valList = $A(required);
		
	$('errors').style.display = 'block';
	$('errors').innerHTML = '';
		
	valList.each(function(valListItem){
		if(valListItem.value == '' || valListItem.value == null) {
			$('errors').style.display = 'block';
			new Insertion.Bottom('errors', 'The ' + valListItem.name + ' field is required.<br />');
		}
	});
		
	if($('errors').innerHTML == '') {
		// get data
		var pars = 'recipient=bobo&subject=Contact from chris.exobi.com&realname='+fullFormList[0].value+'&email='+fullFormList[1].value+'&comments='+fullFormList[2].value;
		var contactPost = new Ajax.Request('/formmail.php', 
		 						{
		 							asynchronous:true,
		 							method:'POST', 
		 							parameters:pars,
		 							onComplete: function()
		 									{
	var contactSuccessContainer = document.createElement('div');
	contactSuccessContainer.id = 'contentContactSuccess';
	$('content').appendChild(contactSuccessContainer);
	$('contentContactSuccess').innerHTML = '<h2>Contact</h2><p>Thanks!  Who knows... I may very well be in touch with you.</p>';
	Element.addClassName(contactSuccessContainer, 'contentContainer');
	Effect.FadeCYap('contentContact',{duration:0.5});
	$('contentContactSuccess').style.visibility = 'visible';
	Effect.AppearCYap('contentContactSuccess',{duration:.5});
	$('contentContact').style.visibility = 'hidden';
	$('content').removeChild($('contentContact'));
		 									
		 									}
		 						});
		
	}
		
	else {
		return false;
	}
}

function contactSuccess(){

}