import { pause } from "./help.js";
import towerOfHanoi from "./towerOfHanoi.js";

const div = document.createElement("div");
document.body.appendChild(div);
const toh = new towerOfHanoi(div, {diskAnimateTime: 1, pegCount: 3, diskCount: 4});
toh.play();
await pause(0.5);
toh.step();
await pause(1);
await async function(){
    toh.abort();
}()
toh.toggleStepMode();
toh.step();