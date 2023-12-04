from flask import Flask, request, jsonify
from flask_cors import CORS
import rsa
from jwcrypto import jwk
import base64
import json
from Crypto.Util.number import long_to_bytes, bytes_to_long


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

public_key = 0
private_key = 0
n_decoded = 0
d_decoded = 0
client_public_key = 0
client_n_decoded = 0
client_e_decoded = 0

@app.route("/publicKey")
def generateKeys():
  global public_key
  global private_key
  global n_decoded
  global d_decoded

  key = jwk.JWK.generate(kty='RSA', size=2048)
  public_key = key.export_public()
  private_key = json.loads(key.export_private())

  n_decoded = decode_keys(private_key['n'])
  d_decoded = decode_keys(private_key['d'])

  return jsonify({
    "publicKey": public_key
  })

@app.route("/register", methods=["POST"])
def register():
  data = request.get_json()

  client_public_key = data['clientPublicKey']
  decrypted_name = decrypt_message(data['name'])
  decrypted_password = decrypt_message(data['password'])
  print('Client Public Key: ', client_public_key)
  print('Decrypted name, password: ', decrypted_name, decrypted_password)

  return jsonify({"name": decrypted_name}), 201

def decrypt_message(msg):

  decrypted_message_bytes = [
    long_to_bytes(pow(int(value), d_decoded, n_decoded))
    for value in msg
  ]

  try:
    decrypted_message = b''.join(decrypted_message_bytes)
    decrypted_text = decrypted_message.decode('utf-8')
  except UnicodeDecodeError as e:
    print("Decoding as UTF-8 failed:", e)

  return decrypted_text

def decode_keys(key):
  key_decoded = int.from_bytes(base64.urlsafe_b64decode(key + '=='), byteorder='big')
  return key_decoded

if __name__ == "__main__":
  app.run(debug=True)