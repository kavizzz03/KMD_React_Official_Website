// ✅ Helper functions for managing cart in localStorage

// Get all cart items
export const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    console.error("Error reading cart:", error);
    return [];
  }
};

// Save cart to localStorage
export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Add item to cart
export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  const existingIndex = cart.findIndex((item) => item.id === product.id);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      image_url: product.image_url,
      sell_price: product.discounted_price || product.sell_price,
      quantity,
    });
  }

  saveCart(cart);
};

// Remove item from cart
export const removeFromCart = (id) => {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
};

// ✅ Update cart item quantity
export const updateCartQuantity = (id, newQuantity) => {
  const cart = getCart().map((item) =>
    item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
  );
  saveCart(cart);
};

// ✅ Clear entire cart
export const clearCart = () => {
  localStorage.removeItem("cart");
};

// Get total number of items in cart
export const getCartCount = () => {
  return getCart().reduce((total, item) => total + item.quantity, 0);
};

// Get total cart price
export const getCartTotal = () => {
  return getCart().reduce(
    (total, item) => total + (item.sell_price || 0) * item.quantity,
    0
  );
};
