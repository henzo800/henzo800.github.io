var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var pX = 50;
var pY = canvas.height/2;
var upPress = false;
var pipe = [];
pipe[0] = {
    x : canvas.width,
    y : canvas.height/2
};
var score = 0;
var oldscore = 0;
var play = false;
var gameover = false;
var i = 0;
//inputs
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('touchstart', touchStart, false); 
function keyDownHandler(event) {
    if(event.keyCode == 38) {
        upPress = true;
    }
}
function touchStart() {
	upPress = true;
}
//draw objects
function drawPlayer() {
	ctx.beginPath();
	ctx.fillStyle = "#FF0000";
	ctx.rect(pX, pY, 30, 30);
	ctx.fill();
	ctx.closePath();
}
function drawScore() {
	ctx.fillStyle = "#000000";
	ctx.font = "30px Arial"
	ctx.fillText("Score: " + score, canvas.width/2 - 50, 50);
}
function gameOver() {
	play = false;
	gameover = true;
	oldscore = score;
	score = 0;
	pX = 50;
	pY = canvas.height/2;
	for(var x = 0; x < pipe.length; x++) {
		delete pipe[x].x; 
		delete pipe[x].y;
	}
	i = 0;
	pipe[0] = {
		x : canvas.width,
		y : canvas.height/2
	};
	console.log("stop");
}
function drawPipe() {
	for(i = 0; i < pipe.length; i++){
		ctx.beginPath();
		ctx.rect(pipe[i].x, 0, 60, pipe[i].y);
		ctx.rect(pipe[i].x, pipe[i].y + 120, 60, canvas.height);
		ctx.fillStyle = "#00FF00";
		ctx.fill();
		ctx.closePath();
		pipe[i].x = pipe[i].x - 2;
		
		if((pX + 30 >= pipe[i].x && pX <= pipe[i].x+60 && pY <= pipe[i].y) || (pX + 30 >= pipe[i].x && pX <= pipe[i].x+60 && pY + 30 >= pipe[i].y + 120)) {
			gameOver();
		}
		else if(pipe[i].x == 50) {
			score++;
		}
		if(pipe[i].x == 60) {
			pipe.push({
				x : canvas.width,
				y : Math.random() * (((canvas.height/2) + (canvas.height/4))-(canvas.height/4)) + (canvas.height/4)
			});
		}
		
		//console.log(i + "," + pipe[i].x + "," + pipe[i].y);
	}
}
function drawFloor() {
	ctx.beginPath();
	ctx.fillStyle = "#7fe5f0";
	ctx.rect(0, canvas.height-4, canvas.width, 4);
	ctx.fill();
	ctx.closePath();
	if(pY > canvas.height-34) {
		gameOver();
	}
}
//primary draw loop
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if(upPress == true) {
		play = true;
	}
	if(play == true) {
		if(upPress == true) {
			pY = pY - 65;
		}
		pY = pY + 1.7;
		drawPlayer();
		drawPipe();
		drawFloor();
		drawScore();
		upPress = false;
	}
	else {
		ctx.fillStyle = "#000000";
		ctx.font = "40px Arial"
		ctx.fillText("Flappy Bird", canvas.width/2-115, canvas.height/2-40);
		ctx.font = "26px Arial"
		ctx.fillText("Press Up to start", canvas.width/2-110, canvas.height/2);
		if(gameover == true) {
			ctx.fillText("Score: " + oldscore, canvas.width/2-60, canvas.height/2+40);
		}
	}
}
setInterval(draw, 10);