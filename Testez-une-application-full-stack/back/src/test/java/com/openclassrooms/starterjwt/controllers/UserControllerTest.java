package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class UserControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private UserRepository userRepository;

  private User testUser;

  @BeforeEach
  void setUp() {
    testUser = new User();
    testUser.setEmail("usertest@test.com");
    testUser.setFirstName("User");
    testUser.setLastName("Test");
    testUser.setPassword("password");
    testUser.setAdmin(false);
    testUser = userRepository.save(testUser);
  }

  @Test
  @WithMockUser
  void testFindUserById() throws Exception {
    // When & Then
    mockMvc.perform(get("/api/user/" + testUser.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("usertest@test.com"))
        .andExpect(jsonPath("$.firstName").value("User"))
        .andExpect(jsonPath("$.lastName").value("Test"));
  }

  @Test
  @WithMockUser
  void testFindUserByIdNotFound() throws Exception {
    // When & Then
    mockMvc.perform(get("/api/user/999999"))
        .andExpect(status().isNotFound());
  }

  @Test
  @WithMockUser
  void testFindUserByIdInvalidFormat() throws Exception {
    // When & Then
    mockMvc.perform(get("/api/user/invalid"))
        .andExpect(status().isBadRequest());
  }

  @Test
  @WithMockUser(username = "usertest@test.com")
  void testDeleteUser() throws Exception {
    // When & Then
    mockMvc.perform(delete("/api/user/" + testUser.getId()))
        .andExpect(status().isOk());

    // Verify user is deleted
    mockMvc.perform(get("/api/user/" + testUser.getId()))
        .andExpect(status().isNotFound());
  }

  @Test
  @WithMockUser(username = "different@test.com")
  void testDeleteUserUnauthorized() throws Exception {
    // When & Then (Try to delete another user's account)
    mockMvc.perform(delete("/api/user/" + testUser.getId()))
        .andExpect(status().isUnauthorized());
  }
}