package ru.sbf.api.helpers;

import ru.sbf.api.model.CategoryModel;
import ru.sbf.api.model.RegisterModel;
import ru.sbf.entity.Transaction;

import java.util.UUID;

public class DataFactory {

    public static RegisterModel randomRegisterModel() {
        return RegisterModel
                .builder()
                .name("User_" + UUID.randomUUID().toString().substring(0, 4))
                .email(UUID.randomUUID().toString().substring(0, 4) + "@test.com")
                .password(UUID.randomUUID().toString().substring(0, 12))
                .build();
    }

    public static String randomName() {
        return "name_" + UUID.randomUUID().toString().substring(0, 5);
    }

    public static CategoryModel randomExpenseCategoryModel() {
        return CategoryModel
                .builder()
                .name("category_" + UUID.randomUUID().toString().substring(0, 4))
                .type(Transaction.TransactionType.EXPENSE)
                .build();
    }

    public static CategoryModel randomIncomeCategoryModel() {
        return CategoryModel
                .builder()
                .name("category_" + UUID.randomUUID().toString().substring(0, 4))
                .type(Transaction.TransactionType.INCOME)
                .build();
    }
}
