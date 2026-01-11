package dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import domain.TransactionStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CallbackRequest {
    private UUID transactionId;
    private String merchantOrderId;
    private TransactionStatus status;
    private BigDecimal amount;
    private String currency;
    private String providerReference;
    private LocalDateTime timestamp;
    private String signature;
}