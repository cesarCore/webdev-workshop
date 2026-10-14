// ============================================================================
// SHPE Web Development Workshop — Front-End Starter Template (Slides 11, 13, 17)
// Instructions: Follow the // TODO comments during the live workshop demo!
// ============================================================================

import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5000/api/sessions'

// TODO 1 (Slide 13): Build the SessionCard component to display session.topic,
// session.location, session.time, session.host, and an RSVP button
function SessionCard({ session, onRsvp }) {
  return (
    <article className="session-card">
      <div className="card-header">
        <span className="category-badge">{session.category || 'Study Group'}</span>
        <span className="session-time">{session.time}</span>
      </div>
      <h3>{session.topic}</h3>
      <p className="session-location">Location: <strong>{session.location}</strong></p>
      <div className="card-footer">
        <span className="session-host">Hosted by <strong>{session.host}</strong></span>
        <button className="rsvp-btn" onClick={() => onRsvp(session.id)}>
          Join ({session.attendees} Going)
        </button>
      </div>
    </article>
  )
}

export default function App() {
  // TODO 2 (Slide 13): Create state variables for the sessions list and form inputs
  const [sessions, setSessions] = useState([])
  const [topic, setTopic] = useState('')
  const [host, setHost] = useState('')
  const [location, setLocation] = useState('')
  const [time, setTime] = useState('')

  // TODO 3 (Slide 17): Fetch existing study sessions from Flask when the component loads
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setSessions(data))
      .catch((err) => console.error('API Error:', err))
  }, [])

  // TODO 4 (Slide 17): Send a POST request with fetch() when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newSession = { topic, host, category: 'Study Group', location, time }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSession),
    })
    const createdSession = await response.json()
    setSessions([...sessions, createdSession])
    setTopic('')
    setHost('')
    setLocation('')
    setTime('')
  }

  const handleRsvp = async (sessionId) => {
    const response = await fetch(`${API_URL}/${sessionId}/rsvp`, { method: 'POST' })
    const updatedSession = await response.json()
    setSessions(sessions.map((s) => (s.id === sessionId ? updatedSession : s)))
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">
          <span className="shpe-badge">SHPE TECH COMMITTEE</span>
          <h1>Campus Study Session & Event Board</h1>
        </div>
      </header>

      <main className="main-content">
        <form className="session-form" onSubmit={handleSubmit}>
          <h2>Post a Study Session</h2>
          <div className="form-row">
            <input
              type="text"
              placeholder="Course or Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Your Name"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Location (e.g., Engineering Library Rm 302)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Time (e.g., Tonight 6:30 PM)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <button type="submit">+ Post Study Session</button>
        </form>

        <section className="cards-grid">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} onRsvp={handleRsvp} />
          ))}
        </section>
      </main>
    </div>
  )
}
