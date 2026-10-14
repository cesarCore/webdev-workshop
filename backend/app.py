from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) so React (port 5173) can call Flask (port 5000)
CORS(app)

# In-memory data store pre-populated with sample SHPE study sessions & events
sessions = [
    {
        "id": 1,
        "topic": "Calculus III & Differential Equations Exam Prep",
        "host": "Mateo Rivera",
        "category": "Study Group",
        "location": "Engineering Library Rm 302",
        "time": "Tonight, 6:30 PM",
        "attendees": 5
    },
    {
        "id": 2,
        "topic": "Data Structures & Algorithms Whiteboarding",
        "host": "Sofia Morales",
        "category": "Interview Prep",
        "location": "Student Union Tech Lounge",
        "time": "Tomorrow, 4:00 PM",
        "attendees": 8
    }
]


@app.route("/api/health", methods=["GET"])
def health_check():
    """Simple health endpoint to verify the Flask server is running."""
    return jsonify({"status": "ok", "message": "SHPE Study Board API is running!"}), 200


@app.route("/api/sessions", methods=["GET"])
def get_sessions():
    """GET /api/sessions - Returns the list of all active study sessions as JSON."""
    return jsonify(sessions), 200


@app.route("/api/sessions", methods=["POST"])
def create_session():
    """POST /api/sessions - Validates and stores a new study session submitted from React."""
    data = request.get_json()

    if not data or not data.get("topic") or not data.get("host") or not data.get("location"):
        return jsonify({"error": "Topic, host, and location are required."}), 400

    new_session = {
        "id": len(sessions) + 1,
        "topic": data["topic"].strip(),
        "host": data["host"].strip(),
        "category": data.get("category", "Study Group").strip(),
        "location": data["location"].strip(),
        "time": data.get("time", "TBD").strip(),
        "attendees": 1,
    }

    sessions.append(new_session)
    return jsonify(new_session), 201


@app.route("/api/sessions/<int:session_id>/rsvp", methods=["POST"])
def rsvp_session(session_id):
    """POST /api/sessions/<id>/rsvp - Increments the attendee count for a study session."""
    for session in sessions:
        if session["id"] == session_id:
            session["attendees"] += 1
            return jsonify(session), 200
    return jsonify({"error": "Session not found"}), 404


if __name__ == "__main__":
    print("Starting SHPE Study Session & Event Board API on http://localhost:5000 ...")
    app.run(host="0.0.0.0", port=5000, debug=True)
