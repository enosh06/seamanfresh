import urllib.request
req = urllib.request.Request("https://enosh642006.pythonanywhere.com/api/", headers={"Origin": "https://seaman-fresh-client.netlify.app"})
try:
    with urllib.request.urlopen(req) as res:
        print("Status:", res.status)
        print("CORS Headers:", {k:v for k,v in res.headers.items() if 'access-control' in k.lower()})
except Exception as e:
    print("Error:", e)
