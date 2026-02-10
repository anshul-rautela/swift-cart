package com.anshul.e_commerce.service;

import com.anshul.e_commerce.entity.Product;
import com.anshul.e_commerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }
    public Product getProductById(Long id){
        Optional<Product> p =productRepository.findById(id);
        if(!p.isPresent()) throw new RuntimeException("Product with id "+id+" does not exist");
        return p.get();
    }
    public Product createProduct(Product product){
        return productRepository.save(product);
    }
    public Product updateProduct(Long id,Product product){
        product.setId(id);
        return productRepository.save(product);
    }
    public void deleteProduct(Long id){
        Product p = getProductById(id);
        productRepository.deleteById(id);
    }
}
