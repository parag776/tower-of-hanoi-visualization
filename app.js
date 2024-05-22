import { pause } from "./help.js";
import towerOfHanoi from "./towerOfHanoi.js";

const div = document.createElement("div");
document.body.appendChild(div);
const toh = new towerOfHanoi(div, {diskAnimateTime: 0.2, pegCount: 3, diskCount: 4});
toh.toggleStepMode();
toh.play();
await pause(2);
toh.step();
await pause(1);
toh.step();
await pause(5);
toh.step();
await pause(4);
toh.toggleStepMode();
toh.step();