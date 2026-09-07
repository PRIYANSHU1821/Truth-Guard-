import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  Dimensions
} from 'react-native';
import { Sparkles, FileText, Link, ShieldAlert, CheckCircle, HelpCircle, RefreshCw, ScanLine } from 'lucide-react-native';
import axios from 'axios';
import { API_URL } from '../config';
import GoogleLensScanner from '../components/GoogleLensScanner';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('Text'); // 'Text' or 'Link'
  const [processTime, setProcessTime] = useState(null);
  const [lensModalVisible, setLensModalVisible] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    Keyboard.dismiss();

    setLoading(true);
    setResult(null);
    setError(null);
    setProcessTime(null);

    const startTime = Date.now();

    try {
      const response = await axios.post(`${API_URL}/api/analyze`, {
        text: inputText,
      });

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      setProcessTime(duration);
      setResult(response.data);
    } catch (err) {
      console.error('Analysis Error:', err);
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        'Could not connect to TruthGuard server. Please verify backend is active.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDetails = (label) => {
    if (!label) return { color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.2)', icon: HelpCircle };
    const lowerLabel = label.toLowerCase();

    if (lowerLabel.includes('misinformation') || lowerLabel.includes('hoax')) {
      return {
        color: '#EF4444',
        bg: 'rgba(239, 68, 68, 0.12)',
        border: 'rgba(239, 68, 68, 0.25)',
        icon: ShieldAlert
      };
    } else if (lowerLabel.includes('questionable') || lowerLabel.includes('unverified')) {
      return {
        color: '#F97316',
        bg: 'rgba(249, 115, 22, 0.12)',
        border: 'rgba(249, 115, 22, 0.25)',
        icon: ShieldAlert
      };
    } else if (lowerLabel.includes('satire') || lowerLabel.includes('opinion')) {
      return {
        color: '#D97706',
        bg: 'rgba(217, 119, 6, 0.12)',
        border: 'rgba(217, 119, 6, 0.25)',
        icon: HelpCircle
      };
    } else {
      return {
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.25)',
        icon: CheckCircle
      };
    }
  };

  const statusInfo = result ? getStatusDetails(result.label) : null;
  const StatusIcon = statusInfo ? statusInfo.icon : null;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>AI Misinformation Detection</Text>
      </View>

      {/* Header text */}
      <Text style={styles.headline}>
        Verify Before You <Text style={styles.headlineHighlight}>Trust</Text>
      </Text>
      <Text style={styles.subHeadline}>with TruthGuard</Text>

      {/* Main input card */}
      <View style={styles.card}>
        {/* Error message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Input box */}
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={4}
          value={inputText}
          onChangeText={setInputText}
          placeholder={mode === 'Text' ? 'Paste news or article text here...' : 'Paste link / URL here...'}
          placeholderTextColor="rgba(26, 54, 93, 0.4)"
        />

        {/* Input footer buttons */}
        <View style={styles.cardFooter}>
          {/* Mode Switcher */}
          <View style={styles.modeToggleGroup}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'Text' && styles.activeModeButton]}
              onPress={() => setMode('Text')}
            >
              <FileText size={14} color={mode === 'Text' ? '#FFFFFF' : '#1A365D'} />
              <Text style={[styles.modeButtonText, mode === 'Text' && styles.activeModeButtonText]}>Text</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'Link' && styles.activeModeButton]}
              onPress={() => setMode('Link')}
            >
              <Link size={14} color={mode === 'Link' ? '#FFFFFF' : '#1A365D'} />
              <Text style={[styles.modeButtonText, mode === 'Link' && styles.activeModeButtonText]}>Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, styles.lensModeButton]}
              onPress={() => setLensModalVisible(true)}
            >
              <ScanLine size={14} color="#FFFFFF" />
              <Text style={[styles.modeButtonText, styles.activeModeButtonText]}>Truth Lens</Text>
            </TouchableOpacity>
          </View>


          {/* Action button */}
          <TouchableOpacity
            style={[styles.analyzeButton, (!inputText || loading) && styles.disabledAnalyzeButton]}
            disabled={!inputText || loading}
            onPress={handleAnalyze}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.analyzeButtonText}>Processing</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Sparkles size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.analyzeButtonText}>Analyze</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Result Card */}
      {result && (
        <View style={styles.resultCard}>
          {/* Decorative background blur shape */}
          <View style={styles.decorativeShape} />

          {/* Top Row with processing details */}
          <View style={styles.resultHeader}>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg, borderColor: statusInfo.border }]}>
              {StatusIcon && <StatusIcon size={14} color={statusInfo.color} style={{ marginRight: 4 }} />}
              <Text style={[styles.statusBadgeText, { color: statusInfo.color }]}>
                {result.label}
              </Text>
            </View>

            {processTime && (
              <View style={styles.timeBadge}>
                <RefreshCw size={12} color="#65A9E0" style={{ marginRight: 4 }} />
                <Text style={styles.timeBadgeText}>{processTime}s</Text>
              </View>
            )}
          </View>

          {/* Confidence Indicator */}
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceValue}>
              {(result.confidence * 100).toFixed(0)}%
            </Text>
            <Text style={styles.confidenceLabel}>Confidence Score</Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${result.confidence * 100}%`, backgroundColor: statusInfo.color }]} />
          </View>

          {/* Explanation */}
          <View style={styles.explanationBubble}>
            <Text style={styles.explanationText}>
              "{result.explanation}"
            </Text>
          </View>

          {/* Verification source tag */}
          <Text style={styles.footerTag}>Verified by Google Gemini 2.5 Flash</Text>
        </View>
      )}

      {/* Google Lens OCR Modal */}
      <GoogleLensScanner
        visible={lensModalVisible}
        onClose={() => setLensModalVisible(false)}
      />

      {/* Spacing for keyboard offset */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  lensModeButton: {
    backgroundColor: '#2563EB',
  },

  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  badge: {
    alignSelf: 'center',
    backgroundColor: '#E4EDFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#65A9E0',
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A365D',
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 34,
  },
  headlineHighlight: {
    color: '#2563EB', // blue highlight color
  },
  subHeadline: {
    fontSize: 26,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 28,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '500',
  },
  textInput: {
    height: 120,
    color: '#000000',
    fontSize: 15,
    fontWeight: '500',
    textAlignVertical: 'top',
    padding: 8,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(228, 237, 255, 0.5)',
  },
  modeToggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#E4EDFF',
    borderRadius: 20,
    padding: 2,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  activeModeButton: {
    backgroundColor: '#65A9E0',
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A365D',
    marginLeft: 4,
  },
  activeModeButtonText: {
    color: '#FFFFFF',
  },
  analyzeButton: {
    backgroundColor: '#65A9E0',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#65A9E0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 2,
  },
  disabledAnalyzeButton: {
    backgroundColor: 'rgba(101, 169, 224, 0.6)',
    shadowOpacity: 0,
    elevation: 0,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultCard: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.12,
    shadowRadius: 25,
    elevation: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeShape: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#65A9E0',
    opacity: 0.1,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(228, 237, 255, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  timeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#65A9E0',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  confidenceValue: {
    fontSize: 42,
    fontWeight: '800',
    color: '#000000',
  },
  confidenceLabel: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.5)',
    marginLeft: 8,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E4EDFF',
    borderRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  explanationBubble: {
    backgroundColor: 'rgba(228, 237, 255, 0.3)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(228, 237, 255, 0.5)',
    marginBottom: 12,
  },
  explanationText: {
    color: '#1A365D',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  footerTag: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.35)',
    fontWeight: '500',
    textAlign: 'center',
  },
});
