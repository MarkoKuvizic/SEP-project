package com.ftn.SEP.BankApp.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class PublicUrlService {

    private final RestTemplate restTemplate = new RestTemplate();

    public String getPublicUrl() {
        String ngrokApi = "http://localhost:4040/api/tunnels";
        Map response = restTemplate.getForObject(ngrokApi, Map.class);

        List<Map> tunnels = (List<Map>) response.get("tunnels");

        return tunnels.stream()
                .map(t -> (String) t.get("public_url"))
                .filter(url -> url.startsWith("https"))
                .findFirst()
                .orElseThrow();
    }
}
