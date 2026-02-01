package com.ftn.SEP.BankApp.controller;

import domain.BankTransaction;
import domain.BankTransactionStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/bank")
public class BankPaymentController {

    private final Map<String, BankTransaction> transactions = new ConcurrentHashMap<>();

    @PostMapping("/init")
    public ResponseEntity<?> init(@RequestBody BankInitRequest request) {

        String paymentId = UUID.randomUUID().toString();

        BankTransaction tx = new BankTransaction();
        tx.setPaymentId(paymentId);
        tx.setStan(request.getStan());
        tx.setAmount(request.getAmount());
        tx.setCurrency(request.getCurrency());
        tx.setStatus(BankTransactionStatus.INIT);
        tx.setUsed(false);

        transactions.put(paymentId, tx);

        return ResponseEntity.ok(
                Map.of(
                        "paymentUrl", "http://localhost:8082/bank/pay/" + paymentId,
                        "paymentId", paymentId
                )
        );
    }
}
