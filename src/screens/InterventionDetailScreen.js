import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Alert, ActivityIndicator, Share, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { materialTheme } from '../theme';
import { fetchDashboard, getIntervention, submitIntervention } from '../services';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { scheduleLocalAlert } from '../services/notifications';
import { useDemoState } from '../config/demoState';
import { DemoBanner } from '../components/DemoBanner';
import { translations } from '../constants/translations';

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

export const InterventionDetailScreen = ({ navigation, route }) => {
  const { isDemoMode, isDroughtSimulated, applyIntervention, language } = useDemoState();
  const t = translations[language] || translations.en;

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [isApplying, setIsApplying] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Animated values
  const confidenceProgress = useRef(new Animated.Value(0)).current;
  const dialogFadeAnim = useRef(new Animated.Value(0)).current;
  const dialogScaleAnim = useRef(new Animated.Value(0.9)).current;

  const handleMoreMenuPress = () => {
    triggerHapticSelection();
    Alert.alert(
      "Insights Options",
      "Choose an option:",
      [
        { text: "Refresh Insights", onPress: () => loadIntervention(true) },
        { text: "Export Summary", onPress: handleExportSummary },
        { text: "Share Report", onPress: handleShareReport },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleExportSummary = () => {
    if (!details) return;
    const summaryText = `CropSentinel Insights Report\nFarm: Marathwada Sugarcane Farm\nAction: ${details.action}\nCost: ${details.cost}\nYield Risk: ${details.risk}\nConfidence: ${Math.round(details.confidence * 100)}%`;
    Alert.alert(
      "Insights Export",
      summaryText,
      [{ text: "OK" }]
    );
  };

  const handleShareReport = async () => {
    if (!details) return;
    const shareContent = {
      message: `CropSentinel Insights Report\nFarm: Marathwada Sugarcane Farm\nAction: ${details.action}\nCost: ${details.cost}\nYield Risk: ${details.risk}\nConfidence: ${Math.round(details.confidence * 100)}%`,
    };
    try {
      await Share.share(shareContent);
    } catch (err) {
      console.warn("Sharing failed:", err);
    }
  };

  const triggerApply = async () => {
    triggerHapticSelection();
    if (!details) return;
    
    setIsApplying(true);
    const farmId = route.params?.farmId || 3;
    
    try {
      await submitIntervention(farmId, {
        action: details.action,
        cost: details.cost,
        risk: details.risk,
      });

      if (isDemoMode) {
        applyIntervention(farmId);
      }
      
      setIsApplying(false);
      setShowSuccessDialog(true);
      
      // Local notification
      await scheduleLocalAlert(
        "CropSentinel Alert",
        "Intervention applied successfully. Continue monitoring your farm."
      );
    } catch (err) {
      console.warn("Failed to apply intervention:", err);
      Alert.alert("Failed to Apply Intervention", err.message || "An error occurred.");
      setIsApplying(false);
    }
  };

  const loadIntervention = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      const dashboard = await fetchDashboard();
      if (dashboard && dashboard.recommendation) {
        const rec = dashboard.recommendation;
        setDetails({
          action: rec.action || 'Irrigate within 48 hours',
          description: 'Timely action recommended by CropSentinel AI.',
          irrigation: '35 mm',
          cost: rec.estimated_cost !== undefined ? `₹${rec.estimated_cost.toLocaleString()}` : '₹340',
          risk: rec.yield_loss_risk !== undefined ? `₹${rec.yield_loss_risk.toLocaleString()}` : '₹18,000',
          confidence: rec.confidence ? rec.confidence / 100 : 0.91,
          improvement: '20–25%',
          roi: '3.8x',
        });
      } else {
        throw new Error('No recommendation data found in dashboard response');
      }
    } catch (err) {
      console.warn('Failed to load intervention from dashboard, falling back to mock intervention:', err);
      try {
        const fallback = await getIntervention();
        if (fallback) {
          setDetails({
            action: fallback.action ? fallback.action.split(' - ')[0] : 'Irrigate immediately',
            description: fallback.action ? fallback.action.split(' - ')[1] : 'Moisture level critically low',
            irrigation: fallback.irrigation_mm ? `${fallback.irrigation_mm} mm` : '35 mm',
            cost: fallback.cost_inr ? `₹${fallback.cost_inr.toLocaleString()}` : '₹1,200',
            risk: fallback.risk_inr ? `₹${fallback.risk_inr.toLocaleString()}` : '₹45,000',
            confidence: fallback.confidence || 0.91,
            improvement: '20–25%',
            roi: '3.8x',
          });
        }
      } catch (fallbackErr) {
        setError('Failed to load recommendation details. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadIntervention();
  }, [isDemoMode, isDroughtSimulated]);

  useEffect(() => {
    if (details) {
      confidenceProgress.setValue(0);
      Animated.timing(confidenceProgress, {
        toValue: details.confidence,
        duration: 350,
        useNativeDriver: false, // width style requires layout thread
      }).start();
    }
  }, [details]);

  useEffect(() => {
    if (showSuccessDialog) {
      triggerHapticSuccess();
      Animated.parallel([
        Animated.timing(dialogFadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(dialogScaleAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showSuccessDialog]);

  const onRefresh = useCallback(() => {
    loadIntervention(true);
  }, []);

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={materialTheme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.insights}</Text>
        </View>
        <LoadingState message="Loading intervention details..." />
      </SafeAreaView>
    );
  }

  if (error && !details) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={materialTheme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.insights}</Text>
        </View>
        <ErrorState message={error} onRetry={() => loadIntervention(false)} />
      </SafeAreaView>
    );
  }

  const confidencePercent = details ? Math.round(details.confidence * 100) : 0;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <DemoBanner />
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
        <Text style={styles.headerTitle}>{t.insights}</Text>
        <TouchableOpacity style={styles.moreBtn} onPress={handleMoreMenuPress}>
          <Feather name="more-vertical" size={20} color={materialTheme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {details ? (
        <ScrollView 
          contentContainerStyle={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[materialTheme.colors.primary]}
            />
          }
        >
          <View style={styles.recommendationBadge}>
            <Feather name="zap" size={14} color={materialTheme.colors.error} />
            <Text style={styles.recommendationText}>{t.aiRecommendation}</Text>
          </View>

          <Text style={styles.actionTitle}>{details.action}</Text>
          <Text style={styles.actionDesc}>{details.description}</Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>{t.irrigation}</Text>
              <Text style={styles.metricValue}>{details.irrigation}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>{t.cost}</Text>
              <Text style={styles.metricValue}>{details.cost}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>{t.yieldRisk}</Text>
              <Text style={styles.metricValue}>{details.risk}</Text>
            </View>
          </View>

          <View style={styles.confidenceCard}>
            <Text style={styles.confidenceLabel}>{t.aiConfidence}</Text>
            <View style={styles.confidenceBarBg}>
              <Animated.View style={[
                styles.confidenceBarFill, 
                {
                  width: confidenceProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })
                }
              ]} />
            </View>
            <Text style={styles.confidenceValue}>{confidencePercent}%</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>{t.whyIntervention}</Text>
            <Text style={styles.infoCardText}>{t.whyInterventionDesc}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>{t.expectedOutcome}</Text>
            <View style={styles.outcomeRow}>
              <View style={styles.outcomeBlock}>
                <Text style={styles.outcomeLabel}>{t.yieldImprovement}</Text>
                <Text style={styles.outcomeValue}>{details.improvement}</Text>
              </View>
              <View style={styles.outcomeBlock}>
                <Text style={styles.outcomeLabel}>{t.roi}</Text>
                <Text style={styles.outcomeValue}>{details.roi}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.primaryBtn, isApplying && styles.primaryBtnDisabled]}
            disabled={isApplying}
            onPress={triggerApply}
            activeOpacity={0.85}
          >
            {isApplying ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryBtnText}>{t.applyRecommendation}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.loaderContainer}>
          <Text style={styles.loadingText}>No details found.</Text>
        </View>
      )}

      {showSuccessDialog && (
        <View style={styles.modalOverlay}>
          <Animated.View style={[
            styles.modalContent,
            {
              opacity: dialogFadeAnim,
              transform: [{ scale: dialogScaleAnim }]
            }
          ]}>
            <View style={styles.successIconContainer}>
              <Feather name="check" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.modalTitle}>{t.recordedTitle}</Text>
            <Text style={styles.modalBody}>{t.recordedMsg}</Text>

            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>{t.costSavedLabel}</Text>
                <Text style={styles.statValueText}>{details ? details.cost : '₹1,200'}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>{t.riskReductionLabel}</Text>
                <Text style={styles.statValueText}>{details ? details.risk : '₹45,000'}</Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalPrimaryBtn} 
                onPress={() => {
                  triggerHapticSelection();
                  setShowSuccessDialog(false);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.modalPrimaryBtnText}>{t.continueMonitoring}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalSecondaryBtn} 
                onPress={() => {
                  triggerHapticSelection();
                  setShowSuccessDialog(false);
                  navigation.navigate('AlertsFeed');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSecondaryBtnText}>{t.viewAlerts}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

      {/* Bottom Nav Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => { triggerHapticSelection(); navigation.navigate('MyFarms'); }}>
          <Feather name="home" size={20} color={materialTheme.colors.textSecondary} />
          <Text style={styles.bottomNavText}>{t.home}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => { triggerHapticSelection(); navigation.navigate('Farms'); }}>
          <Feather name="layers" size={20} color={materialTheme.colors.textSecondary} />
          <Text style={styles.bottomNavText}>{t.farms}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItemActive}>
          <Feather name="bar-chart-2" size={20} color={materialTheme.colors.primary} />
          <Text style={[styles.bottomNavText, styles.bottomNavTextActive]}>{t.insights}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => { triggerHapticSelection(); navigation.navigate('AlertsFeed'); }}>
          <Feather name="bell" size={20} color={materialTheme.colors.textSecondary} />
          <Text style={styles.bottomNavText}>{t.alerts}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => { triggerHapticSelection(); navigation.navigate('Settings'); }}>
          <Feather name="user" size={20} color={materialTheme.colors.textSecondary} />
          <Text style={styles.bottomNavText}>{t.profile}</Text>
        </TouchableOpacity>
      </View>
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
  moreBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: materialTheme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: materialTheme.colors.outline,
  },
  content: {
    paddingHorizontal: materialTheme.spacing.lg,
    paddingBottom: materialTheme.spacing.xxl,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: materialTheme.colors.textSecondary,
  },
  recommendationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: materialTheme.borderRadius.full,
    marginBottom: materialTheme.spacing.md,
    gap: 6,
  },
  recommendationText: {
    fontSize: 12,
    fontWeight: '700',
    color: materialTheme.colors.error,
  },
  actionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: materialTheme.colors.onSurface,
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 15,
    color: materialTheme.colors.textSecondary,
    marginBottom: materialTheme.spacing.lg,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: materialTheme.spacing.sm,
    marginBottom: materialTheme.spacing.lg,
  },
  metricCard: {
    flex: 1,
    backgroundColor: materialTheme.colors.surface,
    borderRadius: materialTheme.borderRadius.card,
    padding: materialTheme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: materialTheme.colors.outline,
  },
  metricLabel: {
    fontSize: 12,
    color: materialTheme.colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
    color: materialTheme.colors.onSurface,
  },
  confidenceCard: {
    backgroundColor: materialTheme.colors.surface,
    borderRadius: materialTheme.borderRadius.card,
    padding: materialTheme.spacing.lg,
    marginBottom: materialTheme.spacing.md,
    borderWidth: 1,
    borderColor: materialTheme.colors.outline,
  },
  confidenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: materialTheme.colors.onSurface,
    marginBottom: materialTheme.spacing.sm,
  },
  confidenceBarBg: {
    height: 8,
    backgroundColor: materialTheme.colors.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: materialTheme.spacing.sm,
  },
  confidenceBarFill: {
    height: '100%',
    backgroundColor: materialTheme.colors.primary,
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: materialTheme.colors.onSurface,
  },
  infoCard: {
    backgroundColor: materialTheme.colors.surface,
    borderRadius: materialTheme.borderRadius.card,
    padding: materialTheme.spacing.lg,
    marginBottom: materialTheme.spacing.md,
    borderWidth: 1,
    borderColor: materialTheme.colors.outline,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: materialTheme.colors.onSurface,
    marginBottom: materialTheme.spacing.sm,
  },
  infoCardText: {
    fontSize: 14,
    color: materialTheme.colors.textSecondary,
    lineHeight: 22,
  },
  outcomeRow: {
    flexDirection: 'row',
    gap: materialTheme.spacing.lg,
  },
  outcomeBlock: {
    flex: 1,
  },
  outcomeLabel: {
    fontSize: 12,
    color: materialTheme.colors.textSecondary,
    marginBottom: 4,
  },
  outcomeValue: {
    fontSize: 20,
    fontWeight: '700',
    color: materialTheme.colors.onSurface,
  },
  primaryBtn: {
    backgroundColor: materialTheme.colors.primaryDark,
    borderRadius: materialTheme.borderRadius.button,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: materialTheme.spacing.md,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  primaryBtnDisabled: {
    backgroundColor: '#A3A3A3',
    opacity: 0.8,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: materialTheme.colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: materialTheme.spacing.sm,
    paddingBottom: materialTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: materialTheme.colors.outline,
    zIndex: 100,
  },
  bottomNavItem: {
    alignItems: 'center',
    paddingVertical: 4,
    gap: 2,
  },
  bottomNavItemActive: {
    alignItems: 'center',
    paddingVertical: 4,
    gap: 2,
  },
  bottomNavText: {
    fontSize: 10,
    color: materialTheme.colors.textSecondary,
    fontWeight: '500',
  },
  bottomNavTextActive: {
    color: materialTheme.colors.primary,
    fontWeight: '700',
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
    marginBottom: 18,
    lineHeight: 20,
  },
  statsCard: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: materialTheme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: materialTheme.colors.outline,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#7A7A7A',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValueText: {
    fontSize: 16,
    fontWeight: '700',
    color: materialTheme.colors.primaryDark,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: materialTheme.colors.outline,
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
