package com.ftn.SEP.BankApp.service;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.text.DecimalFormat;

@Component
public class IpsQrPayloadBuilder {

    public String build(
            String merchantAccount,
            String merchantName,
            BigDecimal amount,
            String purpose
    ) {
        DecimalFormat df = new DecimalFormat("0.00");

        return String.join("|",
                "K:PR",
                "V:01",
                "C:USD",
                "R:" + merchantAccount,
                "N:" + merchantName,
                "I:" + df.format(amount),
                "S:" + purpose
        );
    }
}
