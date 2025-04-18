from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import RunReportRequest, DateRange, Dimension, Metric
from google.oauth2 import service_account

# JSON dosyasının yolu
KEY_PATH = "addmetric-456612-20b7e1419d08.json"  # senin indirdiğin dosya adı

# GA4 PROPERTY ID — Bunu seninle birazdan alacağız
PROPERTY_ID = "360586867"

# Kimlik bilgileri oluştur
credentials = service_account.Credentials.from_service_account_file(KEY_PATH)

# API istemcisi
client = BetaAnalyticsDataClient(credentials=credentials)

# API isteği
request = RunReportRequest(
    property=f"properties/{PROPERTY_ID}",
    dimensions=[Dimension(name="pagePath")],
    metrics=[Metric(name="screenPageViews")],
    date_ranges=[DateRange(start_date="7daysAgo", end_date="today")],
)

# API çağrısı
response = client.run_report(request)

# Sonuçları yazdır
print("En çok ziyaret edilen sayfalar (son 7 gün):")
for row in response.rows:
    print(f"{row.dimension_values[0].value} → {row.metric_values[0].value} görüntüleme")
