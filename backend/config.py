# firebase_config.py
import firebase_admin
from firebase_admin import credentials, storage

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'your-bucket-id.appspot.com'
})

bucket = storage.bucket()
