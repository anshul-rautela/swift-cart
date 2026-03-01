import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import Cart from './components/Cart';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <nav style={{ padding: '20px', backgroundColor: '#333', color: 'white' }}>
                    <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Products</Link>
                    <Link to="/add" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Add Product</Link>
                    <Link to="/cart" style={{ color: 'white', textDecoration: 'none' }}>Cart</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/add" element={<AddProduct />} />
                    <Route path="/cart" element={<Cart />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;