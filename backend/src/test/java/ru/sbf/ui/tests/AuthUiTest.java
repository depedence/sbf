package ru.sbf.ui.tests;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import ru.sbf.ui.BaseUiTest;
import ru.sbf.ui.data.TestUserData;
import ru.sbf.ui.pages.AuthPage;

public class AuthUiTest extends BaseUiTest {

    @Autowired
    private TestUserData testUserData;

    @Test
    void register_success() {
        AuthPage.TestUser user = testUserData.randomUserData();

        new AuthPage()
                .openRegister()
                .fillInputs(user, true)
                .login()
                .checkUrl();
    }

    @Test
    void login_success() {
        new AuthPage()
                .openLogin()
                .fillInputs(TestUserData.KNOWN_USER, false)
                .login()
                .checkUrl();
    }
}
