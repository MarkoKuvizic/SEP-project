package dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayRequest {
    private UUID transactionId;
    private String paymentMethod;
    private String token;
    private String cardholderName;
}