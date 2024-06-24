const createTriangle = (a: number): void => {
  for (let i = 1; i <= a; i++) {
    const space = " ";
    const hashtag = "#";
    console.log(space.repeat(a - i) + hashtag.repeat(i));
  }
};
const x = 5;
createTriangle(x);
