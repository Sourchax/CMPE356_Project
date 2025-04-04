package group12.Backend.controller;

import group12.Backend.dto.PriceDTO;
import group12.Backend.service.PriceService;
import jakarta.servlet.http.HttpServletRequest;
import group12.Backend.util.*;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/prices")
@CrossOrigin(origins = "*")
public class PriceController {
    
    private final PriceService priceService;
    
    @Autowired
    public PriceController(PriceService priceService) {
        this.priceService = priceService;
    }
    
    // Get all prices
    @GetMapping
    public ResponseEntity<List<PriceDTO>> getAllPrices() {
        List<PriceDTO> prices = priceService.getAllPrices();
        return new ResponseEntity<>(prices, HttpStatus.OK);
    }
    
    // Update price by ID
    @PutMapping("/{id}")
    public ResponseEntity<PriceDTO> updatePriceById(
            @PathVariable Integer id,
            @RequestBody PriceDTO priceDTO,
            HttpServletRequest request) throws Exception {
        try {
            Claims claims = Authentication.getClaims(request);
            if (claims == null)
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
            String role = (String) claims.get("meta_data", HashMap.class).get("role");
            if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
                PriceDTO updatedPrice = priceService.updatePriceById(id, priceDTO);
                return new ResponseEntity<>(updatedPrice, HttpStatus.OK);
            }
            else{
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
            }
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Update price by class name (title)
    @PutMapping("/class/{className}")
    public ResponseEntity<PriceDTO> updatePriceByClassName(
            @PathVariable String className,
            @RequestBody PriceDTO priceDTO, HttpServletRequest request) throws Exception {
        try {
            Claims claims = Authentication.getClaims(request);
            if (claims == null)
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
            String role = (String) claims.get("meta_data", HashMap.class).get("role");
            if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
                PriceDTO updatedPrice = priceService.updatePriceByClassName(className, priceDTO);
                return new ResponseEntity<>(updatedPrice, HttpStatus.OK);
            }
            else{
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
            }
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}