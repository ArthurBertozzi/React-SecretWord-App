// CSS
import './App.css';

// React & Hooks
import { useCallback, useEffect, useState } from 'react';

// data
import { wordsList } from "./data/words";

// Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"}
]

function App() {
  // creating the hooks and states
  // o estagio começa com a tela inicial
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);
  
  const guessesQty = 3

  const pickWordAndCategory = useCallback(() => {
    // acessar as chaves do objeto e obter as categorias
    const categories = Object.keys(words);
    // obter uma categoria aleatória
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // pegar uma palavra aleatoria
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return {word, category}
  }, [words])


  // start the secret word game 
  // se usamos a função como dependencia do useEffect precisamos envolver a função no useCallback
  // colocamos como dependencia algo fundamental mas não vai ser utilizado nesse caso
  const startGame = useCallback(() => {
    // clear all letters
    clearLetterStates();
    // pick word and pick category
    const {word, category} = pickWordAndCategory()

   // criar um array de letras -> desestruturar a palavra
    let wordLetters = word.split("")
    // deixar tudo minusculo
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    
    // preencher os status
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters)

    // instanciar a pagina
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // process the letter input
  const verifyLetter = (letter) => {
    // tratar a letra recebida do imput
    const normalizedLetter = letter.toLowerCase()

    // check if letter has already been utilized
    if (guessedLetters.includes(normalizedLetter) || 
        wrongLetters.includes(normalizedLetter)) {
      return;
    }

    // push guessed letter or remove a chance
    if (letters.includes (normalizedLetter)) {
        // pegamos o atual estado da guessed letters pelo state e complementamos o array com a nova letra
        setGuessedLetters((actualGuessedLetters) => [
          // spread operator ... -> pega todos os elementos atuais
          ...actualGuessedLetters,
          normalizedLetter,
        ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);

    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  //monitorar o estado das tentativas com o useEffect -> condição de derrota
  useEffect(() => {
      if (guesses <= 0) {
        // reset all states
        clearLetterStates();
        // change screen
        setGameStage(stages[2].name)
      }
  }, [guesses])

  // condição de vitoria
  useEffect (() => {

    // criar lista de letras únicas -> exemplo palavra ovo -> usuario so precisa colocar um o
    // criamos com o spread e a a função new + set
    const uniqueLetters = [...new Set(letters)];

    // win condition
    if (guessedLetters.length === uniqueLetters.length) {
      // add score
      setScore((actualScore) => actualScore += 100);
      // restart game with new word
      startGame();
    }

  }, [guessedLetters, letters, startGame]);

  

  // restart the game
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)
    setGameStage(stages[0].name);
  }


  return (
    <div className="App">
      {/* Somente mostra a startscreen caso o stage seja o start */}
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && <Game
                              verifyLetter={verifyLetter}
                              pickedWord={pickedWord} 
                              pickedCategory={pickedCategory} 
                              letters={letters}
                              guessedLetters={guessedLetters}
                              wrongLetters={wrongLetters}
                              guesses={guesses}
                              score={score}
                              />}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
