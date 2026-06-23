package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication(excludeName = "org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration")
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	// This bean configures CORS settings for the application. It allows requests from the specified origin (http://localhost:8081) to access the endpoints under the /user/** path. The allowed HTTP methods are GET, POST, PUT, DELETE, and OPTIONS. All headers are allowed, and credentials are supported. This configuration is essential for enabling communication between the frontend application (running on a different port) and the backend API.
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
					.allowedOrigins("http://localhost:8081")
					.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
					.allowedHeaders("*")
					.allowCredentials(true);
			}
		};
	}

}
