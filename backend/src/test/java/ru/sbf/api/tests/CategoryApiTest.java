package ru.sbf.api.tests;

import io.restassured.response.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.sbf.api.AuthBaseApiTest;
import ru.sbf.api.client.CategoryClient;
import ru.sbf.api.helpers.DataFactory;
import ru.sbf.api.model.CategoryModel;

import static org.hamcrest.Matchers.*;

public class CategoryApiTest extends AuthBaseApiTest {

    private CategoryClient categoryClient;
    private CategoryModel categoryIncomeModel;
    private CategoryModel categoryExpenseModel;

    @BeforeEach
    void setupTest() {
        categoryClient = new CategoryClient(authSpec);
        categoryIncomeModel = DataFactory.randomIncomeCategoryModel();
        categoryExpenseModel = DataFactory.randomExpenseCategoryModel();
    }

    @Test
    void createIncomeCategory__success() {
        categoryClient
                .createCategory(categoryIncomeModel)
                .then()
                .body("id", notNullValue())
                .body("user", notNullValue())
                .body("name", equalTo(categoryIncomeModel.getName()))
                .body("type", equalTo("INCOME"))
                .body("createdAt", notNullValue())
                .statusCode(200);
    }

    @Test
    void createExpenseCategory__success() {
        categoryClient
                .createCategory(categoryExpenseModel)
                .then()
                .body("id", notNullValue())
                .body("user", notNullValue())
                .body("name", equalTo(categoryExpenseModel.getName()))
                .body("type", equalTo("EXPENSE"))
                .body("createdAt", notNullValue())
                .statusCode(200);
    }

    @Test
    void getAllCategories__success() {
        categoryClient.createCategory(categoryIncomeModel);
        categoryClient.createCategory(categoryExpenseModel);

        categoryClient
                .getCategories()
                .then()
                .body("size()", equalTo(2))
                .body("name", hasItems(categoryIncomeModel.getName(), categoryExpenseModel.getName()))
                .body("type", hasItems("INCOME", "EXPENSE"))
                .statusCode(200);
    }

    @Test
    void deleteCategory__success() {
        Response response = categoryClient.createCategory(categoryIncomeModel);

        categoryClient
                .deleteCategory(response
                        .jsonPath()
                        .getLong("id"))
                .then()
                .body("message", equalTo("Category successfully deleted"))
                .statusCode(200);
    }
}
