
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppScreen, User, Package, FoodLog, MoodLog, WaterLog, PeriodEntry } from './types';
import SplashScreen from './screens/SplashScreen';
import { LoginScreen, SignupScreen, TrainerLoginScreen } from './screens/AuthScreens';
import { EnrollDecisionScreen, PackageSelectionScreen, PaymentScreen } from './screens/EnrollmentScreens';
import HomeScreen from './screens/HomeScreen';
import CalorieTracker from './screens/CalorieTracker';
import PeriodTracker from './screens/PeriodTracker';
import MoodTracker from './screens/MoodTracker';
import AttendanceCalendar from './screens/AttendanceCalendar';
import SettingsScreen from './screens/SettingsScreen';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [user, setUser] = useState<User | null>(null);
  const [enrolledPackages, setEnrolledPackages] = useState<Package[]>([]);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [periodLogs, setPeriodLogs] = useState<PeriodEntry[]>([]);
  const [attendedDays, setAttendedDays] = useState<number[]>([2, 5, 8]);

  useEffect(() => {
    if (currentScreen === AppScreen.SPLASH) {
      const timer = setTimeout(() => {
        setCurrentScreen(AppScreen.LOGIN);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const navigate = (screen: AppScreen) => {
    setCurrentScreen(screen);
  };

  const handleLoginSuccess = (u: User) => {
    setUser(u);
    navigate(AppScreen.ENROLL_DECISION);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.SPLASH:
        return <SplashScreen />;
      case AppScreen.LOGIN:
        return (
          <LoginScreen 
            onLogin={handleLoginSuccess} 
            onSignUp={() => navigate(AppScreen.SIGNUP)}
            onTrainerLogin={() => navigate(AppScreen.TRAINER_LOGIN)}
          />
        );
      case AppScreen.SIGNUP:
        return <SignupScreen onBack={() => navigate(AppScreen.LOGIN)} onSignup={handleLoginSuccess} />;
      case AppScreen.TRAINER_LOGIN:
        return <TrainerLoginScreen onBack={() => navigate(AppScreen.LOGIN)} onLogin={(u) => { setUser(u); navigate(AppScreen.HOME); }} />;
      case AppScreen.ENROLL_DECISION:
        return <EnrollDecisionScreen onYes={() => navigate(AppScreen.PACKAGES)} onNo={() => navigate(AppScreen.HOME)} />;
      case AppScreen.PACKAGES:
        return <PackageSelectionScreen onComplete={(pkgs) => { setEnrolledPackages(pkgs); navigate(AppScreen.PAYMENT); }} />;
      case AppScreen.PAYMENT:
        return <PaymentScreen onComplete={() => navigate(AppScreen.HOME)} />;
      case AppScreen.HOME:
        return <HomeScreen user={user} enrolledPackages={enrolledPackages} onNavigate={navigate} onEnrollClick={() => navigate(AppScreen.ENROLL_DECISION)} />;
      case AppScreen.CALORIE_TRACKER:
        return <CalorieTracker logs={foodLogs} setLogs={setFoodLogs} waterLogs={waterLogs} setWaterLogs={setWaterLogs} onBack={() => navigate(AppScreen.HOME)} />;
      case AppScreen.PERIOD_TRACKER:
        return <PeriodTracker logs={periodLogs} setLogs={setPeriodLogs} onBack={() => navigate(AppScreen.HOME)} />;
      case AppScreen.MOOD_TRACKER:
        return <MoodTracker logs={moodLogs} setLogs={setMoodLogs} onBack={() => navigate(AppScreen.HOME)} />;
      case AppScreen.CALENDAR:
        return <AttendanceCalendar enrolledPackages={enrolledPackages} attendedDays={attendedDays} onToggleAttendance={(d) => setAttendedDays(p => p.includes(d) ? p.filter(v => v !== d) : [...p, d])} onBack={() => navigate(AppScreen.HOME)} />;
      case AppScreen.SETTINGS:
        return <SettingsScreen user={user} onBack={() => navigate(AppScreen.HOME)} onLogout={() => { setUser(null); navigate(AppScreen.LOGIN); }} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" />
        <View style={styles.innerContainer}>
          {renderScreen()}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  innerContainer: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  }
});

export default App;
