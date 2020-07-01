const solver = require("rubiks-cube-solver");

describe("Rubik's cube solve", () => {
  it("should solve the Rubik's cube", () => {
    cy.visit("/");
    cy.window().then((win) => {
      win.demoStop();
      cy.get("nav.show", { timeout: 6000 })
        .should("exist")
        .get("#actionShuffle")
        .click();
      cy.wait(10000);
      cy.get("#actionShuffle").click().wait(1000);
    });

    let sides = ["front", "right", "up", "down", "left", "back"];
    let traversalOrder = {
      front: [
        "northWest",
        "north",
        "northEast",
        "west",
        "origin",
        "east",
        "southWest",
        "south",
        "southEast",
      ],
      right: [
        "northWest",
        "north",
        "northEast",
        "west",
        "origin",
        "east",
        "southWest",
        "south",
        "southEast",
      ],
      up: [
        "northWest",
        "north",
        "northEast",
        "west",
        "origin",
        "east",
        "southWest",
        "south",
        "southEast",
      ],
      down: [
        "southWest",
        "west",
        "northWest",
        "south",
        "origin",
        "north",
        "southEast",
        "east",
        "northEast",
      ],
      left: [
        "northEast",
        "east",
        "southEast",
        "north",
        "origin",
        "south",
        "northWest",
        "west",
        "southWest",
      ],
      back: [
        "northEast",
        "east",
        "southEast",
        "north",
        "origin",
        "south",
        "northWest",
        "west",
        "southWest",
      ],
    };
    let mappingOfColor = {};

    cy.window().then((win) => {
      sides.map((side) => {
        let origin = win.cube[side].origin[side].color.initial;
        mappingOfColor[origin] = side.substring(0, 1);
      });

      let cubeState = () => {
        let cubeState = "";
        return new Cypress.Promise((resolve) => {
          sides.forEach((side) => {
            let colorsOfSide = traversalOrder[side].map(
              (loc) => win.cube[side][loc][side].color.initial
            );

            let colorsToSideState = colorsOfSide.reduce(
              (previousColorSide, currentColor) => {
                return previousColorSide + mappingOfColor[currentColor];
              },
              ""
            );

            cubeState = cubeState.concat(colorsToSideState);
          });
          resolve(cubeState.toString());
        });
      };

      cubeState()
        .then((cube) => {
          return getSolution(cube);
        })
        .then((moves) => moves.forEach((steps) => moveStep(steps)));
    });
  });
});

function moveStep(step) {
  let move = step.toUpperCase();
  let count = 1;

  if (!(step.indexOf("PRIME") >= 0)) {
    move = move.substring(0, 1);
  }

  if (step.length === 2) {
    count = 2;
  }

  cy.log(`current move: ${step} & count: ${count}`);

  while (count > 0) {
    cy.drapAndDrop(move);
    count--;
  }
}

const getSolution = (cube) => {
  let solveMoves = solver(cube);
  cy.log(solveMoves);
  let steps = solveMoves.split(" ");
  return steps;
};
