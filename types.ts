
export enum AppScreen {
  SPLASH = 'SPLASH',
  LOGIN = 'LOGIN',
  TRAINER_LOGIN = 'TRAINER_LOGIN',
  SIGNUP = 'SIGNUP',
  ENROLL_DECISION = 'ENROLL_DECISION',
  PACKAGES = 'PACKAGES',
  PAYMENT = 'PAYMENT',
  HOME = 'HOME',
  CALORIE_TRACKER = 'CALORIE_TRACKER',
  PERIOD_TRACKER = 'PERIOD_TRACKER',
  MOOD_TRACKER = 'MOOD_TRACKER',
  CALENDAR = 'CALENDAR',
  SETTINGS = 'SETTINGS'
}

export interface Package {
  id: string;
  name: string;
  category: 'fitness' | 'nutrition';
  description: string;
  price: number;
}

export interface User {
  name: string;
  username: string;
  email: string;
  phone: string;
  isTrainer: boolean;
  enrolledPackages: string[];
}

export interface FoodLog {
  id: string;
  name: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  timestamp: Date;
  unit: 'g' | 'ml' | 'oz';
  amount: number;
  imageUrl?: string;
}

export interface WaterLog {
  id: string;
  amount: number;
  timestamp: Date;
}

export interface PeriodEntry {
  id: string;
  date: Date;
  symptoms: string[];
  flow: 'Light' | 'Medium' | 'Heavy';
  note: string;
}

export interface MoodLog {
  rating: number; // 1-5
  note: string;
  timestamp: Date;
  emojis: string[];
}
