
var i = 0;
var images = [];
var time = 5000;
images[0] = "images/ski1.jpeg";
images[1] = "images/sail.jpeg";
images[2] = "images/ski2.png";

function updateCarousel(){
	i++;
	if(i>2){
		i=0;
	}
	document.carousel.src = images[i];
	setTimeout("updateCarousel()", time);
}

function moveForward(event){
	i++;
	if(i>2){
		i=0;
	}
	document.carousel.src = images[i];
}

function moveBack(event){
	i--;
	if(i<0){
		i=2;
	}
	document.carousel.src = images[i];
}


document.getElementById("back").addEventListener("click",moveBack);

document.getElementById("forward").addEventListener("click",moveForward);
window.onload = updateCarousel();

