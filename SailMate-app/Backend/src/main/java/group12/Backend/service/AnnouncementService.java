package group12.Backend.service;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import group12.Backend.dto.AnnouncementDTO;
import group12.Backend.entity.Announcement;
import group12.Backend.repository.AnnouncementRepository;

@Service
public class AnnouncementService {
    
    @Autowired
    private AnnouncementRepository announcementRepository;
    
    // Convert Entity to DTO
    private AnnouncementDTO convertToDTO(Announcement announcement) {
        AnnouncementDTO dto = new AnnouncementDTO();
        dto.setId(announcement.getId());
        dto.setImageBase64(Base64.getEncoder().encodeToString(announcement.getImage()));
        dto.setTitle(announcement.getTitle());
        dto.setDescription(announcement.getDescription());
        dto.setDetails(announcement.getDetails());
        return dto;
    }
    
    // Convert DTO to Entity
    private Announcement convertToEntity(AnnouncementDTO dto) {
        Announcement announcement = new Announcement();
        if (dto.getId() != null) {
            announcement.setId(dto.getId());
        }
        
        if (dto.getImageBase64() != null && !dto.getImageBase64().isEmpty()) {
            announcement.setImage(Base64.getDecoder().decode(dto.getImageBase64()));
        }
        
        announcement.setTitle(dto.getTitle());
        announcement.setDescription(dto.getDescription());
        announcement.setDetails(dto.getDetails());
        
        return announcement;
    }
    
    // Get all announcements
    public List<AnnouncementDTO> getAllAnnouncements() {
        return announcementRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get announcement by ID
    public AnnouncementDTO getAnnouncementById(Integer id) {
        return announcementRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }
    
    // Create new announcement
    @Transactional
    public AnnouncementDTO createAnnouncement(AnnouncementDTO announcementDTO) {
        Announcement announcement = convertToEntity(announcementDTO);
        announcement = announcementRepository.save(announcement);
        return convertToDTO(announcement);
    }
    
    // Update announcement
    @Transactional
    public AnnouncementDTO updateAnnouncement(Integer id, AnnouncementDTO announcementDTO) {
        return announcementRepository.findById(id)
                .map(existing -> {
                    // Convert and update fields
                    Announcement updated = convertToEntity(announcementDTO);
                    updated.setId(id);
                    
                    // Save and return
                    return convertToDTO(announcementRepository.save(updated));
                })
                .orElse(null);
    }
    
    // Delete announcement
    @Transactional
    public boolean deleteAnnouncement(Integer id) {
        if (announcementRepository.existsById(id)) {
            announcementRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // Search announcements by title
    public List<AnnouncementDTO> searchAnnouncementsByTitle(String title) {
        return announcementRepository.findByTitleContainingIgnoreCase(title).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get count of all announcements
    public long getAnnouncementCount() {
        return announcementRepository.count();
    }
}