package group12.Backend.controller;

import group12.Backend.dto.ActivityLogDTO;
import group12.Backend.service.ActivityLogService;
import group12.Backend.util.Authentication;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/activity-logs")
@CrossOrigin(origins = "*")
public class ActivityLogController {
    
    private final ActivityLogService activityLogService;
    
    @Autowired
    public ActivityLogController(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }
    
    // Get all activity logs (admin only)
    @GetMapping
    public ResponseEntity<List<ActivityLogDTO>> getAllActivityLogs(HttpServletRequest request) throws Exception {
        // Authenticate user
        Claims claims = Authentication.getClaims(request);
        if (claims == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        
        // Check if user is admin or super
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if (!"admin".equalsIgnoreCase(role) && !"super".equalsIgnoreCase(role) && !"manager".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
        
        return ResponseEntity.ok(activityLogService.getAllActivityLogs());
    }
    
    // Get activity log by ID
    @GetMapping("/{id}")
    public ResponseEntity<ActivityLogDTO> getActivityLogById(
            @PathVariable Integer id,
            HttpServletRequest request) throws Exception {
        
        // Authenticate user
        Claims claims = Authentication.getClaims(request);
        if (claims == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        
        // Check if user is admin or super
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if (!"admin".equalsIgnoreCase(role) && !"super".equalsIgnoreCase(role) && !"manager".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
        
        Optional<ActivityLogDTO> activityLog = activityLogService.getActivityLogById(id);
        return activityLog.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Get activity logs by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ActivityLogDTO>> getActivityLogsByUserId(
            @PathVariable String userId,
            HttpServletRequest request) throws Exception {
        
        // Authenticate user
        Claims claims = Authentication.getClaims(request);
        if (claims == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        
        // Check if user is accessing their own logs or is admin/super
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        String requestingUserId = claims.getSubject();
        
        if (!requestingUserId.equals(userId) && 
            !"admin".equalsIgnoreCase(role) && 
            !"super".equalsIgnoreCase(role) &&
            !"manager".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
        
        return ResponseEntity.ok(activityLogService.getActivityLogsByUserId(userId));
    }
    
    // Get activity logs by entity
    @GetMapping("/entity")
    public ResponseEntity<List<ActivityLogDTO>> getActivityLogsByEntity(
            @RequestParam String type,
            @RequestParam String id,
            HttpServletRequest request) throws Exception {
        
        // Authenticate user
        Claims claims = Authentication.getClaims(request);
        if (claims == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        
        // Check if user is admin or super
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if (!"admin".equalsIgnoreCase(role) && !"super".equalsIgnoreCase(role) && !"manager".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
        
        return ResponseEntity.ok(activityLogService.getActivityLogsByEntity(type, id));
    }
    
    // Get activity logs by action type
    @GetMapping("/action/{actionType}")
    public ResponseEntity<List<ActivityLogDTO>> getActivityLogsByActionType(
            @PathVariable String actionType,
            HttpServletRequest request) throws Exception {
        
        // Authenticate user
        Claims claims = Authentication.getClaims(request);
        if (claims == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        
        // Check if user is admin or super
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if (!"admin".equalsIgnoreCase(role) && !"super".equalsIgnoreCase(role) && !"manager".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
        
        return ResponseEntity.ok(activityLogService.getActivityLogsByActionType(actionType));
    }
    
    // Get activity logs with filters
    @PostMapping("/filter")
    public ResponseEntity<Page<ActivityLogDTO>> filterActivityLogs(
            @RequestBody ActivityLogDTO.ActivityLogFilterRequest filterRequest,
            HttpServletRequest request) throws Exception {
        
        // Authenticate user
        Claims claims = Authentication.getClaims(request);
        if (claims == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        
        // Check if user is admin or super
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if (!"admin".equalsIgnoreCase(role) && !"super".equalsIgnoreCase(role) && !"manager".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
        
        return ResponseEntity.ok(activityLogService.getActivityLogsWithFilters(filterRequest));
    }
    
    // Create activity log
    @PostMapping
    public ResponseEntity<ActivityLogDTO> createActivityLog(
            @RequestBody ActivityLogDTO.ActivityLogCreateRequest request,
            HttpServletRequest httpRequest) throws Exception {
        
        // Authenticate user
        Claims claims = Authentication.getClaims(httpRequest);
        if (claims == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        
        ActivityLogDTO createdLog = activityLogService.createActivityLog(request, claims);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLog);
    }
    
    // Delete activity log (admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteActivityLog(
            @PathVariable Integer id,
            HttpServletRequest request) throws Exception {
        
        // Authenticate user
        Claims claims = Authentication.getClaims(request);
        if (claims == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        
        // Check if user is admin or super
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if (!"admin".equalsIgnoreCase(role) && !"super".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
        
        boolean deleted = activityLogService.deleteActivityLog(id);
        
        Map<String, Object> response = new HashMap<>();
        if (deleted) {
            response.put("success", true);
            response.put("message", "Activity log deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Activity log not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    
    // Get activity counts by entity type
    @GetMapping("/count/entity/{entityType}")
    public ResponseEntity<Map<String, Long>> getCountByEntityType(
            @PathVariable String entityType,
            HttpServletRequest request) throws Exception {
        
        // Authenticate user
        Claims claims = Authentication.getClaims(request);
        if (claims == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        
        // Check if user is admin or super
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if (!"admin".equalsIgnoreCase(role) && !"super".equalsIgnoreCase(role) && !"manager".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
        
        long count = activityLogService.getCountByEntityType(entityType);
        
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
    
    // Get activity counts by action type
    @GetMapping("/count/action/{actionType}")
    public ResponseEntity<Map<String, Long>> getCountByActionType(
            @PathVariable String actionType,
            HttpServletRequest request) throws Exception {
        
        // Authenticate user
        Claims claims = Authentication.getClaims(request);
        if (claims == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        
        // Check if user is admin or super
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if (!"admin".equalsIgnoreCase(role) && !"super".equalsIgnoreCase(role) && !"manager".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
        
        long count = activityLogService.getCountByActionType(actionType);
        
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
}