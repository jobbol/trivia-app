import { useState } from 'react';
import './Quiz.css';

/**
 * Asks the user questions.  This screen is repeated until no questions remain then <Score/> is displayed.
 * Questions are deleted as the user answers them.
 * @param {object} params
 * @param {object[]} params.questions
 * @param {function} params.setQuestions
 * @param {function} params.setPoints 
 * @param {function} params.setPage
 * @returns {React.JSX.Element}
 * }
 */
export default function Question ({questions, setQuestions, setPoints, setPage}) {
    let [isRevealPhase, setRevealPhase] = useState(false);

    //Exit out if no more questions are left.
    if (questions.length === 0) {
        setPage('ending');
        return;
    }

    const question = questions[0];

    function pickAnswer(i) {
        setRevealPhase(p=>!p);
        if (!isRevealPhase) {
            if (question['correct_answer'] !== question.answers[i]) {
                question.highlightWrong = i;
            }

            let delta = question['correct_answer'] === question.answers[i]? 1: 0;
            setPoints(score => score + delta);

            return;
        }

        setQuestions(q => {
            q.splice(0, 1);
            return [...q];
        });
    }

    return (
        <>
            <h1>{question.question}</h1>
            <div id="questions-container">
                {[...question.answers.map((answer, i) => {
                     
                    let highlight = '';
                    if (isRevealPhase) {
                        if (question.highlightWrong === i) {
                            highlight = ' incorrect'
                        }
                        if (answer === question['correct_answer']) {
                            highlight = ' correct';
                        }
                    }

                    return <button 
                        className={"question" + highlight}
                        key={i}
                        onClick={() => pickAnswer(i)}
                    >{answer}</button>
                })]}
            </div>
            <p><small>Questions left {questions.length}</small></p>
            <button id="exit-button" onClick={() => setPage('landing')}>Back</button>
            
        </>
    );
}