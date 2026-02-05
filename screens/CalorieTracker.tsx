
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator } from 'react-native';
import { FoodLog, WaterLog } from '../types';
import { analyzeFoodImage } from '../services/geminiService';

interface CalorieProps {
  logs: FoodLog[];
  setLogs: React.Dispatch<React.SetStateAction<FoodLog[]>>;
  waterLogs: WaterLog[];
  setWaterLogs: React.Dispatch<React.SetStateAction<WaterLog[]>>;
  onBack: () => void;
}

const CalorieTracker: React.FC<CalorieProps> = ({ logs, setLogs, waterLogs, setWaterLogs, onBack }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'log' | 'history' | 'water'>('log');
  const [foodText, setFoodText] = useState('');

  const totalCalories = logs.reduce((sum, log) => sum + log.calories, 0);
  const totalMacros = logs.reduce((acc, log) => ({
    p: acc.p + log.macros.protein,
    c: acc.c + log.macros.carbs,
    f: acc.f + log.macros.fat
  }), { p: 0, c: 0, f: 0 });

  const totalWater = waterLogs.reduce((sum, log) => sum + log.amount, 0);
  const goals = { cal: 2200, p: 140, c: 220, f: 60, water: 2500 };

  const addManualFood = () => {
    if (!foodText) return;
    const newLog: FoodLog = {
      id: Math.random().toString(),
      name: foodText,
      calories: Math.floor(Math.random() * 400 + 100),
      macros: { protein: 25, carbs: 35, fat: 8 },
      timestamp: new Date(),
      unit: 'g',
      amount: 100
    };
    setLogs(prev => [newLog, ...prev]);
    setFoodText('');
  };

  const addWater = (amt: number) => {
    const newLog: WaterLog = {
      id: Math.random().toString(),
      amount: amt,
      timestamp: new Date()
    };
    setWaterLogs(prev => [newLog, ...prev]);
  };

  const MacroBar = ({ label, current, goal, color }: any) => (
    <View style={styles.macroContainer}>
      <View style={styles.macroLabels}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>{current}g / {goal}g</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { backgroundColor: color, width: `${Math.min((current/goal)*100, 100)}%` }]} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MACRO TRACKER</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabs}>
        {['log', 'history', 'water'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as any)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'log' && (
          <View style={styles.pane}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View>
                  <Text style={styles.summaryHint}>TOTAL CALORIES</Text>
                  <Text style={styles.summaryMain}>{totalCalories}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.summaryHint}>GOAL</Text>
                  <Text style={styles.summarySub}>{goals.cal}</Text>
                </View>
              </View>
              <View style={styles.macroList}>
                <MacroBar label="PROTEIN" current={totalMacros.p} goal={goals.p} color="#dc2626" />
                <MacroBar label="CARBS" current={totalMacros.c} goal={goals.c} color="#000" />
                <MacroBar label="FATS" current={totalMacros.f} goal={goals.f} color="#666" />
              </View>
            </View>

            <View style={styles.actionCard}>
              <Text style={styles.cardTitle}>MANUAL LOG</Text>
              <TextInput 
                style={styles.input} 
                placeholder="FOOD NAME" 
                placeholderTextColor="#444" 
                value={foodText} 
                onChangeText={setFoodText} 
              />
              <TouchableOpacity style={styles.addBtn} onPress={addManualFood}>
                <Text style={styles.addBtnText}>ADD TO DIARY</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'history' && (
          <View style={styles.pane}>
            {logs.length === 0 ? (
              <Text style={styles.emptyText}>NO FOOD LOGGED TODAY</Text>
            ) : (
              logs.map(log => (
                <View key={log.id} style={styles.historyItem}>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyName}>{log.name.toUpperCase()}</Text>
                    <Text style={styles.historyTime}>{log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                  <Text style={styles.historyCal}>{log.calories} KCAL</Text>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'water' && (
          <View style={styles.pane}>
            <View style={styles.waterCard}>
              <Text style={styles.waterTitle}>HYDRATION</Text>
              <Text style={styles.waterMain}>{totalWater} ml</Text>
              <View style={styles.progressBarBg}>
                 <View style={[styles.progressBarFill, { backgroundColor: '#3b82f6', width: `${Math.min((totalWater/goals.water)*100, 100)}%` }]} />
              </View>
            </View>
            <View style={styles.waterGrid}>
              {[250, 500, 750].map(amt => (
                <TouchableOpacity key={amt} style={styles.waterBtn} onPress={() => addWater(amt)}>
                  <Text style={styles.waterBtnText}>+{amt}ML</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
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
  tabs: { flexDirection: 'row', padding: 10, backgroundColor: '#111' },
  tab: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: '#dc2626' },
  tabText: { color: '#666', fontSize: 10, fontWeight: '900' },
  activeTabText: { color: '#fff' },
  scrollContent: { padding: 20 },
  pane: { gap: 20 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
  summaryHint: { color: '#999', fontSize: 10, fontWeight: '900' },
  summaryMain: { color: '#000', fontSize: 48, fontWeight: '900' },
  summarySub: { color: '#000', fontSize: 18, fontWeight: '900' },
  macroList: { gap: 12 },
  macroContainer: { gap: 4 },
  macroLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  macroLabel: { color: '#999', fontSize: 8, fontWeight: '900' },
  macroValue: { color: '#000', fontSize: 8, fontWeight: '900' },
  progressBarBg: { height: 6, backgroundColor: '#eee', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%' },
  actionCard: { backgroundColor: '#111', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#222' },
  cardTitle: { color: '#dc2626', fontSize: 10, fontWeight: '900', marginBottom: 16 },
  input: { backgroundColor: '#000', color: '#fff', padding: 16, borderRadius: 12, marginBottom: 16 },
  addBtn: { backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center' },
  addBtnText: { color: '#000', fontWeight: '900', fontSize: 12 },
  historyItem: { backgroundColor: '#111', padding: 20, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  historyName: { color: '#fff', fontWeight: '900', fontSize: 14 },
  historyTime: { color: '#666', fontSize: 10, fontWeight: '700' },
  historyCal: { color: '#dc2626', fontWeight: '900' },
  emptyText: { color: '#444', textAlign: 'center', padding: 40, fontWeight: '900' },
  waterCard: { backgroundColor: '#111', padding: 32, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: '#3b82f630' },
  waterTitle: { color: '#3b82f6', fontSize: 10, fontWeight: '900', marginBottom: 8 },
  waterMain: { color: '#fff', fontSize: 32, fontWeight: '900', marginBottom: 20 },
  waterGrid: { flexDirection: 'row', gap: 10 },
  waterBtn: { flex: 1, backgroundColor: '#111', borderWidth: 1, borderColor: '#222', padding: 20, borderRadius: 16, alignItems: 'center' },
  waterBtnText: { color: '#fff', fontWeight: '900', fontSize: 10 },
  historyInfo: { gap: 2 }
});

export default CalorieTracker;
