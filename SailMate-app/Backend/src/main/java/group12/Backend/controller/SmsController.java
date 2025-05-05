package group12.Backend.controller;

import group12.Backend.util.Authentication;
import group12.Backend.util.ClerkUsers;
import io.jsonwebtoken.Claims;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/sms")
@CrossOrigin(origins = "*")
public class SmsController {
    
    // Send SMS
    @PostMapping("/send")
    public ResponseEntity<String> sendSms(
            @RequestBody SmsRequest request,
            @RequestHeader("Authorization") String auth) throws Exception {
        try {
            Claims claims = Authentication.getClaims(auth);
            if (claims == null)
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");

            HashMap<String, Object> user = ClerkUsers.getUser(claims.getSubject());
            if(user == null || user.isEmpty())
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
            
            // Check if user has a phone number (either key doesn't exist or value is null)
            if(!user.containsKey("phone") || user.get("phone") == null)
                return new ResponseEntity<>("No phone number found for user", HttpStatus.BAD_REQUEST);
            
            try {    
                // Use the controller's sendMessage method
                sendMessage(user.get("phone").toString(), request.getMessage());
                return new ResponseEntity<>("SMS sent successfully", HttpStatus.OK);
            } catch (RuntimeException e) {
                // Catch and handle specific exceptions from the sendMessage method
                return new ResponseEntity<>("Failed to send SMS: " + e.getMessage(), HttpStatus.SERVICE_UNAVAILABLE);
            }
            
        } catch (ResponseStatusException e) {
            throw e; // Re-throw authorization exceptions
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to send SMS: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Inner class for request body
    public static class SmsRequest {
        private String phoneNumber;
        private String message;
        
        // Getters and Setters
        public String getPhoneNumber() {
            return phoneNumber;
        }
        
        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
    
    // Your sendMessage method
    private static void sendMessage(String phoneNumber, String message) {
        // Clean phone number: remove all characters except digits and '+'
        String cleanedNumber = phoneNumber.replaceAll("[^0-9+]", "");
        // Construct JSON payload
        String jsonPayload = String.format(
            "{\"phoneNumber\": \"%s\", \"message\": \"%s\"}",
            cleanedNumber,
            message
        );

        System.out.println(jsonPayload);
        try {
            // Set up HTTP connection
            URL url = new URL("http://171.22.173.112:5000/sms");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);
            // Write JSON payload
            try (OutputStream os = conn.getOutputStream()) {
                os.write(jsonPayload.getBytes(StandardCharsets.UTF_8));
            }
            // Handle response (optional)
            int responseCode = conn.getResponseCode();
            System.out.println("Sent message. Response code: " + responseCode);
            
            // Check if the response code indicates an error
            if (responseCode < 200 || responseCode >= 300) {
                throw new RuntimeException("SMS service returned error code: " + responseCode);
            }
        } catch (Exception e) {
            System.err.println("Error sending message: " + e.getMessage());
            throw new RuntimeException("Failed to send SMS: " + e.getMessage());
        }
    }
}