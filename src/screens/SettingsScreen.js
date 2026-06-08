import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { materialTheme } from '../theme';
import { avatars, illustrations } from '../assets';

export const SettingsScreen = ({ navigation }) => {
  const [unitsMetric, setUnitsMetric] = useState(true);
  const [languageEnglish, setLanguageEnglish] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.screen} edges={["top","bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image source={illustrations.profileLeaves} style={styles.profileLeaves} />
        <View style={styles.profileCard}>
          <Image source={avatars.farmer} style={styles.avatarPlaceholder} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Yesh</Text>
            <Text style={styles.profileEmail}>yesh@example.com</Text>
          </View>
          <Feather name="edit-2" size={18} color={materialTheme.colors.surface} />
        </View>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>Units</Text>
              <Text style={styles.rowDetails}>{unitsMetric ? 'Metric' : 'Imperial'}</Text>
            </View>
            <Switch
              value={unitsMetric}
              onValueChange={setUnitsMetric}
              trackColor={{ false: materialTheme.colors.outline, true: materialTheme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>Language</Text>
              <Text style={styles.rowDetails}>{languageEnglish ? 'English' : 'Hindi'}</Text>
            </View>
            <Switch
              value={languageEnglish}
              onValueChange={setLanguageEnglish}
              trackColor={{ false: materialTheme.colors.outline, true: materialTheme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>Dark Mode</Text>
              <Text style={styles.rowDetails}>Material theme comes in light mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: materialTheme.colors.outline, true: materialTheme.colors.error }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: materialTheme.spacing.lg }]}>About</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.detailRow}>
            <Text style={styles.rowLabel}>Version</Text>
            <Text style={styles.rowDetails}>1.0.0</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.detailRow}>
            <Text style={styles.rowLabel}>Rate the App</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.detailRow}>
            <Text style={styles.rowLabel}>About CropSentinel</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: materialTheme.spacing.xl,
    paddingHorizontal: materialTheme.spacing.lg,
    paddingBottom: materialTheme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: materialTheme.colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: materialTheme.colors.onSurface,
    fontSize: 20,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    padding: materialTheme.spacing.lg,
    paddingBottom: materialTheme.spacing.xl,
  },
  profileCard: {
    backgroundColor: materialTheme.colors.primary,
    borderRadius: materialTheme.borderRadius.card,
    padding: materialTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: materialTheme.spacing.lg,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: materialTheme.colors.surface,
    marginRight: materialTheme.spacing.md,
  },
  profileInfo: { flex: 1 },
  profileName: { color: materialTheme.colors.surface, fontSize: 18, fontWeight: '700' },
  profileEmail: { color: materialTheme.colors.surface, opacity: 0.9, marginTop: 4 },
  sectionTitle: {
    color: materialTheme.colors.onSurface,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: materialTheme.spacing.sm,
  },
  card: {
    backgroundColor: materialTheme.colors.surface,
    borderRadius: materialTheme.borderRadius.lg,
    padding: materialTheme.spacing.md,
    shadowColor: materialTheme.colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: materialTheme.spacing.sm,
  },
  detailRow: {
    paddingVertical: materialTheme.spacing.sm,
  },
  rowLabel: {
    color: materialTheme.colors.onSurface,
    fontSize: 15,
    fontWeight: '600',
  },
  rowDetails: {
    color: materialTheme.colors.onSurface,
    opacity: 0.7,
    marginTop: 4,
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: materialTheme.colors.outline,
    marginVertical: materialTheme.spacing.sm,
  },
});
