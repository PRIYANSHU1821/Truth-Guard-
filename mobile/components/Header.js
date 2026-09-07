import React from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView } from 'react-native';

export default function Header() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/truthguard-logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>TRUTHGUARD</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: -16, // Bleed to edges
    paddingHorizontal: 16,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A365D',
    letterSpacing: 2,
  },
});
