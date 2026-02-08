package com.ftn.SEP.BankApp.service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class HmacUtil {

    private static final String HMAC_ALGO = "HmacSHA256";

    public static String sign(String data, String secret) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGO);
            SecretKeySpec key =
                    new SecretKeySpec(
                            secret.getBytes(StandardCharsets.UTF_8),
                            HMAC_ALGO
                    );

            mac.init(key);

            byte[] rawHmac = mac.doFinal(
                    data.getBytes(StandardCharsets.UTF_8)
            );

            return Base64.getEncoder().encodeToString(rawHmac);

        } catch (Exception e) {
            throw new RuntimeException("HMAC failed", e);
        }
    }
}

