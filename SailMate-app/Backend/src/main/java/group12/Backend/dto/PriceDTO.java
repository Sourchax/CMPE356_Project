package group12.Backend.dto;

public class PriceDTO {
    
    private Integer id;
    private String className;
    private Double value;
    
    // Constructors
    public PriceDTO() {
    }
    
    public PriceDTO(Integer id, String className, Double value) {
        this.id = id;
        this.className = className;
        this.value = value;
    }
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public String getClassName() {
        return className;
    }
    
    public void setClassName(String className) {
        this.className = className;
    }
    
    public Double getValue() {
        return value;
    }
    
    public void setValue(Double value) {
        this.value = value;
    }
}