class Sprite {
    constructor(url, pos, size, spriteFrame){
        this.url = url;
        this.pos = pos;
        this.size = size;
        this.spriteFrame = spriteFrame;

        this.img = new Image();
        this.img.src = this.url;
        this.spriteState = 0;
        this.spriteFrameY = 0;
        this.spriteUpdate = true;
    }

    updateSprite(dt){
        if (!this.spriteUpdate) return;

        this.spriteState += dt/30;

        let max = this.spriteFrame.length;
        let index = Math.round(this.spriteState);

        this.spriteFrameY = this.spriteFrame[index % max] * 50;
    }

    render(){
        ctx.drawImage( this.img, 0, this.spriteFrameY, this.size[0], this.size[1], this.pos[0], this.pos[1],  this.size[0], this.size[1] );
    };
};

class Player extends Sprite{

    constructor(url, pos, size, spriteFrame, jumpHeight){
        super(url, pos, size, spriteFrame);
        this.jumpHeight =  jumpHeight;
        this.motionY = false;
        this.sumDt = 0.01;
    }

   verticalMove(dt){
        if( !this.motionY ) return;

        let sin = 60*Math.sin(this.sumDt);
        this.sumDt = this.sumDt + 2.5*dt;


        if( sin <= 0 ){
            this.motionY = false;
            this.sumDt = 0.01;
        }

        player.pos[1] = cnv.height - player.size[1] - this.jumpHeight*Math.sin(this.sumDt);
    }
};

class Barrier extends Sprite{
    constructor(url, pos, size, spriteFrame, marginR){
        super(url, pos, size, spriteFrame);
        this.marginR = marginR;

        this.break = false;
    }
};



function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
};

function createCanv(className, height, width, position){
    let htmlEl = document.createElement("canvas");
    htmlEl.setAttribute('class', className);

    htmlEl.height = height;
    htmlEl.width = width;

    position.append(htmlEl);

    return htmlEl;
};

function createDiv(className){
    let htmlEl = document.createElement("div");
    htmlEl.setAttribute('class', className);

    return htmlEl;
}

let score = 0;
let lastScore = 0;
let maxScore = 0;
let maxScoreDiv = createDiv("containerRunner__score-max");
let scoreDiv = createDiv("containerRunner__score-current");

document.getElementsByClassName('containerRunner__score')[0].append(maxScoreDiv);
document.getElementsByClassName('containerRunner__score')[0].append(scoreDiv);

function addScore(){
    maxScoreDiv.innerHTML = `Max score -${maxScore}`;
    scoreDiv.innerHTML = `Score - ${score}`;
}

let containerRunner = document.getElementsByClassName('containerRunner')[0];

let cnv = createCanv('mainScene', 400, 800, containerRunner);
let ctx = cnv.getContext("2d");

let lastTime;
let postionBg = 0;

addScore();

let player = new Player( "assets/img/santa.png",  [cnv.width/2 - 14, cnv.height - 30], [28, 30], [0, 1], 60);

let barrierArr = [];
barrierArr.push( new Barrier("assets/img/tree.png", [cnv.width, cnv.height - 30], [26, 28], [0,1], 130));


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

    //player
    //move up?
    player.verticalMove(dt/64);

    player.updateSprite(dt);

    //generate barrier
    if( (barrierArr[barrierArr.length - 1].marginR || 0) < cnv.width - barrierArr[barrierArr.length - 1].pos[0] ){
        barrierArr.push( new Barrier("assets/img/tree.png", [cnv.width, cnv.height - 30], [26, 28],[0, 1], randomInteger(80, 300)));
    }

    //update barrier
    for(let i = 0; i < barrierArr.length; i++){
        barrierArr[i].pos[0] = barrierArr[i].pos[0] - dt;
        barrierArr[i].updateSprite(dt);

        //gameOver?
        gameOver( barrierArr[i], player.pos[0], player.pos[1],  player.size[0], player.size[1], barrierArr[i].pos[0], barrierArr[i].pos[1], barrierArr[i].size[0], i);
    }

    //calc score
    score = 0;
    for (let i = 0; i < barrierArr.length; i++){
        if(barrierArr[i].pos[0] + barrierArr[i].size[0] < player.pos[0]) score++;
    }
    score = score - lastScore;
    if(score < 0) score = 0;
    if(score >= maxScore) maxScore = score;
};

function render(){
    ctx.clearRect(0,0, cnv.width, cnv.height);

    //render bg
    containerRunner.style.backgroundPositionX = "-" + postionBg + "px";

    player.render();


    // render barrier
    barrierArr.forEach((item) => { item.render() });

    //view score
    addScore();
};

function gameOver(item ,playerX, playerY, playerWidth, playerHeight, treeX, treeY, treeWidth, count){
    if (playerX > treeX + treeWidth-15) return;

    let gameOver = playerX + playerWidth >= treeX + 5 && playerY + playerHeight >= treeY;

    if(gameOver){ 
        item.spriteUpdate = false;

        item.spriteFrameY = 100;
        item.size[0] = 45;

        item.break = true;

        lastScore = count + 1;
    };
}

setTimeout(draw, 500);

//Отслеживание нажатия
document.addEventListener("keydown", function (e) {
    if(e.code == "Space"){
        e.preventDefault();
        player.motionY = true
    }
});
