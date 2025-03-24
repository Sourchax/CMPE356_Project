package group12.Backend.controller;

import group12.Backend.dto.VoyageTemplateDTO;
import group12.Backend.service.VoyageTemplateService;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/voyage-templates")
@CrossOrigin(origins = "*")
public class VoyageTemplateController {

    @Autowired
    private VoyageTemplateService templateService;
    
    // Get all templates
    @GetMapping
    public ResponseEntity<List<VoyageTemplateDTO>> getAllTemplates() {
        return ResponseEntity.ok(templateService.getAllTemplates());
    }
    
    // Get all active templates
    @GetMapping("/active")
    public ResponseEntity<List<VoyageTemplateDTO>> getAllActiveTemplates() {
        return ResponseEntity.ok(templateService.getAllActiveTemplates());
    }
    
    // Get template by ID
    @GetMapping("/{id}")
    public ResponseEntity<VoyageTemplateDTO> getTemplateById(@PathVariable Integer id) {
        VoyageTemplateDTO template = templateService.getTemplateById(id);
        
        if (template != null) {
            return ResponseEntity.ok(template);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Find templates by route
    @GetMapping("/search")
    public ResponseEntity<List<VoyageTemplateDTO>> findTemplatesByRoute(
            @RequestParam Integer fromStationId,
            @RequestParam Integer toStationId) {
            
        return ResponseEntity.ok(templateService.findTemplatesByRoute(fromStationId, toStationId));
    }
    
    // Create a new template
    @PostMapping
    public ResponseEntity<VoyageTemplateDTO> createTemplate(@RequestBody VoyageTemplateDTO templateDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(templateService.createTemplate(templateDTO));
    }
    
    // Update a template
    @PutMapping("/{id}")
    public ResponseEntity<VoyageTemplateDTO> updateTemplate(
            @PathVariable Integer id, 
            @RequestBody VoyageTemplateDTO templateDTO) {
            
        VoyageTemplateDTO updatedTemplate = templateService.updateTemplate(id, templateDTO);
        
        if (updatedTemplate != null) {
            return ResponseEntity.ok(updatedTemplate);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Update a template and apply changes to future voyages
    @PutMapping("/{id}/update-future")
    public ResponseEntity<Map<String, Object>> updateTemplateAndFutureVoyages(
            @PathVariable Integer id,
            @RequestBody VoyageTemplateDTO templateDTO,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
            
        VoyageTemplateDTO updatedTemplate = templateService.updateTemplateAndFutureVoyages(id, templateDTO, startDate);
        Map<String, Object> response = new HashMap<>();
        
        if (updatedTemplate != null) {
            response.put("success", true);
            response.put("template", updatedTemplate);
            response.put("message", "Template and future voyages updated successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Template not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    
    // Deactivate a template
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Map<String, Object>> deactivateTemplate(@PathVariable Integer id) {
        boolean success = templateService.deactivateTemplate(id);
        Map<String, Object> response = new HashMap<>();
        
        if (success) {
            response.put("success", true);
            response.put("message", "Template deactivated successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Template not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    
    // Cancel all future voyages for a template
    @PutMapping("/{id}/cancel-future")
    public ResponseEntity<Map<String, Object>> cancelFutureVoyages(
            @PathVariable Integer id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
            
        boolean success = templateService.cancelFutureVoyagesForTemplate(id, startDate);
        Map<String, Object> response = new HashMap<>();
        
        if (success) {
            response.put("success", true);
            response.put("message", "Future voyages cancelled successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Template not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    
    // Delete unmodified voyages for a template
    @DeleteMapping("/{id}/unmodified-voyages")
    public ResponseEntity<Map<String, Object>> deleteUnmodifiedVoyages(
            @PathVariable Integer id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
            
        int deletedCount = templateService.deleteUnmodifiedVoyagesForTemplate(id, startDate);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("deletedCount", deletedCount);
        response.put("message", deletedCount + " unmodified voyages deleted successfully");
        
        return ResponseEntity.ok(response);
    }
    
    // Regenerate voyages for a template
    @PostMapping("/{id}/regenerate")
    public ResponseEntity<Map<String, Object>> regenerateVoyages(
            @PathVariable Integer id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
            
        int generatedCount = templateService.regenerateVoyagesForTemplate(id, startDate, endDate);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("generatedCount", generatedCount);
        response.put("message", generatedCount + " voyages regenerated successfully");
        
        return ResponseEntity.ok(response);
    }
    
    // Count voyages for a template
    @GetMapping("/{id}/count-voyages")
    public ResponseEntity<Map<String, Object>> countVoyages(@PathVariable Integer id) {
        long count = templateService.countVoyagesByTemplate(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("templateId", id);
        response.put("voyageCount", count);
        
        return ResponseEntity.ok(response);
    }
}