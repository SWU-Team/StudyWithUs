package com.swu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.swu")
public class StudyWithUsApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudyWithUsApplication.class, args);
	}

}
