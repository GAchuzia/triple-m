import './App.css';
import React, {useState, useEffect} from "react";
import Axios from "axios"

function App() {
  const [quesList, setQuesList] = useState([]);
  const [quesContent, setQuesContent] = useState('');
  const [quesAnswer, setQuesAnswer] = useState('');

  useEffect(() => {
    Axios.get("http://localhost:3001/api/get").then((response) => {
      console.log(response.data)
      setQuesList(response.data);
    });
  }, []);

  return (
    <div className="App">
      <h1>TEST</h1>

      <div className="form">

        {quesList.map((val) => {
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
          
        })}
      </div>
    </div>
  );
}

export default App;
