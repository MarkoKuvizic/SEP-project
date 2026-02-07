package com.ftn.SEP.PaymentApp.service;

import domain.Transaction;
import domain.TransactionStatus;
import dto.CallbackRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CallbackService {

    private final RestTemplate restTemplate;

    public void notifySuccess(Transaction tx) {
        CallbackRequest request = new CallbackRequest(
                tx.getId(),
                String.valueOf(tx.getMerchantOrderId()),
                TransactionStatus.SUCCESS,
                tx.getAmount(),
                tx.getCurrency(),
                "PSP_APP",
                LocalDateTime.now(),
                "AAA"
        );

        restTemplate.postForObject("http://localhost:8081/api/payment/callback/success", request, Void.class);
    }

    public void notifyFail(Transaction tx) {
        CallbackRequest request = new CallbackRequest(
                tx.getId(),
                String.valueOf(tx.getMerchantOrderId()),
                TransactionStatus.FAILED,
                tx.getAmount(),
                tx.getCurrency(),
                "PSP_APP",
                LocalDateTime.now(),
                "AAA"
        );

        restTemplate.postForObject("http://localhost:8081/api/payment/callback/failure", request, Void.class);
    }
}
