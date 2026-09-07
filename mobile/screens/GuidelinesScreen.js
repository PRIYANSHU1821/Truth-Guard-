import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import { BookOpen, ShieldCheck, EyeOff, AlertTriangle, Scale } from 'lucide-react-native';

export default function GuidelinesScreen() {
  const sections = [
    {
      title: "1. Our Vision",
      body: "TruthGuard acts as a digital shield. We combine AI credibility checking with global fact-checking networks to restore trust in information and help fight against hoaxes in the digital age.",
      Icon: BookOpen,
      color: '#65A9E0',
    },
    {
      title: "2. How it Works",
      body: "Input text or URLs to get started. Our AI models analyze arguments, claims, logical structure, and language credibility to return a Confidence Score and a detailed truth Verdict.",
      Icon: ShieldCheck,
      color: '#10B981',
    },
    {
      title: "3. AI Limitations",
      body: "Generative AI is not infallible and can sometimes misinterpret context or hallucinate facts. Treat results as a 'second opinion' and always verify critical news manually.",
      Icon: AlertTriangle,
      color: '#F97316',
    },
    {
      title: "4. Privacy Policy",
      body: "We employ a strict 'Zero Storage Policy'. Your input texts and URLs are processed in memory in real-time, never permanently saved or stored on our servers.",
      Icon: EyeOff,
      color: '#EF4444',
    },
    {
      title: "5. User Responsibility",
      body: "We promote 'Trust, but Verify'. Users are ultimately responsible for the information they consume and share. Cross-reference important medical, political, or safety information.",
      Icon: Scale,
      color: '#8B5CF6',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>Documentation</Text>
        </View>
        <Text style={styles.headerTitle}>Guidelines & Ethics</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.introText}>
          Welcome to TruthGuard. To ensure correct interpretation of AI ratings and maintain ethical consumption, please review our core operational principles:
        </Text>

        {sections.map((sec, index) => {
          const IconComponent = sec.Icon;
          return (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrapper, { backgroundColor: sec.color + '15' }]}>
                  <IconComponent size={20} color={sec.color} />
                </View>
                <Text style={styles.cardTitle}>{sec.title}</Text>
              </View>
              <Text style={styles.cardBody}>{sec.body}</Text>
            </View>
          );
        })}

        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>© 2026 TruthGuard Project. All Rights Reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 16,
  },
  headerBadge: {
    backgroundColor: '#E4EDFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#65A9E0',
    marginBottom: 8,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A365D',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '850',
    color: '#000000',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  introText: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.6)',
    lineHeight: 19,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A365D',
  },
  cardBody: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.7)',
    lineHeight: 18,
    fontWeight: '500',
    paddingLeft: 4,
  },
  footerNote: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerNoteText: {
    fontSize: 11,
    color: 'rgba(0, 0, 0, 0.35)',
    fontWeight: '600',
  },
});
