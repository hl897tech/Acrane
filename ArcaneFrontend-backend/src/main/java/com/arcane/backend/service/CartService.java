package com.arcane.backend.service;

import com.arcane.backend.model.CartItem;
import com.arcane.backend.model.Product;
import com.arcane.backend.model.User;
import com.arcane.backend.repo.CartItemRepository;
import com.arcane.backend.repo.ProductRepository;
import com.arcane.backend.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    private final CartItemRepository cartRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;

    public CartService(CartItemRepository cartRepo, UserRepository userRepo, ProductRepository productRepo) {
        this.cartRepo = cartRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
    }

    public List<CartItem> getCartForUser(Long userId) {
        User u = userRepo.findById(userId).orElse(null);
        if (u == null) return new java.util.ArrayList<CartItem>();
        return cartRepo.findByUser(u);
    }

    public boolean addToCart(Long userId, Long productId, int quantity) {
        User u = userRepo.findById(userId).orElse(null);
        if (u == null) return false;
        Optional<Product> pOpt = productRepo.findById(productId);
        if (!pOpt.isPresent()) return false;
        Product p = pOpt.get();
        Optional<CartItem> existing = cartRepo.findByUserAndProduct_Id(u, productId);
        CartItem item;
        if (existing.isPresent()) {
            item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            item = new CartItem();
            item.setUser(u);
            item.setProduct(p);
            item.setQuantity(quantity);
        }
        cartRepo.save(item);
        return true;
    }

    public void removeFromCart(Long userId, Long productId) {
        User u = userRepo.findById(userId).orElse(null);
        if (u == null) return;
        cartRepo.findByUserAndProduct_Id(u, productId).ifPresent(cartRepo::delete);
    }
}
