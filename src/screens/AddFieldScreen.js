import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';

import { materialTheme } from '../theme';
import { useDemoState } from '../config/demoState';
import { translations } from '../constants/translations';
import { createFarm, updateFarm } from '../services';

const triggerHapticSelection = async () => {
  try {
    await Haptics.selectionAsync();
  } catch (e) {}
};

const triggerHapticSuccess = async () => {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (e) {}
};

const DropdownSelector = ({ label, value, options, onSelect, placeholder, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity 
        style={styles.fieldSelect} 
        onPress={() => {
          triggerHapticSelection();
          setIsOpen(!isOpen);
        }}
        activeOpacity={0.7}
      >
        <Text style={[styles.fieldSelectText, value && { color: materialTheme.colors.onSurface }]}>
          {value || placeholder}
        </Text>
        <Feather name={isOpen ? "chevron-up" : "chevron-down"} size={18} color={materialTheme.colors.textSecondary} />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownOptions}>
          {options.map((opt, idx) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.dropdownOption, 
                value === opt && styles.dropdownOptionActive,
                idx === options.length - 1 && { borderBottomWidth: 0 }
              ]}
              onPress={() => {
                triggerHapticSelection();
                onSelect(opt);
                setIsOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.dropdownOptionText, value === opt && styles.dropdownOptionTextActive]}>
                {opt}
              </Text>
              {value === opt && <Feather name="check" size={16} color={materialTheme.colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export const AddFieldScreen = ({ navigation, route }) => {
  const { language } = useDemoState();
  const t = translations[language] || translations.en;

  const farmToEdit = route.params?.farm;
  const isEditMode = !!farmToEdit;

  const [fieldName, setFieldName] = useState('');
  const [cropType, setCropType] = useState('');
  const [fieldArea, setFieldArea] = useState('');
  const [soilType, setSoilType] = useState('');
  const [location, setLocation] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedFarmId, setSavedFarmId] = useState(null);
  const savedFarmIdRef = useRef(null);

  // Manual Coordinates and GPS states
  const [errors, setErrors] = useState({});
  const [isManualExpand, setIsManualExpand] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLon, setManualLon] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [gpsSuccess, setGpsSuccess] = useState('');

  // Animated values for custom modal
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Error modal animations (kept for legacy if triggered elsewhere)
  const errorFadeAnim = useRef(new Animated.Value(0)).current;
  const errorScaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (isEditMode) {
      setFieldName(farmToEdit.name || '');
      setCropType(farmToEdit.cropType || 'Sugarcane');
      setFieldArea(farmToEdit.area || '5.0');
      setSoilType(farmToEdit.soilType || 'Clay');
      
      const latVal = farmToEdit.latitude || 19.8762;
      const lonVal = farmToEdit.longitude || 75.3433;
      setLocation({
        latitude: latVal,
        longitude: lonVal,
        locationName: farmToEdit.location || `${latVal.toFixed(4)}, ${lonVal.toFixed(4)}`
      });
      setManualLat(String(latVal));
      setManualLon(String(lonVal));
    }
  }, [farmToEdit]);

  const triggerHapticWarning = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (e) {}
  };

  useEffect(() => {
    if (showSuccess) {
      triggerHapticSuccess();
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showSuccess]);

  const handleUseCurrentLocation = async () => {
    triggerHapticSelection();
    setGpsLoading(true);
    setGpsError('');
    setGpsSuccess('');
    setErrors(prev => ({ ...prev, location: null }));
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        triggerHapticWarning();
        setGpsError(language === 'hi' ? 'स्थान अनुमति अस्वीकार कर दी गई।' : 'Location permission denied.');
        setGpsLoading(false);
        return;
      }
      
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      if (loc && loc.coords) {
        const { latitude, longitude } = loc.coords;
        const latVal = parseFloat(latitude.toFixed(6));
        const lonVal = parseFloat(longitude.toFixed(6));
        
        let resolvedName = '';
        try {
          const geocode = await Location.reverseGeocodeAsync({ latitude: latVal, longitude: lonVal });
          if (geocode && geocode.length > 0) {
            const addr = geocode[0];
            const city = addr.city || addr.district || addr.subregion || addr.name || '';
            const stateRegion = addr.region || addr.state || addr.country || '';
            resolvedName = [city, stateRegion].filter(Boolean).join(', ');
          }
        } catch (e) {
          console.warn("Reverse geocoding failed:", e);
        }
        
        if (!resolvedName) {
          resolvedName = `${latVal}, ${lonVal}`;
        }
        
        setLocation({
          latitude: latVal,
          longitude: lonVal,
          locationName: resolvedName,
        });
        setManualLat(String(latVal));
        setManualLon(String(lonVal));
        setGpsSuccess(language === 'hi' ? 'स्थान सफलतापूर्वक प्राप्त किया गया!' : 'Location retrieved successfully!');
        triggerHapticSuccess();
      }
    } catch (err) {
      console.warn("GPS lookup failed:", err);
      triggerHapticWarning();
      setGpsError(language === 'hi' ? 'जीपीएस स्थान प्राप्त करने में विफल।' : 'Failed to retrieve GPS location.');
    } finally {
      setGpsLoading(false);
    }
  };

  const handleManualCoordsChange = (latStr, lonStr) => {
    setManualLat(latStr);
    setManualLon(lonStr);
    
    setErrors(prev => ({ ...prev, location: null, manualLat: null, manualLon: null }));
    
    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);
    
    if (!isNaN(lat) && !isNaN(lon)) {
      if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        setLocation({
          latitude: parseFloat(lat.toFixed(6)),
          longitude: parseFloat(lon.toFixed(6)),
          locationName: language === 'hi' ? 'मैन्युअल रूप से दर्ज स्थान' : 'Manually Entered Location',
        });
      }
    }
  };

  const handleSave = async () => {
    // Validation
    const newErrors = {};
    if (!fieldName.trim()) {
      newErrors.fieldName = language === 'hi' ? 'खेत का नाम आवश्यक है' : 'Farm Name is required';
    }
    if (!cropType) {
      newErrors.cropType = language === 'hi' ? 'फसल प्रकार आवश्यक है' : 'Crop Type is required';
    }
    if (!soilType) {
      newErrors.soilType = language === 'hi' ? 'मिट्टी प्रकार आवश्यक है' : 'Soil Type is required';
    }
    
    if (!location || !Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) {
      newErrors.location = language === 'hi' ? 'खेत का स्थान आवश्यक है' : 'Farm Location coordinates are required';
    } else {
      const lat = location.latitude;
      const lon = location.longitude;
      if (lat < -90 || lat > 90) {
        newErrors.manualLat = language === 'hi' ? 'अक्षांश -90 और 90 के बीच होना चाहिए' : 'Latitude must be between -90 and 90';
      }
      if (lon < -180 || lon > 180) {
        newErrors.manualLon = language === 'hi' ? 'देशांतर -180 और 180 के बीच होना चाहिए' : 'Longitude must be between -180 and 180';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      triggerHapticWarning();
      setErrors(newErrors);
      return;
    }

    const payload = {
      farm_name: fieldName.trim(),
      crop_type: cropType,
      latitude: parseFloat(location.latitude.toFixed(6)),
      longitude: parseFloat(location.longitude.toFixed(6))
    };

    setLoading(true);

    try {
      let res;
      if (isEditMode) {
        res = await updateFarm(farmToEdit.id, payload);
        setSavedFarmId(farmToEdit.id);
        savedFarmIdRef.current = farmToEdit.id;
      } else {
        res = await createFarm(payload);
        if (res && res.farm_id) {
          setSavedFarmId(String(res.farm_id));
          savedFarmIdRef.current = String(res.farm_id);
        }
      }
      setShowSuccess(true);
    } catch (err) {
      console.warn("Failed to save farm:", err);
      Alert.alert("Error Saving Farm", err.message || "An error occurred while communicating with the backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    triggerHapticSelection();
    setShowSuccess(false);
    
    const exactId = parseInt(savedFarmIdRef.current || savedFarmId || farmToEdit?.id);
    navigation.navigate('FarmDetail', { farmId: exactId });
  };

  const handleCloseSuccess = () => {
    triggerHapticSelection();
    setShowSuccess(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            triggerHapticSelection();
            navigation.goBack();
          }} 
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={22} color={materialTheme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditMode ? t.updateFarm : t.addNewField}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{t.farmNameLabel}</Text>
          <TextInput
            style={[styles.fieldInput, errors.fieldName && styles.inputErrorBorder]}
            placeholder="e.g., North Field"
            placeholderTextColor={materialTheme.colors.textSecondary}
            value={fieldName}
            onChangeText={(text) => {
              setFieldName(text);
              setErrors(prev => ({ ...prev, fieldName: null }));
            }}
            autoCorrect={false}
            autoCapitalize="words"
            editable={true}
          />
          {errors.fieldName && <Text style={styles.inlineErrorText}>{errors.fieldName}</Text>}
        </View>

        <DropdownSelector
          label={t.selectCropType}
          value={cropType}
          options={["Wheat", "Rice", "Corn", "Sugarcane"]}
          onSelect={(val) => {
            setCropType(val);
            setErrors(prev => ({ ...prev, cropType: null }));
          }}
          placeholder={t.chooseCrop}
          t={t}
        />
        {errors.cropType && <Text style={styles.inlineErrorText}>{errors.cropType}</Text>}

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{t.fieldAreaLabel}</Text>
          <TextInput
            style={styles.fieldInput}
            placeholder="e.g., 5.2"
            placeholderTextColor={materialTheme.colors.textSecondary}
            value={fieldArea}
            onChangeText={setFieldArea}
            keyboardType="numeric"
            editable={true}
          />
        </View>

        <DropdownSelector
          label={t.soilTypeLabel}
          value={soilType}
          options={["Sandy", "Clay", "Loamy", "Silty"]}
          onSelect={(val) => {
            setSoilType(val);
            setErrors(prev => ({ ...prev, soilType: null }));
          }}
          placeholder={t.chooseSoil}
          t={t}
        />
        {errors.soilType && <Text style={styles.inlineErrorText}>{errors.soilType}</Text>}

        {/* Farm Location Selection Section */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{t.locationCoordinates || 'Farm Location'}</Text>
          
          {/* Option A — Use Current Location */}
          <TouchableOpacity 
            style={[styles.gpsButton, gpsLoading && { opacity: 0.8 }]} 
            onPress={handleUseCurrentLocation}
            disabled={gpsLoading}
            activeOpacity={0.75}
          >
            {gpsLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
            ) : (
              <Feather name="map-pin" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            )}
            <Text style={styles.locationButtonText}>
              {gpsLoading 
                ? (language === 'hi' ? 'स्थान प्राप्त कर रहा है...' : 'Retrieving Location...') 
                : (language === 'hi' ? '📍 वर्तमान स्थान का उपयोग करें' : '📍 Use Current Location')}
            </Text>
          </TouchableOpacity>

          {/* GPS feedback messages */}
          {gpsError ? <Text style={styles.gpsErrorText}>{gpsError}</Text> : null}
          {gpsSuccess ? <Text style={styles.gpsSuccessText}>{gpsSuccess}</Text> : null}

          {/* Option B — Enter Coordinates Manually Header */}
          <TouchableOpacity 
            style={styles.expandHeader} 
            onPress={() => {
              triggerHapticSelection();
              setIsManualExpand(!isManualExpand);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.expandHeaderText}>
              {language === 'hi' ? 'निर्देशांक मैन्युअल रूप से दर्ज करें' : 'Enter Coordinates Manually'}
            </Text>
            <Feather name={isManualExpand ? "chevron-up" : "chevron-down"} size={18} color={materialTheme.colors.primary} />
          </TouchableOpacity>

          {/* Expandable Manual Inputs */}
          {isManualExpand && (
            <View style={styles.manualInputsContainer}>
              <View style={styles.manualInputCol}>
                <Text style={styles.manualInputLabel}>Latitude</Text>
                <TextInput
                  style={[styles.manualInput, errors.manualLat && styles.inputErrorBorder]}
                  placeholder="e.g. 23.0225"
                  placeholderTextColor={materialTheme.colors.textSecondary}
                  value={manualLat}
                  onChangeText={(text) => handleManualCoordsChange(text, manualLon)}
                  keyboardType="numeric"
                  editable={true}
                />
                {errors.manualLat && <Text style={styles.inlineErrorText}>{errors.manualLat}</Text>}
              </View>
              <View style={styles.manualInputCol}>
                <Text style={styles.manualInputLabel}>Longitude</Text>
                <TextInput
                  style={[styles.manualInput, errors.manualLon && styles.inputErrorBorder]}
                  placeholder="e.g. 72.5714"
                  placeholderTextColor={materialTheme.colors.textSecondary}
                  value={manualLon}
                  onChangeText={(text) => handleManualCoordsChange(manualLat, text)}
                  keyboardType="numeric"
                  editable={true}
                />
                {errors.manualLon && <Text style={styles.inlineErrorText}>{errors.manualLon}</Text>}
              </View>
            </View>
          )}

          {errors.location && <Text style={styles.inlineErrorText}>{errors.location}</Text>}
        </View>

        {/* Location Preview Card */}
        {location && Number.isFinite(location.latitude) && Number.isFinite(location.longitude) && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Selected Location</Text>
            <Text style={styles.previewName}>{location.locationName || 'Ahmedabad, Gujarat'}</Text>
            <View style={styles.previewCoordsRow}>
              <View style={styles.previewCoordsCol}>
                <Text style={styles.previewCoordsLabel}>Latitude</Text>
                <Text style={styles.previewCoordsValue}>{location.latitude.toFixed(6)}</Text>
              </View>
              <View style={styles.previewCoordsCol}>
                <Text style={styles.previewCoordsLabel}>Longitude</Text>
                <Text style={styles.previewCoordsValue}>{location.longitude.toFixed(6)}</Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.saveBtn, loading && { opacity: 0.7 }]} 
          onPress={() => {
            triggerHapticSelection();
            handleSave();
          }} 
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.saveBtnText}>{loading ? "Saving..." : (isEditMode ? t.updateFarm : t.saveField)}</Text>
        </TouchableOpacity>
      </ScrollView>

      {showSuccess && (
        <View style={styles.modalOverlay}>
          <Animated.View style={[
            styles.modalContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            <View style={styles.successIconContainer}>
              <Feather name="check" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.modalTitle}>
              {isEditMode ? t.farmUpdated : t.farmAdded}
            </Text>
            <Text style={styles.modalBody}>
              {isEditMode ? t.farmUpdatedSuccess : t.farmSavedSuccess}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalPrimaryBtn} 
                onPress={handleViewDetails}
                activeOpacity={0.85}
              >
                <Text style={styles.modalPrimaryBtnText}>{t.viewDetails}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalSecondaryBtn} 
                onPress={handleCloseSuccess}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSecondaryBtnText}>{t.done}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

      {showError && (
        <View style={styles.modalOverlay}>
          <Animated.View style={[
            styles.modalContent,
            {
              opacity: errorFadeAnim,
              transform: [{ scale: errorScaleAnim }]
            }
          ]}>
            <View style={[styles.successIconContainer, { backgroundColor: materialTheme.colors.error }]}>
              <Feather name="alert-triangle" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.modalTitle}>
              {t.validationError}
            </Text>
            <Text style={styles.modalBody}>
              {errorMsg}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalPrimaryBtn, { backgroundColor: materialTheme.colors.error }]} 
                onPress={() => setShowError(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.modalPrimaryBtnText}>{t.ok || 'OK'}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: materialTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: materialTheme.spacing.lg,
    paddingVertical: materialTheme.spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: materialTheme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: materialTheme.colors.outline,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: materialTheme.colors.onSurface,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: materialTheme.spacing.lg,
    paddingBottom: materialTheme.spacing.xxl,
  },
  fieldGroup: {
    marginBottom: materialTheme.spacing.lg,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: materialTheme.colors.onSurface,
    marginBottom: materialTheme.spacing.sm,
  },
  fieldInput: {
    backgroundColor: materialTheme.colors.surface,
    borderRadius: materialTheme.borderRadius.input,
    borderWidth: 1,
    borderColor: materialTheme.colors.outline,
    paddingHorizontal: materialTheme.spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    color: materialTheme.colors.onSurface,
  },
  fieldSelect: {
    backgroundColor: materialTheme.colors.surface,
    borderRadius: materialTheme.borderRadius.input,
    borderWidth: 1,
    borderColor: materialTheme.colors.outline,
    paddingHorizontal: materialTheme.spacing.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldSelectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldSelectText: {
    fontSize: 15,
    color: materialTheme.colors.textSecondary,
  },
  saveBtn: {
    backgroundColor: materialTheme.colors.primaryDark,
    borderRadius: materialTheme.borderRadius.button,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: materialTheme.spacing.md,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dropdownOptions: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E0',
    borderRadius: 12,
    marginTop: 4,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F0',
  },
  dropdownOptionActive: {
    backgroundColor: '#F3F4F6',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  dropdownOptionTextActive: {
    color: materialTheme.colors.primary,
    fontWeight: '600',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 28, // Material 3 Spec for Dialogs
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  successIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: materialTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalBody: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalActions: {
    width: '100%',
    gap: 8,
  },
  modalPrimaryBtn: {
    width: '100%',
    backgroundColor: materialTheme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalSecondaryBtn: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: materialTheme.colors.outline,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSecondaryBtnText: {
    color: materialTheme.colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: materialTheme.colors.primary,
    borderRadius: materialTheme.borderRadius.button,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: materialTheme.colors.primaryDark,
    marginBottom: materialTheme.spacing.sm,
  },
  locationButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  gpsErrorText: {
    color: materialTheme.colors.error,
    fontSize: 13,
    fontWeight: '500',
    marginTop: materialTheme.spacing.xs,
    marginBottom: materialTheme.spacing.sm,
  },
  gpsSuccessText: {
    color: materialTheme.colors.success,
    fontSize: 13,
    fontWeight: '600',
    marginTop: materialTheme.spacing.xs,
    marginBottom: materialTheme.spacing.sm,
  },
  expandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: materialTheme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: materialTheme.colors.outline,
    borderRadius: materialTheme.borderRadius.input,
    paddingHorizontal: materialTheme.spacing.md,
    paddingVertical: 14,
    marginTop: materialTheme.spacing.sm,
  },
  expandHeaderText: {
    fontSize: 15,
    fontWeight: '600',
    color: materialTheme.colors.primary,
  },
  manualInputsContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: materialTheme.spacing.md,
    backgroundColor: materialTheme.colors.surfaceVariant,
    borderRadius: materialTheme.borderRadius.input,
    borderWidth: 1,
    borderColor: materialTheme.colors.outline,
    marginTop: materialTheme.spacing.sm,
  },
  manualInputCol: {
    flex: 1,
  },
  manualInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: materialTheme.colors.textSecondary,
    marginBottom: materialTheme.spacing.xs,
  },
  manualInput: {
    backgroundColor: materialTheme.colors.surface,
    borderWidth: 1,
    borderColor: materialTheme.colors.outline,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: materialTheme.colors.onSurface,
  },
  inputErrorBorder: {
    borderColor: materialTheme.colors.error,
  },
  inlineErrorText: {
    color: materialTheme.colors.error,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  previewCard: {
    backgroundColor: materialTheme.colors.primaryContainer,
    borderRadius: materialTheme.borderRadius.card,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    padding: materialTheme.spacing.md,
    marginVertical: materialTheme.spacing.md,
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: materialTheme.colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '700',
    color: materialTheme.colors.onSurface,
    marginBottom: 12,
  },
  previewCoordsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  previewCoordsCol: {
    flex: 1,
  },
  previewCoordsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: materialTheme.colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  previewCoordsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: materialTheme.colors.onSurface,
  },
});
