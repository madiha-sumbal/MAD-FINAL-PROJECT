import React, { useContext, useState } from "react";
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import CartContext from "./CartContext";

const DetailsScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const basePrice = 2; // Fixed initial price
  const totalPrice = basePrice * quantity;

  const handleAddToCart = async () => {
    const cartItem = {
      ...item,
      price: totalPrice, // Use updated total price
      quantity: quantity,
    };

    try {
      const success = await addToCart(cartItem);
      if (success) {
        Alert.alert("Success", "Item added to cart!");
        navigation.navigate("Cart");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add item to cart.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.price}>Price: ${totalPrice.toFixed(2)}</Text>

      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <TextInput
          value={String(quantity)}
          onChangeText={(text) => setQuantity(Number(text))}
          style={styles.quantityInput}
          keyboardType="number-pad"
        />
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity((prev) => prev + 1)}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.addToCartButton}
        onPress={handleAddToCart}
      >
        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  price: {
    fontSize: 18,
    marginBottom: 20,
    color: "#2ecc71",
    fontWeight: "600",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 5,
  },
  quantityButton: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  quantityInput: {
    width: 50,
    height: 40,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  addToCartButton: {
    backgroundColor: "#2ecc71",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 60,
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addToCartButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default DetailsScreen;
