package group12.Backend.controller;

import group12.Backend.dto.SeatsSoldDTO;
import group12.Backend.dto.VoyageDTO;
import group12.Backend.service.SeatsSoldService;
import group12.Backend.util.Authentication;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import group12.Backend.util.seatsOperations;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/seats-sold")
@CrossOrigin(origins = "*")
public class SeatsSoldController {

    private final SeatsSoldService seatsSoldService;

    @Autowired
    public SeatsSoldController(SeatsSoldService seatsSoldService) {
        this.seatsSoldService = seatsSoldService;
    }

    @GetMapping
    public ResponseEntity<List<SeatsSoldDTO>> getAllSeatsSold() {
        return ResponseEntity.ok(seatsSoldService.getAllSeatsSold());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeatsSoldDTO> getSeatsSoldById(@PathVariable Integer id) {
        return seatsSoldService.getSeatsSoldById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/voyage/{voyageId}")
    public ResponseEntity<SeatsSoldDTO> getSeatsSoldByVoyageId(@PathVariable Integer voyageId) {
        return seatsSoldService.getSeatsSoldByVoyageId(voyageId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/calculate-seats-with-voyage")
    public ResponseEntity<List<Map<String, Object>>> calculateSeatsWithVoyage(@RequestBody Map<String, List<VoyageDTO>> requestBody) {
        List<VoyageDTO> voyages = requestBody.get("voyages");
        
        if (voyages == null || voyages.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
    
        List<Map<String, Object>> seatInformationList = new ArrayList<>();
        
        for (VoyageDTO voyage : voyages) {
            // Fetch seats sold for each voyage
            Optional<SeatsSoldDTO> seatsSoldOptional = seatsSoldService.getSeatsSoldByVoyageId(voyage.getId());
            
            if (seatsSoldOptional.isPresent()) {
                // Convert SeatsSoldDTO to Map and decode
                Map<String, Object> seatsSoldMap = convertSeatsSoldToMap(seatsSoldOptional.get());
                Map<String, Object> decodedSeatsInfo = seatsOperations.decode(seatsSoldMap);
                seatInformationList.add(decodedSeatsInfo);
            }
        }
    
        return ResponseEntity.ok(seatInformationList);
    }
    
    // Helper method to convert SeatsSoldDTO to Map
    private Map<String, Object> convertSeatsSoldToMap(SeatsSoldDTO seatsSold) {
        Map<String, Object> seatsSoldMap = new HashMap<>();
        seatsSoldMap.put("id", seatsSold.getId());
        seatsSoldMap.put("voyageId", seatsSold.getVoyageId());
        seatsSoldMap.put("shipType", seatsSold.getShipType());
        seatsSoldMap.put("upperDeckPromo", seatsSold.getUpperDeckPromo());
        seatsSoldMap.put("upperDeckEconomy", seatsSold.getUpperDeckEconomy());
        seatsSoldMap.put("upperDeckBusiness", seatsSold.getUpperDeckBusiness());
        seatsSoldMap.put("lowerDeckPromo", seatsSold.getLowerDeckPromo());
        seatsSoldMap.put("lowerDeckEconomy", seatsSold.getLowerDeckEconomy());
        seatsSoldMap.put("lowerDeckBusiness", seatsSold.getLowerDeckBusiness());
        
        return seatsSoldMap;
    }
    
    // Helper method to create an empty seat list
    private List<Boolean> createEmptySeatList(int size) {
        List<Boolean> emptySeats = new ArrayList<>(size);
        for (int i = 0; i < size; i++) {
            emptySeats.add(false);
        }
        return emptySeats;
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteSeatsSold(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String auth) throws Exception {
        
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)) {
            Map<String, Object> response = new HashMap<>();
            boolean deleted = seatsSoldService.deleteSeatsSold(id);
            
            if (deleted) {
                response.put("success", true);
                response.put("message", "Seats sold record deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Seats sold record not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authorized");
        }
    }

    @PostMapping("/initialize/{voyageId}")
    public ResponseEntity<SeatsSoldDTO> initializeForVoyage(
            @PathVariable Integer voyageId,
            @RequestHeader("Authorization") String auth) throws Exception {
        
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)) {
            SeatsSoldDTO initialized = seatsSoldService.initializeForVoyage(voyageId);
            return ResponseEntity.status(HttpStatus.CREATED).body(initialized);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authorized");
        }
    }

    @PostMapping("/ticket-cancelled")
    public ResponseEntity<Map<String, Object>> ticketCancelled(
            @RequestParam String ticketData,
            @RequestParam Integer voyageId,
            @RequestHeader("Authorization") String auth) throws Exception {
        
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
        if ("admin".equalsIgnoreCase(role) || "super".equalsIgnoreCase(role)) {

            seatsSoldService.updateSeatCounts(voyageId, ticketData, false);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Seat counts updated successfully");
            return ResponseEntity.ok(response);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authorized");
        }
    }

    @PostMapping("/ticket-created")
    public ResponseEntity<Map<String, Object>> ticketCreated(
        @RequestParam String ticketData,
        @RequestParam Integer voyageId,
            @RequestHeader("Authorization") String auth) throws Exception {
        
        Claims claims = Authentication.getClaims(auth);
        if (claims == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        
        String role = (String) claims.get("meta_data", HashMap.class).get("role");
            seatsSoldService.updateSeatCounts(voyageId, ticketData, true);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Seat counts updated successfully");
            return ResponseEntity.ok(response);
    }

    @PostMapping("/calculate-seats")
    public ResponseEntity<List<Map<String, Object>>> calculateSeats(@RequestBody List<Object> seatsSoldList){
        System.out.println("Initial in controller: " + seatsSoldList);
        List<Map<String, Object>> decodedSeatsList = new ArrayList<>();
        for (Object seatsSold : seatsSoldList) {
            decodedSeatsList.add(seatsOperations.decode(seatsSold));
        }
        return ResponseEntity.ok(decodedSeatsList);
    }
}