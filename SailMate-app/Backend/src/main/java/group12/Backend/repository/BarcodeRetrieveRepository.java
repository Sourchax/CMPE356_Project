package group12.Backend.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class BarcodeRetrieveRepository {

    private final Connection connection;

    public BarcodeRetrieveRepository(Connection connection) {
        this.connection = connection;
    }

    public byte[] getBarcodeImage(String ticketCode) throws Exception {
        String sql = "SELECT barcode_image FROM tickets WHERE TicketID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, ticketCode);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getBytes("barcode_image");
            } else {
                throw new Exception("Ticket not found: " + ticketCode);
            }
        }
    }
}
