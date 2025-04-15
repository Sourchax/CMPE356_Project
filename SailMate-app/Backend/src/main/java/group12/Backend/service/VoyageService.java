package group12.Backend.service;

import group12.Backend.dto.NotificationDTO;
import group12.Backend.dto.SeatsSoldDTO;
import group12.Backend.dto.VoyageDTO;
import group12.Backend.entity.Notification;
import group12.Backend.entity.Station;
import group12.Backend.entity.Ticket;
import group12.Backend.entity.Voyage;
import group12.Backend.repository.StationRepository;
import group12.Backend.repository.TicketRepository;
import group12.Backend.repository.VoyageRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.ArrayList;
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
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SeatsSoldService seatsSoldService;
    
    public List<VoyageDTO> getAllVoyages() {
        return voyageRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<VoyageDTO> getAllFutureVoyages() {
        return voyageRepository.findAllFutureVoyages().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public VoyageDTO getVoyageById(Integer id) {
        Optional<Voyage> voyage = voyageRepository.findById(id);
        return voyage.map(this::convertToDTO).orElse(null);
    }

    private void initializeSeatsForVoyage(Voyage voyage) {
        try {
            SeatsSoldDTO seatsSoldDTO = new SeatsSoldDTO();
            seatsSoldDTO.setVoyageId(voyage.getId());
            seatsSoldDTO.setShipType(voyage.getShipType());
            
            seatsSoldDTO.setUpperDeckPromo(0L);
            seatsSoldDTO.setUpperDeckEconomy(0L);
            seatsSoldDTO.setUpperDeckBusiness(0L);
            seatsSoldDTO.setLowerDeckPromo(0L);
            seatsSoldDTO.setLowerDeckEconomy(0L);
            seatsSoldDTO.setLowerDeckBusiness(0L);
            seatsSoldDTO.setTotalTicketsSold(0L);
            
            seatsSoldService.createSeatsSold(seatsSoldDTO);
        } catch (Exception e) {
            System.err.println("Error initializing seats sold record for voyage " + voyage.getId() + ": " + e.getMessage());
        }
    }
    
    public List<VoyageDTO> findVoyages(Integer fromStationId, Integer toStationId, LocalDate departureDate) {
        return voyageRepository.findByFromStation_IdAndToStation_IdAndDepartureDate(
                fromStationId, toStationId, departureDate).stream()
                .filter(v -> v.getStatus() == Voyage.VoyageStatus.active)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public VoyageDTO createVoyage(VoyageDTO voyageDTO) {
        Voyage voyage = convertToEntity(voyageDTO);
        Voyage savedVoyage = voyageRepository.save(voyage);
        initializeSeatsForVoyage(savedVoyage);
        return convertToDTO(savedVoyage);
    }

    public Optional<Voyage> getVoyageEntityById(Integer id) {
        return voyageRepository.findById(id);
    }
    
    @Transactional
    public int createBulkVoyages(List<VoyageDTO> voyageDTOs) {
        List<Voyage> voyages = voyageDTOs.stream()
                .map(this::convertToEntity)
                .collect(Collectors.toList());
        List<Voyage> savedVoyages = voyageRepository.saveAll(voyages);
        savedVoyages.forEach(this::initializeSeatsForVoyage);
        return savedVoyages.size();
    }
    
    @Transactional
    public VoyageDTO updateVoyage(Integer id, VoyageDTO voyageDTO) {
        Optional<Voyage> existingVoyage = voyageRepository.findById(id);
        
        if (existingVoyage.isPresent()) {
            Voyage voyage = existingVoyage.get();
            
            LocalDate originalDepartureDate = voyage.getDepartureDate();
            LocalTime originalDepartureTime = voyage.getDepartureTime();
            LocalTime originalArrivalTime = voyage.getArrivalTime();
            String originalFromStationTitle = voyage.getFromStation().getTitle();
            String originalFromStationCity = voyage.getFromStation().getCity();
            String originalToStationTitle = voyage.getToStation().getTitle();
            String originalToStationCity = voyage.getToStation().getCity();
            Voyage.VoyageStatus originalStatus = voyage.getStatus();
            String originalShipType = voyage.getShipType();
            Boolean originalFuelType = voyage.getFuelType();
            
            List<String> changedFields = new ArrayList<>();
            List<String> changedFieldsTr = new ArrayList<>();
            
            if (voyageDTO.getFromStationId() != null) {
                Station fromStation = stationRepository.findById(voyageDTO.getFromStationId())
                        .orElseThrow(() -> new IllegalArgumentException("From station not found"));
                
                if (!originalFromStationTitle.equals(fromStation.getTitle())) {
                    changedFields.add("departure station title");
                    changedFieldsTr.add("kalkış istasyonu adı");
                }
                
                if (!originalFromStationCity.equals(fromStation.getCity())) {
                    changedFields.add("departure city");
                    changedFieldsTr.add("kalkış şehri");
                }
                
                voyage.setFromStation(fromStation);
            }
            
            if (voyageDTO.getToStationId() != null) {
                Station toStation = stationRepository.findById(voyageDTO.getToStationId())
                        .orElseThrow(() -> new IllegalArgumentException("To station not found"));
                
                if (!originalToStationTitle.equals(toStation.getTitle())) {
                    changedFields.add("arrival station title");
                    changedFieldsTr.add("varış istasyonu adı");
                }
                
                if (!originalToStationCity.equals(toStation.getCity())) {
                    changedFields.add("arrival city");
                    changedFieldsTr.add("varış şehri");
                }
                
                voyage.setToStation(toStation);
            }
            
            if (voyageDTO.getDepartureDate() != null && !originalDepartureDate.equals(voyageDTO.getDepartureDate())) {
                voyage.setDepartureDate(voyageDTO.getDepartureDate());
                changedFields.add("departure date");
                changedFieldsTr.add("kalkış tarihi");
            }
            
            if (voyageDTO.getDepartureTime() != null && !originalDepartureTime.equals(voyageDTO.getDepartureTime())) {
                voyage.setDepartureTime(voyageDTO.getDepartureTime());
                changedFields.add("departure time");
                changedFieldsTr.add("kalkış saati");
            }
            
            if (voyageDTO.getArrivalTime() != null && !originalArrivalTime.equals(voyageDTO.getArrivalTime())) {
                voyage.setArrivalTime(voyageDTO.getArrivalTime());
                changedFields.add("arrival time");
                changedFieldsTr.add("varış saati");
            }
            
            if (voyageDTO.getStatus() != null && originalStatus != voyageDTO.getStatus()) {
                voyage.setStatus(voyageDTO.getStatus());
                changedFields.add("status");
                changedFieldsTr.add("durum");
                
                if (voyageDTO.getStatus() == Voyage.VoyageStatus.cancel) {
                    notifyVoyageCancellation(voyage);
                    return convertToDTO(voyageRepository.save(voyage));
                }
            }
            
            if (voyageDTO.getShipType() != null && !originalShipType.equals(voyageDTO.getShipType())) {
                voyage.setShipType(voyageDTO.getShipType());
                changedFields.add("ship type");
                changedFieldsTr.add("gemi tipi");
            }
            
            if (voyageDTO.getFuelType() != null && !originalFuelType.equals(voyageDTO.getFuelType())) {
                voyage.setFuelType(voyageDTO.getFuelType());
                changedFields.add("fuel type");
                changedFieldsTr.add("yakıt tipi");
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
            
            Voyage updatedVoyage = voyageRepository.save(voyage);
            
            if (!changedFields.isEmpty()) {
                notifyVoyageChanges(updatedVoyage, changedFields, changedFieldsTr);
            }
            
            return convertToDTO(updatedVoyage);
        }
        
        return null;
    }
    
    @Transactional
    public boolean cancelVoyage(Integer id) {
        Optional<Voyage> voyage = voyageRepository.findById(id);
        
        if (voyage.isPresent()) {
            Voyage v = voyage.get();
            v.setStatus(Voyage.VoyageStatus.cancel);
            voyageRepository.save(v);
            
            notifyVoyageCancellation(v);
            
            return true;
        }
        
        return false;
    }
    
    @Transactional
    public int cancelVoyagesByRoute(Integer fromStationId, Integer toStationId, LocalDate startDate, LocalDate endDate) {
        List<Voyage> voyagesToCancel = voyageRepository.findByFromStation_IdAndToStation_Id(fromStationId, toStationId)
                .stream()
                .filter(v -> v.getStatus() == Voyage.VoyageStatus.active)
                .filter(v -> !v.getDepartureDate().isBefore(startDate) && !v.getDepartureDate().isAfter(endDate))
                .collect(Collectors.toList());
                
        for (Voyage voyage : voyagesToCancel) {
            voyage.setStatus(Voyage.VoyageStatus.cancel);
            
            notifyVoyageCancellation(voyage);
        }
        
        voyageRepository.saveAll(voyagesToCancel);
        return voyagesToCancel.size();
    }
    
    @Transactional
    public boolean deleteVoyage(Integer id) {
        Optional<Voyage> voyage = voyageRepository.findById(id);
        
        if (voyage.isPresent()) {
            Voyage v = voyage.get();
            
            notifyVoyageCancellation(v);
            
            voyageRepository.delete(v);
            return true;
        }
        
        return false;
    }
    
    public List<VoyageDTO> getVoyagesByDateRange(LocalDate startDate, LocalDate endDate) {
        return voyageRepository.findByDepartureDateBetween(startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<VoyageDTO> getVoyagesByDepartureStation(Integer stationId) {
        return voyageRepository.findByFromStation_Id(stationId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<VoyageDTO> getVoyagesByArrivalStation(Integer stationId) {
        return voyageRepository.findByToStation_Id(stationId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<VoyageDTO> getVoyagesByStation(Integer stationId) {
        return voyageRepository.findByStationId(stationId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public int countActiveVoyages() {
        return voyageRepository.countByStatus(Voyage.VoyageStatus.active);
    }
    
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
    
    private void notifyVoyageCancellation(Voyage voyage) {
        List<Ticket> affectedTickets = ticketRepository.findByVoyageId(voyage.getId());
        
        for (Ticket ticket : affectedTickets) {
            NotificationDTO.NotificationCreateRequest notificationRequest = new NotificationDTO.NotificationCreateRequest();
            notificationRequest.setUserId(ticket.getUserId());
            notificationRequest.setType(Notification.NotificationType.VOYAGE_CANCELLED);
            notificationRequest.setTitle("Voyage Cancelled");
            notificationRequest.setTitleTr("Sefer İptal Edildi");
            
            String message = String.format(
                "Your voyage from %s (%s) to %s (%s) on %s has been cancelled. Your ticket %s is affected. Please contact customer support for assistance.",
                voyage.getFromStation().getTitle(),
                voyage.getFromStation().getCity(),
                voyage.getToStation().getTitle(),
                voyage.getToStation().getCity(),
                voyage.getDepartureDate(),
                ticket.getTicketID()
            );
            
            String messageTr = String.format(
                "%s (%s)'dan %s (%s)'a %s tarihli seferiniz iptal edildi. %s numaralı biletiniz etkilendi. Lütfen yardım için müşteri hizmetleriyle iletişime geçin.",
                voyage.getFromStation().getTitle(),
                voyage.getFromStation().getCity(),
                voyage.getToStation().getTitle(),
                voyage.getToStation().getCity(),
                voyage.getDepartureDate(),
                ticket.getTicketID()
            );
            
            notificationRequest.setMessage(message);
            notificationRequest.setMessageTr(messageTr);
            notificationRequest.setEntityId(ticket.getTicketID());
            
            notificationService.createNotification(notificationRequest);
        }
    }
    
    private void notifyVoyageChanges(Voyage voyage, List<String> changedFields, List<String> changedFieldsTr) {
        List<Ticket> affectedTickets = ticketRepository.findByVoyageId(voyage.getId());
        
        if (affectedTickets.isEmpty()) {
            return;
        }
        
        String changedFieldsStr = String.join(", ", changedFields);
        String changedFieldsStrTr = String.join(", ", changedFieldsTr);
        
        for (Ticket ticket : affectedTickets) {
            NotificationDTO.NotificationCreateRequest notificationRequest = new NotificationDTO.NotificationCreateRequest();
            notificationRequest.setUserId(ticket.getUserId());
            notificationRequest.setType(Notification.NotificationType.VOYAGE_DELAYED);
            notificationRequest.setTitle("Voyage Update");
            notificationRequest.setTitleTr("Sefer Güncellendi");
            
            String message = String.format(
                "Your voyage from %s (%s) to %s (%s) on %s at %s has been updated. Changes were made to: %s. Your ticket %s is affected.",
                voyage.getFromStation().getTitle(),
                voyage.getFromStation().getCity(),
                voyage.getToStation().getTitle(),
                voyage.getToStation().getCity(),
                voyage.getDepartureDate(),
                voyage.getDepartureTime(),
                changedFieldsStr,
                ticket.getTicketID()
            );
            
            String messageTr = String.format(
                "%s (%s)'dan %s (%s)'a %s tarihinde saat %s'deki seferiniz güncellendi. %s için değişiklikler yapıldı. %s numaralı biletiniz etkilendi.",
                voyage.getFromStation().getTitle(),
                voyage.getFromStation().getCity(),
                voyage.getToStation().getTitle(),
                voyage.getToStation().getCity(),
                voyage.getDepartureDate(),
                voyage.getDepartureTime(),
                changedFieldsStrTr,
                ticket.getTicketID()
            );
            
            notificationRequest.setMessage(message);
            notificationRequest.setMessageTr(messageTr);
            notificationRequest.setEntityId(ticket.getTicketID());
            
            notificationService.createNotification(notificationRequest);
        }
    }
}