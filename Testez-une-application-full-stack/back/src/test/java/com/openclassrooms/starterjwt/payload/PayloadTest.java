package com.openclassrooms.starterjwt.payload;

import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PayloadTest {

  @Test
  void testLoginRequest() {
    // Given
    LoginRequest request = new LoginRequest();

    // When
    request.setEmail("test@test.com");
    request.setPassword("password123");

    // Then
    assertEquals("test@test.com", request.getEmail());
    assertEquals("password123", request.getPassword());
  }

  @Test
  void testSignupRequest() {
    // Given
    SignupRequest request = new SignupRequest();

    // When
    request.setEmail("test@test.com");
    request.setFirstName("John");
    request.setLastName("Doe");
    request.setPassword("password123");

    // Then
    assertEquals("test@test.com", request.getEmail());
    assertEquals("John", request.getFirstName());
    assertEquals("Doe", request.getLastName());
    assertEquals("password123", request.getPassword());
  }

  @Test
  void testSignupRequestEqualsAndHashCode() {
    // Given
    SignupRequest request1 = new SignupRequest();
    request1.setEmail("test@test.com");
    request1.setFirstName("John");
    request1.setLastName("Doe");
    request1.setPassword("password123");

    SignupRequest request2 = new SignupRequest();
    request2.setEmail("test@test.com");
    request2.setFirstName("John");
    request2.setLastName("Doe");
    request2.setPassword("password123");

    // Then
    assertEquals(request1, request2);
    assertEquals(request1.hashCode(), request2.hashCode());
    assertEquals(request1.toString(), request2.toString());
  }

  @Test
  void testJwtResponse() {
    // Given & When
    JwtResponse response = new JwtResponse(
        "token123",
        1L,
        "user@test.com",
        "John",
        "Doe",
        false
    );

    // Then
    assertEquals("token123", response.getToken());
    assertEquals("Bearer", response.getType());
    assertEquals(1L, response.getId());
    assertEquals("user@test.com", response.getUsername());
    assertEquals("John", response.getFirstName());
    assertEquals("Doe", response.getLastName());
    assertFalse(response.getAdmin());

    // Test setters
    response.setToken("newToken");
    response.setType("Custom");
    response.setId(2L);
    response.setUsername("new@test.com");
    response.setFirstName("Jane");
    response.setLastName("Smith");
    response.setAdmin(true);

    assertEquals("newToken", response.getToken());
    assertEquals("Custom", response.getType());
    assertEquals(2L, response.getId());
    assertEquals("new@test.com", response.getUsername());
    assertEquals("Jane", response.getFirstName());
    assertEquals("Smith", response.getLastName());
    assertTrue(response.getAdmin());
  }

  @Test
  void testMessageResponse() {
    // Given & When
    MessageResponse response = new MessageResponse("Success");

    // Then
    assertEquals("Success", response.getMessage());

    // Test setter
    response.setMessage("Updated");
    assertEquals("Updated", response.getMessage());
  }

  @Test
  void testSignupRequestEqualsDifferentValues() {
    // Given
    SignupRequest request1 = new SignupRequest();
    request1.setEmail("test1@test.com");
    request1.setFirstName("John");
    request1.setLastName("Doe");
    request1.setPassword("password123");

    SignupRequest request2 = new SignupRequest();
    request2.setEmail("test2@test.com");
    request2.setFirstName("Jane");
    request2.setLastName("Smith");
    request2.setPassword("password456");

    // Then
    assertNotEquals(request1, request2);
    assertNotEquals(request1.hashCode(), request2.hashCode());
    assertNotEquals(null, request1);
    assertNotEquals(new Object(), request1);
  }

  // NOTE: SignupRequest branch coverage at 42% due to Lombok @Data annotation which
  // generates complex equals() and hashCode() methods with numerous conditional branches
}