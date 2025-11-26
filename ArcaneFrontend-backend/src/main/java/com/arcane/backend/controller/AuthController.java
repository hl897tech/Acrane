package com.arcane.backend.controller;

import com.arcane.backend.dto.ApiResponse;
import com.arcane.backend.model.User;
import com.arcane.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String password = body.get("password");
        if (username == null || email == null || password == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing fields"));
        }
        User u = authService.register(username, email, password);
        if (u == null) {
            return ResponseEntity.ok(ApiResponse.error("Email already registered"));
        }
        return ResponseEntity.ok(ApiResponse.success("Registered", null));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing credentials"));
        }
        String token = authService.login(email, password);
        if (token == null) {
            return ResponseEntity.ok(ApiResponse.error("Invalid credentials"));
        }
        Map<String, Object> data = new HashMap<>();
        // Return token and userId
        data.put("token", token);
        authService.findByEmail(email).ifPresent(u -> data.put("userId", u.getId()));
        return ResponseEntity.ok(ApiResponse.success("Login success", data));
    }
}
