package ru.sbf.api.client;

import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import lombok.RequiredArgsConstructor;
import ru.sbf.api.model.LoginModel;
import ru.sbf.api.model.RegisterModel;

import static io.restassured.RestAssured.given;

@RequiredArgsConstructor
public class AuthClient {

    private final RequestSpecification requestSpec;

    public Response register(RegisterModel body) {
        return given().spec(requestSpec)
                .body(body)
                .when().post("/auth/register")
                .then()
                .extract().response();
    }

    public Response login(LoginModel body) {
        return given().spec(requestSpec)
                .body(body)
                .when().post("/auth/login")
                .then()
                .extract().response();
    }
}