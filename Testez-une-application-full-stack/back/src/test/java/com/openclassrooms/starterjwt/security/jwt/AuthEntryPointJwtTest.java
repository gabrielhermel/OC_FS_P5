package com.openclassrooms.starterjwt.security.jwt;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Map;
import javax.servlet.ServletException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.AuthenticationException;

class AuthEntryPointJwtTest {

  private AuthEntryPointJwt authEntryPointJwt;
  private MockHttpServletRequest request;
  private MockHttpServletResponse response;

  @BeforeEach
  void setUp() {
    authEntryPointJwt = new AuthEntryPointJwt();
    request = new MockHttpServletRequest();
    response = new MockHttpServletResponse();
  }

  @Test
  void commence_withAuthenticationException_returnsUnauthorizedError()
      throws IOException, ServletException {
    // Given
    request.setServletPath("/api/test");
    AuthenticationException authException = new AuthenticationException("Unauthorized access") {
    };

    // When
    authEntryPointJwt.commence(request, response, authException);

    // Then
    assertEquals(401, response.getStatus());
    assertEquals("application/json", response.getContentType());

    // Parse the response body
    ObjectMapper mapper = new ObjectMapper();
    @SuppressWarnings("unchecked")
    Map<String, Object> body = mapper.readValue(response.getContentAsString(), Map.class);

    assertEquals(401, body.get("status"));
    assertEquals("Unauthorized", body.get("error"));
    assertEquals("Unauthorized access", body.get("message"));
    assertEquals("/api/test", body.get("path"));
  }
}