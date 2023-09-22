import { Component, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from '../../../../../@vex/services/layout.service';
import { filter, map, startWith } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { checkRouterChildsData } from '../../../../../@vex/utils/check-router-childs-data';
import { ConfigService } from '../../../../../@vex/config/config.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SidebarComponent } from '../../../../../@vex/components/sidebar/sidebar.component';
import { VexConfigName } from 'src/@vex/config/config-name.model';
import { ColorSchemeName } from 'src/@vex/config/colorSchemeName';
import { ColorVariable, colorVariables } from 'src/@vex/components/config-panel/color-variables';


@UntilDestroy()
@Component({
  selector: 'vex-custom-layout',
  templateUrl: './custom-layout.component.html',
  styleUrls: ['./custom-layout.component.scss']
})
export class CustomLayoutComponent implements OnInit {

  sidenavCollapsed$ = this.layoutService.sidenavCollapsed$;
  isFooterVisible$ = this.configService.config$.pipe(map(config => config.footer.visible));
  isDesktop$ = this.layoutService.isDesktop$;

  selectedColor = colorVariables.blue;

  toolbarShadowEnabled$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(null),
    map(() => checkRouterChildsData(this.router.routerState.root.snapshot, data => data.toolbarShadowEnabled))
  );

  @ViewChild('configpanel', { static: true }) configpanel: SidebarComponent;

  constructor(private layoutService: LayoutService,
              private configService: ConfigService,
              private router: Router) { }

  ngOnInit() {
    this.layoutService.configpanelOpen$.pipe(
      untilDestroyed(this)
    ).subscribe(open => open ? this.configpanel.open() : this.configpanel.close());

    this.setConfig(VexConfigName.ikaros, ColorSchemeName.default);
    this.selectColor(colorVariables.teal)
  }

  setConfig(layout: VexConfigName, colorScheme: ColorSchemeName): void {
    this.configService.setConfig(layout);
    this.configService.updateConfig({
      style: {
        colorScheme
      }
    });
  } 

  selectColor(color: ColorVariable): void {
    this.selectedColor = color;
    this.configService.updateConfig({
      style: {
        colors: {
          primary: {
            default: color.default,
            contrast: color.contrast
          }
        }
      }
    });
  }
}
