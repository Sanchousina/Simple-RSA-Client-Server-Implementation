from flask import Flask, request, jsonify
from flask_cors import CORS
import rsa


app = Flask(__name__)
CORS(app)

n = 0
e = 0
d = 0

@app.route("/publicKey")
def generateKeys():
  (pubkey, privkey) = rsa.newkeys(512)
  n = pubkey.n
  e = pubkey.e
  d = privkey.d
  print(pubkey.n)
 
  return jsonify({
    "publicKeyN": str(pubkey.n),
    "publicKeyE" : str(e)
  })

@app.route("/register", methods=["POST"])
def register():
  data = request.get_json()

  return jsonify(data), 201

if __name__ == "__main__":
  app.run(debug=True)