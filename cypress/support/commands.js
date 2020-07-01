const map = require("../fixtures/map.json");

Cypress.Commands.add("drapAndDrop", (move) => {
  return cy.window({ log: false }).then((win) => {
    let locator = getLocator(win, move);
    let start = locator.start;
    let end = locator.end;
    Cypress.log({
      name: "drapAndDrop",
      message: ` MOVE ${move}`
    });
    return cy
      .get(`.cubeletId-${start.parent}`, { log: false })
      .children(`.${start.child}`, { log: false })
      .trigger("mousedown", { which: 1, force: true, log: false })
      .trigger("mousemove", {
        relatedTarget: cy
          .get(`.cubeletId-${end.parent}`, { log: false })
          .children(`.${end.child}`, { log: false }),
        log: false,
      })
      .trigger("mouseup", { which: 1, log: false })
      .wait(500, { log: false });
  });
});

const getLocator = (win, move) => {
  let locator = {};
  let start = map[move].start;
  locator.start = getLocatorObj(win, start);
  let end = map[move].end;
  locator.end = getLocatorObj(win, end);
  return locator;
};

const getLocatorObj = (win, obj) => {
  return {
    parent: win.cube[obj.side][obj.face].id,
    child: win.cube[obj.side][obj.face][obj.side].element
      .getAttribute("class")
      .split(" ")
      .join("."),
  };
};