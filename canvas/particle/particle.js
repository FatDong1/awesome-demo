/**
 * Created by haodong-xu on 2017/3/14.
 */

var canvas = document.getElementById( 'particle' ),
    ctx = canvas.getContext( '2d' );

var cw = window.innerWidth,
    ch = window.innerHeight;
    canvas.width = cw;
    canvas.height = ch;

var particleArr = []; //���÷Ź�������
var active = false; //���Ϊtrue


var maxParticle = 216,
    size = 48,                     //�����Ĵ�С
    sizeRandom = 64,              //�������������
    sharpness = 0,                 //������ڲ�����Բ�İٷֱ�
    sharpnessRandom = 11,
    speed = 11,
    speedRandom = 1.5,
    angle = 186,
    angleRandom = 54,
    xRandom = 113,                 //�����λ�õ��������
    yRandom = 91,
    timesUpdate = 23,               //��������ӵ�ָ����ɫ�Ĵ���
    timesUpdate_random = 7,
    gravityY = -0.5,
    startColor = [],
    endColor = [],
    colorRandom = [47,47,42,0],
    emitNums = 10;                 //����һ�β��������ĸ���



var mouseX, mouseY;

//����0-255�������
function random_255(){
    return Math.random()*250;
}

//����-1��1���������
function random_1(){
    return Math.random()*2-1;
}

//ÿ����������Ϣ
function Particle (mx,my){
    this.size = size + sizeRandom * random_1();
    this.size = this.size < 0 ? 0 : this.size;
    this.sharpness = sharpness + sharpnessRandom * random_1();
    this.sharpness = this.sharpness < 0 ? 0 : this.sharpness;
    this.size_small =  (this.size/ 2) * (this.sharpness / 100 )
    this.speed = speed + speedRandom * random_1();
    this.angle = (angle + angleRandom * random_1()) * (Math.PI / 180);
    this.positionX = mx + xRandom * random_1();
    this.positionY = my + yRandom * random_1();
    this.directionX = speed * Math.cos(angle)
    this.directionY = speed * Math.sin(angle)
    this.timesUpdate = timesUpdate + timesUpdate_random * random_1();
    var start = [
        startColor[0] + colorRandom[0] * random_1(),
        startColor[1] + colorRandom[1] * random_1(),
        startColor[2] + colorRandom[2] * random_1(),
        startColor[3] + colorRandom[3] * random_1()
    ];
    var end = [
        endColor[0] + colorRandom[0] * random_1(),
        endColor[1] + colorRandom[1] * random_1(),
        endColor[2] + colorRandom[2] * random_1(),
        endColor[3] + colorRandom[3] * random_1()
    ];
    this.color = start;
    this.deltaColor = [
        (end[0] - start[0]) / this.timesUpdate,
        (end[1] - start[1]) / this.timesUpdate,
        (end[2] - start[2]) / this.timesUpdate,
        (end[3] - start[3]) / this.timesUpdate
    ];
    this.drawColor = "";
}

// ������ɫ����startColor���ӵ�endColor
function update (){
    var rate = 1 / emitNums;
    var n = 1;
    while(active && particleArr.length < maxParticle && n > rate){
        particleArr.push(new Particle(mouseX, mouseY));
        n -= rate;
    }
    var particleIndex = 0;
    while(particleIndex < particleArr.length-1){
        var current = particleArr[particleIndex];
        if(current.timesUpdate > 0) {
            current.directionY += gravityY;
            current.positionX += current.directionX;
            current.positionY += current.directionY;
            current.timesUpdate--;
            current.color[0] += current.deltaColor[0];
            current.color[1] += current.deltaColor[1];
            current.color[2] += current.deltaColor[2];
            current.color[3] += current.deltaColor[3];
            var newcolor = [];
            newcolor = current.color.map(function(value, index){
                if(value > 256){
                    return value = 255;
                }else if(value < 0){
                    return value = 0;
                }else if(index == 3){
                    return value.toFixed(2);
                }else {
                    return value.toFixed(0);
                }
            });
            current.drawColor = 'rgba(' + newcolor.join(",") + ')';
            particleIndex++;
        }else {
            particleArr.splice(particleIndex,1)
        }
    }
}

//��particleArr���黭����
function draw (){
    for(var i=0; i < particleArr.length-1; i++){
        var particle = particleArr[i];
        var size = particle.size;
        var halfSize = size / 2;
        var x = particle.positionX;
        var y = particle.positionY;
        var radgard = ctx.createRadialGradient(x+halfSize, y+halfSize,particle.size_small,x+halfSize,y+halfSize,halfSize);
        radgard.addColorStop(0, particle.drawColor);
        radgard.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = radgard;
        ctx.fillRect(x, y, size,size);
        ctx.globalCompositeOperation = 'lighter';

    }
}

//��ʼ����ѭ��
function loop (){
    update();
    ctx.clearRect(0,0,cw,ch);
    draw();
    setTimeout(loop, 80);
}

window.onload = function(){
    canvas.addEventListener('mousemove',function(e){
        mouseX = e.pageX - canvas.offsetLeft;
        mouseY = e.pageY - canvas.offsetTop;
    });
    canvas.addEventListener('click', function(e){
        active = !active
        startColor = [];
        endColor = [];
        for(var i=0; i < 4; i++) {
            startColor.push(random_255());
            endColor.push(random_255());
        }
        console.log(startColor);
        console.log(endColor);
    });
    loop();
}

