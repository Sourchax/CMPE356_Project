package group12.Backend.controller;

import group12.Backend.util.*;
import group12.Backend.dto.ActivityLogDTO;
import group12.Backend.dto.VoyageDTO;
import group12.Backend.service.ActivityLogService;
import group12.Backend.service.VoyageService;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/voyages")
@CrossOrigin(origins = "*")
public class VoyageController {

    @Autowired
    private VoyageService voyageService;
    
    @Autowired
    private ActivityLogService activityLogService;
    
    // Get all voyages
    @GetMapping
    public ResponseEntity<List<VoyageDTO>> getAllVoyages() {
        return ResponseEntity.ok(voyageService.getAllVoyages());
    }
    
    // Get all future voyages
    @GetMapping("/future")
    public ResponseEntity<List<VoyageDTO>> getAllFutureVoyages() {
        return ResponseEntity.ok(voyageService.getAllFutureVoyages());
    }
    
    // Get voyage by ID
    @GetMapping("/{id}")
    public ResponseEntity<VoyageDTO> getVoyageById(@PathVariable Integer id) {
        VoyageDTO voyage = voyageService.getVoyageById(id);
        
        if (voyage != null) {
            return ResponseEntity.ok(voyage);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Search voyages by route and date
    @GetMapping("/search")
    public ResponseEntity<List<VoyageDTO>> searchVoyages(
            @RequestParam Integer fromStationId,
            @RequestParam Integer toStationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate) {
            
        return ResponseEntity.ok(voyageService.findVoyages(fromStationId, toStationId, departureDate));
    }
    
    // Create a new voyage
    @PostMapping
    public ResponseEntity<VoyageDTO> createVoyage(@RequestBody VoyageDTO voyageDTO, @RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            VoyageDTO createdVoyage = voyageService.createVoyage(voyageDTO);
            
            // Log the activity
            ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
            logRequest.setActionType("CREATE");
            logRequest.setEntityType("VOYAGE");
            logRequest.setEntityId(createdVoyage.getId().toString());
            logRequest.setDescription("Created voyage from " + createdVoyage.getFromStationTitle() + 
                " (" + createdVoyage.getFromStationCity() + ") to " + 
                createdVoyage.getToStationTitle() + " (" + createdVoyage.getToStationCity() + 
                ") on " + createdVoyage.getDepartureDate());
            activityLogService.createActivityLog(logRequest, claims);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(createdVoyage);
        }
        else{
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
    }
    
    // Create multiple voyages at once
    @PostMapping("/bulk")
    public ResponseEntity<Map<String, Object>> createBulkVoyages(
            @RequestBody List<VoyageDTO> voyageDTOs, @RequestHeader("Authorization") String auth) throws Exception {

        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            int createdCount = voyageService.createBulkVoyages(voyageDTOs);
            
            // Log the activity
            ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
            logRequest.setActionType("BULK_CREATE");
            logRequest.setEntityType("VOYAGE");
            logRequest.setEntityId("bulk");
            logRequest.setDescription("Created " + createdCount + " voyages in bulk operation");
            activityLogService.createActivityLog(logRequest, claims);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("createdCount", createdCount);
            response.put("message", createdCount + " voyages created successfully");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        else{
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        
    }
    
    // Update a voyage
    @PutMapping("/{id}")
    public ResponseEntity<VoyageDTO> updateVoyage(@PathVariable Integer id, @RequestBody VoyageDTO voyageDTO, @RequestHeader("Authorization") String auth) throws Exception {

        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            // Get original voyage for comparison
            VoyageDTO originalVoyage = voyageService.getVoyageById(id);
            
            VoyageDTO updatedVoyage = voyageService.updateVoyage(id, voyageDTO);
            
            if (updatedVoyage != null) {
                // Log the activity with detailed changes
                ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
                logRequest.setActionType("UPDATE");
                logRequest.setEntityType("VOYAGE");
                logRequest.setEntityId(id.toString());
                
                StringBuilder description = new StringBuilder("Updated voyage");
                
                if (originalVoyage != null) {
                    description.append(" from ")
                             .append(originalVoyage.getFromStationTitle())
                             .append(" to ")
                             .append(originalVoyage.getToStationTitle());
                    
                    // Log significant changes
                    if (voyageDTO.getDepartureDate() != null && 
                        !voyageDTO.getDepartureDate().equals(originalVoyage.getDepartureDate())) {
                        description.append(", date changed from ")
                                 .append(originalVoyage.getDepartureDate())
                                 .append(" to ")
                                 .append(updatedVoyage.getDepartureDate());
                    }
                    
                    if (voyageDTO.getStatus() != null && 
                        voyageDTO.getStatus() != originalVoyage.getStatus()) {
                        description.append(", status changed from ")
                                 .append(originalVoyage.getStatus())
                                 .append(" to ")
                                 .append(updatedVoyage.getStatus());
                    }
                }
                
                logRequest.setDescription(description.toString());
                activityLogService.createActivityLog(logRequest, claims);
                
                return ResponseEntity.ok(updatedVoyage);
            } else {
                return ResponseEntity.notFound().build();
            }
        }
        else{
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
    }
    
    // Cancel a voyage
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Map<String, Object>> cancelVoyage(@PathVariable Integer id, @RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            // Get voyage details before cancellation for logging
            VoyageDTO voyage = voyageService.getVoyageById(id);
            
            boolean success = voyageService.cancelVoyage(id);
            Map<String, Object> response = new HashMap<>();
            
            if (success) {
                // Log the activity
                ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
                logRequest.setActionType("CANCEL");
                logRequest.setEntityType("VOYAGE");
                logRequest.setEntityId(id.toString());
                
                StringBuilder description = new StringBuilder("Cancelled voyage with ID: " + id);
                
                if (voyage != null) {
                    description.append(" from ")
                             .append(voyage.getFromStationTitle())
                             .append(" (")
                             .append(voyage.getFromStationCity())
                             .append(") to ")
                             .append(voyage.getToStationTitle())
                             .append(" (")
                             .append(voyage.getToStationCity())
                             .append(") on ")
                             .append(voyage.getDepartureDate());
                }
                
                logRequest.setDescription(description.toString());
                activityLogService.createActivityLog(logRequest, claims);
                
                response.put("success", true);
                response.put("message", "Voyage cancelled successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Voyage not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        }
        else{
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
    }
    
    // Delete a voyage (soft delete by marking as inactive)
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteVoyage(@PathVariable Integer id, @RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            // Get voyage details before deletion for logging
            VoyageDTO voyage = voyageService.getVoyageById(id);
            
            boolean success = voyageService.deleteVoyage(id);
            Map<String, Object> response = new HashMap<>();
            
            if (success) {
                // Log the activity
                ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
                logRequest.setActionType("DELETE");
                logRequest.setEntityType("VOYAGE");
                logRequest.setEntityId(id.toString());
                
                StringBuilder description = new StringBuilder("Deleted voyage with ID: " + id);
                
                if (voyage != null) {
                    description.append(" from ")
                             .append(voyage.getFromStationTitle())
                             .append(" (")
                             .append(voyage.getFromStationCity())
                             .append(") to ")
                             .append(voyage.getToStationTitle())
                             .append(" (")
                             .append(voyage.getToStationCity())
                             .append(") on ")
                             .append(voyage.getDepartureDate());
                }
                
                logRequest.setDescription(description.toString());
                activityLogService.createActivityLog(logRequest, claims);
                
                response.put("success", true);
                response.put("message", "Voyage deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Voyage not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        }
        else{
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
    }
    
    // Get voyages by date range
    @GetMapping("/by-date-range")
    public ResponseEntity<List<VoyageDTO>> getVoyagesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        return ResponseEntity.ok(voyageService.getVoyagesByDateRange(startDate, endDate));
    }
    
    // Get voyages by station
    @GetMapping("/by-station/{stationId}")
    public ResponseEntity<List<VoyageDTO>> getVoyagesByStation(
            @PathVariable Integer stationId,
            @RequestParam(required = false) Boolean isDeparture) {
        
        if (isDeparture != null && isDeparture) {
            return ResponseEntity.ok(voyageService.getVoyagesByDepartureStation(stationId));
        } else if (isDeparture != null && !isDeparture) {
            return ResponseEntity.ok(voyageService.getVoyagesByArrivalStation(stationId));
        } else {
            return ResponseEntity.ok(voyageService.getVoyagesByStation(stationId));
        }
    }

    @GetMapping("/count-active")
    public ResponseEntity<Integer> countActiveVoyages() {
        int count = voyageService.countActiveVoyages();
        return ResponseEntity.ok(count);
    }
}