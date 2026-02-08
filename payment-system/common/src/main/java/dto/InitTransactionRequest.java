package dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class InitTransactionRequest {

    private BigDecimal amount;
    private String currency;
    private Long merchantOrderId;
    private String successUrl;
    private String failUrl;
    private String errorUrl;
    private String merchantId;
}