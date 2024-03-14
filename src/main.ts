// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import { BrowserCacheLocation, IPublicClientApplication, InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));


  if (environment.production) {
    enableProdMode();
  }
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
  
    
  const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;
  
  export function loggerCallback(logLevel: LogLevel, message: string) {
    console.log(message);
  }
  
  export function MSALInstanceFactory(): IPublicClientApplication {
    return new PublicClientApplication({
      auth: {
        clientId: '86ab2bdb-345f-4a10-aaf8-ab3bdb0664b8',
        //authority: 'https://login.microsoftonline.com/4ebf70f8-2b68-4c76-938d-0770eb8862f2',
        authority: 'https://login.microsoftonline.com/consumers',
        redirectUri: environment.redirectUri,
      },
      cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: isIE, // set to true for IE 11
      },
      system: {
        loggerOptions: {
          loggerCallback,
          logLevel: LogLevel.Info,
          piiLoggingEnabled: false,
        },
      },
    });
  }
  
  export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
    const protectedResourceMap = new Map<string, Array<string>>();
    //  protectedResourceMap.set(GRAPH_ENDPOINT, ['user.read']);
    
    return {
      interactionType: InteractionType.Redirect,
      protectedResourceMap,
    };
  }
  
  export function MSALGuardConfigFactory(): MsalGuardConfiguration {
    return {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: ['user.read'],
      },
    };  
  }