package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtUtilsTest {

  private JwtUtils jwtUtils;
  private final String jwtSecret = "testSecretKeyForJwtTokenGenerationThatIsLongEnough";
  private final int jwtExpirationMs = 3600000;

  @BeforeEach
  void setUp() {
    jwtUtils = new JwtUtils();
    ReflectionTestUtils.setField(jwtUtils, "jwtSecret", jwtSecret);
    ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", jwtExpirationMs);
  }

  @Test
  void testGenerateJwtToken() {
    // Given
    UserDetailsImpl userDetails = UserDetailsImpl.builder()
        .id(1L)
        .username("test@test.com")
        .firstName("John")
        .lastName("Doe")
        .password("password")
        .build();

    Authentication authentication = mock(Authentication.class);
    when(authentication.getPrincipal()).thenReturn(userDetails);

    // When
    String token = jwtUtils.generateJwtToken(authentication);

    // Then
    assertNotNull(token);
    assertFalse(token.isEmpty());
  }

  @Test
  void testGetUserNameFromJwtToken() {
    // Given
    String username = "test@test.com";
    String token = Jwts.builder()
        .setSubject(username)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
        .signWith(SignatureAlgorithm.HS512, jwtSecret)
        .compact();

    // When
    String extractedUsername = jwtUtils.getUserNameFromJwtToken(token);

    // Then
    assertEquals(username, extractedUsername);
  }

  @Test
  void testValidateJwtTokenValid() {
    // Given
    String token = Jwts.builder()
        .setSubject("test@test.com")
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
        .signWith(SignatureAlgorithm.HS512, jwtSecret)
        .compact();

    // When
    boolean isValid = jwtUtils.validateJwtToken(token);

    // Then
    assertTrue(isValid);
  }

  @Test
  void testValidateJwtTokenInvalid() {
    // Given
    String invalidToken = "invalid.token.here";

    // When
    boolean isValid = jwtUtils.validateJwtToken(invalidToken);

    // Then
    assertFalse(isValid);
  }

  @Test
  void testValidateJwtTokenExpired() {
    // Given
    String expiredToken = Jwts.builder()
        .setSubject("test@test.com")
        .setIssuedAt(new Date(System.currentTimeMillis() - 10000))
        .setExpiration(new Date(System.currentTimeMillis() - 5000))
        .signWith(SignatureAlgorithm.HS512, jwtSecret)
        .compact();

    // When
    boolean isValid = jwtUtils.validateJwtToken(expiredToken);

    // Then
    assertFalse(isValid);
  }

  @Test
  void testValidateJwtTokenWithInvalidSignature() {
    // Given (token signed with different secret)
    String tokenWithWrongSecret = Jwts.builder()
        .setSubject("test@test.com")
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
        .signWith(SignatureAlgorithm.HS512, "differentSecretKey1234567890123456")
        .compact();

    // When
    boolean isValid = jwtUtils.validateJwtToken(tokenWithWrongSecret);

    // Then
    assertFalse(isValid);
  }
}