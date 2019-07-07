import {Line} from './line';
import { MercPoint } from '../points';

export class MercLine extends Line {
  hasPoint(point: MercPoint): boolean {
    const calcX = this.xByY(point.y);
    const calcY = this.yByX(point.x);

    if (calcX === undefined || calcY === undefined) return false;  

    const calcedPoint = new MercPoint(calcX, calcY);

    return point.isEqual(calcedPoint);
  }

  intersectionPoint(line: MercLine): MercPoint | undefined {
    const intersection = super.intersectionPoint(line);

    if (!intersection) return;

    const {x, y} = intersection;

    return new MercPoint(x, y);
  }

  static fromTwoPoints(pointA: MercPoint, pointB: MercPoint): MercLine {
    const {a, b, c} = Line.fromTwoPoints(pointA, pointB);

    return new MercLine(a, b ,c);
  }
}