package domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class BankTransaction {

    @Id
    private UUID id;

    private UUID pspTransactionId;

    private BigDecimal amount;
    private String currency;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    private String callbackUrl;

    private String successUrl;
    private String failUrl;
    private String errorUrl;


    private LocalDateTime createdAt;
}


