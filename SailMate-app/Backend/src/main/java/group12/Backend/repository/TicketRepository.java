package group12.Backend.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Timestamp;

public class TicketRepository {

    private final Connection connection;

    public TicketRepository(Connection connection) {
        this.connection = connection;
    }

    public void saveTicketWithBarcode(String ticketCode, String purchaserName, int voyageId,
                                      int totalPrice, Timestamp departureTime, byte[] barcodeImage) throws Exception {
        String sql = "INSERT INTO tickets (TicketID, voyage_id, total_price, purchaser_name, barcode_image) " +
                     "VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, ticketCode);
            stmt.setInt(2, voyageId);
            stmt.setInt(3, totalPrice);
            stmt.setString(4, purchaserName);
            stmt.setBytes(5, barcodeImage);
            stmt.executeUpdate();
        }
    }
}
