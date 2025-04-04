package group12.Backend.controller;

import group12.Backend.dto.ActivityLogDTO;
import group12.Backend.dto.PriceDTO;
import group12.Backend.service.ActivityLogService;
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
    private final ActivityLogService activityLogService;
    
    @Autowired
    public PriceController(PriceService priceService, ActivityLogService activityLogService) {
        this.priceService = priceService;
        this.activityLogService = activityLogService;
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
            @RequestHeader("Authorization") String auth) throws Exception {
        try {
            Claims claims = Authentication.getClaims(auth);
            if (claims == null)
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
            String role = (String) claims.get("meta_data", HashMap.class).get("role");
            if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
                // Get the original price for comparison
                PriceDTO originalPrice = null;
                try {
                    List<PriceDTO> allPrices = priceService.getAllPrices();
                    for (PriceDTO price : allPrices) {
                        if (price.getId().equals(id)) {
                            originalPrice = price;
                            break;
                        }
                    }
                } catch (Exception e) {
                    // Continue even if we can't get the original price
                }
                
                PriceDTO updatedPrice = priceService.updatePriceById(id, priceDTO);
                
                // Log the activity
                ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
                logRequest.setActionType("UPDATE");
                logRequest.setEntityType("PRICE");
                logRequest.setEntityId(id.toString());
                
                StringBuilder description = new StringBuilder("Updated price for class: " + updatedPrice.getClassName());
                if (originalPrice != null) {
                    description.append(" from ")
                              .append(originalPrice.getValue())
                              .append(" to ")
                              .append(updatedPrice.getValue());
                } else {
                    description.append(" to ").append(updatedPrice.getValue());
                }
                
                logRequest.setDescription(description.toString());
                activityLogService.createActivityLog(logRequest, claims);
                
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
            @RequestBody PriceDTO priceDTO, @RequestHeader("Authorization") String auth) throws Exception {
        try {
            Claims claims = Authentication.getClaims(auth);
            if (claims == null)
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
            String role = (String) claims.get("meta_data", HashMap.class).get("role");
            if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
                // Get the original price for comparison
                PriceDTO originalPrice = null;
                try {
                    List<PriceDTO> allPrices = priceService.getAllPrices();
                    for (PriceDTO price : allPrices) {
                        if (price.getClassName().equals(className)) {
                            originalPrice = price;
                            break;
                        }
                    }
                } catch (Exception e) {
                    // Continue even if we can't get the original price
                }
                
                PriceDTO updatedPrice = priceService.updatePriceByClassName(className, priceDTO);
                
                // Log the activity
                ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
                logRequest.setActionType("UPDATE");
                logRequest.setEntityType("PRICE");
                logRequest.setEntityId("class/" + className);
                
                StringBuilder description = new StringBuilder("Updated price for class: " + className);
                if (originalPrice != null) {
                    description.append(" from ")
                              .append(originalPrice.getValue())
                              .append(" to ")
                              .append(updatedPrice.getValue());
                } else {
                    description.append(" to ").append(updatedPrice.getValue());
                }
                
                logRequest.setDescription(description.toString());
                activityLogService.createActivityLog(logRequest, claims);
                
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