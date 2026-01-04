package dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InitTransactionRequest {

    private BigDecimal amount;
    private String currency;
    private String merchantOrderId;
    private String successUrl;
    private String failUrl;
    private String errorUrl;
}