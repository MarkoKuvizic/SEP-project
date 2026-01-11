package domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Car {
    @Id
    private String id;

    private BigDecimal dailyRate;

    private boolean available;
    private BigDecimal weeklyRate;
    private String model;
    private String brand;
    private int yearCreated;
    private String type;
    private String transmission;
    private String fuelType;
    private int seats;
    private int doors;
    private int luggageCapacity;

    private long rating;
    private int reviewCount;

}
