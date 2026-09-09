import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { signUpUser } from '../../services/authService';
import { Loader } from '../../components/Loader';
import { theme } from '../../theme';

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identifier, setIdentifier] = useState(''); // Email or Phone Number
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!firstName || !lastName || !identifier || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    // Password length validation (Minimum 8 characters)
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setError('');
    setLoading(true);

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const { error: err } = await signUpUser(identifier, password, fullName);
    
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create a new account</Text>
          <Text style={styles.subtitle}>It's quick and easy.</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Name Fields (First Name & Last Name like Facebook) */}
          <View style={styles.nameRow}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="First name"
              placeholderTextColor={theme.colors.textSecondary}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Surname"
              placeholderTextColor={theme.colors.textSecondary}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* Email or Mobile Number Field */}
          <TextInput
            style={styles.input}
            placeholder="Mobile number or email address"
            placeholderTextColor={theme.colors.textSecondary}
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
          />

          {/* Password Field with Validation Logic */}
          <TextInput
            style={styles.input}
            placeholder="New password (min 8 chars)"
            placeholderTextColor={theme.colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
            {loading ? <Loader /> : <Text style={styles.registerButtonText}>Sign Up</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}>Already have an account?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background || '#f9fafb',
  },
  scrollContainer: {
    flexGrow: 1,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.notification || '#ef4444',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    fontSize: theme.typography.fontSizes.sm,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
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
  registerButton: {
    height: 50,
    backgroundColor: theme.colors.success || '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginBottom: theme.spacing.md,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: theme.typography.fontSizes.md,
    fontWeight: 'bold',
  },
  loginLink: {
    color: theme.colors.primary || '#1e293b',
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    fontWeight: '500',
  },
});
