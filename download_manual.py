
# Manual download script via python to be safer
import urllib.request
import os

images = {
    "images/image_31.jpg": "https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=600&auto=format&fit=crop",
    "images/image_32.jpg": "https://images.unsplash.com/photo-1517344884509-a0c97ec81cc6?q=80&w=600&auto=format&fit=crop",
    "images/image_33.jpg": "https://images.unsplash.com/photo-1554284126-db63354813dd?q=80&w=600&auto=format&fit=crop",
    "images/image_34.jpg": "https://images.unsplash.com/photo-1517963879466-e825c15f99a5?q=80&w=600&auto=format&fit=crop",
    "images/image_35.jpg": "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=600&auto=format&fit=crop"
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for path, url in images.items():
    if not os.path.exists(path):
        print(f"Downloading {path}...")
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
                out_file.write(response.read())
        except Exception as e:
            print(f"Failed {path}: {e}")
