
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { User, Package, AppScreen } from '../types';

interface HomeProps {
  user: User | null;
  enrolledPackages: Package[];
  onNavigate: (s: AppScreen) => void;
  onEnrollClick: () => void;
}

const HomeScreen: React.FC<HomeProps> = ({ user, enrolledPackages, onNavigate, onEnrollClick }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <View style={styles.logoRow}>
            <Text style={styles.logoStrong}>STRONG</Text>
            <Text style={styles.logoHer}>HER</Text>
          </View>
          <Text style={styles.subtitle}>ATHLETE: {user?.name.toUpperCase()}</Text>
        </View>
        <TouchableOpacity onPress={() => onNavigate(AppScreen.SETTINGS)} style={styles.profileBtn}>
          <Image 
            source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}` }} 
            style={styles.avatar} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {enrolledPackages.length > 0 ? (
          <View style={styles.activeCard}>
            <Text style={styles.cardHeader}>ACTIVE TRAINING</Text>
            {enrolledPackages.map(pkg => (
              <View key={pkg.id} style={styles.pkgRow}>
                <Text style={styles.pkgName}>{pkg.name.toUpperCase()}</Text>
                <View style={styles.liveTag} />
              </View>
            ))}
            <TouchableOpacity 
              style={styles.actionBtn} 
              onPress={() => onNavigate(AppScreen.CALENDAR)}
            >
              <Text style={styles.actionBtnText}>MARK ATTENDANCE</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.enrollCard}>
            <Text style={styles.enrollTitle}>UNLEASH YOUR POWER</Text>
            <Text style={styles.enrollText}>Join the elite squad and start your transformation journey today.</Text>
            <TouchableOpacity style={styles.enrollBtn} onPress={onEnrollClick}>
              <Text style={styles.enrollBtnText}>ENROLL NOW</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>ATHLETIC SUITE</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate(AppScreen.CALORIE_TRACKER)}>
            <View style={[styles.iconBox, { backgroundColor: '#ffffff10' }]}>
               <Text style={styles.iconEmoji}>🥗</Text>
            </View>
            <Text style={styles.gridLabel}>MACROS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate(AppScreen.CALENDAR)}>
            <View style={[styles.iconBox, { backgroundColor: '#dc262620' }]}>
               <Text style={styles.iconEmoji}>📅</Text>
            </View>
            <Text style={styles.gridLabel}>ATTENDANCE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate(AppScreen.PERIOD_TRACKER)}>
            <View style={[styles.iconBox, { backgroundColor: '#ffffff10' }]}>
               <Text style={styles.iconEmoji}>🩸</Text>
            </View>
            <Text style={styles.gridLabel}>CYCLE LOG</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate(AppScreen.MOOD_TRACKER)}>
            <View style={[styles.iconBox, { backgroundColor: '#ffffff10' }]}>
               <Text style={styles.iconEmoji}>🧠</Text>
            </View>
            <Text style={styles.gridLabel}>MOOD CHECK</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 24, 
    borderBottomWidth: 1, 
    borderBottomColor: '#1a1a1a' 
  },
  logoRow: { flexDirection: 'row', alignItems: 'baseline' },
  logoStrong: { color: '#fff', fontSize: 20, fontWeight: '900', fontStyle: 'italic' },
  logoHer: { color: '#dc2626', fontSize: 22, fontWeight: '900', fontStyle: 'italic', marginLeft: 4 },
  subtitle: { color: '#666', fontSize: 10, fontWeight: '800', marginTop: 2, letterSpacing: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#dc2626' },
  scrollContent: { padding: 24 },
  activeCard: { backgroundColor: '#dc2626', borderRadius: 24, padding: 24, marginBottom: 24 },
  cardHeader: { color: '#fff', fontSize: 12, fontWeight: '900', fontStyle: 'italic', marginBottom: 12, opacity: 0.8 },
  pkgRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#00000030', padding: 16, borderRadius: 16, marginBottom: 8 },
  pkgName: { color: '#fff', fontWeight: '900', fontSize: 14 },
  liveTag: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  actionBtn: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginTop: 16, alignItems: 'center' },
  actionBtnText: { fontWeight: '900', letterSpacing: 1 },
  enrollCard: { backgroundColor: '#1a1a1a', borderRadius: 24, padding: 32, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#dc262620' },
  enrollTitle: { color: '#fff', fontSize: 24, fontWeight: '900', fontStyle: 'italic', textAlign: 'center' },
  enrollText: { color: '#666', fontSize: 13, textAlign: 'center', marginVertical: 16, lineHeight: 20 },
  enrollBtn: { backgroundColor: '#dc2626', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16 },
  enrollBtnText: { color: '#fff', fontWeight: '900', letterSpacing: 1 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '900', fontStyle: 'italic', marginBottom: 16, letterSpacing: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', backgroundColor: '#111', borderRadius: 24, padding: 20, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#222' },
  iconBox: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  iconEmoji: { fontSize: 24 },
  gridLabel: { color: '#999', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  profileBtn: { shadowColor: '#dc2626', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
});

export default HomeScreen;
