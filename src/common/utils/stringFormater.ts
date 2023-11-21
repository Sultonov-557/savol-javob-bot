export function formatString(string: string): string {
  let out = "";
  const lines = string.split("\n");
  const maxLenght = Math.max(...lines.map((v) => v.length));

  out += "-".repeat(maxLenght + 10) + "\n";

  for (let i of lines) {
    const space = Math.floor((maxLenght - i.length) / 2);

    out += "|";
    out += " ".repeat(space + 4) + i + " ".repeat((space || -1) + 5);
    out += "|\n";
  }

  out += "-".repeat(maxLenght + 10);

  return out;
}
