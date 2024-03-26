import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalService } from '@azure/msal-angular';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { BrowserCacheLocation, IPublicClientApplication, InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app.routes';
import { provideIcons } from './core/icons/icons.provider';
import { appReducer } from './shared/store/app.reducer';
import { AuthEffects } from './shared/store/auth.effects';
import { provideFuse } from '@fuse';


export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, MatButtonModule, MatToolbarModule, MatListModule, MatMenuModule, AppRoutingModule),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    provideStore(appReducer),
    provideEffects(AuthEffects),

    provideNoopAnimations(),
    provideAnimations(),
      // Material Date Adapter
      {
        provide : DateAdapter,
        useClass: LuxonDateAdapter,
    },
    {
        provide : MAT_DATE_FORMATS,
        useValue: {
            parse  : {
                dateInput: 'D',
            },
            display: {
                dateInput         : 'DDD',
                monthYearLabel    : 'LLL yyyy',
                dateA11yLabel     : 'DD',
                monthYearA11yLabel: 'LLLL yyyy',
            },
        },
    },
    // Fuse
    //provideAuth(),
    provideIcons(),
    provideFuse({
        // mockApi: {
        //     delay   : 0,
        //     services: mockApiServices,
        // },
        fuse   : {
            layout : 'classy',
            scheme : 'light',
            screens: {
                sm: '600px',
                md: '960px',
                lg: '1280px',
                xl: '1440px',
            },
            theme  : 'theme-default',
            themes : [
                {
                    id  : 'theme-default',
                    name: 'Default',
                },
                {
                    id  : 'theme-brand',
                    name: 'Brand',
                },
                {
                    id  : 'theme-teal',
                    name: 'Teal',
                },
                {
                    id  : 'theme-rose',
                    name: 'Rose',
                },
                {
                    id  : 'theme-purple',
                    name: 'Purple',
                },
                {
                    id  : 'theme-amber',
                    name: 'Amber',
                },
            ],
        },
      }),

    // // Transloco Config
    // provideTransloco({
    //     config: {
    //         availableLangs      : [
    //             {
    //                 id   : 'en',
    //                 label: 'English',
    //             },
    //             {
    //                 id   : 'tr',
    //                 label: 'Turkish',
    //             },
    //         ],
    //         defaultLang         : 'en',
    //         fallbackLang        : 'en',
    //         reRenderOnLangChange: true,
    //         prodMode            : true,
    //     },
    //     loader: TranslocoHttpLoader,
    // }),
    // {
    //     // Preload the default language before the app starts to prevent empty/jumping content
    //     provide   : APP_INITIALIZER,
    //     useFactory: () =>
    //     {
    //         const translocoService = inject(TranslocoService);
    //         const defaultLang = translocoService.getDefaultLang();
    //         translocoService.setActiveLang(defaultLang);
  
    //         return () => firstValueFrom(translocoService.load(defaultLang));
    //     },
    //     multi     : true,
    // },
  
  ]
};

const isIE =
window.navigator.userAgent.indexOf('MSIE ') > -1 ||
window.navigator.userAgent.indexOf('Trident/') > -1;

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.msalConfig.auth.clientId,
      authority: environment.msalConfig.auth.authority,
      redirectUri: environment.redirectUri,
      postLogoutRedirectUri: '/'
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
    system: {
      allowNativeBroker: false, // Disables WAM Broker
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Warning,
        piiLoggingEnabled: false,
      },
    },
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  //  protectedResourceMap.set(GRAPH_ENDPOINT, ['user.read']);
//  protectedResourceMap.set(environment.apiConfig.uri, environment.apiConfig.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      //scopes: [...environment.apiConfig.scopes]
      scopes: ['user.read'],
    },
    loginFailedRoute: '/login-failed'
  };  
}
