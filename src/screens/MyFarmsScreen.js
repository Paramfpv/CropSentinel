import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { materialTheme } from '../theme';
import { crops } from '../assets';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_FARMS = [
  {
    id: 'farm_001',
    name: 'North Field',
    cropType: 'Wheat',
    healthScore: 72,
    ndvi: 0.58,
    moisture: 'Low',
    droughtRisk: 'High',
    riskSeverity: 'high',
  },
  {
    id: 'farm_002',
    name: 'South Field',
    cropType: 'Rice',
    healthScore: 88,
    ndvi: 0.71,
    moisture: 'Moderate',
    droughtRisk: 'Medium',
    riskSeverity: 'medium',
  },
];

const WEATHER = [
  { label: 'Temp', value: '28°C' },
  { label: 'Humidity', value: '68%' },
  { label: 'Rain', value: '12mm' },
  { label: 'Wind', value: '14 km/h' },
];

const navItems = ['Home', 'Farms', 'Insights', 'Alerts', 'Profile'];

export const MyFarmsScreen = ({ navigation }) => {
  const renderFarm = ({ item }) => {
    const severityColor =
      item.riskSeverity === 'high'
        ? materialTheme.colors.error
        : item.riskSeverity === 'medium'
        ? materialTheme.colors.tertiary
        : materialTheme.colors.secondary;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('FarmDetail', { farm: item })}
      >
        <Image source={crops[item.cropType.toLowerCase()] || crops.default} style={styles.cropImage} />
        <View style={styles.cardHeader}>
          <Text style={styles.farmName}>{item.name}</Text>
          <View style={[styles.healthBadge, { borderColor: materialTheme.colors.outline }]}> 
            <Text style={styles.healthScore}>{item.healthScore}</Text>
            <Text style={styles.healthLabel}>Health</Text>
          </View>
        </View>

        <View style={styles.row}> 
          <Text style={styles.cropType}>{item.cropType}</Text>
          <View style={[styles.riskChip, { backgroundColor: severityColor + '20' }]}> 
            <Text style={[styles.riskChipText, { color: severityColor }]}>{item.droughtRisk} Risk</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>NDVI</Text>
            <Text style={styles.statValue}>{item.ndvi}</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>Moisture</Text>
            <Text style={styles.statValue}>{item.moisture}</Text>
          </View>
        </View>

        <View style={styles.trendPlaceholder}>
          <Text style={styles.trendText}>Trend line placeholder</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top","bottom"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning, Farmer 🌿</Text>
          <Text style={styles.balance}>Your farms are healthy and ready for review.</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="bell" size={20} color={materialTheme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="activity" size={20} color={materialTheme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.weatherRow}>
        {WEATHER.map((item) => (
          <View key={item.label} style={styles.weatherCard}>
            <View style={styles.weatherIconRow}>
              <Feather name={item.icon || 'sun'} size={16} color={materialTheme.colors.primaryDark} />
              <Text style={styles.weatherValue}>{item.value}</Text>
            </View>
            <Text style={styles.weatherLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={MOCK_FARMS}
        keyExtractor={(item) => item.id}
        renderItem={renderFarm}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomNavItemActive} onPress={() => navigation.navigate('MyFarms')}>
          <Feather name="home" size={18} color={materialTheme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('MyFarms')}>
          <MaterialCommunityIcons name="sprout" size={18} color={materialTheme.colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('InterventionDetail')}>
          <Feather name="activity" size={18} color={materialTheme.colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('AlertsFeed')}>
          <Feather name="bell" size={18} color={materialTheme.colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('Settings')}>
          <Feather name="user" size={18} color={materialTheme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddField') }>
        <Feather name="plus" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: materialTheme.colors.background,
    paddingTop: materialTheme.spacing.sm,
  },
  header: {
    marginHorizontal: materialTheme.spacing.lg,
    marginBottom: materialTheme.spacing.md,
    padding: materialTheme.spacing.md,
    backgroundColor: materialTheme.colors.surface,
    borderRadius: materialTheme.borderRadius.card,
    shadowColor: materialTheme.colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: materialTheme.colors.onSurface,
    fontSize: 24,
    fontWeight: '700',
  },
  balance: {
    color: materialTheme.colors.onSurface,
    opacity: 0.8,
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  headerAction: {
    backgroundColor: materialTheme.colors.primaryContainer,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: materialTheme.borderRadius.button,
  },
  headerActionText: {
    color: materialTheme.colors.primary,
    fontWeight: '700',
  },
  weatherRow: {
    marginHorizontal: materialTheme.spacing.lg,
    marginBottom: materialTheme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherCard: {
    flex: 1,
    backgroundColor: materialTheme.colors.surface,
    padding: materialTheme.spacing.md,
    marginHorizontal: 4,
    borderRadius: materialTheme.borderRadius.card,
    borderWidth: 1,
    borderColor: materialTheme.colors.outline,
  },
  weatherIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  weatherValue: {
    color: materialTheme.colors.onSurface,
    fontWeight: '700',
    fontSize: 16,
  },
  weatherLabel: {
    color: materialTheme.colors.onSurface,
    opacity: 0.7,
    marginTop: 4,
    fontSize: 12,
  },
  list: {
    paddingHorizontal: materialTheme.spacing.lg,
    paddingBottom: materialTheme.spacing.xl + 60,
  },
  card: {
    backgroundColor: materialTheme.colors.surface,
    borderRadius: materialTheme.borderRadius.lg,
    padding: materialTheme.spacing.lg,
    marginBottom: materialTheme.spacing.md,
    shadowColor: materialTheme.colors.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: materialTheme.spacing.sm,
  },
  farmName: {
    color: materialTheme.colors.onSurface,
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    marginRight: materialTheme.spacing.sm,
  },
  healthBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: materialTheme.colors.outline,
    alignItems: 'center',
  },
  healthScore: {
    color: materialTheme.colors.onSurface,
    fontSize: 16,
    fontWeight: '700',
  },
  healthLabel: {
    color: materialTheme.colors.onSurface,
    opacity: 0.7,
    fontSize: 12,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: materialTheme.spacing.md,
  },
  cropType: {
    color: materialTheme.colors.onSurface,
    fontSize: 14,
    opacity: 0.8,
  },
  riskChip: {
    borderRadius: materialTheme.borderRadius.md,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  riskChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: materialTheme.spacing.md,
  },
  statBlock: {
    flex: 1,
    marginRight: materialTheme.spacing.sm,
  },
  statLabel: {
    color: materialTheme.colors.onSurface,
    opacity: 0.7,
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: materialTheme.colors.onSurface,
    fontSize: 16,
    fontWeight: '700',
  },
  trendPlaceholder: {
    padding: materialTheme.spacing.sm,
    backgroundColor: materialTheme.colors.surfaceVariant,
    borderRadius: materialTheme.borderRadius.md,
  },
  cropImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: materialTheme.borderRadius.lg,
    borderTopRightRadius: materialTheme.borderRadius.lg,
    marginBottom: materialTheme.spacing.md,
    backgroundColor: materialTheme.colors.surfaceVariant,
  },
  trendText: {
    color: materialTheme.colors.onSurface,
    opacity: 0.7,
    fontSize: 12,
  },
  bottomNav: {
    position: 'absolute',
    left: materialTheme.spacing.lg,
    right: materialTheme.spacing.lg,
    bottom: materialTheme.spacing.sm,
    backgroundColor: materialTheme.colors.surface,
    borderRadius: materialTheme.borderRadius.card,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: materialTheme.spacing.sm,
    paddingHorizontal: materialTheme.spacing.md,
    borderWidth: 1,
    borderColor: materialTheme.colors.outline,
  },
  bottomNavItem: {
    alignItems: 'center',
    padding: 8,
  },
  bottomNavItemActive: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: materialTheme.colors.primaryContainer,
    borderRadius: 12,
  },
  bottomNavText: {
    color: materialTheme.colors.onSurface,
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    right: materialTheme.spacing.lg,
    bottom: materialTheme.spacing.lg * 2,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: materialTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginLeft: 12 },
});
