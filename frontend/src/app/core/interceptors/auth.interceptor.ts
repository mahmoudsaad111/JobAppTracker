import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Just add withCredentials to every request — cookie is handled by browser
  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('Request URL:', req.url);        // ← which url failed
      console.log('Error status:', error.status);  // ← what error
      console.log('Error body:', error.error);  
      if (error.status === 401) {
         
        // Cookie expired or invalid — just logout, no refresh needed
        authService.clearSession();
      }
      return throwError(() => error);
    })
  );
};