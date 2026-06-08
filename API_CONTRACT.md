# CropSentinel API Contract

Version: 0.1
Status: Draft

Purpose: This document defines the expected frontend ↔ backend integration for CropSentinel. This is a working contract for the hackathon MVP and may evolve during development. Existing field names should remain stable whenever possible.

---

# Base URL

```http
http://localhost:8000
```

---

# Health Check

## GET /health

Used to verify backend availability.

### Response

```json
{
  "status": "healthy"
}
```

---

# Dashboard Overview

## GET /dashboard

Returns all key information required by the main dashboard.

### Response

```json
{
  "farm": {
    "id": 1,
    "name": "Vidarbha Cotton Farm",
    "crop_type": "cotton"
  },
  "farm_health_score": 72,
  "ndvi": 0.21,
  "weather_risk": 0.65,
  "soil_moisture": 18,
  "market_risk": 0.40,
  "last_updated": "2026-06-08T12:00:00Z",
  "recommendation": {
    "action": "Irrigate within 48 hours",
    "estimated_cost": 340,
    "yield_loss_risk": 18000
  }
}
```

---

# Agent Status

## GET /agent-status

Returns current status of all agents.

### Response

```json
{
  "satellite": "completed",
  "weather": "completed",
  "soil": "completed",
  "market": "completed",
  "intervention": "completed",
  "alert": "completed"
}
```

Possible values:
```text
idle
running
completed
failed
```

---

# NDVI History

## GET /ndvi-history

Used for NDVI trend chart.

### Response

```json
[
  {
    "date": "2026-06-01",
    "value": 0.42
  },
  {
    "date": "2026-06-02",
    "value": 0.39
  },
  {
    "date": "2026-06-03",
    "value": 0.35
  }
]
```

---

# Market Price History

## GET /market-history

Used for mandi price trend chart.

### Response

```json
[
  {
    "date": "2026-06-01",
    "price": 6500
  },
  {
    "date": "2026-06-02",
    "price": 6700
  },
  {
    "date": "2026-06-03",
    "price": 6900
  }
]
```

---

# Stress Map

## GET /stress-map

Returns NDVI stress visualization.

### Response

```json
{
  "image_url": "/static/maps/stress_map.png"
}
```

---

# Alerts

## GET /alerts

Returns alert history.

### Response

```json
[
  {
    "id": 1,
    "message": "Irrigate within 48 hours",
    "timestamp": "2026-06-08T12:00:00Z",
    "status": "sent"
  }
]
```

---

# Manual Analysis Trigger

## POST /run-analysis

Used during demo to trigger a complete analysis cycle.

### Request

```json
{}
```

### Response

```json
{
  "status": "started"
}
```

---

# Future Endpoints

These endpoints are expected but not yet defined:

* Farm onboarding
* Farm boundary upload
* WhatsApp alert management
* Historical recommendations
* Multi-farm support

---

# Notes For Frontend Team

Frontend should assume:

* Response field names are expected to remain stable.
* Additional fields may be added later.
* Mock data can be created using the examples above.
* Charts, cards, maps, and agent-status components can be developed immediately using these response formats.
* Backend implementation may evolve, but the overall response shape should stay similar.
