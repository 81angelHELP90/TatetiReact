import confetti from 'canvas-confetti'
import { Square } from './Square'

export const WinnerBanner = ({winner, resetGame}) => {
    let textResult = winner ? 'El ganador es:' : 'Empate'
    if(winner == null) return winner
    if(winner) confetti()

  return (
    <section className='winner'>
        <div className='text'>
        <h1>{textResult}</h1>
        <header className='win'>
            {winner && <Square>{winner}</Square>}
        </header>
        <footer>
            <button onClick={resetGame}>Volver a jugar</button>
        </footer>
        </div>
    </section>
  )
}
