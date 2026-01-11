package domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
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


    private String successUrl;
    private String failUrl;
    private String errorUrl;

    private Long merchantOrderId;

}