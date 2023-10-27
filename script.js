const gameBoard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Square());
        }
    }

    const setSquare = (token, r, c) => {
        board[r][c].setSquareValue(token);
    }

    const getBoard = () => board;

    const printBoard = () => {
        for (let i = 0; i < rows; i++) {
            console.log(`${board[i][0].getSquareValue()} ${board[i][1].getSquareValue()} ${board[i][2].getSquareValue()}`);
        }
    };

    const setBoard = (setValue) => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                setSquare(setValue, i, j);
            }
        }
    };

    return { setSquare, getBoard, printBoard, setBoard };
})();

function Square() {
    let value;
    const setSquareValue = (token) => value = token;
    const getSquareValue = () => value;
    return { setSquareValue, getSquareValue };
}

function Player(playerName, token) {
    const getPlayerName = () => playerName;
    const getPlayerToken = () => token;
    return { getPlayerName, getPlayerToken };
}

// a game can only progress with changing states; thus, the sum total of a game can be thought of as the progression of its changes.
// the game controller is responsible for changing the state of the objects.
// the objects themselves should only offer methods to modify their states, as well as retrieve them.
// the objects themselves are not responsible for keeping track of past or future states, or the present state's place in the 
// timeline of the game.
const gameController = (function () {
    const rows = 3, columns = 3;
    const players = [];
    players.push(Player('Player 1', 'X'));
    players.push(Player('Player 2', 'O'));
    let currentPlayer;

    function playRound() {
        let player_response, player_row, player_column;
        gameBoard.setBoard(' ');
    
        let winner = false;
        while (!winner) {
            currentPlayer = currentPlayer === players[0] ? players[1] : players[0];

            do {
                player_response = (prompt(`${currentPlayer.getPlayerName()}, please enter a row and column: `)).split(" ");
                player_row = player_response[0]-1;
                player_column = player_response[1]-1;
            } while ((gameBoard.getBoard())[player_row][player_column].getSquareValue() !== ' ');

            gameBoard.setSquare(currentPlayer.getPlayerToken(), player_row, player_column);

            gameBoard.printBoard();
    
            winner = isWinner();
        }

        console.log(`${currentPlayer.getPlayerName()} is the winner!`);
    }


    function isWinner() {
        let board = (gameBoard.getBoard()).map(row => row.map(square => square.getSquareValue()));
        let currentPlayerToken = currentPlayer.getPlayerToken();
        for (let i = 0; i < rows; i++) {
            if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                if (board[i][0] === currentPlayerToken)
                    return true;
            }
        }
        
        for (let j = 0; j < columns; j++) {
            if (board[0][j] === board[1][j] && board[1][j] === board[2][j]) {
                if (board[0][j] === currentPlayerToken)
                    return true;
            }
        }

        if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            if (board[0][0] === currentPlayerToken)
                return true;
        } else if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
            if (board[0][2] === currentPlayerToken)
                return true;
        }

        return false;
    }

    return { playRound };
})();

gameController.playRound();


// UI
