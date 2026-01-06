package com.ftn.SEP.ShopApp.service;

import domain.*;
import dto.CreateOrderRequest;
import dto.CustomerInfoRequest;
import dto.OrderItemRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ftn.SEP.ShopApp.repository.OrderRepository;

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
                .multiply(BigDecimal.valueOf(100));
    }
}
