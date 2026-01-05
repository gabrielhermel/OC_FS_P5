package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TeacherControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private TeacherRepository teacherRepository;

  private Teacher testTeacher;

  @BeforeEach
  void setUp() {
    testTeacher = new Teacher();
    testTeacher.setFirstName("Test");
    testTeacher.setLastName("Teacher");
    testTeacher.setCreatedAt(LocalDateTime.now());
    testTeacher.setUpdatedAt(LocalDateTime.now());
    testTeacher = teacherRepository.save(testTeacher);
  }

  @Test
  @WithMockUser
  void testFindTeacherById() throws Exception {
    // When & Then
    mockMvc.perform(get("/api/teacher/" + testTeacher.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.firstName").value("Test"))
        .andExpect(jsonPath("$.lastName").value("Teacher"));
  }

  @Test
  @WithMockUser
  void testFindAllTeachers() throws Exception {
    // When & Then
    mockMvc.perform(get("/api/teacher"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray());
  }

  @Test
  @WithMockUser
  void testFindTeacherByIdNotFound() throws Exception {
    // When & Then
    mockMvc.perform(get("/api/teacher/999999"))
        .andExpect(status().isNotFound());
  }
}