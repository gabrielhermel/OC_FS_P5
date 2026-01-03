package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

  @Mock
  private SessionRepository sessionRepository;

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private SessionService sessionService;

  private Session testSession;
  private User testUser;

  @BeforeEach
  void setUp() {
    testSession = new Session();
    testSession.setId(1L);
    testSession.setUsers(new ArrayList<>());

    testUser = new User();
    testUser.setId(1L);
  }

  @Test
  void testCreate() {
    // Given
    when(sessionRepository.save(any(Session.class))).thenReturn(testSession);

    // When
    Session result = sessionService.create(testSession);

    // Then
    assertNotNull(result);
    verify(sessionRepository, times(1)).save(testSession);
  }

  @Test
  void testParticipateSuccess() {
    // Given
    when(sessionRepository.findById(1L)).thenReturn(Optional.of(testSession));
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

    // When
    sessionService.participate(1L, 1L);

    // Then
    verify(sessionRepository, times(1)).save(testSession);
  }

  @Test
  void testParticipateAlreadyParticipating() {
    // Given
    testSession.getUsers().add(testUser);
    when(sessionRepository.findById(1L)).thenReturn(Optional.of(testSession));
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

    // When & Then
    assertThrows(BadRequestException.class, () -> sessionService.participate(1L, 1L));
  }

  @Test
  void testNoLongerParticipateSuccess() {
    // Given
    testSession.getUsers().add(testUser);
    when(sessionRepository.findById(1L)).thenReturn(Optional.of(testSession));

    // When
    sessionService.noLongerParticipate(1L, 1L);

    // Then
    verify(sessionRepository, times(1)).save(testSession);
  }

  @Test
  void testParticipateWhenSessionNotFound() {
    // Given
    when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

    // When & Then
    assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 1L));
  }

  @Test
  void testNoLongerParticipateWhenNotParticipating() {
    // Given
    when(sessionRepository.findById(1L)).thenReturn(Optional.of(testSession));

    // When & Then
    assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(1L, 1L));
  }

  @Test
  void testNoLongerParticipateWhenSessionNotFound() {
    // Given
    when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

    // When & Then
    assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(1L, 1L));
  }
}