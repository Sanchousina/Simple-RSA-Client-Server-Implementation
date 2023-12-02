import base64
import json

def rsa_decrypt(ciphertext, private_key):
    n, d = private_key
    plaintext = pow(ciphertext, d, n)
    return plaintext

# Test case 1
n_base64url = "ytCqfv1KkmlxsgI6uwsEfmc4n0rGRSoU2x_n_cloOJrX1-l8his4ObuJtgLQjK6b8lfN2wtBpnxwdRVgbXPwz3usriaHnOrC7pei_Bh-iM6wj_a09jsM55pbisijO_xSeBdhUhPtPnRAuaGiyxvBLfT91DILWctL_eDLNs-nC5TZoWIY-mUXBbDIoD7PG7c1xEwBPHAPXmpgyS76AS8sZOTGxA3jaRc1npYKdMYUFjjiDMmA1Ykrhc1ZlNe73Kyq4o9FidTFobLrjRnoJNmVprdiqOC4ecwc0SFSCh-AP8sAXYWOpevsfn6F-PHQVvZsje9jJwEJcWqnbjXVNbnTnQ"
d_base64url = "MGHK6nReH8NLvh1OCWS9c7IIDef2mHVLeGKKIz6ywB4gM3-dlxwkU5FrbqIJQiY9SXiswP5UcPTqluO8lx-7aKOmM_05CLPwQJ6n4N-u_8_eytkdnkfD8lQeVmM6nYq52bAqJTxfsjBlaGMoxK8gTGhPTRmLH6ahwDSqBa9PuDEjZSuVbS2jVY8lh0ZAVsyMIqaCpUpInGMoR0aSS0wxR6C_tYOTWmPSbEkGmsY2xgpjZPgqf_csnspfgupsFwX9SEUtaCJWkOQYyLwxQKJGXKRivjkaHqLxYtCVGdM6xR9yDVNok6iEvhgXhigD-wdl0kejg8knmcWjmaihN-q2wQ"
ciphertext1 = 123456789
expected_result1 = rsa_decrypt(ciphertext1, (int.from_bytes(base64.urlsafe_b64decode(n_base64url + '=='), byteorder='big'),
                                              int.from_bytes(base64.urlsafe_b64decode(d_base64url + '=='), byteorder='big')))
print("Test Case 1:")
print("Ciphertext:", ciphertext1)
print("Expected Decryption:", expected_result1)

def bytes_to_int(byte_array):
    # Convert bytes to integer
    return int.from_bytes(byte_array, byteorder='big')

def json_to_bytes(json_str):
    # Parse the JSON and extract the byte values
    data = json.loads(json_str)
    byte_values = [data["name"][str(i)] for i in range(len(data["name"]))]

    # Convert string representations of byte values to actual bytes
    encrypted_bytes = bytes(byte_values)

    return encrypted_bytes

# Example JSON string
json_str = '{"name": {"0": 78, "1": 120, "2": 63, "3": 115, "4": 11}}'

# Convert JSON to bytes
encrypted_bytes = json_to_bytes(json_str)

# Convert bytes to integer
ciphertext = bytes_to_int(encrypted_bytes)

# Decrypt using the private key
plaintext = rsa_decrypt(ciphertext, (int.from_bytes(base64.urlsafe_b64decode(n_base64url + '=='), byteorder='big'),
                                              int.from_bytes(base64.urlsafe_b64decode(d_base64url + '=='), byteorder='big')))

print("Decrypted plaintext:", plaintext)