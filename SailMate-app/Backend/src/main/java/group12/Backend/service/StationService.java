package group12.Backend.service;

import group12.Backend.entity.Station;
import group12.Backend.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StationService {
    
    private final StationRepository stationRepository;
    
    @Autowired
    public StationService(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }
    
    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }
    
    public List<Station> getActiveStations() {
        return stationRepository.findByStatus(Station.Status.active);
    }

    public List<String> getAllActiveStationTitles() {
        // Get only the titles of active stations for the dropdowns
        return stationRepository.findByStatus(Station.Status.active).stream()
                .map(Station::getTitle)
                .collect(Collectors.toList());
    }
    
    public Map<String, String> getStationLocations() {
        // Create a map with station title as key and city as value
        // This is useful for showing location info in dropdowns
        Map<String, String> locations = new HashMap<>();
        stationRepository.findByStatus(Station.Status.active).forEach(station -> {
            locations.put(station.getTitle(), station.getCity());
        });
        return locations;
    }
    
    public Optional<Station> getStationById(Integer id) {
        return stationRepository.findById(id);
    }
    
    public List<Station> getStationsByCity(String city) {
        return stationRepository.findByCity(city);
    }
    
    public List<Station> getStationsByStatus(Station.Status status) {
        return stationRepository.findByStatus(status);
    }
    
    public List<Station> getStationsByCityAndStatus(String city, Station.Status status) {
        return stationRepository.findByCityAndStatus(city, status);
    }
    
    @Transactional
    public Station saveStation(Station station) {
        return stationRepository.save(station);
    }
    
    @Transactional
    public Station updateStation(Integer id, Station stationDetails) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station not found with id: " + id));
        
        station.setCity(stationDetails.getCity());
        station.setTitle(stationDetails.getTitle());
        station.setPersonnel(stationDetails.getPersonnel());
        station.setPhoneno(stationDetails.getPhoneno());
        station.setAddress(stationDetails.getAddress());
        station.setStatus(stationDetails.getStatus());
        
        return stationRepository.save(station);
    }
    
    @Transactional
    public void deleteStation(Integer id) {
        stationRepository.deleteById(id);
    }
    
    public boolean existsById(Integer id) {
        return stationRepository.existsById(id);
    }

    // Get count of all announcements
    public long getStationCount() {
        return stationRepository.count();
    }
}