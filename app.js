
//configurações
cm = {
	fadeIn 			: 1000, //milissegundos
	carrossel_delay	: 6000,	//milissegundos
	carrossel_anim	: 1000, //milissegundos
	carrossel_ease	: "easeOutSine" // forma do tempo de transição
}

// função principal que contrói o layout
MM = function() {
	$self = this;
	this.carrossel = [];

	this.curr_playing = null;

	this.first = true;

	//configura as imagens
	this.animation = function() {
		//
		//$self.carrossel[0].show().css({"width": "100%"});
		$self.carrossel[0].css({"z-index" : 1100, "left":"0%"});
		$self.carrossel[0].children('div:first-child').css({"left":"0%"});
		$self.carrossel[1].css({"z-index" : 1000, "left":"0%"});
		$self.carrossel[1].children('div:first-child').css({"left":"0%"});
		$self.carrossel[ $self.carrossel.length - 1 ].css({"z-index" : "0"});



		// temporizador
		$self.curr_playing = setTimeout(
			$self.animation,
			cm.carrossel_anim + cm.carrossel_delay);

		//dá o slide
		var anim_ratio = Math.min(1, $(window).width() / $(window).height() );
		$self.carrossel[0].animate({
			"left" : "-100%"
			},{
			"duration"	: cm.carrossel_anim * anim_ratio,
			"easing" 	: cm.carrossel_ease
			}
		);
		$self.carrossel[0].children('div:first-child').animate({
			"left" : "100%"
			},{
			"duration"	: cm.carrossel_anim * anim_ratio,
			"easing" 	: cm.carrossel_ease
			}
		);

		// muda a ordem dos elementos
		var tmp = $self.carrossel.shift();
		$self.carrossel.push(tmp);
		
	}

	this.stop = function() {
		clearTimeout($self.curr_playing);
	}
	
	this.images = $('div.content-wrapper .images > div > div > img')
		//
		.css({"opacity":"0.0"})
		// configura imagem no carregamento
		.on("load", function() {
			var $this = $(this);
			// aspect ratio em forma de string
			var ratio = $this.width() +  "/" + $this.height();
			// adiciona um media query à imagem
			var css = newStyleSheet("screen and (max-aspect-ratio:"+ ratio +")");
			if(css)
				css.insertRule("#"+ $this.attr('id') +" {width:auto!important; height: 100%!important}", 0);

			//fadeIn da imagem
			$this.animate({
				"opacity"	: "1.0"
			}, {
				"duration"	: cm.fadeIn,
				"easing" 	: "easeInSine"
			});
		})
		// carrossel
		.each( function() {
			var el = $(this).parent().parent();
			$self.carrossel.push(el);
		});
		//
		console.log(this.images);
	//force reflow
	window.offsetHeight;

	//prepara o carrossel
	this.carrossel[0].css({"z-index" : 1100, "left":"0%"});
	this.carrossel[1].css({"z-index" : 1000, "left":"0%"});
	this.carrossel[ this.carrossel.length - 1 ].css({"z-index" : "0"});
	this.curr_playing = setTimeout( this.animation, cm.carrossel_anim + cm.carrossel_delay);

	//hover no menu de baixo
	// função é executada por temporizador, o que melhora a performance
	var didScroll = false;
	var scroll_container = $(".info-container").on("scroll", function(e) {
		didScroll = true;
	});
	setInterval(function() {
	    if (didScroll) {
	        hasScrolled();
	        didScroll = false;
	    }
	}, 250);
	//
	var hasScrolled = (function () {
		var top = $(this).scrollTop()
		//
		if(top >= 1)
			$(this).find(".info").addClass("hover");
		else
			$(this).find(".info").removeClass("hover");
	}).bind(scroll_container);
};
MM.constructor = MM;
MM.prototype = Object.create( Object.prototype );


// função para criar um styleSheet com as media queries
var newStyleSheet = function(media) {
	// Create the <style> tag
	var style = document.createElement("style");

	// WebKit hack :(
	style.appendChild(document.createTextNode(""));

	//style.setAttribute("media", "screen")
	style.setAttribute("media", media)

	// Add the <style> element to the page
	document.head.appendChild(style);

	return style.sheet;
};

$( document ).ready(function () {
	console.log( 'foi!' );

	mm = new MM();
	
})