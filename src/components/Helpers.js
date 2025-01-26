import { Scene } from 'phaser';

function isMobile(scene) {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const deviceWidthSmall = screen.availHeight > screen.availWidth || window.innerHeight > window.innerWidth;
  const isTouchDevice = scene.sys.game.device.input.touch;

  return regex.test(navigator.userAgent) && deviceWidthSmall ? true : false;
}

function calculateLayout(isMobile, scene) {
  const isTouchDevice = isMobile;
  const gameWidth = scene.cameras.main.width;
  const gameHeight = scene.cameras.main.height;
  const sceneWidth = isTouchDevice ? gameWidth * 0.9 : gameWidth * 0.75;
  const sceneHeight = isTouchDevice ? gameWidth * 0.9 : gameHeight * 0.75;
  
  return {
      gameWidth,
      gameHeight,
      centerX: gameWidth / 2,
      centerY: gameHeight / 2,
      sceneWidth: isTouchDevice ? gameWidth * 0.9 : gameWidth * 0.75,
      sceneHeight: isTouchDevice ? gameWidth * 0.9 : gameHeight * 0.75,
      sceneHalfY: (sceneHeight / 2) + 50,
      yPos: 50,
      isTouchDevice,
      cellSize: isTouchDevice ? sceneWidth / 10 : sceneWidth / 21,
      cellXMax: isTouchDevice ? 9 : 20,
      cellYMax: isTouchDevice ? 9: 14,
      scale: isTouchDevice ? 2 : 1,
      fontSize: isTouchDevice ? 36 : 20
  };
}

export {isMobile, calculateLayout};