package com.arcane.backend.controller;

import com.arcane.backend.dto.ApiResponse;
import com.arcane.backend.model.OrderEntity;
import com.arcane.backend.model.OrderItem;
import com.arcane.backend.model.User;
import com.arcane.backend.service.OrderService;
import com.arcane.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> body, Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        User u = (User) auth.getPrincipal();
        Long addressId = Long.valueOf(String.valueOf(body.getOrDefault("addressId", 1)));
        List<Map<String, Object>> itemsRaw = (List<Map<String, Object>>) body.get("items");
        List<OrderItem> items = itemsRaw.stream().map(m -> {
            OrderItem it = new OrderItem();
            it.setProductId(Long.valueOf(String.valueOf(m.get("productId"))));
            it.setQuantity(Integer.parseInt(String.valueOf(m.get("quantity"))));
            it.setName(String.valueOf(m.getOrDefault("name", "")));
            it.setPrice(new BigDecimal(String.valueOf(m.getOrDefault("price", "0"))));
            return it;
        }).collect(Collectors.toList());

        OrderEntity order = orderService.createOrder(u.getId(), addressId, items);
        if (order == null) return ResponseEntity.ok(ApiResponse.error("Failed to create order"));
        java.util.Map<String, Object> data = new java.util.HashMap<String, Object>();
        data.put("orderId", order.getId());
        data.put("status", order.getStatus());
        data.put("totalPrice", order.getTotalPrice());
        return ResponseEntity.ok(ApiResponse.success("Order created", data));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> listByUser(@PathVariable Long userId) {
        List<OrderEntity> orders = orderService.findByUser(userId);
        java.util.List<java.util.Map<String, Object>> out = orders.stream().map(o -> {
            java.util.Map<String, Object> m = new java.util.HashMap<String, Object>();
            m.put("orderId", o.getId());
            m.put("totalPrice", o.getTotalPrice());
            m.put("status", o.getStatus());
            m.put("createdAt", o.getCreatedAt());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(out));
    }
}
