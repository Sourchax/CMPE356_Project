package group12.Backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import group12.Backend.util.Authentication;
import group12.Backend.util.ClerkUsers;

import java.util.HashMap;
import java.util.Map;

import com.clerk.backend_api.Clerk;
import com.clerk.backend_api.models.operations.UpdateUserRequest;
import com.clerk.backend_api.models.operations.UpdateUserResponse;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Claims;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @GetMapping("/all-users")
    public ResponseEntity<Map<String, Object>> getAllUsers(@RequestHeader("Authorization") String auth
    ) throws Exception {

        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role) || "admin".equalsIgnoreCase(role)) {
            Map<String, Object> users = ClerkUsers.allUsers();
            if (users == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to fetch users"));
            }
            return ResponseEntity.ok(users);
        }
        else{
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authorized");
        }
    }

    @PutMapping("/update-role")
    public ResponseEntity<Map<String, Object>> updateUserRole(
            @RequestParam String userId,
            @RequestParam String newRole,
            @RequestHeader("Authorization") String auth
            ) throws Exception{
        
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role) || "admin".equalsIgnoreCase(role)) {
            ClerkUsers.updateUserRole(userId, newRole.toLowerCase());
            return ResponseEntity.ok(Map.of("success", true));
        }
        else{
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authorized");
        }
    }

    @GetMapping("/users-count")
    public ResponseEntity<Map<String, Object>> getUsersLength(
            @RequestHeader("Authorization") String auth
    ) throws Exception {
        
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
    
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role) || "admin".equalsIgnoreCase(role)) {
            Map<String, Object> users = ClerkUsers.allUsers();
            Map<String, Object> response = new HashMap<>();
            response.put("count", users.size());
            return ResponseEntity.ok(response);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authorized");
        }
    }

    @DeleteMapping("/delete-user/{userId}")
    public ResponseEntity<Map<String, Object>> deleteUser(
            @PathVariable String userId,
            @RequestHeader("Authorization") String auth
    ) throws Exception {
        
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role) || "admin".equalsIgnoreCase(role)) {
            try {
                ClerkUsers.deleteUser(userId);
                return ResponseEntity.ok(Map.of("success", true, "message", "User deleted successfully"));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("success", false, "message", "Failed to delete user: " + e.getMessage()));
            }
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authorized");
        }
    }           
}