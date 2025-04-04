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

    public void createTicketWithBarcode(String ticketCode, String purchaserName, int voyageId, int totalPrice, Timestamp departureTime) throws Exception {
        String ticketInfo = String.format(
            "TicketID: %s\nName: %s\nVoyageID: %d\nPrice: %d\nDeparture: %s",
            ticketCode, purchaserName, voyageId, totalPrice, departureTime.toString()
        );

        // ✅ Use ticketInfo here
        byte[] barcode = BarcodeGeneratorService.generateBarcodeBytes(ticketInfo);
        ticketRepository.saveTicketWithBarcode(ticketCode, purchaserName, voyageId, totalPrice, departureTime, barcode);
    }

    public byte[] getBarcodeImage(String ticketCode) throws Exception {
        String ticketInfo = barcodeRetrieveRepository.getTicketDataString(ticketCode);
        return BarcodeGeneratorService.generateBarcodeBytes(ticketInfo);
    }
}
