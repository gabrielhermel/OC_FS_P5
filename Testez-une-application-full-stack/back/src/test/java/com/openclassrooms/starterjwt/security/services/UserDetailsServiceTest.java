package com.openclassrooms.starterjwt.security.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceTest {

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private UserDetailsServiceImpl userDetailsService;

  @Test
  void testLoadUserByUsername() {
    // Given
    User user = new User();
    user.setId(1L);
    user.setEmail("test@test.com");
    user.setFirstName("John");
    user.setLastName("Doe");
    user.setPassword("password");
    user.setAdmin(false);

    when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

    // When
    UserDetails userDetails = userDetailsService.loadUserByUsername("test@test.com");

    // Then
    assertNotNull(userDetails);
    assertEquals(user.getId(), ((UserDetailsImpl) userDetails).getId());
    assertEquals(user.getEmail(), userDetails.getUsername());
    assertEquals(user.getFirstName(), ((UserDetailsImpl) userDetails).getFirstName());
    assertEquals(user.getLastName(), ((UserDetailsImpl) userDetails).getLastName());
    verify(userRepository, times(1)).findByEmail("test@test.com");
  }

  @Test
  void testLoadUserByUsernameNotFound() {
    // Given
    when(userRepository.findByEmail("notfound@test.com")).thenReturn(Optional.empty());

    // When & Then
    assertThrows(UsernameNotFoundException.class, () -> {
      userDetailsService.loadUserByUsername("notfound@test.com");
    });

    verify(userRepository, times(1)).findByEmail("notfound@test.com");
  }

  @Test
  void testUserDetailsImplMethods() {
    // Given
    UserDetailsImpl userDetails = UserDetailsImpl.builder()
        .id(1L)
        .username("test@test.com")
        .firstName("John")
        .lastName("Doe")
        .password("password")
        .admin(false)
        .build();

    // Then
    assertTrue(userDetails.isAccountNonExpired());
    assertTrue(userDetails.isAccountNonLocked());
    assertTrue(userDetails.isCredentialsNonExpired());
    assertTrue(userDetails.isEnabled());
    assertNotNull(userDetails.getAuthorities());
    assertTrue(userDetails.getAuthorities().isEmpty());
  }

  @Test
  void testUserDetailsImplEquals() {
    // Given
    UserDetailsImpl user1 = UserDetailsImpl.builder().id(1L).build();
    UserDetailsImpl user2 = UserDetailsImpl.builder().id(1L).build();
    UserDetailsImpl user3 = UserDetailsImpl.builder().id(2L).build();

    // Then
    assertEquals(user1, user2);
    assertNotEquals(user3, user1);
    assertNotEquals(null, user1);
    assertNotEquals(new Object(), user1);
  }

  @Test
  void testUserDetailsImplGetters() {
    // Given
    UserDetailsImpl userDetails = UserDetailsImpl.builder()
        .id(1L)
        .username("test@test.com")
        .firstName("John")
        .lastName("Doe")
        .password("password")
        .admin(true)
        .build();

    // Then
    assertEquals(1L, userDetails.getId());
    assertEquals("test@test.com", userDetails.getUsername());
    assertEquals("John", userDetails.getFirstName());
    assertEquals("Doe", userDetails.getLastName());
    assertEquals("password", userDetails.getPassword());
    assertTrue(userDetails.getAdmin());
  }

  // Branch coverage limited to 50% by equals() method conditionals
}