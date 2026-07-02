package ru.sbf.api;

import ru.sbf.api.model.RegisterModel;

import java.util.UUID;

public class DataFactory {

    public static RegisterModel randomRegisterModel() {
        return RegisterModel.builder()
                .name("User_" + UUID.randomUUID().toString().substring(0, 4))
                .email(UUID.randomUUID().toString().substring(0, 4) + "@test.com")
                .password(UUID.randomUUID().toString().substring(0, 12))
                .build();
    }
}