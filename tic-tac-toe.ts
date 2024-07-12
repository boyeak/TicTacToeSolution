

  type Counts<T, TLength extends number> = [T, ...T[]] & { length: TLength };

  type CountsMatrix<Counts, TLength extends number> = [Counts, ...Counts[]] & {length: TLength}

  type playerGroupCounts = {
    rowCounts: Counts<number,4>,
    colCounts: Counts<number,4>,
    boxCounts: Counts<Counts<number,3>,3>,
    diagCounts: Counts<number,2>,
    cornerCounts: Counts<number,1>
  }

  /* My primary class is PlayerCounts, which provides
  representations of the groupCounts for each player, which is
  the number of moves they have in any of the provided groupings 
  (row, col, two by two box, diagonal, 4 corners). Once a user reaches
  a count of 4 in one of any of the groupings (4 rows, 4 columns, 9 two by two boxes,
  2 diagonals, the group of 4 corners), that signifies a win.
  */

  class PlayerCounts {

    public playerXgroupCounts: playerGroupCounts
    public playerOgroupCounts: playerGroupCounts
    public totalMovesLeft: number = 16
    public winner: string = ''
 
    constructor(xTotalCounts: playerGroupCounts , oTotalCounts : playerGroupCounts){
        this.playerXgroupCounts = xTotalCounts
        this.playerOgroupCounts = oTotalCounts
    }

    /* checkWinner takes in a string representing the player who just made a move 
    and the coordinate of their most recent move. Their coordinate references a 4 by 4 
    two dimensional array where both indicies range from 0 to 3. It also relies heavily
    on current states of playerXgroupCounts and playerOgroupCounts. It returns a string signifying
    the winner if any. It will either be the current player 'X' or 'O' or an empty string ''
    if there is still no winner */

    public checkWinner(player: string, coor: number[]){

        this.totalMovesLeft = this.totalMovesLeft - 1

        const coorRow = coor[0]
        const coorCol = coor[1]

        const playerCountsStr = (player === 'X')? 'playerXgroupCounts' : 'playerOgroupCounts'

        //increment row counts
 
        this[playerCountsStr].rowCounts[coorRow]++


        if(this[playerCountsStr].rowCounts[coorRow] === 4){
            this.winner = player
            return player
        }

        //increment column Counts

        this[playerCountsStr].colCounts[coorCol]++


        if(this[playerCountsStr].colCounts[coorCol] === 4){
            this.winner = player
            return player
        }

        //increment 2 by 2 box Counts

        const boxCoor = []
         
        if(coorRow === 0){
            boxCoor.push([0])
        }else if(coorRow === 1){
            boxCoor.push([0,1])
        }else if(coorRow === 2){
            boxCoor.push([1,2])
        }else{
            boxCoor.push([2])
        }

        if(coorCol === 0){
            boxCoor.push([0])
        }else if(coorCol === 1){
            boxCoor.push([0,1])
        }else if(coorCol === 2){
            boxCoor.push([1,2])
        }else{
            boxCoor.push([2])
        }

        for(let i = 0; i < boxCoor[0].length; i++){
            for(let j = 0; j < boxCoor[1].length; j++){
                const currentRow = boxCoor[0][i]
                const currentCol = boxCoor[1][j]
                this[playerCountsStr].boxCounts[currentRow][currentCol]++
                if(this[playerCountsStr].boxCounts[currentRow][currentCol] === 4){
                    this.winner = player
                    return player
                }
            }
        }

        //increment diagonal counts

        if(coorRow === coorCol){
            this[playerCountsStr].diagCounts[0]++
            if(this[playerCountsStr].diagCounts[0] === 4){
                this.winner = player
                return player
            }
        }else if((coorRow + coorCol) === 3){
            this[playerCountsStr].diagCounts[1]++
            if(this[playerCountsStr].diagCounts[1] === 4){
                this.winner = player
                return player
            }
        }

        //increment 4 corner counts

        if((coorRow === 0 || coorRow === 3) && (coorCol === 0 || coorCol === 3)){
            this[playerCountsStr].cornerCounts[0]++
            if(this[playerCountsStr].cornerCounts[0] === 4){
                this.winner = player
                return player
            }
        }
        
        return ''

    }

    /* technically doesn't take in any parameters but returns bolean true or false depending 
    on the current value of totalMovesLeft in class instance */

    public anyMovesLeft(){
        const areMovesLeft = (this.totalMovesLeft > 0)
        return areMovesLeft
    }

    /* technically doesn't take in any parameters but returns bolean true or false depending 
    on the current values of totalMovesLeft and winner in class instance */

    public isGameOver(){
        const gameIsOver = (this.totalMovesLeft === 0 || this.winner !== "")
        return gameIsOver
    }

  }

  //simulates non-strategic, randomized gamePlay

  /*
  const main = () => {
    const xCounts: playerGroupCounts  = {
        rowCounts: [0,0,0,0],
        colCounts: [0,0,0,0],
        boxCounts: [[0,0,0],[0,0,0],[0,0,0]],
        diagCounts: [0,0],
        cornerCounts: [0]
    }

    const oCounts: playerGroupCounts  = {
        rowCounts: [0,0,0,0],
        colCounts: [0,0,0,0],
        boxCounts: [[0,0,0],[0,0,0],[0,0,0]],
        diagCounts: [0,0],
        cornerCounts: [0]
    }

    const newGame = new PlayerCounts(xCounts, oCounts)

    const gameCoor = []
    const ticTacToeBoard = []
    for(let i = 0; i < 4; i++){
        const row = []
        for(let j = 0; j < 4; j++){
            gameCoor.push([i,j])
            row.push("E")
        }
        ticTacToeBoard.push(row)
    }
    
    let gameCoorLength = gameCoor.length
    let winner = ""

    let turn = "X"
    const XCoor = []
    const OCoor = []
    while(gameCoorLength > 0 && winner === ""){
        const index = Math.floor(Math.random() * gameCoorLength)

        const currentCoor = gameCoor[index]

        winner = newGame.checkWinner(turn, currentCoor)

        ticTacToeBoard[currentCoor[0]][currentCoor[1]] = turn

        gameCoor.splice(index, 1)

        if(turn == "X"){
            XCoor.push(currentCoor)
            turn = "O"
            console.log("X turn")
            console.log("final Player X: " + JSON.stringify(newGame.playerXgroupCounts))
            console.log("final Player O: " + JSON.stringify(newGame.playerOgroupCounts))
        }else{
            OCoor.push(currentCoor)
            turn = "X"
            console.log("O turn")
            console.log("final Player X: " + JSON.stringify(newGame.playerXgroupCounts))
            console.log("final Player O: " + JSON.stringify(newGame.playerOgroupCounts))
        }

        console.log("anyMovesLeft: " + newGame.anyMovesLeft())

        console.log("isGameOver: " + newGame.isGameOver())

        console.log()

        gameCoorLength = gameCoor.length

    }

    console.log()

    console.log("winner: " + winner)
    console.log()
    console.log()
    console.log("XCoor: " + JSON.stringify(XCoor));
    console.log()
    console.log("OCoor: " + JSON.stringify(OCoor));
    console.log()
    console.log()
    console.log("final Player X: " + JSON.stringify(newGame.playerXgroupCounts))
    console.log("final Player O: " + JSON.stringify(newGame.playerOgroupCounts))
    console.log("movesLeft: " + newGame.totalMovesLeft)
    console.log()
    for(let i = 0; i < ticTacToeBoard.length; i++){
        console.log(JSON.stringify(ticTacToeBoard[i]))
    }
  }*/

  //main()

  