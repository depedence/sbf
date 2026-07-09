package ru.sbf.api.tests;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.sbf.api.AuthBaseApiTest;
import ru.sbf.api.client.AccountClient;
import ru.sbf.api.helpers.DataFactory;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;

public class AccountApiTest extends AuthBaseApiTest {

    private AccountClient accountClient;
    private String name;

    @BeforeEach
    void setupTest() {
        accountClient = new AccountClient(authSpec);
        name = DataFactory.randomName();
    }

    @Test
    void createAccount__success() {
        accountClient.createAccount(name)
                .then()
                .body("id", notNullValue())
                .body("user", notNullValue())
                .body("name", equalTo(name))
                .body("balance", equalTo(0.0f))
                .body("createdAt", notNullValue())
                .statusCode(200);
    }

    @Test
    void createAccount_withEmptyBody__return400() {
        accountClient.createAccountWithEmptyBody()
                .then()
                .body("message", equalTo("Bad Request"))
                .statusCode(400);
    }

    @Test
    void deleteAccount__success() {
        Long id = accountClient.createAccount(name)
                .then()
                .extract().response()
                .jsonPath().getLong("id");

        accountClient.deleteAccount(id)
                .then()
                .body("message", equalTo("Account successfully deleted"))
                .statusCode(200);
    }

    @Test
    void deleteAccount_notFound__return404() {
        accountClient.deleteAccount(100L)
                .then()
                .body("message", equalTo("Account not found"))
                .statusCode(404);
    }
}