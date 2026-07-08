package ru.sbf.api.client;

import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import lombok.RequiredArgsConstructor;
import ru.sbf.api.model.CategoryModel;

import static io.restassured.RestAssured.given;

@RequiredArgsConstructor
public class CategoryClient {

    private final RequestSpecification requestSpec;

    public Response createCategory(CategoryModel body) {
        return given().spec(requestSpec)
                .body(body)
                .when().post("/category")
                .then()
                .extract().response();
    }
}