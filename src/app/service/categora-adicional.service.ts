import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoraAdicionalService {

  apiBase: string = environment.apiBaseUrl + '/api/categoria-adicional';

  constructor(
    private snack: MatSnackBar,
    private http: HttpClient,
  ) { }

  msg(msg: string, isError: boolean = false): void {
    this.snack.open(msg, '', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: isError ? ['msg-error'] : ['msg-sucess']
    });
  }

  deletarCategoriaAdicional(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiBase}/${id}`);
  }


}
