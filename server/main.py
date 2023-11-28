from flask import Flask, request, jsonify
from flask_cors import CORS
import rsa
from jwcrypto import jwk

app = Flask(__name__)
CORS(app)

# n = 0
# e = 0
# d = 0

public_key = 0
private_key = 0

@app.route("/publicKey")
def generateKeys():
  # (pubkey, privkey) = rsa.newkeys(512)
  # n = pubkey.n
  # e = pubkey.e
  # d = privkey.d
  # print(pubkey.n)
 
  # return jsonify({
  #   "publicKeyN": str(pubkey.n),
  #   "publicKeyE" : str(e)
  # })
  global public_key
  global private_key

  key = jwk.JWK.generate(kty='RSA', size=2048)
  public_key = key.export_public()
  private_key = key.export_private()

  return jsonify({
    "publicKey": public_key,
    "privateKey": private_key
  })

@app.route("/register", methods=["POST"])
def register():
  data = request.get_json()
  print(private_key)
  return jsonify(data), 201

if __name__ == "__main__":
  app.run(debug=True)