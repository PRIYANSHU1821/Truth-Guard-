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
  Eye,
  Maximize2,
  Minimize2
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_URL } from '../config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CANVAS_SIZE = SCREEN_WIDTH - 32;
const DEFAULT_BOX_WIDTH = CANVAS_SIZE - 40;

export default function GoogleLensScanner({ visible, onClose, onScanComplete }) {
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [error, setError] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [processTime, setProcessTime] = useState(null);
  const [boxHeight, setBoxHeight] = useState(160);

  // Animated value for Box position (Zero-lag UI thread movement)
  const pan = useRef(new Animated.ValueXY({ x: 20, y: 20 })).current;
  const boxPosRef = useRef({ x: 20, y: 20 });

  useEffect(() => {
    const listener = pan.addListener((val) => {
      boxPosRef.current = val;
    });
    return () => pan.removeListener(listener);
  }, [pan]);

  // PanResponder to allow zero-lag drag of marquee selection box
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
      onPanResponderTerminate: () => {
        pan.flattenOffset();
      }
    })
  ).current;

  // Animated laser scan line inside marquee box
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (imageUri) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 1600,
            useNativeDriver: true
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 1600,
            useNativeDriver: true
          })
        ])
      ).start();
    }
  }, [imageUri]);

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
        x: Math.round(boxPosRef.current.x || 20),
        y: Math.round(boxPosRef.current.y || 20),
        width: Math.round(DEFAULT_BOX_WIDTH),
        height: Math.round(boxHeight)
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
    outputRange: [0, Math.max(20, boxHeight - 6)]
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleGroup}>
            <ScanLine size={18} color="#38BDF8" style={{ marginRight: 8 }} />
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

                {/* Overlay Container */}
                <View style={styles.boxOverlayContainer}>
                  {/* Google Lens Marquee Bounding Box (Zero Lag Animated View) */}
                  <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                      styles.marqueeBox,
                      {
                        transform: pan.getTranslateTransform(),
                        width: DEFAULT_BOX_WIDTH,
                        height: boxHeight
                      }
                    ]}
                  >
                    {/* Glowing Corner Brackets */}
                    <View style={[styles.cornerBracket, styles.topLeftCorner]} />
                    <View style={[styles.cornerBracket, styles.topRightCorner]} />
                    <View style={[styles.cornerBracket, styles.bottomLeftCorner]} />
                    <View style={[styles.cornerBracket, styles.bottomRightCorner]} />

                    {/* Animated Laser Line */}
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
                  </Animated.View>
                </View>
              </View>
            ) : (
              <View style={styles.emptyViewport}>
                <View style={styles.lensIconRing}>
                  <ScanLine size={44} color="#38BDF8" />
                </View>
                <Text style={styles.emptyTitle}>Google Lens OCR & Detector</Text>
                <Text style={styles.emptySub}>
                  Scan newspapers, memes, articles, or screenshots to detect misinformation.
                </Text>
              </View>
            )}
          </View>

          {/* Preset Box Size Adjustment Bar (When Image Loaded) */}
          {imageUri && (
            <View style={styles.boxControlsRow}>
              <Text style={styles.boxControlLabel}>Box Size:</Text>
              <TouchableOpacity
                style={[styles.sizeChip, boxHeight === 100 && styles.activeSizeChip]}
                onPress={() => setBoxHeight(100)}
              >
                <Text style={[styles.sizeChipText, boxHeight === 100 && styles.activeSizeChipText]}>Compact</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sizeChip, boxHeight === 160 && styles.activeSizeChip]}
                onPress={() => setBoxHeight(160)}
              >
                <Text style={[styles.sizeChipText, boxHeight === 160 && styles.activeSizeChipText]}>Medium</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sizeChip, boxHeight === 260 && styles.activeSizeChip]}
                onPress={() => setBoxHeight(260)}
              >
                <Text style={[styles.sizeChipText, boxHeight === 260 && styles.activeSizeChipText]}>Full View</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Action Toolbar */}
          <View style={styles.toolbar}>
            <TouchableOpacity style={styles.toolBtn} onPress={handleTakeCameraPhoto}>
              <Camera size={18} color="#FFFFFF" />
              <Text style={styles.toolBtnText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolBtn} onPress={handlePickGalleryImage}>
              <ImageIcon size={18} color="#FFFFFF" />
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
                  <Eye size={14} color="#38BDF8" style={{ marginRight: 4 }} />
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
    backgroundColor: '#0B132B'
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 14,
    backgroundColor: '#1C2541',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)'
  },
  closeBtn: {
    padding: 8,
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
    backgroundColor: '#1C2541',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14
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
    borderWidth: 2,
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderRadius: 6
  },
  cornerBracket: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderColor: '#00F0FF'
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
    backgroundColor: '#00F0FF',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4
  },
  dragLabelTag: {
    position: 'absolute',
    bottom: -24,
    alignSelf: 'center',
    backgroundColor: 'rgba(11, 19, 43, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)'
  },
  dragLabelText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700'
  },
  emptyViewport: {
    alignItems: 'center',
    paddingHorizontal: 24
  },
  lensIconRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)'
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
  boxControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
    backgroundColor: '#1C2541',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20
  },
  boxControlLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4
  },
  sizeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)'
  },
  activeSizeChip: {
    backgroundColor: '#2563EB'
  },
  sizeChipText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700'
  },
  activeSizeChipText: {
    color: '#FFFFFF'
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C2541',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
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
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 22,
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
    fontSize: 13
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
    backgroundColor: '#1C2541',
    borderRadius: 22,
    padding: 18,
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
    fontSize: 11,
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
    backgroundColor: 'rgba(11, 19, 43, 0.6)',
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
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)'
  },
  explanationText: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 20
  }
});
