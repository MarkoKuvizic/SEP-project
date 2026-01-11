package com.ftn.SEP.PaymentApp.paymentMethods;

import domain.PaymentMethod;
import domain.PaymentMethodType;
import domain.PaymentRequest;
import domain.PaymentResult;
import dto.CallbackRequest;
import org.springframework.stereotype.Component;

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
        if (request.getToken() == null || request.getToken().isBlank()) {
            return PaymentResult.FAILURE;
        }

        String fakeStripeChargeId = "ch_" + UUID.randomUUID();

        return PaymentResult.SUCCESS;
    }

    @Override
    public PaymentResult handleCallback(CallbackRequest request) {

        return PaymentResult.SUCCESS;
    }
}
