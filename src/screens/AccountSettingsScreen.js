import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { materialTheme } from '../theme';
import { useDemoState } from '../config/demoState';
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

export const AccountSettingsScreen = ({ navigation }) => {
  const { language, profileName, profileEmail, setProfileName, setProfileEmail } = useDemoState();
  const t = translations[language] || translations.en;

  const [name, setName] = useState(profileName);
  const [email, setEmail] = useState(profileEmail);

  const handleSave = () => {
    triggerHapticSelection();
    if (!name.trim()) {
      Alert.alert(t.validationError, t.enterValidName);
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert(t.validationError, t.enterValidEmail);
      return;
    }

    setProfileName(name.trim());
    setProfileEmail(email.trim());

    triggerHapticSuccess();
    Alert.alert(
      t.success,
      t.settingsUpdated,
      [
        {
          text: t.ok,
          onPress: () => {
            triggerHapticSelection();
            navigation.goBack();
          }
        }
      ]
    );
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
        <Text style={styles.headerTitle}>{t.accountSettings}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{t.fullNameLabel}</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder={t.enterName}
            placeholderTextColor={materialTheme.colors.textSecondary}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{t.emailAddressLabel}</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            placeholder={t.enterEmail}
            placeholderTextColor={materialTheme.colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{t.saveChanges}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: materialTheme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: materialTheme.spacing.lg, paddingVertical: materialTheme.spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: materialTheme.colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: materialTheme.colors.outline },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: materialTheme.colors.onSurface },
  headerSpacer: { width: 40 },
  content: { paddingHorizontal: materialTheme.spacing.lg, paddingTop: materialTheme.spacing.xl },
  fieldGroup: { marginBottom: materialTheme.spacing.lg },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: materialTheme.colors.textSecondary, marginBottom: materialTheme.spacing.xs },
  textInput: { height: 48, backgroundColor: materialTheme.colors.surface, borderWidth: 1, borderColor: materialTheme.colors.outline, borderRadius: materialTheme.borderRadius.button, paddingHorizontal: 16, fontSize: 15, color: materialTheme.colors.onSurface },
  saveBtn: { backgroundColor: materialTheme.colors.primary, borderRadius: materialTheme.borderRadius.button, paddingVertical: 14, alignItems: 'center', marginTop: materialTheme.spacing.lg },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
