loop = null
frame = null
rule = null

var line0;
var line1;
var line2;
var ctx0;
var ctx1;
var ctx2;
var x = 0;
var plot_step = 10;
var plot_values = [0,0,0]

window.onload = function(){
    line0 = document.getElementById("line0");
    line1 = document.getElementById("line1");
    line2 = document.getElementById("line2");
    ctx0 = line0.getContext('2d');
    ctx1 = line1.getContext('2d');
    ctx2 = line2.getContext('2d');
    ctx1.clearRect(0, 0, line0.width, line0.height);
    ctx2.clearRect(0, 0, line0.width, line0.height);
    ctx0.strokeStyle = '#ff0000';
    ctx1.strokeStyle = '#00ff00';
    ctx2.strokeStyle = '#0000ff';
}

rule_dict = {   "222": 0, "221": 1, "220": 2, "212": 3, "211": 4, "210": 5, "202": 6, "201": 7, "200": 8, "122": 9, "121": 10, "120": 11, "112": 12, "111": 13, "110": 14, "102": 15, "101": 16,
                "100": 17, "022": 18, "021": 19, "020": 20, "012": 21, "011": 22, "010": 23, "002": 24, "001": 25, "000": 26}

function mod(v, border){
    while(v<0)
        v += border
    return v%border
}

function load(){
    x = 0
    ctx0.fill
    ctx0.fillStyle = 'white';
    ctx0.fillRect(0, 0, line0.width, line0.height);
    ctx1.clearRect(0, 0, line0.width, line0.height);
    ctx2.clearRect(0, 0, line0.width, line0.height);
    ctx0.beginPath()
    ctx1.beginPath()
    ctx2.beginPath()
    frame = document.getElementById("frame").value.split("")
    rule = document.getElementById("rule").value.split("")
    console.log("Loaded frame: " + frame + ", rule: " + rule)
    if(rule.length != Object.keys(rule_dict).length)
        console.log("Wrong rule length. Diff: " + (Object.keys(rule_dict).length - rule.length))
    
    plot_values[0] = line0.height - (frame.filter(x => x=="0").length/frame.length) * line0.height;
    plot_values[1] = line0.height - (frame.filter(x => x=="1").length/frame.length) * line0.height;
    plot_values[2] = line0.height - (frame.filter(x => x=="2").length/frame.length) * line0.height;
    
    ctx0.moveTo(0, plot_values[0])
    ctx1.moveTo(0, plot_values[1])
    ctx2.moveTo(0, plot_values[2])
}

function transformation(){
    document.getElementById("output").innerHTML += "" + frame.join("") + "<br>"
    var data = []
    for(let i = 0; i < frame.length; i++)
    {
        data.push(
            rule[rule_dict[frame[mod(i-1, frame.length)] + frame[i] + frame[mod(i+1, frame.length)]]]
        )
    }
    frame = data;

    if(x+plot_step>line0.width)
    {
        imageData = ctx0.getImageData(plot_step, 0, ctx0.canvas.width-plot_step, ctx0.canvas.height);
        ctx0.fillRect(0, 0, line0.width, line0.height);
        ctx0.putImageData(imageData, 0, 0);
        ctx0.beginPath()
        ctx0.moveTo(ctx0.canvas.width-plot_step, plot_values[0])
        imageData = ctx1.getImageData(plot_step, 0, ctx1.canvas.width-plot_step, ctx1.canvas.height);
        ctx1.clearRect(0, 0, ctx1.canvas.width, ctx1.canvas.height);
        ctx1.putImageData(imageData, 0, 0);
        ctx1.beginPath()
        ctx1.moveTo(ctx1.canvas.width-plot_step, plot_values[1])
        imageData = ctx2.getImageData(plot_step, 0, ctx2.canvas.width-plot_step, ctx2.canvas.height);
        ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
        ctx2.putImageData(imageData, 0, 0);
        ctx2.beginPath()
        ctx2.moveTo(ctx2.canvas.width-plot_step, plot_values[2])
    }
    else
        x += plot_step;

    plot_values[0] = line0.height - (frame.filter(x => x=="0").length/frame.length) * line0.height;
    plot_values[1] = line0.height - (frame.filter(x => x=="1").length/frame.length) * line0.height;
    plot_values[2] = line0.height - (frame.filter(x => x=="2").length/frame.length) * line0.height;

    ctx0.lineTo(x, plot_values[0])
    ctx1.lineTo(x, plot_values[1])
    ctx2.lineTo(x, plot_values[2])

    ctx0.stroke();
    ctx1.stroke();
    ctx2.stroke();
}

function play(){
    console.log("play")
    if(loop==null)
    {
        if(frame==null || rule==null)
            load()
        loop = setInterval(transformation, 1000)
    }
}

function stop(){
    console.log("stop")
    clearInterval(loop);
    loop = null
}

function revert(){
    load()
    document.getElementById("output").innerHTML = ""
}