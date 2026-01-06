package domain;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Data
public class OrderEntity {

    @Id
    @GeneratedValue
    private Long id;

    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Embedded
    private CustomerInfo customer;

    @OneToMany(cascade = CascadeType.ALL)
    private List<OrderItem> items;
}
