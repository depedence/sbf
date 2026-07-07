package ru.sbf.ui.pages;

import com.codeborne.selenide.Selenide;

public class AuthPage {

    public record TestUser(String name, String email, String password) {}

    public AuthPage openRegister() {
        Selenide.open("/register");
        return this;
    }

    public AuthPage openLogin() {
        Selenide.open("/login");
        return this;
    }

    public AuthPage fillInputs(TestUser user, boolean register) {
        if (register) {
            Selenide.$("#name").setValue(user.name);
            Selenide.$("#confirmPassword").setValue(user.password);
        }
        
        Selenide.$("#email").setValue(user.email);
        Selenide.$("#password").setValue(user.password);
        return this;
    }

    public MainPage login() {
        Selenide.$(".btn-primary").click();
        return new MainPage();
    }
}