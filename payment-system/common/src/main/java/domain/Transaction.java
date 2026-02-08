package domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue
    private UUID id;
    private BigDecimal amount;
    private String currency;
    private TransactionStatus status;


    @Column(unique = true, nullable = false)
    private Long merchantOrderId;
    private UUID bankTransactionId;

}