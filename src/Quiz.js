import React, { useState, useEffect } from 'react';
import { questions } from './data';

const Quiz = ({ savedData }) => {
    const [userAnswers, setUserAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (savedData?.submitted) {
            setUserAnswers(savedData.userAnswers);
            setSubmitted(true);
        } else {
            const currentAnswers = localStorage.getItem('current_answers');
            if (currentAnswers) {
                setUserAnswers(JSON.parse(currentAnswers));
            }
        }
    }, [savedData]);

    const handleOptionChange = (questionIndex, option) => {
        if (submitted) return;

        const updatedAnswers = {
            ...userAnswers,
            [questionIndex]: option,
        };
        console.log(updatedAnswers)
        setUserAnswers(updatedAnswers);
        localStorage.setItem('current_answers', JSON.stringify(updatedAnswers));
    };

    const handleSubmit = () => {
        const data = { submitted: true, userAnswers };
        setSubmitted(true);
        localStorage.setItem('quiz_data', JSON.stringify(data));
        localStorage.removeItem('current_answers');
    };

    const getScore = () => {
        return questions.reduce((score, q, i) => (
            userAnswers[i] === q.answer ? score + 1 : score
        ), 0);
    };

    return (
        <div className="quiz-container">
            <h2>React Exam</h2>
            {questions.map((q, index) => (
                <div key={index} className="question-card">
                    <h4>{index + 1}. {q.question}</h4>
                    {q.options.map((opt, i) => {
                        const isCorrect = submitted && q.answer === opt;
                        const isWrong = submitted && userAnswers[index] === opt && q.answer !== opt;
                        return (
                            <label
                                key={i}
                                className={`option ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value={opt}
                                    disabled={submitted}
                                    checked={userAnswers[index] === opt}
                                    onChange={() => handleOptionChange(index, opt)}
                                />
                                {opt}
                            </label>
                        );
                    })}
                </div>
            ))}

            {!submitted ? (
                <button className="submit-btn" onClick={handleSubmit} disabled={Object.keys(userAnswers).length < questions.length}>
                    Submit
                </button>
            ) : (
                <div className="result">
                    You scored {getScore()} out of {questions.length}
                </div>
            )}
        </div>
    );
};

export default Quiz;
