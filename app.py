from flask import Flask, request, jsonify, Response, redirect
from flask_cors import CORS
import json
import os
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta

from google.oauth2 import service_account
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import RunReportRequest, DateRange, Dimension, Metric

# .env dosyasını yükle
load_dotenv()

# Flask Setup
app = Flask(__name__)
CORS(app)

# GA4 Ayarları
KEY_PATH = "addmetric-456612-20b7e1419d08.json"
PROPERTY_ID = "360586867"
credentials = service_account.Credentials.from_service_account_file(KEY_PATH)
client = BetaAnalyticsDataClient(credentials=credentials)

# Facebook API Ayarları
FB_APP_ID = os.getenv("FB_APP_ID")
FB_APP_SECRET = os.getenv("FB_APP_SECRET")
FB_REDIRECT_URI = os.getenv("FB_REDIRECT_URI")

# ---------------- FACEBOOK AUTH ----------------
@app.route("/")
def home():
    return '<a href="/facebook/login">Facebook ile Giriş Yap</a>'

@app.route("/facebook/login")
def facebook_login():
    fb_oauth_url = (
        f"https://www.facebook.com/v19.0/dialog/oauth?client_id={FB_APP_ID}"
        f"&redirect_uri={FB_REDIRECT_URI}"
        "&scope=ads_read"
    )
    return redirect(fb_oauth_url)

@app.route("/facebook/callback")
def facebook_callback():
    code = request.args.get("code")
    if not code:
        return "Facebook yetkilendirme hatası", 400

    token_url = "https://graph.facebook.com/v19.0/oauth/access_token"
    params = {
        "client_id": FB_APP_ID,
        "redirect_uri": FB_REDIRECT_URI,
        "client_secret": FB_APP_SECRET,
        "code": code
    }

    response = requests.get(token_url, params=params)
    data = response.json()
    access_token = data.get("access_token")

    if not access_token:
        return f"Token alınamadı: {data}", 400

    return redirect(f"/facebook/adaccounts?access_token={access_token}")

@app.route("/facebook/adaccounts")
def facebook_ad_accounts():
    access_token = request.args.get("access_token")
    if not access_token:
        return jsonify({"error": "access_token eksik"}), 400

    ad_accounts_url = "https://graph.facebook.com/v19.0/me/adaccounts"
    ad_response = requests.get(ad_accounts_url, params={"access_token": access_token})
    return jsonify(ad_response.json())

@app.route("/facebook/campaigns")
def facebook_campaigns():
    access_token = request.args.get("access_token")
    ad_account_id = request.args.get("ad_account_id")

    if not access_token or not ad_account_id:
        return jsonify({"error": "access_token ve ad_account_id gereklidir"}), 400

    url = f"https://graph.facebook.com/v19.0/{ad_account_id}/campaigns"
    params = {
        "access_token": access_token,
        "fields": "id,name,status,objective,start_time,stop_time"
    }

    response = requests.get(url, params=params)
    return jsonify(response.json())


# ---------------- KAMPANYA ANALİZİ ----------------
@app.route('/api/analyze-campaigns', methods=['GET', 'POST'])
def analyze_campaigns():
    campaigns = [
        {'campaignName': 'Marka Ürünleri', 'roas': 2.9, 'ctr': 1.5, 'platform': 'Google'},
        {'campaignName': 'Yeni Koleksiyon', 'roas': 3.4, 'ctr': 2.2, 'platform': 'Google'},
        {'campaignName': 'Sepeti Terk Edenler', 'roas': 2.1, 'ctr': 0.9, 'platform': 'Meta'},
        {'campaignName': 'Retargeting 7 Gün', 'roas': 2.7, 'ctr': 1.4, 'platform': 'Meta'},
        {'campaignName': 'Video Reklam Koleksiyon', 'roas': 3.2, 'ctr': 2.1, 'platform': 'Meta'},
    ]

    suggestions = []
    for c in campaigns:
        risk_level = 'low'
        if c['roas'] < 2.5 or c['ctr'] < 1:
            risk_level = 'high'
        elif c['roas'] < 3.0:
            risk_level = 'medium'

        advice = (
            f"{c['campaignName']} ROAS düşük. Metin ve hedefleme gözden geçirilmeli."
            if risk_level == 'high'
            else f"{c['campaignName']} ROAS iyi. Bütçe artırılabilir."
        )

        headline_advice = (
            "Başlık ilgi çekici değil, tıklama oranı artırmak için güncellenmeli."
            if c['ctr'] < 1.5 else ""
        )

        suggestions.append({
            'campaignName': c['campaignName'],
            'platform': c['platform'],
            'roas': c['roas'],
            'ctr': c['ctr'],
            'riskLevel': risk_level,
            'advice': advice,
            'headlineAdvice': headline_advice
        })

    return Response(json.dumps(suggestions, ensure_ascii=False), mimetype='application/json')


# ---------------- SAYFA GÖRÜNTÜLEMELER ----------------
@app.route('/api/analytics/pageviews', methods=['GET'])
def get_page_views():
    request_data = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="pagePath")],
        metrics=[Metric(name="screenPageViews")],
        date_ranges=[DateRange(start_date="7daysAgo", end_date="today")]
    )
    response = client.run_report(request_data)
    results = [
        {"path": row.dimension_values[0].value, "views": row.metric_values[0].value}
        for row in response.rows
    ]
    return Response(json.dumps(results, ensure_ascii=False), mimetype='application/json')


# ---------------- FUNNEL VERİSİ ----------------
def get_funnel_data(start, end):
    request_data = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="eventName")],
        metrics=[Metric(name="activeUsers")],
        date_ranges=[DateRange(start_date=start, end_date=end)]
    )
    response = client.run_report(request_data)

    data = {"farkindalik": 0, "dusunce": 0, "satin_alma": 0}
    for row in response.rows:
        event = row.dimension_values[0].value
        count = int(row.metric_values[0].value)
        if event in ["session_start", "page_view"]:
            data["farkindalik"] += count
        elif event in ["view_item", "add_to_cart"]:
            data["dusunce"] += count
        elif event == "purchase":
            data["satin_alma"] += count
    return data

@app.route('/api/analytics/funnel', methods=['GET'])
def funnel_analizi():
    start = request.args.get("start", "7daysAgo")
    end = request.args.get("end", "today")
    return jsonify(get_funnel_data(start, end))

@app.route('/api/analytics/funnel-comparison', methods=['GET'])
def funnel_comparison():
    start = request.args.get("start")
    end = request.args.get("end")
    if not start or not end:
        return jsonify({"error": "start and end required"}), 400

    start_dt = datetime.strptime(start, "%Y-%m-%d")
    end_dt = datetime.strptime(end, "%Y-%m-%d")
    delta = end_dt - start_dt

    prev_start = (start_dt - delta).strftime("%Y-%m-%d")
    prev_end = (start_dt - timedelta(days=1)).strftime("%Y-%m-%d")

    current = get_funnel_data(start, end)
    previous = get_funnel_data(prev_start, prev_end)

    return jsonify({
        "current": current,
        "previous": previous,
        "period": {
            "current": {"start": start, "end": end},
            "previous": {"start": prev_start, "end": prev_end}
        }
    })


# ---------------- METRİKLER ----------------
@app.route('/api/analytics/metrics', methods=['GET'])
def diger_metrikler():
    start = request.args.get("start", "7daysAgo")
    end = request.args.get("end", "today")

    country_req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="country")],
        metrics=[Metric(name="activeUsers")],
        date_ranges=[DateRange(start_date=start, end_date=end)]
    )
    country_res = client.run_report(country_req)
    ulke_dagilimi = [
        {"ulke": row.dimension_values[0].value, "kullanici": int(row.metric_values[0].value)}
        for row in country_res.rows
    ]

    device_req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="deviceCategory")],
        metrics=[Metric(name="activeUsers")],
        date_ranges=[DateRange(start_date=start, end_date=end)]
    )
    device_res = client.run_report(device_req)
    cihaz_dagilimi = [
        {"cihaz": row.dimension_values[0].value, "kullanici": int(row.metric_values[0].value)}
        for row in device_res.rows
    ]

    summary_req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        metrics=[
            Metric(name="averageSessionDuration"),
            Metric(name="sessions"),
            Metric(name="totalUsers")
        ],
        date_ranges=[DateRange(start_date=start, end_date=end)]
    )
    summary_res = client.run_report(summary_req)
    ortalama_sure = float(summary_res.rows[0].metric_values[0].value)
    oturum_sayisi = int(summary_res.rows[0].metric_values[1].value)
    kullanici_sayisi = int(summary_res.rows[0].metric_values[2].value)

    return jsonify({
        "ülke_dagilimi": ulke_dagilimi,
        "cihaz_dagilimi": cihaz_dagilimi,
        "ortalama_sure": ortalama_sure,
        "oturum_sayisi": oturum_sayisi,
        "kullanici_sayisi": kullanici_sayisi
    })


# ---------------- APP BAŞLAT ----------------
if __name__ == '__main__':
    app.run(debug=True)
