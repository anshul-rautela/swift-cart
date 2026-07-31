package com.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EcommerceApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcommerceApplication.class, args);
        System.out.println("=================================================");
        System.out.println("   CODECTECH E-COMMERCE PLATFORM IS RUNNING");
        System.out.println("   Access Web App: http://localhost:8080");
        System.out.println("   H2 Console:     http://localhost:8080/h2-console");
        System.out.println("=================================================");
    }
}
