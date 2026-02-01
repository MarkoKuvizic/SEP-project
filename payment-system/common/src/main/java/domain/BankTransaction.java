package domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
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
public class BankTransaction {

    private String paymentId;
    private String stan;
    private BigDecimal amount;
    private String currency;
    private BankTransactionStatus status;
    private boolean used;
    @Id
    @GeneratedValue
    private Long id;

}
