package dto;


import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InitBankResponse {
    private UUID bankPaymentId;
    private String paymentUrl;
}