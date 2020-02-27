
	var i = 0;
	var images = [];
	var time = 2000;
	images[0] = "images/ski1.jpeg";
	images[1] = "inages/sail.jpeg";
	images[2] = "images/ski2.png";
	document.carousel.src = images[0];

function updateCarousel(){
	document.carousel.src = images[i];
	i++;
	if(i>2){
		i=0;
	}
	setTimeout("updateCarousel", time);
}

window.onload = updateCarousel();

