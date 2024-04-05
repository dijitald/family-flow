import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { BrowserUtils } from "@azure/msal-browser";
import { HomeComponent } from "./features/home/home.component";
import { MsalGuard } from "@azure/msal-angular";
import { LayoutComponent } from "./shared/layout/layout.component";
import { NoAuthGuard } from "./shared/auth/noAuth.guard";
import { AuthGuard } from "./shared/auth/auth.guard";

export const routes: Routes = [
  { 
    path: "", 
    component: HomeComponent, 
    canActivate: [NoAuthGuard],
    pathMatch: 'full',
  },
  {
    path: "dashboard",
    canActivate: [AuthGuard, MsalGuard],
    canActivateChild: [AuthGuard, MsalGuard],
    component: LayoutComponent,
    children: [
      {
        path: "",
        loadComponent : () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      }
    ]
  },{ 
    path: "profile",
    canActivate: [AuthGuard, MsalGuard],
    canActivateChild: [AuthGuard, MsalGuard],
    component: LayoutComponent,
    children: [
      {
        path: "",
       loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
          // loadComponent : () => import('./features/home/home.component').then(m => m.HomeComponent) 

      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      // Don't perform initial navigation in iframes or popups
      initialNavigation:
        !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup()
          ? "enabledNonBlocking"
          : "disabled", // Set to enabledBlocking to use Angular Universal
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}


