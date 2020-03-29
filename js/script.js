 $(document).ready(function(){
	$('.tag_content').hide(); 

	$('.tag').hover(
			function() { $(this).children('div').fadeIn(400) },
			function() { $(this).children('div.tag_content').stop().fadeOut(400) }
	);
}); 
