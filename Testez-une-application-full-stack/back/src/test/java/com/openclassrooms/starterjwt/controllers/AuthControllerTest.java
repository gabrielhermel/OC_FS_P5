package com.openclassrooms.starterjwt.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  void testRegisterUser() throws Exception {
    // Given
    SignupRequest signupRequest = new SignupRequest();
    signupRequest.setEmail("newuser@test.com");
    signupRequest.setFirstName("New");
    signupRequest.setLastName("User");
    signupRequest.setPassword("password123");

    // When & Then
    mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(signupRequest)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.message").value("User registered successfully!"));
  }

  @Test
  void testRegisterUserWithExistingEmail() throws Exception {
    // Given - First register a user
    SignupRequest signupRequest = new SignupRequest();
    signupRequest.setEmail("existing@test.com");
    signupRequest.setFirstName("Existing");
    signupRequest.setLastName("User");
    signupRequest.setPassword("password123");

    mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(signupRequest)))
        .andExpect(status().isOk());

    // When & Then - Try to register again with same email
    mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(signupRequest)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));
  }

  @Test
  void testLoginUser() throws Exception {
    // Given - First register a user
    SignupRequest signupRequest = new SignupRequest();
    signupRequest.setEmail("login@test.com");
    signupRequest.setFirstName("Login");
    signupRequest.setLastName("User");
    signupRequest.setPassword("password123");

    mockMvc.perform(post("/api/auth/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(signupRequest)));

    // When & Then - Login with registered credentials
    LoginRequest loginRequest = new LoginRequest();
    loginRequest.setEmail("login@test.com");
    loginRequest.setPassword("password123");

    mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginRequest)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").exists())
        .andExpect(jsonPath("$.username").value("login@test.com"));
  }

  // NOTE: Branch coverage at 75%
  // Missing branch is defensive null check in login where user lookup fails
  // despite successful authentication.
}