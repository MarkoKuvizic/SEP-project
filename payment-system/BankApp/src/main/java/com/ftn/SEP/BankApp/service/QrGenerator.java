package com.ftn.SEP.BankApp.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.springframework.stereotype.Service;

@Service
public class QrGenerator {

    public byte[] generate(String data) {
        try {
            int width = 300;
            int height = 300;

            BitMatrix bitMatrix = new MultiFormatWriter()
                    .encode(data, BarcodeFormat.QR_CODE, width, height);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);

            return pngOutputStream.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to generate QR code", e);
        }
    }
}

