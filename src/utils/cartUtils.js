// src/utils/cartUtils.js

// 1. Get the full cart array
export const getCart = () => {
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart;
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
};

// 2. Get total quantity of items in cart
export const getCartCount = () => {
  try {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  } catch (error) {
    return 0;
  }
};

// 3. Get full wishlist array
export const getWishlist = () => {
  try {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    return wishlist;
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return [];
  }
};

// 4. Get total count of wishlist items
export const getWishlistCount = () => {
  try {
    const wishlist = getWishlist();
    return wishlist.length;
  } catch (error) {
    return 0;
  }
};

// 5. Add item to cart
export const addToCart = (product) => {
  try {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return false;
  }
};

// 6. Remove specific item from cart
export const removeFromCart = (productId) => {
  try {
    const cart = getCart();
    const updated = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return false;
  }
};

// 7. Update quantity of an item
export const updateCartQuantity = (productId, newQuantity) => {
  try {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity = newQuantity;
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    }
    return true;
  } catch (error) {
    console.error('Error updating quantity:', error);
    return false;
  }
};

// 8. Wipe the entire cart
export const clearCart = () => {
  try {
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
};

// 9. Add to wishlist
export const addToWishlist = (product) => {
  try {
    const wishlist = getWishlist();
    const exists = wishlist.some(item => item.id === product.id);
    if (!exists) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      window.dispatchEvent(new Event('wishlistUpdated'));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return false;
  }
};

// 10. Remove from wishlist
export const removeFromWishlist = (productId) => {
  try {
    const wishlist = getWishlist();
    const updated = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('wishlistUpdated'));
    return true;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return false;
  }
};

// 11. Clear entire wishlist
export const clearWishlist = () => {
  try {
    localStorage.removeItem('wishlist');
    window.dispatchEvent(new Event('wishlistUpdated'));
    return true;
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    return false;
  }
};

// 12. Check if item is in wishlist
export const isInWishlist = (productId) => {
  try {
    const wishlist = getWishlist();
    return wishlist.some(item => item.id === productId);
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};

// 13. Toggle wishlist (add if not exists, remove if exists)
export const toggleWishlist = (product) => {
  try {
    const isIn = isInWishlist(product.id);
    if (isIn) {
      return removeFromWishlist(product.id);
    } else {
      return addToWishlist(product);
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    return false;
  }
};

// 14. Get cart total amount
export const getCartTotal = () => {
  try {
    const cart = getCart();
    return cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
  } catch (error) {
    console.error('Error calculating cart total:', error);
    return 0;
  }
};

// 15. Get cart item count (unique items)
export const getCartItemCount = () => {
  try {
    const cart = getCart();
    return cart.length;
  } catch (error) {
    return 0;
  }
};

// 16. Check if item is in cart
export const isInCart = (productId) => {
  try {
    const cart = getCart();
    return cart.some(item => item.id === productId);
  } catch (error) {
    return false;
  }
};

// 17. Get item quantity in cart
export const getItemQuantity = (productId) => {
  try {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  } catch (error) {
    return 0;
  }
};

// 18. Update cart item (size, color, etc.)
export const updateCartItem = (productId, updates) => {
  try {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
      cart[itemIndex] = { ...cart[itemIndex], ...updates };
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating cart item:', error);
    return false;
  }
};