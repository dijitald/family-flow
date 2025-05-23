import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { BrowserUtils } from "@azure/msal-browser";
import { LoginComponent } from "./features/login/login.component";
import { MsalGuard } from "@azure/msal-angular";
import { LayoutComponent } from "./features/layout/layout.component";
import { NoAuthGuard } from "./shared/auth/noAuth.guard";
import { AuthGuard } from "./shared/auth/auth.guard";
import { AboutComponent } from "./features/about/about.component";

export const routes: Routes = [
  { 
    path: "", 
    pathMatch: 'full',
    redirectTo: "about"
  },
  { 
    path: "about", 
    pathMatch: 'full',
    component: LayoutComponent,
//    component: AboutComponent, 
    children: [
      {
        path: "",
        loadComponent : () => import('./features/about/about.component').then(m => m.AboutComponent)
      }
    ]
  },
  { 
    path: "login",
    component: LoginComponent, 
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
    path: "tasks",
    canActivate: [AuthGuard, MsalGuard],
    canActivateChild: [AuthGuard, MsalGuard],
    component: LayoutComponent,
    children: [
      {
        path: "",
        loadComponent : () => import('./features/task-list/task-list.component').then(m => m.TaskListComponent)
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


