import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const COLORS = {
  primary: "#00b894",
  primaryDark: "#00896e",
  primaryLight: "#e0f7f4",
  accent: "#fd79a8",
  dark: "#0d1b2a",
  darkMid: "#1e2d3e",
  card: "#ffffff",
  textPrimary: "#0d1b2a",
  textSecondary: "#6c757d",
  textLight: "#adb5bd",
  gold: "#fdcb6e",
  white: "#ffffff",
  tabBg: "#ffffff",
  border: "#e9ecef",
  tagBg: "#e0f7f4",
};

// ─── DESTINATIONS DATA ─────────────────────────────────────────────────────────
const DESTINATIONS = [
  {
    id: "1",
    name: "Raja Ampat",
    location: "Papua Barat, Indonesia",
    price: "Rp 4.500.000",
    rating: 4.9,
    category: "Island",
    duration: "5-7 hari",
    description:
      "Surga bawah laut terbaik di dunia. Raja Ampat menawarkan keindahan terumbu karang yang belum terjamah, ratusan spesies ikan tropis, dan pemandangan pulau karst yang dramatis membelah lautan biru.",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800",
    tags: ["Diving", "Snorkeling", "Alam"],
    color: "#0984e3",
  },
  {
    id: "2",
    name: "Bali",
    location: "Bali, Indonesia",
    price: "Rp 2.800.000",
    rating: 4.8,
    category: "Cultural",
    duration: "4-6 hari",
    description:
      "Pulau Dewata yang memikat dengan harmoni budaya, pura kuno, sawah terasering Ubud yang hijau, dan pantai Seminyak yang kosmopolitan. Bali adalah perpaduan sempurna antara spiritualitas dan modernitas.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    tags: ["Budaya", "Pantai", "Kuliner"],
    color: "#e17055",
  },
  {
    id: "3",
    name: "Komodo Island",
    location: "NTT, Indonesia",
    price: "Rp 3.200.000",
    rating: 4.7,
    category: "Adventure",
    duration: "3-4 hari",
    description:
      "Habitat asli komodo, kadal terbesar di dunia. Trekking di antara bukit savana keemasan, snorkeling di perairan Pink Beach yang memukau, dan menyaksikan matahari terbenam dari Padar Island — pengalaman yang tak terlupakan.",
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800",
    tags: ["Wildlife", "Trekking", "Snorkeling"],
    color: "#a29bfe",
  },
  {
    id: "4",
    name: "Labuan Bajo",
    location: "NTT, Indonesia",
    price: "Rp 3.500.000",
    rating: 4.8,
    category: "Luxury",
    duration: "4-5 hari",
    description:
      "Kota pelabuhan yang sedang menjelma menjadi destinasi premium dunia. Sunset di Puncak Waringin, island hopping ke pulau-pulau eksotis, dan menikmati seafood segar di tepi dermaga.",
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800",
    tags: ["Sunset", "Island Hopping", "Seafood"],
    color: "#fd79a8",
  },
  {
    id: "5",
    name: "Bromo Tengger",
    location: "Jawa Timur, Indonesia",
    price: "Rp 1.500.000",
    rating: 4.9,
    category: "Nature",
    duration: "2-3 hari",
    description:
      "Kaldera vulkanik yang megah di atas awan. Sunrise dari Penanjakan dengan lautan awan di bawahmu, berkuda di lautan pasir, dan mendaki ke bibir kawah Bromo yang berasap — petualangan sejati.",
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800",
    tags: ["Vulkanik", "Sunrise", "Hiking"],
    color: "#e17055",
  },
  {
    id: "6",
    name: "Wakatobi",
    location: "Sulawesi Tenggara, Indonesia",
    price: "Rp 5.200.000",
    rating: 4.9,
    category: "Diving",
    duration: "5-6 hari",
    description:
      "World-class diving destination dengan keanekaragaman hayati laut tertinggi di dunia. Wakatobi adalah tempat di mana setiap penyelaman menjadi petualangan baru di antara 750+ spesies karang dan 942 spesies ikan.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
    tags: ["Diving", "Marine Life", "Eksklusif"],
    color: "#00cec9",
  },
  {
    id: "7",
    name: "Lombok",
    location: "NTB, Indonesia",
    price: "Rp 2.200.000",
    rating: 4.6,
    category: "Island",
    duration: "3-5 hari",
    description:
      "Adiknya Bali yang belum terlalu ramai. Pantai Tanjung Aan dengan pasir merica yang unik, Gili Trawangan untuk party di tepi pantai, dan puncak Rinjani untuk jiwa-jiwa petualang sejati.",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800",
    tags: ["Pantai", "Hiking", "Gili Islands"],
    color: "#74b9ff",
  },
  {
    id: "8",
    name: "Derawan Islands",
    location: "Kalimantan Timur, Indonesia",
    price: "Rp 3.800.000",
    rating: 4.7,
    category: "Hidden Gem",
    duration: "4-5 hari",
    description:
      "Hidden paradise tersembunyi di Kalimantan. Berenang bersama ubur-ubur tak menyengat di Danau Kakaban, snorkeling bersama penyu hijau di Pulau Sangalaki, dan menikmati ketenangan yang jarang ditemukan.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    tags: ["Turtle", "Jellyfish Lake", "Remote"],
    color: "#55efc4",
  },
];

// ─── CATEGORY COLORS ───────────────────────────────────────────────────────────
const getCategoryColor = (cat) => {
  const map = {
    Island: "#0984e3",
    Cultural: "#e17055",
    Adventure: "#a29bfe",
    Luxury: "#fd79a8",
    Nature: "#00b894",
    Diving: "#00cec9",
    "Hidden Gem": "#fdcb6e",
  };
  return map[cat] || COLORS.primary;
};

// ─── NAVIGATORS ────────────────────────────────────────────────────────────────
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const SearchStack = createStackNavigator();

// ═══════════════════════════════════════════════════════════════════════════════
// HOME SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function HomeScreen({ navigation }) {
  const featured = DESTINATIONS[0];

  const renderCard = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("Detail", { destination: item })}
    >
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.cardImage}
        imageStyle={{ borderRadius: 20 }}
      >
        <View style={styles.cardOverlay}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(item.category) },
            ]}
          >
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <View style={styles.cardBottom}>
            <Text style={styles.cardName}>{item.name}</Text>
            <View style={styles.cardRow}>
              <Ionicons name="location" size={13} color="#ffffff99" />
              <Text style={styles.cardLocation}>{item.location}</Text>
            </View>
            <View style={styles.cardFooter}>
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={12} color={COLORS.gold} />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              <Text style={styles.cardPrice}>{item.price}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <FlatList
        data={DESTINATIONS}
        keyExtractor={(d) => d.id}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* ── HEADER ── */}
            <View style={styles.header}>
              <View>
                <Text style={styles.headerGreeting}>Selamat Datang 👋</Text>
                <Text style={styles.headerTitle}>Destinations</Text>
              </View>
              <View style={styles.avatarRing}>
                <View style={styles.avatar}>
                  <Ionicons
                    name="person"
                    size={22}
                    color={COLORS.primary}
                  />
                </View>
              </View>
            </View>

            {/* ── FEATURED HERO ── */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("Detail", { destination: featured })
              }
            >
              <ImageBackground
                source={{ uri: featured.image }}
                style={styles.hero}
                imageStyle={{ borderRadius: 24 }}
              >
                <View style={styles.heroOverlay}>
                  <View style={styles.featuredBadge}>
                    <Ionicons name="flash" size={12} color={COLORS.gold} />
                    <Text style={styles.featuredText}>Featured</Text>
                  </View>
                  <Text style={styles.heroName}>{featured.name}</Text>
                  <View style={styles.heroMeta}>
                    <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.heroLocation}>{featured.location}</Text>
                    <View style={styles.heroDivider} />
                    <Ionicons name="star" size={14} color={COLORS.gold} />
                    <Text style={styles.heroRating}>{featured.rating}</Text>
                  </View>
                  <View style={styles.heroPriceRow}>
                    <Text style={styles.heroPrice}>{featured.price}</Text>
                    <View style={styles.heroArrow}>
                      <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            {/* ── SECTION TITLE ── */}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Jelajahi Semua</Text>
              <Text style={styles.sectionCount}>{DESTINATIONS.length} tempat</Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DETAIL SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function DetailScreen({ route, navigation }) {
  const { destination } = route.params;
  const [isFav, setIsFav] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.dark }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* HERO IMAGE */}
        <ImageBackground
          source={{ uri: destination.image }}
          style={styles.detailHero}
        >
          <View style={styles.detailHeroOverlay}>
            {/* Nav Row */}
            <View style={styles.detailNav}>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="chevron-back" size={22} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navBtn, isFav && styles.navBtnActive]}
                onPress={() => setIsFav((p) => !p)}
              >
                <Ionicons
                  name={isFav ? "heart" : "heart-outline"}
                  size={22}
                  color={isFav ? COLORS.accent : COLORS.white}
                />
              </TouchableOpacity>
            </View>
            {/* Category & Rating */}
            <View style={styles.detailBadgeRow}>
              <View
                style={[
                  styles.detailCatBadge,
                  { backgroundColor: getCategoryColor(destination.category) },
                ]}
              >
                <Text style={styles.detailCatText}>{destination.category}</Text>
              </View>
              <View style={styles.detailRatingBadge}>
                <Ionicons name="star" size={14} color={COLORS.gold} />
                <Text style={styles.detailRatingNum}>{destination.rating}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* CONTENT CARD */}
        <View style={styles.detailCard}>
          <Text style={styles.detailName}>{destination.name}</Text>
          <View style={styles.detailLocRow}>
            <Ionicons name="location" size={16} color={COLORS.primary} />
            <Text style={styles.detailLocation}>{destination.location}</Text>
          </View>

          {/* Tags */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginVertical: 14 }}
          >
            {destination.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Info Row */}
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Ionicons name="cash-outline" size={22} color={COLORS.primary} />
              <Text style={styles.infoLabel}>Estimasi</Text>
              <Text style={styles.infoValue}>{destination.price}</Text>
            </View>
            <View style={styles.infoSep} />
            <View style={styles.infoBox}>
              <Ionicons name="time-outline" size={22} color={COLORS.primary} />
              <Text style={styles.infoLabel}>Durasi</Text>
              <Text style={styles.infoValue}>{destination.duration}</Text>
            </View>
            <View style={styles.infoSep} />
            <View style={styles.infoBox}>
              <Ionicons name="star-outline" size={22} color={COLORS.gold} />
              <Text style={styles.infoLabel}>Rating</Text>
              <Text style={styles.infoValue}>{destination.rating}/5</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.descTitle}>Tentang Destinasi</Text>
          <Text style={styles.descText}>{destination.description}</Text>

          {/* CTA */}
          <TouchableOpacity
            style={[
              styles.ctaBtn,
              isFav && { backgroundColor: COLORS.accent },
            ]}
            onPress={() => setIsFav((p) => !p)}
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={20}
              color={COLORS.white}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.ctaBtnText}>
              {isFav ? "Tersimpan di Favorit ✓" : "Tambah ke Favorit"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME STACK
// ═══════════════════════════════════════════════════════════════════════════════
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Detail" component={DetailScreen} />
    </HomeStack.Navigator>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const filtered = DESTINATIONS.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.location.toLowerCase().includes(query.toLowerCase()) ||
      d.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.searchHeader}>
        <Text style={styles.headerTitle}>Cari Destinasi</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Mau kemana?"
            placeholderTextColor={COLORS.textLight}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>
        {query.length > 0 && (
          <Text style={styles.resultCount}>
            {filtered.length} hasil untuk "{query}"
          </Text>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(d) => d.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingTop: 8 }]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>Tidak ditemukan</Text>
            <Text style={styles.emptyDesc}>Coba kata kunci lain</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.searchCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("SearchDetail", { destination: item })}
          >
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.searchCardImg}
              imageStyle={{ borderRadius: 16 }}
            >
              <View style={styles.searchCardOverlay}>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: getCategoryColor(item.category) },
                  ]}
                >
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
              </View>
            </ImageBackground>
            <View style={styles.searchCardInfo}>
              <Text style={styles.searchCardName}>{item.name}</Text>
              <View style={styles.cardRow}>
                <Ionicons name="location" size={12} color={COLORS.primary} />
                <Text style={styles.searchCardLoc}>{item.location}</Text>
              </View>
              <View style={styles.searchCardFooter}>
                <View style={styles.ratingPillSm}>
                  <Ionicons name="star" size={11} color={COLORS.gold} />
                  <Text style={styles.ratingTextSm}>{item.rating}</Text>
                </View>
                <Text style={styles.searchCardPrice}>{item.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

function SearchStackNavigator() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="Search" component={SearchScreen} />
      <SearchStack.Screen name="SearchDetail" component={DetailScreen} />
    </SearchStack.Navigator>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FAVORITES SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function FavoritesScreen() {
  // Hardcode 3 default favorites for demo
  const favs = DESTINATIONS.filter((d) => ["1", "6", "8"].includes(d.id));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Koleksi kamu 💚</Text>
          <Text style={styles.headerTitle}>Favorites</Text>
        </View>
        <View style={styles.favCountBadge}>
          <Text style={styles.favCountText}>{favs.length}</Text>
        </View>
      </View>

      {favs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🗺️</Text>
          <Text style={styles.emptyTitle}>Belum ada favorit</Text>
          <Text style={styles.emptyDesc}>Tap ikon hati di detail destinasi</Text>
        </View>
      ) : (
        <FlatList
          data={favs}
          keyExtractor={(d) => d.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listContent, { paddingTop: 4 }]}
          renderItem={({ item }) => (
            <View style={styles.favCard}>
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.favCardImg}
                imageStyle={{ borderRadius: 16 }}
              >
                <View style={styles.favOverlay}>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: getCategoryColor(item.category) },
                    ]}
                  >
                    <Text style={styles.categoryText}>{item.category}</Text>
                  </View>
                  <View style={styles.favHeart}>
                    <Ionicons name="heart" size={18} color={COLORS.accent} />
                  </View>
                </View>
              </ImageBackground>
              <View style={styles.favInfo}>
                <Text style={styles.favName}>{item.name}</Text>
                <View style={styles.cardRow}>
                  <Ionicons name="location" size={12} color={COLORS.primary} />
                  <Text style={styles.searchCardLoc}>{item.location}</Text>
                </View>
                <View style={styles.searchCardFooter}>
                  <View style={styles.ratingPillSm}>
                    <Ionicons name="star" size={11} color={COLORS.gold} />
                    <Text style={styles.ratingTextSm}>{item.rating}</Text>
                  </View>
                  <Text style={styles.searchCardPrice}>{item.price}</Text>
                </View>
                <View style={styles.favTags}>
                  {item.tags.slice(0, 2).map((t) => (
                    <View key={t} style={styles.tag}>
                      <Text style={styles.tagText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textLight,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "HomeTab") {
              iconName = focused ? "compass" : "compass-outline";
            } else if (route.name === "SearchTab") {
              iconName = focused ? "search" : "search-outline";
            } else if (route.name === "FavTab") {
              iconName = focused ? "heart" : "heart-outline";
            }
            return (
              <View style={focused ? styles.activeTabIcon : null}>
                <Ionicons name={iconName} size={focused ? 22 : 20} color={color} />
              </View>
            );
          },
        })}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStackNavigator}
          options={{ tabBarLabel: "Explore" }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchStackNavigator}
          options={{ tabBarLabel: "Search" }}
        />
        <Tab.Screen
          name="FavTab"
          component={FavoritesScreen}
          options={{
            tabBarLabel: "Favorites",
            tabBarBadge: 3,
            tabBarBadgeStyle: {
              backgroundColor: COLORS.accent,
              fontSize: 10,
              minWidth: 16,
              height: 16,
              lineHeight: 16,
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // ── HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
  },
  headerGreeting: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  avatarRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── HERO
  hero: {
    height: 240,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  heroOverlay: {
    flex: 1,
    borderRadius: 24,
    padding: 18,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.30)",
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  featuredText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  heroName: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.5,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  heroLocation: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "500",
  },
  heroDivider: {
    width: 1,
    height: 12,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 4,
  },
  heroRating: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: "700",
  },
  heroPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  heroPrice: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
  },
  heroArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── SECTION
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  sectionCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  // ── LIST
  listContent: {
    paddingBottom: 30,
  },

  // ── CARD (vertical list)
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  cardImage: {
    height: 185,
    width: "100%",
  },
  cardOverlay: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  cardBottom: {
    gap: 4,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  cardLocation: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 3,
  },
  ratingText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },
  cardPrice: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // ── TAB BAR
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: Platform.OS === "ios" ? 82 : 62,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 10,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -3 },
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 1,
    letterSpacing: 0.2,
  },
  activeTabIcon: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    width: 44,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── DETAIL SCREEN
  detailHero: {
    height: 360,
    width: "100%",
  },
  detailHeroOverlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 54 : 44,
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  detailNav: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  navBtnActive: {
    backgroundColor: "rgba(253,121,168,0.25)",
  },
  detailBadgeRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  detailCatBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  detailCatText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  detailRatingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  detailRatingNum: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: "800",
  },
  detailCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
    minHeight: 400,
  },
  detailName: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  detailLocRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  // TAGS
  tag: {
    backgroundColor: COLORS.tagBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  tagText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: "600",
  },

  // INFO ROW
  infoRow: {
    flexDirection: "row",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  infoBox: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  infoSep: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.primary + "30",
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "800",
    textAlign: "center",
  },

  // DESCRIPTION
  descTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  descText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontWeight: "400",
    marginBottom: 24,
  },

  // CTA
  ctaBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  // ── SEARCH SCREEN
  searchHeader: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f6f9",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "500",
    padding: 0,
  },
  resultCount: {
    marginTop: 10,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  // SEARCH CARD (horizontal)
  searchCard: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  searchCardImg: {
    width: 110,
    height: 110,
  },
  searchCardOverlay: {
    flex: 1,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  searchCardInfo: {
    flex: 1,
    padding: 14,
    justifyContent: "center",
    gap: 4,
  },
  searchCardName: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  searchCardLoc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginLeft: 2,
  },
  searchCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  ratingPillSm: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 2,
  },
  ratingTextSm: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  searchCardPrice: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
  },

  // ── EMPTY STATE
  emptyState: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 52,
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  // ── FAVORITES
  favCountBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  favCountText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },
  favCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.09,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  favCardImg: {
    width: "100%",
    height: 140,
  },
  favOverlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.20)",
  },
  favHeart: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  favInfo: {
    padding: 14,
    gap: 5,
  },
  favName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  favTags: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
});