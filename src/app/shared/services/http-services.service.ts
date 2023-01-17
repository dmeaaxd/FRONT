import {Injectable} from "@angular/core";
import {User} from "../interfaces/user";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private port: number = 18400

  jsonOptions = {headers: {'Content-Type': 'application/json'}};

  bearerAndJsonOptions() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('auth-token')
      }
    }
  }

  bearerOptions() {
    return {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('auth-token')
      }
    }
  }

  constructor(private http: HttpClient) {
  }

  login(user: User): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`http://localhost:${this.port}/login`, JSON.stringify(user), this.jsonOptions)
  }

  register(user: User) {
    return this.http.post(`http://localhost:${this.port}/register`, JSON.stringify(user), this.jsonOptions)
  }

  checkHit(dot: { x: number, y: number, r: number }) {
    return this.http.post(`http://localhost:${this.port}/hit`, JSON.stringify(dot), this.bearerAndJsonOptions())
  }

  getAllHits() {
    return this.http.get(`http://localhost:${this.port}/hits`, this.bearerOptions())
  }

  deleteAllHits() {
    return this.http.delete(`http://localhost:${this.port}/hits`, this.bearerOptions())
  }
}
