
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { PeriodEntry } from '../types';

const PeriodTracker: React.FC<{logs: PeriodEntry[]; setLogs: any; onBack: () => void}> = ({ logs, setLogs, onBack }) => {
  const [selectedFlow, setSelectedFlow] = useState<'Light' | 'Medium' | 'Heavy'>('Medium');
  const [note, setNote] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const handleLog = () => {
    const newEntry: PeriodEntry = {
      id: Math.random().toString(),
      date: new Date(),
      symptoms: selectedSymptoms,
      flow: selectedFlow,
      note: note
    };
    setLogs([newEntry, ...logs]);
    setNote('');
    setSelectedSymptoms([]);
  };

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PERIOD LOG</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <Text style={styles.heroHint}>TODAY'S PHASE</Text>
          <Text style={styles.heroMain}>OVULATION PHASE</Text>
          <Text style={styles.heroSub}>HIGH ENERGY • MAX STRENGTH</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>FLOW LEVEL</Text>
          <View style={styles.row}>
            {['Light', 'Medium', 'Heavy'].map(f => (
              <TouchableOpacity 
                key={f} 
                onPress={() => setSelectedFlow(f as any)}
                style={[styles.chip, selectedFlow === f && styles.chipActive]}
              >
                <Text style={[styles.chipText, selectedFlow === f && styles.chipTextActive]}>{f.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>SYMPTOMS</Text>
          <View style={styles.wrap}>
            {['Cramps', 'Fatigue', 'Cravings', 'Bloating'].map(s => (
              <TouchableOpacity 
                key={s} 
                onPress={() => toggleSymptom(s)}
                style={[styles.pill, selectedSymptoms.includes(s) && styles.pillActive]}
              >
                <Text style={[styles.pillText, selectedSymptoms.includes(s) && styles.pillTextActive]}>{s.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput 
            style={styles.textArea} 
            placeholder="NOTES..." 
            placeholderTextColor="#444" 
            multiline 
            value={note}
            onChangeText={setNote}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleLog}>
            <Text style={styles.saveBtnText}>SAVE ENTRY</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.historyTitle}>CYCLE HISTORY</Text>
        {logs.map(log => (
          <View key={log.id} style={styles.historyCard}>
            <View style={styles.historyRow}>
              <Text style={styles.historyDate}>{log.date.toLocaleDateString()}</Text>
              <Text style={styles.historyFlow}>{log.flow.toUpperCase()} FLOW</Text>
            </View>
            <Text style={styles.historyNote}>{log.note}</Text>
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
  heroCard: { backgroundColor: '#dc2626', padding: 32, borderRadius: 24, marginBottom: 20 },
  heroHint: { color: '#fff', opacity: 0.6, fontSize: 10, fontWeight: '900', marginBottom: 4 },
  heroMain: { color: '#fff', fontSize: 24, fontWeight: '900', fontStyle: 'italic' },
  heroSub: { color: '#fff', opacity: 0.8, fontSize: 10, fontWeight: '900', marginTop: 8 },
  formCard: { backgroundColor: '#111', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#222' },
  sectionLabel: { color: '#666', fontSize: 10, fontWeight: '900', marginBottom: 12, marginTop: 12 },
  row: { flexDirection: 'row', gap: 8 },
  chip: { flex: 1, backgroundColor: '#000', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  chipActive: { backgroundColor: '#dc2626', borderColor: '#dc2626' },
  chipText: { color: '#666', fontSize: 10, fontWeight: '900' },
  chipTextActive: { color: '#fff' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { backgroundColor: '#000', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#222' },
  pillActive: { backgroundColor: '#fff', borderColor: '#fff' },
  pillText: { color: '#666', fontSize: 9, fontWeight: '900' },
  pillTextActive: { color: '#000' },
  textArea: { backgroundColor: '#000', color: '#fff', padding: 16, borderRadius: 12, marginTop: 20, minHeight: 100, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: '#dc2626', padding: 20, borderRadius: 16, marginTop: 24, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '900', fontSize: 12 },
  historyTitle: { color: '#fff', fontSize: 14, fontWeight: '900', marginVertical: 20, fontStyle: 'italic' },
  historyCard: { backgroundColor: '#111', padding: 20, borderRadius: 16, marginBottom: 12 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  historyDate: { color: '#dc2626', fontWeight: '900', fontSize: 12 },
  historyFlow: { color: '#fff', fontSize: 10, fontWeight: '900' },
  historyNote: { color: '#666', fontSize: 11, fontStyle: 'italic' }
});

export default PeriodTracker;
