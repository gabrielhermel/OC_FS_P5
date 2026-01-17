package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthTokenFilterTest {

  @Mock
  private JwtUtils jwtUtils;

  @Mock
  private UserDetailsServiceImpl userDetailsService;

  @Mock
  private FilterChain filterChain;

  @InjectMocks
  private AuthTokenFilter authTokenFilter;

  private MockHttpServletRequest request;
  private MockHttpServletResponse response;

  @BeforeEach
  void setUp() {
    request = new MockHttpServletRequest();
    response = new MockHttpServletResponse();
    SecurityContextHolder.clearContext();
  }

  @Test
  void doFilterInternal_withValidToken_setsAuthentication() throws ServletException, IOException {
    // Given
    String token = "valid.jwt.token";
    String username = "test@test.com";

    request.addHeader("Authorization", "Bearer " + token);

    UserDetailsImpl userDetails = UserDetailsImpl.builder()
        .id(1L)
        .username(username)
        .firstName("John")
        .lastName("Doe")
        .password("password")
        .build();

    when(jwtUtils.validateJwtToken(token)).thenReturn(true);
    when(jwtUtils.getUserNameFromJwtToken(token)).thenReturn(username);
    when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);

    // When
    authTokenFilter.doFilterInternal(request, response, filterChain);

    // Then
    assertNotNull(SecurityContextHolder.getContext().getAuthentication());
    assertEquals(username, SecurityContextHolder.getContext().getAuthentication().getName());
    verify(filterChain, times(1)).doFilter(request, response);
  }

  @Test
  void doFilterInternal_withInvalidToken_doesNotSetAuthentication() throws ServletException, IOException {
    // Given
    String token = "invalid.jwt.token";
    request.addHeader("Authorization", "Bearer " + token);

    when(jwtUtils.validateJwtToken(token)).thenReturn(false);

    // When
    authTokenFilter.doFilterInternal(request, response, filterChain);

    // Then
    assertNull(SecurityContextHolder.getContext().getAuthentication());
    verify(filterChain, times(1)).doFilter(request, response);
    verify(userDetailsService, never()).loadUserByUsername(anyString());
  }
}