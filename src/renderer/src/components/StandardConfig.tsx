import { useState } from 'react';


export const StandardConfig = ({ onApply }) => {
    const [sets, setSets] = useState(4);
    const [reps, setReps] = useState(8);
    const [weight, setWeight] = useState(50); // Add state for weight

    const incrementSets = () => setSets(prev => Math.min(prev + 1, 9));
    const decrementSets = () => setSets(prev => Math.max(1, prev - 1));
    const incrementReps = () => setReps(prev => Math.min(prev + 1, 30));
    const decrementReps = () => setReps(prev => Math.max(1, prev - 1));

    const startHorizontalSlide = (e) => {
        e.preventDefault();
        if (e.type === 'mousedown') {
            document.addEventListener('mousemove', handleHorizontalMouseMove);
            document.addEventListener('mouseup', handleHorizontalMouseUp);
        } else if (e.type === 'touchstart') {
            document.addEventListener('touchmove', handleHorizontalTouchMove);
            document.addEventListener('touchend', handleHorizontalTouchEnd);
        }
    };

    const handleHorizontalMove = (clientX) => {
        const slider = document.querySelector('.horizontal-weight-slider');
        if (slider) {
            const rect = slider.getBoundingClientRect();
            const newPosition = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
            const newWeight = Math.round((newPosition / 100) * 300);
            setWeight(newWeight);
        }
    };

    const handleHorizontalMouseMove = (e) => {
        handleHorizontalMove(e.clientX);
    };

    const handleHorizontalTouchMove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleHorizontalMove(touch.clientX);
    };

    const handleHorizontalMouseUp = () => {
        document.removeEventListener('mousemove', handleHorizontalMouseMove);
        document.removeEventListener('mouseup', handleHorizontalMouseUp);
    };

    const handleHorizontalTouchEnd = () => {
        document.removeEventListener('touchmove', handleHorizontalTouchMove);
        document.removeEventListener('touchend', handleHorizontalTouchEnd);
    };

    return (
        <div className="standard container">
            <div className="workout-config standard">
                <div className='standard weight'>
                    <h1 className="standard weight-text">Initial Weight</h1>
                    <div
                        className="horizontal-weight-slider"
                        onMouseDown={startHorizontalSlide}
                        onTouchStart={startHorizontalSlide}
                    >
                        <div
                            className="horizontal-gradient-fill"
                            style={{ width: `${(weight / 300) * 100}%` }}
                        >
                        </div>
                    </div>
                    <h1 className="standard pounds-text">{weight} lbs</h1>
                </div>

                <div className="standard SetsAndReps">
                    <div className='standard sets'>
                        <h1 className="standard sets-text">Sets</h1>
                        <div className="incrementor">
                            <button onClick={decrementSets}>-</button>
                            <span style={{ width: "60px", }}>{sets}</span>
                            <button onClick={incrementSets}>+</button>
                        </div>
                    </div>
                    <div className='standard reps'>
                        <h1 className="standard reps-text">Reps</h1>
                        <div className="incrementor">
                            <button onClick={decrementReps}>-</button>
                            <span style={{ width: "60px" }}>{reps}</span>
                            <button onClick={incrementReps}>+</button>
                        </div>
                    </div>
                </div>
            </div>
            <button className="config-close-button" onClick={() => {
                onApply(sets, reps, weight);
            }}>APPLY</button>
        </div>
    );
};