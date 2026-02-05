
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { User } from '../types';

interface SettingsProps {
  user: User | null;
  onBack: () => void;
  onLogout: () => void;
}

const SettingsScreen: React.FC<SettingsProps> = ({ user, onBack, onLogout }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backTxt}>BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>SETTINGS</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileBox}>
          <Image source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}` }} style={styles.lgAvatar} />
          <Text style={styles.pName}>{user?.name.toUpperCase()}</Text>
          <Text style={styles.pEmail}>{user?.email.toLowerCase()}</Text>
        </View>

        <View style={styles.menu}>
          {['EDIT PROFILE', 'TRAINING GOALS', 'NUTRITION PLAN', 'PRIVACY SETTINGS'].map((label, idx) => (
            <TouchableOpacity key={idx} style={styles.menuItem}>
              <Text style={styles.menuLabel}>{label}</Text>
              <Text style={styles.chevron}>></Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutTxt}>LOGOUT SESSION</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#222' },
  backTxt: { color: '#dc2626', fontWeight: '900' },
  title: { color: '#fff', fontWeight: '900', fontSize: 16, fontStyle: 'italic' },
  content: { padding: 24 },
  profileBox: { alignItems: 'center', marginBottom: 40 },
  lgAvatar: { width: 100, height: 100, borderRadius: 30, borderWidth: 3, borderColor: '#dc2626', marginBottom: 16 },
  pName: { color: '#fff', fontSize: 20, fontWeight: '900', fontStyle: 'italic' },
  pEmail: { color: '#666', fontSize: 12, fontWeight: '700', marginTop: 4 },
  menu: { marginBottom: 32 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#111', padding: 20, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  menuLabel: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  chevron: { color: '#333', fontWeight: '900' },
  logoutBtn: { backgroundColor: '#dc262610', borderWidth: 1, borderColor: '#dc262630', padding: 20, borderRadius: 20, alignItems: 'center' },
  logoutTxt: { color: '#dc2626', fontWeight: '900', letterSpacing: 2, fontStyle: 'italic' }
});

export default SettingsScreen;
