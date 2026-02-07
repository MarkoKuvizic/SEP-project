package com.ftn.SEP.BankApp.controller;

import com.ftn.SEP.BankApp.repository.BankTransactionRepository;
import com.ftn.SEP.BankApp.service.BankPaymentService;
import com.ftn.SEP.BankApp.service.PublicUrlService;
import com.ftn.SEP.BankApp.service.QrGenerator;
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
                "https://localhost:4200/payment/" + tx.getId()
        );
    }


    @GetMapping(value = "/qr/{paymentId}", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] generateQr(@PathVariable UUID paymentId) {

        String publicUrl = publicUrlService.getPublicUrl();
        String qrData = publicUrl + "/bank/pay/" + paymentId;

        return qrGenerator.generate(qrData);
    }


    @PostMapping("/pay/{bankPaymentId}")
    public ResponseEntity<?> pay(
            @PathVariable("bankPaymentId") UUID bankPaymentId,
            @RequestBody CardPaymentRequest cardData
    ) {

        BankTransaction tx = repo.findById(bankPaymentId)
                .orElseThrow();

        if (!service.isValidLuhn(cardData.getCardNumber())) {
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
