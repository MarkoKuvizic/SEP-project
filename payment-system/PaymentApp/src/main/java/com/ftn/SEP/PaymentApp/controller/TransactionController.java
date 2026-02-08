package com.ftn.SEP.PaymentApp.controller;


import com.ftn.SEP.PaymentApp.service.TransactionService;
import domain.PaymentRequest;
import domain.Transaction;
import domain.TransactionStatus;
import dto.InitBankRequest;
import dto.InitBankResponse;
import dto.InitTransactionRequest;
import dto.InitTransactionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Value("${stripe.public-key}")
    private String stripePublicKey;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    RestTemplate restTemplate;

    String bankBaseUrl = "http://localhost:8082/api/transactions";

    @PostMapping("/init")
    public InitTransactionResponse initTransaction(
            @RequestBody InitTransactionRequest request
    ) {

        Transaction tx = new Transaction(
                null,
                request.getAmount(),
                request.getCurrency(),
                TransactionStatus.INIT,
                request.getMerchantOrderId(),
                null
        );

        transactionService.create(tx);
        System.out.println(tx.getId());
        InitBankRequest bankRequest = new InitBankRequest(
                tx.getId(),
                request.getAmount(),
                request.getCurrency(),
                LocalDateTime.now(),
                "http://localhost:8080/api/bank/callback",
                request.getSuccessUrl(),
                request.getFailUrl(),
                request.getErrorUrl()
        );

        InitBankResponse bankResponse =
                restTemplate.postForObject(
                        bankBaseUrl + "/init",
                        bankRequest,
                        InitBankResponse.class
                );

        tx.setBankTransactionId(bankResponse.getBankPaymentId());
        transactionService.update(tx.getId(), tx);

        return new InitTransactionResponse(
                tx.getId(),
                bankResponse.getPaymentUrl(), ""
        );
    }



}
