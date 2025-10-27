# chatbot_project_WMStore — my-flask-app

Minimal Flask example app that serves a "Hello, World!" page at `/` and a demo login page at `/login`. This workspace runs inside a dev container (Ubuntu 24.04.2 LTS).

## Project layout
```
my-flask-app/
├── app.py                 # Flask application (routes)
├── run.py                 # entrypoint to run the app
├── requirements.txt
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
└── templates/
    ├── base.html
    ├── index.html         # "Hello, World!" page served at /
    └── login.html         # demo login page served at /login
```

## Prerequisites
- Linux dev container: Ubuntu 24.04.2 LTS
- Python 3 (system `python3`)
- A POSIX shell (bash)
- Tools available in the container: apt, git, curl, wget, etc.

## Setup (local dev)
Run these commands from the workspace root:
```bash
cd /workspaces/chatbot_project_WMStore/my-flask-app
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Run (development)
Start the app with:
```bash
python run.py
```
Open in the host browser:
```bash
"$BROWSER" http://localhost:5000
```

## Run with gunicorn (production-like)
From the same directory:
```bash
# serve the Flask app defined in app.py as `app`
gunicorn -w 4 app:app -b 0.0.0.0:8000
"$BROWSER" http://localhost:8000
```

## Routes
- `/` — index page rendering `templates/index.html` (Hello, World!)
- `/login` — GET renders `templates/login.html`, POST accepts demo credentials

Demo login credentials (demo only — do NOT use in production):
- username: `admin`
- password: `password`

## Static & Templates
- Templates are in `my-flask-app/templates/` and extend `base.html`.
- Static assets (CSS/JS) are in `my-flask-app/static/` and referenced with `url_for('static', filename=...)`.

## Dependencies
See `my-flask-app/requirements.txt`. Core packages included:
- Flask>=2.2
- Jinja2, Werkzeug, itsdangerous, click
- gunicorn (optional for production)

## Tests
No tests included by default. To add tests:
- create a `tests/` directory
- add pytest-based test files and install `pytest` in `requirements-dev.txt`
- run `pytest` from the workspace root

## Notes & security
- The secret key and demo auth are for development only. Replace `app.secret_key` and implement proper authentication before deploying.
- Validate and sanitize inputs for any real application.

## License
Add a license file as appropriate for your project.