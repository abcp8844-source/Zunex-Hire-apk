import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { signInUser } from '../../services/authService';
import { Loader } from '../../components/Loader';
import { theme } from '../../theme';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    const { error: err } = await signInUser(email, password);
    setLoading(false);
    if (err) {
      setError(err.message);
    }
    // Note: Successful login automatically triggers session state change in App.tsx
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Zunexhire</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor={theme.colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={theme.colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? <Loader /> : <Text style={styles.loginButtonText}>Log In</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>Forgotten password?</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerButtonText}>Create new account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background || '#f9fafb',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  formContainer: {
    backgroundColor: theme.colors.card || '#ffffff',
    padding: theme.spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border || '#e5e7eb',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary || '#1e293b',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.notification || '#ef4444',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border || '#e5e7eb',
    borderRadius: 6,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.background || '#f9fafb',
  },
  loginButton: {
    height: 50,
    backgroundColor: theme.colors.primary || '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginBottom: theme.spacing.md,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: theme.typography.fontSizes.md,
    fontWeight: 'bold',
  },
  forgotText: {
    color: theme.colors.primary || '#1e293b',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border || '#e5e7eb',
    marginBottom: theme.spacing.lg,
  },
  registerButton: {
    height: 48,
    backgroundColor: theme.colors.success || '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: theme.typography.fontSizes.md,
    fontWeight: 'bold',
  },
});
