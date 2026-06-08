import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { materialTheme } from '../theme';
import { crops } from '../assets';

export const FarmDetailScreen = ({ navigation, route }) => {
  const farm = route.params?.farm || {
    name: 'Farm Detail',
    cropType: 'Wheat',
    healthScore: 72,
    ndvi: 0.61,
    moisture: 'Low',
  };

  const tabs = ['Overview', 'Trends', 'Weather', 'Details'];

  return (
    <SafeAreaView style={styles.screen} edges={["top","bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={22} color={materialTheme.colors.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.title}>{farm.name}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="settings" size={20} color={materialTheme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mapCard}>
          <Text style={styles.mapLabel}>Satellite map</Text>
          <View style={styles.mapPlaceholder} />
        </View>

        <View style={styles.cropHero}>
          <Image source={crops[farm.cropType.toLowerCase()] || crops.default} style={styles.cropImage} />
          <View style={styles.cropInfo}>
            <Text style={styles.cropTypeLabel}>{farm.cropType}</Text>
            <Text style={styles.cropHealth}>{farm.healthScore} Health</Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.gaugeCard}>
            <Text style={styles.gaugeLabel}>Health Score</Text>
            <View style={styles.gaugeCircle}>
              <Text style={styles.gaugeValue}>{farm.healthScore}</Text>
            </View>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>NDVI</Text>
            <Text style={styles.statsValue}>{farm.ndvi}</Text>
            <Text style={styles.statsLabel}>Moisture</Text>
            <Text style={styles.statsValue}>{farm.moisture}</Text>
            <Text style={styles.statsMeta}>Last update 2 hrs ago</Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <View key={tab} style={styles.tabItem}>
              <Text style={styles.tabText}>{tab}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Field details</Text>
          <Text style={styles.summaryText}>Stay ahead with crop health, soil moisture and NDVI trends all in one place.</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('InterventionDetail', { farmId: farm.id })}
        >
          <Text style={styles.primaryButtonText}>View Intervention</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: materialTheme.colors.background,
  },
  header: {
    marginTop: materialTheme.spacing.sm,
    marginHorizontal: materialTheme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: materialTheme.spacing.sm,
  },
  backText: {
    color: materialTheme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: materialTheme.colors.onSurface,
    fontSize: 20,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 48,
  },
  content: {
    paddingHorizontal: materialTheme.spacing.lg,
    paddingBottom: materialTheme.spacing.xl,
  },
  mapCard: {
    backgroundColor: materialTheme.colors.surface,
    borderRadius: materialTheme.borderRadius.card,
    padding: materialTheme.spacing.md,
    marginBottom: materialTheme.spacing.md,
    shadowColor: materialTheme.colors.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  mapLabel: {
    color: materialTheme.colors.onSurface,
    fontSize: 14,
    marginBottom: materialTheme.spacing.sm,
    fontWeight: '600',
  },
  mapPlaceholder: {
    height: 190,
    borderRadius: materialTheme.borderRadius.card,
    backgroundColor: materialTheme.colors.surfaceVariant,
  },
  headerActions: { width: 48, alignItems: 'flex-end' },
  iconBtn: { padding: 8 },
  wheatIllustration: {
    height: 110,
    width: 110,
    backgroundColor: materialTheme.colors.surfaceVariant,
    borderRadius: materialTheme.borderRadius.card,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: materialTheme.spacing.md,
  },
  gaugeCard: {
    flex: 1,
    marginRight: materialTheme.spacing.sm,
    backgroundColor: materialTheme.colors.surface,
    borderRadius: materialTheme.borderRadius.lg,
    padding: materialTheme.spacing.md,
    alignItems: 'center',
    shadowColor: materialTheme.colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  gaugeLabel: {
    color: materialTheme.colors.onSurface,
    fontSize: 14,
    opacity: 0.8,
    marginBottom: materialTheme.spacing.sm,
  },
  gaugeCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: materialTheme.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeValue: {
    color: materialTheme.colors.primary,
    fontSize: 30,
    fontWeight: '700',
  },
  statsCard: {
    flex: 1,
    marginLeft: materialTheme.spacing.sm,
    backgroundColor: materialTheme.colors.surface,
    borderRadius: materialTheme.borderRadius.lg,
    padding: materialTheme.spacing.md,
    shadowColor: materialTheme.colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  statsLabel: {
    color: materialTheme.colors.onSurface,
    opacity: 0.8,
    fontSize: 12,
    marginTop: materialTheme.spacing.sm,
  },
  statsValue: {
    color: materialTheme.colors.onSurface,
    fontSize: 22,
    fontWeight: '700',
  },
  statsMeta: {
    color: materialTheme.colors.onSurface,
    opacity: 0.7,
    marginTop: materialTheme.spacing.sm,
    fontSize: 12,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: materialTheme.spacing.md,
  },
  tabItem: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: materialTheme.colors.surface,
    borderRadius: materialTheme.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: materialTheme.colors.outline,
  },
  tabText: {
    color: materialTheme.colors.onSurface,
    fontSize: 12,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: materialTheme.colors.surface,
    borderRadius: materialTheme.borderRadius.lg,
    padding: materialTheme.spacing.md,
    marginBottom: materialTheme.spacing.lg,
    shadowColor: materialTheme.colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  summaryTitle: {
    color: materialTheme.colors.onSurface,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: materialTheme.spacing.sm,
  },
  summaryText: {
    color: materialTheme.colors.onSurface,
    opacity: 0.8,
    lineHeight: 22,
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: materialTheme.colors.primary,
    borderRadius: materialTheme.borderRadius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cropHero: {
    backgroundColor: materialTheme.colors.surface,
    borderRadius: materialTheme.borderRadius.lg,
    padding: materialTheme.spacing.md,
    marginBottom: materialTheme.spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
  },
  cropImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: materialTheme.colors.surfaceVariant,
    marginRight: materialTheme.spacing.md,
  },
  cropInfo: { flex: 1 },
  cropTypeLabel: { color: materialTheme.colors.onSurface, fontWeight: '700', fontSize: 16 },
  cropHealth: { color: materialTheme.colors.primary, fontSize: 20, fontWeight: '800', marginTop: 8 },
});
