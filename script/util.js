// @ts-ignore
String.prototype.firstLetterUpper = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

// @ts-ignore
Object.prototype.deepCopy = function () {
  return JSON.parse(JSON.stringify(this));
};
