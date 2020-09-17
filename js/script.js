var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active_collapsable");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}

$(document).ready(function(){
	$('.tag_content').hide(); 

	$('.tag').hover(
			function() { $(this).children('div').fadeIn(400) },
			function() { $(this).children('div.tag_content').stop().fadeOut(400) }
	);
}); 

