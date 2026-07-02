package ru.sbf.api.tests;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.sbf.api.BaseApiTest;
import ru.sbf.api.DataFactory;
import ru.sbf.api.client.AuthClient;
import ru.sbf.api.model.LoginModel;
import ru.sbf.api.model.RegisterModel;

@Slf4j
public class AuthApiTest extends BaseApiTest {

    private AuthClient authClient;
    private RegisterModel registerModel;

    @BeforeEach
    void setupTest() {
        authClient = new AuthClient(requestSpec);
        registerModel = DataFactory.randomRegisterModel();
    }

    @Test
    void register_success() {
        authClient.register(registerModel)
                .then()
                .statusCode(200);
    }

    @Test
    void login_success() {
        registerBeforeTest();

        LoginModel loginModel = new LoginModel();
        loginModel.setEmail(registerModel.getEmail());
        loginModel.setPassword(registerModel.getPassword());

        authClient.login(loginModel)
                .then()
                .statusCode(200);
    }

    private void registerBeforeTest() {
        authClient.register(registerModel)
                .then()
                .statusCode(200);
    }
}