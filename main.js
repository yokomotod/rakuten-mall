$(function() {
    $.ajax({
	type: "GET",
	url: "search.php",
	dataType: "xml",
	success: function(xml) {
	    $(xml).find("Item").each(function() {
		var image_link = "<p><img src='" + $($(this).find("mediumImageUrl")).text() + "'></p>";
		$("#main").append(image_link);
	    });
	},
    })
});