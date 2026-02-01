package com.ftn.SEP.BankApp.service;

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
                "ShopApp",
                TransactionStatus.SUCCESS,
                tx.getAmount(),
                tx.getCurrency(),
                "PSP_APP",
                LocalDateTime.now(),
                "AAA"
        );

        restTemplate.postForObject(tx.getSuccessUrl(), request, Void.class);
    }

    public void notifyFail(Transaction tx) {
        CallbackRequest request = new CallbackRequest(
                tx.getId(),
                "ShopApp",
                TransactionStatus.FAILED,
                tx.getAmount(),
                tx.getCurrency(),
                "PSP_APP",
                LocalDateTime.now(),
                "AAA"
        );

        restTemplate.postForObject(tx.getFailUrl(), request, Void.class);
    }
}
