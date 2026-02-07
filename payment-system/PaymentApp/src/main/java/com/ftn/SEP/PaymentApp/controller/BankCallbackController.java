package com.ftn.SEP.PaymentApp.controller;

import com.ftn.SEP.PaymentApp.service.CallbackService;
import com.ftn.SEP.PaymentApp.service.TransactionService;
import domain.Transaction;
import domain.TransactionStatus;
import dto.CallbackRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bank/callback")
@RequiredArgsConstructor
public class BankCallbackController {

    private final TransactionService transactionService;
    private final CallbackService callbackService;

    @PostMapping
    public ResponseEntity<Void> handleBankCallback(
            @RequestBody CallbackRequest request
    ) {
        Transaction tx = transactionService.getById(request.getTransactionId());

        if (tx == null) {
            return ResponseEntity.badRequest().build();
        }

        tx.setStatus(request.getStatus());
        transactionService.update(tx.getId(), tx);

        if (request.getStatus() == TransactionStatus.SUCCESS) {
            callbackService.notifySuccess(tx);
        } else {
            callbackService.notifyFail(tx);
        }

        return ResponseEntity.ok().build();
    }
}

