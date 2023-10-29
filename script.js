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

    const setBoard = (setValue) => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                setSquare(setValue, i, j);
            }
        }
    };

    return { setSquare, getBoard, setBoard };
})();

function Square() {
    let value;
    const setSquareValue = (token) => value = token;
    const getSquareValue = () => value;
    return { setSquareValue, getSquareValue };
}

function Player(playerName, token) {
    const setName = (name) => playerName = name;
    const getPlayerName = () => playerName;
    const getPlayerToken = () => token;
    return { getPlayerName, getPlayerToken, setName };
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
    let currentPlayer, player_response, player_row, player_column;
    gameBoard.setBoard('');

    function playRound(player_row, player_column) {

        player_row--;
        player_column--;
        if ((gameBoard.getBoard())[player_row][player_column].getSquareValue() !== '')
            return;

        gameBoard.setSquare(currentPlayer.getPlayerToken(), player_row, player_column);

        if (isWinner(currentPlayer.getPlayerToken())) {
            console.log(`Winner is ${currentPlayer.getPlayerName()}`);
        }
        else if (isTie()) {

        }
        else {
            currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        }
    }

    function isTie() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (gameBoard.getBoard()[i][j].getSquareValue() === '')
                    return false;
            }
        }
        return true;
    }

    function setCurrentPlayer() {
        currentPlayer = players[0];
    }

    function isWinner(currentPlayerToken) {
        let board = (gameBoard.getBoard()).map(row => row.map(square => square.getSquareValue()));
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

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function setPlayerName(index, name) {
        players[index].setName(name);
    }

    return { playRound, setCurrentPlayer, getCurrentPlayer, setPlayerName, isWinner, isTie };
})();

screenController = (function() {
    const rows = 3;
    const columns = 3;
    const board = gameBoard.getBoard();
    const squares = document.querySelectorAll('.square');
    const playButtonContainer = document.querySelector('.play-button-container');
    const playerNameDialog = document.querySelector('dialog');
    const playerNameForm = document.querySelector('#player-name-form');
    const submitButton = document.querySelector('.submit-button');
    const playerMessage = document.querySelector('h1');

    submitButton.addEventListener('click', (event) => {
        event.preventDefault();
      
        const formData = new FormData(playerNameForm);
        let player1, player2;
        for (const [key, value] of formData) {
          switch(key) {
            case 'player1': 
              player1 = value;
              break;
            case 'player2': 
              player2 = value;
              break;
          }
        }

        gameController.setPlayerName(0, player1);
        gameController.setPlayerName(1, player2);

        setPlayerMessage();
      
        // const book = new Book(title, author, pages, read);
        // addBookToLibrary(book);
        // displayBooks();
        playerNameDialog.close();
        playerNameForm.reset();
      });


    const playButton = document.querySelector('.playButton');
    playButton.addEventListener('click', () => {
        playerNameDialog.showModal();

        console.log('Play button pressed.');
        initializeBoard();
        gameController.setCurrentPlayer();
        setBoardValues();
        playButtonContainer.removeChild(playButton);

        const resetButton = document.createElement('button');
        resetButton.setAttribute('class', 'resetButton');
        resetButton.textContent = 'Reset';
        playButtonContainer.appendChild(resetButton);
    });

    playButtonContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('resetButton')) {
            console.log('Reset button pressed');
            gameBoard.setBoard('');
            gameController.setCurrentPlayer();
            setBoardValues();
            setPlayerMessage();
        }
    });

    function initializeBoard() {
        // This wasn't showing up because '' and ' ' are not the same.
        gameBoard.setBoard('');
        squares.forEach((square) => {
            // The reason this doesn't work is that square.textContent is overwritten later on by setBoardValues.
            // square.textContent = "WOW";
            // console.log(square.textContent);
            square.addEventListener('click', () => {
                // extract row and column numbers from class attributes of the node 
                const row = ((square.parentNode.parentNode.getAttribute('class')).split(" "))[1];
                const column = (square.parentNode.getAttribute('class').split(" "))[1];
    
                gameController.playRound(row, column);
                setPlayerMessage();
                setBoardValues();
                
                for (let i = 0; i < rows; i++) {
                    console.log(`${board[i][0].getSquareValue()} ${board[i][1].getSquareValue()} ${board[i][2].getSquareValue()}`);
                }
            });
        });
    }

    function setBoardValues() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                squares[3*i+j].textContent = board[i][j].getSquareValue();
            }
        }
    }

    function setPlayerMessage() {
        if (gameController.isWinner(gameController.getCurrentPlayer().getPlayerToken())) {
            playerMessage.textContent = `Winner is ${gameController.getCurrentPlayer().getPlayerName()}`;
        } else if (gameController.isTie()) {
            playerMessage.textContent = `Game is a tie.`;
        } else {
            playerMessage.textContent = `${gameController.getCurrentPlayer().getPlayerName()}'s turn.`;
        }
    }

    return { initializeBoard , setBoardValues };
})();


