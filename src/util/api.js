import clamp from "./clamp";
import random from "./random";
import decodeHTML from "./decodeHTML";

/**
 * Attempts to get a set of questions with a given set of props/settings.
 * @param {object} [props] 
 * @param {number} [props.amount=10] - Number of questions to grab from API.  Default 10.
 * @param {number} [props.category] - Category of questions such as sports, tv, general knowledge.  Must be between 9 and 32.
 * @param {string} [props.difficulty] - easy, medium or hard.
 * @returns {promise} 
 * On success sends object containing questions.
 * On failure sends object with {errPublic} containing public facing error message or sends new Error() on syntax error.
 * @example
 * const questions = await getQuestions(); //default
 * @example
 * const questions = await getQuestions({amount: 30}); //get 30 questions
 * @example
 * const questions = await getQuestions({amount: 10, category: 9, difficulty: 'easy'});
 */

export default function getQuestions (props = {}) {
    return new Promise((resolve, reject) => {

        let {url, errPublic} = buildURL(props);
        
        //Exit if URL could not be built from given settings
        if (errPublic) {
            reject({errPublic});
            return;
        }

        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {

            //Exit on server or client failure.
            if (this.status >= 400) {
                reject({status:this.status, response: xhr.responseText, errPublic: 'Error connecting to server'});
                return;
            }
            //Exit if xhr is not finished.
            if (this.readyState !== 4 || this.status !== 200) {
                return;
            }

            //Parse response if possible.
            let response;
            try {
                response = JSON.parse(xhr.responseText);
            } catch (err) {
                reject({...err, errPublic: 'An error has occured.'});
            }

            //Exit if API responded with error.
            if (response['response_code'] !== 0) {
                const errors = [
                    null, //success
                    'No questions found with these settings.  Try different settings.', //no results
                    'Invalid setting.  Try different settings.', //invalid parameter
                    'An error has occured.', //Token not found
                    'An error has occured.' //Token empty
                ];
                reject({errPublic: errors[response['response_code']]});
            }

            resolve(cleanData(response.results));
        }

        xhr.open('GET', url);
        xhr.send();
    });
}


/**
 * Attempts to build a URL to the API with a given set of props/settings.
 * @param {object} [props] 
 * @param {number} [props.amount=10] - Number of questions to grab from API.  Default 10.
 * @param {number} [props.category] - Category of questions such as sports, tv, general knowledge.  Must be between 9 and 32.
 * @param {string} [props.difficulty] - easy, medium or hard.
 * @returns {Object} object containing either {errPublic} or {url}.
 */
function buildURL (props = {}) {
    let url = 'https://opentdb.com/api.php?';
    
    props.amount = clamp(props.amount ?? 10, 5, 50);
    
    if (props.category) {
        props.category = clamp(props.category ?? 9, 9, 32);
    }
    
    if (props.difficulty && !(['easy', 'medium', 'hard'].includes(props.difficulty))) {
        return {errPublic: 'Invalid question difficulty.  Must be easy, medium or hard.'};
    }

    if (props.type && !(['multiple', 'boolean'].includes(props.type))) {
        return {errPublic: 'Invalid question type.  Must be multiple choice or true/false.'};
    }

    const keys = ['amount', 'category', 'difficulty', 'type'];
    let propsUrl = {};
    keys.forEach(key => {
        if(props[key]) {
            propsUrl = {...propsUrl, [key]: props[key]};
        }
    });

    return {url: url + new URLSearchParams(propsUrl).toString()};
}




function cleanData (results) {
    return results.map(result => {
        //Remove HTML encodings.
        result['incorrect_answers'] = result['incorrect_answers'].map(answer => decodeHTML(answer));
        result['correct_answer'] = decodeHTML(result['correct_answer']);
        result.question = decodeHTML(result.question);

        //True / false questions should always be True, False.
        if (result.type === 'boolean') {
            result.answers = ['True', 'False'];
            return result;
        }

        //Multiple choice questions should have the answer inserted somewhere randomly within the wrong answers.
        result.answers = [...result['incorrect_answers']];
        const randIndex = random(0, result.answers.length-1);
        result.answers.splice(randIndex, 0, result['correct_answer']);

        return result;

    });
}