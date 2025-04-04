package group12.Backend.controller;

import group12.Backend.util.*;

import group12.Backend.dto.ComplaintDTO;
import group12.Backend.entity.Complaint;
import group12.Backend.service.ComplaintService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {
    
    private final ComplaintService complaintService;
    
    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }
    
    @GetMapping
    public ResponseEntity<List<ComplaintDTO>> getAllComplaints(HttpServletRequest httpServletRequest) throws Exception {
        Claims claims = Authentication.getClaims(httpServletRequest);
            if (claims == null)
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
            String role = (String) claims.get("meta_data", HashMap.class).get("role");
            if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
                return ResponseEntity.ok(complaintService.getAllComplaints());

            }
            else{
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
            }
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
            @PathVariable Complaint.ComplaintStatus status, HttpServletRequest httpServletRequest) throws Exception {
                Claims claims = Authentication.getClaims(httpServletRequest);
                if (claims == null)
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
                String role = (String) claims.get("meta_data", HashMap.class).get("role");
                if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
                    return ResponseEntity.ok(complaintService.getComplaintsByStatus(status));
                }
                else{
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
                }
    }
    
    @PostMapping
    public ResponseEntity<ComplaintDTO> createComplaint(
            @RequestBody ComplaintDTO.ComplaintCreateRequest request, HttpServletRequest httpServletRequest) throws Exception {
            Claims claims = Authentication.getClaims(httpServletRequest);
            if (claims == null)
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        return new ResponseEntity<>(complaintService.createComplaint(request), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ComplaintDTO> updateComplaintStatus(
            @PathVariable Integer id, 
            @RequestBody ComplaintDTO.ComplaintUpdateRequest request, HttpServletRequest httpServletRequest) throws Exception {
                Claims claims = Authentication.getClaims(httpServletRequest);
                if (claims == null)
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
                String role = (String) claims.get("meta_data", HashMap.class).get("role");
                if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
                    return ResponseEntity.ok(complaintService.updateComplaintStatus(id, request));

                }
                else{
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
                }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplaint(@PathVariable Integer id, HttpServletRequest httpServletRequest) throws Exception {
        Claims claims = Authentication.getClaims(httpServletRequest);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("manager".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)){
            complaintService.deleteComplaint(id);
            return ResponseEntity.noContent().build();
        }
        else{
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
    }
}