package ru.sbf.api.client;

import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import lombok.RequiredArgsConstructor;
import ru.sbf.api.model.TransactionModel;

import java.time.LocalDateTime;

import static io.restassured.RestAssured.given;

@RequiredArgsConstructor
public class TransactionClient {

    private final RequestSpecification requestSpec;
    private final AccountClient accountClient;
    private final CategoryClient categoryClient;

    public Response createTransaction(TransactionTestData data) {
        Response accountRes = accountClient.createAccount(data.getAccountName());
        Response categoryRes = categoryClient.createCategory(data.getCategoryModel());

        TransactionModel transactionModel = new TransactionModel();
        transactionModel.setAccountId(accountRes
                .jsonPath()
                .getLong("id"));
        transactionModel.setCategoryId(categoryRes
                .jsonPath()
                .getLong("id"));
        transactionModel.setAmount(data.getAmount());
        transactionModel.setComment(data.getComment());
        transactionModel.setDate(LocalDateTime.now());

        return given()
                .spec(requestSpec)
                .body(transactionModel)
                .when()
                .post("/transaction")
                .then()
                .extract()
                .response();
    }

    public Response getTransactions() {
        return given()
                .spec(requestSpec)
                .when()
                .get("/transaction")
                .then()
                .extract()
                .response();
    }
}
