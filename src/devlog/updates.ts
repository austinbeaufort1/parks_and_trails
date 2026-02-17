export type UpdateEntry = {
  date: string; // ISO format
  title?: string;
  items: string[];
};

export const updates: UpdateEntry[] = [
  {
    date: "2026-02-16",
    title: "Trail Additions",
    items: ["Added a trail and video for Mammoth Park main lake loop."],
  },
  {
    date: "2026-02-15",
    title: "Hello There",
    items: [
      "Added a Contact page. Created a traildepth email where users can submit requests for new trails to add to the app.",
      "Five new trails added. Four new trails at Nay Aug Park in Scranton, PA, one trail near Uniontown, PA",
      "Added Video Coming Soon Page for trails that are hiked, but video not yet available.",
    ],
  },
  {
    date: "2026-02-14",
    title: "A Toast",
    items: [
      "Added Toast Notifications on marking a trail complete for better user feedback.",
      "Fixed an error being received when entering wildlife into the trail completion form. Wildlife Witness token now displays as expected.",
      "Centered New Tokens text in token popup",
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
