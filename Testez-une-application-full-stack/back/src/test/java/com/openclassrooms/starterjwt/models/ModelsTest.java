package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class ModelsTest {

  @Test
  void testUserGettersAndSetters() {
    // Given
    User user = new User();
    LocalDateTime now = LocalDateTime.now();

    // When
    user.setId(1L);
    user.setEmail("test@test.com");
    user.setFirstName("John");
    user.setLastName("Doe");
    user.setPassword("password");
    user.setAdmin(true);
    user.setCreatedAt(now);
    user.setUpdatedAt(now);

    // Then
    assertEquals(1L, user.getId());
    assertEquals("test@test.com", user.getEmail());
    assertEquals("John", user.getFirstName());
    assertEquals("Doe", user.getLastName());
    assertEquals("password", user.getPassword());
    assertTrue(user.isAdmin());
    assertEquals(now, user.getCreatedAt());
    assertEquals(now, user.getUpdatedAt());
  }

  @Test
  void testUserBuilder() {
    // Given & When
    User user = User.builder()
        .id(1L)
        .email("test@test.com")
        .firstName("John")
        .lastName("Doe")
        .password("password")
        .admin(false)
        .build();

    // Then
    assertEquals(1L, user.getId());
    assertEquals("test@test.com", user.getEmail());
    assertEquals("John", user.getFirstName());
    assertEquals("Doe", user.getLastName());
    assertFalse(user.isAdmin());
  }

  @Test
  void testUserEqualsAndHashCode() {
    // Given
    User user1 = new User();
    user1.setId(1L);
    user1.setEmail("test@test.com");

    User user2 = new User();
    user2.setId(1L);
    user2.setEmail("different@test.com");

    User user3 = new User();
    user3.setId(2L);

    // Then
    assertEquals(user1, user2);
    assertNotEquals(user1, user3);
    assertEquals(user1.hashCode(), user2.hashCode());
  }

  @Test
  void testUserToString() {
    // Given
    User user = new User();
    user.setId(1L);
    user.setEmail("test@test.com");

    // When
    String result = user.toString();

    // Then
    assertNotNull(result);
    assertTrue(result.contains("User"));
  }

  @Test
  void testTeacherGettersAndSetters() {
    // Given
    Teacher teacher = new Teacher();
    LocalDateTime now = LocalDateTime.now();

    // When
    teacher.setId(1L);
    teacher.setFirstName("Jane");
    teacher.setLastName("Doe");
    teacher.setCreatedAt(now);
    teacher.setUpdatedAt(now);

    // Then
    assertEquals(1L, teacher.getId());
    assertEquals("Jane", teacher.getFirstName());
    assertEquals("Doe", teacher.getLastName());
    assertEquals(now, teacher.getCreatedAt());
    assertEquals(now, teacher.getUpdatedAt());
  }

  @Test
  void testTeacherBuilder() {
    // Given & When
    Teacher teacher = Teacher.builder()
        .id(1L)
        .firstName("Jane")
        .lastName("Doe")
        .build();

    // Then
    assertEquals(1L, teacher.getId());
    assertEquals("Jane", teacher.getFirstName());
    assertEquals("Doe", teacher.getLastName());
  }

  @Test
  void testTeacherEqualsAndHashCode() {
    // Given
    Teacher teacher1 = new Teacher();
    teacher1.setId(1L);

    Teacher teacher2 = new Teacher();
    teacher2.setId(1L);

    Teacher teacher3 = new Teacher();
    teacher3.setId(2L);

    // Then
    assertEquals(teacher1, teacher2);
    assertNotEquals(teacher1, teacher3);
    assertEquals(teacher1.hashCode(), teacher2.hashCode());
  }

  @Test
  void testSessionGettersAndSetters() {
    // Given
    Session session = new Session();
    Date date = new Date();
    Teacher teacher = new Teacher();
    LocalDateTime now = LocalDateTime.now();

    // When
    session.setId(1L);
    session.setName("Yoga Class");
    session.setDate(date);
    session.setDescription("A relaxing yoga session");
    session.setTeacher(teacher);
    session.setUsers(new ArrayList<>());
    session.setCreatedAt(now);
    session.setUpdatedAt(now);

    // Then
    assertEquals(1L, session.getId());
    assertEquals("Yoga Class", session.getName());
    assertEquals(date, session.getDate());
    assertEquals("A relaxing yoga session", session.getDescription());
    assertEquals(teacher, session.getTeacher());
    assertNotNull(session.getUsers());
    assertEquals(now, session.getCreatedAt());
    assertEquals(now, session.getUpdatedAt());
  }

  @Test
  void testSessionBuilder() {
    // Given
    Date date = new Date();
    Teacher teacher = new Teacher();

    // When
    Session session = Session.builder()
        .id(1L)
        .name("Yoga Class")
        .date(date)
        .description("Description")
        .teacher(teacher)
        .users(new ArrayList<>())
        .build();

    // Then
    assertEquals(1L, session.getId());
    assertEquals("Yoga Class", session.getName());
    assertEquals(date, session.getDate());
  }

  @Test
  void testBuilderToString() {
    // Given & When
    String userBuilder = User.builder().email("test@test.com").toString();
    String teacherBuilder = Teacher.builder().firstName("Jane").toString();
    String sessionBuilder = Session.builder().name("Yoga").toString();

    // Then
    assertNotNull(userBuilder);
    assertNotNull(teacherBuilder);
    assertNotNull(sessionBuilder);
  }

  // NOTE: Models branch coverage at 41% due to Lombok annotations which generate
  // complex methods with numerous conditional branches
}