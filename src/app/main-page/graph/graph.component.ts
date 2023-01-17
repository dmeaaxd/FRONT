import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as JXG from "jsxgraph";
import {Point, Polygon, Sector} from "jsxgraph";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Hit} from "../../shared/interfaces/hit";
import {HttpService} from "../../shared/services/http-services.service";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, OnChanges {
  @Input() rFromInputField: number
  @Input() hits: Array<Hit>
  private rFromGraph: number

  board: JXG.Board


  constructor(private http: HttpClient, private router: Router, private httpService: HttpService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    let newRFromInputField = changes['rFromInputField'].currentValue

    if (0 < parseFloat(newRFromInputField) && parseFloat(newRFromInputField) <= 4) {
      this.changeGraph(newRFromInputField)
      this.rFromGraph = newRFromInputField
    }
  }

  ngOnInit() {
    this.board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: [-3, 3, 3, -3], axis: true});
  }


  setVerticesInvisible(figure: { vertices: string | any[]; }) {
    for (let i = 0; i < figure.vertices.length - 1; i++) {
      figure.vertices[i].setAttribute({visible: false});
    }
  }


  clickGraph(e: MouseEvent) {

    // @ts-ignore
    if (e.button === 2 || e.target.className === 'JXG_navigation_button') {
      return;
    }
    let coords: JXG.Coords = this.getMouseCoords(e, 0)

    let point = {
      x: Math.round(coords.usrCoords[1] * 100) / 100,
      y: Math.round(coords.usrCoords[2] * 100) / 100,
      r: this.rFromGraph == null ? 0 : this.rFromGraph
    }

    this.httpService.checkHit(point).subscribe(
      {
        next: (data: any) => {
          let hit: Hit = {
            x: data.x,
            y: data.y,
            r: data.r,
            hit: data.hit
          }

          this.hits.push(hit)
          this.drawPoint(hit)
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

  createTriangle(R: number) {
    let p1 = this.board.create('point', [0, 0], {name: '', size: 2, fixed: true});
    let p2 = this.board.create('point', [-R / 2, 0], {name: '', size: 2, fixed: true});
    let p3 = this.board.create('point', [0, R / 2], {name: '', size: 2, fixed: true});
    let triangle = this.board.create('polygon', [p1, p2, p3], {borders: {strokeColor: 'green'}, fixed: true});
    this.setVerticesInvisible(triangle);
    return triangle;
  }

  createRectangle(R: number) {
    let p1 = this.board.create('point', [0, 0], {name: '', size: 2, fixed: true});
    let p2 = this.board.create('point', [0, -R / 2], {name: '', size: 2, fixed: true});
    let p3 = this.board.create('point', [-R, -R / 2], {name: '', size: 2, fixed: true});
    let p4 = this.board.create('point', [-R, 0], {name: '', size: 2, fixed: true});
    let rectangle = this.board.create('polygon', [p1, p2, p3, p4], {borders: {strokeColor: 'green'}, fixed: true});
    this.setVerticesInvisible(rectangle);
    return rectangle;
  }

  createCircle(R: number) {
    let p1 = this.board.create('point', [0, 0], {name: '', size: 2, fixed: true, visible: false})
    let p2 = this.board.create('point', [0, R], {name: '', size: 2, fixed: true, visible: false})
    let p3 = this.board.create('point', [R, 0], {name: '', size: 2, fixed: true, visible: false})
    return this.board.create('sector', [p1, p3, p2], {strokeColor: 'green'});
  }

  getMouseCoords(e: MouseEvent, i: number) {
    let cPos = this.board.getCoordsTopLeftCorner(),
      absPos = JXG.getPosition(e, i),
      dx = absPos[0] - cPos[0],
      dy = absPos[1] - cPos[1];
    return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], this.board);
  }

  previousObjects: (Polygon | Sector)[]

  changeGraph(R: number) {
    if (this.previousObjects) {
      this.board.removeObject(this.previousObjects);
    }
    if (R <= 0) {
      return
    }
    let o1 = this.createTriangle(R),
        o2 = this.createRectangle(R),
        o3 = this.createCircle(R);
    this.previousObjects = [o1, o2, o3];

  }

  actualPoints: (Point)[] = []

  drawPoints() {
    let newPointDrawObject = null

    for (let hit of this.hits) {
      if (hit.hit) {
        newPointDrawObject = this.board.create('point', [hit.x, hit.y], {name: '', size: 2, fixed: true, color: 'green'});
      } else {
        newPointDrawObject = this.board.create('point', [hit.x, hit.y], {name: '', size: 2, fixed: true, color: 'red'});
      }

      this.actualPoints.push(newPointDrawObject)
    }
  }

  drawPoint(hit: Hit) {
    let newPointDrawObject = null
    if (hit.hit) {
      newPointDrawObject = this.board.create('point', [hit.x, hit.y], {name: '', size: 2, fixed: true, color: 'green'});
    } else {
      newPointDrawObject = this.board.create('point', [hit.x, hit.y], {name: '', size: 2, fixed: true, color: 'red'});
    }

    this.actualPoints.push(newPointDrawObject)
  }

  removePoints() {
    this.board.removeObject(this.actualPoints)
    this.hits.splice(0);
  }

}
