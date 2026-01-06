package com.ftn.SEP.ShopApp.controller;

import domain.OrderEntity;
import dto.CreateOrderRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ftn.SEP.ShopApp.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderEntity> createOrder(
            @RequestBody CreateOrderRequest request
    ) {
        OrderEntity order = orderService.createOrder(request);
        return ResponseEntity.ok(order);
    }
}
