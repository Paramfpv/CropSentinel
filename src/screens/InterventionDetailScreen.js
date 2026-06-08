import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const interventionDetails = {
  action: 'Irrigate immediately - moisture level critically low',
  irrigation_mm: 35,
  cost_inr: 1200,
  risk_inr: 45000,
  confidence: 0.91,
};

export const InterventionDetailScreen = ({ navigation, route }) => {
  const farmId = route.params?.farmId || 'farm_001';
  const confidencePercent = Math.round(interventionDetails.confidence * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Intervention</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.actionText}>{interventionDetails.action}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Irrigation</Text>
            <Text style={styles.statValue}>{interventionDetails.irrigation_mm} mm</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Cost</Text>
            <Text style={styles.statValue}>₹{interventionDetails.cost_inr}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Yield Risk</Text>
            <Text style={styles.statValue}>₹{interventionDetails.risk_inr}</Text>
          </View>
        </View>

        <View style={styles.confidenceSection}>
          <Text style={styles.confidenceLabel}>AI Confidence</Text>
          <View style={styles.confidenceBarBackground}>
            <View style={[styles.confidenceBarFill, { width: `${confidencePercent}%` }]} />
          </View>
          <Text style={styles.confidencePercent}>{confidencePercent}%</Text>
        </View>

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>Mandi Price Chart - Coming D4</Text>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('InterventionDetail', { farmId })}
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
  headerTitle: {
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
  actionText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 34,
    marginTop: 24,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  statLabel: {
    color: '#7a7a7a',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statValue: {
    color: '#1a3c2e',
    fontSize: 18,
    fontWeight: '800',
  },
  confidenceSection: {
    marginBottom: 24,
  },
  confidenceLabel: {
    color: '#B9E6B9',
    fontSize: 14,
    marginBottom: 12,
    letterSpacing: 0.7,
  },
  confidenceBarBackground: {
    height: 14,
    backgroundColor: '#21482e',
    borderRadius: 12,
    overflow: 'hidden',
  },
  confidenceBarFill: {
    height: '100%',
    backgroundColor: '#2e7d32',
  },
  confidencePercent: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },
  placeholderCard: {
    backgroundColor: '#2b4d39',
    borderRadius: 18,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  placeholderText: {
    color: '#B0C9B0',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#2e7d32',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
