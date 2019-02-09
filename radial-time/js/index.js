var c = document.body.appendChild(document.createElement("canvas")),
	w = innerWidth,
	h = innerHeight;

c.width = w;
c.height = h;

var ctx = c.getContext("2d"),
	//degrees to radians conversion function
	deg2rad = d => (Math.PI / 180) * d;

//constructor for the circles
function radialBar(x, y, r, max, value) {
	this.X = x || 0;
	this.Y = y || 0;
	this.R = r || 0;
	this.MAX = max || 1;
	this.value = value || 0;
	this.target = value || 0;

	this.update = function(v) {
		//lerp
		this.target = v > 0 ? v : 0.1;
		this.value += (this.target - this.value) * 0.05;

		ctx.arc(
			this.X,
			this.Y,
			this.R,
			//move starting point to top
			deg2rad(-90),
			deg2rad(-90) + (deg2rad(360) * (this.value / this.MAX))
		);
	}
}

ctx.lineWidth = 3;
ctx.lineCap = "round";

var spacing = 12,
	radius = 150,
	//contains values for hours, minutes, seconds
	times,
	//create circles
	circles = {
		H: new radialBar(w / 2, h / 2, radius, 12, 0),
		M: new radialBar(w / 2, h / 2, radius - spacing, 60, 0),
		S: new radialBar(w / 2, h / 2, radius - spacing - spacing, 60, 0)
	},
	//text elements
	elements = {
		H: document.getElementById("H"),
		M: document.getElementById("M"),
		S: document.getElementById("S")
	};

//set text colors
Object.keys(elements).forEach((k, i) =>
	elements[k].style.color =
	"hsl(" + k.charCodeAt(0) * i + ", 50%, 50%)");

//update time values and text once per second
function updateTime() {
	var time = new Date();
	var hours = time.getHours();
	
	if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
  	hours = 12;
  }
	
	times = {
		H: hours,
		M: time.getMinutes(),
		S: time.getSeconds()
	};

	//update text
	Object.keys(times).forEach(k =>
		elements[k].innerHTML =
		//pad with 0s if needed
		String(times[k]).length > 1 ?
		times[k] :
		times[k] = "0" + times[k]
	);

	setTimeout(updateTime, 1000);
}

function draw() {
	ctx.clearRect(0, 0, w, h);

	//update circles, set their color, draw
	Object.keys(circles).forEach((k, i) => {
		ctx.beginPath();
        ctx.setLineDash([.1, 20]);
		circles[k].update(times[k]);
		ctx.strokeStyle = "hsl(" + k.charCodeAt(0) * i + ", 90%, 50%)";
		ctx.stroke();
		ctx.lineWidth=10;
	});

	requestAnimationFrame(draw);
}

//start
updateTime();
draw();