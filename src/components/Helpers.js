import { Scene } from 'phaser';

export function isMobile() {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const deviceWidthSmall = screen.availHeight > screen.availWidth || window.innerHeight > window.innerWidth;
  const isTouchDevice = this.sys.game.device.input.touch;

  return isTouchDevice && regex.test(navigator.userAgent) || deviceWidthSmall ? true : false;
}