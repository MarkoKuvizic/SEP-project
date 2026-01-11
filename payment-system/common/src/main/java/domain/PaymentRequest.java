package domain;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequest {
    private BigDecimal amount;
    private String currency;
    private PaymentMethodType paymentMethodType;
    private String token;
    private UUID transactionId;
}