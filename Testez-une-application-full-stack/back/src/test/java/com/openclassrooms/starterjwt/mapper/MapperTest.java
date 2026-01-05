package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import java.util.Collections;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class MapperTest {

  @Autowired
  private UserMapper userMapper;

  @Autowired
  private TeacherMapper teacherMapper;

  @Autowired
  private SessionMapper sessionMapper;

  @Test
  void testUserToDto() {
    // Given
    User user = new User();
    user.setId(1L);
    user.setEmail("test@test.com");
    user.setFirstName("John");
    user.setLastName("Doe");
    user.setPassword("password");
    user.setAdmin(false);

    // When
    UserDto dto = userMapper.toDto(user);

    // Then
    assertNotNull(dto);
    assertEquals(user.getId(), dto.getId());
    assertEquals(user.getEmail(), dto.getEmail());
    assertEquals(user.getFirstName(), dto.getFirstName());
    assertEquals(user.getLastName(), dto.getLastName());
    assertEquals(user.isAdmin(), dto.isAdmin());
  }

  @Test
  void testUserToEntity() {
    // Given
    UserDto dto = new UserDto();
    dto.setId(1L);
    dto.setEmail("test@test.com");
    dto.setFirstName("John");
    dto.setLastName("Doe");
    dto.setPassword("password");
    dto.setAdmin(false);

    // When
    User user = userMapper.toEntity(dto);

    // Then
    assertNotNull(user);
    assertEquals(dto.getId(), user.getId());
    assertEquals(dto.getEmail(), user.getEmail());
    assertEquals(dto.getFirstName(), user.getFirstName());
    assertEquals(dto.getLastName(), user.getLastName());
    assertEquals(dto.isAdmin(), user.isAdmin());
  }

  @Test
  void testUserListToDto() {
    // Given
    User user1 = new User();
    user1.setId(1L);
    user1.setEmail("test1@test.com");
    user1.setFirstName("John");
    user1.setLastName("Doe");
    user1.setPassword("password");
    user1.setAdmin(false);

    User user2 = new User();
    user2.setId(2L);
    user2.setEmail("test2@test.com");
    user2.setFirstName("Jane");
    user2.setLastName("Smith");
    user2.setPassword("password");
    user2.setAdmin(false);

    List<User> users = Arrays.asList(user1, user2);

    // When
    List<UserDto> dtos = userMapper.toDto(users);

    // Then
    assertNotNull(dtos);
    assertEquals(2, dtos.size());
    assertEquals(user1.getId(), dtos.get(0).getId());
    assertEquals(user2.getId(), dtos.get(1).getId());
  }

  @Test
  void testTeacherToDto() {
    // Given
    Teacher teacher = new Teacher();
    teacher.setId(1L);
    teacher.setFirstName("Jane");
    teacher.setLastName("Doe");
    teacher.setCreatedAt(LocalDateTime.now());

    // When
    TeacherDto dto = teacherMapper.toDto(teacher);

    // Then
    assertNotNull(dto);
    assertEquals(teacher.getId(), dto.getId());
    assertEquals(teacher.getFirstName(), dto.getFirstName());
    assertEquals(teacher.getLastName(), dto.getLastName());
  }

  @Test
  void testTeacherToEntity() {
    // Given
    TeacherDto dto = new TeacherDto();
    dto.setId(1L);
    dto.setFirstName("Jane");
    dto.setLastName("Doe");

    // When
    Teacher teacher = teacherMapper.toEntity(dto);

    // Then
    assertNotNull(teacher);
    assertEquals(dto.getId(), teacher.getId());
    assertEquals(dto.getFirstName(), teacher.getFirstName());
    assertEquals(dto.getLastName(), teacher.getLastName());
  }

  @Test
  void testTeacherListToDto() {
    // Given
    Teacher teacher1 = new Teacher();
    teacher1.setId(1L);
    teacher1.setFirstName("Jane");

    Teacher teacher2 = new Teacher();
    teacher2.setId(2L);
    teacher2.setFirstName("John");

    List<Teacher> teachers = Arrays.asList(teacher1, teacher2);

    // When
    List<TeacherDto> dtos = teacherMapper.toDto(teachers);

    // Then
    assertNotNull(dtos);
    assertEquals(2, dtos.size());
    assertEquals(teacher1.getId(), dtos.get(0).getId());
    assertEquals(teacher2.getId(), dtos.get(1).getId());
  }

  @Test
  void testSessionToDto() {
    // Given
    Teacher teacher = new Teacher();
    teacher.setId(1L);

    User user = new User();
    user.setId(1L);

    Session session = new Session();
    session.setId(1L);
    session.setName("Yoga Session");
    session.setDate(new Date());
    session.setDescription("A yoga session");
    session.setTeacher(teacher);
    session.setUsers(Collections.singletonList(user));

    // When
    SessionDto dto = sessionMapper.toDto(session);

    // Then
    assertNotNull(dto);
    assertEquals(session.getId(), dto.getId());
    assertEquals(session.getName(), dto.getName());
    assertEquals(session.getDescription(), dto.getDescription());
    assertEquals(teacher.getId(), dto.getTeacher_id());
    assertEquals(1, dto.getUsers().size());
    assertEquals(user.getId(), dto.getUsers().get(0));
  }

  @Test
  void testSessionListToDto() {
    // Given
    Session session1 = new Session();
    session1.setId(1L);
    session1.setName("Session 1");
    session1.setUsers(new ArrayList<>());

    Session session2 = new Session();
    session2.setId(2L);
    session2.setName("Session 2");
    session2.setUsers(new ArrayList<>());

    List<Session> sessions = Arrays.asList(session1, session2);

    // When
    List<SessionDto> dtos = sessionMapper.toDto(sessions);

    // Then
    assertNotNull(dtos);
    assertEquals(2, dtos.size());
    assertEquals(session1.getId(), dtos.get(0).getId());
    assertEquals(session2.getId(), dtos.get(1).getId());
  }

  @Test
  void testUserListToEntity() {
    // Given
    UserDto dto1 = new UserDto();
    dto1.setId(1L);
    dto1.setEmail("test1@test.com");
    dto1.setFirstName("John");
    dto1.setLastName("Doe");
    dto1.setPassword("password");
    dto1.setAdmin(false);

    UserDto dto2 = new UserDto();
    dto2.setId(2L);
    dto2.setEmail("test2@test.com");
    dto2.setFirstName("Jane");
    dto2.setLastName("Smith");
    dto2.setPassword("password");
    dto2.setAdmin(false);

    List<UserDto> dtos = Arrays.asList(dto1, dto2);

    // When
    List<User> users = userMapper.toEntity(dtos);

    // Then
    assertNotNull(users);
    assertEquals(2, users.size());
    assertEquals(dto1.getId(), users.get(0).getId());
    assertEquals(dto2.getId(), users.get(1).getId());
  }

  // NOTE: Mapper branch coverage at 50% due to MapStruct-generated code which creates
  // complex null-checking logic with numerous conditional branches
}