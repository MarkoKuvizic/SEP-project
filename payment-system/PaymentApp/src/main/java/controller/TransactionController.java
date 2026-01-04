package controller;


import domain.Transaction;
import domain.TransactionStatus;
import dto.InitTransactionRequest;
import dto.InitTransactionResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final Map<UUID, Transaction> transactions = new ConcurrentHashMap<>();

    @PostMapping("/init")
    public InitTransactionResponse initTransaction(
            @RequestBody InitTransactionRequest request
    ) {
        UUID transactionId = UUID.randomUUID();

        Transaction tx = new Transaction(
                transactionId,
                request.getAmount(),
                request.getCurrency(),
                TransactionStatus.INIT
        );

        transactions.put(transactionId, tx);

        String paymentUrl = "http://localhost:8081/pay/" + transactionId;

        return new InitTransactionResponse(transactionId, paymentUrl);
    }
}
