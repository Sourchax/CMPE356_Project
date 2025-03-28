package group12.Backend.controller;

import group12.Backend.dto.PriceDTO;
import group12.Backend.service.PriceService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            @RequestBody PriceDTO priceDTO) {
        try {
            PriceDTO updatedPrice = priceService.updatePriceById(id, priceDTO);
            return new ResponseEntity<>(updatedPrice, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Update price by class name (title)
    @PutMapping("/class/{className}")
    public ResponseEntity<PriceDTO> updatePriceByClassName(
            @PathVariable String className,
            @RequestBody PriceDTO priceDTO) {
        try {
            PriceDTO updatedPrice = priceService.updatePriceByClassName(className, priceDTO);
            return new ResponseEntity<>(updatedPrice, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}