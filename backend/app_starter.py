# ============================================================================
# SHPE Web Development Workshop — Back-End Starter Template (Slides 15-16)
# Instructions: Complete the # TODO sections below during the live demo!
# ============================================================================

from flask import Flask, request, jsonify
from flask_cors import CORS

# TODO 1 (Slide 15): Initialize the Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Starter in-memory data store for campus study sessions
sessions = [
    {
        "id": 1,
        "topic": "Calculus III & Differential Equations Exam Prep",
        "host": "Mateo Rivera",
        "category": "Study Group",
        "location": "Engineering Library Rm 302",
        "time": "Tonight, 6:30 PM",
        "attendees": 5
    }
]


# TODO 2 (Slide 16): Create a GET route at '/api/sessions' that returns all study sessions as JSON with status 200
@app.route("/api/sessions", methods=["GET"])
def get_sessions():
    return jsonify(sessions), 200


# TODO 3 (Slide 16): Create a POST route at '/api/sessions' that reads JSON from the request,
# appends a new session dictionary to `sessions`, and returns it with status 201
@app.route("/api/sessions", methods=["POST"])
def create_session():
    data = request.get_json()
    new_session = {
        "id": len(sessions) + 1,
        "topic": data.get("topic", "Untitled Session"),
        "host": data.get("host", "Anonymous"),
        "category": data.get("category", "Study Group"),
        "location": data.get("location", "Campus Library"),
        "time": data.get("time", "TBD"),
        "attendees": 1,
    }
    sessions.append(new_session)
    return jsonify(new_session), 201


# Bonus Endpoint: Increment RSVP count when a student clicks "Join Session"
@app.route("/api/sessions/<int:session_id>/rsvp", methods=["POST"])
def rsvp_session(session_id):
    for session in sessions:
        if session["id"] == session_id:
            session["attendees"] += 1
            return jsonify(session), 200
    return jsonify({"error": "Session not found"}), 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
