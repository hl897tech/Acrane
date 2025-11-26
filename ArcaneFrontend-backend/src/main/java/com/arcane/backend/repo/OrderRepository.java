package com.arcane.backend.repo;

import com.arcane.backend.model.OrderEntity;
import com.arcane.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByUser(User user);
}
