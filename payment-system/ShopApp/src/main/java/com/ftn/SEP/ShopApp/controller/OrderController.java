package com.ftn.SEP.ShopApp.controller;

import com.ftn.SEP.ShopApp.service.PaymentIntegrationService;
import domain.OrderEntity;
import dto.CreateOrderRequest;
import dto.CreateOrderResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ftn.SEP.ShopApp.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    @Autowired
    private final OrderService orderService;
    @Autowired
    private final PaymentIntegrationService paymentIntegrationService;

    @PostMapping
    public ResponseEntity<CreateOrderResponse> createOrder(
            @RequestBody CreateOrderRequest request
    ) {
        OrderEntity order = orderService.createOrder(request);
        String paymentUrl = paymentIntegrationService.initPaymentFromOrder(order).getPaymentUrl();

        return ResponseEntity.ok(
                new CreateOrderResponse(order.getId(), paymentUrl)
        );
    }
}
