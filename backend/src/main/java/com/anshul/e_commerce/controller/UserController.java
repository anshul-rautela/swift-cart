package com.anshul.e_commerce.controller;

import com.anshul.e_commerce.entity.User;
import com.anshul.e_commerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }
    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id){
        return userService.getUserById(id);
    }
    @PostMapping("/users")
    public User createUser(@RequestBody User user){
        return userService.createUser(user);
    }
    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id,@RequestBody User user){
        return userService.updateUser(id,user);
    }
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
    }
}
