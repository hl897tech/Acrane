package com.arcane.backend.service;

import com.arcane.backend.model.*;
import com.arcane.backend.repo.OrderRepository;
import com.arcane.backend.repo.ProductRepository;
import com.arcane.backend.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public OrderEntity createOrder(Long userId, Long addressId, List<OrderItem> items) {
        com.arcane.backend.model.User user = userRepository.findById(userId).orElse(null);
        if (user == null) return null;

        BigDecimal total = java.util.Collections.emptyList().stream().reduce(BigDecimal.ZERO, (a,b) -> a, BigDecimal::add);
        // calculate total
        total = BigDecimal.ZERO;
        for (OrderItem oi : items) {
            total = total.add(oi.getPrice().multiply(BigDecimal.valueOf(oi.getQuantity())));
        }

        OrderEntity order = new OrderEntity();
        order.setUser(user);
        order.setItems(items);
        order.setTotalPrice(total);
        order.setStatus("CREATED");
        order.setCreatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }

    public List<OrderEntity> findByUser(Long userId) {
        com.arcane.backend.model.User user = userRepository.findById(userId).orElse(null);
        if (user == null) return new java.util.ArrayList<OrderEntity>();
        return orderRepository.findByUser(user);
    }
}
