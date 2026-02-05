
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Package } from '../types';

interface AttendanceProps {
  enrolledPackages: Package[];
  attendedDays: number[];
  onToggleAttendance: (day: number) => void;
  onBack: () => void;
}

const AttendanceCalendar: React.FC<AttendanceProps> = ({ enrolledPackages, attendedDays, onToggleAttendance, onBack }) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ATTENDANCE</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {enrolledPackages.map(pkg => (
          <View key={pkg.id} style={styles.pkgCard}>
            <View style={styles.pkgTop}>
              <Text style={styles.pkgName}>{pkg.name.toUpperCase()}</Text>
              <View style={styles.proTag}><Text style={styles.proTagText}>PRO</Text></View>
            </View>
            <View style={styles.pkgStats}>
              <View style={styles.stat}>
                <Text style={styles.statHint}>STARTED</Text>
                <Text style={styles.statVal}>MAY 01</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statHint}>EXPIRES</Text>
                <Text style={[styles.statVal, { color: '#dc2626' }]}>JUN 01</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.calCard}>
          <Text style={styles.calTitle}>MAY COMBAT LOG</Text>
          <View style={styles.grid}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <Text key={d} style={styles.dayHeader}>{d}</Text>
            ))}
            {days.map(d => (
              <TouchableOpacity 
                key={d} 
                onPress={() => onToggleAttendance(d)}
                style={[styles.day, attendedDays.includes(d) && styles.dayActive]}
              >
                <Text style={[styles.dayText, attendedDays.includes(d) && styles.dayTextActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.totalCard}>
            <View>
              <Text style={styles.totalHint}>SESSIONS</Text>
              <Text style={styles.totalVal}>{attendedDays.length}</Text>
            </View>
            <View style={styles.boltIcon}>
               <Text style={{ fontSize: 24 }}>⚡</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#222' },
  backBtn: { padding: 10 },
  backBtnText: { color: '#dc2626', fontSize: 24, fontWeight: 'bold' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '900', fontStyle: 'italic' },
  scrollContent: { padding: 20 },
  pkgCard: { backgroundColor: '#111', padding: 24, borderRadius: 24, marginBottom: 20, borderWidth: 1, borderColor: '#222' },
  pkgTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  pkgName: { color: '#fff', fontSize: 16, fontWeight: '900', fontStyle: 'italic' },
  proTag: { backgroundColor: '#dc2626', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  proTagText: { color: '#fff', fontSize: 8, fontWeight: '900' },
  pkgStats: { flexDirection: 'row', backgroundColor: '#000', padding: 16, borderRadius: 16 },
  stat: { flex: 1, alignItems: 'center' },
  statHint: { color: '#666', fontSize: 8, fontWeight: '900', marginBottom: 4 },
  statVal: { color: '#ccc', fontSize: 10, fontWeight: '900' },
  calCard: { backgroundColor: '#111', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#222' },
  calTitle: { color: '#fff', fontSize: 14, fontWeight: '900', marginBottom: 24, fontStyle: 'italic' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  dayHeader: { width: '11%', textAlign: 'center', color: '#444', fontSize: 10, fontWeight: '900', marginBottom: 10 },
  day: { width: '11%', aspectRatio: 1, backgroundColor: '#000', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  dayActive: { backgroundColor: '#dc2626', borderColor: '#dc2626' },
  dayText: { color: '#444', fontSize: 10, fontWeight: '900' },
  dayTextActive: { color: '#fff' },
  totalCard: { marginTop: 32, backgroundColor: '#fff', padding: 20, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalHint: { color: '#999', fontSize: 8, fontWeight: '900' },
  totalVal: { color: '#000', fontSize: 24, fontWeight: '900', fontStyle: 'italic' },
  boltIcon: { width: 50, height: 50, backgroundColor: '#dc2626', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }
});

export default AttendanceCalendar;
