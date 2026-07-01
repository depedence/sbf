package ru.sbf.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import ru.sbf.dto.request.LoginRequest;
import ru.sbf.dto.request.RegisterRequest;
import ru.sbf.dto.response.AuthResponse;
import ru.sbf.entity.User;
import ru.sbf.repository.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    JwtService jwtService;

    @InjectMocks
    AuthService authService;

    @Test
    void register_success() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@test.com");
        request.setPassword("123456");
        request.setName("Alex");

        when(userRepository.existsByEmail("test@test.com")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("hashed_password");
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt_token");

        AuthResponse response = authService.register(request);

        assertEquals("jwt_token", response.getToken());

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_emailExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@test.com");
        request.setPassword("123456");
        request.setName("Alex");

        when(userRepository.existsByEmail("test@test.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.register(request));
    }

    @Test
    void login_success() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("123456");

        User user = new User();
        user.setEmail("test@test.com");
        user.setPassword("hashed_password");
        user.setName("Alex");

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123456", "hashed_password")).thenReturn(true);
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt_token");

        AuthResponse response = authService.login(request);

        assertEquals("jwt_token", response.getToken());
    }

    @Test
    void login_invalidPassword() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("123456");

        User user = new User();
        user.setEmail("test@test.com");
        user.setPassword("hashed_password");
        user.setName("Alex");

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123456", "hashed_password")).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> authService.login(request));
    }
}