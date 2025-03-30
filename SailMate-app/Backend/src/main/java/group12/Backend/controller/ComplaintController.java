package group12.Backend.controller;

import group12.Backend.dto.ComplaintDTO;
import group12.Backend.entity.Complaint;
import group12.Backend.service.ComplaintService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {
    
    private final ComplaintService complaintService;
    
    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }
    
    @GetMapping
    public ResponseEntity<List<ComplaintDTO>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ComplaintDTO> getComplaintById(@PathVariable Integer id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ComplaintDTO>> getComplaintsByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(complaintService.getComplaintsByUserId(userId));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ComplaintDTO>> getComplaintsByStatus(
            @PathVariable Complaint.ComplaintStatus status) {
        return ResponseEntity.ok(complaintService.getComplaintsByStatus(status));
    }
    
    @PostMapping
    public ResponseEntity<ComplaintDTO> createComplaint(
            @RequestBody ComplaintDTO.ComplaintCreateRequest request) {
        return new ResponseEntity<>(complaintService.createComplaint(request), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ComplaintDTO> updateComplaintStatus(
            @PathVariable Integer id, 
            @RequestBody ComplaintDTO.ComplaintUpdateRequest request) {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplaint(@PathVariable Integer id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.noContent().build();
    }
}