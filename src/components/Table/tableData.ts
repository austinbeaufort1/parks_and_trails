import { Row } from "../../types/trail";
import { getCalculatedFields, getCruxDetails } from "./calculateDifficulty";

export const data: Row[] = [
  {
    key: "1",
    state: "PA",
    county: "Westmoreland",
    parkName: "Twin Lakes",
    trailName: "Tamarack Trail",
    ...getCalculatedFields(0.48, 40, "middle"),
    route: "loop",
    videos: [
      ["hike", "https://youtu.be/JLWdGC3yOms?si=Qq75PoB_yx0bRtcZ"],
      ["timelapse", "https://www.youtube.com/watch?v=2rw0I8URGiQ"],
      ["bike", "https://www.youtube.com/watch?v=9iCgoBQ8zPg"],
    ],
    extras: {
      description: `The Tamarack Trail is one of three woodsy trails that can be found at Twin Lakes.
        Keep your eye out for remnants of a small bridge.`,
      crux: getCruxDetails(0.12, 39, "end"),
    },
  },
  {
    key: "2",
    state: "PA",
    county: "Westmoreland",
    parkName: "Twin Lakes",
    trailName: "Horse Trail",
    ...getCalculatedFields(2.0, 295, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/YedyFhfUruQ?si=UuRBPYPHEYoAeJwU"]],
    extras: {
      description: `Horse Trail is the most difficult trail at Twin Lakes.
      There are woodsy sections, a gravel section, and a grassy section.
      This trail has two decent sized hills to hike up.
      I would recommend boots on this one as the trail can get muddy. Found a snake on this trail.`,
      crux: getCruxDetails(0.08, 67, "end"),
    },
  },
  {
    key: "3",
    state: "PA",
    county: "Westmoreland",
    parkName: "Twin Lakes",
    trailName: "Lake Loop (Both Lakes)",
    ...getCalculatedFields(2.5, 104, "middle"),
    route: "loop",
    videos: [
      ["hike upper", "https://youtu.be/_MLTzucrVFs?si=qyLTIn6m3qUYFn01"],
      ["hike lower", "https://youtu.be/oWEZlZYTFzs?si=wjZ2HxTLkqyVnf7T"],
      ["bike", "https://youtu.be/9iCgoBQ8zPg?si=7S4zM51G_KbIlTFz"],
      ["timelapse", "https://youtu.be/8pggNO8DL_A?si=sE2G0FucZ-MUV8Ll"],
    ],
    extras: {
      description: `Brick path around both lakes. Scenic views.
      Spotted ducks, geese, red-winged blackbirds, a painted turtle, a green heron, and a blue heron.
      Great area for wildlife.`,
      crux: getCruxDetails(0.37, 94, "end"),
    },
  },
  {
    key: "4",
    state: "PA",
    county: "Westmoreland",
    parkName: "Ann Rudd Saxman Nature Park",
    trailName: "Woods Loop (Benhind the Garden)",
    ...getCalculatedFields(1.6, 226, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/JSBXogOZIhE?si=_qU0DcJb_T9jmrlK"]],
    extras: {
      description: `Hidden Gem of a Park in Greensburg, PA.
      Beautiful garden area in the spring, summer, and autumn.
      Trail extends behind the garden area back into the woods.
      Spotted butterfies, chipmunks, a groundhog. They hold beekeeper meetings here.
      Big wasp nest was down in the woods trail area.`,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "5",
    state: "PA",
    county: "Westmoreland",
    parkName: "St Clair Park",
    trailName: "Main Path",
    ...getCalculatedFields(0.82, 81, "middle"),
    route: "out & back",
    videos: [["hike", "https://youtu.be/PJHsAOMxAv8?si=dqrDuIJdVMJlltIQ"]],
    extras: {
      description: `Trail through a park in downtown Greensburg, PA.
      Here you can find a geocache, old gravestones, squirrels, birds, and more.
      Trail is paved.`,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "6",
    state: "PA",
    county: "Indiana",
    parkName: "Veterans Memorial Park",
    trailName: "Blairsville Riverfront Trail",
    ...getCalculatedFields(3.6, 108, "end"),
    route: "out & back",
    videos: [["bike", "https://youtu.be/oQcqfrEFvbg?si=q3lI09ng1ryTPwUk"]],
    extras: {
      description: `Paved trail that runs along a river. Great for biking or hiking.
      River was low when I visted and I was able to walk out to the small island areas.
      You might be able to see small waterfalls running off the mountainside on the other side of the river.
      This area is prone to flooding.`,
      crux: getCruxDetails(0.1, 41, "end"),
    },
  },
  {
    key: "7",
    state: "PA",
    county: "Indiana",
    parkName: "Yellow Creek State Park",
    trailName: "Dragonfly Pond Trail",
    ...getCalculatedFields(0.5, 9, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/xZvgYVEgv1M?si=qBY4t5fhqKX5xKyS"]],
    extras: {
      description: `A half mile loop around the pond.
      Generally flat. Said hi to a friendly cat that was on the trail watching butterflies.
      `,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "8",
    state: "PA",
    county: "Westmoreland",
    parkName: "Twin Lakes",
    trailName: "Little Crabtree Creek Trail",
    ...getCalculatedFields(2.6, 127, "middle"),
    route: "out & back",
    videos: [["bike", "https://youtu.be/7PgE3TYsdzk?si=3Bfx-MbUXMi2n2WT"]],
    extras: {
      description: `Paved hike or bike trail that extends out of the Twin Lakes park area.
        Multiple geocaches are along this trail. Talked to an older man at the end of the trail,
        he was saying one of the trees fell on him when he was younger so watch out.
      `,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "9",
    state: "PA",
    county: "Westmoreland",
    parkName: "Pleasant Valley Park",
    trailName: "Hank's Trail",
    ...getCalculatedFields(1.5, 144, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/FB0Pc9xoJmU?si=npTYqB4Fsg5Mm0uA"]],
    extras: {
      description: `This trail is part of a network of trails running through pleasant valley park.
        Both mountain bikers and hikers share the trail here so be cautious.
        Saw a wasp nest about 25 ft. off of the trail.
        Water bottle would not open. Had to use the car's jumper cable alligator clip to torque it open.
      `,
      crux: getCruxDetails(0.07, 77, "end"),
    },
  },
  {
    key: "10",
    state: "PA",
    county: "Westmoreland",
    parkName: "N/A",
    trailName: "Coal and Coke Trail",
    ...getCalculatedFields(7.6, 101, "middle"),
    route: "out & back",
    videos: [["bike", "https://youtu.be/m1C1CzageBI?si=_52zJYpDjjdac9jn"]],
    extras: {
      description: `Hike or bike, a nice trail that runs along railroad tracks for part of the way.
      `,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "11",
    state: "PA",
    county: "Westmoreland",
    parkName: "Kendi Park",
    trailName: "Jacob's Creek Multi-Use Trail",
    ...getCalculatedFields(1.2, 16, "middle"),
    route: "out & back",
    videos: [["bike", "https://youtu.be/s8aH3UtSwr8?si=iO95iFRAXxZJsqja"]],
    extras: {
      description: `Hike or bike, a short paved trail that runs along a river.
        Connects to Coal and Coke Trail.
      `,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "12",
    state: "PA",
    county: "Franklin",
    parkName: "Caledonia State Park",
    trailName: "Charcoal Hearth Trail",
    ...getCalculatedFields(2.8, 610, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/reCxH5dIM-g?si=6CZ66bjNtGLyKoHU"]],
    extras: {
      description: ` This trail is one of the more difficult at Caledonia State Park. 
        Historic trail with sites where 
        charcoal hearths existed in the past that turned wood into coal.
      `,
      crux: getCruxDetails(0.21, 278, "end"),
    },
  },
  {
    key: "13",
    state: "PA",
    county: "Armstrong",
    parkName: "N/A",
    trailName: "Apollo Kiski Riverfront Trail",
    ...getCalculatedFields(4.2, 52, "middle"),
    route: "out & back",
    videos: [["bike", "https://youtu.be/3Ert_Kh6UfA?si=DxftTlEunAAvDpNy"]],
    extras: {
      description: `
        More urban than rural. Runs through downtown Apollo.
        Has an information kiosk with a sign and recording that gives history of the Apollo area.
        A short section of the trail is on the road.
        Connects to Roaring Run Trail.
      `,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "15",
    state: "PA",
    county: "Armstrong",
    parkName: "N/A",
    trailName: "Roaring Run Trail",
    ...getCalculatedFields(8.4, 192, "middle"),
    route: "out & back",
    videos: [["bike", "https://youtu.be/OCAJaZYMXqA?si=iihlBGXYNhFFLYei"]],
    extras: {
      description: `
        Bike or hike. Rural scenic riverside trail.
        Covered bridge about halfway through the trail.
        There is a waterfall area off to the left At the end of the trail before the extension to Edmon.
      `,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "16",
    state: "PA",
    county: "Westmoreland",
    parkName: "Saint Vincent Ponds",
    trailName: "Main Trail - Loop all Ponds",
    ...getCalculatedFields(1.7, 28, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/UgSK5--B3xo?si=B2hSS5WOoU98nPnO"]],
    extras: {
      description: `The ponds at Saint Vincent are unique because they are brown due to mining activity in the past.
      Here you'll find lots of wildlife and flowers in the wetlands section behind the first pond.
      There is also a small store behind the wetlands where jams, honey, and other items are sold.`,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "18",
    state: "PA",
    county: "Franklin",
    parkName: "Calendonia State Park",
    trailName: "Whispering Pine Nature Trail",
    ...getCalculatedFields(0.27, 9, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/mP3VuAL1nzc?si=txZMyY7PojnUn_Kr"]],
    extras: {
      description: `A short quarter-ish mile trail through the pines as well as other foliage.
      A small stream runs near part of the trail.`,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "19",
    state: "PA",
    county: "Westmoreland",
    parkName: "Unv. of Pitt. Greensburg Campus",
    trailName: "Bell Memorial Trail",
    ...getCalculatedFields(1.5, 291, "middle"),
    route: "loop / out & back",
    videos: [
      ["hike", "https://youtu.be/BN_jkPmRFfo?si=fVMgGuk4FHdGxL3R"],
      ["bike", "https://youtu.be/0EjFVZ84HJU?si=ecNAuvDv-J6U1IW8"],
    ],
    extras: {
      description: `Hidden in the upper parking lot near the back of the lot, the Bell Memorial Trail
      runs up a hill and through the woods. Along this peaceful walk you can find two geocaches.
      One cache is a micro. The other is called "reach of faith", and it does indeed require a lot of faith (and a long arm).
      `,
      crux: getCruxDetails(0.1, 92, "end"),
    },
  },
  {
    key: "20",
    state: "PA",
    county: "Westmoreland",
    parkName: "B-Y Park",
    trailName: "Westmoreland Heritage Trail (Trafford to Export)",
    ...getCalculatedFields(9, 246, "middle"),
    route: "out & back",
    videos: [["bike", "https://youtu.be/S_m_9M-3j4A?si=LmQcxjQdGMZPYIM4"]],
    extras: {
      description: `The Westmoreland Heritage Trail is divided into two sections with plans to eventually
      connect the two. I covered this trail in three separate bike trips. The section from Trafford to Export
      offers a nice retreat into the woods following the river. Great for biking or hiking. The export side
      has a little history and a traincar at the end of the trail. The leaves in autumn
      are colorful.
      `,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  /*
  {
    key: '21',
    state: 'PA',
    county: 'Westmoreland',
    parkName: 'N/A',
    trailName: "Westmoreland Heritage Trail (Delmont to Slickville)",
    ...getCalculatedFields(17.8, 1049, 'middle'),
    route: 'out & back',
    videos: [
      ['bike 1', 'https://youtu.be/1pGbT7CnEgc?si=q6XpUuhcxZmcXzQ7'],
      ['bike 2', 'https://youtu.be/zRjHbhEjw48?si=isvM1NuAWn-1Dgzs'],
    ],
    extras: {
      description: `The Westmoreland Heritage Trail is divided into two sections with plans to eventually
      connect the two. I covered this trail in three separate bike trips. This section from Delmont to Slickville 
      passes the Beaver Run Reservoir and Watershed offering great views of the wildlife in the area.  
      `,
      crux: getCruxDetails(0, 0, 'end'),
    }
  },
  */
  {
    key: "22",
    state: "PA",
    county: "Westmoreland",
    parkName: "Keystone State Park",
    trailName: "Lake Loop",
    ...getCalculatedFields(2, 75, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/j9A_JQiCdEI?si=hlT-7EDeyG7o72V-"]],
    extras: {
      description: `Nice views along this two mile lake loop. You'll pass through a campground area as well.
      There are at least two additional trails you can explore as offshoots of the lake loop.`,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "23",
    state: "PA",
    county: "Westmoreland",
    parkName: "Keystone State Park",
    trailName: "Stone Lodge Trail",
    ...getCalculatedFields(1.2, 324, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/B0O7LhivsEY?si=OLTZSBNrTSUfADtS"]],
    extras: {
      description: `Historic stone lodge at the beginning of this trail loop. The trail takes you back into the woods
      behind the lodge. You can either go to the right and walk up the dirt path, or go to the left and walk up the
      grassy pipeline part of the trail.`,
      crux: getCruxDetails(0.17, 217, "end"),
    },
  },
  {
    key: "24",
    state: "PA",
    county: "Westmoreland",
    parkName: "Flinn Reserve",
    trailName: "Flinn Reserve Trail",
    ...getCalculatedFields(0.3, 65, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/8EzOrZtOuxs?si=VgLBi9PavNQBgKcR"]],
    extras: {
      description: `A short hike through a secluded woodsy area. Unlikely to encounter anyone else there.
      Saw a buck on the trail. Didn't realize it was there. The buck stood completely still until I got close and
      then it bolted. I jumped a solid 2 or 3 feet into the air.`,
      crux: getCruxDetails(0.07, 51, "end"),
    },
  },
  {
    key: "25",
    state: "PA",
    county: "Butler",
    parkName: "Graham Park",
    trailName: "Outer Loop",
    ...getCalculatedFields(2.2, 66, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/SA48UuI_wLQ?si=wsGrxQ9g67AVBmU5"]],
    extras: {
      description: `Urban Park with sports fields throughout. There is a roudabout area with wooden carvings of
      Native Americans and a little history. There is also a small garden. There are a few side trail options.
      a river is visible from some parts of the trail.`,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "26",
    state: "PA",
    county: "Westmoreland",
    parkName: "Morosini Nature Reserve",
    trailName: "Outer Loop",
    ...getCalculatedFields(1.5, 231, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/dk2HHralIeU?si=5ou0GtThesQV84B1"]],
    extras: {
      description: `Nature reserve near Delmont, PA. This may have been a farm in the past and has older
      buildings and foundations in some areas.There are multiple geocaches available here. For bird watchers
      there is a bird blind viewing area that has a box of books related to bird watching. Not too far from the
      bird blind at the top of a hill is a lookout area. On the other side of the reserve is a large tree they 
      call the "tree of life".`,
      crux: getCruxDetails(0.12, 114, "end"),
    },
  },
  {
    key: "27",
    state: "PA",
    county: "Allegheny",
    parkName: "Deer Lakes Park",
    trailName: "Three Lakes Loop",
    ...getCalculatedFields(1.5, 125, "middle"),
    route: "loop",
    videos: [
      ["hike", "https://youtu.be/tc4ruf1miA8?si=1EOaWhqi8Wg-B3k3"],
      ["timelapse", "https://youtu.be/P3Ftj_bZx7s?si=MCOD__liHeCvX1J3"],
    ],
    extras: {
      description: `The two lower lakes trail is paved. Expect to see ducks and geese on the lakes. 
      Follow the road a short distance up to the third lake. The third lake has dirt trails. People like
      to fish at this lake. There is a frisbee golf course that crosses the trail near the back of the lake.`,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "28",
    state: "PA",
    county: "Lackawanna",
    parkName: "Archbald Pothole State Park",
    trailName: "Ed Staback Regional Outer Loop",
    ...getCalculatedFields(0.8, 45, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/ypmHQYTDdgA?si=NvoLdnWwXAqKizee"]],
    extras: {
      description: `I visited this park in the winter when there was snow on the ground.
      Generally flat, had some nice hiking trails through the woods and past sports fields.
      On the other side of the park is a large pothole which the overall park is named for.
      Ed Staback Regional park is kind of contained within Archbald Pothole State Park.`,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "29",
    state: "PA",
    county: "Westmoreland",
    parkName: "Hilltop Park",
    trailName: "Bushwacking & Trolley Path",
    ...getCalculatedFields(1.2, 210, "middle"),
    route: "out & back",
    videos: [["hike", "https://youtu.be/4Pf1ttX29ik?si=_C1YdLvmyB4k9t6a"]],
    extras: {
      description: `Start at the parking lot of Hilltop Park. Take what looks to be a trail down
      into the woods. The trail gives way to bushwacking as you walk downhill. At the bottom of the hill
      there is what used to be a trolley path that you can walk. It's been grown over with grass for years.
      Walked past a guy with a rifle that was hunting coyote.`,
      crux: getCruxDetails(0.06, 57, "end"),
    },
  },
  {
    key: "30",
    state: "PA",
    county: "Westmoreland",
    parkName: "Hempfield Park",
    trailName: "Mountain Geocache Loop",
    ...getCalculatedFields(0.82, 214, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/RTbbKXJmA0I?si=ZjNXx2Zdt_wqIxrt"]],
    extras: {
      description: `Near the top of the park there is a woodsy area. Look for a gap between the trees
      and follow it straight uphill to the cache area. From there you can follow the trail down and around
      to the other side of the park where you can then walk back on the regular park paths.`,
      crux: getCruxDetails(0.09, 114, "end"),
    },
  },
  {
    key: "31",
    state: "PA",
    county: "Westmoreland",
    parkName: "Hempfield Park",
    trailName: "Main Park Loop",
    ...getCalculatedFields(0.9, 52, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/7b71bxxtEOA?si=gHBxOBZPONcAvffo"]],
    extras: {
      description: `Hempfield park has paved trails that make for a good jogging or exercise loop.
      The park has many sports fields as well as an ampitheatre. Decent chance of seeing birds in some
      areas of the park.`,
      crux: getCruxDetails(0.0, 0, "end"),
    },
  },
  {
    key: "32",
    state: "PA",
    county: "Westmoreland",
    parkName: "Indian Lake Park",
    trailName: "Lake Loop + Bow Trail + Arrow Trail",
    ...getCalculatedFields(1.2, 114, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/W4nzavHYtO8?si=YijRPPHVjsAgyA_X"]],
    extras: {
      description: `Nice paved trail around a lake with woods trails branching off near the back
      of the lake. When I was there I walked passed a downed powerline near the entrance of the woods trails.
      There is a covered bridge in the lake loop section.`,
      crux: getCruxDetails(0.15, 89, "end"),
    },
  },
  {
    key: "33",
    state: "PA",
    county: "Westmoreland",
    parkName: "N/A",
    trailName: "Bear Hollow Trails Area",
    ...getCalculatedFields(1.2, 131, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/qzZ89Hs5tjM?si=iLPC1e8agGFRfSiI"]],
    extras: {
      description: `Parking lot is across the road from this trail. The upper part of the loop takes
      you through the woods and the far side of the trail ends in a neighborhood area. Take the lower trail
      back to walk by a stream. Saw a bees nest on the lower trail. There is one section of the lower trail
      that has a rope tied to a tree because the incline is steep for a very short section. Didn't need the
      rope, but hands for balance are helpful for sure.`,
      crux: getCruxDetails(0.02, 54, "end"),
    },
  },
  {
    key: "34",
    state: "PA",
    county: "Allegheny",
    parkName: "Cranberry Township Community Park",
    trailName: "Cranberry Trail + Eden Park Extension",
    ...getCalculatedFields(2.44, 304, "middle"),
    route: "out & back",
    videos: [["hike", "https://youtu.be/IkAzHkGodkw?si=1pQViqD77tFR3xce"]],
    extras: {
      description: `A diverse trail starting in a more urban park. Quickly takes you back a gravel trail 
      through the trees, past a open field, and up the hillside past a pipeline area (nice view) into a
      woodsy area filled with chipmunks. There are a lot of chipmunks in this area, make sure to bring your
      camera. The trail ends near a lake that you can walk around before heading back.`,
      crux: getCruxDetails(0.12, 73, "end"),
    },
  },
  {
    key: "35",
    state: "PA",
    county: "Franklin",
    parkName: "Calendonia State Park",
    trailName: "Ramble Trail",
    ...getCalculatedFields(2, 49, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/gaj6a-QJb60?si=qoMC08i7y3mJq6VP"]],
    extras: {
      description: `A fairly flat woodsy trail with multiple bridges crossing a stream.
      This trail runs parallel with the Appalachian trail for a little ways. There is a small stone bridge
      near the top of the trail`,
      crux: getCruxDetails(0.12, 27, "end"),
    },
  },
  {
    key: "36",
    state: "PA",
    county: "Westmoreland",
    parkName: "Holy Sacrament Cemetery",
    trailName: "Main Loop",
    ...getCalculatedFields(0.7, 102, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/pM8UsdgpGS8?si=2mvnS7nF3fFz5g8O"]],
    extras: {
      description:
        "Peaceful walk. Nice views. Saw a group of deer on the far side of the cemetery.",
      crux: getCruxDetails(0.1, 59, "end"),
    },
  },
  {
    key: "37",
    state: "PA",
    county: "Westmoreland",
    parkName: "Saint Clair Cemetery",
    trailName: "Main Loop",
    ...getCalculatedFields(1.58, 107, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/MC8WZH87VqQ?si=bioKWYpE7wvr2Bth"]],
    extras: {
      description:
        "Large cemetery near downtown Greensburg, PA. Saw quite a few crows.",
      crux: getCruxDetails(0.13, 26, "end"),
    },
  },
  {
    key: "38",
    state: "PA",
    county: "Westmoreland",
    parkName: "Hillview Cemetery",
    trailName: "Main Loop",
    ...getCalculatedFields(0.5, 84, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/tMyH2RUhHx4?si=ooAlyu7DxgncQBo4"]],
    extras: {
      description:
        "Cemetery across from University of Pitt. Greensburg campus. Scenic views.",
      crux: getCruxDetails(0.16, 84, "end"),
    },
  },
  {
    key: "39",
    state: "PA",
    county: "North Hundington",
    parkName: "Tinkers Run Park",
    trailName: "Nettle and Ruth Trails",
    ...getCalculatedFields(1.2, 186, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/KMySOWi8CAk?si=K1g3LTFazawVpgp2"]],
    extras: {
      description: `Set of local trails that form a loop at Tinkers Run Park. 
      The trails are narrow and run between a school and fire hall.`,
      crux: getCruxDetails(0.11, 91, "end"),
    },
  },
  {
    key: "40",
    state: "PA",
    county: "Westmoreland",
    parkName: "Bushy Run Battlefield",
    trailName: "Main Loop",
    ...getCalculatedFields(1.5, 170, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/-HA1GIAIj1Y?si=N2oJhzf3HpGZwB2F"]],
    extras: {
      description: `Historic Battlefield with lots of local history and hiking trails`,
      crux: getCruxDetails(0.05, 42, "end"),
    },
  },
  {
    key: "41",
    state: "PA",
    county: "Westmoreland",
    parkName: "Winnie Palmer Nature Reserve",
    trailName: "Full Loop",
    ...getCalculatedFields(1, 61, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/23nQbxFxUsU?si=KC47PY9FPdWbHV5R"]],
    extras: {
      description: `Part paved, part woodsy trails. Lots of flower and butterflies.
      Couple of educatinal areas for kids. Across from St. Vincent College.`,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "42",
    state: "PA",
    county: "Westmoreland",
    parkName: "Westmoreland County Memorial Park",
    trailName: "Main Loop",
    ...getCalculatedFields(1, 148, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/-IzgNvAylN4?si=JUMgFP6mvx0sXLtm"]],
    extras: {
      description: `Scenic views, hilly. Nice area to walk.`,
      crux: getCruxDetails(0.1, 55, "end"),
    },
  },
  {
    key: "43",
    state: "PA",
    county: "Westmoreland",
    parkName: "Mammoth Park",
    trailName: "Lake Loop",
    ...getCalculatedFields(1, 26, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/nG9gh2kllYQ?si=7KOs-vqdUfo5auMV"]],
    extras: {
      description: `Brick trail around Mammoth Lake. Trees are colorful in autumn.
      Saw ducks and geese on the lake. There are more trails on the far end of the lake.
      A frisbee golf course is close by as well.`,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "44",
    state: "PA",
    county: "Westmoreland",
    parkName: "Mammoth Park",
    trailName: "Far Lake & Upper Park Trails Loop",
    ...getCalculatedFields(1.35, 272, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/sGDDYqj07js?si=WVr_KT2WQfYczn9D"]],
    extras: {
      description: `The far side of Mammoth Park is more of a workout than the lake loop.
      There are pavillions and veryyy large slides on top of the hill area.
      A nice view is available from a deck observation area.
      There is a fairly steep trail near the observation area that leads back down to the lake.
      `,
      crux: getCruxDetails(0.17, 147, "end"),
    },
  },
  {
    key: "46",
    state: "PA",
    county: "Franklin",
    parkName: "Caledonia State Park",
    trailName: "Three Valley Trail to Overlook (Geocache)",
    ...getCalculatedFields(1.12, 328, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/zn04zEtgpeo?si=i6kruxPcsDzoETjX"]],
    extras: {
      description: `At the end of the 3rd parking lot there is a flat trail.
      Follow the trail past the Appalachian Trail and there will be the Three Valley Trail on the right.
      Follow the trail up the mountain, take a left off into the woods and to the geocache area where you 
      can see out over Route 30.`,
      crux: getCruxDetails(0.25, 265, "end"),
    },
  },
  {
    key: "47",
    state: "PA",
    county: "Erie",
    parkName: "Presque Isle State Park",
    trailName: "Graveyard Pond Trail",
    ...getCalculatedFields(1.3, 3, "middle"),
    route: "out & back",
    videos: [["hike", "https://youtu.be/gTe2WvzpEVg?si=TzQeMNczEbYDeytG"]],
    extras: {
      description: `Located near the historic Perry Monument (worth checking out).
      Graveyard pond trail is a nice grassy inner trail with lots of wildlife. 
      Runs along an inner waterway.`,
      crux: getCruxDetails(0.25, 265, "end"),
    },
  },
  {
    key: "48",
    state: "PA",
    county: "Erie",
    parkName: "Presque Isle State Park",
    trailName: "Dead Pond Trail + Sidewalk Trail Loop",
    ...getCalculatedFields(3.55, 70, "middle"),
    route: "loop",
    videos: [
      [
        "hike - dead pond trail",
        "https://youtu.be/BWOj-KbcwiQ?si=juYOPPlnKaXXfhEI",
      ],
      ["sidewalk trail", "https://youtu.be/cdD6ZFyaaLc?si=NWKmDBeF3ronIRvr"],
    ],
    extras: {
      description: `Start at a parking lot near dead pond trail. 
      Take the trail to the lighthouse area. Then take the sidewalk trail from
      the lighthouse back to the road where you parked.
      Both trails have lots of wildlife. Dead pond trail had some sections that were sand. Lots of bugs.
      Sidewalk trail has a great view of the marshy areas.`,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "49",
    state: "PA",
    county: "Erie",
    parkName: "Presque Isle State Park",
    trailName: "Gull Point Trail",
    ...getCalculatedFields(3.1, 19, "middle"),
    route: "loop",
    videos: [
      ["hike - part 1", "https://youtu.be/HH35sUuMx9c?si=zwLjf3p71Qo7n4Sl"],
      ["part 2", "https://youtu.be/IhO3AvWKWBc?si=ig3iFElGVKZTdTBR"],
    ],
    extras: {
      description: `In my opinion this is the most scenic trail at Presque Isle.
      This trail offers two options. There is the inner trail that takes you through the marshy areas where you'll see lots of wildlife.
      On the way back I would recommend following the shoreline the whole way back for the views and breeze.
      Trail is almost all sand. 
      There is a lookout area at the end of the trail where you can see the town and a lot of presque isle.`,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "50",
    state: "PA",
    county: "Erie",
    parkName: "Presque Isle State Park",
    trailName: "Grand Tour Loop",
    ...getCalculatedFields(6.43, 80, "middle"),
    route: "loop",
    videos: [["bike", "https://youtu.be/Em_GgNG0IQM?si=XuA1XriZHQjE14OR"]],
    extras: {
      description: `Main bike path around Presque Isle. 
      You'll see 3 different lighthouses and have excellent views of the shoreline.`,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "51",
    state: "PA",
    county: "Allegheny",
    parkName: "Point State Park",
    trailName: "Loop & Extension",
    ...getCalculatedFields(2.8, 62, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/DknY7ObHH1Q?si=0r1IlIpTPY1Arbfw"]],
    extras: {
      description: `An urban park located in downtown Pittsburgh, point state park
      offers nice walking trails and connects to bike trails that run along the river.
      For this hike walk the loop of Point State Park, then take the Northern Three Rivers Heritage Trail
      out to the David. L. Lawrence Convention Center and back.`,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "52",
    state: "PA",
    county: "Westmoreland",
    parkName: "Lynch Field Park",
    trailName: "Five Star Trail",
    ...getCalculatedFields(14.3, 304, "middle"),
    route: "out & back",
    videos: [
      ["hike - part 1", "https://youtu.be/xNdgNVPzNN4?si=CKg-75XAeu8K0sRy"],
      ["part 2", "https://youtu.be/VAdHvze0Gt0?si=2XPE4U-zQ9ooGABZ"],
    ],
    extras: {
      description: `This is a rail trail that starts off near downtown Greensburg at Lynch Field Park.
      This trail turns more rural as it extends out past youngwood and past Westmoreland Community College.
      Many geocaches line this trail.
      There are businesses along the trail where you can grab water, food, or take a break.`,
      crux: getCruxDetails(0.13, 41, "end"),
    },
  },
  {
    key: "53",
    state: "PA",
    county: "Westmoreland",
    parkName: "Duff Park",
    trailName: "Funk Bikeway + WHT Loop",
    ...getCalculatedFields(3.63, 439, "middle"),
    route: "loop",
    videos: [["bike", "https://youtu.be/UAk57I22D-k?si=PI7Cdc___iR-FaU0"]],
    extras: {
      description: `Funk Bikeway runs along the riverside, scenic. 
      Funk Bikeway then connects with the Fernwood trail and takes you up the mountainside.
      It then brings you back down and out to a road. Follow the road down to the Westmoreland Heritage Trail
      and ride the WHT back to the entrance of Duff Park where you parked.`,
      crux: getCruxDetails(0.12, 74, "end"),
    },
  },
  {
    key: "54",
    state: "PA",
    county: "Westmoreland",
    parkName: "Huff Park",
    trailName: "Tiny Trail",
    ...getCalculatedFields(0.08, 2, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/sgvBt_mWSD0?si=cpJ0EP84jIAXdS1X"]],
    extras: {
      description: `Small "park" off of the Five Star Trail.
      A micro cache is hidden here.`,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "55",
    state: "PA",
    county: "Allegheny",
    parkName: "Boyce Park",
    trailName: "Blue Trail",
    ...getCalculatedFields(1.6, 212, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/ESU1EJwcoYw?si=JBBqKqHWlSnlLfy6"]],
    extras: {
      description: `A park for hiking and mountain bikes. The blue trail is one of many at Boyce Park.
      Notably near the end of the blue trail you can see ski slopes.`,
      crux: getCruxDetails(0.08, 97, "end"),
    },
  },
  {
    key: "56",
    state: "PA",
    county: "Westmoreland",
    parkName: "Union Cemetery",
    trailName: "Main Loop",
    ...getCalculatedFields(0.5, 63, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/9gKuD4exd1A?si=Tb2Pc1VQar6zr1ds"]],
    extras: {
      description: `Peaceful cemetery walk and geocache find.`,
      crux: getCruxDetails(0.09, 35, "end"),
    },
  },
  {
    key: "57",
    state: "PA",
    county: "Westmoreland",
    parkName: "Duff Park",
    trailName: "Custom Loop (see details)",
    ...getCalculatedFields(1.43, 424, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/uvJ7x80GJ6s?si=EPlGsMSBtKtHq0zC"]],
    extras: {
      description: `Custom Loop route: Start on the Violet Trail. Make a left onto the Bloodroot Trail.
      Make a right onto Roundtop Trail. Continue to Forbes Trail. Straight onto Wake Robin Trail.
      Right onto Trillium Trail. Follow the Trillium Trail back to the parking lot.
      Found my first geocache trackable on this loop.`,
      crux: getCruxDetails(0.36, 358, "end"),
    },
  },
  {
    key: "87",
    state: "PA",
    county: "Allegheny",
    parkName: "Deer Lakes Park",
    trailName: "Green Trail",
    ...getCalculatedFields(1.44, 212, "middle"),
    route: "loop",
    videos: [["hike", "https://youtu.be/2yVyoUjjOL0?si=G_M6HfiaZzrPuA8s"]],
    extras: {
      description: `Starting at the road near the first main lake, this trail takes you up into the woods.
      Going left first at the loop will take you past Transfiguration Cemetery where there is a nice view.
      There is an open field and pavilion near the back of this trail. Saw a deer.`,
      crux: getCruxDetails(0.15, 79, "end"),
    },
  },
  {
    key: "88",
    state: "PA",
    county: "Franklin",
    parkName: "N/A",
    trailName: "Green Knolls Mountain Road",
    ...getCalculatedFields(2.65, 591, "middle"),
    route: "out & back",
    videos: [],
    extras: {
      description: `Start at the pulloff into Green Knolls. Follow the road the whole way up
      the mountain. On the way back down take a left on Laurel Drive. This will eventually reconnect
      with the main road you hiked up on. Continue down the main road and take a right onto Mt. Union
      Follow Mt. Union to Michaux Drive and walk the Michaux Drive loop. Then walk back Mt. Union and
      back to the parking lot.`,
      crux: getCruxDetails(0.22, 171, "end"),
    },
  },
  {
    key: "89",
    state: "PA",
    county: "Franklin",
    parkName: "Caledonia State Park",
    trailName: "Appalachian Trail Hosack Loop",
    ...getCalculatedFields(3.59, 466, "middle"),
    route: "loop",
    videos: [],
    extras: {
      description: `Go to the third parking lot at Caledonia. Walk down the dirt road to the
      Appalachian Trail. Turn right onto the Appalachian Trail and follow it up the mountain
      until you run into a wooden fence area with pine trees. Turn right onto Quarry Run Dirt
      Road and walk down to Hosack Campground. Go into Hosack Campground and turn left. This
      will take you past the water plant and onto the WaterLine Trail. Follow the WaterLine Trail
      back to the main lots where you parked. 
      back to the parking lot.`,
      crux: getCruxDetails(0.43, 403, "end"),
    },
  },
  {
    key: "90",
    state: "OH",
    county: "Medina",
    parkName: "Princess Ledges Nature Preserve",
    trailName: "N/A",
    ...getCalculatedFields(0.82, 100, "middle"),
    route: "loop",
    videos: [],
    extras: {
      description: `A nice nature loop with ledges / boulders.
      There was lots of wildlife!`,
      crux: getCruxDetails(0.09, 53, "end"),
    },
  },
  {
    key: "91",
    state: "PA",
    county: "Franklin",
    parkName: "Pondbank, Michaux State Forest",
    trailName: "N/A",
    ...getCalculatedFields(1.2, 237, "middle"),
    route: "out & back",
    videos: [],
    extras: {
      description: ` Turn right onto White Rock Road. The road will turn into a dirt road.
      Parking area will be on the right. Follow the dirt road up to a rocky area on the right.
      Follow the trail up to the lookout point.
      back to the parking lot.`,
      crux: getCruxDetails(0.15, 136, "end"),
    },
  },
  {
    key: "92",
    state: "OH",
    county: "Cuyahoga",
    parkName: "Big Creek Reservation",
    trailName: "Lake Isaac Loop",
    ...getCalculatedFields(1.2, 59, "middle"),
    route: "loop",
    videos: [],
    extras: {
      description: ` Beautiful lake area and walking trails. The initial trail is wheelchair accessible.
      Later the trail becomes more woodsy. Autumn leaves and views along the powerlines are great in
      the fall.`,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "93",
    state: "OH",
    county: "Cuyahoga",
    parkName: "Rocky River Reservation",
    trailName: "Custom Loop",
    ...getCalculatedFields(2.88, 206, "middle"),
    route: "loop",
    videos: [],
    extras: {
      description: `
      Scenic views at the Fort Hill Stairs. You can follow the loop I did below or choose your own adventure.
      Note the crux is very steep, but it's stairs so it's not difficult.
      The loop:
      Start at the Frostville Museum. Cross the road onto the wildlife management trail.
      When a left is available, go left. Follow this loop until it connects with Sheperd Lane Trail. 
      Take the left onto Shepard Lane Trail. When you come to a road turn right. Walk a short distance
      down the road then turn left onto Mt Pleasant Loop trail. Complete this loop and you will end up
      back at Shepard Ln Road. Cross the road. Follow the trail and then turn left onto W. Channel Pond
      Loop Trail. Cross West Channel Pond and Turn right at the Rocky River Nature Center. From there
      take a left to walk up the scenic Fort Hill Stairs. Continue Left onto Fort Hill Trail Loop. 
      Follow the loop until a left turn that goes downhill is available. This will take you back to the
      wildlife management trail. Turn left and follow the trail back to the Frostville Museum.`,
      crux: getCruxDetails(0.03, 183, "end"),
    },
  },
  {
    key: "94",
    state: "PA",
    county: "Franklin",
    parkName: "Caledonia State Park",
    trailName: "Midland Trail",
    ...getCalculatedFields(1.36, 41, "middle"),
    route: "out & back",
    videos: [],
    extras: {
      description: `Woodsy walk at Calendonia Park. Mostly flat, wide path.`,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  {
    key: "1000",
    state: "PA",
    county: "Westmoreland",
    parkName: "N/A",
    trailName: "Hickory to Rich Walk",
    ...getCalculatedFields(1, 1, "middle"),
    route: "out & back",
    videos: [],
    extras: {
      description: `road walk`,
      crux: getCruxDetails(0, 0, "end"),
    },
  },
  // need to gps this one for accurate length and elevation gains
  /*
  {
    key: '91',
    state: 'PA',
    county: 'Franklin',
    parkName: 'Pondbank, Michaux State Forest',
    trailName: "White Rocks Trail",
    ...getCalculatedFields(1.2, 237, 'middle'),
    route: 'out & back',
    videos: [],
    extras: {
      description: ` Turn right onto White Rock Road. The road will turn into a dirt road.
      Parking area will be on the right. Follow the dirt road up to a rocky area on the right.
      Follow the trail up to the lookout point.
      back to the parking lot.`,
      crux: getCruxDetails(0.15, 136, 'end'),
    }
  },
  */
];
