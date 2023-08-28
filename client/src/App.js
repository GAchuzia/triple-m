import './App.css';
import React, {useState, useEffect} from "react";
import axios from "axios"

function App() {
  const [fullQList, setFullQList] = useState([]);
  const [randomNumber, setRandomNumber] = useState(0);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/get");
      const result = await response.data;
      setFullQList(result);
      console.log(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function chooseQ(list) {
    const generateRandomNumber = () => {
      const randomNumber = Math.floor(Math.random() * list.length);
      setRandomNumber(randomNumber);
    }
    console.log(list[randomNumber]);
    let val = list[randomNumber];
    let delimiter = 'E';
    if (val.type == "addition") {
      delimiter = '+'
    } else if (val.type == "subtraction") {
      delimiter = '-'
    } else if (val.type == "multiplication") {
      delimiter = '*'
    } else if (val.type == "division") {
      delimiter = '/'
    }

    let data = JSON.parse(val.content);
    let question = '';
    for (const [key, value] of Object.entries(data)) {
      question = question + " " + value;
      if ( key != (Object.keys(data).length - 1)) {
        question = question + " " + delimiter;
      }
    }
    question = question + " = "

    return (
    <div className="card">
      <p>{question}</p> 
    </div>
    );
  }

  return (
    <div className="App">
      <h1>TEST</h1>

      <div className="form">
        {chooseQ(fullQList)}
      </div>
    </div>
  );
}

export default App;
