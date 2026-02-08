package com.ftn.SEP.BankApp.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.springframework.stereotype.Service;

@Service
public class QrGenerator {

    public byte[] generateIpsQr(String ipsPayload) {
        try {
            int size = 300;

            BitMatrix bitMatrix = new MultiFormatWriter()
                    .encode(ipsPayload, BarcodeFormat.QR_CODE, size, size);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to generate IPS QR code", e);
        }
    }
}


