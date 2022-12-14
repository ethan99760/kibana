/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { Map as MbMap, LayerSpecification } from '@kbn/mapbox-gl';
import { ILayer } from '../../classes/layers/layer';

// "Layer" is overloaded and can mean the following
// 1) Map layer (ILayer): A single map layer consists of one to many mapbox layers.
// 2) Mapbox layer (LayerSpecification): Individual unit of rendering such as text, circles, polygons, or lines.

export function getIsTextLayer(mbLayer: LayerSpecification) {
  if (mbLayer.type !== 'symbol') {
    return false;
  }

  const styleNames = [];
  if (mbLayer.paint) {
    styleNames.push(...Object.keys(mbLayer.paint));
  }
  if (mbLayer.layout) {
    styleNames.push(...Object.keys(mbLayer.layout));
  }
  return styleNames.some((styleName) => {
    return styleName.startsWith('text-');
  });
}

export function isGlDrawLayer(mbLayerId: string) {
  return mbLayerId.startsWith('gl-draw');
}

function doesMbLayerBelongToMapLayerAndClass(
  mapLayer: ILayer,
  mbLayer: LayerSpecification,
  layerClass: LAYER_CLASS
) {
  if (!mapLayer.ownsMbLayerId(mbLayer.id)) {
    return false;
  }

  // mb layer belongs to mapLayer, now filter by layer class
  if (layerClass === LAYER_CLASS.ANY) {
    return true;
  }
  const isTextLayer = getIsTextLayer(mbLayer);
  return layerClass === LAYER_CLASS.LABEL ? isTextLayer : !isTextLayer;
}

enum LAYER_CLASS {
  ANY = 'ANY',
  LABEL = 'LABEL',
  NON_LABEL = 'NON_LABEL',
}

function moveMapLayer(
  mbMap: MbMap,
  mbLayers: LayerSpecification[],
  mapLayer: ILayer,
  layerClass: LAYER_CLASS,
  beneathMbLayerId?: string
) {
  mbLayers
    .filter((mbLayer) => {
      return doesMbLayerBelongToMapLayerAndClass(mapLayer, mbLayer, layerClass);
    })
    .forEach((mbLayer) => {
      mbMap.moveLayer(mbLayer.id, beneathMbLayerId);
    });
}

function getBottomMbLayerId(
  mbLayers: LayerSpecification[],
  mapLayer: ILayer,
  layerClass: LAYER_CLASS
) {
  const bottomMbLayer = mbLayers.find((mbLayer) => {
    return doesMbLayerBelongToMapLayerAndClass(mapLayer, mbLayer, layerClass);
  });
  return bottomMbLayer ? bottomMbLayer.id : undefined;
}

function isLayerInOrder(
  mbMap: MbMap,
  mapLayer: ILayer,
  layerClass: LAYER_CLASS,
  beneathMbLayerId?: string
) {
  const mbLayers = mbMap.getStyle().layers!; // check ordering against mapbox to account for any upstream moves.

  if (!beneathMbLayerId) {
    // Check that map layer is top layer
    return doesMbLayerBelongToMapLayerAndClass(mapLayer, mbLayers[mbLayers.length - 1], layerClass);
  }

  let inMapLayerBlock = false;
  let nextMbLayerId = null;
  for (let i = 0; i < mbLayers.length; i++) {
    if (!inMapLayerBlock) {
      if (doesMbLayerBelongToMapLayerAndClass(mapLayer, mbLayers[i], layerClass)) {
        inMapLayerBlock = true;
      }
    } else {
      // Next mbLayer not belonging to this map layer is the bottom mb layer for the next map layer
      if (!doesMbLayerBelongToMapLayerAndClass(mapLayer, mbLayers[i], layerClass)) {
        nextMbLayerId = mbLayers[i].id;
        break;
      }
    }
  }

  return nextMbLayerId === beneathMbLayerId;
}

export function syncLayerOrder(mbMap: MbMap, spatialFiltersLayer: ILayer, layerList: ILayer[]) {
  const mbLayers = mbMap.getStyle().layers;
  if (!mbLayers || mbLayers.length === 0) {
    return;
  }

  // Ensure spatial filters layer is the top layer.
  if (!isLayerInOrder(mbMap, spatialFiltersLayer, LAYER_CLASS.ANY)) {
    moveMapLayer(mbMap, mbLayers, spatialFiltersLayer, LAYER_CLASS.ANY);
  }
  let beneathMbLayerId = getBottomMbLayerId(mbLayers, spatialFiltersLayer, LAYER_CLASS.ANY);

  // Ensure gl-draw layers are on top of all layerList layers
  const glDrawLayer = {
    ownsMbLayerId: (mbLayerId: string) => {
      return isGlDrawLayer(mbLayerId);
    },
  } as unknown as ILayer;
  moveMapLayer(mbMap, mbLayers, glDrawLayer, LAYER_CLASS.ANY, beneathMbLayerId);
  const glDrawBottomMbLayerId = getBottomMbLayerId(mbLayers, glDrawLayer, LAYER_CLASS.ANY);
  if (glDrawBottomMbLayerId) {
    beneathMbLayerId = glDrawBottomMbLayerId;
  }

  // Sort map layer labels
  [...layerList]
    .reverse()
    .filter((mapLayer) => {
      return mapLayer.areLabelsOnTop();
    })
    .forEach((mapLayer: ILayer) => {
      if (!isLayerInOrder(mbMap, mapLayer, LAYER_CLASS.LABEL, beneathMbLayerId)) {
        moveMapLayer(mbMap, mbLayers, mapLayer, LAYER_CLASS.LABEL, beneathMbLayerId);
      }
      const bottomMbLayerId = getBottomMbLayerId(mbLayers, mapLayer, LAYER_CLASS.LABEL);
      if (bottomMbLayerId) beneathMbLayerId = bottomMbLayerId;
    });

  // Sort map layers
  [...layerList].reverse().forEach((mapLayer: ILayer) => {
    const layerClass = mapLayer.areLabelsOnTop() ? LAYER_CLASS.NON_LABEL : LAYER_CLASS.ANY;
    if (!isLayerInOrder(mbMap, mapLayer, layerClass, beneathMbLayerId)) {
      moveMapLayer(mbMap, mbLayers, mapLayer, layerClass, beneathMbLayerId);
    }
    const bottomMbLayerId = getBottomMbLayerId(mbLayers, mapLayer, layerClass);
    if (bottomMbLayerId) beneathMbLayerId = bottomMbLayerId;
  });
}
