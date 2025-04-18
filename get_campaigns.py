import requests

API_VERSION = "v18.0"
AD_ACCOUNT_ID = "3068405196581563"
ACCESS_TOKEN = "EACL7DsZC31uQBO5hRNnzaFZCZAZBjVHZAw4eCnVe0Uc4ssug2XE75hFXcruAmXOiQxOdhIG8jcFnNem5gYAnjvGk6IHjta9i9AdZCREJEYfdKuci0de1YckXDgCTMoUP1fPBUWPpgZB5OAu9yAeS3ybZC5I1cxcrZCfJiuUIHlIW0iLoz2Dx2uTIzZC7pIZC8cwHYtN7bhVAXWhsZC8H0EH3"

url = f"https://graph.facebook.com/{API_VERSION}/act_{AD_ACCOUNT_ID}/campaigns"
params = {
    "access_token": ACCESS_TOKEN,
    "fields": "name,status,daily_budget,effective_status"
}

response = requests.get(url, params=params)
data = response.json()

print("=== Kampanyalar ===")
for campaign in data.get("data", []):
    print(f"- {campaign['name']} | Durum: {campaign['status']} | Bütçe: {campaign.get('daily_budget')}")
