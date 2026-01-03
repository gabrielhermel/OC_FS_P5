package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import java.util.Collections;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeacherServiceTest {

  @Mock
  private TeacherRepository teacherRepository;

  @InjectMocks
  private TeacherService teacherService;

  private Teacher testTeacher1;
  private Teacher testTeacher2;

  @BeforeEach
  void setUp() {
    testTeacher1 = new Teacher();
    testTeacher1.setId(1L);
    testTeacher1.setFirstName("Jane");
    testTeacher1.setLastName("Doe");
    testTeacher1.setCreatedAt(LocalDateTime.now());
    testTeacher1.setUpdatedAt(LocalDateTime.now());

    testTeacher2 = new Teacher();
    testTeacher2.setId(2L);
    testTeacher2.setFirstName("John");
    testTeacher2.setLastName("Smith");
    testTeacher2.setCreatedAt(LocalDateTime.now());
    testTeacher2.setUpdatedAt(LocalDateTime.now());
  }

  @Test
  void testFindAll() {
    // Given
    List<Teacher> teachers = Arrays.asList(testTeacher1, testTeacher2);
    when(teacherRepository.findAll()).thenReturn(teachers);

    // When
    List<Teacher> result = teacherService.findAll();

    // Then
    assertNotNull(result);
    assertEquals(2, result.size());
    assertEquals("Jane", result.get(0).getFirstName());
    assertEquals("John", result.get(1).getFirstName());
    verify(teacherRepository, times(1)).findAll();
  }

  @Test
  void testFindAllWhenEmpty() {
    // Given
    when(teacherRepository.findAll()).thenReturn(Collections.emptyList());

    // When
    List<Teacher> result = teacherService.findAll();

    // Then
    assertNotNull(result);
    assertTrue(result.isEmpty());
    verify(teacherRepository, times(1)).findAll();
  }

  @Test
  void testFindByIdWhenTeacherExists() {
    // Given
    Long teacherId = 1L;
    when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(testTeacher1));

    // When
    Teacher result = teacherService.findById(teacherId);

    // Then
    assertNotNull(result);
    assertEquals(teacherId, result.getId());
    assertEquals("Jane", result.getFirstName());
    assertEquals("Doe", result.getLastName());
    verify(teacherRepository, times(1)).findById(teacherId);
  }

  @Test
  void testFindByIdWhenTeacherDoesNotExist() {
    // Given
    Long teacherId = 999L;
    when(teacherRepository.findById(teacherId)).thenReturn(Optional.empty());

    // When
    Teacher result = teacherService.findById(teacherId);

    // Then
    assertNull(result);
    verify(teacherRepository, times(1)).findById(teacherId);
  }
}