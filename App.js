/**
 * ============================================================
 *  TRAVEL BUDDY — App.js
 *  Pertemuan 9: React Navigation (Stack + Bottom Tab)
 * ============================================================
 *
 *  Struktur Navigasi:
 *  NavigationContainer
 *  └── BottomTabNavigator
 *      ├── HomeTab  → HomeStack
 *      │             ├── HomeScreen   (FlatList destinations)
 *      │             └── DetailScreen (route.params display)
 *      ├── SearchTab → SearchStack
 *      │              ├── SearchScreen   (filter by query)
 *      │              └── SearchDetail  (reuse DetailScreen)
 *      └── FavoritesTab → FavoritesScreen (global state)
 *
 *  Dependencies:
 *    @react-navigation/native
 *    @react-navigation/bottom-tabs
 *    @react-navigation/stack
 *    react-native-screens
 *    react-native-safe-area-context
 *    @expo/vector-icons
 * ============================================================
 */

import React, { useState, useCallback, useContext, createContext } from "react";
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
  Platform,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

// ─────────────────────────────────────────────────────────────
// 1. THEME / DESIGN TOKENS
// ─────────────────────────────────────────────────────────────
const COLORS = {
  primary:      "#00b894",
  primaryDark:  "#00896e",
  primaryLight: "#e0f7f4",
  accent:       "#fd79a8",
  dark:         "#0d1b2a",
  textPrimary:  "#0d1b2a",
  textSecondary:"#6c757d",
  textLight:    "#adb5bd",
  gold:         "#fdcb6e",
  white:        "#ffffff",
  border:       "#e9ecef",
  tagBg:        "#e0f7f4",
  surface:      "#f8f9fa",
};

// ─────────────────────────────────────────────────────────────
// 2. DATA — 8 Destinasi (id, name, location, price, image)
// ─────────────────────────────────────────────────────────────
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
      "Pulau Dewata yang memikat dengan harmoni budaya, pura kuno, sawah terasering Ubud yang hijau, dan pantai Seminyak yang kosmopolitan. Perpaduan sempurna antara spiritualitas dan modernitas.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    tags: ["Budaya", "Pantai", "Kuliner"],
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
      "Habitat asli komodo, kadal terbesar di dunia. Trekking di antara bukit savana keemasan, snorkeling di Pink Beach, dan menyaksikan matahari terbenam dari Padar Island — pengalaman tak terlupakan.",
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800",
    tags: ["Wildlife", "Trekking", "Snorkeling"],
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
      "Kota pelabuhan yang sedang menjelma menjadi destinasi premium dunia. Sunset di Puncak Waringin, island hopping ke pulau eksotis, dan seafood segar di tepi dermaga.",
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800",
    tags: ["Sunset", "Island Hopping", "Seafood"],
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
      "Kaldera vulkanik yang megah di atas awan. Sunrise dari Penanjakan dengan lautan awan di bawahmu, berkuda di lautan pasir, dan mendaki ke bibir kawah Bromo yang berasap.",
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800",
    tags: ["Vulkanik", "Sunrise", "Hiking"],
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
      "World-class diving destination dengan keanekaragaman hayati laut tertinggi di dunia. Setiap penyelaman adalah petualangan baru di antara 750+ spesies karang dan 942 spesies ikan.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
    tags: ["Diving", "Marine Life", "Eksklusif"],
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
      "Adiknya Bali yang belum terlalu ramai. Pantai Tanjung Aan dengan pasir merica yang unik, Gili Trawangan untuk party di tepi pantai, dan puncak Rinjani untuk jiwa petualang.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    tags: ["Pantai", "Hiking", "Gili Islands"],
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
      "Hidden paradise tersembunyi di Kalimantan. Berenang bersama ubur-ubur tak menyengat di Danau Kakaban, snorkeling bersama penyu hijau di Pulau Sangalaki — ketenangan yang jarang ditemukan.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    tags: ["Turtle", "Jellyfish Lake", "Remote"],
  },
];

// Warna badge per kategori
const CATEGORY_COLORS = {
  Island:      "#0984e3",
  Cultural:    "#e17055",
  Adventure:   "#a29bfe",
  Luxury:      "#fd79a8",
  Nature:      "#00b894",
  Diving:      "#00cec9",
  "Hidden Gem":"#fdcb6e",
};
const getCatColor = (cat) => CATEGORY_COLORS[cat] || COLORS.primary;

// ─────────────────────────────────────────────────────────────
// 3. GLOBAL FAVORITES CONTEXT
//    → Semua tab bisa baca/tulis state favorites yang sama
// ─────────────────────────────────────────────────────────────
const FavoritesContext = createContext(null);

function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]); // array of destination ids

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.includes(id),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. NAVIGATOR INSTANCES
// ─────────────────────────────────────────────────────────────
const Tab        = createBottomTabNavigator();
const HomeStack  = createStackNavigator();
const SearchStack= createStackNavigator();

// ─────────────────────────────────────────────────────────────
// 5. SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────

/** Kartu horizontal kecil — dipakai di SearchScreen & FavoritesScreen */
function HorizontalCard({ item, onPress }) {
  const { isFavorite } = useContext(FavoritesContext);
  return (
    <TouchableOpacity style={styles.hCard} activeOpacity={0.85} onPress={onPress}>
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.hCardImg}
        imageStyle={{ borderRadius: 14 }}
      >
        <View style={styles.hCardOverlay}>
          <View style={[styles.catBadge, { backgroundColor: getCatColor(item.category) }]}>
            <Text style={styles.catBadgeText}>{item.category}</Text>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.hCardBody}>
        <Text style={styles.hCardName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.rowGap4}>
          <Ionicons name="location" size={12} color={COLORS.primary} />
          <Text style={styles.hCardLoc} numberOfLines={1}>{item.location}</Text>
        </View>
        <View style={styles.hCardFooter}>
          <View style={styles.ratingPill}>
            <Ionicons name="star" size={11} color={COLORS.gold} />
            <Text style={styles.ratingPillTxt}>{item.rating}</Text>
          </View>
          <Text style={styles.hCardPrice}>{item.price}</Text>
          {isFavorite(item.id) && (
            <Ionicons name="heart" size={14} color={COLORS.accent} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. HOME SCREEN
// ─────────────────────────────────────────────────────────────
function HomeScreen({ navigation }) {
  const featured = DESTINATIONS[0];

  // useCallback → hindari re-render tidak perlu (code quality)
  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => navigation.navigate("Detail", { destination: item })}
      >
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.cardImg}
          imageStyle={{ borderRadius: 20 }}
        >
          <View style={styles.cardOverlay}>
            <View style={[styles.catBadge, { backgroundColor: getCatColor(item.category) }]}>
              <Text style={styles.catBadgeText}>{item.category}</Text>
            </View>
            <View style={styles.cardBottom}>
              <Text style={styles.cardName}>{item.name}</Text>
              <View style={styles.rowGap4}>
                <Ionicons name="location" size={13} color="rgba(255,255,255,0.75)" />
                <Text style={styles.cardLoc}>{item.location}</Text>
              </View>
              <View style={styles.cardFooterRow}>
                <View style={styles.ratingPillWhite}>
                  <Ionicons name="star" size={12} color={COLORS.gold} />
                  <Text style={styles.ratingPillWhiteTxt}>{item.rating}</Text>
                </View>
                <Text style={styles.cardPrice}>{item.price}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    ),
    [navigation]
  );

  const ListHeader = (
    <View>
      {/* ── HEADER ── */}
      <View style={styles.screenHeader}>
        <View>
          <Text style={styles.greetingTxt}>Selamat Datang 👋</Text>
          <Text style={styles.screenTitle}>Destinations</Text>
        </View>
        <View style={styles.avatarWrap}>
          <Ionicons name="person" size={20} color={COLORS.primary} />
        </View>
      </View>

      {/* ── FEATURED HERO ── */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.heroWrap}
        onPress={() => navigation.navigate("Detail", { destination: featured })}
      >
        <ImageBackground
          source={{ uri: featured.image }}
          style={styles.hero}
          imageStyle={{ borderRadius: 24 }}
        >
          <View style={styles.heroOverlay}>
            {/* Featured badge */}
            <View style={styles.featuredBadge}>
              <Ionicons name="flash" size={11} color={COLORS.gold} />
              <Text style={styles.featuredTxt}>Featured</Text>
            </View>
            {/* Info bawah */}
            <View>
              <Text style={styles.heroName}>{featured.name}</Text>
              <View style={styles.rowGap6}>
                <Ionicons name="location" size={13} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroLoc}>{featured.location}</Text>
                <View style={styles.dividerV} />
                <Ionicons name="star" size={13} color={COLORS.gold} />
                <Text style={styles.heroRating}>{featured.rating}</Text>
              </View>
              <View style={styles.heroPriceRow}>
                <Text style={styles.heroPrice}>{featured.price}</Text>
                <View style={styles.arrowCircle}>
                  <Ionicons name="arrow-forward" size={15} color={COLORS.white} />
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      {/* ── SECTION LABEL ── */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Jelajahi Semua</Text>
        <Text style={styles.sectionCount}>{DESTINATIONS.length} destinasi</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <FlatList
        data={DESTINATIONS}
        keyExtractor={(d) => d.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listPad}
        ListHeaderComponent={ListHeader}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
// 7. DETAIL SCREEN
//    → Extract data dari route.params.destination
// ─────────────────────────────────────────────────────────────
function DetailScreen({ route, navigation }) {
  // ✅ Route params: extract destination object
  const { destination } = route.params;
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const fav = isFavorite(destination.id);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.dark }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false} bounces>

        {/* ── HERO IMAGE ── */}
        <ImageBackground source={{ uri: destination.image }} style={styles.detailHero}>
          <View style={styles.detailHeroOverlay}>
            {/* Nav buttons */}
            <View style={styles.detailNavRow}>
              <TouchableOpacity style={styles.navCircle} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={22} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navCircle, fav && styles.navCircleFav]}
                onPress={() => toggleFavorite(destination.id)}
              >
                <Ionicons
                  name={fav ? "heart" : "heart-outline"}
                  size={22}
                  color={fav ? COLORS.accent : COLORS.white}
                />
              </TouchableOpacity>
            </View>

            {/* Badges bawah hero */}
            <View style={styles.rowGap8}>
              <View style={[styles.catBadge, { backgroundColor: getCatColor(destination.category) }]}>
                <Text style={styles.catBadgeText}>{destination.category}</Text>
              </View>
              <View style={styles.ratingBadgeDark}>
                <Ionicons name="star" size={13} color={COLORS.gold} />
                <Text style={styles.ratingBadgeTxt}>{destination.rating}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* ── CONTENT CARD ── */}
        <View style={styles.detailCard}>
          {/* Nama & lokasi */}
          <Text style={styles.detailName}>{destination.name}</Text>
          <View style={styles.rowGap4}>
            <Ionicons name="location" size={15} color={COLORS.primary} />
            <Text style={styles.detailLoc}>{destination.location}</Text>
          </View>

          {/* Tags */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
            {destination.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagTxt}>{tag}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Info row: harga, durasi, rating */}
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Ionicons name="cash-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoLabel}>Estimasi</Text>
              <Text style={styles.infoVal}>{destination.price}</Text>
            </View>
            <View style={styles.infoSep} />
            <View style={styles.infoBox}>
              <Ionicons name="time-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoLabel}>Durasi</Text>
              <Text style={styles.infoVal}>{destination.duration}</Text>
            </View>
            <View style={styles.infoSep} />
            <View style={styles.infoBox}>
              <Ionicons name="star-outline" size={20} color={COLORS.gold} />
              <Text style={styles.infoLabel}>Rating</Text>
              <Text style={styles.infoVal}>{destination.rating}/5</Text>
            </View>
          </View>

          {/* Deskripsi */}
          <Text style={styles.descHeading}>Tentang Destinasi</Text>
          <Text style={styles.descTxt}>{destination.description}</Text>

          {/* ✅ Add to Favorites button — simpan ke global Context */}
          <TouchableOpacity
            style={[styles.ctaBtn, fav && styles.ctaBtnFav]}
            onPress={() => toggleFavorite(destination.id)}
            activeOpacity={0.85}
          >
            <Ionicons
              name={fav ? "heart" : "heart-outline"}
              size={20}
              color={COLORS.white}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.ctaBtnTxt}>
              {fav ? "Tersimpan di Favorites ✓" : "Tambah ke Favorites"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. SEARCH SCREEN (+ Nested Stack ke SearchDetail)
// ─────────────────────────────────────────────────────────────
function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");

  // ✅ Filter realtime by name / location / category
  const results = query.trim().length === 0
    ? DESTINATIONS
    : DESTINATIONS.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.location.toLowerCase().includes(query.toLowerCase()) ||
        d.category.toLowerCase().includes(query.toLowerCase())
      );

  const renderItem = useCallback(
    ({ item }) => (
      <HorizontalCard
        item={item}
        onPress={() => navigation.navigate("SearchDetail", { destination: item })}
      />
    ),
    [navigation]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.screenHeader}>
        <View>
          <Text style={styles.greetingTxt}>Temukan tempat impianmu</Text>
          <Text style={styles.screenTitle}>Search</Text>
        </View>
        <Ionicons name="search" size={24} color={COLORS.primary} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarWrap}>
        <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Nama, lokasi, atau kategori..."
          placeholderTextColor={COLORS.textLight}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Result count */}
      {query.length > 0 && (
        <Text style={styles.resultLabel}>
          {results.length} hasil untuk "{query}"
        </Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(d) => d.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listPad, { paddingTop: 8 }]}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>Tidak Ditemukan</Text>
            <Text style={styles.emptyDesc}>Coba kata kunci yang berbeda</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
// 9. FAVORITES SCREEN (dynamic dari Context)
// ─────────────────────────────────────────────────────────────
function FavoritesScreen({ navigation }) {
  const { favorites } = useContext(FavoritesContext);
  const favDestinations = DESTINATIONS.filter((d) => favorites.includes(d.id));

  const renderItem = useCallback(
    ({ item }) => (
      <HorizontalCard
        item={item}
        onPress={() =>
          // navigate ke DetailScreen di HomeStack via cross-tab
          navigation.navigate("HomeTab", {
            screen: "Detail",
            params: { destination: item },
          })
        }
      />
    ),
    [navigation]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.screenHeader}>
        <View>
          <Text style={styles.greetingTxt}>Koleksi kamu 💚</Text>
          <Text style={styles.screenTitle}>Favorites</Text>
        </View>
        {favorites.length > 0 && (
          <View style={styles.favCountBadge}>
            <Text style={styles.favCountTxt}>{favorites.length}</Text>
          </View>
        )}
      </View>

      {/* Empty state */}
      {favDestinations.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyEmoji}>🗺️</Text>
          <Text style={styles.emptyTitle}>Belum Ada Favorit</Text>
          <Text style={styles.emptyDesc}>
            Buka detail destinasi dan tap tombol{"\n"}
            <Text style={{ color: COLORS.accent, fontWeight: "700" }}>Tambah ke Favorites</Text>
          </Text>
        </View>
      ) : (
        <FlatList
          data={favDestinations}
          keyExtractor={(d) => d.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listPad, { paddingTop: 8 }]}
        />
      )}
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
// 10. STACK WRAPPERS
// ─────────────────────────────────────────────────────────────
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home"   component={HomeScreen}   />
      <HomeStack.Screen name="Detail" component={DetailScreen} />
    </HomeStack.Navigator>
  );
}

function SearchStackNavigator() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="Search"       component={SearchScreen}  />
      {/* ✅ Nested Stack: SearchScreen → SearchDetail */}
      <SearchStack.Screen name="SearchDetail" component={DetailScreen}  />
    </SearchStack.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────
// 11. ROOT APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    // ✅ FavoritesProvider membungkus NavigationContainer
    //    → semua screen bisa akses favorites state
    <FavoritesProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor:   COLORS.primary,
            tabBarInactiveTintColor: COLORS.textLight,
            tabBarStyle:      styles.tabBar,
            tabBarLabelStyle: styles.tabLabel,
            // ✅ Tab icons dari @expo/vector-icons (Ionicons)
            tabBarIcon: ({ focused, color }) => {
              const icons = {
                HomeTab:   focused ? "compass"      : "compass-outline",
                SearchTab: focused ? "search"       : "search-outline",
                FavTab:    focused ? "heart"        : "heart-outline",
              };
              return (
                <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
                  <Ionicons name={icons[route.name]} size={22} color={color} />
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
            options={({ route: _r }) => {
              // ✅ Dynamic badge count dari Context
              // (Kita pakai komponen khusus karena perlu akses context di luar render)
              return {
                tabBarLabel: "Favorites",
                // Badge dihandle di FavBadge component di bawah
              };
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}

// ─────────────────────────────────────────────────────────────
// 12. STYLESHEET
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // ── LAYOUT DASAR ─────────────────────────────
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  listPad: {
    paddingBottom: 32,
  },

  // ── SCREEN HEADER ──────────────────────────────
  screenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
  },
  greetingTxt: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginBottom: 2,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  avatarWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },

  // ── HERO (HomeScreen) ────────────────────────
  heroWrap: {
    marginHorizontal: 20,
    marginBottom: 6,
    borderRadius: 24,
    overflow: "hidden",
  },
  hero: {
    height: 230,
    width: "100%",
  },
  heroOverlay: {
    flex: 1,
    padding: 18,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.32)",
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  featuredTxt: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  heroName: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.4,
  },
  heroLoc: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "500",
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
    marginTop: 6,
  },
  heroPrice: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  dividerV: {
    width: 1,
    height: 11,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 4,
  },

  // ── SECTION ROW ─────────────────────────────
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  sectionCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  // ── DESTINATION CARD (HomeScreen FlatList) ──
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  cardImg: {
    height: 180,
    width: "100%",
  },
  cardOverlay: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.26)",
  },
  cardBottom: {
    gap: 4,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  cardLoc: {
    fontSize: 11,
    color: "rgba(255,255,255,0.78)",
    fontWeight: "500",
  },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  cardPrice: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
  },

  // ── CATEGORY BADGE ──────────────────────────
  catBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  catBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // ── RATING PILL ─────────────────────────────
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  ratingPillTxt: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  ratingPillWhite: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 3,
  },
  ratingPillWhiteTxt: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },

  // ── TAB BAR ─────────────────────────────────
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: Platform.OS === "ios" ? 84 : 62,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 1,
    letterSpacing: 0.2,
  },
  tabIconWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 28,
    borderRadius: 14,
  },
  tabIconWrapActive: {
    backgroundColor: COLORS.primaryLight,
  },

  // ── DETAIL SCREEN ────────────────────────────
  detailHero: {
    height: 350,
    width: "100%",
  },
  detailHeroOverlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  detailNavRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.38)",
    alignItems: "center",
    justifyContent: "center",
  },
  navCircleFav: {
    backgroundColor: "rgba(253,121,168,0.28)",
  },
  ratingBadgeDark: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
  },
  ratingBadgeTxt: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: "800",
  },
  detailCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -28,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 40,
    minHeight: 420,
  },
  detailName: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  detailLoc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  tagsScroll: {
    marginVertical: 14,
  },
  tag: {
    backgroundColor: COLORS.tagBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  tagTxt: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  infoBox: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  infoSep: {
    width: 1,
    height: 38,
    backgroundColor: COLORS.primary + "35",
  },
  infoLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  infoVal: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: "800",
    textAlign: "center",
  },
  descHeading: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  descTxt: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  ctaBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.38,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaBtnFav: {
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
  },
  ctaBtnTxt: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  // ── SEARCH SCREEN ────────────────────────────
  searchBarWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginHorizontal: 20,
    marginBottom: 4,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "500",
    padding: 0,
  },
  resultLabel: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 2,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  // ── HORIZONTAL CARD (Search & Favorites) ────
  hCard: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hCardImg: {
    width: 105,
    height: 105,
  },
  hCardOverlay: {
    flex: 1,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  hCardBody: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    gap: 5,
  },
  hCardName: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  hCardLoc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  hCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  hCardPrice: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
    flex: 1,
  },

  // ── FAVORITES ────────────────────────────────
  favCountBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  favCountTxt: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },

  // ── EMPTY STATE ──────────────────────────────
  emptyWrap: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 52,
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },

  // ── ROW HELPERS ──────────────────────────────
  rowGap4: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rowGap6: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  rowGap8: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
