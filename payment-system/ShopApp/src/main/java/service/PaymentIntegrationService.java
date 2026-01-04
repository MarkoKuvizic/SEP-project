package service;

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
    private final String pspBaseUrl = "http://localhost:8081/api/transactions";

    public InitTransactionResponse initPayment(BigDecimal amount, String currency, String merchantOrderId,
            String successUrl, String failureUrl, String errorUrl) {
        InitTransactionRequest request = new InitTransactionRequest(
                amount, currency, merchantOrderId, successUrl, failureUrl, errorUrl
        );

        return restTemplate.postForObject(pspBaseUrl + "/init",
                request,
                InitTransactionResponse.class);
    }
}