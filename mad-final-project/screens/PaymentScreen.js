import React, { useState } from 'react'; 
import {  
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik/dist/formik.esm';
import * as yup from 'yup';
import axios from 'axios';

const PaymentScreen = () => {
  const navigation = useNavigation();

  const BASE_URL = 'https://mad-app-firebase-auth-default-rtdb.firebaseio.com/';
  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', name: 'Master Card', icon: 'card-outline' },
    { id: '2', name: 'PayPal', icon: 'logo-paypal' },
    { id: '3', name: 'UPI', icon: 'cash-outline' },
  ]);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handlePaymentMethodSelect = (method) => {
    setSelectedMethod(method.id);
  };

  // Yup Validation Schema
  const paymentSchema = yup.object().shape({
    name: yup.string().required('Cardholder Name is required'),
    cardNumber: yup
      .string()
      .matches(/^[0-9]+$/, 'Card Number must be numeric')
      .required('Card Number is required'),
    expiry: yup
      .string()
      .matches(
        /^(0[1-9]|1[0-2])\/\d{2}$/,
        'Expiry Date must be in MM/YY format'
      )
      .required('Expiry Date is required'),
    cvv: yup
      .string()
      .matches(/^[0-9]{3}$/, 'CVV must be a 3-digit number')
      .required('CVV is required'),
  });

  const handleConfirmPayment = async (values) => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    // Save payment details to Firebase
    const paymentData = {
      name: values.name,
      cardNumber: values.cardNumber,
      expiry: values.expiry,
      cvv: values.cvv,
      paymentMethod: paymentMethods.find((method) => method.id === selectedMethod)?.name,
    };

    try {
      const response = await axios.post(`${BASE_URL}/payments.json`, paymentData);
      if (response.status === 200) {
        Alert.alert('Success', 'Payment confirmed and saved to database');
        navigation.navigate('OrderConfirmed');
      } else {
        Alert.alert('Error', 'Failed to save payment details. Try again.');
      }
    } catch (error) {
      console.error('Error saving payment:', error);
      Alert.alert('Error', 'An error occurred while saving payment details.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#28a745" barStyle="light-content" />
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.toolbarTitle}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Payment Method</Text>
        <FlatList
          horizontal
          data={paymentMethods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = item.id === selectedMethod;

            return (
              <TouchableOpacity
                style={[
                  styles.paymentMethodContainer,
                  isSelected && styles.selectedMethod,
                ]}
                onPress={() => handlePaymentMethodSelect(item)}
              >
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={isSelected ? '#fff' : '#333'}
                  style={styles.icon}
                />
                <Text
                  style={[
                    styles.paymentMethodText,
                    isSelected && { color: '#fff' },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.flatListContainer}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.sectionTitle}>Card Details</Text>
        <Formik
          initialValues={{
            name: '',
            cardNumber: '',
            expiry: '',
            cvv: '',
          }}
          validationSchema={paymentSchema}
          onSubmit={(values) => handleConfirmPayment(values)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Cardholder Name"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Card Number"
                keyboardType="numeric"
                onChangeText={handleChange('cardNumber')}
                onBlur={handleBlur('cardNumber')}
                value={values.cardNumber}
              />
              {touched.cardNumber && errors.cardNumber && (
                <Text style={styles.errorText}>{errors.cardNumber}</Text>
              )}

              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Expiry (MM/YY)"
                  onChangeText={handleChange('expiry')}
                  onBlur={handleBlur('expiry')}
                  value={values.expiry}
                />
                {touched.expiry && errors.expiry && (
                  <Text style={styles.errorText}>{errors.expiry}</Text>
                )}
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="CVV"
                  keyboardType="numeric"
                  onChangeText={handleChange('cvv')}
                  onBlur={handleBlur('cvv')}
                  value={values.cvv}
                />
                {touched.cvv && errors.cvv && (
                  <Text style={styles.errorText}>{errors.cvv}</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleSubmit}
              >
                <Text style={styles.confirmButtonText}>Confirm Order</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  selectedMethod: {
    backgroundColor: '#28a745',
  },
  icon: {
    marginRight: 10,
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  formContainer: {
    marginVertical: 20,
  },
  confirmButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});
export default PaymentScreen;
