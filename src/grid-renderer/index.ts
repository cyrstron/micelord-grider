import {Grider} from '../grider';
import {Neighborer} from '../neighborer';
import {GeographyUtils, MathUtils} from '../utils';
import {BorderRenderer} from './border-renderer';
import {GridRenderer} from './grid-renderer';
import {TileBuilder} from './tile-builder';

export const createGridRenderer = (
  grider: Grider,
  geography: GeographyUtils,
  math: MathUtils,
  neighbors: Neighborer,
): GridRenderer => {
  const tileBuilder = new TileBuilder(grider, neighbors);
  const gridRenderer = new GridRenderer(grider, tileBuilder, geography, math, neighbors);

  return gridRenderer;
};

export {
  GridRenderer,
  TileBuilder,
  BorderRenderer,
};