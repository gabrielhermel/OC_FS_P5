package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Date;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class SessionControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private TeacherRepository teacherRepository;

  @Autowired
  private UserRepository userRepository;

  private Teacher testTeacher;
  private User testUser;

  @BeforeEach
  void setUp() {
    // Create a test teacher
    testTeacher = new Teacher();
    testTeacher.setFirstName("Test");
    testTeacher.setLastName("Teacher");
    testTeacher.setCreatedAt(LocalDateTime.now());
    testTeacher.setUpdatedAt(LocalDateTime.now());
    testTeacher = teacherRepository.save(testTeacher);

    // Create a test user
    testUser = new User();
    testUser.setEmail("sessiontest@test.com");
    testUser.setFirstName("Session");
    testUser.setLastName("Tester");
    testUser.setPassword("password");
    testUser.setAdmin(false);
    testUser = userRepository.save(testUser);
  }

  @Test
  @WithMockUser
  void testCreateSession() throws Exception {
    // Given
    SessionDto sessionDto = new SessionDto();
    sessionDto.setName("Yoga Session");
    sessionDto.setDescription("A relaxing yoga session");
    sessionDto.setDate(new Date());
    sessionDto.setTeacher_id(testTeacher.getId());

    // When & Then
    mockMvc.perform(post("/api/session")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(sessionDto)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Yoga Session"))
        .andExpect(jsonPath("$.description").value("A relaxing yoga session"));
  }

  @Test
  @WithMockUser
  void testFindAllSessions() throws Exception {
    // When & Then
    mockMvc.perform(get("/api/session"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray());
  }

  @Test
  @WithMockUser
  void testFindSessionById() throws Exception {
    // Given (Create a session first)
    SessionDto sessionDto = new SessionDto();
    sessionDto.setName("Test Session");
    sessionDto.setDescription("Test Description");
    sessionDto.setDate(new Date());
    sessionDto.setTeacher_id(testTeacher.getId());

    String response = mockMvc.perform(post("/api/session")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(sessionDto)))
        .andReturn().getResponse().getContentAsString();

    SessionDto createdSession = objectMapper.readValue(response, SessionDto.class);

    // When & Then
    mockMvc.perform(get("/api/session/" + createdSession.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Test Session"));
  }

  @Test
  @WithMockUser
  void testFindSessionByIdNotFound() throws Exception {
    // When & Then
    mockMvc.perform(get("/api/session/999999"))
        .andExpect(status().isNotFound());
  }

  @Test
  @WithMockUser
  void testFindSessionByIdInvalidFormat() throws Exception {
    // When & Then
    mockMvc.perform(get("/api/session/invalid"))
        .andExpect(status().isBadRequest());
  }

  @Test
  @WithMockUser
  void testUpdateSession() throws Exception {
    // Given (Create a session first)
    SessionDto sessionDto = new SessionDto();
    sessionDto.setName("Original Session");
    sessionDto.setDescription("Original Description");
    sessionDto.setDate(new Date());
    sessionDto.setTeacher_id(testTeacher.getId());

    String response = mockMvc.perform(post("/api/session")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(sessionDto)))
        .andReturn().getResponse().getContentAsString();

    SessionDto createdSession = objectMapper.readValue(response, SessionDto.class);

    // Update the session
    sessionDto.setName("Updated Session");
    sessionDto.setDescription("Updated Description");

    // When & Then
    mockMvc.perform(put("/api/session/" + createdSession.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(sessionDto)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Updated Session"))
        .andExpect(jsonPath("$.description").value("Updated Description"));
  }

  @Test
  @WithMockUser
  void testUpdateSessionInvalidFormat() throws Exception {
    // Given
    SessionDto sessionDto = new SessionDto();
    sessionDto.setName("Test");
    sessionDto.setDate(new Date());
    sessionDto.setTeacher_id(testTeacher.getId());

    // When & Then
    mockMvc.perform(put("/api/session/invalid")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(sessionDto)))
        .andExpect(status().isBadRequest());
  }

  @Test
  @WithMockUser
  void testDeleteSession() throws Exception {
    // Given (Create a session first)
    SessionDto sessionDto = new SessionDto();
    sessionDto.setName("Session to Delete");
    sessionDto.setDescription("Will be deleted");
    sessionDto.setDate(new Date());
    sessionDto.setTeacher_id(testTeacher.getId());

    String response = mockMvc.perform(post("/api/session")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(sessionDto)))
        .andReturn().getResponse().getContentAsString();

    SessionDto createdSession = objectMapper.readValue(response, SessionDto.class);

    // When & Then
    mockMvc.perform(delete("/api/session/" + createdSession.getId()))
        .andExpect(status().isOk());

    // Verify it's deleted
    mockMvc.perform(get("/api/session/" + createdSession.getId()))
        .andExpect(status().isNotFound());
  }

  @Test
  @WithMockUser
  void testDeleteSessionNotFound() throws Exception {
    // When & Then
    mockMvc.perform(delete("/api/session/999999"))
        .andExpect(status().isNotFound());
  }

  @Test
  @WithMockUser
  void testDeleteSessionInvalidFormat() throws Exception {
    // When & Then
    mockMvc.perform(delete("/api/session/invalid"))
        .andExpect(status().isBadRequest());
  }

  @Test
  @WithMockUser
  void testParticipateInSession() throws Exception {
    // Given (Create a session first)
    SessionDto sessionDto = new SessionDto();
    sessionDto.setName("Participation Session");
    sessionDto.setDescription("Test participation");
    sessionDto.setDate(new Date());
    sessionDto.setTeacher_id(testTeacher.getId());

    String response = mockMvc.perform(post("/api/session")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(sessionDto)))
        .andReturn().getResponse().getContentAsString();

    SessionDto createdSession = objectMapper.readValue(response, SessionDto.class);

    // When & Then
    mockMvc.perform(post("/api/session/" + createdSession.getId() + "/participate/" + testUser.getId()))
        .andExpect(status().isOk());
  }
}