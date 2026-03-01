import React, { useState, useEffect } from 'react';
import { getCartItems, deleteCartItem, clearCart } from '../services/CartService';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const userId = 1; // Hardcoded for now

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = () => {
        getCartItems(userId)
            .then(response => {
                setCartItems(response.data);
            })
            .catch(error => {
                console.error("Error fetching cart:", error);
            });
    };

    const handleRemove = (id) => {
        deleteCartItem(id)
            .then(() => {
                alert('Item removed from cart!');
                fetchCart();
            })
            .catch(error => {
                console.error("Error removing item:", error);
            });
    };

    const handleClearCart = () => {
        if (window.confirm('Clear entire cart?')) {
            clearCart(userId)
                .then(() => {
                    alert('Cart cleared!');
                    fetchCart();
                })
                .catch(error => {
                    console.error("Error clearing cart:", error);
                });
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.quantity * 100), 0); // Price calculation needs product details
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>My Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <div>
                        {cartItems.map(item => (
                            <div key={item.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
                                <p><strong>Product ID:</strong> {item.productId}</p>
                                <p><strong>Quantity:</strong> {item.quantity}</p>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleClearCart}
                        style={{ padding: '10px 20px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}
                    >
                        Clear Cart
                    </button>
                </>
            )}
        </div>
    );
};

export default Cart;