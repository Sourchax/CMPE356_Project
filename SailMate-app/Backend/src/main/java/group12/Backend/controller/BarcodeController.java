@GetMapping("/api/barcode/{ticketCode}")
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
