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
import java.util.Map;
import java.util.ArrayList;

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
    private EmailUtil emailUtil;
    
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
                StringBuilder descriptionTr = new StringBuilder("Fiyat güncellendi, sınıf: " + updatedPrice.getClassName());
                
                if (originalPrice != null) {
                    description.append(" from ")
                              .append(originalPrice.getValue())
                              .append(" to ")
                              .append(updatedPrice.getValue());
                              
                    descriptionTr.append(", ")
                              .append(originalPrice.getValue())
                              .append("'dan ")
                              .append(updatedPrice.getValue())
                              .append("'e değiştirildi");
                } else {
                    description.append(" to ").append(updatedPrice.getValue());
                    descriptionTr.append(", yeni değer: ").append(updatedPrice.getValue());
                }
                
                logRequest.setDescription(description.toString());
                logRequest.setDescriptionTr(descriptionTr.toString());
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
                StringBuilder descriptionTr = new StringBuilder("Fiyat güncellendi, sınıf: " + className);
                
                if (originalPrice != null) {
                    description.append(" from ")
                              .append(originalPrice.getValue())
                              .append(" to ")
                              .append(updatedPrice.getValue());
                              
                    descriptionTr.append(", ")
                              .append(originalPrice.getValue())
                              .append("'dan ")
                              .append(updatedPrice.getValue())
                              .append("'e değiştirildi");
                } else {
                    description.append(" to ").append(updatedPrice.getValue());
                    descriptionTr.append(", yeni değer: ").append(updatedPrice.getValue());
                }
                
                logRequest.setDescription(description.toString());
                logRequest.setDescriptionTr(descriptionTr.toString());
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
    
    @PostMapping("/notify-price-updates")
    public ResponseEntity<Map<String, Object>> notifyPriceUpdates(
            @RequestBody List<Map<String, Object>> priceChanges,
            @RequestHeader("Authorization") String auth) throws Exception {
        
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)) {
            
            Map<String, Object> result = new HashMap<>();
            
            if (priceChanges == null || priceChanges.isEmpty()) {
                result.put("success", false);
                result.put("message", "No price changes provided");
                return ResponseEntity.badRequest().body(result);
            }
            
            try {
                String subjectEn = "Price Updates";
                String subjectTr = "Fiyat Güncellemeleri";
                
                StringBuilder ticketSectionEn = new StringBuilder();
                StringBuilder ticketSectionTr = new StringBuilder();
                
                StringBuilder discountSectionEn = new StringBuilder();
                StringBuilder discountSectionTr = new StringBuilder();
                
                StringBuilder feeSectionEn = new StringBuilder();
                StringBuilder feeSectionTr = new StringBuilder();
                
                // Categorize price changes
                for (Map<String, Object> change : priceChanges) {
                    String className = (String) change.get("className");
                    Double oldValue = Double.parseDouble(change.get("oldValue").toString());
                    Double newValue = Double.parseDouble(change.get("newValue").toString());
                    
                    String formattedClassName = formatClassName(className);
                    String lowerClassName = className.toLowerCase();
                    
                    if (lowerClassName.contains("student") || lowerClassName.contains("senior")) {
                        // For student and senior discounts
                        // These are already in percentage values (not decimals)
                        int oldPercent = (int)Math.round(oldValue);
                        int newPercent = (int)Math.round(newValue);
                        
                        // English format: "Student: 25% → 15%"
                        discountSectionEn.append(formattedClassName)
                                       .append(": ")
                                       .append(oldPercent)
                                       .append("% → ")
                                       .append(newPercent)
                                       .append("%")
                                       .append("\n");
                                       
                        // Turkish format: "Student: %25 → %15"
                        discountSectionTr.append(formattedClassName)
                                       .append(": %")
                                       .append(oldPercent)
                                       .append(" → %")
                                       .append(newPercent)
                                       .append("\n");
                    } else if (lowerClassName.contains("fee")) {
                        // Handle service fee
                        feeSectionEn.append(formattedClassName)
                                  .append(": ")
                                  .append(String.format("₺%.2f", oldValue))
                                  .append(" → ")
                                  .append(String.format("₺%.2f", newValue))
                                  .append("\n");
                                  
                        feeSectionTr.append(formattedClassName)
                                  .append(": ")
                                  .append(String.format("₺%.2f", oldValue))
                                  .append(" → ")
                                  .append(String.format("₺%.2f", newValue))
                                  .append("\n");
                    } else {
                        // Handle ticket prices
                        ticketSectionEn.append(formattedClassName)
                                     .append(": ")
                                     .append(String.format("₺%.2f", oldValue))
                                     .append(" → ")
                                     .append(String.format("₺%.2f", newValue))
                                     .append("\n");
                                     
                        ticketSectionTr.append(formattedClassName)
                                     .append(": ")
                                     .append(String.format("₺%.2f", oldValue))
                                     .append(" → ")
                                     .append(String.format("₺%.2f", newValue))
                                     .append("\n");
                    }
                }
                
                // Build the complete messages
                StringBuilder messageEn = new StringBuilder("Dear User,\n\n")
                                        .append("We would like to inform you about the following price updates:\n\n");
                                        
                StringBuilder messageTr = new StringBuilder("Değerli Kullanıcımız,\n\n")
                                        .append("Aşağıdaki fiyat güncellemeleri hakkında sizi bilgilendirmek istiyoruz:\n\n");
                
                // Add ticket price section if there are any
                if (ticketSectionEn.length() > 0) {
                    messageEn.append("TICKET PRICES:\n")
                            .append(ticketSectionEn)
                            .append("\n");
                            
                    messageTr.append("BİLET FİYATLARI:\n")
                            .append(ticketSectionTr)
                            .append("\n");
                }
                
                // Add service fee section if there are any
                if (feeSectionEn.length() > 0) {
                    messageEn.append("SERVICE FEES:\n")
                            .append(feeSectionEn)
                            .append("\n");
                            
                    messageTr.append("HİZMET ÜCRETLERİ:\n")
                            .append(feeSectionTr)
                            .append("\n");
                }
                
                // Add discount section if there are any
                if (discountSectionEn.length() > 0) {
                    messageEn.append("DISCOUNT RATES:\n")
                            .append(discountSectionEn)
                            .append("\n");
                            
                    messageTr.append("İNDİRİM ORANLARI:\n")
                            .append(discountSectionTr)
                            .append("\n");
                }
                
                // Add closing message
                messageEn.append("These changes will take effect immediately.\n\n")
                        .append("Best regards,\n")
                        .append("The SailMate Team");
                        
                messageTr.append("Bu değişiklikler hemen geçerli olacaktır.\n\n")
                        .append("Saygılarımızla,\n")
                        .append("SailMate Ekibi");
                
                // Send the notification
                emailUtil.notifyAllUsers(subjectEn, subjectTr, messageEn.toString(), messageTr.toString());
                
                // Return success response
                result.put("success", true);
                result.put("message", "Notification sent successfully");
                
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                result.put("success", false);
                result.put("message", "Error sending price update notification: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
            }
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
    }
    /**
     * Format a class name for display
     */
    private String formatClassName(String className) {
        String[] words = className.split("_");
        StringBuilder result = new StringBuilder();
        
        for (String word : words) {
            if (word.length() > 0) {
                result.append(Character.toUpperCase(word.charAt(0)))
                      .append(word.substring(1))
                      .append(" ");
            }
        }
        
        return result.toString().trim();
    }
}