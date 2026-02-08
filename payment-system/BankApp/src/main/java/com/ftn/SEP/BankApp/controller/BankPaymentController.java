package com.ftn.SEP.BankApp.controller;

import com.ftn.SEP.BankApp.repository.BankTransactionRepository;
import com.ftn.SEP.BankApp.service.*;
import domain.BankTransaction;
import domain.Transaction;
import domain.TransactionStatus;
import dto.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
public class BankPaymentController {
    @Autowired
    BankTransactionRepository repo;

    @Autowired
    BankPaymentService service;

    @Autowired
    PublicUrlService publicUrlService;

    @Autowired
    QrGenerator qrGenerator;

    @Autowired
    IpsQrPayloadBuilder builder;

    @PostMapping("/init")
    public InitBankResponse init(@RequestBody InitBankRequest req) {

        BankTransaction tx = new BankTransaction();
        tx.setId(UUID.randomUUID());
        tx.setPspTransactionId(req.getPspTransactionId());
        tx.setAmount(req.getAmount());
        tx.setCurrency(req.getCurrency());
        tx.setStatus(TransactionStatus.INIT);
        tx.setCallbackUrl(req.getCallbackUrl());
        tx.setCreatedAt(LocalDateTime.now());
        tx.setSuccessUrl(req.getSuccessUrl());
        tx.setFailUrl(req.getFailUrl());
        tx.setErrorUrl(req.getErrorUrl());

        repo.save(tx);

        return new InitBankResponse(
                tx.getId(),
                "https://localhost:4201/payment-method/" + tx.getId()
        );
    }


    @GetMapping(value = "/qr/{paymentId}", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] generateQr(@PathVariable("paymentId") UUID paymentId) {

        String publicUrl = publicUrlService.getPublicUrl();
        BankTransaction tx = repo.findById(paymentId).get();
        String qrData = builder.build(String.valueOf(tx.getId()), "shopApp", tx.getAmount(), "purpose");

        return qrGenerator.generateIpsQr(qrData);
    }


    @PostMapping("/pay/{bankPaymentId}")
    public ResponseEntity<?> pay(
            @PathVariable("bankPaymentId") UUID bankPaymentId,
            @RequestBody CardPaymentRequest cardData
    ) {

        BankTransaction tx = repo.findById(bankPaymentId)
                .orElseThrow();

        if (!service.isValidLuhn(cardData.getCardNumber()) || !service.isValidCvv(cardData.getCvc()) || !service.isValidExpiry(cardData.getExpiry())) {
            tx.setStatus(TransactionStatus.FAILED);
            repo.save(tx);
            service.notifyPsp(tx);
            return ResponseEntity.ok(new PayResponse(tx.getId(), tx.getStatus(), tx.getFailUrl()));
        }

        tx.setStatus(TransactionStatus.SUCCESS);
        repo.save(tx);

        service.notifyPsp(tx);

        PayResponse response = new PayResponse(tx.getId(),
                tx.getStatus(), tx.getSuccessUrl());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/pay/qr")
    public ResponseEntity<PayResponse> payQr(@RequestBody QrPaymentRequest request) {

        BankTransaction tx = repo.findById(UUID.fromString(request.getReceiverAccount()))
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (tx.getStatus() != TransactionStatus.INIT) {
            throw new IllegalStateException("Transaction already processed");
        }

        if (tx.getAmount().compareTo(request.getAmount()) != 0) {
            throw new IllegalArgumentException("Amount mismatch");
        }

        if (!tx.getCurrency().equals(request.getCurrency())) {
            throw new IllegalArgumentException("Currency mismatch");
        }

        tx.setStatus(TransactionStatus.SUCCESS);

        repo.save(tx);

        service.notifyPsp(tx);

        PayResponse response = new PayResponse(
                tx.getId(),
                tx.getStatus(),
                tx.getSuccessUrl()
        );

        return ResponseEntity.ok(response);
    }


    @GetMapping("/{id}")
    public ResponseEntity<BigDecimal> getTransactionAmount(
            @PathVariable("id") String id
    ) {

        BankTransaction tx = service.getById(UUID.fromString(id));
        return new ResponseEntity<>(tx.getAmount(), HttpStatus.OK);
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<TransactionStatus> getTransactionStatus(
            @PathVariable("id") String id
    ) {
        BankTransaction tx = service.getById(UUID.fromString(id));
        return new ResponseEntity<>(tx.getStatus(), HttpStatus.OK);
    }
    @GetMapping("/publicKey/{id}")
    public ResponseEntity<String> getPublicKey(@PathVariable("id") UUID id) {
        return new ResponseEntity<>("AAA", HttpStatus.OK);
    }

    private String sign(BankTransaction tx) {
        String data = tx.getId() + tx.getAmount().toString();
        return DigestUtils.sha256Hex(data + "BANK_SECRET");
    }

}
