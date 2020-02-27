
var i = 0;
var images = [];
var time = 3500;
images[0] = "images/ski1.jpeg";
images[1] = "images/sail.jpeg";
images[2] = "images/ski2.png";

function updateCarousel(){
	document.carousel.src = images[i];
	i++;
	if(i>2){
		i=0;
	}
	setTimeout("updateCarousel()", time);
}

window.onload = updateCarousel();

