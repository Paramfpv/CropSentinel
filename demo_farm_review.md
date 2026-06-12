# Demo Farm Review

This document verifies the consistency, assets, and narrative compellingness of the demo farms configured in CropSentinel.

## 🌾 Demo Farm Narrative

The hackathon judging flow relies on three distinct demo farms representing different severity levels and crop types:

1. **Punjab Wheat Farm (Healthy)**
   * **Crop Type**: `wheat`
   * **Health Score**: 86/100
   * **Zone Type**: Healthy
   * **Status**: Optimal moisture and NDVI. No intervention required.

2. **Kaveri Delta Rice Farm (Moderate Risk)**
   * **Crop Type**: `rice`
   * **Health Score**: 63/100
   * **Zone Type**: Moderate / Water Stress
   * **Status**: Moderate water stress detected. Recommendation to increase irrigation by 20% over 5 days.

3. **Marathwada Sugarcane Farm (Critical / High Risk)**
   * **Crop Type**: `sugarcane`
   * **Health Score**: 41/100
   * **Zone Type**: Drought / Critical
   * **Status**: Severe drought stress. Immediate irrigation recommended within 24 hours to prevent crop yield loss.

## 📁 Asset Verification

All referenced crop types map directly to existing high-quality assets in the `src/assets/` directory:
* `wheat` -> `src/assets/wheat.png` (Used by Punjab Wheat Farm)
* `rice` -> `src/assets/rice.png` (Used by Kaveri Delta Rice Farm)
* `sugarcane` -> `src/assets/sugarcane.png` (Used by Marathwada Sugarcane Farm)
* `corn` -> `src/assets/corn.png` (Available for add-field selection)

## 🚫 Exclusions & Mismatches

* **No Cotton References**: Verified that all legacy references to `cotton` crop or assets have been completely removed.
* **No Asset Mismatches**: Mappings in `src/assets/index.js` correctly resolve the crops object keys `wheat`, `rice`, `corn`, and `sugarcane` to their respective image files.
