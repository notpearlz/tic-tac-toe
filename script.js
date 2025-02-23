function gameBoard(){
    let board;
    const columns = 3;
    const rows = 3;





    const newBoard = () => {
        board = [];
        for (let i = 0; i < rows; i++){
            board[i] = [];
            for (let j = 0; j < columns; j++){
                board[i].push(cell());
            }
        }
    }

    const getBoard = () => board;
    const updateBoard = (row, column, value) => board[row][column].setValue(value);
    const printBoard = () => {
        for (let i = 0; i < rows; i++) {
            const rowValues = board[i].map(cell => cell.getValue()) || " "; // Get all cell values in the row
            console.log(rowValues.join(" | "));
        }

    };

    const isFull = () => {
        let full = true

        for(let i = 0; i < rows; i++){
            for(let j = 0; j < rows; j++){
                // If board doesnt find value its not full
                if (board[i][j].getValue() == undefined){
                    //console.log(`${i} ${j} ${board[i][j].getValue()} full: ${full}`)
                    full = false;
                }
            }
        }

        if (full == false) {
            return -1;

        }
        return 1
    }

    newBoard();

    return {getBoard, printBoard, updateBoard, isFull, newBoard};
}

function cell(){
    let value;

    const getValue = () => value;
    const setValue = (newValue) => {if(!value){value = newValue; return 1;} else {return -1}};

    return {getValue, setValue};
}




const gameController = function(){
    const players = [
        {
            name: "playerOne",
            id: "X",
        },
        {
            name: "playerTwo",
            id: "O",
        }
    ]
    const board = gameBoard();

    //console.log(board.getBoard());


    let activePlayer = players[0];
    let winner;




    function playRound(){

        /*
        robot

            do {
                randRow = Math.round(Math.random() * 2);
                randColumn =  Math.round(Math.random() * 2);
        
                var valid = board.updateBoard(randRow, randColumn, activePlayer.id);
        
            } while (valid == -1);

        */

        // See if anyone has won yet
        for (let i = 0; i < 3; i++){

            //Check points for veritcal line win |
            let points;

            points = [
                board.getBoard()[0][i].getValue(),
                board.getBoard()[1][i].getValue(),
                board.getBoard()[2][i].getValue(),

            ];
            checkWin(points);



            //Check points for horizontal line win _
            points = [
                board.getBoard()[i][0].getValue(),
                board.getBoard()[i][1].getValue(),
                board.getBoard()[i][2].getValue(),

            ]
            checkWin(points);







        }

        //Check points for diagonal line win \
        points = [
            board.getBoard()[0][0].getValue(),
            board.getBoard()[1][1].getValue(),
            board.getBoard()[2][2].getValue(),

        ]
        checkWin(points);



        //Check points for diagonal line win /
        points = [
            board.getBoard()[0][2].getValue(),
            board.getBoard()[1][1].getValue(),
            board.getBoard()[2][0].getValue(),

        ]
        checkWin(points);

        if(winner && winner != "Tie"){
            return playerWinner = players.find(obj => {
                return obj.id === winner;
        })} 
        if(board.isFull() == 1){
            //console.log("tie")
            return "Tie"
        }
    }

    function gameReset(){
        winner = undefined;
        board.newBoard();
        //console.log("new board")
    }

    function checkWin(points){
        if(points[0] == points[1] && points[1] == points[2] && points[1] != undefined){
            winner = points[0];
        }

    }  


    function playerMove(row, column) {
        var valid = board.updateBoard(row, column, activePlayer.id);

        if (valid == 1) {
            activePlayer = activePlayer == players[0] ? players[1] : players[0];
        }
    }

    return {playRound, board, activePlayer, playerMove, gameReset};

}


screenController = function(){
    let playerWinner;


    const game = gameController();
    let gameScreen = document.querySelector(".game-screen");
    const restartGameBtn = document.querySelector(".restart-game");


    function loadScreen(){
        const container = document.querySelector(".game");
        container.textContent = "";
        
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                const cell = document.createElement("button");
                cell.classList.add("cell");
                cell.dataset.row = i;
                cell.dataset.column = j;

                cell.textContent = game.board.getBoard()[i][j].getValue() ?? "";
                container.append(cell);

                
                // click event for cell
                cell.addEventListener("click", () => {
                    game.playerMove(cell.dataset.row,cell.dataset.column);
                    loadScreen();
            
                    playerWinner = game.playRound();
                    
                    console.log(playerWinner);
                    if (playerWinner == "Tie") {
                        gameScreen.textContent = "The game was a tie";
                        showRestartButton(game);
                    }  else if (playerWinner){
                        gameScreen.textContent = "Winner: " + playerWinner.name;
                        showRestartButton(game);
     
                    }


                });
            }
        }    


    }


    function showRestartButton(game) {
        restartGameBtn.classList.remove("hidden"); // Show button
        playerWinner = undefined; // **Reset game state**


        restartGameBtn.addEventListener("click", () => {
            restartGameBtn.classList.add("hidden"); // Hide button after clicking
            game.gameReset();
            loadScreen();
            gameScreen.textContent = "";


        }); // Prevent multiple event listeners
    }



    
    
    return {loadScreen};
}


const screen = screenController(); // Initialize controller first

const startGameBtn = document.querySelector(".start-game");
startGameBtn.addEventListener("click", () => {
    startGameBtn.classList.add("hidden"); // Hide start button
    screen.loadScreen(); // Load the game when clicking start
});