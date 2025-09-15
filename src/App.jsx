import { useEffect, useState } from 'react'
import './App.css'

import { TURN } from './utils/constants'
import { checkWinner, saveGameToLocalStorage } from './utils/helpers'

import { WinnerBanner } from './components/WinnerBanner'
import { Square } from './components/Square'

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

  const [position, setPosition] = useState({x: 0, y: 0})

  //Actulizo el tablero y alterno turno
  const updateBoard = (index) => {

    if (board[index] || winner) return

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
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURN.X)
    setWinner(null)

    localStorage.removeItem('board')
    localStorage.removeItem('turn')
  }

  useEffect(() => {
     //Guardo la partida 
    saveGameToLocalStorage([
      { key: 'board', value: JSON.stringify(board) },
      { key: 'turn', value: turn }
    ])
  }, [turn, board])

  useEffect(() => {
    const handlePointerMove = (event) => {
      const { clientX, clientY } = event

      setPosition({x: clientX, y: clientY})
    }

    window.addEventListener('pointermove', handlePointerMove)
  }, [position.x, position.y])

  return (
    <main className='board'>
      <div style={{
        position: 'absolute',
        width: '40px',
        height: '40px',
        top: '-15px',
        left: '-20px',
        pointerEvents: 'none',
        transform: `translate(${position.x}px, ${position.y}px)`,
        }}>
        <p style={{ fontSize: 'xx-large' }}>{ turn == '\u{274C}' ? '\u{274C}' : '\u{2B55}' }</p>
      </div>
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
