/**
 * End of quiz win screen.  Displays the
 *  user's score and asks if they want to play again.
 * @param {object} params
 * @param {number} params.correct - Number of correct answers by user.
 * @param {number} params.total   - Total number of questions.
 * @param {function} params.setPage - Function when passed a string changes the page.
 * @returns {React.JSX.Element}
 */

export default function Ending ({points, total, setPage}) {
    let score = Math.round(points / total * 100) + '%';
    return (
        <>
            <h1>Quiz End!</h1>
            <p>Your final score</p>
            <p>{score}</p>
            <p>{points} out of {total}</p>
            <button onClick={() => setPage('landing')}>Play again</button>
        </>
    );
}