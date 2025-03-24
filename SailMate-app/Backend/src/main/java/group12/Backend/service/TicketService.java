package group12.Backend.service;

import group12.Backend.repository.TicketRepository;

import java.sql.Timestamp;

public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public void createTicketWithBarcode(String ticketCode, String purchaserName, int voyageId, int totalPrice, Timestamp departureTime) throws Exception {
        byte[] barcode = BarcodeGeneratorService.generateBarcodeBytes(ticketCode);
        ticketRepository.saveTicketWithBarcode(ticketCode, purchaserName, voyageId, totalPrice, departureTime, barcode);
    }
}
