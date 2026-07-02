import { useEffect } from 'react';
import * as THREE from 'three';

function useConfigureTextures(textureMap, options = {}, format = 'ktx2') {

  const {
    anisotropy = 8,
    minFilter = THREE.LinearMipmapLinearFilter,
    magFilter = THREE.LinearFilter,
    wrapS = THREE.RepeatWrapping,
    wrapT = THREE.ClampToEdgeWrapping,
    isKTX2 = format.toLowerCase() === 'ktx2' ? true : false
  } = options;

  useEffect(() => {
    if (!textureMap) return;

    let texturesToProcess = [];

    if (textureMap.isTexture) {
      texturesToProcess = [textureMap];
    } else if (Array.isArray(textureMap)) {
      texturesToProcess = textureMap;
    } else if (typeof textureMap === 'object') {
      texturesToProcess = Object.values(textureMap);
    }

    texturesToProcess.forEach((texture) => {
      if (!texture || !texture.isTexture) return;

      texture.anisotropy = anisotropy;
      texture.minFilter = minFilter;
      texture.magFilter = magFilter;
      texture.wrapS = wrapS;
      texture.wrapT = wrapT;
      texture.needsUpdate = true;
    });
  }, [textureMap, anisotropy, minFilter, magFilter, wrapS, wrapT, isKTX2]);
}

export default useConfigureTextures;