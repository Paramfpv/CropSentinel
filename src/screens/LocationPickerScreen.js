import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { materialTheme } from '../theme';

export const LocationPickerScreen = ({ navigation }) => {
  const [selectedCoords, setSelectedCoords] = useState(null);

  const handleMapPress = (e) => {
    setSelectedCoords(e.nativeEvent.coordinate);
  };

  const handleConfirm = () => {
    if (!selectedCoords) {
      return;
    }
    // Navigate back to AddField screen passing coordinates
    navigation.navigate('AddField', { selectedLocation: selectedCoords });
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={materialTheme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Location</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={{
            latitude: 22.5937,
            longitude: 78.9629,
            latitudeDelta: 12,
            longitudeDelta: 12,
          }}
          onPress={handleMapPress}
        >
          {selectedCoords && (
            <Marker 
              coordinate={selectedCoords} 
              pinColor={materialTheme.colors.primary} 
            />
          )}
        </MapView>
      </View>

      <View style={styles.footer}>
        {selectedCoords ? (
          <View style={styles.coordsContainer}>
            <Text style={styles.coordsLabel}>Selected Coordinates</Text>
            <Text style={styles.coordsText}>
              Latitude: {selectedCoords.latitude.toFixed(4)}
            </Text>
            <Text style={styles.coordsText}>
              Longitude: {selectedCoords.longitude.toFixed(4)}
            </Text>
          </View>
        ) : (
          <Text style={styles.promptText}>Tap on the map to place your farm marker</Text>
        )}

        <TouchableOpacity 
          style={[styles.confirmBtn, !selectedCoords && styles.confirmBtnDisabled]} 
          onPress={handleConfirm}
          disabled={!selectedCoords}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmBtnText}>Use This Location</Text>
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
  headerSpacer: {
    width: 40,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: materialTheme.colors.outline,
    alignItems: 'center',
  },
  coordsContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  coordsLabel: {
    fontSize: 12,
    color: materialTheme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  coordsText: {
    fontSize: 15,
    fontWeight: '700',
    color: materialTheme.colors.onSurface,
  },
  promptText: {
    fontSize: 14,
    color: materialTheme.colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  confirmBtn: {
    width: '100%',
    backgroundColor: materialTheme.colors.primaryDark,
    borderRadius: materialTheme.borderRadius.button,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: '#A3A3A3',
    opacity: 0.6,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
