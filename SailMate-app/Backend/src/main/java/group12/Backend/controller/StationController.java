package group12.Backend.controller;

import group12.Backend.dto.StationDTO;
import group12.Backend.entity.Station;
import group12.Backend.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stations")
@CrossOrigin(origins = "*")
public class StationController {
    
    private final StationService stationService;
    
    @Autowired
    public StationController(StationService stationService) {
        this.stationService = stationService;
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
    public ResponseEntity<Station> createStation(@RequestBody StationDTO stationDTO) {
        Station station = convertToEntity(stationDTO);
        Station savedStation = stationService.saveStation(station);
        return new ResponseEntity<>(savedStation, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Station> updateStation(
            @PathVariable Integer id,
            @RequestBody StationDTO stationDTO) {
        
        if (!stationService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        Station station = convertToEntity(stationDTO);
        Station updatedStation = stationService.updateStation(id, station);
        return ResponseEntity.ok(updatedStation);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStation(@PathVariable Integer id) {
        if (!stationService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        stationService.deleteStation(id);
        return ResponseEntity.noContent().build();
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
}