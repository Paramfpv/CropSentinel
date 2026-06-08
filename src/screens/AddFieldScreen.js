import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { materialTheme } from '../theme';

export const AddFieldScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.screen} edges={["top","bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color={materialTheme.colors.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Field</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.card}>
        <Text style={styles.subtitle}>Add a new field to your dashboard.</Text>
        <Text style={styles.body}>
          This screen is a safe placeholder for the Add Field flow and maintains app navigation without runtime errors.
        </Text>
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
    paddingTop: materialTheme.spacing.sm,
    paddingHorizontal: materialTheme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: materialTheme.spacing.md,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: materialTheme.colors.onSurface,
    fontSize: 20,
    fontWeight: '700',
  },
  card: {
    backgroundColor: materialTheme.colors.surface,
    margin: materialTheme.spacing.lg,
    borderRadius: materialTheme.borderRadius.card,
    padding: materialTheme.spacing.lg,
    borderWidth: 1,
    borderColor: materialTheme.colors.outline,
  },
  subtitle: {
    color: materialTheme.colors.onSurface,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: materialTheme.spacing.sm,
  },
  body: {
    color: materialTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
