package dto;


import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CardPaymentResponse {

    private boolean success;
    private String message;
    private String redirectUrl;
}