export type UpdateEntry = {
  date: string; // ISO format
  title?: string;
  items: string[];
};

export const updates: UpdateEntry[] = [
  {
    date: "2026-02-14",
    title: "A Toast",
    items: [
      "Added Toast Notifications on marking a trail complete for better user feedback.",
    ],
  },
  {
    date: "2026-02-13",
    title: "First Updates 🌿",
    items: [
      "Launched the updates page — now you can track our growth!",
      "Added a banner on top of the Trails Page showing how many new trails sprouted this week 🌱",
      "Added 1 Trail: Norlo Park Lower Loop",
      "Added 'View Memories' button to preview overlay on map view for completed trails. This pattern matches the trail cards.",
    ],
  },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
