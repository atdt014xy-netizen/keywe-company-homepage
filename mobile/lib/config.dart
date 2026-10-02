import 'package:firebase_core/firebase_core.dart';

const demoMode = bool.fromEnvironment('DEMO', defaultValue: true);
const apiBase = String.fromEnvironment('API_BASE');
const firebaseOptions = FirebaseOptions(
  apiKey: String.fromEnvironment('FIREBASE_API_KEY'),
  appId: String.fromEnvironment('FIREBASE_APP_ID'),
  messagingSenderId: String.fromEnvironment('FIREBASE_SENDER_ID'),
  projectId: String.fromEnvironment('FIREBASE_PROJECT_ID'),
);
