import { useState } from 'react';
import getQuestions from '../util/api';
import clamp from '../util/clamp';

import './Landing.css';

/**
 * Asks the user what type of quiz they they prefer.  Then opens <Quiz/>.
 * @param {object} params
 * @param {function} params.loadQuestions - must be passed an array of questions after a successful API call.
 * @param {object} params.settings - question settings passed to the API.
 * @param {function} params.setSettings - updates the question settings passed to the API.
 */
export default function Landing ({ loadQuestions, settings, setSettings}) {
    const [ hideAdvanced, setHideAdvanced ] = useState(true);

    function startQuiz () {
        getQuestions(settings)
        .then((questions) => {
            loadQuestions(questions);
        })
        .catch(err => {
            if (err?.errPublic) {
                alert(err.errPublic);
            }
            console.log(err);
        });
    }
    
    function alterSettings (key, event) {
        setSettings(s => {
            s = {...s, [key]: event.target.value};
            s.amount = clamp(s.amount, 5, 50);
            return s;
        });
    }

    let options = <></>;
    if (!hideAdvanced) {
        options = <form id="options">
            <label htmlFor="amount">Number of questions</label>
            <input type="number" name="amount" value={settings.amount} onChange={(event)=>alterSettings('amount', event)}/>

            <label htmlFor="category">Category</label>
            <select name="category" value={settings.category} onChange={(event)=>alterSettings('category', event)}>
                <option value="">Any</option>
                {[...[
                    'General Knowledge',
                    'Books',
                    'Film',
                    'Music',
                    'Theatre',
                    'TV',
                    'Video Games',
                    'Board Games',
                    'Science',
                    'Computers',
                    'Math',
                    'Mythology',
                    'Sports',
                    'Geography',
                    'History',
                    'Politics',
                    'Art',
                    'Celebrities',
                    'Animals',
                    'Vehicles',
                    'Comics',
                    'Gadgets',
                    'Anime',
                    'Cartoons'
                ].map((el, i) => <option value={i+9} key={i}>{el}</option>)]}
            </select>

            <label htmlFor="difficulty">Difficulty</label>
            <select name="difficulty" value={settings.difficulty} onChange={(e)=>alterSettings('difficulty', e)}>
                <option value="">Any</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>

            <label htmlFor="type">Type</label>
            <select name="type" value={settings.type} onChange={(e)=>alterSettings('type', e)}>
                <option value="">Any</option>
                <option value="">Multiple choice</option>
                <option value="boolean">True / False</option>
            </select>

        </form>;
    }
    return (
        <>
            <h1>Trivia App</h1>
            <button className="btn-secondary" onClick={() => setHideAdvanced(b => !b)}>Advanced</button>
            {options}
            <button className="btn-main" onClick={() => startQuiz()}>Start</button>
        </>
    );
}