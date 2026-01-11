package dto;

import domain.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayResponse {
    private UUID transactionId;
    private TransactionStatus status;
    private String message;
}
