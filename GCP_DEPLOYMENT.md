# 🚀 Project Friend AI - GCP Deployment Guide

**Timeline:** Deploy by June 16th (day before pitch)

---

## Phase 1: GCP Project Setup (30 mins)

### 1.1 Create GCP Project

```bash
# Create new project
gcloud projects create project-friend-ai-prod --name="Project Friend AI"
gcloud config set project project-friend-ai-prod

# Enable required APIs
gcloud services enable \
  cloudrun.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  compute.googleapis.com \
  firestore.googleapis.com \
  secretmanager.googleapis.com
```

### 1.2 Set Up Secret Manager (for API keys)

```bash
# Store Anthropic API Key
echo -n "sk-ant-YOUR_ANTHROPIC_KEY_HERE" | gcloud secrets create anthropic-api-key --data-file=-

# Store Gemini API Key
echo -n "YOUR_GEMINI_KEY_HERE" | gcloud secrets create gemini-api-key --data-file=-

# Grant Cloud Run service permission
gcloud secrets add-iam-policy-binding anthropic-api-key \
  --member=serviceAccount:project-friend-ai@appspot.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor

gcloud secrets add-iam-policy-binding gemini-api-key \
  --member=serviceAccount:project-friend-ai@appspot.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor
```

---

## Phase 2: Build & Deploy (15 mins)

### 2.1 Local Build Test

```bash
# Build Docker image locally
docker build -t gcr.io/project-friend-ai-prod/project-friend-ai:latest .

# Test locally
docker run -p 8080:8080 \
  -e ANTHROPIC_API_KEY="sk-ant-YOUR_KEY" \
  -e GEMINI_API_KEY="YOUR_GEMINI_KEY" \
  gcr.io/project-friend-ai-prod/project-friend-ai:latest
```

### 2.2 Push to GCP Container Registry

```bash
# Authenticate Docker
gcloud auth configure-docker

# Push image
docker push gcr.io/project-friend-ai-prod/project-friend-ai:latest
```

### 2.3 Deploy to Cloud Run

```bash
gcloud run deploy project-friend-ai \
  --image gcr.io/project-friend-ai-prod/project-friend-ai:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 3600 \
  --max-instances 100 \
  --min-instances 1 \
  --set-env-vars ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY},GEMINI_API_KEY=${GEMINI_API_KEY}
```

### 2.4 Verify Deployment

```bash
# Get service URL
gcloud run services describe project-friend-ai --region us-central1

# Test endpoint
curl https://project-friend-ai-XXXXX.a.run.app/api/solace-messages
```

---

## Phase 3: Post-Deployment (10 mins)

### 3.1 Set Up Cloud Monitoring

```bash
# Create uptime check
gcloud monitoring uptime-checks create \
  --display-name="Project Friend AI Health" \
  --resource-type="uptime-url" \
  --monitored-resource="https://project-friend-ai-XXXXX.a.run.app/api/solace-messages"
```

### 3.2 Set Up Error Reporting

* Visit **Cloud Console** → **Error Reporting**
* Errors will be auto-populated from Cloud Logging.

### 3.3 Enable Cloud Audit Logs

```bash
gcloud logging sinks create project-friend-audit-logs \
  logging.googleapis.com/projects/project-friend-ai-prod/logs/cloudaudit.googleapis.com \
  --log-filter='protoPayload.serviceName="run.googleapis.com"'
```

---

## Phase 4: Estimated Costs (for pitch deck)

### Monthly Cost Projection (Light Load)

| Service | Estimated Cost | Details / Resource |
| :--- | :--- | :--- |
| **Cloud Run** | ~$12-25 / month | 2GB memory, 2 CPU |
| **Firestore** | $0 | Free tier limits |
| **Secret Manager** | ~$6 / month | Keys & rotation |
| **Cloud Logging** | ~$3 / month | Free quota covers most |
| **GCP SUB-TOTAL** | **~$25-35 / month** | |

### External API Costs

* **Anthropic Claude:** ~$5-15 / month (free tier available)
* **Google Gemini:** $0 (free tier: 60 requests/min)

**TOTAL PRODUCTION MONTHLY:** ~$30-50 / month

### Revenue Potential / Economics

* **Free tier:** 100% conversion to paid conversion path options.
* **Premium tiers:** $4.99–$9.99 / month.
* **Projections:** At 1,000 active users (18% paid user ratio), this accounts for **~$900 / month** in recurring revenue.

---

## Phase 5: Monitoring Dashboard

### Create Custom Dashboard

```bash
# Auto-generate dashboard showing:
# - Request rate
# - Error rate
# - Response latency
# - Active users
# - API quota usage
```

* **GCP Console Path:** `Monitoring` → `Dashboards` → `Create Dashboard` → `Add metrics`

### Key Metrics to Track
- `run.googleapis.com/request_count`
- `run.googleapis.com/request_latencies`
- `logging.googleapis.com/log_entry_count` (errors)
- *Custom:* Crisis protocol triggers per week

---

## Troubleshooting

### Issue: "Permission Denied" on secrets

```bash
# Re-grant permissions
gcloud run services add-iam-policy-binding project-friend-ai \
  --member=serviceAccount:project-friend-ai@appspot.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor
```

### Issue: High latency

```bash
# Scale up
gcloud run services update project-friend-ai \
  --min-instances 5 \
  --max-instances 200 \
  --cpu 4 \
  --memory 4Gi
```

### Issue: API quota exhausted
- Implement circuit breaker (already in code)
- Use caching layer
- Upgrade to paid tier
