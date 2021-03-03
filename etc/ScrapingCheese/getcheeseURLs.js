
const {
    CheeseURL
} = require("./db");
const {promises} = require("fs");

const fetch = require("node-fetch");
const jsdom = require("jsdom");

var letterCount = 0;
const letters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z"
];

async function searchCheeseURLs() {
    letters.forEach(async (letter) => {
        for (let i = 1; i <= 10; i++) {
            if (letter !== undefined) {
                await fetch(
                    `https://cheese.com/alphabetical/?per_page=100&i=${letter}&page=${i}#top`
                )
                    .then((response) => {
                        console.log(
                            `SENT GET to https://cheese.com/alphabetical/?per_page=100&i=${letter}&page=${i}#top`
                        );
                        return response.text();
                    })
                    .then((body) => {
                        //parse the response into DOM elements to easily nab cheese names
                        var doc = new jsdom.JSDOM(body);
                        doc.window.document.querySelectorAll(".cheese-item").forEach((element) => {
                            const cheeseModel = CheeseURL.build({
                                url: "https://www.cheese.com" + element.querySelector("a").href
                            });
                            cheeseModel.save().catch((err) => {
                                //catch duplicates here and keep moving on
                                console.log(`Letter:${letter} page ${i}`);
                            });
                        });
                    });
            }
        }
    });
}

searchCheeseURLs()