package group12.Backend.service;

import group12.Backend.dto.VoyageDTO;
import group12.Backend.entity.Station;
import group12.Backend.entity.Voyage;
import group12.Backend.entity.VoyageTemplate;
import group12.Backend.repository.StationRepository;
import group12.Backend.repository.VoyageRepository;
import group12.Backend.repository.VoyageTemplateRepository;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
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
    private VoyageTemplateRepository templateRepository;
    
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
        voyage.setIsModified(true); // Mark as modified since it's manually created
        Voyage savedVoyage = voyageRepository.save(voyage);
        return convertToDTO(savedVoyage);
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
            
            // Mark as modified
            voyage.setIsModified(true);
            
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
            v.setIsModified(true);
            voyageRepository.save(v);
            return true;
        }
        
        return false;
    }
    
    // Delete a voyage
    @Transactional
    public boolean deleteVoyage(Integer id) {
        Optional<Voyage> voyage = voyageRepository.findById(id);
        
        if (voyage.isPresent()) {
            Voyage v = voyage.get();
            v.setStatus(Voyage.VoyageStatus.delete);
            v.setIsModified(true);
            voyageRepository.save(v);
            return true;
        }
        
        return false;
    }
    
    // Generate voyages from templates for a date range
    @Transactional
    public int generateVoyages(LocalDate startDate, LocalDate endDate) {
        List<VoyageTemplate> activeTemplates = templateRepository.findByIsActiveTrue();
        int generatedCount = 0;
        
        for (VoyageTemplate template : activeTemplates) {
            LocalDate currentDate = startDate;
            
            // Find the first occurrence of the template's day of week on or after startDate
            DayOfWeek templateDay = DayOfWeek.of(template.getDayOfWeek() + 1); // Adjust from 0-6 to 1-7
            currentDate = startDate.with(TemporalAdjusters.nextOrSame(templateDay));
            
            // Generate voyages for each week until endDate
            while (currentDate.isBefore(endDate) || currentDate.isEqual(endDate)) {
                // Check if voyage already exists for this template and date
                boolean voyageExists = voyageRepository.findByTemplateAndDepartureDateBetween(
                        template, currentDate, currentDate).size() > 0;
                
                if (!voyageExists) {
                    // Create new voyage from template
                    Voyage voyage = new Voyage();
                    voyage.setTemplate(template);
                    voyage.setFromStation(template.getFromStation());
                    voyage.setToStation(template.getToStation());
                    voyage.setDepartureDate(currentDate);
                    voyage.setDepartureTime(template.getDepartureTime());
                    voyage.setArrivalTime(template.getArrivalTime());
                    voyage.setShipType(template.getShipType());
                    voyage.setFuelType(template.getFuelType());
                    voyage.setBusinessSeats(template.getBusinessSeats());
                    voyage.setPromoSeats(template.getPromoSeats());
                    voyage.setEconomySeats(template.getEconomySeats());
                    voyage.setStatus(Voyage.VoyageStatus.active);
                    voyage.setIsModified(false);
                    
                    voyageRepository.save(voyage);
                    generatedCount++;
                }
                
                // Move to next week
                currentDate = currentDate.plusWeeks(1);
            }
        }
        
        return generatedCount;
    }
    
    // Check if voyages are generated for at least 3 months in the future
    public boolean checkScheduleHealth() {
        LocalDate furthestDate = voyageRepository.findFurthestScheduledDate();
        LocalDate threeMonthsLater = LocalDate.now().plusMonths(3);
        
        return furthestDate != null && !furthestDate.isBefore(threeMonthsLater);
    }
    
    // Ensure voyages are scheduled at least 3 months in advance
    @Transactional
    public int ensureThreeMonthSchedule() {
        LocalDate furthestDate = voyageRepository.findFurthestScheduledDate();
        LocalDate threeMonthsLater = LocalDate.now().plusMonths(3);
        
        // If no voyages or voyages don't extend to 3 months
        if (furthestDate == null || furthestDate.isBefore(threeMonthsLater)) {
            LocalDate startDate = (furthestDate != null) ? furthestDate.plusDays(1) : LocalDate.now();
            return generateVoyages(startDate, threeMonthsLater);
        }
        
        return 0; // No need to generate voyages
    }
    
    // Update future voyages from template
    @Transactional
    public int updateFutureVoyagesFromTemplate(Integer templateId, LocalDate startDate) {
        Optional<VoyageTemplate> template = templateRepository.findById(templateId);
        
        if (template.isPresent()) {
            List<Voyage> voyages = voyageRepository.findUnmodifiedVoyagesByTemplateFromDate(
                    template.get(), startDate);
            
            for (Voyage voyage : voyages) {
                voyage.setFromStation(template.get().getFromStation());
                voyage.setToStation(template.get().getToStation());
                voyage.setDepartureTime(template.get().getDepartureTime());
                voyage.setArrivalTime(template.get().getArrivalTime());
                voyage.setShipType(template.get().getShipType());
                voyage.setFuelType(template.get().getFuelType());
                voyage.setBusinessSeats(template.get().getBusinessSeats());
                voyage.setPromoSeats(template.get().getPromoSeats());
                voyage.setEconomySeats(template.get().getEconomySeats());
                
                voyageRepository.save(voyage);
            }
            
            return voyages.size();
        }
        
        return 0;
    }
    
    // Convert Voyage entity to VoyageDTO
    private VoyageDTO convertToDTO(Voyage voyage) {
        VoyageDTO dto = new VoyageDTO();
        
        dto.setId(voyage.getId());
        
        if (voyage.getTemplate() != null) {
            dto.setTemplateId(voyage.getTemplate().getId());
        }
        
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
        dto.setIsModified(voyage.getIsModified());
        
        return dto;
    }
    
    // Convert VoyageDTO to Voyage entity
    private Voyage convertToEntity(VoyageDTO dto) {
        Voyage voyage = new Voyage();
        
        if (dto.getId() != null) {
            voyage.setId(dto.getId());
        }
        
        if (dto.getTemplateId() != null) {
            templateRepository.findById(dto.getTemplateId()).ifPresent(voyage::setTemplate);
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
        
        if (dto.getIsModified() != null) {
            voyage.setIsModified(dto.getIsModified());
        }
        
        return voyage;
    }
}