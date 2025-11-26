package com.arcane.backend.controller;

import com.arcane.backend.dto.ApiResponse;
import com.arcane.backend.model.Product;
import com.arcane.backend.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestParam(defaultValue = "1") int page,
                                  @RequestParam(defaultValue = "24") int size) {
        Page<Product> p = productService.list(page, size);
        Map<String, Object> data = new HashMap<>();
        data.put("list", p.getContent());
        data.put("total", p.getTotalElements());
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        return productService.findById(id)
                .map(prod -> ResponseEntity.ok(ApiResponse.ok(prod)))
                .orElse(ResponseEntity.status(404).body(ApiResponse.error("Product not found")));
    }
}
