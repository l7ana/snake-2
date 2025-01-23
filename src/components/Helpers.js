import { Scene } from 'phaser';

// Notes: try implement sharp for sharper webgl images

// import sharp from 'sharp'

// const resizedSvgToSharp = async (
//   p: string | Buffer,
//   { width, height }: { width?: number; height?: number },
// ) => {
//   const instance = sharp(p)

//   const metadata = await instance.metadata()

//   const initDensity = metadata.density ?? 72

//   if (metadata.format !== 'svg') {
//     return instance
//   }

//   let wDensity = 0
//   let hDensity = 0
//   if (width && metadata.width) {
//     wDensity = (initDensity * width) / metadata.width
//   }

//   if (height && metadata.height) {
//     hDensity = (initDensity * height) / metadata.height
//   }

//   if (!wDensity && !hDensity) {
//     // both width & height are not present and/or
//     // can't detect both metadata.width & metadata.height
//     return instance
//   }

//   return sharp(p, { density: Math.max(wDensity, hDensity) }).resize(
//     width,
//     height,
//   )
// }

// // Read image data from remote URL,
// // resize to 300 pixels wide,
// // emit an 'info' event with calculated dimensions
// // and finally write image data to writableStream
// const { body } = fetch('https://...');
// const readableStream = Readable.fromWeb(body);
// const transformer = sharp()
//   .resize(300)
//   .on('info', ({ height }) => {
//     console.log(`Image height is ${height}`);
//   });
// readableStream.pipe(transformer).pipe(writableStream);

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