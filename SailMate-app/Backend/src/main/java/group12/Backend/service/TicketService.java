package group12.Backend.service;

import group12.Backend.repository.TicketRepository;
import group12.Backend.repository.BarcodeRetrieveRepository;
import java.sql.Timestamp;

public class TicketService {

    private final TicketRepository ticketRepository;
    private final BarcodeRetrieveRepository barcodeRetrieveRepository;

    public TicketService(TicketRepository ticketRepository, BarcodeRetrieveRepository barcodeRetrieveRepository) {
        this.ticketRepository = ticketRepository;
        this.barcodeRetrieveRepository = barcodeRetrieveRepository;
    }

    public void createTicket(
        String ticketId,
        int voyageId,
        int passengerCount,
        int totalPrice,
        String ticketClass,
        String selectedSeats,
        String userId,
        String ticketDataJson,
        Timestamp createdAt
    ) throws Exception {
        ticketRepository.saveTicket(ticketId, voyageId, passengerCount, totalPrice, ticketClass, selectedSeats, userId, ticketDataJson, createdAt);
    }

    public byte[] getBarcodeImage(String ticketId) throws Exception {
        String ticketInfo = barcodeRetrieveRepository.getTicketDataString(ticketId);
        return BarcodeGeneratorService.generateBarcodeBytes(ticketInfo);
    }
}
