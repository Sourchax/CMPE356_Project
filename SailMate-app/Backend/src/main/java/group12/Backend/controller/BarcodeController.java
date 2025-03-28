package group12.Backend.controller;

import group12.Backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/barcode")
public class BarcodeController {

    private final TicketService ticketService;

    @Autowired
    public BarcodeController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/{ticketCode}")
    public ResponseEntity<byte[]> getBarcode(@PathVariable String ticketCode) {
        try {
            byte[] barcodeImage = ticketService.getBarcodeImage(ticketCode);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(barcodeImage);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
