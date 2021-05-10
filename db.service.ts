import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  configUrl = 'http://localhost:3000/user';
  public dbData: any[];
  constructor(private http: HttpClient) { }

  getConfig() {
    return this.http.get<any>(this.configUrl);
  }

}
