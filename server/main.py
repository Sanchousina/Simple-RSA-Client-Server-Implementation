from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
  return jsonify({'data': 'Home'})

@app.route("/register", methods=["POST"])
def register():
  data = request.get_json()

  return jsonify(data), 201

if __name__ == "__main__":
  app.run(debug=True)