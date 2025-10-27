from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify

app = Flask(__name__, static_folder="static", template_folder="templates")
app.secret_key = "dev-secret"  # change for production

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        # demo-only authentication
        if username == "admin" and password == "password":
            # save username in session and send to welcome page
            session["username"] = username
            return redirect(url_for("welcome"))
        flash("Invalid credentials", "error")
        return redirect(url_for("login"))
    return render_template("login.html")

@app.route("/welcome")
def welcome():
    username = session.get("username")
    if not username:
        flash("Please sign in", "error")
        return redirect(url_for("login"))
    return render_template("welcome.html", username=username)

@app.route("/api/chat", methods=["POST"])
def api_chat():
    # require session (user signed in)
    if "username" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json() or {}
    message = (data.get("message") or "").strip()
    mode = (data.get("mode") or "local").lower()  # "local" or "ai"

    if not message:
        return jsonify({"reply": "I didn't catch that — please type something."})

    text = message.lower()

    # Local DB / rule-based mode (existing behavior)
    if mode == "local":
        if any(g in text for g in ("hi", "hello", "hey")):
            reply = f"Hello, {session.get('username')}! How can I help you?"
        elif "time" in text:
            import datetime
            reply = "Server time: " + datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
        elif "help" in text:
            reply = "Try asking for the 'time', say 'hello', or ask for 'help'. This is a demo."
        else:
            reply = "Sorry — I can only answer a few demo questions. Try 'hello' or 'time'."

    # AI mode (demo placeholder) — replace with real model/backend integration
    elif mode == "ai":
        # simple demo fallback for AI mode — echo with prefix (simulate AI reply)
        # In production, call your AI/model service here (with auth, rate limits, etc.)
        reply = f"(AI mode) I received: \"{message}\" — this is a demo AI response. Replace with real model integration."

    else:
        reply = "Unknown mode. Use 'local' or 'ai'."

    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)