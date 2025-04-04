package group12.Backend.controller;

import group12.Backend.util.*;

import java.io.IOException;
import group12.Backend.dto.ActivityLogDTO;
import group12.Backend.dto.StationDTO;
import group12.Backend.entity.Station;
import group12.Backend.service.ActivityLogService;
import group12.Backend.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stations")
@CrossOrigin(origins = "*")
public class StationController {
    
    private final StationService stationService;
    private final ActivityLogService activityLogService;
    
    @Autowired
    public StationController(StationService stationService, ActivityLogService activityLogService) {
        this.stationService = stationService;
        this.activityLogService = activityLogService;
    }
    
    @GetMapping
    public ResponseEntity<List<Station>> getAllStations(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Station.Status status) {
        
        List<Station> stations;
        
        if (city != null && status != null) {
            stations = stationService.getStationsByCityAndStatus(city, status);
        } else if (city != null) {
            stations = stationService.getStationsByCity(city);
        } else if (status != null) {
            stations = stationService.getStationsByStatus(status);
        } else {
            stations = stationService.getAllStations();
        }
        
        return ResponseEntity.ok(stations);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Station>> getActiveStations() {
        return ResponseEntity.ok(stationService.getActiveStations());
    }
    
    // Simplified method to get active station titles
    @GetMapping("/titles")
    public ResponseEntity<List<String>> getStationTitles() {
        try {
            List<Station> activeStations = stationService.getActiveStations();
            if (activeStations == null) {
                activeStations = new ArrayList<>();
            }
            
            List<String> titles = new ArrayList<>();
            for (Station station : activeStations) {
                titles.add(station.getTitle());
            }
            
            return ResponseEntity.ok(titles);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/cities")
    public ResponseEntity<List<String>> getAllCities() {
        List<String> cities = stationService.getAllStations().stream()
                .map(Station::getCity)
                .distinct()
                .collect(Collectors.toList());  // Explicitly collecting to a List
        return ResponseEntity.ok(cities);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Station> getStationById(@PathVariable Integer id) {
        return stationService.getStationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Station> createStation(@RequestBody StationDTO stationDTO, @RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            Station station = convertToEntity(stationDTO);
            Station savedStation = stationService.saveStation(station);
            
            // Log the activity
            ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
            logRequest.setActionType("CREATE");
            logRequest.setEntityType("STATION");
            logRequest.setEntityId(savedStation.getId().toString());
            logRequest.setDescription("Created station: " + savedStation.getTitle() + " in " + savedStation.getCity());
            activityLogService.createActivityLog(logRequest, claims);
            
            return new ResponseEntity<>(savedStation, HttpStatus.CREATED);
        }
        else{
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Station> updateStation(
            @PathVariable Integer id,
            @RequestBody StationDTO stationDTO, @RequestHeader("Authorization") String auth) throws Exception {

        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            if (!stationService.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            
            // Get original station for logging
            Optional<Station> originalStationOpt = stationService.getStationById(id);
            String originalTitle = "";
            String originalCity = "";
            Station.Status originalStatus = null;
            
            if (originalStationOpt.isPresent()) {
                Station originalStation = originalStationOpt.get();
                originalTitle = originalStation.getTitle();
                originalCity = originalStation.getCity();
                originalStatus = originalStation.getStatus();
            }
            
            Station station = convertToEntity(stationDTO);
            Station updatedStation = stationService.updateStation(id, station);
            
            // Log the activity with changes
            ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
            logRequest.setActionType("UPDATE");
            logRequest.setEntityType("STATION");
            logRequest.setEntityId(id.toString());
            
            StringBuilder descriptionBuilder = new StringBuilder("Updated station: " + updatedStation.getTitle());
            
            // Add changed fields to description
            List<String> changes = new ArrayList<>();
            if (!originalTitle.equals(updatedStation.getTitle())) {
                changes.add("title changed from '" + originalTitle + "' to '" + updatedStation.getTitle() + "'");
            }
            if (!originalCity.equals(updatedStation.getCity())) {
                changes.add("city changed from '" + originalCity + "' to '" + updatedStation.getCity() + "'");
            }
            if (originalStatus != updatedStation.getStatus()) {
                changes.add("status changed from '" + originalStatus + "' to '" + updatedStation.getStatus() + "'");
            }
            
            if (!changes.isEmpty()) {
                descriptionBuilder.append(" (");
                descriptionBuilder.append(String.join(", ", changes));
                descriptionBuilder.append(")");
            }
            
            logRequest.setDescription(descriptionBuilder.toString());
            activityLogService.createActivityLog(logRequest, claims);
            
            return ResponseEntity.ok(updatedStation);
        }
        else{
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }     
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStation(@PathVariable Integer id, @RequestHeader("Authorization") String auth) throws Exception {
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            if (!stationService.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            
            // Get station details for logging before deletion
            Optional<Station> stationOpt = stationService.getStationById(id);
            String stationTitle = "";
            String stationCity = "";
            
            if (stationOpt.isPresent()) {
                Station station = stationOpt.get();
                stationTitle = station.getTitle();
                stationCity = station.getCity();
            }
            
            stationService.deleteStation(id);
            
            // Log the activity
            ActivityLogDTO.ActivityLogCreateRequest logRequest = new ActivityLogDTO.ActivityLogCreateRequest();
            logRequest.setActionType("DELETE");
            logRequest.setEntityType("STATION");
            logRequest.setEntityId(id.toString());
            logRequest.setDescription("Deleted station: " + stationTitle + " in " + stationCity);
            activityLogService.createActivityLog(logRequest, claims);
            
            return ResponseEntity.noContent().build();
        }
        else{
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
    }
    
    private Station convertToEntity(StationDTO stationDTO) {
        Station station = new Station();
        station.setId(stationDTO.getId());
        station.setCity(stationDTO.getCity());
        station.setTitle(stationDTO.getTitle());
        station.setPersonnel(stationDTO.getPersonnel());
        station.setPhoneno(stationDTO.getPhoneno());
        station.setAddress(stationDTO.getAddress());
        station.setStatus(stationDTO.getStatus());
        return station;
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getStationCount() {
        return ResponseEntity.ok(stationService.getStationCount());
    }
}