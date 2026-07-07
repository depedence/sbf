package ru.sbf.api.client;

import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import lombok.RequiredArgsConstructor;

import static io.restassured.RestAssured.given;

@RequiredArgsConstructor
public class AccountClient {

    private final RequestSpecification requestSpec;

    public Response createAccount(String name) {
        return given().spec(requestSpec)
                .body(name)
                .when().post("/account")
                .then()
                .extract().response();
    }

    public Response createAccountWithEmptyBody() {
        return given().spec(requestSpec)
                .when().post("/account")
                .then()
                .extract().response();
    }

    public Response deleteAccount(Long id) {
        return given().spec(requestSpec)
                .when().delete("/account/{id}", id)
                .then()
                .extract().response();
    }
}