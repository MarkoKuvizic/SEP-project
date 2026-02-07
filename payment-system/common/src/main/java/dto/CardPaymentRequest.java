package dto;


import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CardPaymentRequest {
    private BigDecimal amount;
    private String currency;
    private Long merchantOrderId;
    private String cardNumber;
    private String expiry;
    private String cvc;
}
