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
    
    // Update user language preference
    @PostMapping("")
    public ResponseEntity<Map<String, Object>> updateUserPreferences(
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String auth) throws Exception {
        
        // Authenticate user
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        String userId = claims.getSubject();
        String emailSmsLanguage = request.get("emailSmsLanguage");
        
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
        
        try {
            // Update user's language preference in Clerk
            ClerkUsers.updateUserLanguage(userId, emailSmsLanguage);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User preferences updated successfully");
            response.put("language", emailSmsLanguage);
            
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
            
            Map<String, Object> preferences = new HashMap<>();
            preferences.put("emailSmsLanguage", metadata.getOrDefault("lan", "en"));
            
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
