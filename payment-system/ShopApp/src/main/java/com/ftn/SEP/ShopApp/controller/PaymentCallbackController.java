package com.ftn.SEP.ShopApp.controller;
import com.ftn.SEP.ShopApp.service.OrderService;
import domain.OrderStatus;
import dto.CallbackRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment/callback")
public class PaymentCallbackController {

    @Autowired
    OrderService orderService;

    @PostMapping("/success")
    public void successCallback(@RequestBody CallbackRequest request) {
        // SUCCESS
        orderService.updateOrderStatus(request.getMerchantOrderId(), OrderStatus.PAID);
        System.out.println("SHOP PAYMENT SUCCESS");
    }

    @PostMapping("/failure")
    public void failCallback(@RequestBody CallbackRequest request) {
        // FAILED
//        orderService.updateOrderStatus(request.getMerchantOrderId(), OrderStatus.PAYMENT_FAILED);
        System.out.println("SHOP PAYMENT FAILURE");
    }

    @PostMapping("/error")
    public void errorCallback(@RequestBody CallbackRequest request) {
        // ERROR
//        orderService.updateOrderStatus(request.getMerchantOrderId(), OrderStatus.ERROR);
        System.out.println("SHOP PAYMENT ERROR");
    }
}
