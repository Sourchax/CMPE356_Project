package group12.Backend.controller;

import group12.Backend.util.*;
import group12.Backend.dto.VoyageDTO;
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
    public ResponseEntity<VoyageDTO> createVoyage(@RequestBody VoyageDTO voyageDTO, HttpServletRequest request) throws Exception {
        Claims claims = Authentication.getClaims(request);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            return ResponseEntity.status(HttpStatus.CREATED).body(voyageService.createVoyage(voyageDTO));
        }
        else{
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
    }
    
    // Create multiple voyages at once
    @PostMapping("/bulk")
    public ResponseEntity<Map<String, Object>> createBulkVoyages(
            @RequestBody List<VoyageDTO> voyageDTOs, HttpServletRequest request) throws Exception {

        Claims claims = Authentication.getClaims(request);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            int createdCount = voyageService.createBulkVoyages(voyageDTOs);
            
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
    public ResponseEntity<VoyageDTO> updateVoyage(@PathVariable Integer id, @RequestBody VoyageDTO voyageDTO, HttpServletRequest request) throws Exception {

        Claims claims = Authentication.getClaims(request);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            VoyageDTO updatedVoyage = voyageService.updateVoyage(id, voyageDTO);
            
            if (updatedVoyage != null) {
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
    public ResponseEntity<Map<String, Object>> cancelVoyage(@PathVariable Integer id, HttpServletRequest request) throws Exception {
        Claims claims = Authentication.getClaims(request);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            boolean success = voyageService.cancelVoyage(id);
            Map<String, Object> response = new HashMap<>();
            
            if (success) {
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
    public ResponseEntity<Map<String, Object>> deleteVoyage(@PathVariable Integer id, HttpServletRequest request) throws Exception {
        Claims claims = Authentication.getClaims(request);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            boolean success = voyageService.deleteVoyage(id);
            Map<String, Object> response = new HashMap<>();
            
            if (success) {
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