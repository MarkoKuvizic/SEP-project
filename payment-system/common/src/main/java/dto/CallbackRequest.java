package dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import domain.TransactionStatus;
@Data
public class CallbackRequest {
    private UUID transactionId;          // The transaction ID from the PSP
    private String merchantOrderId;      // The original order ID from the merchant
    private TransactionStatus status;    // Status of the transaction (SUCCESS, FAILED, etc.)
    private BigDecimal amount;           // Amount of the transaction
    private String currency;             // Currency
    private String providerReference;    // Reference from the payment provider (e.g., Stripe charge ID)
    private LocalDateTime timestamp;     // When the callback was generated
    private String signature;            // Optional: for security, to verify the callback is from the PSP
}