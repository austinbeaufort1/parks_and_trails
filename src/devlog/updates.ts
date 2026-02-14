export type UpdateEntry = {
  date: string; // ISO format
  title?: string;
  items: string[];
};

export const updates: UpdateEntry[] = [
  {
    date: "2026-02-13",
    title: "First Updates 🌿",
    items: [
      "Launched the updates page — now you can track our growth!",
      "Added a banner on top of the Trails Page showing how many new trails sprouted this week 🌱",
      "Added 1 Trail: Norlo Park Lower Loop",
    ],
  },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
