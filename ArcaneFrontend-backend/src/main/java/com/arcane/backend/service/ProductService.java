package com.arcane.backend.service;

import com.arcane.backend.model.Product;
import com.arcane.backend.repo.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Page<Product> list(int page, int size) {
        return productRepository.findAll(PageRequest.of(page - 1, size));
    }

    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }
}
