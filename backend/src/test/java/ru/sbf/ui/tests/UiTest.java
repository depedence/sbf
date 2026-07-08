package ru.sbf.ui.tests;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import ru.sbf.ui.BaseUiTest;
import ru.sbf.ui.pages.LoginPage;
import ru.sbf.ui.pages.MainPage;

public class UiTest extends BaseUiTest {
        @Test
        void testE2e() {
                String username = "standard_user";
                String password = "secret_sauce";
                String firstName = "sstandard";
                String lastName = "user";
                String postalCode = "123456";

                double sum = new LoginPage()
                                .open()
                                .login(username, password)
                                .addMinAndMaxProduct();

                double totalPrice = new MainPage()
                                .chechCart()
                                .goToOrder(firstName, lastName, postalCode)
                                .checkTotalPrice();

                assertEquals(sum, totalPrice);

                new MainPage()
                                .finishOrder();
        }
}
