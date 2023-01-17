import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {HttpService} from "../../shared/services/http-services.service";
import {Hit} from "../../shared/interfaces/hit";

@Component({
  selector: 'app-hit-form',
  templateUrl: './hit-form.component.html',
  styleUrls: ['./hit-form.component.css']
})
export class HitFormComponent implements OnInit {
  @Input() r: number
  @Input() hits: Array<Hit>
  @Output() rChange = new EventEmitter<number>()
  @Output() hitEvent = new EventEmitter()
  @Output() deleteEvent = new EventEmitter()
  form: FormGroup

  constructor(private http: HttpClient, private router: Router, private httpService: HttpService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      x: new FormControl(null, [Validators.required, Validators.min(-4), Validators.max(4)]),
      y: new FormControl(null, [Validators.required, Validators.min(-3), Validators.max(3)]),
      r: new FormControl(null, [Validators.required, Validators.min(0.000000000000000000000001), Validators.max(4)])
    })
  }

  requestHit() {
    if (!this.validate()) {
      return
    }

    this.httpService.checkHit(this.form.value).subscribe(
      {
        next: (data: any) => {
          let hit: Hit = {
            x: data.x,
            y: data.y,
            r: data.r,
            hit: data.hit
          }

          this.hits.push(hit)

          this.hitEvent.emit(hit)
        },
        error: error => {
          if (error.status == 401) {
            localStorage.removeItem('auth-token')
            this.router.navigate(['/login'])
          }
        }
      }
    )


  }

  deleteHits() {
    this.httpService.deleteAllHits().subscribe(
      {
        next: () => {
          this.deleteEvent.emit()
        },
        error: error => {
          if (error.status == 401) {
            localStorage.removeItem('auth-token')
            this.router.navigate(['/login'])
          }
        }
      }
    )

  }

  validate(): boolean {
    if (this.form.value.x == null
      || this.form.value.y == null
      || this.form.value.r == null) {
      alert('Все поля должны быть заполнены')
      return false
    }

    return true
  }

  onChangeR(e: any) {
    this.rChange.emit(e.target.value == "" ? 0 : e.target.value)
  }

}
