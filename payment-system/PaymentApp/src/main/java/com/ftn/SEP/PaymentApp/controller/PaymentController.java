package com.ftn.SEP.PaymentApp.controller;

import com.ftn.SEP.PaymentApp.service.CallbackService;
import com.ftn.SEP.PaymentApp.service.PaymentMethodRegistry;
import com.ftn.SEP.PaymentApp.service.TransactionService;
import domain.*;
import dto.CallbackRequest;
import dto.PayRequest;
import dto.PayResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentMethodRegistry paymentMethodRegistry;
    private final TransactionService transactionService;
    private final CallbackService callbackService;

    @Autowired
    private final RestTemplate restTemplate;

    @PostMapping("/process")
    public ResponseEntity<PayResponse> pay(@RequestBody PayRequest request) {

        Transaction tx = transactionService.getById(request.getTransactionId());

        if (tx.getStatus() != TransactionStatus.INIT) {
            return ResponseEntity.badRequest().body(
                    new PayResponse(tx.getId(), tx.getStatus(), "Transaction not payable")
            );
        }

        PaymentMethod method = paymentMethodRegistry.get(request.getPaymentMethod());

        if (method == null) {
            return ResponseEntity.badRequest().body(
                    new PayResponse(tx.getId(), TransactionStatus.FAILED, "Unsupported payment method")
            );
        }

        PaymentRequest paymentRequest = new PaymentRequest(
                tx.getAmount(),
                tx.getCurrency(),
                PaymentMethodType.valueOf(request.getPaymentMethod()),
                request.getToken(),
                tx.getId()
        );

        PaymentResult result = method.process(paymentRequest);
        if (result == PaymentResult.SUCCESS){
            tx.setStatus(TransactionStatus.SUCCESS);
            callbackService.notifySuccess(tx);
        }
        else {
            tx.setStatus(TransactionStatus.FAILED);
            callbackService.notifyFail(tx);
        }

        transactionService.update(tx.getId(), tx);

        return ResponseEntity.ok(
                new PayResponse(tx.getId(), tx.getStatus(), "")
        );
    }


    @GetMapping("/status/{id}")
    public ResponseEntity<String> checkStatus(@PathVariable("id") UUID id) {
        Transaction tx = transactionService.getById(id);

        TransactionStatus status = restTemplate.getForObject("http://localhost:8082/api/transactions/status/" + tx.getBankTransactionId(), TransactionStatus.class);

        if (status == TransactionStatus.SUCCESS) {
            tx.setStatus(TransactionStatus.SUCCESS);
            callbackService.notifySuccess(tx);
        } else {
            tx.setStatus(TransactionStatus.FAILED);
            callbackService.notifyFail(tx);
        }
        return ResponseEntity.ok("OK");
    }
}