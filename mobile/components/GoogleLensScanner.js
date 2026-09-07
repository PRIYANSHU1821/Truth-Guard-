import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  Dimensions,
  Animated,
  PanResponder,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import {
  Camera,
  Image as ImageIcon,
  Crop,
  Sparkles,
  X,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  Copy,
  ScanLine,
  ChevronRight,
  Eye
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_URL } from '../config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CANVAS_SIZE = SCREEN_WIDTH - 32;

export default function GoogleLensScanner({ visible, onClose, onScanComplete }) {
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [error, setError] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [processTime, setProcessTime] = useState(null);

  // Marquee crop selection box coordinates (normalized 0 to 100 percentages or px)
  const [box, setBox] = useState({
    x: 20,
    y: 20,
    w: CANVAS_SIZE - 40,
    h: 180
  });

  // Animated scanner line
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (imageUri) {
      // Start continuous vertical scan line animation inside box
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true
          })
        ])
      ).start();
    }
  }, [imageUri]);

  // PanResponder to allow drag and resize of marquee selection box
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        setBox((prev) => {
          const newX = Math.max(10, Math.min(CANVAS_SIZE - prev.w - 10, prev.x + gestureState.dx * 0.1));
          const newY = Math.max(10, Math.min(CANVAS_SIZE - prev.h - 10, prev.y + gestureState.dy * 0.1));
          return { ...prev, x: newX, y: newY };
        });
      }
    })
  ).current;

  // Camera Picker
  const handleTakeCameraPhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera access is needed to scan news text with Truth Lens.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        base64: true
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setImageBase64(asset.base64);
        setOcrResult(null);
        setError(null);
      }
    } catch (err) {
      console.error('Camera Error:', err);
      setError('Could not access camera.');
    }
  };

  // Gallery Picker
  const handlePickGalleryImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Gallery access is needed to select news images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        base64: true
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setImageBase64(asset.base64);
        setOcrResult(null);
        setError(null);
      }
    } catch (err) {
      console.error('Gallery Error:', err);
      setError('Could not select image from gallery.');
    }
  };

  // Execute Google Lens OCR & Fake News Detection
  const handleAnalyzeImage = async () => {
    if (!imageBase64) return;

    setLoading(true);
    setError(null);
    setOcrResult(null);
    const startTime = Date.now();

    try {
      const cropData = {
        x: Math.round(box.x),
        y: Math.round(box.y),
        width: Math.round(box.w),
        height: Math.round(box.h)
      };

      const response = await axios.post(`${API_URL}/api/analyze-image`, {
        image: imageBase64,
        mimeType: 'image/jpeg',
        cropBox: cropData
      });

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      setProcessTime(duration);
      setOcrResult(response.data);
      if (response.data.extractedText) {
        setExtractedText(response.data.extractedText);
      }
    } catch (err) {
      console.error('Lens Analysis Error:', err);
      const msg = err.response?.data?.detail || err.response?.data?.error || 'Failed to scan image. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDetails = (label) => {
    if (!label) return { color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.2)', icon: HelpCircle };
    const lower = label.toLowerCase();

    if (lower.includes('misinformation') || lower.includes('hoax')) {
      return { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.25)', icon: ShieldAlert };
    } else if (lower.includes('questionable') || lower.includes('unverified')) {
      return { color: '#F97316', bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.25)', icon: ShieldAlert };
    } else if (lower.includes('satire') || lower.includes('opinion')) {
      return { color: '#D97706', bg: 'rgba(217, 119, 6, 0.12)', border: 'rgba(217, 119, 6, 0.25)', icon: HelpCircle };
    } else {
      return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)', icon: CheckCircle };
    }
  };

  const statusInfo = ocrResult ? getStatusDetails(ocrResult.label) : null;
  const StatusIcon = statusInfo ? statusInfo.icon : null;

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, box.h - 4]
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleGroup}>
            <ScanLine size={18} color="#65A9E0" style={{ marginRight: 6 }} />
            <Text style={styles.headerTitle}>TRUTH LENS OCR</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollBody} keyboardShouldPersistTaps="handled">
          {/* Main Visual Lens Viewport */}
          <View style={styles.viewportContainer}>
            {imageUri ? (
              <View style={styles.canvasWrapper}>
                <Image source={{ uri: imageUri }} style={styles.scannedImage} resizeMode="contain" />

                {/* Dark Overlay Outside Bounding Box */}
                <View style={styles.boxOverlayContainer}>
                  {/* Google Lens Marquee Bounding Box */}
                  <View
                    {...panResponder.panHandlers}
                    style={[
                      styles.marqueeBox,
                      {
                        left: box.x,
                        top: box.y,
                        width: box.w,
                        height: box.h
                      }
                    ]}
                  >
                    {/* Google Lens Style Glowing Corner Brackets */}
                    <View style={[styles.cornerBracket, styles.topLeftCorner]} />
                    <View style={[styles.cornerBracket, styles.topRightCorner]} />
                    <View style={[styles.cornerBracket, styles.bottomLeftCorner]} />
                    <View style={[styles.cornerBracket, styles.bottomRightCorner]} />

                    {/* Animated Scanning Laser Line */}
                    <Animated.View
                      style={[
                        styles.scanLineBeam,
                        {
                          transform: [{ translateY }]
                        }
                      ]}
                    />

                    {/* Touch / Drag Instruction Tag */}
                    <View style={styles.dragLabelTag}>
                      <Text style={styles.dragLabelText}>Drag box over text</Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.emptyViewport}>
                <View style={styles.lensIconRing}>
                  <ScanLine size={48} color="#65A9E0" />
                </View>
                <Text style={styles.emptyTitle}>Google Lens Misinformation Detector</Text>
                <Text style={styles.emptySub}>
                  Scan newspapers, articles, memes, or screenshots to extract OCR text and detect fake news.
                </Text>
              </View>
            )}
          </View>

          {/* Action Toolbar */}
          <View style={styles.toolbar}>
            <TouchableOpacity style={styles.toolBtn} onPress={handleTakeCameraPhoto}>
              <Camera size={20} color="#FFFFFF" />
              <Text style={styles.toolBtnText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolBtn} onPress={handlePickGalleryImage}>
              <ImageIcon size={20} color="#FFFFFF" />
              <Text style={styles.toolBtnText}>Gallery</Text>
            </TouchableOpacity>

            {imageUri && (
              <TouchableOpacity
                style={[styles.scanActionBtn, loading && styles.disabledBtn]}
                disabled={loading}
                onPress={handleAnalyzeImage}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Sparkles size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.scanActionBtnText}>Scan Selection</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* OCR Result Card */}
          {ocrResult && (
            <View style={styles.resultContainer}>
              {/* Header */}
              <View style={styles.resultCardHeader}>
                <View style={[styles.statusTag, { backgroundColor: statusInfo.bg, borderColor: statusInfo.border }]}>
                  {StatusIcon && <StatusIcon size={14} color={statusInfo.color} style={{ marginRight: 4 }} />}
                  <Text style={[styles.statusTagText, { color: statusInfo.color }]}>
                    {ocrResult.label}
                  </Text>
                </View>

                {processTime && (
                  <View style={styles.timeTag}>
                    <RefreshCw size={12} color="#65A9E0" style={{ marginRight: 4 }} />
                    <Text style={styles.timeTagText}>{processTime}s</Text>
                  </View>
                )}
              </View>

              {/* Extracted OCR Text Preview */}
              <View style={styles.ocrSection}>
                <View style={styles.ocrHeaderRow}>
                  <Eye size={14} color="#65A9E0" style={{ marginRight: 4 }} />
                  <Text style={styles.ocrSectionTitle}>Extracted OCR Text:</Text>
                </View>
                <Text style={styles.ocrTextPreview} numberOfLines={4}>
                  "{ocrResult.extractedText || 'No text recognized'}"
                </Text>
              </View>

              {/* Confidence Bar */}
              <View style={styles.confidenceRow}>
                <Text style={styles.confidenceScore}>
                  {(ocrResult.confidence * 100).toFixed(0)}%
                </Text>
                <Text style={styles.confidenceText}>Confidence Score</Text>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${ocrResult.confidence * 100}%`, backgroundColor: statusInfo.color }]} />
              </View>

              {/* AI Verdict Explanation */}
              <View style={styles.explanationCard}>
                <Text style={styles.explanationText}>"{ocrResult.explanation}"</Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A'
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 14,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)'
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5
  },
  scrollBody: {
    padding: 16,
    alignItems: 'center'
  },
  viewportContainer: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(101, 169, 224, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  canvasWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  scannedImage: {
    width: '100%',
    height: '100%'
  },
  boxOverlayContainer: {
    ...StyleSheet.absoluteFillObject
  },
  marqueeBox: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: 'rgba(101, 169, 224, 0.8)',
    backgroundColor: 'rgba(101, 169, 224, 0.08)'
  },
  cornerBracket: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#38BDF8'
  },
  topLeftCorner: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 4
  },
  topRightCorner: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 4
  },
  bottomLeftCorner: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 4
  },
  bottomRightCorner: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 4
  },
  scanLineBeam: {
    height: 3,
    backgroundColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4
  },
  dragLabelTag: {
    position: 'absolute',
    bottom: -24,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10
  },
  dragLabelText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600'
  },
  emptyViewport: {
    alignItems: 'center',
    paddingHorizontal: 24
  },
  lensIconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(101, 169, 224, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(101, 169, 224, 0.3)'
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8
  },
  emptySub: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24
  },
  toolBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 6
  },
  scanActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 3
  },
  disabledBtn: {
    opacity: 0.6
  },
  scanActionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14
  },
  errorBox: {
    width: '100%',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    padding: 12,
    borderRadius: 16,
    marginBottom: 16
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 13,
    textAlign: 'center'
  },
  resultContainer: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 40
  },
  resultCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1
  },
  statusTagText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(228, 237, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10
  },
  timeTagText: {
    fontSize: 11,
    color: '#65A9E0',
    fontWeight: '700'
  },
  ocrSection: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  ocrHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  ocrSectionTitle: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700'
  },
  ocrTextPreview: {
    color: '#E2E8F0',
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6
  },
  confidenceScore: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  confidenceText: {
    color: '#94A3B8',
    fontSize: 12,
    marginLeft: 8
  },
  progressBg: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    marginBottom: 14,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 3
  },
  explanationCard: {
    backgroundColor: 'rgba(101, 169, 224, 0.1)',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(101, 169, 224, 0.2)'
  },
  explanationText: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 20
  }
});
