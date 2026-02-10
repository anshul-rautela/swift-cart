package com.anshul.e_commerce.service;

import com.anshul.e_commerce.entity.User;
import com.anshul.e_commerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }
    public User getUserById(Long id){
        Optional<User> user=  userRepository.findById(id);
        if(user.isEmpty()) throw new RuntimeException("User with id"+id+"Not found");
        return user.get();
    }
    public User createUser(User user){
        return userRepository.save(user);
    }
    public User updateUser(Long id,User user){
        user.setId(id);
        return userRepository.save(user);
    }
    public void deleteUser(Long id){
        User user = getUserById(id);
        userRepository.delete(user);
    }
    public User getUserByEmail(String email){
        return userRepository.findByEmail(email);
    }
}
