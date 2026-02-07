package com.ftn.SEP.PaymentApp.paymentMethods;

import domain.*;
import dto.CallbackRequest;
import dto.CardPaymentRequest;
import dto.InitBankRequest;
import dto.InitBankResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Component
public class CardPaymentMethod implements PaymentMethod {
    @Override
    public String getName() {
        return "Credit/Debit Card";
    }

    @Override
    public String getCode() {
        return "CARD";
    }

    @Override
    public boolean supports(PaymentMethodType type) {
        return PaymentMethodType.CARD.equals(type);
    }

    @Override
    public PaymentResult process(PaymentRequest request) {
        return PaymentResult.SUCCESS;
    }


    @Override
    public PaymentResult handleCallback(CallbackRequest request) {
        if (request.getStatus() == TransactionStatus.SUCCESS) {
            return PaymentResult.SUCCESS;
        }

        return PaymentResult.FAILURE;
    }
}
