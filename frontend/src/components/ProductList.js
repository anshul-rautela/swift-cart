import React, { useState, useEffect } from 'react';
import { getAllProducts, deleteProduct } from '../services/ProductService';
import { addToCart } from '../services/CartService';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const userId = 1; // Hardcoded for now, later use login

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        getAllProducts()
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id)
                .then(() => {
                    alert('Product deleted successfully!');
                    fetchProducts();
                })
                .catch(error => {
                    console.error("Error deleting product:", error);
                });
        }
    };

    const handleAddToCart = (productId) => {
        const cartItem = {
            userId: userId,
            productId: productId,
            quantity: 1
        };

        addToCart(cartItem)
            .then(() => {
                alert('Added to cart!');
            })
            .catch(error => {
                console.error("Error adding to cart:", error);
            });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Products</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {products.map(product => (
                    <div key={product.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p><strong>Price: ${product.price}</strong></p>
                        <p>Stock: {product.stock}</p>
                        <button
                            onClick={() => handleAddToCart(product.id)}
                            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={() => handleDelete(product.id)}
                            style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;