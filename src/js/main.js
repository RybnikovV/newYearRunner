class Sprite {
    constructor(url, pos, size){
        this.url = url;
        this.pos = pos;
        this.size = size;

        this.img = new Image();
        this.img.src = this.url;
    }

    render(){
        ctx.clearRect(0,0, cnv.width, cnv.height);
        ctx.drawImage(player.img, 0, 0, this.size[0], this.size[1], this.pos[0], this.pos[1],  this.size[0], this.size[1]); 
    };
};

class Player extends Sprite{
    moveUp(){
        player.pos[1] = player.pos[1] - 20;
    };
};


function createCanv(className, height, width, position){
    let htmlEl = document.createElement("canvas");
    htmlEl.setAttribute('class', className);

    htmlEl.height = height;
    htmlEl.width = width;

    position.append(htmlEl);

    return htmlEl;
};


let containerRunner = document.getElementsByClassName('containerRunner')[0];

let cnv = createCanv('mainScene', 400, 800, containerRunner);
let ctx = cnv.getContext("2d");

let lastTime;
let postionBg = 0;


let player = new Player( "assets/img/santa.png",  [cnv.width/2 - 8, cnv.height - 15], [16, 15]);


function draw(){
    let now = Date.now();
    let dt = (now - (lastTime || now))/10;

    update(dt);
    render();

    lastTime = now;
    window.requestAnimationFrame(draw);
};

function update(dt){
    //bg
    postionBg = dt + postionBg;

};

function render(){
    //reder bg
    containerRunner.style.backgroundPositionX = "-" + postionBg + "px"
    
    player.render();
};

setTimeout(draw, 2000);


//Отслеживание нажатия
// document.addEventListener("keydown",() => console.log(player)); 
document.addEventListener("keydown", player.moveUp);