package group12.Backend.controller;

import group12.Backend.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import io.jsonwebtoken.Claims;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users/preferences")
@CrossOrigin(origins = "*")
public class UserPreferencesController {
    
    // Update user preferences
    @PostMapping("")
    public ResponseEntity<Map<String, Object>> updateUserPreferences(
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String auth) throws Exception {
        
        // Authenticate user
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        String userId = claims.getSubject();
        
        // Get language preference from request
        String emailSmsLanguage = (String) request.get("emailSmsLanguage");
        
        if (emailSmsLanguage == null || emailSmsLanguage.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Language preference is required");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        // Only allow valid language codes
        if (!emailSmsLanguage.equals("en") && !emailSmsLanguage.equals("tr")) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid language code. Supported languages are 'en' and 'tr'");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        // Get newsletter subscription preference from request (default to false if not provided)
        Boolean newsSubscription = request.get("newsSubscription") instanceof Boolean ?
                (Boolean) request.get("newsSubscription") : false;
        
        try {
            // Create a map for metadata updates
            Map<String, Object> metadataUpdates = new HashMap<>();
            metadataUpdates.put("lan", emailSmsLanguage);
            metadataUpdates.put("news", newsSubscription);
            
            // Update user's metadata in Clerk with both preferences
            ClerkUsers.updateUserMetadata(userId, metadataUpdates);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User preferences updated successfully");
            response.put("preferences", Map.of(
                "language", emailSmsLanguage,
                "newsSubscription", newsSubscription
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error updating user preferences: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // Get user preferences
    @GetMapping("")
    public ResponseEntity<Map<String, Object>> getUserPreferences(
            @RequestHeader("Authorization") String auth) throws Exception {
        
        // Authenticate user
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        String userId = claims.getSubject();
        
        try {
            // Get user from Clerk
            Map<String, Object> userData = ClerkUsers.getUser(userId);
            
            // Try to get metadata from claims
            Map<String, Object> metadata = new HashMap<>();
            if (claims.get("meta_data") instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> claimsMetadata = (Map<String, Object>) claims.get("meta_data");
                metadata = claimsMetadata;
            }
            
            // Get language preference (default to "en")
            String language = (String) metadata.getOrDefault("lan", "en");
            
            // Get newsletter subscription (default to false)
            Boolean newsSubscription = metadata.get("news") instanceof Boolean ? 
                    (Boolean) metadata.get("news") : false;
            
            Map<String, Object> preferences = new HashMap<>();
            preferences.put("emailSmsLanguage", language);
            preferences.put("newsSubscription", newsSubscription);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("preferences", preferences);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving user preferences: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}