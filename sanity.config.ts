"use client";

// Sanity Studio, served at /studio. This is where the team adds and edits events.
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "neurostack",
  title: "NeuroStack Events",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Events")
              .schemaType("event")
              .child(
                S.documentTypeList("event")
                  .title("Events")
                  .defaultOrdering([{ field: "startsAt", direction: "desc" }]),
              ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    // Only events can be created from the "+" menu
    newDocumentOptions: (prev) => prev.filter((item) => item.templateId === "event"),
  },
});
