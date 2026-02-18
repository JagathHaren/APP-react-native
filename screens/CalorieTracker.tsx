
import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator, Modal, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
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
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const totalCalories = logs.reduce((sum, log) => sum + log.calories, 0);
  const totalMacros = logs.reduce((acc, log) => ({
    p: acc.p + log.macros.protein,
    c: acc.c + log.macros.carbs,
    f: acc.f + log.macros.fat
  }), { p: 0, c: 0, f: 0 });

  const totalWater = waterLogs.reduce((sum, log) => sum + log.amount, 0);
  const goals = { cal: 2200, p: 140, c: 220, f: 60, water: 2500 };

  const handleScanPress = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert("Permission Required", "Allow camera access to scan your meals.");
        return;
      }
    }
    setIsCameraOpen(true);
  };

  const takePicture = async () => {
    if (cameraRef.current && !isScanning) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: true,
        });
        
        setIsCameraOpen(false);
        setIsScanning(true);
        
        const result = await analyzeFoodImage(photo.base64);
        
        if (result && result.foodName) {
          const newLog: FoodLog = {
            id: Math.random().toString(),
            name: result.foodName,
            calories: result.calories,
            macros: {
              protein: result.protein,
              carbs: result.carbs,
              fat: result.fat
            },
            timestamp: new Date(),
            unit: 'g',
            amount: 100
          };
          setLogs(prev => [newLog, ...prev]);
          Alert.alert("Logged Successfully", `Identified: ${result.foodName}`);
        } else {
          Alert.alert("Analysis Failed", "Could not identify food. Please try again or log manually.");
        }
      } catch (e) {
        Alert.alert("Error", "Failed to capture or analyze image.");
      } finally {
        setIsScanning(false);
      }
    }
  };

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
      {/* Loading Overlay */}
      {isScanning && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#dc2626" />
          <Text style={styles.loadingText}>AI ANALYZING MEAL...</Text>
        </View>
      )}

      {/* Camera Modal */}
      <Modal visible={isCameraOpen} animationType="slide">
        <CameraView style={styles.camera} ref={cameraRef}>
          <View style={styles.cameraUI}>
            <TouchableOpacity style={styles.closeCamera} onPress={() => setIsCameraOpen(false)}>
              <Text style={styles.closeCameraText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.cameraGuides}>
               <View style={styles.guideCornerTopLeft} />
               <View style={styles.guideCornerTopRight} />
               <View style={styles.guideCornerBottomLeft} />
               <View style={styles.guideCornerBottomRight} />
            </View>
            <TouchableOpacity style={styles.shutterBtn} onPress={takePicture}>
              <View style={styles.shutterInner} />
            </TouchableOpacity>
            <Text style={styles.cameraHint}>CENTER YOUR MEAL IN THE FRAME</Text>
          </View>
        </CameraView>
      </Modal>

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

            <TouchableOpacity style={styles.scanBtn} onPress={handleScanPress}>
               <Text style={styles.scanBtnEmoji}>📸</Text>
               <Text style={styles.scanBtnText}>SCAN MEAL (AI)</Text>
            </TouchableOpacity>

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
  scanBtn: { backgroundColor: '#fff', borderRadius: 24, padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, shadowColor: '#fff', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  scanBtnEmoji: { fontSize: 24 },
  scanBtnText: { color: '#000', fontWeight: '900', fontSize: 14, fontStyle: 'italic' },
  actionCard: { backgroundColor: '#111', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#222' },
  cardTitle: { color: '#dc2626', fontSize: 10, fontWeight: '900', marginBottom: 16 },
  input: { backgroundColor: '#000', color: '#fff', padding: 16, borderRadius: 12, marginBottom: 16 },
  addBtn: { backgroundColor: '#222', padding: 16, borderRadius: 12, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: '900', fontSize: 12 },
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
  historyInfo: { gap: 2 },
  camera: { flex: 1 },
  cameraUI: { flex: 1, backgroundColor: 'transparent', justifyContent: 'space-between', padding: 40, alignItems: 'center' },
  closeCamera: { alignSelf: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  closeCameraText: { color: '#fff', fontSize: 20, fontWeight: '900' },
  cameraGuides: { width: 250, height: 250, position: 'relative' },
  guideCornerTopLeft: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#fff' },
  guideCornerTopRight: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#fff' },
  guideCornerBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#fff' },
  guideCornerBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#fff' },
  shutterBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', padding: 6 },
  shutterInner: { flex: 1, backgroundColor: '#fff', borderRadius: 34 },
  cameraHint: { color: '#fff', fontWeight: '900', fontSize: 10, letterSpacing: 2, textAlign: 'center' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 999, justifyContent: 'center', alignItems: 'center', gap: 20 },
  loadingText: { color: '#fff', fontWeight: '900', fontStyle: 'italic', letterSpacing: 2 }
});

export default CalorieTracker;
