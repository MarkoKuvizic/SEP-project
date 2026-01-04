package paymentMethods;

import domain.PaymentMethod;
import domain.PaymentMethodType;
import domain.PaymentRequest;
import domain.PaymentResult;
import dto.CallbackRequest;
import org.springframework.stereotype.Component;

@Component
public class CardPaymentMethod implements PaymentMethod {
    @Override
    public String getName() {
        return "Credit/Debit Card";
    }

    @Override
    public String getCode() {
        return "card";
    }

    @Override
    public boolean supports(PaymentMethodType type) {
        return PaymentMethodType.CARD.equals(type);
    }

    @Override
    public PaymentResult process(PaymentRequest request) {
        // Card payment processing logic
        return null; // Implement
    }

    @Override
    public PaymentResult handleCallback(CallbackRequest request) {
        // Card payment callback logic
        return null; // Implement
    }
}
