import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
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

export const HelpSupportScreen = ({ navigation }) => {
  const { language } = useDemoState();
  const t = translations[language] || translations.en;

  const handleContactSupport = (method) => {
    triggerHapticSelection();
    Alert.alert(
      t.contactSupportTitle,
      `${t.contactSupportMsg}${method}...`,
      [{ text: t.ok }]
    );
  };

  const faqs = [
    {
      q: t.faq1Q,
      a: t.faq1A
    },
    {
      q: t.faq2Q,
      a: t.faq2A
    },
    {
      q: t.faq3Q,
      a: t.faq3A
    }
  ];

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
        <Text style={styles.headerTitle}>{t.helpSupportHeader}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>{t.contactChannels}</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.channelItem} onPress={() => handleContactSupport("Email")}>
            <View style={styles.channelIcon}>
              <Feather name="mail" size={20} color={materialTheme.colors.primary} />
            </View>
            <View style={styles.channelDetails}>
              <Text style={styles.channelTitle}>{t.emailSupport}</Text>
              <Text style={styles.channelSub}>support@cropsentinel.com</Text>
            </View>
            <Feather name="chevron-right" size={18} color={materialTheme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.channelItem, { borderTopWidth: 1, borderTopColor: materialTheme.colors.outline }]} onPress={() => handleContactSupport("Phone")}>
            <View style={styles.channelIcon}>
              <Feather name="phone" size={20} color={materialTheme.colors.primary} />
            </View>
            <View style={styles.channelDetails}>
              <Text style={styles.channelTitle}>{t.tollFreeHelp}</Text>
              <Text style={styles.channelSub}>1800-456-7890</Text>
            </View>
            <Feather name="chevron-right" size={18} color={materialTheme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>{t.faqsTitle}</Text>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqCard}>
            <Text style={styles.faqQuestion}>{faq.q}</Text>
            <Text style={styles.faqAnswer}>{faq.a}</Text>
          </View>
        ))}
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
  content: { paddingHorizontal: materialTheme.spacing.lg, paddingTop: materialTheme.spacing.md, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: materialTheme.colors.onSurface, marginTop: materialTheme.spacing.md, marginBottom: materialTheme.spacing.sm },
  card: { backgroundColor: materialTheme.colors.surface, borderRadius: materialTheme.borderRadius.card, borderWidth: 1, borderColor: materialTheme.colors.outline, overflow: 'hidden', marginBottom: materialTheme.spacing.lg },
  channelItem: { flexDirection: 'row', alignItems: 'center', padding: materialTheme.spacing.md },
  channelIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: materialTheme.colors.primaryContainer, alignItems: 'center', justifyContent: 'center', marginRight: materialTheme.spacing.md },
  channelDetails: { flex: 1 },
  channelTitle: { fontSize: 15, fontWeight: '600', color: materialTheme.colors.onSurface },
  channelSub: { fontSize: 13, color: materialTheme.colors.textSecondary, marginTop: 2 },
  faqCard: { backgroundColor: materialTheme.colors.surface, borderRadius: materialTheme.borderRadius.card, borderWidth: 1, borderColor: materialTheme.colors.outline, padding: materialTheme.spacing.md, marginBottom: materialTheme.spacing.sm },
  faqQuestion: { fontSize: 14, fontWeight: '700', color: materialTheme.colors.onSurface, marginBottom: 6 },
  faqAnswer: { fontSize: 13, color: materialTheme.colors.textSecondary, lineHeight: 18 },
});
