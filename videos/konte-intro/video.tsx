import { defineVideo, asset, soundtrack, Audio, Composition, Cutin, Image, Subtitle, Video, type MediaAsset } from "konte";
import { videoMinimaxH3R2v } from "konte/workspace/adapters/comfy/video_minimax_h3_r2v.js";
import direction from "./direction";
import animatic from "./animatic";
import reference from "./reference";
import { TERMINAL, DateCard, FadeIn, FORUM_SEL, GEN_AT, GenStrip, MangaStrip, MANGA_AT, Pointer, Screen, TextSelect } from "./screens";

const STYLE =
  "2D-animated. A modern flat-colour anime illustration with bold, clean dark outlines of even weight, bright flat cel colours and one simple step of soft lavender shading.";

const FILM_STYLE = "watercolor. A soft, velvety hand-painted gouache picture-book illustration with gentle round brush texture and soft edges.";

const KONTE_LOOK =
  "a wavy black bob with violet-dyed tips underneath and one small curl sticking up on top, a white headband printed with violet stars tied in a big bow on top of her head, a black choker, an oversized white hoodie with a violet konte logo on the chest and a thin violet shoulder-bag strap across it";

const HOLD_LOOK =
  "Through every frame the picture keeps the look of <Picture 1>: the same bold, clean dark outlines of even weight, the same bright flat cel colours with one simple step of soft shading, the same palette and light, drawn as hand-animated 2D anime with crisp, steady line work.";

const HOLD_GIRL = `The girl keeps her look exactly as in <Picture 1> in every frame: ${KONTE_LOOK}, her face, big dark eyes and hair shape unchanged.`;

const VOICE = "The girl (S1), an early-teens girl with a bright, light, crisp voice,";

const HALL = "Soft rain patters on the long row of hallway windows, an airy, quiet school-hallway echo underneath.";
const ROOM_DAY = "Soft steady rain patters on the window glass, with a faint, quiet bedroom room tone underneath.";
const ROOM_NIGHT = "Soft rain on the dark window at night, with a faint, quiet bedroom room tone underneath.";

const CUTIN_STYLE = { borderRadius: "1.2vmax", overflow: "hidden", boxShadow: "0 0.6vmax 1.8vmax rgba(0,0,0,.45)" };

/** One take moving through the shot's accepted board panel, passed as its keyframe; a shot with a line rides its board stem so the lips follow it. */
function motion(o: { panel: MediaAsset<"image">; frame: string; summary: string; text: string; sound: string; stem?: MediaAsset<"audio">; girl?: boolean; style?: string; hold?: string; pin?: boolean }) {
  return asset("motion", videoMinimaxH3R2v, {
    image1: o.panel,
    ...(o.pin ? { startImage: o.panel } : {}),
    ...(o.stem ? { audioStem: o.stem } : {}),
    prompt: {
      subjectDefinitions: [`<Picture 1> is the ${o.pin ? "first frame" : "keyframe"} of [Shot 1]: ${o.frame}.`],
      summary: { tasks: ["keyframe completion"], text: o.summary },
      retentionAnalysis: [
        o.pin
          ? `<Picture 1> ([Shot 1] first frame): fully_preserved - the framing, the set, the light, the line and the colours hold${o.girl ? ", and the girl's face, hair and clothing" : ""}; the motion develops forward from it as the description writes it.`
          : `<Picture 1> ([Shot 1] keyframe): partially_preserved - the framing, the set, the light, the line and the colours hold through the whole shot${o.girl ? ", and the girl's face, hair and clothing" : ""}; its pose is the moment the motion passes through, as the description writes it.`,
      ],
      detailedDescription: {
        style: o.style ?? STYLE,
        shots: [
          `${o.pin ? "The shot begins from <Picture 1>." : "The shot's keyframe corresponds to <Picture 1>, whose framing, set and light hold from the first frame to the last."} ${o.text} ${o.hold ?? HOLD_LOOK}${o.girl ? ` ${HOLD_GIRL}` : ""}`,
        ],
      },
      overallSoundscape: o.sound,
      nonDiegeticMusic: "N/A",
    },
  });
}

/** The burned-in subtitle of a shot's spoken line; `left` keeps it clear of a cutin in the lower right. */
const line = (text: string, start: number, end: number, left?: boolean) => (
  <Subtitle
    entries={[{ start, end, text }]}
    className={left ? "left-[4vmax] right-[36%]" : undefined}
    style={{ zIndex: 50, paddingBottom: "calc(4.2vmax - 5vh)", fontSize: "2.2vmax", fontWeight: 700, lineHeight: 1.3, letterSpacing: "0.01em", filter: "none" }}
    lineStyle={{ padding: "0.35vmax 1.1vmax", borderRadius: "0.5vmax", background: "rgba(24,18,44,.72)" }}
  />
);

export default defineVideo(direction, {
  timeline: ({ shot }) => {
    type Id = Parameters<typeof animatic.shot>[0];
    const img = (id: Id, name: string) => animatic.shot(id).image(name);
    const key = (id: Id) => animatic.shot(id).image("key");
    const stem = (id: Id) => animatic.shot(id).stem;

    return {
      soundtracks: [soundtrack("bgm", reference.bgm, { duck: true, fadeIn: 0.5, fadeOut: 2 })],
      shots: shot("01", () => {
        const k = motion({
          panel: key("01"),
          girl: true,
          frame: "close on the girl in a rainy school hallway, hugging a thick stack of manga pages to her chest, her face turned toward a festival poster at the left edge, eyes sparkling",
          summary: "In the rainy school hallway, the girl's eyes fall on the film festival poster and her face lights up.",
          text: "Close on the girl in the empty school hallway after class, soft cool daylight from the rainy windows behind her at the right rimming her hair. At the left edge, out of focus, the edge of the festival poster on the cork bulletin board. Both of her arms hug the thick stack of manga pages to her chest. She opens on a curious look toward screen left; over the first second her eyes widen, catching on the poster, big round highlights sparkling in them; her eyebrows lift high, her lips part, and a breathless, delighted smile spreads across her face, a pink blush rising on her cheeks. Her arms squeeze the manga pages a little tighter. Her gaze stays on the poster at the left, below and away from the lens, the whole shot. The camera holds a static shot.",
          sound: `${HALL} A small, delighted intake of breath.`,
        });
        return (
          <Composition>
            <Video src={k} hasAudio />
          </Composition>
        );
      })
        .nextShot("02", ({ script }) => {
          const k = motion({
            panel: key("02"),
            stem: stem("02"),
            frame: 'the school film festival poster pinned to a cork bulletin board among other notices, the girl\'s index finger at the left end of its yellow "Entries due SUNDAY" band',
            summary: "The girl's finger traces the deadline band on the festival poster as she gasps with delight.",
            text: `Seen square-on and close, the festival poster hangs pinned to the cork board among other club notices, its "FILM FESTIVAL" heading at the top and its yellow band reading "Entries due SUNDAY" near the bottom. The girl's right hand, in the white sleeve cuff, comes in from the lower right with its index finger touching the yellow band under the word "SUNDAY". Over the first second her fingertip slides clearly leftward along the band to the start of "Entries due", then slides back rightward under the whole line to the end of "SUNDAY" and taps it twice, the other fingers loosely curled. The poster and the notices stay flat and still. Off screen, ${VOICE} draws a quick breath and then says it with delight spilling over, <d>[English] ${script.konte[0]}</d> and falls quiet as her finger reaches the end of the band. The camera holds a static shot.`,
            sound: `${HALL} A faint papery whisper as her fingertip slides across the poster.`,
          });
          return (
            <Composition>
              <Video src={k} hasAudio />
              {line(script.konte[0]!, 0.4, 2.2)}
            </Composition>
          );
        })
        .nextShot("03", ({ script }) => {
          const k = motion({
            panel: key("03"),
            stem: stem("03"),
            girl: true,
            frame: "the girl standing in the rainy school hallway in front of the bulletin board, holding a thick stack of manga pages high over her head in both hands, grinning proudly",
            summary: "In the hallway, the girl holds her finished manga high and declares she will make it into a movie.",
            text: `At standing eye level in the empty school hallway, the cork bulletin board on the left wall, the row of rainy windows along the right. The girl stands just right of the board, waist-up, holding the thick stack of manga pages high over her head with both hands. She pushes the stack a little higher and gives it a small proud shake, her chest puffing out and her chin lifting toward it. ${VOICE} declares it proudly, <d>[English] ${script.konte[0]}</d> Her lips close and the speaking motion stops, and she ends with a wide, proud grin, the stack held high and steady. The camera holds a static shot.`,
            sound: `${HALL} The manga pages riffle softly as she lifts them.`,
          });
          return (
            <Composition>
              <Video src={k} hasAudio />
              {line(script.konte[0]!, 0.5, 3.3)}
            </Composition>
          );
        })
        .nextShot("04", () => (
          <Composition>
            <Image src={key("04")} fill />
          </Composition>
        ))
        .nextShot("n01", () => {
          const k = motion({
            panel: key("n01"),
            girl: true,
            frame: "the girl at her desk by the rainy window in the daytime, lifting the lid of a small white laptop with both hands, her manga stack on the desk at the right",
            summary: "Back in her room, the girl opens her laptop beside her manga.",
            text: "Soft, cool rainy daylight from the window at the left, raindrops running down the glass along the left edge. The girl sits behind the desk, waist-up, both hands on the top corners of the small white laptop's half-raised lid, its back to the camera; the thick manga stack lies flat at the right of the desk. She lifts the lid the rest of the way open in one smooth move, and a cool white glow from the screen spreads up over her chin and cheeks; her eyes brighten with curiosity and her small eager smile widens. The manga stack holds still. The camera holds a static shot.",
            sound: `${ROOM_DAY} The small click of the laptop's hinge and a faint hum as it wakes.`,
          });
          return (
            <Composition>
              <Video src={k} hasAudio />
            </Composition>
          );
        })
        .nextGraphicShot("n02", () => (
          <Composition>
            <Screen src={img("n02", "screen")} next={img("n02", "screenNext")} at={0.4} fade={0.12} focus={[0.18, 0.5, 1.15]}>
              <Pointer from={[0.3, 0.3]} to={[0.15, 0.725]} move={0.9} click={1.5} />
            </Screen>
          </Composition>
        ))
        .nextGraphicShot("n03", () => (
          <Composition>
            <Screen src={img("n03", "screen")} focus={[0.64, 0.42, 1.35]} />
          </Composition>
        ))
        .nextShot("n04", ({ script }) => {
          const k = motion({
            panel: key("n04"),
            stem: stem("n04"),
            girl: true,
            frame: "close on the girl in the daytime, lit from below by a laptop screen, a pleased, surprised little smile",
            summary: "Watching her first clip, the girl breaks into a pleased smile.",
            text: `Soft, cool daylight; the rainy window glows at the left, a fold of pale violet curtain behind her. Close on the girl, a cool white glow rising onto her face from the screen just below the frame. Her eyebrows lift in surprise and her eyes widen a little, then the corners of her mouth curl up and the smile spreads over her whole face, her cheeks turning pink, her shoulders giving one small happy bounce. ${VOICE} says it with a small happy bounce, surprised it came out better than she expected, <d>[English] ${script.konte[0]}</d> Her lips close and the speaking motion stops, and she keeps smiling down at the screen. The camera holds a static shot.`,
            sound: `${ROOM_DAY} The faint sound of rain playing from the laptop's small speaker.`,
          });
          return (
            <Composition>
              <Video src={k} hasAudio />
              {line(script.konte[0]!, 0.2, 1.8)}
            </Composition>
          );
        })
        .nextGraphicShot("n05", () => (
          <Composition>
            <Screen src={img("n05", "screen")} next={img("n05", "screenNext")} at={0.5} steps={[{ src: img("n05", "screen3"), at: 1.1 }]} fade={0.1} focus={[0, 1, 1.3]} />
          </Composition>
        ))
        .nextShot("n06", ({ script }) => {
          const k = motion({
            panel: key("n06"),
            stem: stem("n06"),
            pin: true,
            girl: true,
            frame: "very close on the girl in the daytime, leaning in toward a laptop screen below the frame, frowning",
            summary: "The girl leans in toward the screen below the frame and frowns.",
            text: `Soft, cool daylight; the rainy window glows at the left. Very close on the girl, her face large in the frame, a cool white glow rising onto it from the screen just below the frame. She leans in a little closer, her eyebrows drawing together into a small frown, her lips pushing into a doubtful pout, her eyes searching the screen below. ${VOICE} murmurs it softly to herself, barely above a whisper, <d>[English] ${script.konte[0]}</d> Her lips close and the speaking motion stops, and she stays frowning at the screen. The camera holds a static shot.`,
            sound: `${ROOM_DAY}`,
          });
          return (
            <Composition>
              <Video src={k} hasAudio />
              {line(script.konte[0]!, 0.3, 1.9)}
            </Composition>
          );
        })
        .nextGraphicShot("n07", () => (
          <Composition>
            <Screen
              src={img("n07", "screen")}
              next={img("n07", "screenNext")}
              at={0.4}
              steps={[
                { src: img("n07", "screen3"), at: 0.8 },
                { src: img("n07", "screen4"), at: 1.2 },
              ]}
              fade={0.08}
            />
          </Composition>
        ))
        .nextShot("07a", () => {
          const k = motion({
            panel: key("07a"),
            frame: "close on the bedroom's rainy window at night, the sky outside deep navy, raindrops on the glass",
            summary: "Night has fallen; raindrops run down the dark window.",
            text: "Night. Close on the tall bedroom window, its glass filling the frame, a fold of pale violet curtain at the right edge, the sky beyond a deep navy blue over dark rooftops with a few warm windows. Raindrops slide down the glass in slow, thin streaks, one or two larger drops gathering and running down to the bottom of the pane; the curtain and the rooftops hold still. The camera holds a static shot.",
            sound: "Rain tapping on the dark window glass at night, a quiet room behind it.",
          });
          return (
            <Composition>
              <Video src={k} hasAudio />
            </Composition>
          );
        })
        .nextShot("n08", ({ script }) => {
          const k = motion({
            panel: key("n08"),
            stem: stem("n08"),
            girl: true,
            frame: "at night at her desk, the girl slumped with her cheek in her palm in front of an open small white laptop, her manga stack at the right",
            summary: "Late at night, the girl slumps over her laptop and sighs.",
            text: `Night: the rainy window at the left is dark navy blue, warm lamplight from the left, the laptop's cool glow on her face. The girl sits behind the desk, waist-up, her elbow on the desk and her cheek sunk into her palm, the small white laptop open in front of her, the thick manga stack at the right of the desk. Her shoulders sink a little lower and her heavy eyelids droop as she lets out a long, slow breath. ${VOICE} says it with a long tired sigh, at a loss, <d>[English] ${script.konte[0]}</d> Her lips close and the speaking motion stops, and she stays slumped, staring at the screen. The camera holds a static shot.`,
            sound: `${ROOM_NIGHT} A faint hum from the laptop.`,
          });
          return (
            <Composition>
              <Video src={k} hasAudio />
              {line(script.konte[0]!, 0.3, 2.8)}
            </Composition>
          );
        })
        .nextGraphicShot("n09", ({ script }) => (
          <Composition>
            <Screen src={img("n09", "screen")} focus={[0.3, 0.45, 1.08]}>
              <TextSelect box={FORUM_SEL.box} at={FORUM_SEL.at} dur={FORUM_SEL.dur} />
              <Pointer from={FORUM_SEL.from} to={FORUM_SEL.start} move={0.4} second={{ to: FORUM_SEL.end, at: FORUM_SEL.at, move: FORUM_SEL.dur }} />
            </Screen>
            <Audio src={animatic.shot("n09").audio("line")} start={FORUM_SEL.at} />
            {line(script.konte[0]!, FORUM_SEL.at, 2.4)}
          </Composition>
        ))
        .nextShot("n10", ({ script }) => {
          const k = motion({
            panel: key("n10"),
            stem: stem("n10"),
            girl: true,
            frame: "close on the girl at night, her face turned toward a laptop at the lower left, lit by its glow, head tilted, half doubtful",
            summary: "At night, the girl tilts her head at the screen, half doubtful.",
            text: `Night: the window at the left is a dark navy blur, warm lamplight from the left. Close on the girl, her face turned three-quarters toward the small laptop at the lower left, lit by its cool glow. She tips her whole head clearly further toward screen left, her eyebrows tipping up in the middle, uncertain, her eyes staying on the screen; her mouth stays small, her lips moving only a little as she speaks, their corners barely lifted. ${VOICE} murmurs it half doubtfully, keeping her hopes small, <d>[English] ${script.konte[0]}</d> Her lips close into a thin, unsure line and the speaking motion stops, and she holds the tilt, still looking at the screen. The camera holds a static shot.`,
            sound: `${ROOM_NIGHT} The faint hum of the laptop fan.`,
          });
          return (
            <Composition>
              <Video src={k} hasAudio />
              {line(script.konte[0]!, 0.3, 1.9)}
            </Composition>
          );
        })
        .nextGraphicShot("16", ({ script }) => {
          const k = motion({
            panel: key("16"),
            stem: stem("16"),
            girl: true,
            frame: "close on the girl at night, lit from below by a laptop screen, a shy, determined smile",
            summary: "At night, the girl types on her laptop with a shy smile, reading out what she types.",
            text: `Night: the window at the left edge is a dark navy blur, warm lamplight from the left. Close on the girl, her head and shoulders filling the frame, lit from below by the cool white glow of a laptop screen just below the frame. Her eyes stay lowered toward the bottom edge; her shoulders dip and bob gently as her hands, below the frame, type in small bursts. ${VOICE} reads it out as she types, a little shy but serious, <d>[English] ${script.konte[0]}</d> Her lips close and the speaking motion stops, and her shy, determined little smile deepens, her cheeks turning faintly pink. The camera holds a static shot.`,
            sound: `${ROOM_NIGHT} The light patter of laptop keys in small bursts.`,
          });
          return (
            <Composition>
              {TERMINAL["16"]!()}
              <Cutin at="bottom-right" size={0.34} style={CUTIN_STYLE}>
                <Video src={k} hasAudio />
              </Cutin>
              {line(script.konte[0]!, 0.7, 3.8, true)}
            </Composition>
          );
        })
        .nextGraphicShot("17", () => (
          <Composition>
            {TERMINAL["17"]!()}
            <MangaStrip
              panels={[
                { src: reference.mangaRain, id: "01", at: MANGA_AT[0]! },
                { src: reference.mangaGirl, id: "02", at: MANGA_AT[1]! },
                { src: reference.mangaWhale, id: "03", at: MANGA_AT[2]! },
                { src: reference.mangaHarbour, id: "80", at: MANGA_AT[3]! },
              ]}
            />
          </Composition>
        ))
        .nextGraphicShot("18", () => <Composition>{TERMINAL["18"]!()}</Composition>)
        .nextShot("19", ({ script }) => {
          const k = motion({
            panel: key("19"),
            stem: stem("19"),
            girl: true,
            frame: "at night at her desk, the girl with her fingertips on the lid of her small open laptop, staring at it, worried",
            summary: "At night, the girl rests her fingers on her tiny laptop and wonders whether it could ever run a GPU job.",
            text: `Night: the rainy window at the left is dark navy blue, warm lamplight from the left. The girl sits behind the desk, waist-up, the small white laptop open in front of her, its back to the camera, the fingertips of her hand on the frame's left resting on the top edge of its lid. She leans her head toward the screen and peers at the little machine, her eyebrows tipping up in the middle, her eyes going glassy and wobbling, her mouth a small wavy line. ${VOICE} asks it hesitantly, her voice wobbling as if about to cry, <d>[English] ${script.konte[0]}</d> Her lips close and the speaking motion stops, and she stays staring at the laptop, worried. The camera holds a static shot.`,
            sound: `${ROOM_NIGHT} The laptop's hinge creaks faintly under her fingertips.`,
          });
          return (
            <Composition>
              <Video src={k} hasAudio />
              {line(script.konte[0]!, 0.5, 2.8)}
            </Composition>
          );
        })
        .nextGraphicShot("20", () => <Composition>{TERMINAL["20"]!()}</Composition>)
        .nextGraphicShot("21", () => (
          <Composition>
            <Screen src={img("21", "screen")} next={img("21", "screenNext")} at={0.7}>
              <Pointer from={[0.62, 0.62]} to={[0.24, 0.235]} move={0.5} click={0.6} />
            </Screen>
          </Composition>
        ))
        .nextGraphicShot("22", () => (
          <Composition>
            <Screen src={img("22", "screen")} next={img("22", "screenPasted")} at={0.5} fade={0.06} focus={[0.5, 0.3, 1.8]} />
          </Composition>
        ))
        .nextGraphicShot("23", () => (
          <Composition>
            {TERMINAL["23"]!()}
            <GenStrip
              items={[
                { src: reference.paperWhale, label: "paperWhale", start: GEN_AT["23"].start, at: GEN_AT["23"].at[0] },
                { src: reference.filmGirl, label: "girl", start: GEN_AT["23"].start, at: GEN_AT["23"].at[1] },
                { src: reference.filmTown, label: "harbourTown", start: GEN_AT["23"].start, at: GEN_AT["23"].at[2] },
              ]}
            />
          </Composition>
        ))
        .nextShot("24", ({ script }) => {
          const k = motion({
            panel: key("24"),
            stem: stem("24"),
            girl: true,
            frame: "close on the girl at night, lit by a laptop screen, hands clasped under her chin, her face lighting up in wonder",
            summary: "At night, lit by the screen, the girl's face lights up in wonder.",
            text: `Night: the window at the left is a dark navy blur, warm lamplight from the left. Close on the girl, her face lit from below and in front by a bright cool white-blue screen glow, tiny reflections of scrolling text lines flickering in her eyes. Her eyes widen even further, their sparkling highlights growing; her eyebrows lift and her mouth opens wide into an amazed, delighted smile, her clasped hands bouncing once under her chin. ${VOICE} breathes it out in amazement, her voice lifting into delight, <d>[English] ${script.konte[0]}</d> Her lips stay parted in the smile as the sound ends. The camera holds a static shot.`,
            sound: `${ROOM_NIGHT} A faint hum from the laptop.`,
          });
          return (
            <Composition>
              <Video src={k} hasAudio />
              {line(script.konte[0]!, 0.4, 1.8)}
            </Composition>
          );
        })
        .nextGraphicShot("25", () => <Composition>{TERMINAL["25"]!()}</Composition>)
        .nextGraphicShot("26", ({ script }) => {
          const k = motion({
            panel: key("26"),
            stem: stem("26"),
            girl: true,
            frame: "close on the girl at night, turned three-quarters toward screen left, lit by a laptop just past the lower left corner, her arm reaching down to its trackpad, her eyes chasing the cursor with an eager grin",
            summary: "At night, the girl glides the cursor across her screen and clicks one picture at once.",
            text: `Night: the window at the left is a dark navy blur, warm lamplight from the left. Close on the girl, her face filling most of the frame, turned three-quarters toward screen left, lit from the lower left by a cool white glow from the laptop just out of frame. Her arm on the frame's left reaches down past the lower left corner to the laptop's trackpad; over the first two seconds her shoulder and upper arm shift steadily sideways as her hand glides the cursor across the trackpad, and her eyes, turned down toward the screen at the lower left, travel along it, following the cursor. Then her shoulder gives one small, firm dip as her finger clicks, and her eyes light up. ${VOICE} says it instantly and decisively, <d>[English] ${script.konte[0]}</d> Her lips close and the speaking motion stops, and she breaks into a small delighted laugh, her shoulders bouncing. The camera holds a static shot.`,
            sound: `${ROOM_NIGHT} The soft whisper of a fingertip on a trackpad, one crisp click, then a short, happy giggle.`,
          });
          return (
            <Composition>
              <Screen src={img("26", "screen")} next={img("26", "screenNext")} at={2.3} fade={0.08} focus={[0.5, 0.5, 1.15]}>
                <Pointer from={[0.5, 0.6]} to={[0.862, 0.383]} move={2.0} click={2.2} />
              </Screen>
              <Cutin at="bottom-right" size={0.3} style={CUTIN_STYLE}>
                <Video src={k} />
              </Cutin>
              <Audio src={animatic.shot("26").audio("line")} start={1.1} volume={0.8} />
              {line(script.konte[0]!, 1.2, 2.8, true)}
            </Composition>
          );
        })
        .nextGraphicShot("26a", () => <Composition>{TERMINAL["26a"]!()}</Composition>)
        .nextGraphicShot("26b", () => (
          <Composition>
            <Screen src={img("26b", "screen")} next={img("26b", "screenNext")} at={1.0} focus={[0.43, 0.4, 1.25]} />
          </Composition>
        ))
        .nextShot("26c", () => {
          const k = motion({
            panel: key("26c"),
            frame: "at night, seen from above beside the corner of a glowing laptop, the girl's hand holding up the top page of her manga, its paper whale panel looking out with a gentle eye",
            summary: "Beside her laptop, the girl lifts her manga page and looks at the whale's gentle eye.",
            text: "Night, seen from above onto the evenly lit plain white desk, the corner of the white laptop at the upper right, its cool glow spilling onto the desk. The girl's right hand holds the top page of the manga stack by its right edge and lifts it slightly toward the camera, the ink panel of the paper whale with its small, gentle eye facing up; the hand then holds still, the page steady, the whale's eye near the middle of the frame. The rest of the stack and the laptop hold still. The camera holds a static shot.",
            sound: `${ROOM_NIGHT} The soft rustle of a paper page.`,
          });
          return (
            <Composition>
              <Video src={k} hasAudio />
            </Composition>
          );
        })
        .nextGraphicShot("27", ({ script }) => (
          <Composition>
            <Screen
              src={img("27", "screen")}
              next={img("27", "screenPinned")}
              at={1.0}
              steps={[
                ...script.konte[0]!.split(" ").map((_, i) => ({ src: img("27", `screenTyped${i + 1}`), at: 1.45 + i * 0.45 })),
                { src: img("27", "screenDraft"), at: 3.6 },
              ]}
              fade={0.05}
              focus={[0.43, 0.4, 1.29]}
            >
              <Pointer from={[0.55, 0.7]} to={[0.285, 0.293]} move={0.9} click={1.0} second={{ to: [0.726, 0.2], at: 3.2, move: 0.3, click: 3.55 }} />
            </Screen>
            <Audio src={animatic.shot("27").audio("line")} start={1.2} />
            {line(script.konte[0]!, 1.3, 3.9)}
          </Composition>
        ))
        .nextGraphicShot("27a", () => (
          <Composition>
            {TERMINAL["27a"]!()}
            <GenStrip items={[{ src: reference.filmPanelKind, from: reference.filmPanel, label: "shot.05.key", start: GEN_AT["27a"].start, at: GEN_AT["27a"].at }]} />
          </Composition>
        ))
        .nextGraphicShot("28", () => (
          <Composition>
            <Screen src={img("28", "screen")} focus={[0.43, 0.35, 1.35]} />
          </Composition>
        ))
        .nextShot("29", ({ script }) => {
          const k = motion({
            panel: key("29"),
            stem: stem("29"),
            girl: true,
            frame: "close on the girl at night, both palms on her cheeks, melting into a happy smile",
            summary: "At night, the girl presses her palms to her cheeks and melts into a happy smile.",
            text: `Night: the window at the left is a dark navy blur, warm lamplight from the left. Close on the girl, a soft cool screen glow on her face from below. Both of her palms press to her cheeks, squishing them up; her head tilts slowly further toward screen right, her eyes melting into happy curved crescents, a pink blush across her cheeks. ${VOICE} says it softly and dreamily, almost a whisper, <d>[English] ${script.konte[0]}</d> Her lips close and the speaking motion stops, and she sways gently, smiling. The camera holds a static shot.`,
            sound: `${ROOM_NIGHT} A quiet, happy breath.`,
          });
          return (
            <Composition>
              <Video src={k} hasAudio />
              {line(script.konte[0]!, 0.4, 2.3)}
            </Composition>
          );
        })
        .nextGraphicShot("30", () => (
          <Composition>
            <Screen
              src={img("28", "screen")}
              next={img("30", "screen21")}
              at={0.6}
              steps={[
                { src: img("30", "screenNext"), at: 1.3 },
                { src: img("30", "screen72"), at: 2.0 },
                { src: img("30", "screen80"), at: 2.6 },
              ]}
              fade={0.15}
              focus={[0.43, 0.35, 1.35]}
            />
          </Composition>
        ))
        .nextShot("35", ({ script }) => {
          const k = motion({
            panel: key("35"),
            stem: stem("35"),
            girl: true,
            frame: "at night at her desk, the girl flinging both arms out wide beside her open laptop, eager",
            summary: "At night, the girl flings her arms wide to show how big the whale should be.",
            text: `Night: the rainy window at the left is dark navy blue, warm lamplight from the left. The small white laptop stands open on the left of the desk, its glow lighting her from below. The girl sits behind the desk, waist-up, both arms flung out wide; she stretches them out even wider toward the left and right edges of the frame and leans forward eagerly, her eyes wide and shining, her eyebrows raised high. ${VOICE} says it eagerly, bursting with excitement, her whole body in the gesture, <d>[English] ${script.konte[0]}</d> Her lips close and the speaking motion stops, and she holds the wide pose with a bright grin. The camera holds a static shot.`,
            sound: `${ROOM_NIGHT} Her hoodie sleeves flap with a soft whoosh.`,
          });
          return (
            <Composition>
              <Video src={k} hasAudio />
              {line(script.konte[0]!, 0.2, 2.7)}
            </Composition>
          );
        })
        .nextGraphicShot("35b", () => (
          <Composition>
            {TERMINAL["35b"]!()}
            <GenStrip items={[{ src: reference.filmLastKind, from: reference.filmLastSmall, label: "shot.80.motion", start: GEN_AT["35b"].start, at: GEN_AT["35b"].at }]} />
          </Composition>
        ))
        .nextGraphicShot("35a", () => (
          <Composition>
            <Screen src={img("35a", "screen")} focus={[0.45, 0.35, 1.3]} />
          </Composition>
        ))
        .nextShot("32", () => {
          const k = motion({
            panel: key("32"),
            frame: "close on the bedroom's rainy window at dawn, the sky outside paling toward white",
            summary: "On Sunday at dawn, the sky beyond the rainy window grows lighter.",
            text: "Close on the tall bedroom window, its glass filling the frame, a fold of pale violet curtain at the right edge. Raindrops cling to the glass and slide slowly down. Beyond the glass the dawn sky brightens steadily from pale blue-grey toward a soft white, the faintest pink spreading along the bottom over the dark rooftops. The camera holds a static shot.",
            sound: "Light rain tapping on the window glass at dawn, a few early birds far off.",
          });
          return (
            <Composition>
              <Video src={k} hasAudio />
              <DateCard items={["Deadline Day"]} start={0.15} />
            </Composition>
          );
        })
        .nextShot("33", () => {
          const k = motion({
            panel: key("33"),
            girl: true,
            frame: "at dawn, the girl leaning far over her open laptop with a serious face, her finger on its trackpad",
            summary: "At dawn, the girl leans over her laptop and clicks Accept with a serious face.",
            text: "Early dawn: the desk lamp is off, cool grey morning light from the window at the left fills the room. The small white laptop stands open on the left of the desk, the manga stack at the right. The girl leans far forward over the desk toward the laptop, her face close to its screen and lit cool white by it, her eyes wide and focused, her eyebrows drawn slightly together, her mouth a small serious line. Her index finger presses down firmly on the trackpad in one decisive click, and her shoulders rise slightly with a held breath. The camera holds a static shot.",
            sound: "Quiet dawn in the bedroom, light rain on the window, one crisp trackpad click.",
          });
          return (
            <Composition>
              <Video src={k} hasAudio />
            </Composition>
          );
        })
        .nextGraphicShot("36", () => (
          <Composition>
            <Screen src={img("36", "screen")} next={img("36", "screenNext")} at={0.9} focus={[0.8, 0.32, 1.4]}>
              <Pointer from={[0.8, 0.5]} to={[0.862, 0.768]} move={0.6} click={0.8} />
            </Screen>
          </Composition>
        ))
        .nextGraphicShot("37", () => (
          <Composition>
            {TERMINAL["37"]!()}
            <GenStrip items={[{ src: reference.filmLastKind, label: "video.mp4 · 6:01", start: GEN_AT["37"].start, at: GEN_AT["37"].at, video: true }]} />
          </Composition>
        ))
        .nextShot("37a", () => {
          const k = motion({
            panel: reference.campus,
            frame: "the school plaza on the morning of the film festival, students in white and navy uniforms walking among striped stalls, the clock-tower building beyond",
            summary: "On the festival morning, students stream across the decorated school plaza.",
            text: "Bright morning daylight after the rain. The students in white and navy uniforms walk across the plaza at an easy pace, each one stepping forward in the direction their face and body point, pairs chat and point at the stalls, and the pennant flags and balloons sway gently in a light breeze. Every student keeps their own face, hair and uniform through the shot. The camera holds a static shot.",
            sound: "A lively school festival crowd: overlapping chatter and laughter, footsteps on wet paving, flags fluttering in a light breeze.",
          });
          return (
            <Composition>
              <Video src={k} hasAudio />
              <DateCard items={["Screening Day"]} start={0.2} />
            </Composition>
          );
        })
        .nextShot("38", () => {
          const k = motion({
            panel: key("38"),
            frame: "the darkened school auditorium seen from the back, rows of silhouetted students, the glowing screen showing a painted paper whale over rainy rooftops",
            summary: "In the dark auditorium, the paper whale on the screen swims over the rainy town while the audience sits still.",
            text: "On the screen the painted film plays: the cream paper whale swims slowly toward the left over the slate-blue rainy rooftops, its folded fins tilting gently, fine rain falling across the painted picture. The audience sits still. The light in the auditorium stays constant through the whole shot. The camera holds a static shot.",
            sound: "A hushed auditorium, the soft whir of a projector, and the faint sound of rain playing from the film on the screen.",
          });
          return (
            <Composition>
              <Video src={k} hasAudio />
              <FadeIn />
            </Composition>
          );
        })
        .nextShot("39", () => {
          const k = motion({
            panel: reference.filmPanelKind,
            style: FILM_STYLE,
            hold: "Through every frame the picture keeps the look of <Picture 1>: the same soft, velvety gouache brushwork, the same palette and light.",
            frame: "the painted film filling the frame: the cream paper whale over rainy slate-blue rooftops, its round, kind eye",
            summary: "The paper whale swims across the screen and turns its kind eye toward the viewer.",
            text: "The painted film fills the whole frame in soft, velvety gouache. The cream paper whale drifts slowly a short way toward the left over the rainy slate-blue rooftops, its folded fins tilting gently, fine rain streaking past; its head and eye stay well inside the frame, near the middle, the whole time. Its round, soft eye looks out toward the viewer the whole time: a large dark pupil filling the eye with one small white highlight, calm and kind, the eye shape and pupil steady from the first frame to the last. The painted rooftops below hold still as the whale passes over them. The camera holds a static shot.",
            sound: "The soft sound of rain from the film, a gentle swell of air, and the quiet whir of a projector in a hushed hall.",
          });
          return (
            <Composition>
              <Video src={k} hasAudio />
            </Composition>
          );
        })
        .nextShot("41", () => {
          const k = motion({
            panel: key("41"),
            girl: true,
            frame: "close on the girl sitting in a theater seat in the dark auditorium, hugging her manga stack to her chest, lit by the screen, smiling hugely",
            summary: "In the dark auditorium, lit by the screen, the girl hugs her manga and smiles with joy.",
            text: "The view from the screen side of the darkened auditorium: close on the girl sitting deep in a theater seat, rows of dark silhouetted students behind her fading into navy shadow. Both arms hug the thick manga stack to her chest, and it stays there, held in both arms against her hoodie, in every frame to the very last. Her face is lit only by the cool blue-white glow of the screen toward the camera, and that light stays the same from the first frame to the last. She looks just past the lens at the screen, and her happy smile grows even wider, her eyes glistening with reflected light, her cheeks rising; she squeezes the manga stack a little tighter and gives a small, delighted breath of a laugh, her shoulders lifting once, ending on a huge open-mouthed smile. Her eyes stay their own big dark eyes through every frame, with bright white highlights shining to the very last frame. The camera holds a static shot.",
            sound: "A hushed auditorium, the soft whir of a projector, the faint rain of the film, and her one small, delighted breath.",
          });
          return (
            <Composition>
              <Video src={k} />
            </Composition>
          );
        }),
    };
  },
});
