export const sportsRules: Record<string, string> = {
  "Soccer Dribble":
    "Dribble a soccer ball along the trail, keeping it within 10ft of the path at all times.",
  "Basketball Dribble":
    "Bounce a basketball along the trail without losing control or going off-path.",
  "Floor Hockey Control":
    "Guide a puck or ball with a hockey stick along the trail, staying within 10ft of the path at all times.",
  "Lacrosse Cradle":
    "Cradle a lacrosse ball on your stick while moving along the trail without dropping it.",
  "Paddle Ball Bounce":
    "Bounce a tennis, pickleball, or table tennis ball along the trail while keeping control.",
  "Disc Golf":
    "Play solo by throwing a disc along the trail, keeping it within 10 ft of the path on either side. Continue throwing along the trail until you finish, counting each throw. Try to complete the trail in as few throws as possible.",
  "Baseball Glove Carry":
    "Carry one or two baseballs in one or two gloves without dropping any.",
};

export const circusRules: Record<string, string> = {
  Juggling:
    "Keep three or more objects in the air at the same time while moving along the trail.",
  Unicycling:
    "Ride a unicycle along the trail without touching the ground with your feet.",
  "Stilt Walking":
    "Walk along the trail using stilts, staying upright the Entire time.",
  "Handstand Walk": "Walk at least 25 feet along the trail on your hands only.",
  "Poi Spinning":
    "Spin poi (or similar objects) continuously while moving along the trail.",
  "Staff Spinning":
    "Spin a staff or baton continuously while moving along the trail.",
  "Hula Hooping":
    "Keep a hula hoop spinning around your waist while moving along the trail.",
  Slacklining:
    "Cross a slackline anchored between two points; each new line must start where the last ended.",
};

export const weightRules: Record<string, string> = {
  pack: "Wearing a backpack with some weight in it while hiking. Helps your legs, core, and posture get used to carrying gear on the trail.",
  front:
    "Holding weight in front of your body, like carrying a box. Makes your core work harder and helps with balance.",
  overhead:
    "Holding weight above your head while walking. Builds shoulder strength and helps you stay steady on uneven ground.",
  vest: "Wearing extra weight close to your body. Adds challenge to your hike without changing how you move.",
  uneven:
    "Carrying more weight on one side than the other. Trains balance and core strength for real-life trail situations.",
  awkward:
    "Carrying an object that’s bulky or hard to hold, like a log or sandbag. Helps you get stronger handling uneven or shifting weight.",
};

export const environmentRules: Record<string, string> = {
  rain: "It rained during the entire hike. Trails may be wet and slippery, and staying dry and warm takes extra effort.",
  snowWholeTime:
    "Snow fell throughout the hike. Visibility, footing, and temperature can make the hike more challenging.",
  snowOnTrail:
    "Snow covered some or all of the trail. Walking requires more care, and footing may be uneven or slippery.",
  windy:
    "Strong or steady wind during the hike. Can make temperatures feel colder and balance a little harder.",
  extremeHeat:
    "Very hot conditions. Increases fatigue and the need for water, shade, and rest breaks.",
  extremeCold:
    "Very cold conditions. Staying warm and protected from the elements is important to stay comfortable and safe.",
};

export const perceptionRules: Record<string, string> = {
  Dawn: "Early morning light as the sun comes up.",
  Dusk: "Fading light as the sun goes down.",
  Night:
    "Hiking in the dark. Limited visibility and greater reliance on headlamps and awareness.",
  "After Midnight":
    "Late-night hiking hours. Darkness and fatigue can affect focus and reaction time.",
};

export const surfaceRules: Record<string, string> = {
  trailAdjacent:
    "Moving just off the main trail while staying alongside it. Requires more attention to footing and navigation.",
  "Rock Only":
    "Stepping only on rocks. Demands balance, focus, and slower, more deliberate movement.",
  "Wood Only":
    "Stepping only on wooden surfaces like logs, planks, or bridges. Can be narrow or slippery, requiring steady footing.",
  "No Bare Ground":
    "Avoiding dirt or soil completely. Forces creative foot placement and increased awareness of the environment.",
};

export const movementConstraintRules: Record<string, React.ReactNode> = {
  "One-Footed":
    "Moving while keeping one foot off the ground. Improves balance and control. Switch sides as needed. At least 3 hops on a leg before switching.",
  "Low Crawl":
    "Moving low to the ground using arms and legs. Builds full-body strength and works coordination.",
  Backwards:
    "Moving in reverse. Increases awareness and makes familiar terrain feel new, extra care recommended.",
  Hopping: "Moving forward while hopping. Adds impact and balance challenge.",
  "Duck Walk":
    "Walking in a deep squat position. Strengthens legs and challenges mobility.",
  "Hands First":
    "Moving with hands placed on the ground before the feet. Turns the hike into a playful, full-body challenge and adds a fun coordination twist to familiar terrain.",
  "Silly Walk": (
    <>
      Moving with exaggerated, playful, or unconventional steps. Encourages
      creativity, coordination, and fun. Need inspiration?{" "}
      <a
        href="https://www.youtube.com/watch?v=5ptUMe9eqYE"
        target="_blank"
        rel="noopener noreferrer"
      >
        Check out this silly walk video
      </a>
      .
    </>
  ),
};
