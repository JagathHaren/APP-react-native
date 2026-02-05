
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  onSignUp?: () => void;
  onTrainerLogin?: () => void;
  onBack?: () => void;
}

const Input = ({ label, ...props }: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput 
      style={styles.textInput} 
      placeholderTextColor="#444" 
      {...props} 
    />
  </View>
);

export const LoginScreen: React.FC<AuthProps> = ({ onLogin, onSignUp, onTrainerLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLogin({ name: 'Alex Johnson', username, email: 'alex@strongher.com', phone: '1234567890', isTrainer: false, enrolledPackages: [] });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.authContainer}>
      <ScrollView contentContainerStyle={styles.authScroll}>
        <View style={styles.authHeader}>
          <Text style={styles.authWelcome}>WELCOME TO</Text>
          <View style={styles.logoRow}>
            <Text style={styles.logoStrong}>STRONG</Text>
            <Text style={styles.logoHer}>HER</Text>
          </View>
          <Text style={styles.authHint}>LOG IN TO UNLEASH YOUR POWER</Text>
        </View>

        <Input label="USERNAME" value={username} onChangeText={setUsername} placeholder="athlete_01" autoCapitalize="none" />
        <Input label="PASSWORD" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />

        <TouchableOpacity style={styles.mainBtn} onPress={handleLogin}>
          <Text style={styles.mainBtnText}>ENTER TRAINING</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.subBtn} onPress={onSignUp}>
          <Text style={styles.subBtnText}>NEW? JOIN THE COMMUNITY</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.trainerBtn} onPress={onTrainerLogin}>
          <Text style={styles.trainerBtnText}>TRAINER PORTAL</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const SignupScreen: React.FC<{onSignup: (u: User) => void; onBack: () => void}> = ({ onSignup, onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <View style={styles.authContainer}>
       <TouchableOpacity onPress={onBack} style={styles.backBtn}>
         <Text style={styles.backBtnText}>BACK</Text>
       </TouchableOpacity>
       <ScrollView contentContainerStyle={styles.authScroll}>
          <Text style={styles.authTitle}>BECOME <Text style={{color: '#dc2626'}}>STRONG</Text></Text>
          <Input label="FULL NAME" value={name} onChangeText={setName} placeholder="Jane Doe" />
          <Input label="EMAIL" value={email} onChangeText={setEmail} placeholder="jane@example.com" keyboardType="email-address" autoCapitalize="none" />
          <Input label="CREATE PASSWORD" placeholder="••••••••" secureTextEntry />
          
          <TouchableOpacity style={styles.mainBtn} onPress={() => onSignup({ name, username: name, email, phone: '', isTrainer: false, enrolledPackages: [] })}>
            <Text style={styles.mainBtnText}>JOIN NOW</Text>
          </TouchableOpacity>
       </ScrollView>
    </View>
  );
};

export const TrainerLoginScreen: React.FC<AuthProps> = ({ onLogin, onBack }) => (
  <View style={[styles.authContainer, { backgroundColor: '#000' }]}>
    <TouchableOpacity onPress={onBack} style={styles.backBtn}>
      <Text style={styles.backBtnText}>BACK</Text>
    </TouchableOpacity>
    <View style={styles.authScroll}>
      <Text style={styles.authTitle}>TRAINER <Text style={{color: '#dc2626'}}>PORTAL</Text></Text>
      <Input label="STAFF ID" placeholder="SH-XXX" />
      <Input label="ACCESS KEY" placeholder="••••••••" secureTextEntry />
      <TouchableOpacity style={styles.mainBtn} onPress={() => onLogin({ name: 'Coach Sarah', username: 'sarah', email: '', phone: '', isTrainer: true, enrolledPackages: [] })}>
        <Text style={styles.mainBtnText}>UNLOCK PORTAL</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  authContainer: { flex: 1, backgroundColor: '#0d0d0d' },
  authScroll: { padding: 32, justifyContent: 'center', flexGrow: 1 },
  authHeader: { marginBottom: 40 },
  authWelcome: { color: '#666', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  logoRow: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 4 },
  logoStrong: { color: '#fff', fontSize: 36, fontWeight: '900', fontStyle: 'italic' },
  logoHer: { color: '#dc2626', fontSize: 44, fontWeight: '900', fontStyle: 'italic', marginLeft: 6 },
  authHint: { color: '#444', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  authTitle: { color: '#fff', fontSize: 32, fontWeight: '900', fontStyle: 'italic', marginBottom: 32 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { color: '#666', fontSize: 10, fontWeight: '900', marginBottom: 8, letterSpacing: 1 },
  textInput: { backgroundColor: '#111', color: '#fff', borderRadius: 16, padding: 18, fontSize: 16, borderWidth: 1, borderColor: '#222' },
  mainBtn: { backgroundColor: '#dc2626', borderRadius: 16, padding: 20, alignItems: 'center', marginTop: 10, shadowColor: '#dc2626', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15 },
  mainBtnText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 2 },
  subBtn: { marginTop: 24, alignItems: 'center' },
  subBtnText: { color: '#dc2626', fontWeight: '800', fontSize: 12 },
  trainerBtn: { marginTop: 40, borderTopWidth: 1, borderTopColor: '#222', paddingTop: 24 },
  trainerBtnText: { color: '#444', textAlign: 'center', fontWeight: '800', fontSize: 11, letterSpacing: 1 },
  backBtn: { padding: 24 },
  backBtnText: { color: '#dc2626', fontWeight: '900', fontSize: 14 }
});
