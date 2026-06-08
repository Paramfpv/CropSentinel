import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const zoneColors = {
  drought: '#b71c1c',
  pest: '#ef6c00',
  waterlogging: '#1565c0',
  healthy: '#2e7d32',
};

export const FarmDetailScreen = ({ navigation, route }) => {
  const farm = route.params?.farm || {};
  const { name = 'Farm Detail', health_score = 0, zone_type = 'healthy', crop_type = 'Unknown' } = farm;
  const healthIsGood = health_score >= 75;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{name}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBlock}>
          <Text style={styles.sectionLabel}>Crop Type</Text>
          <Text style={styles.sectionValue}>{crop_type}</Text>
        </View>

        <View style={styles.healthSection}>
          <Text style={styles.healthLabel}>Health Score</Text>
          <View style={[styles.healthBadge, healthIsGood ? styles.healthGood : styles.healthPoor]}>
            <Text style={styles.healthBadgeText}>{health_score}</Text>
          </View>
        </View>

        <View style={[styles.zoneChip, { backgroundColor: zoneColors[zone_type] || '#424242' }]}> 
          <Text style={styles.zoneText}>{zone_type}</Text>
        </View>

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderLabel}>Satellite Map - Coming D2</Text>
        </View>

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderLabel}>NDVI Trend Chart - Coming D4</Text>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('InterventionDetail', { farmId: farm.id })}
        >
          <Text style={styles.actionButtonText}>View Intervention</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a3c2e',
  },
  header: {
    paddingTop: 54,
    paddingBottom: 18,
    paddingHorizontal: 24,
    backgroundColor: '#183526',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#A8E6A1',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 48,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  infoBlock: {
    marginTop: 24,
    backgroundColor: '#21482e',
    borderRadius: 18,
    padding: 20,
  },
  sectionLabel: {
    color: '#B9E6B9',
    fontSize: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  healthSection: {
    marginTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  healthLabel: {
    color: '#B9E6B9',
    fontSize: 14,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  healthBadge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  healthGood: {
    backgroundColor: '#2e7d32',
  },
  healthPoor: {
    backgroundColor: '#b71c1c',
  },
  healthBadgeText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
  },
  zoneChip: {
    alignSelf: 'flex-start',
    marginTop: 22,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  zoneText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  placeholderCard: {
    marginTop: 22,
    backgroundColor: '#2b4d39',
    borderRadius: 18,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderLabel: {
    color: '#B0C9B0',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButton: {
    marginTop: 28,
    backgroundColor: '#2e7d32',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
