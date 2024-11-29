import React, { useContext } from "react";
import { FlatList, View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import CartContext from "./CartContext";

const CartScreen = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  const navigation = useNavigation(); // Initialize navigation

  const handleRemove = async (id) => {
    try {
      Alert.alert(
        "Remove Item",
        "Are you sure you want to remove this item?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            onPress: async () => {
              const success = await removeFromCart(id);
              if (success) {
                Alert.alert("Success", "Item removed successfully");
              }
            },
            style: "destructive",
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to remove item");
    }
  };

  // Function to handle the navigation to PaymentScreen
  const handleProceedToPay = () => {
    if (cart.length === 0) {
      Alert.alert("Empty Cart", "Your cart is empty. Please add items to proceed.");
    } else {
      navigation.navigate("Payment");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.itemDetails}>
              <Text style={styles.name}>{item.name || "Unnamed Item"}</Text>
              <Text style={styles.price}>Price: ${item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemove(item.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.proceedButton}
        onPress={handleProceedToPay} // Call handleProceedToPay on press
      >
        <Text style={styles.proceedButtonText}>Proceed to Pay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  item: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 14,
    color: "#555",
  },
  removeButton: {
    backgroundColor: "red",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignSelf: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  proceedButton: {
    backgroundColor: "#44C062", // Green color for Proceed button
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginTop: 20,
    alignSelf: "center",
  },
  proceedButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CartScreen;
