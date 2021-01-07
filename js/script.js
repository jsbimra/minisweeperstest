'use strict';

const getSizesAndBombs =  () => {
    let mSize = document.getElementById('mSize').value || 2;
    let nSize = document.getElementById('nSize').value || 2;

    const totalBlocks = parseInt(mSize) * parseInt(nSize);
    const xBombs = Math.floor(Math.sqrt(totalBlocks));

    return {
        mSize,
        nSize,
        totalBlocks,
        xBombs,
    };
};


const msModule = {
    gamePanelEle:  document.getElementById('gamePanel') || (() => { console.error('gamePanel id not set on element'); return null;}),
    boardEle:  document.getElementById('board') || (() => { console.error('board id not set on element'); return null;}),
    scoreCardele:  document.getElementById('scoreCard') || (() => { console.error('scoreCard id not set on element'); return null;}),
    actionWrapEle:  document.getElementById('actionWrap') || (() => { console.error('actionWrap id not set on element'); return null;}),
    beginButtonEle: document.getElementById('beginButton') || (() => { console.error('beginButton id not set on element'); return null;}),
    xBombs: 0,
    init() {
        console.log('init the game!');
        if(!this.actionWrapEle && !this.gamePanelEle) {
            return;
        }

        // this.actionWrapEle.addEventListener('click', this.onBeign.bind(this));
        this.beginButtonEle.addEventListener('click', this.onBeign.bind(this));
        
    },
    onBeign() {
        // console.log('On Beign fired');
        this.buildGameBoard();
    },
    buildGameBoard() {
        const m =  getSizesAndBombs().mSize;
        const n =  getSizesAndBombs().nSize;

        if(m < 2 || n < 2) {
            alert("Please set board atleast 2x2");
            return;
        }
        const totalBlocks =  getSizesAndBombs().totalBlocks;
        this.xBombs = getSizesAndBombs().xBombs;
        // console.log({m, n, xBombs: this.xBombs, totalBlocks});
        const blocks = [];
        
        this.actionWrapEle.classList.add('d-none');
        this.gamePanelEle.classList.remove('d-none');

        this.randomXBombPlace(totalBlocks);        
        // console.log(this.randoms);

        for(let i = 1; i <= totalBlocks; i++) {
            // onClick="${msModule.gameOver(false, 'XButton'+i)}"
            blocks.push(`<label class="x-button-label" 
            data-xButton="${'XButton'+i}" 
            data-bomb="1">${i}</label>`);
        }

        // console.log("blocks formation: ", blocks);
        
        if(this.randoms.length) {
            for(let i = 0; i < this.randoms.length; i++) {
                // onClick="${msModule.gameOver(true, 'XButton'+i)}"
                blocks[ this.randoms[i] ] = `<label class="x-button-label bomb" 
                data-xButton="${'XButton'+ (parseInt(this.randoms[i])+1)}"
                data-bomb="0">X</label>`;
            }
        } else {
            blocks[ n-1] = `<label class="x-button-label bomb" 
                data-xButton="${'XButton'+ (parseInt(n-1))}"
                data-bomb="0">X</label>`;
        }
        
        const boardStyle = 
            `grid-template-rows: repeat(${m}, 24px);
                grid-template-columns: repeat(${n}, 24px);
                grid-gap: .5rem 1rem;
                text-align: center;
                background: beige;`;
            
        let template = `<div class="d-grid mt-3" style="${boardStyle}">${blocks.join('')}</div>`;

        // console.log("blocks formation updates : ", {blocks, template});

        this.boardEle.innerHTML = template;

        setTimeout(this.initBoardActions(), 0);
    },
    initBoardActions() {
        // console.log('initBoard Action called' );
        const xButtonsNodes = Array.from(document.querySelectorAll('[data-xButton]'));
        // console.log(xButtonsNodes);

        for(let xB of xButtonsNodes) {
            // console.log({xB});
            xB.addEventListener('click', () => {this.gameOver(xB)})
        }
    },
    randoms: [],
    randomXBombPlace(n) {
        let div = Math.floor(n/2);

        if(div !== 1) {
            // this.randoms.push(Math.floor(div*Math.random()));
            this.randoms.push(div);
            this.randomXBombPlace(div);
        }
        
        return this.randoms;
    },
    gameOver(xB) {
        // console.log('game over state: ', {xB, xBid: xB.getAttribute('data-xButton')});

        const isGameOver = xB && parseInt(xB.getAttribute('data-bomb'));
        xB.classList.add('revealed');

        const curText = parseInt(xB.textContent);

        if(curText) {
            this.totalScore +=curText;
            this.scoreCardele.innerHTML = this.totalScore;
        }
        // console.log({isGameOver});
        
        if(!isGameOver) {
            //game over;
            alert('Opps, Gave Over!!');
            window.location.reload();
        } 
    },
    totalScore: 0,
};

msModule.init();