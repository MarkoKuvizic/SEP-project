package service;

import domain.PaymentMethod;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class PaymentMethodRegistry {
    private final Map<String, PaymentMethod> paymentMethods = new ConcurrentHashMap<>();

    public void register(PaymentMethod paymentMethod) {
        paymentMethods.put(paymentMethod.getCode(), paymentMethod);
    }

    public PaymentMethod get(String code) {
        return paymentMethods.get(code);
    }

    public Collection<PaymentMethod> getAll() {
        return paymentMethods.values();
    }
}