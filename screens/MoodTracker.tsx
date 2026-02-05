
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { MoodLog } from '../types';

const MoodTracker: React.FC<{logs: MoodLog[]; setLogs: any; onBack: () => void}> = ({ logs, setLogs, onBack }) => {
  const [rating, setRating] = useState(3);
  const [note, setNote] = useState('');

  const moods = [
    { label: 'Bad', emoji: '😫', val: 1 },
    { label: 'Sad', emoji: '😕', val: 2 },
    { label: 'Ok', emoji: '😐', val: 3 },
    { label: 'Good', emoji: '🙂', val: 4 },
    { label: 'Great', emoji: '🤩', val: 5 },
  ];

  const handleLog = () => {
    const newLog: MoodLog = {
      rating,
      note,
      timestamp: new Date(),
      emojis: [moods[rating-1].emoji]
    };
    setLogs([newLog, ...logs]);
    setNote('');
    setRating(3);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MOOD CHECK</Text>
        <div style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainCard}>
          <Text style={styles.mainTitle}>ATHLETE STATE</Text>
          <View style={styles.moodRow}>
            {moods.map(m => (
              <TouchableOpacity 
                key={m.val}
                onPress={() => setRating(m.val)}
                style={[styles.moodBtn, rating === m.val && styles.moodBtnActive]}
              >
                <Text style={styles.emoji}>{m.emoji}</Text>
                <Text style={styles.moodLabel}>{m.label.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput 
            style={styles.textArea} 
            placeholder="HOW ARE WE TRAINING TODAY?" 
            placeholderTextColor="#444" 
            multiline 
            value={note}
            onChangeText={setNote}
          />
          <TouchableOpacity style={styles.logBtn} onPress={handleLog}>
            <Text style={styles.logBtnText}>LOG SESSION STATE</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.historyHeader}>STATE HISTORY</Text>
        {logs.map((log, i) => (
          <View key={i} style={styles.historyCard}>
            <View style={styles.historyTop}>
              <Text style={styles.historyEmoji}>{moods[log.rating-1].emoji}</Text>
              <View>
                <Text style={styles.historyLabel}>{moods[log.rating-1].label.toUpperCase()}</Text>
                <Text style={styles.historyTime}>{log.timestamp.toLocaleDateString()}</Text>
              </View>
            </View>
            <Text style={styles.historyNote}>"{log.note}"</Text>
          </View>
        ))}
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
  mainCard: { backgroundColor: '#111', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#222' },
  mainTitle: { color: '#fff', fontSize: 20, fontWeight: '900', fontStyle: 'italic', marginBottom: 24 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  moodBtn: { alignItems: 'center', opacity: 0.3 },
  moodBtnActive: { opacity: 1, transform: [{ scale: 1.2 }] },
  emoji: { fontSize: 32 },
  moodLabel: { color: '#666', fontSize: 8, fontWeight: '900', marginTop: 8 },
  textArea: { backgroundColor: '#000', color: '#fff', padding: 16, borderRadius: 16, minHeight: 120, textAlignVertical: 'top', marginBottom: 20 },
  logBtn: { backgroundColor: '#dc2626', padding: 20, borderRadius: 16, alignItems: 'center' },
  logBtnText: { color: '#fff', fontWeight: '900', fontSize: 12 },
  historyHeader: { color: '#666', fontSize: 10, fontWeight: '900', marginTop: 32, marginBottom: 16 },
  historyCard: { backgroundColor: '#111', padding: 20, borderRadius: 16, marginBottom: 12 },
  historyTop: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 12 },
  historyEmoji: { fontSize: 24 },
  historyLabel: { color: '#fff', fontSize: 12, fontWeight: '900' },
  historyTime: { color: '#444', fontSize: 9, fontWeight: '700' },
  historyNote: { color: '#666', fontSize: 11, fontStyle: 'italic' }
});

export default MoodTracker;
