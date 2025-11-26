package com.arcane.backend.service;

import com.arcane.backend.model.User;
import com.arcane.backend.repo.UserRepository;
import com.arcane.backend.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public User register(String username, String email, String rawPassword) {
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) return null;
        String hash = passwordEncoder.encode(rawPassword);
        User u = new User(username, email, hash);
        return userRepository.save(u);
    }

    public String login(String email, String rawPassword) {
        Optional<User> uo = userRepository.findByEmail(email);
        if (!uo.isPresent()) return null;
        User u = uo.get();
        if (!passwordEncoder.matches(rawPassword, u.getPassword())) return null;
        return jwtUtil.generateToken(u);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
