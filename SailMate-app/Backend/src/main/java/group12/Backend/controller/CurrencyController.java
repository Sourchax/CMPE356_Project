package group12.Backend.controller;

import group12.Backend.service.CurrencyService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/currency")
@CrossOrigin(origins = "*")
public class CurrencyController {

    private final CurrencyService currencyService;

    public CurrencyController(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }

    @GetMapping("/convert")
    public BigDecimal convert(
            @RequestParam BigDecimal amount,
            @RequestParam String from,
            @RequestParam String to
    ) {
        return currencyService.convert(amount, from.toUpperCase(), to.toUpperCase());
    }
}
