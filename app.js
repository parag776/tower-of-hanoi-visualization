import towerOfHanoi from "./towerOfHanoi.js";

const tohContainer = document.getElementById("container");
const playPause = document.getElementById("playPause");
const step = document.getElementById("step");
const reset = document.getElementById("reset");
const tohForm = document.querySelector("form");
const diskCountInput = document.getElementById("diskCount");
const pegCountInput = document.getElementById("pegCount");
const speedInput = document.getElementById("speed");

// creating a tower of hanoi.
// default
const maxSpeed = 10;
const maxTimeBWAnimation = 4; // in seconds
let tohState = "reset";
let diskCount=5, pegCount=3, speed=3, diskAnimateTime=maxTimeBWAnimation/Math.pow(2, speed-1);
let toh = new towerOfHanoi(tohContainer, {diskAnimateTime, pegCount, diskCount});
tohForm.onsubmit = (e)=>{
    toh.abort();
    diskCount = parseInt(diskCountInput.value);
    pegCount = parseInt(pegCountInput.value);
    speed = parseInt(speedInput.value);
    diskCountInput.value = "";
    pegCountInput.value = "";
    speedInput.value = "";
    diskAnimateTime = maxTimeBWAnimation/Math.pow(2, speed-1);
    tohContainer.removeChild(tohContainer.firstChild);
    toh = new towerOfHanoi(tohContainer, {diskAnimateTime, pegCount, diskCount});
    tohState = "reset";
    playPause.innerHTML = "play";
    e.preventDefault();
}

playPause.onclick = (e)=>{
    try{
        if(tohState === "pause") {
            if(toh.isStepMode()) {
                toh.toggleStepMode();
            } else {
                toh.resume();
            }
            step.setAttribute("disabled", "");
            playPause.innerHTML = "pause";
            tohState = "play";
        } else if(tohState === "reset") {
            toh.play();
            tohState = "play";
            step.setAttribute("disabled", "");
            playPause.innerHTML = "pause";
        } else if(tohState === "play") {
            toh.pause();
            step.removeAttribute("disabled");
            tohState = "pause";
            playPause.innerHTML = "play";
        }
    } catch(error){ 
        console.log(error);
    }
}

step.onclick = (e)=>{
    try{
        toh.setStepMode();
        if(tohState === "pause") {
            toh.resume();
            toh.step();
        } else if(tohState === "reset") {
            toh.play();
            toh.step();
            tohState = "pause";
        }
    } catch(error){
        console.log(error);
    }
}

reset.onclick = (e)=>{
    try{
        toh.abort();
        tohContainer.removeChild(tohContainer.firstChild);
        toh = new towerOfHanoi(tohContainer, {diskAnimateTime, pegCount, diskCount});
        tohState = "reset";
        playPause.innerHTML = "play";
        step.removeAttribute("disabled");
    } catch(error){
        console.log(error);
    }
}
