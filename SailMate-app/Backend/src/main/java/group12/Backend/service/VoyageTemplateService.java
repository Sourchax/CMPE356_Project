package group12.Backend.service;

import group12.Backend.dto.VoyageTemplateDTO;
import group12.Backend.entity.Station;
import group12.Backend.entity.Voyage;
import group12.Backend.entity.VoyageTemplate;
import group12.Backend.repository.StationRepository;
import group12.Backend.repository.VoyageRepository;
import group12.Backend.repository.VoyageTemplateRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VoyageTemplateService {
    
    @Autowired
    private VoyageTemplateRepository templateRepository;
    
    @Autowired
    private VoyageRepository voyageRepository;
    
    @Autowired
    private StationRepository stationRepository;
    
    @Autowired
    private VoyageService voyageService;
    
    // Get all templates
    public List<VoyageTemplateDTO> getAllTemplates() {
        return templateRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get all active templates
    public List<VoyageTemplateDTO> getAllActiveTemplates() {
        return templateRepository.findByIsActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get template by ID
    public VoyageTemplateDTO getTemplateById(Integer id) {
        Optional<VoyageTemplate> template = templateRepository.findById(id);
        return template.map(this::convertToDTO).orElse(null);
    }
    
    // Find templates by from station and to station
    public List<VoyageTemplateDTO> findTemplatesByRoute(Integer fromStationId, Integer toStationId) {
        return templateRepository.findByFromStation_IdAndToStation_IdAndIsActiveTrue(
                fromStationId, toStationId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Create a new template
    @Transactional
    public VoyageTemplateDTO createTemplate(VoyageTemplateDTO templateDTO) {
        VoyageTemplate template = convertToEntity(templateDTO);
        VoyageTemplate savedTemplate = templateRepository.save(template);
        return convertToDTO(savedTemplate);
    }
    
    // Update a template
    @Transactional
    public VoyageTemplateDTO updateTemplate(Integer id, VoyageTemplateDTO templateDTO) {
        Optional<VoyageTemplate> existingTemplate = templateRepository.findById(id);
        
        if (existingTemplate.isPresent()) {
            VoyageTemplate template = existingTemplate.get();
            
            // Update fields from DTO
            if (templateDTO.getFromStationId() != null) {
                Station fromStation = stationRepository.findById(templateDTO.getFromStationId())
                        .orElseThrow(() -> new IllegalArgumentException("From station not found"));
                template.setFromStation(fromStation);
            }
            
            if (templateDTO.getToStationId() != null) {
                Station toStation = stationRepository.findById(templateDTO.getToStationId())
                        .orElseThrow(() -> new IllegalArgumentException("To station not found"));
                template.setToStation(toStation);
            }
            
            if (templateDTO.getDayOfWeek() != null) {
                template.setDayOfWeek(templateDTO.getDayOfWeek());
            }
            
            if (templateDTO.getDepartureTime() != null) {
                template.setDepartureTime(templateDTO.getDepartureTime());
            }
            
            if (templateDTO.getArrivalTime() != null) {
                template.setArrivalTime(templateDTO.getArrivalTime());
            }
            
            if (templateDTO.getShipType() != null) {
                template.setShipType(templateDTO.getShipType());
            }
            
            if (templateDTO.getFuelType() != null) {
                template.setFuelType(templateDTO.getFuelType());
            }
            
            if (templateDTO.getBusinessSeats() != null) {
                template.setBusinessSeats(templateDTO.getBusinessSeats());
            }
            
            if (templateDTO.getPromoSeats() != null) {
                template.setPromoSeats(templateDTO.getPromoSeats());
            }
            
            if (templateDTO.getEconomySeats() != null) {
                template.setEconomySeats(templateDTO.getEconomySeats());
            }
            
            if (templateDTO.getIsActive() != null) {
                template.setIsActive(templateDTO.getIsActive());
            }
            
            // Save the updated template
            VoyageTemplate updatedTemplate = templateRepository.save(template);
            return convertToDTO(updatedTemplate);
        }
        
        return null;
    }
    
    // Deactivate a template
    @Transactional
    public boolean deactivateTemplate(Integer id) {
        Optional<VoyageTemplate> template = templateRepository.findById(id);
        
        if (template.isPresent()) {
            VoyageTemplate t = template.get();
            t.setIsActive(false);
            templateRepository.save(t);
            return true;
        }
        
        return false;
    }
    
    // Update template and apply changes to future voyages
    @Transactional
    public VoyageTemplateDTO updateTemplateAndFutureVoyages(Integer id, VoyageTemplateDTO templateDTO, LocalDate startDate) {
        VoyageTemplateDTO updatedTemplate = updateTemplate(id, templateDTO);
        
        if (updatedTemplate != null) {
            // Update all future non-modified voyages from this template
            voyageService.updateFutureVoyagesFromTemplate(id, startDate);
        }
        
        return updatedTemplate;
    }
    
    // Cancel all future voyages for a template
    @Transactional
    public boolean cancelFutureVoyagesForTemplate(Integer templateId, LocalDate startDate) {
        Optional<VoyageTemplate> template = templateRepository.findById(templateId);
        
        if (template.isPresent()) {
            List<Voyage> voyages = voyageRepository.findByTemplateAndDepartureDateBetween(
                    template.get(), startDate, LocalDate.now().plusYears(10));
            
            for (Voyage voyage : voyages) {
                voyage.setStatus(Voyage.VoyageStatus.cancel);
                voyage.setIsModified(true);
                voyageRepository.save(voyage);
            }
            
            return true;
        }
        
        return false;
    }
    
    // Delete all future unmodified voyages for a template
    @Transactional
    public int deleteUnmodifiedVoyagesForTemplate(Integer templateId, LocalDate startDate) {
        Optional<VoyageTemplate> template = templateRepository.findById(templateId);
        int deletedCount = 0;
        
        if (template.isPresent()) {
            List<Voyage> voyages = voyageRepository.findUnmodifiedVoyagesByTemplateFromDate(
                    template.get(), startDate);
            
            for (Voyage voyage : voyages) {
                voyageRepository.delete(voyage);
                deletedCount++;
            }
        }
        
        return deletedCount;
    }
    
    // Regenerate voyages for a specific template
    @Transactional
    public int regenerateVoyagesForTemplate(Integer templateId, LocalDate startDate, LocalDate endDate) {
        Optional<VoyageTemplate> template = templateRepository.findById(templateId);
        int generatedCount = 0;
        
        if (template.isPresent() && template.get().getIsActive()) {
            // First remove all unmodified voyages
            deleteUnmodifiedVoyagesForTemplate(templateId, startDate);
            
            // Then generate new voyages
            VoyageTemplate t = template.get();
            int dayOfWeek = t.getDayOfWeek();
            
            // Adjust startDate to the next occurrence of template's day of week
            LocalDate currentDate = startDate;
            while (currentDate.getDayOfWeek().getValue() % 7 != dayOfWeek) {
                currentDate = currentDate.plusDays(1);
            }
            
            // Generate voyages for each week until endDate
            while (currentDate.isBefore(endDate) || currentDate.isEqual(endDate)) {
                // Check if voyage already exists for this date
                boolean voyageExists = voyageRepository.findByTemplateAndDepartureDateBetween(
                        t, currentDate, currentDate).size() > 0;
                
                if (!voyageExists) {
                    // Create new voyage from template
                    Voyage voyage = new Voyage();
                    voyage.setTemplate(t);
                    voyage.setFromStation(t.getFromStation());
                    voyage.setToStation(t.getToStation());
                    voyage.setDepartureDate(currentDate);
                    voyage.setDepartureTime(t.getDepartureTime());
                    voyage.setArrivalTime(t.getArrivalTime());
                    voyage.setShipType(t.getShipType());
                    voyage.setFuelType(t.getFuelType());
                    voyage.setBusinessSeats(t.getBusinessSeats());
                    voyage.setPromoSeats(t.getPromoSeats());
                    voyage.setEconomySeats(t.getEconomySeats());
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
    
    // Count voyages associated with a template
    public long countVoyagesByTemplate(Integer templateId) {
        Optional<VoyageTemplate> template = templateRepository.findById(templateId);
        return template.map(voyageRepository::countByTemplate).orElse(0L);
    }
    
    // Convert VoyageTemplate entity to VoyageTemplateDTO
    private VoyageTemplateDTO convertToDTO(VoyageTemplate template) {
        VoyageTemplateDTO dto = new VoyageTemplateDTO();
        
        dto.setId(template.getId());
        
        dto.setFromStationId(template.getFromStation().getId());
        dto.setFromStationCity(template.getFromStation().getCity());
        dto.setFromStationTitle(template.getFromStation().getTitle());
        
        dto.setToStationId(template.getToStation().getId());
        dto.setToStationCity(template.getToStation().getCity());
        dto.setToStationTitle(template.getToStation().getTitle());
        
        dto.setDayOfWeek(template.getDayOfWeek());
        dto.setDepartureTime(template.getDepartureTime());
        dto.setArrivalTime(template.getArrivalTime());
        dto.setShipType(template.getShipType());
        dto.setFuelType(template.getFuelType());
        dto.setBusinessSeats(template.getBusinessSeats());
        dto.setPromoSeats(template.getPromoSeats());
        dto.setEconomySeats(template.getEconomySeats());
        dto.setIsActive(template.getIsActive());
        
        return dto;
    }
    
    // Convert VoyageTemplateDTO to VoyageTemplate entity
    private VoyageTemplate convertToEntity(VoyageTemplateDTO dto) {
        VoyageTemplate template = new VoyageTemplate();
        
        if (dto.getId() != null) {
            template.setId(dto.getId());
        }
        
        Station fromStation = stationRepository.findById(dto.getFromStationId())
                .orElseThrow(() -> new IllegalArgumentException("From station not found"));
        template.setFromStation(fromStation);
        
        Station toStation = stationRepository.findById(dto.getToStationId())
                .orElseThrow(() -> new IllegalArgumentException("To station not found"));
        template.setToStation(toStation);
        
        template.setDayOfWeek(dto.getDayOfWeek());
        template.setDepartureTime(dto.getDepartureTime());
        template.setArrivalTime(dto.getArrivalTime());
        template.setShipType(dto.getShipType());
        
        if (dto.getFuelType() != null) {
            template.setFuelType(dto.getFuelType());
        }
        
        template.setBusinessSeats(dto.getBusinessSeats());
        template.setPromoSeats(dto.getPromoSeats());
        template.setEconomySeats(dto.getEconomySeats());
        
        if (dto.getIsActive() != null) {
            template.setIsActive(dto.getIsActive());
        }
        
        return template;
    }
}