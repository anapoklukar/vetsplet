import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('auth_token');

    const authReq = authToken 
      ? req.clone({
          headers: req.headers.set('Authorization', `Bearer ${authToken}`)
        })
      : req;
    return next.handle(authReq);
  }
}
