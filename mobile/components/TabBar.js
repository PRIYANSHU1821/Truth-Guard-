import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Shield, TrendingUp, BookOpen, ScanLine } from 'lucide-react-native';

export default function TabBar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Verify', Icon: Shield },
    { id: 'lens', label: 'Truth Lens', Icon: ScanLine },
    { id: 'trending', label: 'Trending', Icon: TrendingUp },
    { id: 'guidelines', label: 'Guidelines', Icon: BookOpen },
  ];


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.Icon;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <IconComponent
                size={22}
                color={isActive ? '#1A365D' : 'rgba(26, 54, 93, 0.5)'}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 24,
    paddingVertical: 10,
    marginHorizontal: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  activeTabButton: {
    transform: [{ scale: 1.05 }],
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    color: 'rgba(26, 54, 93, 0.6)',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#1A365D',
    fontWeight: '700',
  },
});
