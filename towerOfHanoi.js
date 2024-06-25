export default class towerOfHanoi{

    #svgNS = "http://www.w3.org/2000/svg";
    #div;
    #inf = 5000000000000000;

    // input fron user
    #height = 400;
    #width = 800;
    #pegCount = 3;
    #diskCount = 5;
    #verticalMarginPercent = 0.05;
    #HorizontalMarginPercent = 0.05;
    #baseColor = "brown";
    #pegColor = "brown"
    #diskColor = "orange";
    #diskAnimateTime = 1;
    #stepMode = false;

    // abort controller
    #abortController = new AbortController();
    #abortSignal = this.#abortController.signal;

    // helping variables
    #mainSVG;

    #marginVertical
    #marginHorizontal

    #bodyWidth
    #bodyHeight

    #bodyLeftBottomY
    #bodyLeftBottomX
    #bodyRightTopY
    #bodyRightTopX

    #baseHeight
    #baseSVG

    #pegAreaWidth
    #pegWidth
    #pegSVGArray;

    #minDiskWidth;
    #maxDiskWidth;
    #diskHeight
    #diskSVGArray;

    #areaAboveBodyHeight
    #diskInAirY

    #diskPegDP;

    // step methods
    #waitingState = false;
    #stepFunctionInstance;
    #stepResolve;

    // calculations

    #createSVGs(){
        this.#mainSVG = document.createElementNS(this.#svgNS, "svg");
        this.#mainSVG.setAttribute("height", this.#height);
        this.#mainSVG.setAttribute("width", this.#width);

        this.#baseSVG = document.createElementNS(this.#svgNS, "rect");
        this.#baseSVG.setAttribute("x", this.#bodyLeftBottomX);
        this.#baseSVG.setAttribute("y", this.#bodyLeftBottomY-this.#baseHeight);
        this.#baseSVG.setAttribute("width", this.#bodyWidth);
        this.#baseSVG.setAttribute("height", this.#baseHeight);
        this.#baseSVG.setAttribute("fill", this.#baseColor);
        this.#baseSVG.setAttribute("rx", "4%")
        this.#baseSVG.setAttribute("ry", "4%")
        this.#mainSVG.appendChild(this.#baseSVG);

        this.#pegSVGArray = [];
        for(let i=0;i<this.#pegCount;i++){
            const curX = this.#bodyLeftBottomX+i*this.#pegAreaWidth + (this.#pegAreaWidth-this.#pegWidth)/2;

            const curPeg = document.createElementNS(this.#svgNS, "rect");
            curPeg.setAttribute("x", curX);
            curPeg.setAttribute("y", this.#bodyRightTopY);
            curPeg.setAttribute("width", this.#pegWidth);
            curPeg.setAttribute("height", this.#bodyHeight);
            curPeg.setAttribute("fill", this.#pegColor);
            curPeg.setAttribute("rx", "4%")
            curPeg.setAttribute("ry", "4%")
            this.#mainSVG.appendChild(curPeg);
        }

        this.#diskSVGArray = [];
        for(let i=0;i<this.#pegCount;i++) this.#diskSVGArray.push([]);
        for(let i=0;i<this.#diskCount;i++){
            const diskWidth = this.#maxDiskWidth - i*(this.#maxDiskWidth-this.#minDiskWidth)/this.#diskCount;
            const curX = this.#bodyLeftBottomX+(this.#pegAreaWidth-diskWidth)/2;
            const curY = this.#bodyLeftBottomY-this.#baseHeight-(1+i)*this.#diskHeight;
            const curDisk = document.createElementNS(this.#svgNS, "rect");
            curDisk.setAttribute("x", curX);
            curDisk.setAttribute("y", curY);
            curDisk.setAttribute("width", diskWidth);
            curDisk.setAttribute("height", this.#diskHeight);
            curDisk.setAttribute("fill", this.#diskColor);
            curDisk.setAttribute("rx", "4%")
            curDisk.setAttribute("ry", "4%")
            curDisk.setAttribute("stroke", "black");
            curDisk.setAttribute("stroke-width", "1");
            this.#mainSVG.appendChild(curDisk);
            this.#diskSVGArray[0].push(curDisk);
        }

        this.#div.appendChild(this.#mainSVG);
    }

    #doCalculations(){
        this.#marginVertical = this.#verticalMarginPercent*this.#height;
        this.#marginHorizontal = this.#HorizontalMarginPercent*this.#width;
        this.#bodyWidth = (1-2*this.#HorizontalMarginPercent)*this.#width;
        this.#bodyHeight = (1-2*this.#verticalMarginPercent)*this.#height*0.6;
        this.#bodyLeftBottomY = this.#height-this.#marginVertical;
        this.#bodyLeftBottomX = this.#marginHorizontal;
        this.#bodyRightTopY = this.#bodyLeftBottomY - this.#bodyHeight;
        this.#bodyRightTopX = this.#width - this.#marginHorizontal;
        this.#baseHeight = 0.1*this.#bodyHeight;
        this.#pegAreaWidth = this.#bodyWidth/this.#pegCount;
        this.#pegWidth = Math.min(0.2*this.#pegAreaWidth, this.#baseHeight);
        this.#minDiskWidth = Math.max(0.3, (0.9-0.1*this.#diskCount))*this.#pegAreaWidth;
        this.#maxDiskWidth = 0.8*this.#pegAreaWidth;
        this.#diskHeight = Math.min(0.7*(this.#bodyHeight-this.#baseHeight)/this.#diskCount, this.#baseHeight);
        this.#areaAboveBodyHeight = this.#bodyRightTopY-this.#marginVertical;
        this.#diskInAirY = this.#bodyRightTopY-this.#areaAboveBodyHeight/2;
        this.#createSVGs();
    }
    
    async #moveDisk(i, j){
        const curDisk = this.#diskSVGArray[i][this.#diskSVGArray[i].length-1];

        let curX = parseInt(curDisk.getAttribute("x"));
        let curY = parseInt(curDisk.getAttribute("y"));

        let x1 = curX
        let y1 = this.#bodyRightTopY - this.#diskHeight;

        let x2 = curX + (j-i)*this.#pegAreaWidth;
        let y2 = y1;

        let x3 = x2;
        let y3 = this.#bodyLeftBottomY-this.#baseHeight-(1+this.#diskSVGArray[j].length)*this.#diskHeight;
        const animationPath = `M 0 0 L ${x1-curX} ${y1-curY} A ${Math.abs(x2-x1)/2} ${this.#bodyRightTopY-this.#diskInAirY} 0 0 ${i<j?1:0} ${x2-curX} ${y2-curY} L ${x3-curX} ${y3-curY}`;

        const animate = document.createElementNS(this.#svgNS, "animateMotion");
        animate.setAttribute("dur", `${this.#diskAnimateTime}s`);
        animate.setAttribute("begin", "indefinite");
        animate.setAttribute("end", "indefinite");
        animate.setAttribute("path", animationPath)
        animate.setAttribute("fill", "freeze");
        curDisk.appendChild(animate);
        return new Promise((resolve, reject)=>{
            const animateEndEventListner = ()=>{
                curDisk.setAttribute("x", x3);
                curDisk.setAttribute("y", y3);
                this.#diskSVGArray[i].pop();
                this.#diskSVGArray[j].push(curDisk);
                animate.endElement();
                curDisk.removeChild(animate);
                this.#abortSignal.removeEventListener('abort', abortEventListener);
                resolve()
            }
            const abortEventListener = ()=>{
                animate.removeEventListener('endEvent', animateEndEventListner)
                animate.endElement();
                curDisk.removeChild(animate);
                this.#abortSignal.removeEventListener("abort", abortEventListener);
                reject("aborted");
            }
            if(this.#abortSignal.aborted){
                curDisk.removeChild(animate);
                reject("aborted");
            }
            this.#abortSignal.addEventListener("abort", abortEventListener, {once: true})
            animate.addEventListener('endEvent', animateEndEventListner);
            animate.beginElement();
        })
    }

    #fillDP(){
        this.#diskPegDP = new Array(this.#pegCount+1);
        for(let i=0;i<=this.#pegCount;i++){
            this.#diskPegDP[i] = new Array(this.#diskCount+1);
        }
        for(let i=0;i<=this.#pegCount;i++){
            for(let j=0;j<=this.#diskCount;j++){
                this.#diskPegDP[i][j] = this.#inf;
            }
        }
        for(let i=0;i<=this.#pegCount;i++){
            this.#diskPegDP[i][0] = 0;
            if(i>=2) this.#diskPegDP[i][1] = 1;
        }
        for(let i=3;i<=this.#pegCount;i++){
            for(let j=1;j<=this.#diskCount;j++){
                for(let k=1;k<j;k++){
                    this.#diskPegDP[i][j] = Math.min(this.#diskPegDP[i][j], this.#diskPegDP[i][k]+1+this.#diskPegDP[i-1][j-k]);
                }
            }
        }

    }

    async #nextStep(){
        this.#waitingState = true;
        return new Promise((resolve, error)=>{
            this.#stepResolve = resolve;
        })
    }

    async #playHelper(from, to, pegCount, diskCount, mask){
        if(diskCount==0) return;
        if(diskCount==1){
            if(this.#stepMode) {
                await this.#nextStep();
            }
            await this.#moveDisk(from, to);
            return;
        }

        let nextDiskCount;
        for(let k=1;k<diskCount;k++){
            if(this.#diskPegDP[pegCount][k]+1+this.#diskPegDP[pegCount-1][diskCount-k]===this.#diskPegDP[pegCount][diskCount]){
                nextDiskCount = k;
                break;
            }
        }

        for(let i=0;i<this.#pegCount;i++){
            if((mask>>i&1) && !(i===to || i===from)){
                await this.#playHelper(from, i, pegCount, nextDiskCount, mask);
                await this.#playHelper(from, to, pegCount-1, diskCount-nextDiskCount, mask^(1<<i));
                await this.#playHelper(i, to, pegCount, nextDiskCount, mask);
                break;
            } 
        }
    }

    constructor(div, options={height: 400, width: 800, pegCount: 3, diskCount: 5, verticalMarginPercent: 0.05, HorizontalMarginPercent: 0.05, baseColor: "brown", pegColor: "brown", diskColor: "orange", diskAnimateTime: 1, stepMode: false}){
        this.#div = div;
        for(const optionValue in options){
            eval(`this.#${optionValue} = ${typeof options[optionValue] === "string"?`"${options[optionValue]}"`:options[optionValue]};`);
        }
        if(this.#pegCount===0){
            throw new Error("at least 1 peg is required.")
        }
        this.#doCalculations();
        this.#fillDP();
    }

    async play(){
        try{
            if(this.#pegCount<2) {
                console.error("Do you even want to see an animation? if you do, please atleast add 2 pegs")
                return;
            }
            if(this.#diskCount==0) return;
            if(this.#pegCount===2){
                if(this.#diskCount>1){
                    console.error("sorry i don't have all the time in the universe too run an animation for you. BTW, all the time in the universe is also not enough.");
                    return;
                }
                await this.#moveDisk(0, 1);
                return;
            }
            await this.#playHelper(0, this.#pegCount-1, this.#pegCount, this.#diskCount, (1<<this.#pegCount)-1);
        } catch(error){
            console.log(error);
        }
    }

    pause(){
        this.#mainSVG.pauseAnimations();
    }
    resume(){
        this.#mainSVG.unpauseAnimations();
    }
    abort(){
        this.#abortController.abort();
    }
    step(){
        if(this.#waitingState){
            this.#waitingState = false;
            this.#stepResolve();
        }
    }
    toggleStepMode(){
        if(this.#stepMode) this.step();
        this.#stepMode = !this.#stepMode;
    }

    setStepMode(){
        this.#stepMode = true;
    }

    unsetStepMode(){
        this.#stepMode = false;
    }

    isStepMode(){
        return this.#stepMode;
    }

}