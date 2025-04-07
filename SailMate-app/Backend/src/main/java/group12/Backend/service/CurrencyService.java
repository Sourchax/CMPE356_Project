package group12.Backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.net.URI;

@Service
public class CurrencyService {

    private final RestTemplate restTemplate = new RestTemplate();

    public BigDecimal convert(BigDecimal amount, String from, String to) {
        URI uri = UriComponentsBuilder
                .fromUriString("https://api.exchangerate.host/convert")
                .queryParam("from", from)
                .queryParam("to", to)
                .queryParam("amount", amount)
                .build()
                .toUri();

        ExchangeRateResponse response = restTemplate.getForObject(uri, ExchangeRateResponse.class);
        return response != null && response.result != null ? response.result : BigDecimal.ZERO;
    }

    static class ExchangeRateResponse {
        public BigDecimal result;
    }
}
