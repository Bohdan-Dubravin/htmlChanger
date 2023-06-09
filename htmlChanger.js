const fs = require("fs");
const cheerio = require("cheerio");
const currentDirectory = __dirname;

let newClasses = "";
let words;
function wordsChanger(wordsToChange) {
  words = wordsToChange;
  wordsToChange.forEach((word) => {
    changeHtml(word);
  });
}

// Read the HTML file
function changeHtml(word) {
  const specificWord = new RegExp(word, "gi");
  const replacement = `<span class="${replaceRandomLetters(word)}"></span>`;
  const html = fs.readFileSync(`${currentDirectory}/index.html`, "utf-8");
  const $ = cheerio.load(html);

  $("body")
    .find("*")
    .each(function () {
      const node = $(this);
      const text = node.html();
      const replacedText = text.replace(
        new RegExp(specificWord, "g"),
        replacement
      );
      node.html(replacedText);
    });

  $("img").each(function () {
    const image = $(this);

    if (words.some((word) => new RegExp(word, "gi").test(image.attr("alt")))) {
      image.attr("alt", "image");
    }
  });

  const modifiedHtml = $.html();
  fs.writeFileSync(`${currentDirectory}/index.html`, modifiedHtml, "utf-8");
  newClasses += `.${replaceRandomLetters(
    word
  )}::before {\n  content: '${word}';\n}\n`;

  createCssFile(newClasses);
}

function createCssFile(classWord) {
  const cssFilePath = `${currentDirectory}/style.css`;

  fs.writeFileSync(cssFilePath, classWord, "utf8", (err) => {
    if (err) {
      console.error("Error writing CSS file:", err);
    } else {
      console.log("CSS file created successfully!");
    }
  });
}

function replaceRandomLetters(string) {
  if (string.length >= 3) {
    const replacedString = "abc" + string.substring(3);
    return replacedString;
  }

  return string;
}

module.exports = wordsChanger;
