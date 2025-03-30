package group12.Backend.service;

import group12.Backend.dto.ComplaintDTO;
import group12.Backend.entity.Complaint;
import group12.Backend.repository.ComplaintRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintService {
    
    private final ComplaintRepository complaintRepository;
    
    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }
    
    public List<ComplaintDTO> getAllComplaints() {
        return complaintRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ComplaintDTO getComplaintById(Integer id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Complaint not found with id: " + id));
        return convertToDTO(complaint);
    }
    
    public List<ComplaintDTO> getComplaintsByUserId(String userId) {
        return complaintRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ComplaintDTO> getComplaintsByStatus(Complaint.ComplaintStatus status) {
        return complaintRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ComplaintDTO createComplaint(ComplaintDTO.ComplaintCreateRequest request) {
        Complaint complaint = new Complaint();
        complaint.setUserId(request.getUserId());
        complaint.setSender(request.getSender());
        complaint.setEmail(request.getEmail());
        complaint.setSubject(request.getSubject());
        complaint.setMessage(request.getMessage());
        complaint.setStatus(Complaint.ComplaintStatus.active);
        
        Complaint savedComplaint = complaintRepository.save(complaint);
        return convertToDTO(savedComplaint);
    }
    
    @Transactional
    public ComplaintDTO updateComplaintStatus(Integer id, ComplaintDTO.ComplaintUpdateRequest request) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Complaint not found with id: " + id));
        
        if (request.getStatus() != null) {
            complaint.setStatus(request.getStatus());
        }
        
        if (request.getReply() != null) {
            complaint.setReply(request.getReply());
        }
        
        Complaint updatedComplaint = complaintRepository.save(complaint);
        return convertToDTO(updatedComplaint);
    }
    
    @Transactional
    public void deleteComplaint(Integer id) {
        if (!complaintRepository.existsById(id)) {
            throw new EntityNotFoundException("Complaint not found with id: " + id);
        }
        complaintRepository.deleteById(id);
    }
    
    private ComplaintDTO convertToDTO(Complaint complaint) {
        ComplaintDTO dto = new ComplaintDTO();
        dto.setId(complaint.getId());
        dto.setUserId(complaint.getUserId());
        dto.setSender(complaint.getSender());
        dto.setEmail(complaint.getEmail());
        dto.setSubject(complaint.getSubject());
        dto.setMessage(complaint.getMessage());
        dto.setReply(complaint.getReply());
        dto.setStatus(complaint.getStatus());
        dto.setCreatedAt(complaint.getCreatedAt());
        dto.setUpdatedAt(complaint.getUpdatedAt());
        return dto;
    }
}