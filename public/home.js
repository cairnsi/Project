
var i = 0;
var images = [];
var time = 5000;
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

function moveForward(event){
	i++;
	if(i>2){
		i=0;
	}
	document.carousel.src = images[i];
}


document.getElementById("forward").addEventListener("click",moveForward);
window.onload = updateCarousel();

