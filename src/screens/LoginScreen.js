import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { materialTheme } from '../theme';
import { illustrations } from '../assets';
import { useDemoState } from '../config/demoState';
import { translations } from '../constants/translations';
import { login } from '../services';

const triggerHapticSelection = async () => {
  try {
    await Haptics.selectionAsync();
  } catch (e) {}
};

export const LoginScreen = ({ navigation }) => {
  const { language, setAuthToken, setProfileEmail, setProfileName } = useDemoState();
  const t = translations[language] || translations.en;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgotPress = () => {
    triggerHapticSelection();
    Alert.alert(
      t.forgotPasswordTitle,
      t.forgotPasswordMsg,
      [{ text: t.ok }]
    );
  };

  const handleSocialPress = (platform) => {
    triggerHapticSelection();
    Alert.alert(
      t.socialIntegrationTitle,
      `${t.socialIntegrationMsg} (${platform})`,
      [{ text: t.ok }]
    );
  };

  const handleLogin = async () => {
    triggerHapticSelection();
    if (!email.trim()) {
      Alert.alert(t.validationError, "Please enter your mobile phone or email.");
      return;
    }
    setLoading(true);
    try {
      const response = await login(email.trim());
      if (response && response.access_token) {
        setAuthToken(response.access_token);
        if (response.user) {
          setProfileEmail(response.user.phone_number);
          setProfileName(`Farmer ${response.user.id}`);
        }
      }
      navigation.replace('MyFarms');
    } catch (error) {
      console.warn("Login failed:", error);
      Alert.alert("Login Failed", error.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <Image source={illustrations.leavesTopRight} style={styles.decorativeLeaf} resizeMode="contain" />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcome}>{t.welcomeBack}</Text>
          <Text style={styles.subtitle}>{t.loginToContinue}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <Feather name="mail" size={18} color={materialTheme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t.email}
                placeholderTextColor={materialTheme.colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <Text style={styles.inputHint}>example@email.com</Text>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <Feather name="lock" size={18} color={materialTheme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t.password}
                placeholderTextColor={materialTheme.colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                onPress={() => {
                  triggerHapticSelection();
                  setShowPassword(!showPassword);
                }} 
                style={styles.eyeBtn}
              >
                <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color={materialTheme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputHint}>••••••••••••</Text>
          </View>

          <TouchableOpacity style={styles.forgotBtn} onPress={handleForgotPress}>
            <Text style={styles.forgotText}>{t.forgotPassword}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginBtn, loading && { opacity: 0.7 }]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginText}>{loading ? "Connecting..." : t.login}</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>{t.orContinueWith}</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialPress("Google")}>
              <Text style={styles.socialText}>G</Text>
              <Text style={styles.socialLabel}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialPress("Apple")}>
              <FontAwesome name="apple" size={16} color={materialTheme.colors.onSurface} />
              <Text style={styles.socialLabel}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.signupRow} 
          onPress={() => {
            triggerHapticSelection();
            navigation.navigate('Onboarding');
          }}
        >
          <Text style={styles.signupText}>{t.newFarmer}</Text>
          <Text style={styles.signupAction}>{t.createAccount}</Text>
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
  container: {
    flex: 1,
    paddingHorizontal: materialTheme.spacing.xl,
    justifyContent: 'center',
  },
  decorativeLeaf: {
    position: 'absolute',
    top: -15,
    right: -10,
    width: 180,
    height: 180,
    resizeMode: 'contain',
    zIndex: 1,
  },
  header: {
    marginBottom: materialTheme.spacing.xl,
  },
  welcome: {
    fontSize: 28,
    fontWeight: '700',
    color: materialTheme.colors.onSurface,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: materialTheme.colors.textSecondary,
    marginTop: materialTheme.spacing.xs,
  },
  form: {
    backgroundColor: materialTheme.colors.surface,
    borderRadius: materialTheme.borderRadius.xl,
    padding: materialTheme.spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  inputGroup: {
    marginBottom: materialTheme.spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: materialTheme.colors.surfaceVariant,
    borderRadius: materialTheme.borderRadius.input,
    borderWidth: 1,
    borderColor: materialTheme.colors.outline,
    paddingHorizontal: materialTheme.spacing.md,
    height: 52,
  },
  inputIcon: {
    marginRight: materialTheme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: materialTheme.colors.onSurface,
  },
  eyeBtn: {
    padding: materialTheme.spacing.xs,
  },
  inputHint: {
    fontSize: 12,
    color: materialTheme.colors.textSecondary,
    marginTop: materialTheme.spacing.xs,
    marginLeft: 4,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: materialTheme.spacing.lg,
  },
  forgotText: {
    fontSize: 13,
    color: materialTheme.colors.primary,
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: materialTheme.colors.primaryDark,
    borderRadius: materialTheme.borderRadius.button,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: materialTheme.spacing.md,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  orText: {
    textAlign: 'center',
    color: materialTheme.colors.textSecondary,
    fontSize: 13,
    marginBottom: materialTheme.spacing.md,
  },
  socialRow: {
    flexDirection: 'row',
    gap: materialTheme.spacing.sm,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: materialTheme.colors.surfaceVariant,
    borderRadius: materialTheme.borderRadius.input,
    borderWidth: 1,
    borderColor: materialTheme.colors.outline,
    paddingVertical: 14,
    gap: materialTheme.spacing.sm,
  },
  socialText: {
    fontSize: 16,
    fontWeight: '700',
    color: materialTheme.colors.onSurface,
  },
  socialLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: materialTheme.colors.onSurface,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: materialTheme.spacing.xl,
  },
  signupText: {
    fontSize: 14,
    color: materialTheme.colors.textSecondary,
  },
  signupAction: {
    fontSize: 14,
    color: materialTheme.colors.primary,
    fontWeight: '700',
  },
});
