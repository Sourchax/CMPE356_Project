package group12.Backend.service;

import group12.Backend.dto.SeatsSoldDTO;
import group12.Backend.entity.SeatsSold;
import group12.Backend.entity.Voyage;
import group12.Backend.repository.SeatsSoldRepository;
import group12.Backend.repository.VoyageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SeatsSoldService {

    private final SeatsSoldRepository seatsSoldRepository;
    private final VoyageRepository voyageRepository;

    @Autowired
    public SeatsSoldService(SeatsSoldRepository seatsSoldRepository, VoyageRepository voyageRepository) {
        this.seatsSoldRepository = seatsSoldRepository;
        this.voyageRepository = voyageRepository;
    }

    public List<SeatsSoldDTO> getAllSeatsSold() {
        return seatsSoldRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<SeatsSoldDTO> getSeatsSoldById(Integer id) {
        return seatsSoldRepository.findById(id)
                .map(this::convertToDTO);
    }

    public Optional<SeatsSoldDTO> getSeatsSoldByVoyageId(Integer voyageId) {
        return seatsSoldRepository.findByVoyageId(voyageId)
                .map(this::convertToDTO);
    }

    @Transactional
    public SeatsSoldDTO createSeatsSold(SeatsSoldDTO seatsSoldDTO) {
        SeatsSold seatsSold = convertToEntity(seatsSoldDTO);
        return convertToDTO(seatsSoldRepository.save(seatsSold));
    }

    @Transactional
    public Optional<SeatsSoldDTO> updateSeatsSold(Integer id, SeatsSoldDTO seatsSoldDTO) {
        if (!seatsSoldRepository.existsById(id)) {
            return Optional.empty();
        }

        SeatsSold seatsSold = convertToEntity(seatsSoldDTO);
        seatsSold.setId(id);
        return Optional.of(convertToDTO(seatsSoldRepository.save(seatsSold)));
    }

    @Transactional
    public boolean deleteSeatsSold(Integer id) {
        if (!seatsSoldRepository.existsById(id)) {
            return false;
        }

        seatsSoldRepository.deleteById(id);
        return true;
    }

    @Transactional
    public boolean deleteSeatsSoldByVoyageId(Integer voyageId) {
        if (!seatsSoldRepository.existsByVoyageId(voyageId)) {
            return false;
        }

        seatsSoldRepository.deleteByVoyageId(voyageId);
        return true;
    }

    // Initialize SeatsSold record for a new voyage
    @Transactional
    public SeatsSoldDTO initializeForVoyage(Integer voyageId) {
        // Check if already exists
        if (seatsSoldRepository.existsByVoyageId(voyageId)) {
            return seatsSoldRepository.findByVoyageId(voyageId)
                    .map(this::convertToDTO)
                    .orElse(null);
        }

        // Find the voyage
        Voyage voyage = voyageRepository.findById(voyageId)
                .orElseThrow(() -> new IllegalArgumentException("Voyage not found with id: " + voyageId));

        // Create new SeatsSold with zeroes
        SeatsSold seatsSold = new SeatsSold();
        seatsSold.setVoyage(voyage);
        seatsSold.setShipType(voyage.getShipType());
        seatsSold.setUpperDeckPromo(0L);
        seatsSold.setUpperDeckEconomy(0L);
        seatsSold.setUpperDeckBusiness(0L);
        seatsSold.setLowerDeckPromo(0L);
        seatsSold.setLowerDeckEconomy(0L);
        seatsSold.setLowerDeckBusiness(0L);
        seatsSold.setTotalTicketsSold(0L);

        return convertToDTO(seatsSoldRepository.save(seatsSold));
    }

    // Update seats when a ticket is purchased or changed
    @Transactional
    public void updateSeatCounts(Integer voyageId, String ticketData, boolean isPurchased) {
        Optional<SeatsSold> seatsSoldOpt = seatsSoldRepository.findByVoyageId(voyageId);
    
        SeatsSold seatsSold;
        if (seatsSoldOpt.isPresent()) {
            seatsSold = seatsSoldOpt.get();
        } else {
            Voyage voyage = voyageRepository.findById(voyageId)
                    .orElseThrow(() -> new IllegalArgumentException("Voyage not found with id: " + voyageId));
            seatsSold = new SeatsSold();
            seatsSold.setVoyage(voyage);
            seatsSold.setShipType(voyage.getShipType());
        }
    
        String[] codes = ticketData.split(",");
    
        for (String code : codes) {
            code = code.trim();
    
            char rowType = code.charAt(0);
            char classType = code.charAt(1);
            int index = Integer.parseInt(code.substring(code.indexOf('-') + 1));
    
            int bitMask = 1 << (index - 1); // replaces pow(2, index - 1)
    
            switch (classType) {
                case 'B': {
                    switch (rowType) {
                        case '1': {
                            if (isPurchased)
                                seatsSold.setLowerDeckBusiness(seatsSold.getLowerDeckBusiness() + bitMask);
                            else
                                seatsSold.setLowerDeckBusiness(seatsSold.getLowerDeckBusiness() - bitMask);
                            break;
                        }
                        case '2': {
                            if (isPurchased)
                                seatsSold.setUpperDeckBusiness(seatsSold.getUpperDeckBusiness() + bitMask);
                            else
                                seatsSold.setUpperDeckBusiness(seatsSold.getUpperDeckBusiness() - bitMask);
                            break;
                        }
                    }
                    break;
                }
                case 'E': {
                    switch (rowType) {
                        case '1': {
                            if (isPurchased)
                                seatsSold.setLowerDeckEconomy(seatsSold.getLowerDeckEconomy() + bitMask);
                            else
                                seatsSold.setLowerDeckEconomy(seatsSold.getLowerDeckEconomy() - bitMask);
                            break;
                        }
                        case '2': {
                            if (isPurchased)
                                seatsSold.setUpperDeckEconomy(seatsSold.getUpperDeckEconomy() + bitMask);
                            else
                                seatsSold.setUpperDeckEconomy(seatsSold.getUpperDeckEconomy() - bitMask);
                            break;
                        }
                    }
                    break;
                }
                case 'P': {
                    switch (rowType) {
                        case '1': {
                            if (isPurchased)
                                seatsSold.setLowerDeckPromo(seatsSold.getLowerDeckPromo() + bitMask);
                            else
                                seatsSold.setLowerDeckPromo(seatsSold.getLowerDeckPromo() - bitMask);
                            break;
                        }
                        case '2': {
                            if (isPurchased)
                                seatsSold.setUpperDeckPromo(seatsSold.getUpperDeckPromo() + bitMask);
                            else
                                seatsSold.setUpperDeckPromo(seatsSold.getUpperDeckPromo() - bitMask);
                            break;
                        }
                    }
                    break;
                }
            }
        }
        seatsSold.recalculateTotal(isPurchased);
        seatsSoldRepository.save(seatsSold);
    }

    // Convert Entity to DTO
    private SeatsSoldDTO convertToDTO(SeatsSold seatsSold) {
        SeatsSoldDTO dto = new SeatsSoldDTO();
        dto.setId(seatsSold.getId());
        dto.setVoyageId(seatsSold.getVoyage().getId());
        dto.setShipType(seatsSold.getShipType());
        dto.setUpperDeckPromo(seatsSold.getUpperDeckPromo());
        dto.setUpperDeckEconomy(seatsSold.getUpperDeckEconomy());
        dto.setUpperDeckBusiness(seatsSold.getUpperDeckBusiness());
        dto.setLowerDeckPromo(seatsSold.getLowerDeckPromo());
        dto.setLowerDeckEconomy(seatsSold.getLowerDeckEconomy());
        dto.setLowerDeckBusiness(seatsSold.getLowerDeckBusiness());
        dto.setTotalTicketsSold(seatsSold.getTotalTicketsSold());
        dto.setCreatedAt(seatsSold.getCreatedAt());
        dto.setUpdatedAt(seatsSold.getUpdatedAt());
        return dto;
    }

    // Convert DTO to Entity
    private SeatsSold convertToEntity(SeatsSoldDTO dto) {
        SeatsSold seatsSold = new SeatsSold();
        
        if (dto.getId() != null) {
            seatsSold.setId(dto.getId());
        }
        
        if (dto.getVoyageId() != null) {
            Voyage voyage = voyageRepository.findById(dto.getVoyageId())
                    .orElseThrow(() -> new IllegalArgumentException("Voyage not found with id: " + dto.getVoyageId()));
            seatsSold.setVoyage(voyage);
        }
        
        seatsSold.setShipType(dto.getShipType());
        
        if (dto.getUpperDeckPromo() != null) {
            seatsSold.setUpperDeckPromo(dto.getUpperDeckPromo());
        }
        
        if (dto.getUpperDeckEconomy() != null) {
            seatsSold.setUpperDeckEconomy(dto.getUpperDeckEconomy());
        }
        
        if (dto.getUpperDeckBusiness() != null) {
            seatsSold.setUpperDeckBusiness(dto.getUpperDeckBusiness());
        }
        
        if (dto.getLowerDeckPromo() != null) {
            seatsSold.setLowerDeckPromo(dto.getLowerDeckPromo());
        }
        
        if (dto.getLowerDeckEconomy() != null) {
            seatsSold.setLowerDeckEconomy(dto.getLowerDeckEconomy());
        }
        
        if (dto.getLowerDeckBusiness() != null) {
            seatsSold.setLowerDeckBusiness(dto.getLowerDeckBusiness());
        }
        
        if (dto.getTotalTicketsSold() != null) {
            seatsSold.setTotalTicketsSold(dto.getTotalTicketsSold());
        }
        
        return seatsSold;
    }
}