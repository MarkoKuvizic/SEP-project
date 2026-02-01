package com.ftn.SEP.BankApp.service;

import domain.PaymentMethod;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class PaymentMethodRegistry {

    private final Map<String, PaymentMethod> paymentMethods = new ConcurrentHashMap<>();

    public PaymentMethodRegistry(List<PaymentMethod> methods) {
        for (PaymentMethod method : methods) {
            paymentMethods.put(method.getCode(), method);
        }
    }

    public PaymentMethod get(String code) {
        return paymentMethods.get(code);
    }

    public Collection<PaymentMethod> getAll() {
        return paymentMethods.values();
    }
}
