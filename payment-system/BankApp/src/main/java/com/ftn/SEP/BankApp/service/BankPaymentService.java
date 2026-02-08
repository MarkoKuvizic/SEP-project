package com.ftn.SEP.BankApp.service;

import com.ftn.SEP.BankApp.repository.BankTransactionRepository;
import domain.BankTransaction;
import domain.Transaction;
import domain.TransactionStatus;
import dto.CallbackRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class BankPaymentService {

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    BankTransactionRepository repo;

    public boolean isValidLuhn(String pan) {
        int sum = 0;
        boolean alternate = false;

        for (int i = pan.length() - 1; i >= 0; i--) {
            int n = Character.getNumericValue(pan.charAt(i));
            if (alternate) {
                n *= 2;
                if (n > 9) n -= 9;
            }
            sum += n;
            alternate = !alternate;
        }
        return sum % 10 == 0;
    }
    public void notifyPsp(BankTransaction tx) {

        CallbackRequest callback = new CallbackRequest(
                tx.getPspTransactionId(),
                null,
                tx.getStatus(),
                tx.getAmount(),
                tx.getCurrency(),
                tx.getId().toString(),
                LocalDateTime.now(),
                "FAKE SIGNATURE"
        );

        restTemplate.postForEntity(
                tx.getCallbackUrl(),
                callback,
                Void.class
        );
    }
    public boolean isValidCvv(String cvv) {
        if (cvv == null) return false;
        if (!cvv.matches("\\d{3,4}")) return false;
        return true;
    }

    public boolean isValidExpiry(String expiry) {
        if (expiry == null) return false;

        try {
            String[] parts = expiry.split("/");
            if (parts.length != 2) return false;

            int month = Integer.parseInt(parts[0]);
            int year = Integer.parseInt(parts[1]);

            if (month < 1 || month > 12) return false;

            if (year < 100) {
                year += 2000;
            }

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime expiryDate = LocalDateTime.of(year, month, 1, 0, 0)
                    .plusMonths(1)
                    .minusSeconds(1);

            return expiryDate.isAfter(now);
        } catch (Exception e) {
            return false;
        }
    }


    public BankTransaction getById(UUID uuid) {
        return repo.findById(uuid).get();
    }
}
