package ru.sbf.ui.pages;

import com.codeborne.selenide.Selenide;

public class LoginPage {

    public LoginPage open() {
        Selenide.open("https://www.saucedemo.com/");
        return this;
    }

    public MainPage login(String username, String password) {
        Selenide.$("#user-name").setValue(username);
        Selenide.$("#password").setValue(password);
        Selenide.$("#login-button").click();
        return new MainPage();
    }
}
