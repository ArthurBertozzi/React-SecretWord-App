import './Game.css'

import {useState, useRef} from 'react'

const Game = ({verifyLetter, pickedWord, pickedCategory, letters, guessedLetters, wrongLetters, guesses, score}) => {
    // criar o estado da letra
    const [letter, setLetter] = useState()
    // usamos o useRef para criar uma referência, iniciamos como null e colocamos a referencia no input
    // é como a gente tivesse selecionado o elemento no DOM
    const letterInputRef = useRef(null)

    const handleSubmit = (e) => {
        e.preventDefault();
        verifyLetter(letter);
        setLetter("");
        // para focar no elemento novamente para poder jogar novamente -> useRef selecionou ele no DOM
        letterInputRef.current.focus()

    }

    console.log(`wrong letters -> ${wrongLetters}`)

  return (
    <div className='game'>
        <p className="points">
            <span>Pontuação: {score}</span>
        </p>
        <h1>Adivinhe a palavra:</h1>
        <h3 className="tip">
            Dica sobre a palavra: <span>{pickedCategory}</span>
        </h3>
        <p>Você ainda tem {guesses} tentativas(s).</p>
        <div className="wordContainer">
            {/* mapear a lista de letrar e criar os espaços vazios ou as eltras acertadas  */}
            {/* Para isso verificamos se a letra está na lista de guessed letters */}
            {letters.map((letter, i) => (
                guessedLetters.includes(letter) ? (
                    <span key={i} className="letter">{letter}</span>
                ) : (
                    <span key={i} className="blankSquare"></span>
                )
            ))}
        </div>
        <div className="letterContainer">
            <p>Tente adivinhar uma letra da palavra:</p>
            <form action="" onSubmit={handleSubmit}>
                <input type="text" 
                name="letter" 
                maxLength="1" 
                required 
                onChange={(e) => setLetter(e.target.value)}
                value = {letter}
                ref={letterInputRef}
                />
                <button>Jogar!</button>
            </form>
        </div>
        <div className="wrongLettersContainer">
            <p>Letras já utilizadas:</p>
            {wrongLetters.map((letter, i) => (
            <span key={i}>{letter}, </span>
            ))}
        </div>
    </div>
  )
}

export default Game