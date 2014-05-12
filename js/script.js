document.addEventListener('DOMContentLoaded', function () {
	Tabletop.init({
		key: "0AhtG6Yl2-hiRdHpPNEZ3OWZoblZVdnJiS0VnR0s4U2c",
		callback: init
	});
});

function init(result) {	
	google.maps.event.addDomListener(window, 'load', initMap);
	function initMap() {
		var zoom = 2;
		var latitude = 18.0000;
		if ($(window).width() < 700) {
			zoom = 1;
			latitude = -35.0000;
		}
		var styles = [{featureType:"administrative",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"poi",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"landscape",elementType:"all",stylers:[{hue:"#727D82"},{lightness:-30},{saturation:-80}]},{featureType:"water",elementType:"all",stylers:[{visibility:"simplified"},{hue:"#F3F4F4"},{lightness:80},{saturation:-80}]}];
		var mapOptions = {
			zoom: zoom,
			center: new google.maps.LatLng(latitude, 60.0000),
			styles: styles
		};
		var map = new google.maps.Map($('figure')[0], mapOptions);
		initData(result, map);
		$('#zoom button.icon').click(function(e){
			if (this.name == 'in') {
				map.setZoom(map.getZoom() + 1);
			} else if (this.name == 'out') {
				map.setZoom(map.getZoom() - 1);
			}
		});
	}
}

function initData(result, map) {
	var img = '';
	var id = 0;
	var keys = {};
	var markers = [];
	var icon = {
		url: 	'img/marker.png',
		size: 	new google.maps.Size(20,26),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(10,13)	
	};
	result.data.elements.forEach(function (row) {
		$('#' + row.section).html(row.title);
		if (row.section == "events" || row.section == "order") return;
		if (row.section == "intro") {
			$('article h1').html(row.title);
			$('article h2').html(row.content);
		} else {
			$('#' + row.section + '-text').html(row.content);
		}
	});
	result.client.elements.forEach(function (row) {
		var content = '<div class="client-column"><div class="client-column-title">' + row.title + '</div><div class="client-column-list">';
		content += '<div class="client-title">• '+ row.first +'</div>';
		content += '<div class="client-title">• '+ row.second +'</div>';
		content += '<div class="client-title">• '+ row.third +'</div></div></div>';
		$("#client-footer").append(content);
	});
	result.map.elements.forEach(function (row) {
		var content = '<div class="slide" style="background-image: url(';
		content += row.image + ')"><span class="temp">' + row.city + '</span>';
		content += '<p>' + row.title + '</p></div>';
		$("#holder").append(content);
		var marker = new google.maps.Marker({
				map: map,
				icon: icon,
				position: new google.maps.LatLng(row.location.split(',')[0], row.location.split(',')[1]),
				title: row.title });
		google.maps.event.addListener(marker, 'click', function() { zoom(map, 8, this.getPosition()); });
		keys[row.city] = marker;
		markers.push(marker);
	});
	var markerCluster = new MarkerClusterer(map, markers, {
			styles: [{
				url: 'img/circle.png',
				height: 42,
				width: 42
			}]
		});
	var slider = {
		el: {
			slider: $("#slider"),
			allSlides: $(".slide"),
			sliderNav: $(".slider-nav"),
			allNavButtons: $(".slider-nav a")
		},
		timing: 800,
		slideWidth: 300,
		init: function () {
			var content = '<a title="0" class="active" id="nav-0"></a>';
			var divider = $(window).width() / 300;
			for (var i = 1; i < ($('#holder').children().length + 1 / divider) - divider + 1; i++) {
				content += '<a title="' + i + '" id="nav-' + i +'"></a>';
			}
			$('.slider-nav').html(content);
			this.bindUIEvents();
		},
		bindUIEvents: function () {
			this.el.slider.on("scroll", function (event) {
				slider.moveSlidePosition(event);
			});
			this.el.sliderNav.on("click", "a", function (event) {
				slider.handleNavClick(event, this);
			});
		},
		moveSlidePosition: function (event) {
			this.el.allSlides.css({
				"background-position": $(event.target).scrollLeft() / 3 - 100 + "px 0"
			});
		},
		handleNavClick: function (event, el) {
			event.preventDefault();
			var position = $(el).attr("title");
			this.el.slider.animate({
				scrollLeft: position * this.slideWidth
			}, this.timing);
			this.changeActiveNav(el);
		},
		changeActiveNav: function (el) {
			$(".slider-nav a").removeClass("active");
			$(el).addClass("active");
		}
	};
	slider.init();
	$(".slide").bind("flick", function(event) {
		if (event.direction == -1) {
			id++;
		} else {
			id--;
		}
		if (id >= 0) {
			$("#nav-" + id).click();
		}
		event.preventDefault();
		return false;
	});
	$(".slide").bind("tap", function(event) {
		$('.slide p').css({ "display" : "none" });
		if (img) {	$('.clicked').css({ "background-image" : img }); }
		if ($(this)[0].classList.length == 1) {
			$('.slide').removeClass("clicked");
			$(this).addClass("clicked");
			img = $(this)[0].style.backgroundImage;
			$(this).css({ "background-image" : "none" });
			$($(this).children()[1]).fadeIn();
			var name = $(this).children()[0].textContent;
			zoom(map, 8, keys[name].getPosition());
		} else {
			$('.slide').removeClass("clicked");
			img = '';
		}
		event.preventDefault();
	});
	$("#clear-icon").click(function () {
		document.getElementById('form').reset();
	});
	$("#submit").click(function () {
		alert("Thank you! We will contact you soon with details about your order.")
	});
}

function zoom(map, n, position){
	var z = map.getZoom();
	if (z < n) {
		z += 1; map.setZoom(z); setTimeout(function(){ zoom(map, n, position) }, 50);
	} else if (z > n) {
		z -= 1; map.setZoom(z); setTimeout(function(){ zoom(map, n, position) }, 50);
	} else {
		map.setCenter(position);
	}
}