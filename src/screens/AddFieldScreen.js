import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

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
  const [loading, setLoading] = useState(false);
  const [savedFarmId, setSavedFarmId] = useState(null);
  const savedFarmIdRef = useRef(null);

  // Animated values for custom modal
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (isEditMode) {
      setFieldName(farmToEdit.name || '');
      setCropType(farmToEdit.cropType || 'Sugarcane');
      setFieldArea(farmToEdit.area || '5.0');
      setSoilType(farmToEdit.soilType || 'Clay');
      setLocation(
        farmToEdit.latitude && farmToEdit.longitude 
          ? { latitude: farmToEdit.latitude, longitude: farmToEdit.longitude }
          : { latitude: 19.8762, longitude: 75.3433 }
      );
    }
  }, [farmToEdit]);

  useEffect(() => {
    if (route.params?.selectedLocation) {
      setLocation(route.params.selectedLocation);
    }
  }, [route.params?.selectedLocation]);

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

  const handleSave = async () => {
    if (!fieldName.trim()) {
      Alert.alert(t.validationError, t.enterFarmName);
      return;
    }
    if (!cropType) {
      Alert.alert(t.validationError, t.enterCropType);
      return;
    }
    if (!soilType) {
      Alert.alert(t.validationError, t.enterSoilType);
      return;
    }
    if (!location || !location.latitude || !location.longitude) {
      Alert.alert(t.validationError, t.enterCoordinates);
      return;
    }

    const payload = {
      farm_name: fieldName.trim(),
      crop_type: cropType,
      latitude: (location && Number.isFinite(location.latitude)) ? parseFloat(location.latitude.toFixed(4)) : 0.0,
      longitude: (location && Number.isFinite(location.longitude)) ? parseFloat(location.longitude.toFixed(4)) : 0.0
    };

    console.log("D6 Backend Payload:", JSON.stringify(payload, null, 2));
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
    
    // Create new/updated farm object to pass to detail screen
    const farmObject = {
      id: savedFarmIdRef.current || savedFarmId || farmToEdit?.id || 'temp_new_farm',
      name: fieldName.trim(),
      cropType: cropType,
      healthScore: farmToEdit?.healthScore || 85,
      ndvi: farmToEdit?.ndvi || 0.68,
      moisture: farmToEdit?.moisture || '45%',
      riskSeverity: farmToEdit?.riskSeverity || 'low',
      zoneType: farmToEdit?.zoneType || 'healthy',
      latitude: (location && Number.isFinite(location.latitude)) ? parseFloat(location.latitude.toFixed(4)) : (farmToEdit?.latitude || 0.0),
      longitude: (location && Number.isFinite(location.longitude)) ? parseFloat(location.longitude.toFixed(4)) : (farmToEdit?.longitude || 0.0),
      area: fieldArea || '5.0',
      soilType: soilType,
      location: farmToEdit?.location || `${cropType} Zone`,
    };

    navigation.replace('FarmDetail', { farm: farmObject });
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
            style={styles.fieldInput}
            placeholder="e.g., North Field"
            placeholderTextColor={materialTheme.colors.textSecondary}
            value={fieldName}
            onChangeText={setFieldName}
            autoCorrect={false}
            autoCapitalize="words"
            editable={true}
          />
        </View>

        <DropdownSelector
          label={t.selectCropType}
          value={cropType}
          options={["Wheat", "Rice", "Corn", "Sugarcane"]}
          onSelect={setCropType}
          placeholder={t.chooseCrop}
          t={t}
        />

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
          onSelect={setSoilType}
          placeholder={t.chooseSoil}
          t={t}
        />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{t.locationCoordinates}</Text>
          <TouchableOpacity 
            style={styles.fieldSelect} 
            onPress={() => {
              triggerHapticSelection();
              navigation.navigate('LocationPicker');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.fieldSelectLeft}>
              <Feather name="map-pin" size={16} color={materialTheme.colors.textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.fieldSelectText, location && { color: materialTheme.colors.onSurface }]}>
                {(location && Number.isFinite(location.latitude) && Number.isFinite(location.longitude)) 
                  ? `Lat: ${location.latitude.toFixed(4)}, Lon: ${location.longitude.toFixed(4)}` 
                  : t.chooseLocation}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={materialTheme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

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
});
