package com.campusconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CampusConnectApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusConnectApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  CampusConnect Backend API Started Successfully  ");
        System.out.println("  API Docs: http://localhost:8080/swagger-ui.html ");
        System.out.println("  H2 Console: http://localhost:8080/h2-console    ");
        System.out.println("=================================================");
    }
}
