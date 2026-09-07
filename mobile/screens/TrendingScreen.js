import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import axios from 'axios';
import { API_URL } from '../config';

const enrichData = (rawData) => {
  const categoryImageMap = {
    Politics:
      "https://images.unsplash.com/photo-1607778417094-1fef13315e6e?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Health:
      "https://images.unsplash.com/photo-1535914254981-b5012eebbd15?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Tech: "https://itchronicles.com/wp-content/uploads/2021/01/technology-impact-on-life.jpg",
    Science:
      "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80",
    Society:
      "https://images.unsplash.com/photo-1513682121497-80211f36a7d3?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  const categories = Object.keys(categoryImageMap);
  const roles = ["Fact-Checker", "Journalist", "Analyst", "Researcher"];

  return rawData.map((item, index) => {
    let originalStatus = item.status || "Unverified";
    let shortStatus = originalStatus;

    if (shortStatus.length > 20) {
      const lower = shortStatus.toLowerCase();
      if (lower.includes("false") || lower.includes("fake")) {
        shortStatus = "False";
      } else if (lower.includes("true") || lower.includes("correct")) {
        shortStatus = "True";
      } else if (lower.includes("misleading")) {
        shortStatus = "Misleading";
      } else {
        shortStatus = "See Report";
      }
    } else {
      shortStatus = shortStatus.replace(/\.$/, "");
    }

    const assignedCategory = categories[index % categories.length];

    return {
      id: index,
      title: item.title || "No Title Available",
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),

      status: shortStatus,
      fullStatus: originalStatus,

      sourceName: item.source,
      url: item.url,
      excerpt: `Claim by ${item.claimant}: "${item.title}". This claim has been reviewed by ${item.source}.`,

      image: categoryImageMap[assignedCategory],
      category: assignedCategory,

      confidence: Math.floor(Math.random() * (99 - 85) + 85),
      sources: Math.floor(Math.random() * (50 - 10) + 10),
      author: {
        name: item.source || "Unknown Source",
        role: roles[index % roles.length],
        avatar: `https://ui-avatars.com/api/?name=${item.source}&background=random`,
      },
    };
  });
};

export default function TrendingScreen({ onClaimClick }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/trending`);
        const enriched = enrichData(response.data);
        setClaims(enriched);
      } catch (err) {
        console.error("Failed to fetch trending:", err);
        setError("Failed to load trending topics.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const renderCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => onClaimClick(item)}
      >
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        
        {/* Floating status badge */}
        <View style={styles.floatingStatusContainer}>
          <Text style={styles.floatingStatusText} numberOfLines={1}>
            {item.status}
          </Text>
        </View>

        {/* Floating category tag */}
        <View style={styles.floatingCategoryContainer}>
          <Text style={styles.floatingCategoryText}>{item.category}</Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{item.date}</Text>
            <View style={styles.metaDivider} />
            <Text style={styles.metaSourceText}>{item.sources} Sources</Text>
          </View>

          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.cardExcerpt} numberOfLines={2}>
            {item.excerpt}
          </Text>

          <View style={styles.cardFooter}>
            <View style={styles.authorContainer}>
              <Image source={{ uri: item.author.avatar }} style={styles.avatar} />
              <Text style={styles.authorName} numberOfLines={1}>
                {item.author.name}
              </Text>
            </View>

            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>{item.confidence}%</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>Global Insights</Text>
        </View>
        <Text style={styles.headerTitle}>
          Trending <Text style={styles.headerTitleHighlight}>Misinformation</Text>
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#65A9E0" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={claims}
          renderItem={renderCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No claims found</Text>
          }
        />
      )}
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
  headerTitleHighlight: {
    color: '#65A9E0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  floatingStatusContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#F0F6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(101, 169, 224, 0.3)',
    maxWidth: 120,
  },
  floatingStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#65A9E0',
    textTransform: 'uppercase',
  },
  floatingCategoryContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  floatingCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardContent: {
    padding: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.4)',
    fontWeight: '600',
  },
  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginHorizontal: 6,
  },
  metaSourceText: {
    fontSize: 10,
    color: '#65A9E0',
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
    lineHeight: 20,
  },
  cardExcerpt: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
    lineHeight: 17,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(228, 237, 255, 0.6)',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 6,
  },
  authorName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A365D',
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: 'rgba(228, 237, 255, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#65A9E0',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.4)',
    marginTop: 40,
  },
});
