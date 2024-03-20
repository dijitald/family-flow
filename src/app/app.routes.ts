import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { BrowserUtils } from "@azure/msal-browser";
import { HomeComponent } from "./home/home.component";

export const routes: Routes = [
  { path: "profile", loadComponent : () => import('./profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'login-failed', loadComponent : () => import('./shared/auth/authFailed.component').then(m => m.AuthFailedComponent)},
  { path: "", component: HomeComponent },
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


