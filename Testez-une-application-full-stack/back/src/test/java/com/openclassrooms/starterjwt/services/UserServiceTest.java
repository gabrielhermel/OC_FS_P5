package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private UserService userService;

  private User testUser;

  @BeforeEach
  void setUp() {
    testUser = new User();
    testUser.setId(1L);
    testUser.setEmail("test@test.com");
    testUser.setFirstName("John");
    testUser.setLastName("Doe");
    testUser.setPassword("password123");
    testUser.setAdmin(false);
  }

  @Test
  void testDeleteUser() {
    // Given
    Long userId = 1L;

    // When
    userService.delete(userId);

    // Then
    verify(userRepository, times(1)).deleteById(userId);
  }

  @Test
  void testFindByIdWhenUserExists() {
    // Given
    Long userId = 1L;
    when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

    // When
    User result = userService.findById(userId);

    // Then
    assertNotNull(result);
    assertEquals(userId, result.getId());
    assertEquals("test@test.com", result.getEmail());
    assertEquals("John", result.getFirstName());
    assertEquals("Doe", result.getLastName());
    verify(userRepository, times(1)).findById(userId);
  }

  @Test
  void testFindByIdWhenUserDoesNotExist() {
    // Given
    Long userId = 999L;
    when(userRepository.findById(userId)).thenReturn(Optional.empty());

    // When
    User result = userService.findById(userId);

    // Then
    assertNull(result);
    verify(userRepository, times(1)).findById(userId);
  }
}