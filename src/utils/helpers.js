import { TURN, WINNER } from './constants'

export function checkWinner (newBoard) {
    //Enfoque matriz
    let matrix = getMatrix(newBoard)
    
    //Busco el ganador en las diagonales
    let dWinner = checkDiagonal(matrix)
    if(dWinner !== '')
      return dWinner
    

    for (let i = 0; i < 3; i++) {
      let row = ''
      let column = ''

      for (let j = 0; j < 3; j++) {
        row += matrix[i][j]
        column += matrix[j][i]

        if (j == 2) {
          //Busco al ganador entre las filas y columnas
          let winner = checkRowAndColumn([row, column])
          if(winner !== '')
            return winner
        }
      }
    }

    return newBoard.every(turn => turn) ? '' : null
}

const getMatrix = (newBoard) => {
    let matrix = []
    let tupla = []
    let index = 0

    newBoard.forEach(item => {
      index++

      if (index <= 3) {
        tupla.push(item)
      }

      if (index == 3) {
        index = 0
        matrix.push(tupla)
        tupla = []
      }
    });

    return matrix
}

const checkDiagonal = (mMatrix) => {
    let mainDiagonal = []
    let secondaryDiagonal = []

    for (let i = 0; i < mMatrix.length; i++) {
      mainDiagonal.push(mMatrix[i][i])
      secondaryDiagonal.push(mMatrix[i][mMatrix.length - 1 - i])
    }

    if (mainDiagonal.every(item => item == TURN.X) || mainDiagonal.every(item => item == TURN.O))
      return mainDiagonal[0]

    if (secondaryDiagonal.every(item => item == TURN.X) || secondaryDiagonal.every(item => item == TURN.O))
      return secondaryDiagonal[0]

    return ''
}

const checkRowAndColumn = (aGame) => {

    for (let i = 0; i < aGame.length; i++) {
      let sGame = aGame[i]

      if (sGame === WINNER.X) return TURN.X

      if (sGame === WINNER.O) return TURN.O
    }

    return ''
}
 
