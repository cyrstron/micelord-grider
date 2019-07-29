import { CenterPoint, GeoPoint } from "../../../../../points";
import { OuterCentersMatrix } from "../../outer-centers-matrix";
import { Cell } from "../../../../cell";

function calcNextOuter(
  matrix: OuterCentersMatrix,
  points: GeoPoint[],
  startI: number,
  startJ: number,
  prevI?: number,
  prevJ?: number,
): [number, number] {
  const lastPoint = points[points.length - 1];
  let touchedOuterIndexes = matrix.touchedOuterEmpties(startI, startJ)
    .filter(([i, j]) => {
      const eqCell = matrix.equivalentCell(i, j);

      return !!eqCell.findEqualGeoPoint(lastPoint);
    });

  if (
    touchedOuterIndexes.length > 1 &&
    (prevI !== undefined && prevJ !== undefined)
  ) {
    touchedOuterIndexes = touchedOuterIndexes.filter(
      ([i, j]) => i !== prevI || j !== prevJ
    );
  } else if (touchedOuterIndexes.length > 1) {
    return touchedOuterIndexes.sort(([, jA], [, jB]) => jB - jA)[0] as [number, number];
  }

  if (touchedOuterIndexes.length > 1) {
    touchedOuterIndexes.filter(([i, j]) => i === startI || j === startJ);
  }

  return touchedOuterIndexes[0] as [number, number];
}

function getStartPoints(
  matrix: OuterCentersMatrix,
  touchedCentersIndexes: number[][],
  startI: number,
  startJ: number,
) {
  const {
    payload, 
    topLeft: {
      params: {isHorizontal}
    }
  } = matrix;
  const points: GeoPoint[] = [];
  
  touchedCentersIndexes.sort(([iA, jA], [iB, jB]) => iB - iA || jA - jB);

  const outerCell = matrix.equivalentCell(startI, startJ);
  const refCenter = outerCell.center.moveByDiff(-1, -1);

  const isNorthern = outerCell.center.isNorthernTo(refCenter);
  const isEastern = outerCell.center.isEasternTo(refCenter);

  const nearestPoints = touchedCentersIndexes.map(([i, j]) => {
    const cell = (payload[i][j] as CenterPoint).toCell();

    return cell.commonPoints(outerCell)
        .sort((pointA, pointB) => {
          const isByEastern = (
            !isHorizontal && pointA.lng !== pointB.lng
          ) || (
            isHorizontal && pointA.lat === pointB.lat
          );

          if (isByEastern) {
            return pointA.isEasternTo(pointB) === isEastern ? 1 : -1;
          } else {
            return pointA.isNorthernTo(pointB) === isNorthern ? 1 : -1
          }            
        })
    })
    .reduce((points, commonPoints) => {
      points.push(...commonPoints);

      return points;
    }, [] as GeoPoint[]);

  nearestPoints.forEach((commonPoint) => {
    const lastPoint = points[points.length - 1];

    if (!lastPoint || !lastPoint.isEqual(commonPoint)) {
      points.push(commonPoint);
    }     
  });
  
  return points;
}

function getNextPoints(
  matrix: OuterCentersMatrix,
  points: GeoPoint[],
  outerI: number,
  outerJ: number,
) {
  const outerCell = matrix.equivalentCell(outerI, outerJ);
  const nearestCenters = matrix.touchedCenters(outerI, outerJ);

  let lastPoint = points[points.length - 1];
  let prevCell: Cell | undefined;
  const nextPoints = [];

  let commonCells = nearestCenters.map(([i, j]) => {
    return (matrix.payload[i][j] as CenterPoint).toCell();
  });

  while(commonCells.length > 0) {
    lastPoint = nextPoints[nextPoints.length - 1] || lastPoint;
    
    let commonCellIndex: number;

    if (prevCell) {
      commonCellIndex = commonCells.findIndex((cell) => (
        !!cell.findEqualGeoPoint(lastPoint) && (
          !prevCell || prevCell.isNeighbor(cell)
        )
      ));
    } else {

      const cells = commonCells.filter((cell) => (
        !!cell.findEqualGeoPoint(lastPoint)
      ));

      if (cells.length === 1) {
        commonCellIndex = commonCells.indexOf(cells[0])
      } else {
        const preLastPoint = nextPoints[nextPoints.length - 2] || 
        points[points.length - 2];

        commonCellIndex = commonCells.findIndex((cell) => (
          !!cell.findEqualGeoPoint(lastPoint) && 
            !!cell.findEqualGeoPoint(preLastPoint)        
        ));
      };
    }

    if (commonCellIndex === -1) break;

    const cell = commonCells[commonCellIndex];
    const commonPoints = cell.commonPoints(outerCell)
      .filter((point) => (
        !point.isEqual(lastPoint)
      ));

    nextPoints.push(...commonPoints);
    prevCell = cell;
    commonCells.splice(commonCellIndex, 1);
  }

  return nextPoints;
}

function getOuterPoints(
  matrix: OuterCentersMatrix,
  startI: number,
  startJ: number,
  points?: GeoPoint[],
): GeoPoint[] {

  const touchedCentersIndexes = matrix.touchedCenters(startI, startJ);

  if (!points) {
    points = getStartPoints(matrix, touchedCentersIndexes, startI, startJ);
  }

  let [nextI, nextJ] = calcNextOuter(
    matrix, 
    points, 
    startI,
    startJ
  );

  let prevI = startI;
  let prevJ = startJ;

  while(nextI !== startI || nextJ !== startJ) {
    const nextPoints = getNextPoints(matrix, points, nextI, nextJ);

    points.push(...nextPoints);

    const [i, j] = calcNextOuter(
      matrix, 
      points, 
      nextI,
      nextJ,
      prevI,
      prevJ,
    );

    prevI = nextI;
    prevJ = nextJ;
    nextI = i;
    nextJ = j;
  }

  console.log(points);

  return points;
}

export function getOuterPoly(
  matrix: OuterCentersMatrix,
): GeoPoint[] {

  const [startI, startJ] = matrix.startIndexes;

  return getOuterPoints(matrix, startI, startJ);
}
  