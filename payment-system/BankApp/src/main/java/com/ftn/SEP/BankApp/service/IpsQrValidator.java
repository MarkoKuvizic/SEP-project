package com.ftn.SEP.BankApp.service;

import org.springframework.stereotype.Component;

@Component
public class IpsQrValidator {

    public void validate(String payload) {
        if (!payload.contains("K:PR")) throw new IllegalArgumentException("Invalid type");
        if (!payload.contains("V:01")) throw new IllegalArgumentException("Invalid version");
        if (!payload.contains("C:USD")) throw new IllegalArgumentException("Invalid currency");
        if (!payload.contains("R:")) throw new IllegalArgumentException("Missing merchant account");
        if (!payload.contains("N:")) throw new IllegalArgumentException("Missing merchant name");
    }
}

