import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  SafeAreaView
} from 'react-native';
import { ArrowLeft, ExternalLink, ShieldCheck, Calendar, UserCheck } from 'lucide-react-native';

export default function TrendingDetailScreen({ item, onBack }) {
  if (!item) return null;

  const handleOpenReport = () => {
    if (item.url) {
      Linking.openURL(item.url).catch((err) =>
        console.error("Failed to open report URL:", err)
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top back navigation */}
      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={16} color="#1A365D" style={{ marginRight: 4 }} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        {item.url && (
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenReport}>
            <Text style={styles.actionButtonText}>Full Report</Text>
            <ExternalLink size={12} color="#FFFFFF" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Details Card */}
        <View style={styles.mainCard}>
          
          {/* Header info */}
          <View style={styles.cardHeader}>
            <Text style={styles.reportTitle}>Misinformation Report</Text>
            <View style={styles.metaRow}>
              <View style={styles.idBadge}>
                <Text style={styles.idBadgeText}>ID: #{item.id.toString().padStart(6, '0')}</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.calendarRow}>
                <Calendar size={12} color="rgba(0, 0, 0, 0.4)" style={{ marginRight: 4 }} />
                <Text style={styles.metaDate}>{item.date}</Text>
              </View>
            </View>
          </View>

          {/* Large Image Component */}
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item.image }} style={styles.detailImage} />
            <View style={styles.imageOverlay} />
            
            {/* Status floating card inside image */}
            <View style={styles.statusFloatingBox}>
              <Text style={styles.statusLabel}>Current Status</Text>
              <Text style={styles.statusValue}>{item.status}</Text>
            </View>
          </View>

          {/* Details body */}
          <View style={styles.detailsBody}>
            <Text style={styles.claimTitle}>{item.title}</Text>
            <Text style={styles.claimExcerpt}>{item.excerpt}</Text>

            {/* Verdict and confidence metric grid */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Verdict</Text>
                <Text style={styles.metricValue}>{item.status}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Confidence</Text>
                <Text style={[styles.metricValue, { color: '#65A9E0' }]}>{item.confidence}%</Text>
              </View>
            </View>

            {/* Fact Check Author Info */}
            <View style={styles.authorRow}>
              <Image source={{ uri: item.author.avatar }} style={styles.authorAvatar} />
              <View style={styles.authorMeta}>
                <Text style={styles.authorName}>{item.author.name}</Text>
                <Text style={styles.authorRole}>{item.author.role}</Text>
              </View>
              <UserCheck size={18} color="#65A9E0" style={{ marginRight: 4 }} />
            </View>
          </View>

          {/* Extended Analysis Text */}
          <View style={styles.analysisFooter}>
            <View style={styles.footerSectionHeader}>
              <ShieldCheck size={16} color="#1A365D" style={{ marginRight: 6 }} />
              <Text style={styles.analysisTitle}>Claim Analysis</Text>
            </View>
            <Text style={styles.analysisDescription}>
              This claim originated from <Text style={styles.boldText}>{item.author.name}</Text> and was reviewed on {item.date}. The consensus from global fact-checking organizations is that this information is categorized as <Text style={[styles.boldText, { color: '#65A9E0' }]}>{item.status}</Text>. We highly recommend users cross-reference similar articles with verified media outlets before distributing it further.
            </Text>
          </View>

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
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  backButtonText: {
    fontSize: 12,
    color: '#1A365D',
    fontWeight: '700',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#65A9E0',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#65A9E0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(228, 237, 255, 0.6)',
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A365D',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idBadge: {
    backgroundColor: '#E4EDFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  idBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1A365D',
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginHorizontal: 8,
  },
  calendarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaDate: {
    fontSize: 11,
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: '600',
  },
  imageWrapper: {
    height: 200,
    position: 'relative',
  },
  detailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 54, 93, 0.3)',
  },
  statusFloatingBox: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#E4EDFF',
  },
  detailsBody: {
    padding: 16,
  },
  claimTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#000000',
    lineHeight: 22,
    marginBottom: 10,
  },
  claimExcerpt: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.65)',
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
    backgroundColor: 'rgba(228, 237, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(228, 237, 255, 0.6)',
    borderRadius: 12,
    padding: 10,
    marginRight: 6,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#65A9E0',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A365D',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(228, 237, 255, 0.6)',
    borderRadius: 30,
    padding: 8,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  authorMeta: {
    flex: 1,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '750',
    color: '#1A365D',
  },
  authorRole: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: '500',
  },
  analysisFooter: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(228, 237, 255, 0.6)',
  },
  footerSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  analysisTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A365D',
  },
  analysisDescription: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.7)',
    lineHeight: 18,
    fontWeight: '500',
  },
  boldText: {
    fontWeight: '700',
  },
});
