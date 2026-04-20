export type UpdateEntry = {
  date: string; // ISO format
  title?: string;
  items: string[];
};

export const updates: UpdateEntry[] = [
  {
    date: "2026-04-16",
    title: "Rock Arch Trail",
    items: ["Added Rock Arch Trail to the database."],
  },
  {
    date: "2026-04-13",
    title: "Two New Nature Reserves",
    items: ["Added hikes for the Tomer and McGinnis Nature Reserves."],
  },
  {
    date: "2026-04-12",
    title: "New Trails!",
    items: [
      "Two new trails and videos added: Winnie Palmer Nature Reserve in Latrobe and Hill Climb at Boyce Park.",
    ],
  },
  {
    date: "2026-04-03",
    title: "Trails",
    items: ["Five new videos added for newest adventures."],
  },
  {
    date: "2026-03-26",
    title: "Trails",
    items: ["New Trail and Video Added for Boyce Park"],
  },
  {
    date: "2026-03-21",
    title: "Tagging Trails",
    items: [
      "Added Tags to Trails and the ability to filter by tags in the filter sidebar.",
      "Two new trails added by CCAC.",
    ],
  },
  {
    date: "2026-03-15",
    title: "New trail!",
    items: ["Added Keller-Skena Nature Reserves Loop"],
  },
  {
    date: "2026-03-14",
    title: "New Icon and trail!",
    items: [
      "Added wetlands icon to trail types.",
      "Added new trail for wetland one at Saint Vincent Ponds.",
    ],
  },
  {
    date: "2026-03-13",
    title: "Driving Directions",
    items: [
      "Added driving directions for apple maps and google maps to the details sidebar for each trail.",
    ],
  },
  {
    date: "2026-03-12",
    title: "New Trails",
    items: ["Added trails at St. Vincent Ponds and Wetlands"],
  },
  {
    date: "2026-03-09",
    title: "New Trails",
    items: ["Added trails at Saint Xavier's Preserve"],
  },
  {
    date: "2026-03-08",
    title: "Map Updates and New Trails",
    items: [
      "Map icons updated to give more insight. At first glance trail types can now be distinguished as hike, walk, historic, any other special features, etc.",
      "Added new trails!",
    ],
  },
  {
    date: "2026-02-27",
    title: "Revision and New Trail",
    items: [
      "Revised Effort Level Scale.",
      "Added Graham Park trail and video",
      "Added video for Norlo Park",
    ],
  },
  {
    date: "2026-02-26",
    title: "Video Update",
    items: ["Added video for upper lake hill climb in Twin Lakes, PA."],
  },
  {
    date: "2026-02-25",
    title: "Fresh Trail and Videos",
    items: [
      "Added Peach Park Trail",
      "Added new videos for Historic Hannahstown, Peach Park, and Weatherwood Park",
    ],
  },
  {
    date: "2026-02-19",
    title: "Sort those trails!",
    items: [
      "On the trail cards page users can now sort by distance, effort level, angle, etc.",
    ],
  },
  {
    date: "2026-02-18",
    title: "Trail Additions",
    items: [
      "New Trails Added!",
      "Videos embedded into trail cards",
      "Trail Points surface updated for accuracy across multiple trails.",
      "Angle descriptions updated.",
    ],
  },
  {
    date: "2026-02-16",
    title: "Trail Additions",
    items: [
      "Added a trail and video for Mammoth Park main lake loop.",
      "Added a trail in Deer Lakes Park",
    ],
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
