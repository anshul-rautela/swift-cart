import React, { useState } from 'react';
import { createProduct } from '../services/ProductService';

const AddProduct = ({ onProductAdded }) => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        stock: ''
    });

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createProduct(product)
            .then(response => {
                alert('Product added successfully!');
                setProduct({ name: '', description: '', price: '', imageUrl: '', stock: '' });
                if (onProductAdded) onProductAdded();
            })
            .catch(error => {
                console.error("Error adding product:", error);
            });
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" value={product.name} onChange={handleChange} required style={{ display: 'block', margin: '10px 0', padding: '8px', width: '300px' }} />
                <input name="description" placeholder="Description" value={product.description} onChange={handleChange} required style={{ display: 'block', margin: '10px 0', padding: '8px', width: '300px' }} />
                <input name="price" type="number" placeholder="Price" value={product.price} onChange={handleChange} required style={{ display: 'block', margin: '10px 0', padding: '8px', width: '300px' }} />
                <input name="imageUrl" placeholder="Image URL" value={product.imageUrl} onChange={handleChange} required style={{ display: 'block', margin: '10px 0', padding: '8px', width: '300px' }} />
                <input name="stock" type="number" placeholder="Stock" value={product.stock} onChange={handleChange} required style={{ display: 'block', margin: '10px 0', padding: '8px', width: '300px' }} />
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;