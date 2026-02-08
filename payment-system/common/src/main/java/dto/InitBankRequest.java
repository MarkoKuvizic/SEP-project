package dto;


import lombok.*;

import java.math.BigDecimal;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InitBankRequest {

    private UUID pspTransactionId;

    private BigDecimal amount;
    private String currency;

    private LocalDateTime timeCreated;
    private String callbackUrl;

    private String successUrl;
    private String failUrl;
    private String errorUrl;


    private String merchantId;
}
