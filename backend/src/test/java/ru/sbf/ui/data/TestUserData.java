package ru.sbf.ui.data;

import org.springframework.stereotype.Component;
import ru.sbf.ui.pages.AuthPage;

import java.util.UUID;

@Component
public class TestUserData {

    public static final AuthPage.TestUser KNOWN_USER = new AuthPage.TestUser(
            "test_user",
            "test@test.com",
            "12345678"
    );

    public AuthPage.TestUser randomUserData() {
        return new AuthPage.TestUser(
                "User_" + UUID.randomUUID().toString().substring(0, 4),
                "mail" + UUID.randomUUID().toString().substring(0, 4) + "@mail.com",
                "pass" + UUID.randomUUID().toString().substring(0, 6)
        );
    }
}