package com.ftn.SEP.BankApp.service;


import lombok.Data;

import java.math.BigDecimal;

@Data
public class QrPaymentRequest {
    BigDecimal amount;
    String currency;
    String receiverAccount;
}
