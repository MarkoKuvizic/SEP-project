package com.ftn.SEP.ShopApp.service;

import domain.OrderEntity;
import dto.InitTransactionRequest;
import dto.InitTransactionResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;

@Service
@AllArgsConstructor
public class PaymentIntegrationService {
    private final RestTemplate restTemplate;
    private final String pspBaseUrl = "http://localhost:8080/api/transactions";
    private final String callbackUrl = "http://localhost:8081/api/payment/callback";

    public InitTransactionResponse initPayment(BigDecimal amount, String currency, Long merchantOrderId,
            String successUrl, String failureUrl, String errorUrl) {
        InitTransactionRequest request = new InitTransactionRequest(
                amount, currency, merchantOrderId, successUrl, failureUrl, errorUrl
        );

        return restTemplate.postForObject(pspBaseUrl + "/init",
                request,
                InitTransactionResponse.class);
    }

    public InitTransactionResponse initPaymentFromOrder(OrderEntity order){
        return initPayment(order.getTotalAmount(), "USD", order.getId(),
                callbackUrl + "/success", callbackUrl + "/failure", callbackUrl + "/error");
    }
}