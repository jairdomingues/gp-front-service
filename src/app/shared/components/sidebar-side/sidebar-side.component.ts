import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { ThemeService } from "../../services/theme.service";
import { Subscription } from "rxjs";
import { ILayoutConf, LayoutService } from "app/shared/services/layout.service";
import { SigninService } from "app/service/signin/signin.service";
import { TokenStorageService } from "app/_services/token-storage.service";
import { MessageService } from "app/_services/message.service";

@Component({
  selector: "app-sidebar-side",
  templateUrl: "./sidebar-side.component.html"
})
export class SidebarSideComponent implements OnInit, OnDestroy, AfterViewInit {
  public menuItems: any[];
  public hasIconTypeMenuItem: boolean;
  public iconTypeMenuTitle: string;
  private menuItemsSub: Subscription;
  public layoutConf: ILayoutConf;
  public username: string;                                   
  public isLoggedIn: boolean;
  messages: any[] = [];
  subscription: Subscription;

  constructor(
    private navService: NavigationService,
    public themeService: ThemeService,
    private layout: LayoutService,
    private signinService: SigninService,
    private tokenStorageService: TokenStorageService,
    private messageService: MessageService 
  ) { }

  ngOnInit() {

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
    this.menuItemsSub = this.navService.menuItems$.subscribe(menuItem => {
      this.menuItems = menuItem;  
      
      this.subscription = this.messageService.subject.subscribe(text => { 
        this.isLoggedIn = text;
      })

      if (this.isLoggedIn) {
        const user = this.tokenStorageService.getUser();
        this.username = user.username;
        let role = user.roles[0];
        if(role==='ROLE_USER') {
          this.createMenuRoleUser();
        } else if(role==='ROLE_PARTNER') {
          this.createMenuRolePartner();
        }
      }

      //Checks item list has any icon type.
      this.hasIconTypeMenuItem = !!this.menuItems.filter(
        item => item.type === "icon"
      ).length;
    });
    this.layoutConf = this.layout.layoutConf;
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    if (this.menuItemsSub) {
      this.menuItemsSub.unsubscribe();
    }
    this.subscription.unsubscribe();
  }

  toggleCollapse() {
    if (
      this.layoutConf.sidebarCompactToggle
    ) {
        this.layout.publishLayoutChange({
        sidebarCompactToggle: false
      });
    } else {
        this.layout.publishLayoutChange({
            // sidebarStyle: "compact",
            sidebarCompactToggle: true
          });
    }
  }

  createMenuRoleUser() {
    this.menuItems = this.menuItems.filter(obj => obj.id !== 'account');
    this.menuItems = this.menuItems.filter(obj => obj.id !== 'information');

    let o = {
    "id": "account",
    "name": "Minha Conta",
    "type": "dropDown",
    "tooltip": "Pages",
    "icon": "view_carousel",
    "state": "profile",
    "sub": [
        { "name": "Profile", state: "overview" },
        { "name": "Settings", state: "settings" },
      ]
    };
    this.menuItems.push(o);

    o = {
      "id": "finance",
      "name": "Financeiro",
      "type": "dropDown",
      "tooltip": "Pages",
      "icon": "view_carousel",
      "state": "financial",
      "sub": [
          { "name": "Carteira", state: "account" },
          { "name": "Extrato carteira", state: "statement" },
          { "name": "Fazer pagamento", state: "payment" },
           { "name": "Pagamento de conta", state: "information" },
          // { "name": "Recarga de celular", state: "signin2" },
        ]
      };
    this.menuItems.push(o);

    o = {
      "id": "share",
      "name": "Compartilhar",
      "type": "dropDown",
      "tooltip": "Pages",
      "icon": "view_carousel",
      "state": "others",
      "sub": [
          { "name": "Indique e ganhe", state: "pricing" },
        ]
      };
    this.menuItems.push(o);

    o = {
        "id": "information",
        "name": "Informações",
        "type": "dropDown",
        "tooltip": "Pages",
        "icon": "view_carousel",
        "state": "others",
        "sub": [
            { "name": "Ajuda", state: "blank" },
            { "name": "Sobre", state: "n1" },
          ]
        };
    this.menuItems.push(o);
    
  }

  createMenuRolePartner() {
    this.menuItems = this.menuItems.filter(obj => obj.id !== 'account');
    this.menuItems = this.menuItems.filter(obj => obj.id !== 'information');

    let o = {
      "id": "dashboard",
      "name": "DASHBOARD",
      "type": "dropDown",
      "tooltip": "Dashbaord",
      "icon": "format_list_bulleted",
      "state": "dashboard",
      "sub": [
        { "name": "Default", state: "default" },
        { "name": "Analytics", state: "analytics" },
      ]
    }
    this.menuItems.push(o);

    o = {
    "id": "account",
    "name": "Minha Conta",
    "type": "dropDown",
    "tooltip": "Pages",
    "icon": "view_carousel",
    "state": "profile",
    "sub": [
        { "name": "Profile", state: "overview" },
        { "name": "Settings", state: "settings" },
      ]
    };
    this.menuItems.push(o);

    o = {
      "id": "cadastro",
      "name": "CADASTRO",
      "type": "dropDown",
      "tooltip": "Cadastro",
      "icon": "format_list_bulleted",
      "state": "cruds",
      "sub": [
        { "name": "Categoria", state: "category" },
        { "name": "Produto", state: "product" },
      ]
    }
    this.menuItems.push(o);

    o = {
      "id": "finance",
      "name": "Financeiro",
      "type": "dropDown",
      "tooltip": "Pages",
      "icon": "view_carousel",
      "state": "release",
      "sub": [
          { "name": "Extrato carteira", state: "transaction" },
          { "name": "Fazer pagamento", state: "scanner" },
        ]
      };
    this.menuItems.push(o);
    
  }

}
