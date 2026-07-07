package ru.sbf.api;

import io.restassured.builder.RequestSpecBuilder;
import io.restassured.response.Response;
import org.junit.jupiter.api.BeforeEach;
import ru.sbf.api.client.AuthClient;
import ru.sbf.api.helpers.DataFactory;
import ru.sbf.api.model.LoginModel;
import ru.sbf.api.model.RegisterModel;

public abstract class AuthBaseApiTest extends BaseApiTest {

    protected AuthClient authClient;
    protected RegisterModel registerModel;
    protected LoginModel loginModel;

    @BeforeEach
    void setupAuthRestAssured() {
        dataBaseCleaner.cleanDb();

        authClient = new AuthClient(requestSpec);
        registerModel = DataFactory.randomRegisterModel();
        loginModel = new LoginModel();
        loginModel.setEmail(registerModel.getEmail());
        loginModel.setPassword(registerModel.getPassword());

        authClient.register(registerModel);
        Response response = authClient.login(loginModel);
        String token = response.jsonPath().getString("token");

        authSpec = new RequestSpecBuilder()
                .addRequestSpecification(requestSpec)
                .addHeader("Authorization", "Bearer " + token)
                .build();
    }
}