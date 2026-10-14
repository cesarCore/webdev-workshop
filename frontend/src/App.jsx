import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5000/api/sessions'

// Reusable child component for rendering an individual study session card (Slide 13)
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

// Reusable form component for posting a new study session (Slides 11 & 13)
function SessionForm({ onAddSession }) {
  const [topic, setTopic] = useState('')
  const [host, setHost] = useState('')
  const [category, setCategory] = useState('Study Group')
  const [location, setLocation] = useState('')
  const [time, setTime] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!topic.trim() || !host.trim() || !location.trim()) return

    setSubmitting(true)
    await onAddSession({
      topic,
      host,
      category,
      location,
      time: time.trim() || 'Today',
    })
    setTopic('')
    setHost('')
    setLocation('')
    setTime('')
    setSubmitting(false)
  }

  return (
    <form className="session-form" onSubmit={handleSubmit}>
      <h2>Post a Study Session or Chapter Event</h2>
      <div className="form-row">
        <input
          type="text"
          placeholder="Course or Topic (e.g., Physics II Midterm Review)"
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
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Study Group">Study Group</option>
          <option value="Interview Prep">Interview Prep</option>
          <option value="Lab / Homework Help">Lab / Homework Help</option>
          <option value="SHPE Social / GBM">SHPE Social / GBM</option>
        </select>
      </div>
      <div className="form-row">
        <input
          type="text"
          placeholder="Location (e.g., Engineering Bldg Rm 210 or Discord)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Time (e.g., Thursday 5:00 PM)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Posting...' : '+ Post Study Session'}
      </button>
    </form>
  )
}

export default function App() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch initial study sessions from the Flask API on component mount (Slide 17)
  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch sessions from Flask server')
        return res.json()
      })
      .then((data) => {
        setSessions(data)
        setError(null)
      })
      .catch((err) => {
        console.error(err)
        setError('Could not connect to Flask API at http://localhost:5000. Make sure python app.py is running!')
      })
      .finally(() => setLoading(false))
  }, [])

  // Send a POST request to Flask API to save a new study session (Slide 17)
  const handleAddSession = async (newSession) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSession),
      })
      if (!response.ok) throw new Error('Failed to post study session')
      const createdSession = await response.json()
      setSessions((prev) => [...prev, createdSession])
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Failed to post study session. Check that your Flask backend is running on port 5000.')
    }
  }

  // Send a POST request to RSVP to an existing study session
  const handleRsvp = async (sessionId) => {
    try {
      const response = await fetch(`${API_URL}/${sessionId}/rsvp`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to RSVP')
      const updatedSession = await response.json()
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? updatedSession : s))
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="app-container">
      {/* Semantic Header (Slide 11) */}
      <header className="app-header">
        <div className="brand">
          <span className="shpe-badge">SHPE TECH COMMITTEE</span>
          <h1>Campus Study Session & Event Board</h1>
          <p>Find engineering study groups, post exam review sessions, and RSVP in real time</p>
        </div>
        <div className="stats-pill">
          <strong>{sessions.length}</strong> Active Sessions
        </div>
      </header>

      {/* Main Content Container (Slide 11) */}
      <main className="main-content">
        {error && <div className="error-banner">{error}</div>}

        <SessionForm onAddSession={handleAddSession} />

        <section className="board-section">
          <div className="section-heading">
            <h2>Upcoming Study Groups & Events</h2>
          </div>

          {loading ? (
            <p className="status-text">Loading sessions from Flask API...</p>
          ) : (
            <div className="cards-grid">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onRsvp={handleRsvp}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
