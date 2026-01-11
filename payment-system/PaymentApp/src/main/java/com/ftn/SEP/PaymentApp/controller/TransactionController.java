package com.ftn.SEP.PaymentApp.controller;


import com.ftn.SEP.PaymentApp.service.TransactionService;
import domain.PaymentRequest;
import domain.Transaction;
import domain.TransactionStatus;
import dto.InitTransactionRequest;
import dto.InitTransactionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final Map<UUID, Transaction> transactions = new ConcurrentHashMap<>();
    @Value("${stripe.public-key}")
    private String stripePublicKey;

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/init")
    public InitTransactionResponse initTransaction(
            @RequestBody InitTransactionRequest request
    ) {

        Transaction tx = new Transaction(
                null,
                request.getAmount(),
                request.getCurrency(),
                TransactionStatus.INIT,
                request.getSuccessUrl(),
                request.getFailUrl(),
                request.getErrorUrl(),
                request.getMerchantOrderId()
        );

        transactionService.create(tx);

        UUID transactionId = tx.getId();

        String paymentUrl = "https://localhost:4200/payment/" + transactionId;

        return new InitTransactionResponse(transactionId, paymentUrl, stripePublicKey);
    }
    @GetMapping("/{id}")
    public ResponseEntity<BigDecimal> getTransactionAmount(
            @PathVariable("id") String id
    ) {

        Transaction tx = transactionService.getById(UUID.fromString(id));
        return new ResponseEntity<>(tx.getAmount(), HttpStatus.OK);
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<TransactionStatus> getTransactionStatus(
            @PathVariable("id") String id
    ) {
        Transaction tx = transactionService.getById(UUID.fromString(id));
        return new ResponseEntity<>(tx.getStatus(), HttpStatus.OK);
    }
    @GetMapping("/publicKey/{id}")
    public ResponseEntity<String> getPublicKey(@PathVariable("id") UUID id) {
        return new ResponseEntity<>(this.stripePublicKey, HttpStatus.OK);
    }
}
