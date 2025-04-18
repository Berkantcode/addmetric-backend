from flask import Flask, Response
import json

app = Flask(__name__)

@app.route("/api/campaigns")
def get_campaigns():
    dummy_campaigns = [
        {
            "campaignName": "Marka Bilinirliği",
            "platform": "Google",
            "budget": 500,
            "spent": 480,
            "clicks": 1200,
            "roas": 2.8,
            "riskLevel": "medium",
            "headlineAdvice": None,
            "advice": "Ortalama ROAS. A/B testi önerilir."
        },
        {
            "campaignName": "Yeniden Pazarlama",
            "platform": "Google",
            "budget": 300,
            "spent": 290,
            "clicks": 850,
            "roas": 3.2,
            "riskLevel": "low",
            "headlineAdvice": None,
            "advice": "Performans iyi, bütçe artırılabilir."
        },
        {
            "campaignName": "Instagram Koleksiyon",
            "platform": "Meta",
            "budget": 400,
            "spent": 360,
            "clicks": 700,
            "roas": 2.1,
            "riskLevel": "high",
            "headlineAdvice": "Başlık düşük etkileşim alıyor, yeniden yazılmalı.",
            "advice": "ROAS düşük. Görsel ve başlık testi yapılmalı."
        }
    ]

    return Response(
        json.dumps(dummy_campaigns, ensure_ascii=False),
        mimetype='application/json'
    )

if __name__ == "__main__":
    app.run(port=5001, debug=True)
