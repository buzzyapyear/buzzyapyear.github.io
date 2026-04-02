export class Input {
  constructor() {
    this.keys = {};
    this.justPressed = {};
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
  }

  attach() {
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
  }

  detach() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
  }

  _onKeyDown(e) {
    const key = e.key.toLowerCase();
    if (!this.keys[key]) {
      this.justPressed[key] = true;
    }
    this.keys[key] = true;
    // Prevent space from scrolling
    if (key === ' ') e.preventDefault();
  }

  _onKeyUp(e) {
    this.keys[e.key.toLowerCase()] = false;
  }

  isDown(key) {
    return !!this.keys[key.toLowerCase()];
  }

  wasJustPressed(key) {
    return !!this.justPressed[key.toLowerCase()];
  }

  clearJustPressed() {
    this.justPressed = {};
  }
}
