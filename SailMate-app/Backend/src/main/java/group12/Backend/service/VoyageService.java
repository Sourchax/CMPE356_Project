package group12.Backend.service;

import group12.Backend.dto.VoyageDTO;
import group12.Backend.entity.Station;
import group12.Backend.entity.Voyage;
import group12.Backend.repository.StationRepository;
import group12.Backend.repository.VoyageRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VoyageService {
    
    @Autowired
    private VoyageRepository voyageRepository;
    
    @Autowired
    private StationRepository stationRepository;
    
    // Get all voyages
    public List<VoyageDTO> getAllVoyages() {
        return voyageRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get all future voyages
    public List<VoyageDTO> getAllFutureVoyages() {
        return voyageRepository.findAllFutureVoyages().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get voyage by ID
    public VoyageDTO getVoyageById(Integer id) {
        Optional<Voyage> voyage = voyageRepository.findById(id);
        return voyage.map(this::convertToDTO).orElse(null);
    }
    
    // Find voyages by from station, to station and departure date
    public List<VoyageDTO> findVoyages(Integer fromStationId, Integer toStationId, LocalDate departureDate) {
        return voyageRepository.findByFromStation_IdAndToStation_IdAndDepartureDate(
                fromStationId, toStationId, departureDate).stream()
                .filter(v -> v.getStatus() == Voyage.VoyageStatus.active)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Create a new voyage
    @Transactional
    public VoyageDTO createVoyage(VoyageDTO voyageDTO) {
        Voyage voyage = convertToEntity(voyageDTO);
        Voyage savedVoyage = voyageRepository.save(voyage);
        return convertToDTO(savedVoyage);
    }
    
    // Create multiple voyages at once
    @Transactional
    public int createBulkVoyages(List<VoyageDTO> voyageDTOs) {
        List<Voyage> voyages = voyageDTOs.stream()
                .map(this::convertToEntity)
                .collect(Collectors.toList());
        
        List<Voyage> savedVoyages = voyageRepository.saveAll(voyages);
        return savedVoyages.size();
    }
    
    // Update a voyage
    @Transactional
    public VoyageDTO updateVoyage(Integer id, VoyageDTO voyageDTO) {
        Optional<Voyage> existingVoyage = voyageRepository.findById(id);
        
        if (existingVoyage.isPresent()) {
            Voyage voyage = existingVoyage.get();
            
            // Update fields from DTO
            if (voyageDTO.getFromStationId() != null) {
                Station fromStation = stationRepository.findById(voyageDTO.getFromStationId())
                        .orElseThrow(() -> new IllegalArgumentException("From station not found"));
                voyage.setFromStation(fromStation);
            }
            
            if (voyageDTO.getToStationId() != null) {
                Station toStation = stationRepository.findById(voyageDTO.getToStationId())
                        .orElseThrow(() -> new IllegalArgumentException("To station not found"));
                voyage.setToStation(toStation);
            }
            
            if (voyageDTO.getDepartureDate() != null) {
                voyage.setDepartureDate(voyageDTO.getDepartureDate());
            }
            
            if (voyageDTO.getDepartureTime() != null) {
                voyage.setDepartureTime(voyageDTO.getDepartureTime());
            }
            
            if (voyageDTO.getArrivalTime() != null) {
                voyage.setArrivalTime(voyageDTO.getArrivalTime());
            }
            
            if (voyageDTO.getStatus() != null) {
                voyage.setStatus(voyageDTO.getStatus());
            }
            
            if (voyageDTO.getShipType() != null) {
                voyage.setShipType(voyageDTO.getShipType());
            }
            
            if (voyageDTO.getFuelType() != null) {
                voyage.setFuelType(voyageDTO.getFuelType());
            }
            
            if (voyageDTO.getBusinessSeats() != null) {
                voyage.setBusinessSeats(voyageDTO.getBusinessSeats());
            }
            
            if (voyageDTO.getPromoSeats() != null) {
                voyage.setPromoSeats(voyageDTO.getPromoSeats());
            }
            
            if (voyageDTO.getEconomySeats() != null) {
                voyage.setEconomySeats(voyageDTO.getEconomySeats());
            }
            
            // Save the updated voyage
            Voyage updatedVoyage = voyageRepository.save(voyage);
            return convertToDTO(updatedVoyage);
        }
        
        return null;
    }
    
    // Cancel a voyage
    @Transactional
    public boolean cancelVoyage(Integer id) {
        Optional<Voyage> voyage = voyageRepository.findById(id);
        
        if (voyage.isPresent()) {
            Voyage v = voyage.get();
            v.setStatus(Voyage.VoyageStatus.cancel);
            voyageRepository.save(v);
            return true;
        }
        
        return false;
    }
    
    // Cancel voyages by route and date range
    @Transactional
    public int cancelVoyagesByRoute(Integer fromStationId, Integer toStationId, LocalDate startDate, LocalDate endDate) {
        List<Voyage> voyagesToCancel = voyageRepository.findByFromStation_IdAndToStation_Id(fromStationId, toStationId)
                .stream()
                .filter(v -> v.getStatus() == Voyage.VoyageStatus.active)
                .filter(v -> !v.getDepartureDate().isBefore(startDate) && !v.getDepartureDate().isAfter(endDate))
                .collect(Collectors.toList());
                
        for (Voyage voyage : voyagesToCancel) {
            voyage.setStatus(Voyage.VoyageStatus.cancel);
        }
        
        voyageRepository.saveAll(voyagesToCancel);
        return voyagesToCancel.size();
    }
    
    // Delete a voyage
    @Transactional
    public boolean deleteVoyage(Integer id) {
        Optional<Voyage> voyage = voyageRepository.findById(id);
        
        if (voyage.isPresent()) {
            voyageRepository.delete(voyage.get());
            return true;
        }
        
        return false;
    }
    
    // Get voyages by date range
    public List<VoyageDTO> getVoyagesByDateRange(LocalDate startDate, LocalDate endDate) {
        return voyageRepository.findByDepartureDateBetween(startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get voyages by departure station
    public List<VoyageDTO> getVoyagesByDepartureStation(Integer stationId) {
        return voyageRepository.findByFromStation_Id(stationId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get voyages by arrival station
    public List<VoyageDTO> getVoyagesByArrivalStation(Integer stationId) {
        return voyageRepository.findByToStation_Id(stationId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get voyages by station (either departure or arrival)
    public List<VoyageDTO> getVoyagesByStation(Integer stationId) {
        return voyageRepository.findByStationId(stationId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    
    // Convert Voyage entity to VoyageDTO
    private VoyageDTO convertToDTO(Voyage voyage) {
        VoyageDTO dto = new VoyageDTO();
        
        dto.setId(voyage.getId());
        
        dto.setFromStationId(voyage.getFromStation().getId());
        dto.setFromStationCity(voyage.getFromStation().getCity());
        dto.setFromStationTitle(voyage.getFromStation().getTitle());
        
        dto.setToStationId(voyage.getToStation().getId());
        dto.setToStationCity(voyage.getToStation().getCity());
        dto.setToStationTitle(voyage.getToStation().getTitle());
        
        dto.setDepartureDate(voyage.getDepartureDate());
        dto.setDepartureTime(voyage.getDepartureTime());
        dto.setArrivalTime(voyage.getArrivalTime());
        dto.setStatus(voyage.getStatus());
        dto.setShipType(voyage.getShipType());
        dto.setFuelType(voyage.getFuelType());
        dto.setBusinessSeats(voyage.getBusinessSeats());
        dto.setPromoSeats(voyage.getPromoSeats());
        dto.setEconomySeats(voyage.getEconomySeats());
        dto.setCreatedAt(voyage.getCreatedAt());
        dto.setUpdatedAt(voyage.getUpdatedAt());
        
        return dto;
    }
    
    // Convert VoyageDTO to Voyage entity
    private Voyage convertToEntity(VoyageDTO dto) {
        Voyage voyage = new Voyage();
        
        if (dto.getId() != null) {
            voyage.setId(dto.getId());
        }
        
        Station fromStation = stationRepository.findById(dto.getFromStationId())
                .orElseThrow(() -> new IllegalArgumentException("From station not found"));
        voyage.setFromStation(fromStation);
        
        Station toStation = stationRepository.findById(dto.getToStationId())
                .orElseThrow(() -> new IllegalArgumentException("To station not found"));
        voyage.setToStation(toStation);
        
        voyage.setDepartureDate(dto.getDepartureDate());
        voyage.setDepartureTime(dto.getDepartureTime());
        voyage.setArrivalTime(dto.getArrivalTime());
        
        if (dto.getStatus() != null) {
            voyage.setStatus(dto.getStatus());
        }
        
        voyage.setShipType(dto.getShipType());
        
        if (dto.getFuelType() != null) {
            voyage.setFuelType(dto.getFuelType());
        }
        
        voyage.setBusinessSeats(dto.getBusinessSeats());
        voyage.setPromoSeats(dto.getPromoSeats());
        voyage.setEconomySeats(dto.getEconomySeats());
        
        return voyage;
    }
    
    public int countActiveVoyages() {
        return voyageRepository.countByStatus(Voyage.VoyageStatus.active);
    }
}