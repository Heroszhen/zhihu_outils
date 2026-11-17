import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular/lazy";

import { LoginPageRoutingModule } from "./login-routing.module";

import { LoginPage } from "./login.page";

import { MenuButtonComponent } from "../../shared/menu-button/menu-button.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, LoginPageRoutingModule, MenuButtonComponent],
  declarations: [LoginPage],
})
export class LoginPageModule {}
