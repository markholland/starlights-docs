import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "My Docs",
      social: {
        github: "https://github.com/withastro/starlight",
      },
      sidebar: [
        {
          label: "Reference",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "OpenCDE", link: "/cde" },
            {
              label: "BCF v3.0",
              collapsed: true,
              autogenerate: { directory: "bcf-3.0" },
            },
            {
              label: "BCF v2.0",
              autogenerate: { directory: "bcf-2.0" },
            },
          ],
        },
        {
          label: "Examples",
          autogenerate: { directory: "examples" },
        },
      ],
    }),
  ],
});
