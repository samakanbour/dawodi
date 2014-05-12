$(document).ready(function () {
	$('.content').fadeOut(0);
	$('.footer').fadeOut(0);
	$("#menu ul li a").click(function () {
		$('.content').fadeOut(0);
		$('.footer').fadeOut(0);
		$('#menu ul li a').removeClass("checked");
		var name = $(this)[0].id;
		if (name != "home") {
			$('footer').animate({
				"bottom": "0"
			});
			$('#map').animate({
				"margin-top": "-130px"
			});
			if (name == "client") {
				$('#footer').animate({
					"top": "200px"
				});
			} else if (name == "events") {
				$('#footer').animate({
					"top": "250px"
				});
			} else {
				$('#footer').animate({
					"top": "300px"
				});
			}
			$('#' + name + '-content').fadeIn();
			$('#' + name + '-footer').fadeIn();
		} else {
			$('footer').animate({
				"bottom": "-280px"
			});
			$('#map').animate({
				"margin-top": "0"
			});
		}
		$(this).addClass("checked");
	});
	$("#map").click(function () {
		$('footer').animate({ "bottom": "-280px" });
		$('#map').animate({ "margin-top": "0" });
		$('#menu ul li a').removeClass("checked");
		$('.content').fadeOut(0);
		$('.footer').fadeOut(0);
		$("#home").addClass("checked");
	});
	$("article").click(function () {
		$('footer').animate({ "bottom": "-280px" });
		$('#map').animate({ "margin-top": "0" });
		$('#menu ul li a').removeClass("checked");
		$('.content').fadeOut(0);
		$('.footer').fadeOut(0);
		$("#home").addClass("checked");
	});
});