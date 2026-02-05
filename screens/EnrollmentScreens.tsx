
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Package } from '../types';

const PACKAGES: Package[] = [
  { id: 'f1', category: 'fitness', name: 'Group Squad', price: 49, description: 'Live high-intensity sessions with the community.' },
  { id: 'f2', category: 'fitness', name: 'Personal 1v1', price: 149, description: 'Direct access to pro female athletes and custom programs.' },
  { id: 'f3', category: 'fitness', name: 'Elite Athlete', price: 199, description: 'For competitive transformation and stage prep.' },
  { id: 'n1', category: 'nutrition', name: 'Fuel Plan', price: 39, description: 'Calculated macro targets for your cycle and lifestyle.' },
  { id: 'n2', category: 'nutrition', name: 'VIP Nutrition', price: 79, description: '24/7 access to nutritionist and customized prep menus.' },
];

export const EnrollDecisionScreen: React.FC<{onYes: () => void; onNo: () => void}> = ({ onYes, onNo }) => (
  <View style={styles.centerContainer}>
    <View style={styles.iconCircle}>
      <Text style={styles.iconEmoji}>⚡</Text>
    </View>
    <Text style={styles.title}>START YOUR PROGRAM?</Text>
    <Text style={styles.description}>Join the thousands of women transforming their lives with our proven methodology.</Text>
    
    <View style={styles.buttonGroup}>
      <TouchableOpacity style={styles.primaryBtn} onPress={onYes}>
        <Text style={styles.primaryBtnText}>I'M READY</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryBtn} onPress={onNo}>
        <Text style={styles.secondaryBtnText}>LATER</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export const PackageSelectionScreen: React.FC<{onComplete: (pkgs: Package[]) => void}> = ({ onComplete }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showUpsell, setShowUpsell] = useState(false);

  const togglePackage = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleNext = () => {
    const hasFitness = selectedIds.some(id => PACKAGES.find(p => p.id === id)?.category === 'fitness');
    const hasNutrition = selectedIds.some(id => PACKAGES.find(p => p.id === id)?.category === 'nutrition');
    if ((hasFitness && !hasNutrition) || (!hasFitness && hasNutrition)) {
      setShowUpsell(true);
    } else {
      onComplete(PACKAGES.filter(p => selectedIds.includes(p.id)));
    }
  };

  const totalPrice = selectedIds.reduce((sum, id) => sum + (PACKAGES.find(p => p.id === id)?.price || 0), 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CHOOSE YOUR PATH</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollPadding}>
        <Text style={styles.sectionLabel}>FITNESS SQUADS</Text>
        {PACKAGES.filter(p => p.category === 'fitness').map(pkg => (
          <TouchableOpacity 
            key={pkg.id} 
            style={[styles.pkgCard, selectedIds.includes(pkg.id) && styles.pkgCardSelected]} 
            onPress={() => togglePackage(pkg.id)}
          >
            <View style={styles.pkgHeader}>
              <Text style={styles.pkgTitle}>{pkg.name.toUpperCase()}</Text>
              <Text style={styles.pkgPrice}>${pkg.price}</Text>
            </View>
            <Text style={styles.pkgDesc}>{pkg.description}</Text>
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionLabel, { marginTop: 32 }]}>NUTRITION PLANS</Text>
        {PACKAGES.filter(p => p.category === 'nutrition').map(pkg => (
          <TouchableOpacity 
            key={pkg.id} 
            style={[styles.pkgCard, selectedIds.includes(pkg.id) && styles.pkgCardSelected]} 
            onPress={() => togglePackage(pkg.id)}
          >
            <View style={styles.pkgHeader}>
              <Text style={styles.pkgTitle}>{pkg.name.toUpperCase()}</Text>
              <Text style={styles.pkgPrice}>${pkg.price}</Text>
            </View>
            <Text style={styles.pkgDesc}>{pkg.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.primaryBtn, selectedIds.length === 0 && { opacity: 0.3 }]} 
          disabled={selectedIds.length === 0}
          onPress={handleNext}
        >
          <Text style={styles.primaryBtnText}>CONTINUE (${totalPrice})</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showUpsell} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>FUEL YOUR BODY?</Text>
            <Text style={styles.modalDesc}>Combining training with professional nutrition coaching increases results by up to 300%.</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowUpsell(false)}>
              <Text style={styles.primaryBtnText}>ADD NUTRITION</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => onComplete(PACKAGES.filter(p => selectedIds.includes(p.id)))}>
              <Text style={styles.secondaryBtnText}>NO THANKS, JUST TRAINING</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const PaymentScreen: React.FC<{onComplete: () => void}> = ({ onComplete }) => {
  const [method, setMethod] = useState<'upi' | 'bank' | null>(null);
  const [paid, setPaid] = useState(false);

  if (paid) {
    return (
      <View style={styles.centerContainer}>
        <View style={[styles.iconCircle, { backgroundColor: '#dc2626' }]}>
          <Text style={styles.iconEmoji}>✅</Text>
        </View>
        <Text style={styles.title}>ENROLLED!</Text>
        <Text style={styles.description}>Welcome to the inner circle. Your journey starts now.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={onComplete}>
          <Text style={styles.primaryBtnText}>LET'S TRAIN</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { padding: 24, marginTop: 40 }]}>SECURE CHECKOUT</Text>
      <View style={styles.scrollPadding}>
        <TouchableOpacity 
          style={[styles.methodCard, method === 'upi' && styles.methodSelected]} 
          onPress={() => setMethod('upi')}
        >
          <Text style={styles.methodTitle}>UPI FAST PAY</Text>
          <Text style={styles.methodSub}>Google Pay, PhonePe, Paytm</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.methodCard, method === 'bank' && styles.methodSelected]} 
          onPress={() => setMethod('bank')}
        >
          <Text style={styles.methodTitle}>BANK TRANSFER</Text>
          <Text style={styles.methodSub}>Direct IMPS / NEFT</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.primaryBtn, !method && { opacity: 0.3 }]} 
          disabled={!method}
          onPress={() => setPaid(true)}
        >
          <Text style={styles.primaryBtnText}>PAY NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#000' },
  iconCircle: { width: 100, height: 100, backgroundColor: '#dc2626', borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  iconEmoji: { fontSize: 40 },
  title: { color: '#fff', fontSize: 28, fontWeight: '900', fontStyle: 'italic', textAlign: 'center' },
  description: { color: '#666', textAlign: 'center', marginVertical: 20, lineHeight: 22 },
  buttonGroup: { width: '100%', gap: 12 },
  primaryBtn: { backgroundColor: '#fff', padding: 20, borderRadius: 16, alignItems: 'center', width: '100%' },
  primaryBtnText: { color: '#000', fontWeight: '900', letterSpacing: 1 },
  secondaryBtn: { padding: 16, alignItems: 'center' },
  secondaryBtnText: { color: '#666', fontWeight: '800' },
  header: { padding: 24, borderBottomWidth: 1, borderBottomColor: '#222' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '900', fontStyle: 'italic' },
  scrollPadding: { padding: 24 },
  sectionLabel: { color: '#dc2626', fontWeight: '900', fontSize: 10, letterSpacing: 2, marginBottom: 16 },
  pkgCard: { backgroundColor: '#111', padding: 20, borderRadius: 24, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  pkgCardSelected: { borderColor: '#dc2626', backgroundColor: '#dc262610' },
  pkgHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  pkgTitle: { color: '#fff', fontWeight: '900', fontStyle: 'italic' },
  pkgPrice: { color: '#dc2626', fontWeight: '900' },
  pkgDesc: { color: '#555', fontSize: 12, lineHeight: 18 },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: '#222' },
  modalOverlay: { flex: 1, backgroundColor: '#000000f0', justifyContent: 'center', padding: 32 },
  modalBox: { backgroundColor: '#111', padding: 32, borderRadius: 32, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  modalTitle: { color: '#fff', fontSize: 24, fontWeight: '900', fontStyle: 'italic', marginBottom: 16 },
  modalDesc: { color: '#666', textAlign: 'center', marginBottom: 32, lineHeight: 20 },
  methodCard: { backgroundColor: '#111', padding: 24, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  methodSelected: { borderColor: '#dc2626', backgroundColor: '#dc262610' },
  methodTitle: { color: '#fff', fontWeight: '900', fontStyle: 'italic', fontSize: 14 },
  methodSub: { color: '#444', fontSize: 10, marginTop: 4, fontWeight: '700' }
});
