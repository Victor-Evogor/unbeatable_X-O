var origBoard;
var huPlayer='o';
var aiPlayer='x';
const winCombos=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
];
const cells=document.querySelectorAll(".cell");
startGame();
function startGame() {
    document.querySelector(".endgame").style.display="none";
    origBoard=Array.from(Array(9).keys());
    for (let index = 0; index < cells.length; index++) {
        const element = cells[index];
        element.innerText='';
        element.style.removeProperty("background-color");
        element.addEventListener("click", turnClick, false);
    }
}

function turnClick(square) {
    if(typeof origBoard[square.target.id]==="number"){
        turn(square.target.id,huPlayer);
        if(!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(),aiPlayer);
    }
        
}

function turn(squareId,player) {
    origBoard[squareId]=player;
    document.getElementById(squareId).innerText=player;
    let gameWon=checkWin(origBoard,player);
    if(gameWon) gameOver(gameWon);
}
function checkWin(board,player) {
    let plays=board.reduce((a,e,i)=> 
    (e===player)?a.concat(i):a
    ,[]);
    let gameWon=null;
    for(let [index,win] of winCombos.entries()){
        if(win.every(elem=> plays.indexOf(elem)!=-1)){
            gameWon={"index":index,"player":player};
            break;
        }
    }
    return gameWon;
}

function declareWinner(who){
    document.querySelector(".endgame").style.display="block";
    document.querySelector(".endgame > .text").innerText=who;
}

function gameOver(gameWon) {
    for(let index of winCombos[gameWon.index])
        document.getElementById(index).style.backgroundColor=gameWon.player===huPlayer?"#00fe12":"#fc1200";
    for (let i=0; i<cells.length; i++) cells[i].removeEventListener("click",turnClick,false);
    declareWinner(gameWon.player==huPlayer?"You Win!":"You Lose :(")
}

function bestSpot() {
    return minimax(origBoard,aiPlayer).index;
}

function emptySpots() {
    return origBoard.filter((x)=> typeof x === "number");
}

function checkTie() {
    if(emptySpots().length===0){
        for(let i=0; i< cells.length; i++){
            cells[i].style.backgroundColor="#1933fa";
            cells[i].removeEventListener("click", turnClick, false);
        }
        declareWinner("Tie Game");
        return true;
    }
    return false;
}

function minimax(newBoard,player){
    let availSpots=emptySpots(newBoard);
    if(checkWin(newBoard,huPlayer)){
         return {score: -10}
        }
    else if(checkWin(newBoard,aiPlayer)){
         return {score: 10}
        }
    else if(availSpots.length===0){ 
        return {score: 0}
    }
    let moves=[];
    for(let i=0; i<availSpots.length; i++){
        let move={};
        move.index= newBoard[availSpots[i]];
        newBoard[availSpots[i]]=player;
        if(player===aiPlayer){
            var result=minimax(newBoard,huPlayer);
            move.score = result.score;
        }else{
            var result=minimax(newBoard,aiPlayer);
            move.score = result.score;
        }
        newBoard[availSpots[i]]= move.index;
        moves.push(move);
    }
    var bestMove;
    if(player===aiPlayer){
        let bestScore=-1000;
        for(let i=0; i<moves.length;i++){
            if(moves[i].score>bestScore){
                bestScore=moves[i].score;
                bestMove=i;
            }
        }
    }else {
        let bestScore=1000;
        for(let i=0; i<moves.length;i++){
            if(moves[i].score<bestScore){
                bestScore=moves[i].score;
                bestMove=i;
            }
        }
    }
    return moves[bestMove];
}