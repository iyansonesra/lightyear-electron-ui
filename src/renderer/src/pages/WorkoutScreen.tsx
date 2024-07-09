import '../styles/WorkoutScreen.css'
import full_machine from '../assets/full_machine.png'
import bottom_machine from '../assets/bottom_machine.png'
import { IoSettingsOutline } from 'react-icons/io5'
import { useEffect, useState } from 'react'
import { IoMenuOutline, IoCloseOutline, IoLogOutOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useUser } from './UserContext'
import { RxPerson } from 'react-icons/rx'

export const WorkoutScreen = ({ setIsAuthorized, setIsGuestUser }) => {
  const CIRCLE_LENGTH1 = 400
  const R1 = CIRCLE_LENGTH1 / (2 * Math.PI)
  const CIRCLE_LENGTH2 = 450
  const R2 = CIRCLE_LENGTH2 / (2 * Math.PI)
  const [completion, setCompletion] = useState(0)
  const { firstName, lastName } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [numSets, setNumSets] = useState(4)
  const [numReps, setNumReps] = useState(8)
  const [workoutType, setWorkoutType] = useState('Standard')

  const StandardConfig = () => {
    const [sets, setSets] = useState(4) // Default value, adjust as needed
    const [reps, setReps] = useState(8) // Default value, adjust as needed

    const incrementSets = () => setSets((prev) => prev + 1)
    const decrementSets = () => setSets((prev) => Math.max(1, prev - 1))
    const incrementReps = () => setReps((prev) => prev + 1)
    const decrementReps = () => setReps((prev) => Math.max(1, prev - 1))

    return (
      <div className="workout-config standard">
        <div className="standard weight">
          <h1 className="standard weight-text">Initial Weight</h1>
          <div className="horizontal-weight-slider" onMouseDown={startHorizontalSlide}>
            <div
              className="horizontal-gradient-fill"
              style={{ width: `${horizontalSliderState.sliderPosition}%` }}
            ></div>
          </div>
          <h1 className="standard pounds-text">{horizontalSliderState.weight} lbs</h1>
        </div>

        <div className="standard SetsAndReps">
          <div className="standard sets">
            <h1 className="standard sets-text">Sets</h1>
            <div className="incrementor">
              <button onClick={decrementSets}>-</button>
              <span>{sets}</span>
              <button onClick={incrementSets}>+</button>
            </div>
          </div>
          <div className="standard reps">
            <h1 className="standard reps-text">Reps</h1>
            <div className="incrementor">
              <button onClick={decrementReps}>-</button>
              <span>{reps}</span>
              <button onClick={incrementReps}>+</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const LoadingEccentricConfig = () => (
    <div className="workout-config loading-eccentric">
      <h2>Loading Eccentric Configuration</h2>
      {/* Add specific inputs for Loading Eccentric workout */}
    </div>
  )

  const DropsetConfig = () => (
    <div className="workout-config dropset">
      <h2>Dropset Configuration</h2>
      {/* Add specific inputs for Dropset workout */}
    </div>
  )

  const navigate = useNavigate()

  const handleConfigureClick = (e) => {
    e.stopPropagation()
    setIsConfigOpen(true)
  }

  const closeConfig = () => {
    setIsConfigOpen(false)
  }

  const handleLogout = () => {
    setIsAuthorized(false)
    setIsGuestUser(false)
    navigate('/')
  }

  const incrementCompletion = () => {
    setCompletion((prev) => (prev == 1 ? 0 : Math.min(1, prev + 0.33)))
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const [sliderState, setSliderState] = useState({
    weight: 50,
    sliderPosition: (50 / 300) * 300
  })

  const [heightState, setheightState] = useState({
    height: 5,
    heightPosition: (5 / 10) * 10
  })

  const handleMouseDown = () => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseDownHeight = () => {
    document.addEventListener('mousemove', handleMouseMoveHeight)
    document.addEventListener('mouseup', handleMouseUpHeight)
  }

  const handleMouseMove = (e) => {
    const slider = document.querySelector('.weight-slider')
    if (slider) {
      const rect = slider.getBoundingClientRect()
      const newPosition = Math.max(
        0,
        Math.min(100, ((rect.bottom - e.clientY) / rect.height) * 100)
      )

      setSliderState({
        weight: Math.round((newPosition / 100) * 300),
        sliderPosition: newPosition
      })
    } else {
      console.error('Slider element not found.')
    }
  }

  const handleMouseMoveHeight = (e) => {
    const slider = document.querySelector('.inches-slider')
    if (slider) {
      const rect = slider.getBoundingClientRect()
      const newPosition = Math.max(
        0,
        Math.min(100, ((rect.bottom - e.clientY) / rect.height) * 100)
      )

      setheightState({
        height: Math.round((newPosition / 100) * 10),
        heightPosition: newPosition
      })
    } else {
      console.error('Slider element not found.')
    }
  }

  const startHorizontalSlide = () => {
    document.addEventListener('mousemove', updateHorizontalSlider)
    document.addEventListener('mouseup', endHorizontalSlide)
  }

  const [horizontalSliderState, setHorizontalSliderState] = useState({
    weight: 50,
    sliderPosition: (54 / 300) * 300
  })

  const updateHorizontalSlider = (e) => {
    const slider = document.querySelector('.horizontal-weight-slider')
    if (slider) {
      const rect = slider.getBoundingClientRect()
      const newPosition = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))

      setHorizontalSliderState({
        weight: Math.round((newPosition / 100) * 300),
        sliderPosition: newPosition
      })
    } else {
      console.error('Horizontal slider element not found.')
    }
  }

  const endHorizontalSlide = () => {
    document.removeEventListener('mousemove', updateHorizontalSlider)
    document.removeEventListener('mouseup', endHorizontalSlide)
  }

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const handleMouseUpHeight = () => {
    document.removeEventListener('mousemove', handleMouseMoveHeight)
    document.removeEventListener('mouseup', handleMouseUpHeight)
  }

  const DateTime = () => {
    const [date, setDate] = useState(new Date())

    useEffect(() => {
      const timer = setInterval(() => {
        const now = new Date()
        now.setSeconds(0, 0)
        setDate(now)
      }, 1000)

      const initialDate = new Date()
      initialDate.setSeconds(0, 0)
      setDate(initialDate)

      return () => clearInterval(timer)
    }, [])

    return (
      <div className="time">
        <p>{date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
      </div>
    )
  }

  return (
    <div className="root">
      <div className="header">
        <IoMenuOutline size={30} className="menu-icon" onClick={toggleMenu} />
        <h1 className="header-text">PREACHER CURL</h1>
        <div className="right-header">
          <DateTime></DateTime>
          <IoSettingsOutline size={30} className="settings-icon" />
        </div>
      </div>

      <div className={`menu-bar ${isMenuOpen ? 'open' : ''}`}>
        <div className="close-circle">
          <IoCloseOutline size={26} className="close-icon" color="white" onClick={toggleMenu} />
        </div>
        <div className="user-info">
          <RxPerson size={40} className="user-icon" />
          <h1>
            {firstName} {lastName}
          </h1>
        </div>
        <div className="logoutArea" onClick={handleLogout}>
          <h1 className="logout-text">LOGOUT</h1>
          <IoLogOutOutline size={30} className="logout-icon" />
        </div>
      </div>

      <div className="workout-container">
        <div className="currWorkout">
          <div className="workout-rectangle">
            <h1 className="workout-text">CURRENT WORKOUT</h1>

            <div className="stats-circle-container">
              <div className="sets-circle-container">
                <h1 className="sets-text">SETS</h1>
                <h1 className="setNumber">
                  1<h1 className="setNumberSmaller">/{numSets}</h1>
                </h1>
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <defs>
                    <linearGradient id="circleGradient" x1="100%" y1="150%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#fff" />
                      <stop offset="100%" stopColor="#000" />
                    </linearGradient>
                  </defs>
                  <circle
                    className="circle"
                    cx={R1 + 10}
                    cy={R1 + 10}
                    r={R1}
                    stroke="#E3DDDD"
                    strokeWidth={20}
                    fill="none"
                  />
                  <circle
                    className="circle"
                    cx={R1 + 10}
                    cy={R1 + 10}
                    r={R2 - 8}
                    stroke="url(#circleGradient)"
                    strokeWidth={10}
                    fill="none"
                    strokeDasharray={CIRCLE_LENGTH2}
                    strokeDashoffset={CIRCLE_LENGTH2 * (1 - completion)}
                  />
                </svg>
              </div>

              <div className="reps-circle-container">
                <h1 className="reps-text">REPS</h1>
                <h1 className="setNumber">
                  1<h1 className="setNumberSmaller">/{numReps}</h1>
                </h1>
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <defs>
                    <linearGradient id="circleGradient" x1="100%" y1="150%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#fff" />
                      <stop offset="100%" stopColor="#000" />
                    </linearGradient>
                  </defs>
                  <circle
                    className="circle"
                    cx={R1 + 10}
                    cy={R1 + 10}
                    r={R1}
                    stroke="#E3DDDD"
                    strokeWidth={20}
                    fill="none"
                  />
                  <circle
                    className="circle"
                    cx={R1 + 10}
                    cy={R1 + 10}
                    r={R2 - 8}
                    stroke="url(#circleGradient)"
                    strokeWidth={10}
                    fill="none"
                    strokeDasharray={CIRCLE_LENGTH2}
                    strokeDashoffset={CIRCLE_LENGTH2 * (1 - completion)}
                  />
                </svg>
              </div>
            </div>

            <button className="configure-button" onClick={handleConfigureClick}>
              CONFIGURE
            </button>

            <button onClick={incrementCompletion} className="increment-button">
              Increment Completion
            </button>
          </div>
        </div>

        <div className="model">
          <img src={full_machine} alt="full_machine" className="full-machine" />
          <img src={bottom_machine} alt="full_machine" className="bottom-machine" />
        </div>

        <div className="sliders">
          <div className="weight-slider-container">
            <h1 className="weight-text">WEIGHT</h1>
            <h1 className="pounds-text">{sliderState.weight} lbs</h1>
            <div className="weight-slider" onMouseDown={handleMouseDown}>
              <div
                className="gradient-fill"
                style={{ height: `${sliderState.sliderPosition}%` }}
              ></div>
            </div>
          </div>

          <div className="height-slider-container">
            <h1 className="height-text">HEIGHT</h1>
            <h1 className="inches-text">{heightState.height}"</h1>
            <div className="inches-slider" onMouseDown={handleMouseDownHeight}>
              <div
                className="height-gradient-fill"
                style={{ height: `${heightState.heightPosition}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className={`overlay ${isConfigOpen ? 'active' : ''}`} onClick={closeConfig}></div>
      <div className={`config-screen ${isConfigOpen ? 'open' : ''}`}>
        <h1 className="header-text">WORKOUT CONFIGURATION</h1>
        <div className="workout-type-selector">
          <div
            className={`option ${workoutType === 'Standard' ? 'selected' : ''}`}
            onClick={() => setWorkoutType('Standard')}
          >
            Standard
          </div>
          <div
            className={`option ${workoutType === 'Loading Eccentric' ? 'selected' : ''}`}
            onClick={() => setWorkoutType('Loading Eccentric')}
          >
            Loading Eccentric
          </div>
          <div
            className={`option ${workoutType === 'Dropset' ? 'selected' : ''}`}
            onClick={() => setWorkoutType('Dropset')}
          >
            Dropset
          </div>
          <div className="selector"></div>
        </div>

        {workoutType === 'Standard' && <StandardConfig />}
        {workoutType === 'Loading Eccentric' && <LoadingEccentricConfig />}
        {workoutType === 'Dropset' && <DropsetConfig />}
        <button className="config-close-button" onClick={closeConfig}>
          APPLY
        </button>
      </div>
    </div>
  )
}
