import { useState } from 'react'
import './App.css'

import { Square } from './components/Square'
import { TURN } from './utils/constants'
import { checkWinner } from './utils/helpers'
import { WinnerBanner } from './components/WinnerBanner'

function App() {
  //Estado del newBoard
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })
  //Estado para manejar los turnos
  const [turn, setTurn] = useState(() => {
    const turnFromLocalStorage = window.localStorage.getItem('turn')
    return turnFromLocalStorage ?? TURN.X
  })
  const [winner, setWinner] = useState(null)

  //Actulizo el tablero y alterno turno
  const updateBoard = (index) => {

    if (board[index] || winner) return

    const newBoard = [...board]

    newBoard[index] = turn
    setBoard(newBoard)

    const newTurn = turn === TURN.X ? TURN.O : TURN.X

    //Guardo el estado actual del juego:
    localStorage.setItem('board', JSON.stringify(newBoard))
    localStorage.setItem('turn', newTurn)

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
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURN.X)
    setWinner(null)

    localStorage.removeItem('board')
    localStorage.removeItem('turn')
  }

  return (
    <main className='board'>
      <button onClick={resetGame}>Volver a jugar</button>
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
      <WinnerBanner winner={winner} resetGame={resetGame}></WinnerBanner>
    </main>
  )
}

export default App
