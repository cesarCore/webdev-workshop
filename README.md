# SHPE Study Session & Event Board — Full-Stack Web Development Workshop

Welcome to the **SHPE Tech Committee Intro to Web Development Workshop**! In this session, you will set up a local full-stack development environment and build the **SHPE Study Session & Event Board** — a live campus coordination web app where students can post study groups, find exam prep sessions, and RSVP in real time using a **React (HTML5/CSS3/JS)** front-end and a **Python Flask** REST API back-end.

## Architecture Overview

| Layer | Technology | Local URL | Role |
| :--- | :--- | :--- | :--- |
| **Front-End (Client)** | HTML5, CSS3, React 18, Vite | `http://localhost:5173` | Renders the live study session board, captures form inputs, and communicates with the server via `fetch()` |
| **Back-End (Server)** | Python 3, Flask, Flask-CORS | `http://localhost:5000` | Exposes RESTful `GET` and `POST` endpoints at `/api/sessions` and manages session & RSVP data |

## Repository Structure

```text
webdev-workshop/
├── README.md                  # Workshop setup & live-coding guide
├── .gitignore                 # Ignored build, virtualenv, and dependency folders
├── backend/
│   ├── app.py                 # Complete working Flask REST API server
│   ├── app_starter.py         # Live-coding starter template with guided # TODOs
│   └── requirements.txt       # Python dependencies (flask, flask-cors)
└── frontend/
    ├── index.html             # Root HTML5 shell
    ├── package.json           # Node.js dependencies & scripts
    ├── vite.config.js         # Vite dev server configuration (Port 5173)
    └── src/
        ├── main.jsx           # React application entry point
        ├── App.jsx            # Complete working React front-end component
        ├── App_starter.jsx    # Live-coding starter template with guided // TODOs
        └── App.css            # Responsive CSS3 layout (Variables, Flexbox, CSS Grid)
```

## Part 1: Environment Setup (20 Minutes)

### Prerequisites
Make sure you have the following installed on your machine:
1. **Git**: Verify with `git --version`
2. **Node.js (v18+) & npm**: Verify with `node -v` and `npm -v`
3. **Python (v3.10+) & pip**: Verify with `python3 --version` (macOS/Linux) or `python --version` (Windows)
4. **VS Code**: Recommended extensions: *ES7+ React/Redux/React-Native snippets*, *Python*, and *Prettier*

### Step 1: Clone the Repository
Open your terminal (or Git Bash on Windows) and run:

```bash
git clone https://github.com/YOUR_ORG_OR_USERNAME/webdev-workshop.git
cd webdev-workshop
```

### Step 2: Start the Back-End Server (Terminal 1)
Open a terminal inside VS Code (`Ctrl + \`` or `Cmd + \``) and configure the Python Flask server:

**macOS / Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```

**Windows (PowerShell / Command Prompt):**
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Once running, visit `http://localhost:5000/api/sessions` in your browser. You should see a JSON list of active SHPE study sessions and events.

### Step 3: Start the Front-End Server (Terminal 2)
Open a **second terminal tab** in VS Code (`+` icon in the terminal panel) and launch the React development server:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser to view the live **SHPE Study Session & Event Board**!

## Part 2: Live-Coding Mode (Optional Starter Templates)

By default, `backend/app.py` and `frontend/src/App.jsx` contain the complete working code so you can verify your setup immediately.

If you want to code along from scratch during the workshop demo:
1. **Back-End Live Coding**: Copy the contents of `backend/app_starter.py` into `backend/app.py` and follow the `# TODO` prompts (Slides 15–16).
2. **Front-End Live Coding**: Copy the contents of `frontend/src/App_starter.jsx` into `frontend/src/App.jsx` and follow the `// TODO` prompts (Slides 11–13 & 17).

## Troubleshooting Common Setup Issues

| Issue | Cause | Fix |
| :--- | :--- | :--- |
| **`Port 5000 is already in use` (macOS)** | macOS AirPlay Receiver uses port 5000 by default | Disable AirPlay Receiver in *System Settings > General > AirDrop & Handoff*, or change `port=5000` in `app.py` |
| **PowerShell `Activate.ps1 cannot be loaded`** | Windows script execution policy restriction | Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in PowerShell, then re-run `venv\Scripts\activate` |
| **`CORS policy: No 'Access-Control-Allow-Origin'`** | `flask-cors` is missing or not initialized | Ensure `pip install flask-cors` succeeded and `CORS(app)` is called in `backend/app.py` |
| **`Failed to fetch` in browser console** | Back-end Flask server is not running | Check Terminal 1 and make sure `python app.py` is actively running on `http://localhost:5000` |
