package ru.sbf.api.tests;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.sbf.api.AuthBaseApiTest;
import ru.sbf.api.client.AccountClient;
import ru.sbf.api.client.CategoryClient;
import ru.sbf.api.client.TransactionClient;
import ru.sbf.api.client.TransactionTestData;
import ru.sbf.api.helpers.DataFactory;

import static org.hamcrest.Matchers.*;

public class TransactionApiTest extends AuthBaseApiTest {

    private TransactionClient transactionClient;
    private TransactionTestData data;

    @BeforeEach
    void setupTest() {
        AccountClient accountClient = new AccountClient(authSpec);
        CategoryClient categoryClient = new CategoryClient(authSpec);
        transactionClient = new TransactionClient(authSpec, accountClient, categoryClient);
        data = DataFactory.randomTransactionTestData();
    }

    @Test
    void createTransaction() {
        transactionClient
                .createTransaction(data)
                .then()
                .body("amount", equalTo((float) data.getAmount()))
                .body("comment", equalTo(data.getComment()))
                .body("type", equalTo(data
                        .getCategoryModel()
                        .getType()
                        .toString()))
                .body("account.name", equalTo(data.getAccountName()))
                .body("category.name", equalTo(data
                        .getCategoryModel()
                        .getName()))
                .body("id", notNullValue())
                .body("date", notNullValue())
                .body("createdAt", notNullValue())
                .statusCode(200);
    }

    @Test
    void getTransactions() {
        transactionClient
                .createTransaction(data)
                .then()
                .statusCode(200);

        transactionClient
                .getTransactions()
                .then()
                .body("amount", hasItem((float) data.getAmount()))
                .body("comment", hasItem(data.getComment()))
                .body("type", hasItem(data
                        .getCategoryModel()
                        .getType()
                        .toString()))
                .body("account.name", hasItem(data.getAccountName()))
                .body("category.name", hasItem(data
                        .getCategoryModel()
                        .getName()))
                .statusCode(200);
    }
}
