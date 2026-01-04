package domain;

import dto.CallbackRequest;

public interface PaymentMethod {
    String getName();
    String getCode();
    boolean supports(PaymentMethodType type);
    PaymentResult process(PaymentRequest request);
    PaymentResult handleCallback(CallbackRequest request);
}