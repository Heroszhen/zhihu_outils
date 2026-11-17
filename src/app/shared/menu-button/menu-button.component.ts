import { Component, OnInit } from "@angular/core";
import { IonicModule } from "@ionic/angular/lazy";

@Component({
  selector: "app-menu-button",
  templateUrl: "./menu-button.component.html",
  styleUrls: ["./menu-button.component.scss"],
  standalone: true,
  imports: [IonicModule],
})
export class MenuButtonComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
