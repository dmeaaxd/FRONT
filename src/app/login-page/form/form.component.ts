import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpService} from "../../shared/services/http-services.service";
import {User} from "../../shared/interfaces/user";


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  form: FormGroup
  private token: string = ""

  constructor(private router: Router, private httpService: HttpService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),

    })
  }

  onSubmitLogin() {
    if (!this.validate()) {
      return
    }

    let user: User = this.form.value

    this.httpService.login(user).subscribe(
      {
        next: (data: { token: string }) => {
          localStorage.setItem('auth-token', data.token)
          this.router.navigate(['/main'])
        },
        error: error => {
          if (error.status == 401) {
            alert("Неверный логин или пароль! Повторите попытку")
          }
        }
      }
    )
  }

  onSubmitRegister() {
    if (!this.validate()) {
      return
    }

    let user: User = this.form.value

    this.httpService.register(user).subscribe(
      {
        next: () => {
          alert("Пользователь успешно зарегистрирован")
        },
        error: (err => {
          if (err.status == 401) {
            alert("Пользователь с таким логином уже существует")
          }
        })
      }
    )
  }

  validate(): boolean {
    if (this.form.value.login == null || this.form.value.password == null) {
      alert('Все поля должны быть заполнены')
      return false
    }

    return true
  }
}
