import { useState } from 'react';
import './App.css';
import Quiz from './pages/Quiz';
import Landing from './pages/Landing';
import Ending from './pages/Ending';

let total;

export default function App () {
  const [settings, setSettings] = useState({
    amount: 10,
    difficulty: 'easy',
    category: 9
  });
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState('landing');
  const [points, setPoints] = useState(0);  

  function loadQuestions (res) {
    setQuestions(res);
    setPage('question');
    setPoints(0);
    total = res.length;
  }


  switch(page) {
    case 'landing':
      return <Landing {...{loadQuestions, settings, setSettings}}/>;
    case 'question':
      return <Quiz {...{questions, setQuestions, setPoints, setPage}}/>;
    case 'ending':
      return <Ending {...{points, total, setPage}}/>;
  }
}


