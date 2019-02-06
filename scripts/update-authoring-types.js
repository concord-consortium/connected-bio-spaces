const JSTTS = require("json-schema-to-typescript");
const fs = require("fs");
const authoringSchema = require("../src/authoring-schema.json");

JSTTS.compile(authoringSchema, "AuthoringType")
  .then(ts => fs.writeFileSync("src/authoring.d.ts", ts));
