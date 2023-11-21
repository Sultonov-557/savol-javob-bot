export function formatString(string: string): string {
  let out = "";
  let lines = string.split("\n");
  const maxLength = 45;

  lines = lines.map((v, i, a) => {
    if (v.length > maxLength) {
      let words = v.split(" ");
      return;
    } else {
      return v;
    }
  });

  const topLenght = Math.max(...lines.map((v) => v.length));

  out += "-".repeat(topLenght + 10) + "\n";

  for (let i of lines) {
    out += "|";
    out += " ".repeat((topLenght - i.length) * 0.6 + 4);
    out += i;
    out += " ".repeat((topLenght - i.length) * 0.5 + 4);
    out += "|\n";
  }

  out += "-".repeat(topLenght + 10);

  return out;
}
