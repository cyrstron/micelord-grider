import { GeographyUtils, GriderUtils } from '../../utils';

export class MercatorCorrector {
  geography: GeographyUtils;
  constructor({geography}: GriderUtils) {
    this.geography = geography;
  }

  correctForGrid(point: grider.GeoPoint): grider.GeoPoint {
    return this.geography.spherToMercGeo(point);
  }

  correctForGeo(
    point: grider.GeoPoint,
  ): grider.GeoPoint {
    let result = this.geography.mercToSpherGeo(point);

    result = this.geography.formatGeoPoint(result);

    return result;
  }

  correctPoly(poly: grider.GeoPoint[]): grider.GeoPoint[] {
    return poly;
  }
}
