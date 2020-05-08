import { Injectable, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { TokenStorageService } from "app/_services/token-storage.service";
import { MessageService } from "app/_services/message.service";

interface IMenuItem {
  id: string;
  type: string; // Possible values: link/dropDown/icon/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
}
interface IChildItem {
  id: string;
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;
  sub?: IChildItem[];
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

@Injectable()
export class NavigationService {

  isLoggedIn: boolean;

  constructor(private tokenStorageService: TokenStorageService,
              private messageService: MessageService) {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    // if (this.isLoggedIn) {
    //   const user = this.tokenStorageService.getUser();
    //   let role = user.roles[0];
    //   if(role==='ROLE_PARTNER') {
    //     // this.iconMenu = [];
    //     // this.menuItems = new BehaviorSubject<IMenuItem[]>(this.iconMenu);
    //     // // navigation component has subscribed to this Observable
    //     // this.menuItems$ = this.menuItems.asObservable();
    //   }
    // }
  }

  iconMenu: IMenuItem[] = [
    // {
    //   id: "home",
    //   name: "HOME",
    //   type: "icon",
    //   tooltip: "Home",
    //   icon: "home",
    //   state: "home"
    // },
    // {
    //   id: "shop",
    //   name: "SHOP",
    //   type: "icon",
    //   tooltip: "Shop",
    //   icon: "store",
    //   state: "shop"
    // },
    // {
    //   id: "tour",
    //   name: "TOUR",
    //   type: "icon",
    //   tooltip: "Tour",
    //   icon: "flight_takeoff",
    //   state: "tour"
    // },
    // {
    //   id: "account",
    //   name: "Minha conta",
    //   type: "dropDown",
    //   tooltip: "Pages",
    //   icon: "view_carousel",
    //   state: "sessions",
    //   sub: [
    //     { id:"register", name: "Register", state: "signup2" },
    //     { id:"login", name: "Login", state: "signin2" },
    //   ]
    // },
    // {
    //   id: "information",
    //   name: "Informações",
    //   type: "dropDown",
    //   tooltip: "Pages",
    //   icon: "view_carousel",
    //   state: "others", 
    //   sub: [
    //       { id:"help", name: "Help", state: "blank" },
    //       { id:"about", name: "About", state: "n1" },
    //     ]
    // }
  ];

  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle: string = "Frequently Accessed";
  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.iconMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.
  publishNavigationChange(menuType: string) {
    switch (menuType) {
      case "separator-menu":
        //this.menuItems.next(this.separatorMenu);
        break;
      case "icon-menu":
        this.menuItems.next(this.iconMenu);
        break;
      default:
        //this.menuItems.next(this.plainMenu);
    }
  }
}
