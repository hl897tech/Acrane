package com.arcane.backend.controller;

import com.arcane.backend.dto.ApiResponse;
import com.arcane.backend.model.CartItem;
import com.arcane.backend.model.User;
import com.arcane.backend.service.CartService;
import com.arcane.backend.service.AuthService;
import com.arcane.backend.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;
    private final JwtUtil jwtUtil;

    public CartController(CartService cartService, JwtUtil jwtUtil) {
        this.cartService = cartService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getCart(Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        User u = (User) auth.getPrincipal();
        List<CartItem> items = cartService.getCartForUser(u.getId());

    // map to frontend-friendly DTO
    java.util.List<java.util.Map<String, Object>> list = items.stream().map(i -> {
        java.util.Map<String, Object> m = new java.util.HashMap<String, Object>();
        m.put("productId", i.getProduct().getId());
        m.put("name", i.getProduct().getName());
        m.put("price", i.getProduct().getPrice());
        m.put("quantity", i.getQuantity());
        return m;
    }).collect(Collectors.toList());

    return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> body, Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        User u = (User) auth.getPrincipal();
        Long productId = Long.valueOf(String.valueOf(body.get("productId")));
        int qty = Integer.parseInt(String.valueOf(body.getOrDefault("quantity", 1)));
        boolean ok = cartService.addToCart(u.getId(), productId, qty);
        if (!ok) return ResponseEntity.ok(ApiResponse.error("Failed to add to cart"));
        return ResponseEntity.ok(ApiResponse.success("Added to cart", null));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> remove(@PathVariable Long productId, Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        User u = (User) auth.getPrincipal();
        cartService.removeFromCart(u.getId(), productId);
        return ResponseEntity.ok(ApiResponse.success("Removed", null));
    }
}
