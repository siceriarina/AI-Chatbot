from flask import Flask, request, jsonify, send_from_directory
from openai import OpenAI
import os

app = Flask(__name__)

# Mengambil API key dari environment variable
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)


# ==============================
# HALAMAN UTAMA
# ==============================

@app.route("/")
def home():
    return send_from_directory(".", "index.html")


# ==============================
# FILE CSS
# ==============================

@app.route("/style.css")
def style():
    return send_from_directory(".", "style.css")


# ==============================
# FILE JAVASCRIPT
# ==============================

@app.route("/script.js")
def script():
    return send_from_directory(".", "script.js")


# ==============================
# CHAT DENGAN AI
# ==============================

@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    user_message = data.get("message", "")

    if not user_message:
        return jsonify({
            "error": "Pesan kosong."
        }), 400

    try:

        response = client.responses.create(
            model="gpt-5-mini",
            input=user_message
        )

        answer = response.output_text

        return jsonify({
            "reply": answer
        })

    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            "error": "Maaf, terjadi kesalahan pada AI."
        }), 500


# ==============================
# MENJALANKAN SERVER
# ==============================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
