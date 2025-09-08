import { useState } from 'react'
import './App.css'

const TURN = {
  X: 'X',
  O: 'O'
}

const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `square ${isSelected ? 'is-selected' : ''}`
  const handleClick = () => {
    updateBoard(index)
  }

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  )
}

const WinnerBanner = ({winner}) => {
  const showText = winner ? 'El ganador es: ' + winner : 'Empate'

  return (
    <div >
      <h1>{showText}</h1>
    </div>
  )
}

function App() {
  //Estado del newBoard
  const [board, setBoard] = useState(Array(9).fill(null))
  //Estado para manejar los turnos
  const [turn, setTurn] = useState(TURN.X)

  const [winner, setWinner] = useState(null)

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

  const checkWinner = (newBoard) => {
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

  const checkRowAndColumn = (aGame) => {
    const WINNER_X = 'XXX'
    const WINNER_O = 'OOO'

    for (let i = 0; i < aGame.length; i++) {
      let sGame = aGame[i]

      if (sGame === WINNER_X) return 'X'

      if (sGame === WINNER_O) return 'O'
    }

    return ''
  }

  const checkDiagonal = (mMatrix) => {
    let mainDiagonal = []
    let secondaryDiagonal = []

    for (let i = 0; i < mMatrix.length; i++) {
      mainDiagonal.push(mMatrix[i][i])
      secondaryDiagonal.push(mMatrix[i][mMatrix.length - 1 - i])
    }

    if (mainDiagonal.every(item => item == 'X') || mainDiagonal.every(item => item == 'O'))
      return mainDiagonal[0]

    if (secondaryDiagonal.every(item => item == 'X') || secondaryDiagonal.every(item => item == 'O'))
      return secondaryDiagonal[0]

    return ''
  }

  //Actulizo el tablero y alterno turno
  const updateBoard = (index) => {

    if (board[index] || winner)
      return

    const newBoard = [...board]

    newBoard[index] = turn
    setBoard(newBoard)

    const newTurn = turn === TURN.X ? TURN.O : TURN.X

    //Actualiso el estado del turno con el siguiete turno
    setTurn(newTurn)

    /**
     * Hago una copia de la prop board para poder manipularla.
     * Es una MALA practica alterar un prop directamente. 
     * Las props deben ser tratadas como objetos inmutables
     * El estado de una props solo se modifica a traves de su funcion modificadora 
     * proporcionada por el hoock useState
    */
    const objWinner = checkWinner(newBoard)
    setWinner(objWinner)
  };

  return (
    <main className='board'>
      <section className='game'>
        {
          board.map((c, index) => {
            return (
              <Square key={index} index={index} updateBoard={updateBoard}>
                {board[index]}
              </Square>
            )
          })
        }
      </section>
      <section className='turn'>
        <Square isSelected={turn === TURN.X}>{TURN.X}</Square>
        <Square isSelected={turn === TURN.O}>{TURN.O}</Square>
      </section>
      { winner !== null && (
          <section>
            <WinnerBanner winner={winner}></WinnerBanner>
          </section>
        )
      }
    </main>
  )
}

export default App
