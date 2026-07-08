package ru.sbf.api.tests;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.sbf.api.AuthBaseApiTest;
import ru.sbf.api.client.CategoryClient;

public class CategoryApiTest extends AuthBaseApiTest {

    private CategoryClient categoryClient;

    @BeforeEach
    void setupTest() {
        categoryClient = new CategoryClient(authSpec);
    }

    // @Test
    // void createCategory__success() {
    // categoryClient.createCategory()
    // }
}
