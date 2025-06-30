import firebase_admin
from firebase_admin import credentials, storage

# Path to service account JSON
cred = credentials.Certificate("serviceAccountKey.json")

# Initialize app with your actual Firebase storage bucket
firebase_admin.initialize_app(cred, {
    'storageBucket': 'your-project-id.appspot.com'  # replace this
})

# Create bucket reference
bucket = storage.bucket()
