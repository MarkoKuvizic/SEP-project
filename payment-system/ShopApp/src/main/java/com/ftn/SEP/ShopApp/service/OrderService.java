package com.ftn.SEP.ShopApp.service;

import domain.*;
import dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.ftn.SEP.ShopApp.repository.OrderRepository;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    CarService carService;

    @Autowired
    RestTemplate restTemplate;

    public void updateOrderStatus(String merchantOrderId, OrderStatus orderStatus) {
//        OrderEntity order = orderRepository.findById(1L);
    }
    public OrderEntity createOrder(CreateOrderRequest request) {

        List<OrderItem> items = request.getItems().stream()
                .map(this::mapToOrderItem)
                .toList();

        BigDecimal total = items.stream()
                .map(OrderItem::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        OrderEntity order = new OrderEntity();
        order.setItems(items);
        order.setCustomer(mapCustomer(request.getCustomer()));
        order.setTotalAmount(total);
        order.setStatus(OrderStatus.CREATED);


        return orderRepository.save(order);
    }

    private CustomerInfo mapCustomer(CustomerInfoRequest customer) {
        return new CustomerInfo(customer.getFirstName(), customer.getLastName(), customer.getEmail(), customer.getPhone());
    }

    private OrderItem mapToOrderItem(OrderItemRequest req) {

        OrderItem item = new OrderItem();
        item.setPrice(calculatePrice(req));
        item.setCar(req.getCar());
        carService.saveIfNotExists(req.getCar());
        return item;
    }

    private BigDecimal calculatePrice(OrderItemRequest req) {
        long days = ChronoUnit.DAYS.between(
                req.getRentalFrom(),
                req.getRentalTo()
        );

        if (days <= 0) {
            throw new IllegalArgumentException("Rental period must be at least 1 day");
        }

        return BigDecimal.valueOf(days)
                .multiply(req.getCar().getDailyRate());
    }

}
