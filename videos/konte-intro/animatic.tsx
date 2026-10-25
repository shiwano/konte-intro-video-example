import { defineAnimatic, asset, adapters, respell, Audio, Composition, Cutin, Panel, type MediaAsset } from "konte";
import { imageMinimaxH3R2i } from "konte/workspace/adapters/comfy/image_minimax_h3_r2i.js";
import { audioMinimaxH3R2a } from "konte/workspace/adapters/comfy/audio_minimax_h3_r2a.js";
import { ReelReview, ReferenceReview, type TimelineClip } from "./ui/review-ui";
import { builtinCredentials, CredentialsTab } from "./ui/settings-ui";
import { ComfyApiKeys } from "./ui/comfy-platform";
import direction from "./direction";
import reference from "./reference";
import { SCREEN, FILM_TOTAL, Downloads, FORUM_SEL, ForumThread, GenSite, MANGA_AT, TERMINAL, DateCard, GEN_AT, GenStrip, MangaStrip, Pointer, Screen, TextSelect, filmCards, filmTime, filmTimeline, fmt } from "./screens";

const STYLE =
  "2D-animated. A modern flat-colour anime illustration with bold, clean dark outlines of even weight, bright flat cel colours and one simple step of soft lavender shading.";

const ROOM =
  "<Subject 1> is the bedroom in <Picture N>: off-white walls, the tall rainy window with a pale violet curtain at the left, the small white study desk across the bottom, the violet chair behind it, a small violet bookshelf with pastel spines at the right.";

const room = (n: number) => ROOM.replace("<Picture N>", `<Picture ${n}>`);

const KONTE_LOOK =
  "a wavy black bob with violet-dyed tips underneath and one small curl sticking up on top, a white headband printed with violet stars tied in a big bow on top of her head, a black choker, an oversized white hoodie with a violet konte logo on the chest and a thin violet shoulder-bag strap across it";

type Ref = { image: MediaAsset<"image">; def: string; keep: string };

const KONTE: Ref = {
  image: reference.konte,
  def: `the girl, ${KONTE_LOOK}, her face, hair and clothing taken from`,
  keep: "partially_preserved - her face, hair and clothing hold; the sheet's cheerful expression and standing pose are remade as the description writes them.",
};
const prop = (image: MediaAsset<"image">, def: string): Ref => ({
  image,
  def,
  keep: "partially_preserved - its design and colours hold; where it lies and how it is held are new.",
});
const POSTER = prop(reference.poster, 'the school film festival poster, violet and sunflower yellow print on cream paper, "FILM FESTIVAL" across its top and "Entries due SUNDAY" in a yellow band near its bottom, in');
const MANUSCRIPT = prop(reference.manuscript, "the thick, hand-drawn stack of manga manuscript pages, its top page a black-and-white ink page whose large top panel shows a paper whale over rainy rooftops, in");
const LAPTOP = prop(reference.laptop, "the small, thin white laptop with a plain white lid in");

/** konte-chan's right hand and sleeve cuff cut from her sheet, for a shot where only her hand is in frame. */
function handRef(): Ref {
  return {
    image: asset("hand", adapters.imageCrop, { image: reference.konte, x: 200, y: 860, width: 320, height: 280, outWidth: 640, outHeight: 560 }),
    def: "the girl's small right hand and the cuff of her loose, oversized white hoodie sleeve with soft lavender shading, drawn as in",
    keep: "partially_preserved - the drawing of the hand, its skin tone and the white sleeve cuff hold; its pose is remade as the description writes it.",
  };
}

const NIGHT_ON_DAY = "partially_preserved - the set, camera position and framing hold; the light is remade as night, as the description writes it.";
const NIGHT_M =
  "Night: the rainy window at the left is dark navy blue, warm amber lamplight from off the left edge, the off-white wall at the right in soft shadow. Seen at seated eye level across the desk,";
const DAY_C = "Soft, cool daylight; the rainy window is a blur of white light and raindrops at the left, as in <Picture 1>.";
const NIGHT_C = "Night: the rainy window at the left is a dark navy blur with raindrops on the glass, warm amber lamplight from the left, the fold of the pale violet curtain behind her head, the off-white wall at the right in soft shadow.";

/** The shot's one keyframe on a plate (or a location reference). `refs` become <Subject 1…> on <Picture 2…>. */
function key(o: { name?: string; plate: MediaAsset<"image">; plateKeep?: string; place?: string; refs: Ref[]; summary: string; text: string; night?: boolean }) {
  const n = o.place ? 2 : 1;
  const images = Object.fromEntries([o.plate, ...o.refs.map((r) => r.image)].map((img, i) => [`image${i + 1}`, img])) as {
    image1: MediaAsset<"image">;
  } & Record<string, MediaAsset<"image">>;
  return asset(o.name ?? "key", imageMinimaxH3R2i, {
    ...images,
    prompt: {
      subjectDefinitions: [
        o.place ? `<Subject 1> is ${o.place} <Picture 1>.` : "<Picture 1> is the empty frame of [Shot 1].",
        ...o.refs.map((r, i) => `<Subject ${i + n}> is ${r.def} <Picture ${i + 2}>.`),
      ],
      summary: { tasks: ["keyframe completion"], text: o.summary },
      retentionAnalysis: [
        `${o.place ? "<Subject 1> (appears in [Shot 1])" : "<Picture 1> ([Shot 1] frame)"}: ${o.plateKeep ?? (o.night ? NIGHT_ON_DAY : "fully_preserved - the set, camera position, framing and light hold.")}`,
        ...o.refs.map((r, i) => `<Subject ${i + n}> (appears in [Shot 1]): ${r.keep}`),
      ],
      detailedDescription: { style: STYLE, shots: [o.text] },
    },
  });
}

/** A keyframe on a plate, cutting from an earlier shot's keyframe on the same camera so the set and props carry across. */
function keyAfter(o: { prev: MediaAsset<"image">; plate: MediaAsset<"image">; plateKeep: string; refs: Ref[]; prevKeep: string; summary: string; text: string }) {
  const images = Object.fromEntries([o.plate, ...o.refs.map((r) => r.image), o.prev].map((img, i) => [`image${i + 1}`, img])) as {
    image1: MediaAsset<"image">;
  } & Record<string, MediaAsset<"image">>;
  const last = o.refs.length + 2;
  return asset("key", imageMinimaxH3R2i, {
    ...images,
    prompt: {
      subjectDefinitions: [
        "<Picture 1> is the empty frame of [Shot 2].",
        ...o.refs.map((r, i) => `<Subject ${i + 1}> is ${r.def} <Picture ${i + 2}>.`),
        `<Picture ${last}> is the frame of [Shot 1], the earlier shot on the same camera.`,
      ],
      summary: { tasks: ["keyframe completion"], text: o.summary },
      retentionAnalysis: [
        `<Picture 1> ([Shot 2] frame): ${o.plateKeep}`,
        ...o.refs.map((r, i) => `<Subject ${i + 1}> (appears in [Shot 1], [Shot 2]): ${r.keep}`),
        `<Picture ${last}> ([Shot 1] frame): ${o.prevKeep}`,
      ],
      detailedDescription: { style: STYLE, shots: [`The shot shows <Picture ${last}>.`, o.text] },
    },
  });
}

const BEDROOM = "A small, quiet bedroom, soft rain pattering on the window glass, a faint room tone underneath.";
const HALLWAY = "An empty school hallway after class, rain pattering on the long row of windows, a faint airy echo.";

/** One spoken line in konte-chan's voice, acted out of the scene: the sheet casts her, the accepted sample carries the timbre. */
function voice(line: string, scene: string, delivery: string, beat: string, room = BEDROOM) {
  return asset("line", audioMinimaxH3R2a, {
    image1: reference.konte,
    audio1: reference.konteVoice,
    prompt: {
      subjectDefinitions: [`<Subject 1> is the girl in <Picture 1>: ${KONTE_LOOK}. She is speaker (S1).`, "<Audio 1> is the voice-timbre reference for <Subject 1> (S1)."],
      summary: { tasks: ["reference generation", "audio reference"], text: `One short spoken line from <Subject 1> (S1), ${scene}.` },
      retentionAnalysis: [
        "<Subject 1> (appears in [Shot 1]): weak_reference - her age, look and bright character cast the voice.",
        "<Audio 1>: weak_reference - the voice keeps its colour; the delivery follows the scene.",
      ],
      detailedDescription: {
        style: "2D-animated.",
        shots: [
          `<Subject 1> (S1), an early-teens girl with a bright, light, crisp voice, ${scene}. ${beat} She ${delivery} <d>[English] ${line}</d> Her lips close and she falls quiet. The camera holds a static shot.`,
        ],
      },
      overallSoundscape: room,
      nonDiegeticMusic: "N/A",
    },
  });
}

const CUTIN_STYLE = { borderRadius: "1.2vmax", overflow: "hidden", boxShadow: "0 0.6vmax 1.8vmax rgba(0,0,0,.45)" };

const SITE_SCREEN = { ...SCREEN, background: "#f7f3ee" as const };

const screen = (build: (width: number) => JSX.Element, base: { width: number; height: number; background?: `#${string}` } = SCREEN) =>
  asset("screen", adapters.jsxImage, { ...base, build: ({ width }) => build(width) });
const screenNext = (build: (width: number) => JSX.Element, base: { width: number; height: number; background?: `#${string}` } = SCREEN) =>
  asset("screenNext", adapters.jsxImage, { ...base, build: ({ width }) => build(width) });

export default defineAnimatic(direction, {
  plates: () => {
    const deskMedium = asset("deskMedium", adapters.imageCrop, {
      image: reference.room,
      x: 365,
      y: 348,
      width: 1600,
      height: 900,
    });

    const konteClose = asset("konteClose", imageMinimaxH3R2i, {
      image1: deskMedium,
      image2: reference.room,
      prompt: {
        subjectDefinitions: ["<Picture 1> is the frame of [Shot 1].", room(2)],
        summary: {
          tasks: ["reference generation"],
          text: "A closer view along the same axis: the wall just above the violet chair's backrest, the rainy window glass a soft blur at the left.",
        },
        retentionAnalysis: [
          "<Picture 1> ([Shot 1] frame): attribute_transfer - the camera axis, height, light and colours carry into the closer frame of [Shot 2].",
          "<Subject 1> (appears in [Shot 2]): attribute_transfer - the room's materials, palette, line and soft rainy daylight carry over; the framing is new.",
        ],
        detailedDescription: {
          style: STYLE,
          shots: [
            "The shot shows <Picture 1>.",
            "The camera cuts straight in along the same axis, at the same height, to the plain off-white wall just above the violet chair, the frame about a third as wide as the previous shot: only a thin sliver of the rounded top edge of the backrest shows along the very bottom edge of the frame, about a tenth of the frame's height, the plain off-white wall behind it fills the right two thirds of the frame in soft focus, and the left quarter of the frame is the rainy window glass, out of focus, soft white rainy daylight beyond it and clear drops of rain running down it, a fold of the pale violet curtain between the glass and the wall. The light and colour are <Picture 1>'s: soft, cool rainy daylight from the left.",
          ],
        },
      },
    });

    const deskInsertNight = asset("deskInsertNight", imageMinimaxH3R2i, {
      image1: reference.view.room.top,
      image2: reference.room,
      prompt: {
        subjectDefinitions: ["<Picture 1> is the study desk of the bedroom seen from straight above.", room(2)],
        summary: {
          tasks: ["reference generation"],
          text: "At night, the white desktop of <Subject 1> seen from straight above, from the side of the desk where the girl sits.",
        },
        retentionAnalysis: [
          "<Picture 1> ([Shot 1] reference): attribute_transfer - the desktop's white material, the window sill, the line and the palette carry over; the camera is turned around to the chair side of the desk, so the window lies along the right edge.",
          "<Subject 1> (appears in [Shot 1]): weak_reference - only the room's palette and line carry over.",
        ],
        detailedDescription: {
          style: STYLE,
          shots: [
            "Night. The camera hangs straight above the study desk, turned so that the side where the girl sits is at the bottom of the frame. The smooth white desktop fills the frame from the left edge across to about nine tenths of the frame's width, its rounded near edge running along the bottom edge of the frame. Along the right edge of the frame, beside the desk, a narrow strip of the white window sill and the dark navy rainy window glass, a few raindrops shining on it. In the upper right corner of the desktop stands the round base of a small desk lamp, seen from above. Warm cream-white lamplight falls from the lamp across the desktop, brightest at the upper right and softening gently toward the lower left, the desktop's white reading clearly everywhere. A few small grey eraser crumbs lie near the middle of the desktop.",
          ],
        },
      },
    });

    const windowInsert = asset("windowInsert", imageMinimaxH3R2i, {
      image1: reference.room,
      prompt: {
        subjectDefinitions: [room(1)],
        summary: { tasks: ["reference generation"], text: "The tall rainy window of <Subject 1>, close, its glass filling the frame." },
        retentionAnalysis: [
          "<Subject 1> (appears in [Shot 1]): attribute_transfer - the window's frame, glass, raindrops, the pale violet curtain, the palette and the soft rainy daylight carry over; the framing is new and close.",
        ],
        detailedDescription: {
          style: STYLE,
          shots: [
            "Close on the tall rainy window of <Subject 1>, seen square-on from inside the room at seated eye height: the window glass fills the frame, its pale grey-violet frame bars dividing it into two panes, a fold of the pale violet curtain along the right edge. Raindrops cling to the glass and run down it in thin streaks. Beyond the glass, a soft white rainy sky, blurred rooftops and treetops as soft shapes along the lower edge. The light and colour are <Picture 1>'s: soft, cool rainy daylight.",
          ],
        },
      },
    });

    return { deskMedium, konteClose, deskInsertNight, windowInsert };
  },
  timeline: ({ shot, plates }) => {
    const icon = asset("konteIcon", adapters.imageFile, { path: "assets/files/konte-icon.png" });

    const reel = (o: {
      width: number;
      stage: "Animatic" | "Video";
      frame: MediaAsset<"image">;
      accepted: number;
      selected: string;
      handoff?: string;
      feedback: Parameters<typeof ReelReview>[0]["feedback"];
      pins?: Parameters<typeof ReelReview>[0]["pins"];
      changed?: boolean;
      allAccepted?: boolean;
      dirty?: boolean;
      clip?: Partial<TimelineClip>;
    }) => {
      const i = Number(o.selected) - 1;
      return (
        <ReelReview
          width={o.width}
          icon={icon}
          stage={o.stage}
          handoff={o.handoff}
          header={{ needsReview: false, hideStale: true, allAccepted: o.allAccepted, dirty: o.dirty }}
          frame={o.frame}
          pins={o.pins}
          time={filmTime(o.selected)}
          total={fmt(FILM_TOTAL)}
          timeline={filmTimeline(o.stage === "Animatic" ? "animatic" : "video", o.accepted, o.selected, o.changed ? { changed: true } : {}, o.clip)}
          feedback={o.feedback}
          shots={filmCards(o.accepted, o.changed ? { [o.selected]: { changed: true } } : {})}
          shotsFrom={Math.max(Math.min(i - 1, 75), 0)}
        />
      );
    };
    const BOARD_HANDOFF = "The whole board, 80 panels on the film's clock, each drawn from your manga's panels.";

    return {
      shots: shot("01", () => {
        const k = key({
          plate: reference.hallway,
          place: "the empty school hallway after school in",
          plateKeep: "attribute_transfer - the hallway's walls, the cork bulletin board, the rainy windows, the palette and the soft rainy daylight carry over; the framing is new and close.",
          refs: [KONTE, MANUSCRIPT, POSTER],
          summary: "<Subject 2>, close in the hallway of <Subject 1>, hugging the manga stack of <Subject 3>, her face lighting up at the poster of <Subject 4>.",
          text: "Close at standing eye level on <Subject 2> in the hallway of <Subject 1>, seen from a three-quarter angle: her head and shoulders fill the right two thirds of the frame, her face turned toward screen left. In the near foreground at the left edge, out of focus, the edge of the festival poster of <Subject 4> on the cork school bulletin board, its bold violet \"FILM FESTIVAL\" heading half in frame, softly out of focus. Behind her on the right, the row of rainy hallway windows glows soft white, out of focus, raindrops on the glass. Both of her arms hug the thick manga stack of <Subject 3> against her chest, its top edge just above the bottom edge of the frame. Her eyes are wide open with big sparkling highlights, pupils toward screen left, fixed on the poster; her eyebrows lifted high, her lips parted in a breathless, delighted smile, a faint pink blush on her cheeks. Soft, cool rainy daylight from the windows behind her rims her hair.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ポスターに目を留め、目がきらきら見開かれて笑顔がぱっと広がる。" camera="fixed" />
          </Composition>
        );
      })
        .nextShot("02", ({ script }) => {
          const k = key({
            plate: reference.view.hallway.side,
            plateKeep: "partially_preserved - the cork bulletin board, its wood frame, the soft rainy light and the palette hold; the camera comes in close on one poster pinned to it.",
            place: "the cork bulletin board in",
            refs: [POSTER, handRef()],
            summary: "The festival poster of <Subject 2> pinned to the cork board of <Subject 1>, close, the index finger of <Subject 3> on its deadline band.",
            text: 'Seen square-on and close, the festival poster of <Subject 2> fills most of the frame, pinned upright to the cork of <Subject 1> by red push pins at its corners, other club notices and printed handouts pinned to the cork around it and cut by the frame edges: "FILM FESTIVAL" in bold violet letters across its top, the yellow film reel and clapperboard in the middle, the yellow band reading "Entries due SUNDAY" near its bottom. The small right hand of <Subject 3>, in the white sleeve cuff, enters from the lower right edge of the frame, its index finger resting on the left end of the yellow band, the other fingers curled loosely. Soft, cool rainy daylight from behind the camera, faint pale stripes of window light across the poster.',
          });
          return (
            <Composition>
              <Panel src={k} blocking="人差し指が締め切りの帯を左から右へなぞる。" camera="fixed" />
              <Audio src={voice(script.konte[0]!, "standing at a school bulletin board, finding a film festival poster", "draws a quick breath, then says it with delight spilling over,", "Her fingertip slides along the paper of the poster with a faint dry rustle, the manga pages shifting in the crook of her other arm.", HALLWAY)} start={0.3} />
            </Composition>
          );
        })
        .nextShot("03", ({ script }) => {
          const k = key({
            plate: reference.hallway,
            place: "the empty school hallway after school in",
            plateKeep: "partially_preserved - the hallway, the cork bulletin board at the left, the row of rainy windows at the right, the camera position, palette and light hold; the framing is a little closer.",
            refs: [KONTE, MANUSCRIPT],
            summary: "<Subject 2> standing in front of the bulletin board of <Subject 1>, holding the manga stack of <Subject 3> high in both hands.",
            text: "At standing eye level, the hallway of <Subject 1> as in <Picture 1>: the cork school bulletin board on the left wall at the left of the frame, the row of rainy hallway windows along the right, the hallway running away toward the far door. <Subject 2> stands in the middle of the floor just right of the board, framed waist-up from the middle of the frame, her feet below the bottom edge, her torso turned three-quarters toward the camera, her chest pushed out proudly. Both arms are raised above her head, elbows slightly bent, her hands holding the thick manga stack of <Subject 3> up high by its two side edges, its top page facing the camera. Her head tilts back toward it, her eyes shining, her mouth wide open in a proud, declaring grin. Soft, cool rainy daylight from the windows on the right.",
          });
          return (
            <Composition>
              <Panel src={k} blocking="原稿の束を高く掲げたまま胸を張り、得意げに宣言する。" camera="fixed" />
              <Audio src={voice(script.konte[0]!, "holding up her finished manga in a school hallway, announcing a big plan", "declares it proudly, chest puffed out,", "She lifts the thick stack of pages high over her head with both hands, the sheets riffling softly as they rise, her sneakers squeaking once on the polished floor.", HALLWAY)} start={0.4} />
            </Composition>
          );
        })
        .nextShot("04", () => {
          const k = key({
            plate: reference.hallway,
            place: "the school hallway in",
            plateKeep: "weak_reference - only the soft rainy daylight and the pale palette of the hallway carry over, as a soft blur at the frame's edges.",
            refs: [MANUSCRIPT, handRef()],
            summary: "The top page of the manga stack of <Subject 2>, held up and filling the frame, its paper whale panel looking out with a gentle eye.",
            text: "The top page of the manga stack of <Subject 2> fills the frame, held up square to the camera, its black-and-white ink panels sharp and clear: the large top panel across the upper half shows the paper whale swimming toward screen left over rainy rooftops, its one small round eye a solid, filled black ink dot, soft and gentle, looking out toward the camera; smaller panels of rain on rooftops and a girl looking up below it. The fingertips of <Subject 3>, in the white sleeve cuff, curl over the page's left edge at the middle of the frame's left side. A thin margin of soft white hallway light glows past the page's edges.",
          });
          return (
            <Composition>
              <Panel src={k} blocking="動かない。窓の光がページの上をかすかに流れる。" camera="fixed" />
            </Composition>
          );
        })
        .nextShot("n01", () => {
          const k = key({
            plate: plates.deskMedium,
            refs: [KONTE, LAPTOP, MANUSCRIPT],
            summary: "<Subject 1> at her desk by the rainy window in the daytime, lifting the lid of the small laptop of <Subject 2>, the manga stack of <Subject 3> beside it.",
            text: "Soft, cool rainy daylight from the window at the left, as in <Picture 1>; along the left edge of the frame, beside the pale violet curtain fold, a strip of the rainy window glass, raindrops running down it. Seen at seated eye level across the desk, <Subject 1> sits behind the desk in the middle of the frame, waist-up, her torso square to the camera, leaning slightly forward. The small white laptop of <Subject 2> sits on the desktop in front of her, its back to the camera, its lid raised halfway; both of her hands hold the lid by its top corners, lifting it. The thick manga stack of <Subject 3> lies flat on the desktop at the right, right beside the laptop. Her eyes look down at the opening screen, bright and curious, her mouth in a small eager smile.",
          });
          return (
            <Composition>
              <Panel src={k} blocking="ふたを持ち上げて開ききり、画面の光が顔に広がる。" camera="fixed" />
            </Composition>
          );
        })
        .nextGraphicShot("n02", () => {
          const s = screen(() => <GenSite />, SITE_SCREEN);
          const n = screenNext(() => <GenSite image={reference.mangaWhale} prompt="The paper whale swims over the rainy town." />, SITE_SCREEN);
          return (
            <Composition>
              <Screen src={s} next={n} at={0.4} fade={0.12} focus={[0.18, 0.5, 1.15]}>
                <Pointer from={[0.3, 0.3]} to={[0.15, 0.725]} move={0.9} click={1.5} />
              </Screen>
            </Composition>
          );
        })
        .nextGraphicShot("n03", () => (
          <Composition>
            <Screen src={screen(() => <GenSite image={reference.mangaWhale} prompt="The paper whale swims over the rainy town." preview={reference.filmPanelKind} />)} focus={[0.64, 0.42, 1.35]} />
          </Composition>
        ))
        .nextShot("n04", ({ script }) => {
          const k = key({
            plate: plates.konteClose,
            refs: [KONTE],
            summary: "<Subject 1>, close, lit by a laptop screen in the daytime, a pleased smile spreading.",
            text: `${DAY_C} Close at seated eye level on <Subject 1>, her head, shoulders and the top of her chest filling the middle of the frame down to the bottom edge, the fold of the pale violet curtain behind her head, the off-white wall at the right. A cool white glow rises onto her chin and cheeks from a screen just below the bottom edge of the frame. Her eyes look down toward the bottom edge, wide and a little surprised, her eyebrows lifted; the corners of her mouth curl up into a small, pleased smile, her cheeks faintly pink.`,
          });
          return (
            <Composition>
              <Panel src={k} blocking="画面をのぞき込んだまま、驚きまじりの笑みがじわっと広がる。" camera="fixed" />
              <Audio src={voice(script.konte[0]!, "at her desk, watching a short video clip she just generated from her own manga", "says it with a small happy bounce, surprised it came out better than she expected,", "She leans a little toward the laptop screen, the faint music of the clip playing from its small speaker.")} start={0.2} />
            </Composition>
          );
        })
        .nextGraphicShot("n05", () => {
          const clips = [{ src: reference.filmPanelKind, crop: true }, { src: reference.filmPanelSharp }, { src: reference.filmPanelSleepy }];
          const page = (n: number) => () => <GenSite image={reference.mangaWhale} prompt="The paper whale swims over the rainy town." preview={clips[n - 1]!.src} clips={clips.slice(0, n)} />;
          const step = (name: string, n: number) => asset(name, adapters.jsxImage, { ...SITE_SCREEN, build: () => page(n)() });
          return (
            <Composition>
              <Screen
                src={screen(page(1), SITE_SCREEN)}
                next={screenNext(page(2), SITE_SCREEN)}
                at={0.5}
                steps={[{ src: step("screen3", 3), at: 1.1 }]}
                fade={0.1}
                focus={[0, 1, 1.3]}
              />
            </Composition>
          );
        })
        .nextShot("n06", ({ script }) => {
          const k = key({
            plate: plates.konteClose,
            plateKeep: "partially_preserved - the set, camera position and light hold; her size in the frame is new.",
            refs: [KONTE],
            summary: "<Subject 1>, close, leaning in toward a screen below the frame, frowning at what she sees.",
            text: `${DAY_C} Close at seated eye level on <Subject 1>, leaning in toward the camera, her face about half the frame's height, the bow of her headband cut by the top edge, her chin just above the bottom edge, the fold of the pale violet curtain behind her head, the off-white wall at the right. A cool white glow rises onto her face from a screen just below the bottom edge of the frame. Her eyes look down toward the bottom edge, pupils low; her eyebrows are drawn together in a small frown, her lips pushed into a doubtful little pout.`,
          });
          return (
            <Composition>
              <Panel src={k} blocking="画面にさらに顔を寄せ、眉がきゅっと寄る。" camera="fixed" />
              <Audio src={voice(script.konte[0]!, "leaning close to her laptop screen, unhappy with how a character's eyes came out", "murmurs it softly to herself, barely above a whisper,", "She leans close over the laptop, the chair creaking faintly under her.")} start={0.3} />
            </Composition>
          );
        })
        .nextGraphicShot("n07", () => {
          const step = (name: string, n: number) => asset(name, adapters.jsxImage, { ...SCREEN, build: () => <Downloads count={n} /> });
          return (
            <Composition>
              <Screen
                src={screen(() => <Downloads count={1} />)}
                next={screenNext(() => <Downloads count={2} />)}
                at={0.4}
                steps={[
                  { src: step("screen3", 3), at: 0.8 },
                  { src: step("screen4", 4), at: 1.2 },
                ]}
                fade={0.08}
              />
            </Composition>
          );
        })
        .nextShot("07a", () => {
          const k = key({
            plate: plates.windowInsert,
            night: true,
            refs: [],
            summary: "Night: the rainy window of the bedroom, close, dark outside.",
            text: "Night. Close on the tall rainy window, framed exactly as <Picture 1>: the glass fills the frame, its frame bars dividing it into two panes, a fold of the pale violet curtain along the right edge. Beyond the glass the sky is a deep navy blue, a few distant warm window lights and dark rooftop shapes along the lower edge. Clear raindrops on the glass shine with small pale blue-white highlights, thin streaks running down.",
          });
          return (
            <Composition>
              <Panel src={k} blocking="雨粒が窓ガラスを伝い落ちる。" camera="fixed" />
            </Composition>
          );
        })
        .nextShot("n08", ({ script }) => {
          const k = key({
            plate: plates.deskMedium,
            night: true,
            refs: [KONTE, LAPTOP, MANUSCRIPT],
            summary: "Night: <Subject 1> at her desk, chin in her hand in front of the open small laptop of <Subject 2>, slumped and sighing.",
            text: `${NIGHT_M} <Subject 1> sits behind the desk in the middle of the frame, waist-up, her shoulders slumped forward. The small white laptop of <Subject 2> stands open on the desktop in front of her, its back to the camera, a cool white glow from its screen lighting her face from below. The thick manga stack of <Subject 3> lies flat on the desktop at the right. Her elbow on the frame's left rests on the desk, her cheek sunk into that palm, squashing it a little; her other arm lies limp on the desk. Her eyelids are heavy, her eyes looking at the screen, her eyebrows tipped up in the middle, her lips slightly parted in a long, slow exhale, her cheeks soft.`,
          });
          return (
            <Composition>
              <Panel src={k} blocking="頬杖のまま肩がさらに落ち、長いため息をつく。" camera="fixed" />
              <Audio src={voice(script.konte[0]!, "slumped at her desk late at night in front of a laptop full of video clips", "says it with a long tired sigh, at a loss,", "She lets out a long breath, her cheek sinking into her palm, the rain ticking on the dark window beside her.")} start={0.3} />
            </Composition>
          );
        })
        .nextGraphicShot("n09", ({ script }) => (
          <Composition>
            <Screen src={screen(() => <ForumThread />)} focus={[0.3, 0.45, 1.08]}>
              <TextSelect box={FORUM_SEL.box} at={FORUM_SEL.at} dur={FORUM_SEL.dur} />
              <Pointer from={FORUM_SEL.from} to={FORUM_SEL.start} move={0.4} second={{ to: FORUM_SEL.end, at: FORUM_SEL.at, move: FORUM_SEL.dur }} />
            </Screen>
            <Audio src={voice(script.konte[0]!, "reading a forum comment on her laptop late at night", "reads it aloud quietly, half doubtful, trailing off,", "Her eyes follow the comment line by line on the glowing screen, the rain ticking on the dark window.")} start={FORUM_SEL.at} />
          </Composition>
        ))
        .nextShot("n10", ({ script }) => {
          const k = key({
            plate: plates.konteClose,
            night: true,
            refs: [KONTE],
            summary: "Night: <Subject 1>, close, lit by a laptop screen, tilting her head, half doubtful.",
            text: `${NIGHT_C} Close on <Subject 1>, her head and shoulders filling the middle of the frame, lit from the lower left by a cool white glow rising from past the lower left corner of the frame. Her face turns three-quarters toward screen left, toward a laptop screen just past the lower left corner of the frame, and her head tips toward screen left, clearly off level; her eyes look down toward the lower left corner, one eyebrow slightly raised, the other level, her lips pressed into a small, unsure half-smile.`,
          });
          return (
            <Composition>
              <Panel src={k} blocking="画面左のノートパソコンを見つめたまま、首をさらに画面左へかしげる。" camera="fixed" />
              <Audio src={voice(script.konte[0]!, "at her desk late at night, finding a tool online that might help, still unsure", "murmurs it half doubtfully, keeping her hopes small,", "She tilts her head at the screen, the laptop fan humming faintly.")} start={0.3} />
            </Composition>
          );
        })
        .nextGraphicShot("16", ({ script }) => {
          const k = key({
            plate: plates.konteClose,
            night: true,
            refs: [KONTE],
            summary: "Night: <Subject 1>, close, lit by a laptop screen, typing with a shy, determined smile.",
            text: `${NIGHT_C} Close on <Subject 1>, her head and shoulders filling the middle of the frame, the bow of her headband near the top edge, her shoulders cut by the bottom edge, lit from below and in front by a cool white glow rising from below the bottom edge of the frame. She leans toward the camera, her eyes lowered toward the bottom edge, a shy, determined little smile, her cheeks faintly pink; her shoulders dip forward, her arms reaching down out of the bottom of the frame.`,
          });
          return (
            <Composition>
              {TERMINAL["16"]!()}
              <Cutin at="bottom-right" size={0.34} style={CUTIN_STYLE}>
                <Panel src={k} blocking="画面を見ながらキーを打ち、照れた笑みが少し深くなる。" camera="fixed" />
              </Cutin>
              <Audio src={voice(script.konte[0]!, "typing on a small laptop late at night", "reads it out as she types, a little shy but serious,", "Her fingers tap across the laptop keys in a quick light patter, pausing on each word as she reads it aloud.")} start={0.6} />
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
        .nextShot("19", ({ script, shot }) => {
          const k = keyAfter({
            prev: shot("n08").image("key"),
            plate: plates.deskMedium,
            plateKeep: NIGHT_ON_DAY,
            refs: [KONTE, LAPTOP],
            prevKeep: "partially_preserved - the night light, the window, the desk, the manga stack at the right and the camera carry across; her pose and the laptop are remade as the description writes them.",
            summary: "Night, the same camera as the previous shot: <Subject 1> with one hand resting on the lid of the small laptop of <Subject 2>, staring at it, worried.",
            text: `${NIGHT_M} <Subject 1> sits behind the desk in the middle of the frame, waist-up, the manga stack still at the right of the desktop as in the previous shot. The small white laptop of <Subject 2> stands open on the desk in front of her, its back to the camera; the fingertips of her hand on the frame's left rest lightly on the top edge of its lid. Her head leans toward the screen, her eyebrows tipped up in the middle, her eyes glassy and wobbling, her mouth a small wavy line.`,
          });
          return (
            <Composition>
              <Panel src={k} blocking="ふたに指をそえたまま画面をのぞき込み、眉がさらに下がって口元がゆがむ。" camera="fixed" />
              <Audio src={voice(respell(script.konte[0]!, "A G-P-U? ...In this?"), "holding up a tiny laptop at her desk, worried it is far too weak", "asks it hesitantly, her voice wobbling as if about to cry,", "She rests her fingertips on the laptop lid, its hinge creaking slightly, and leans in to peer at the small machine.")} start={0.4} />
            </Composition>
          );
        })
        .nextGraphicShot("20", () => <Composition>{TERMINAL["20"]!()}</Composition>)
        .nextGraphicShot("21", () => {
          const s = screen(() => (
            <div style={{ lineHeight: 1.25 }}>
              <ComfyApiKeys />
            </div>
          ));
          const n = screenNext(() => (
            <div style={{ lineHeight: 1.25 }}>
              <ComfyApiKeys newKey />
            </div>
          ));
          return (
            <Composition>
              <Screen src={s} next={n} at={0.7}>
                <Pointer from={[0.62, 0.62]} to={[0.24, 0.235]} move={0.5} click={0.6} />
              </Screen>
            </Composition>
          );
        })
        .nextGraphicShot("22", () => {
          const s = screen((width) => <CredentialsTab width={width} credentials={builtinCredentials({ COMFY_API_KEY: { state: "unset", focus: true } })} />);
          const pasted = asset("screenPasted", adapters.jsxImage, {
            ...SCREEN,
            build: ({ width }) => <CredentialsTab width={width} credentials={builtinCredentials({ COMFY_API_KEY: { state: "unset", typing: 36, focus: true } })} />,
          });
          return (
            <Composition>
              <Screen src={s} next={pasted} at={0.5} fade={0.06} focus={[0.5, 0.3, 1.8]} />
            </Composition>
          );
        })
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
          const k = key({
            plate: plates.konteClose,
            night: true,
            refs: [KONTE],
            summary: "Night: <Subject 1>, close, lit by a screen, her face lighting up in wonder.",
            text: `${NIGHT_C} Close on <Subject 1>, her face filling the middle of the frame, lit from below and in front by a bright cool white-blue screen glow, tiny reflections of scrolling text lines in her eyes. Her eyes are wide with big sparkling highlights, looking just below the lens; her eyebrows lifted; her mouth open wide in an amazed, delighted smile; both hands clasped together under her chin at the bottom edge of the frame.`,
          });
          return (
            <Composition>
              <Panel src={k} blocking="画面の光の中で目が見開かれ、笑顔がぱっと広がる。" camera="fixed" />
              <Audio src={voice(script.konte[0]!, "staring at a glowing laptop screen in wonder", "breathes it out in amazement, her voice lifting into delight,", "She clasps her hands together under her chin, a soft clap of palms, the laptop humming faintly as lines of text scroll past on its screen.")} start={0.3} />
            </Composition>
          );
        })
        .nextGraphicShot("25", () => <Composition>{TERMINAL["25"]!()}</Composition>)
        .nextGraphicShot("26", ({ script }) => {
          const k = key({
            plate: plates.konteClose,
            night: true,
            refs: [KONTE],
            summary: "Night: <Subject 1>, close, lit by a screen, her hand down on the laptop's trackpad, her eyes chasing the cursor.",
            text: `${NIGHT_C} Close on <Subject 1>, her face filling most of the frame, her head and shoulders turned three-quarters toward screen left, lit from the left and below by a cool white glow from a laptop just past the lower left corner of the frame. Her shoulder on the frame's left dips forward, her arm reaching down past the lower left corner of the frame to the laptop's trackpad; her eyes bright, looking down toward the laptop's screen at the lower left and following the cursor across it, her eyebrows lifted, her lips parted in an eager, delighted grin.`,
          });
          type Row = { name: string; image: MediaAsset<"image">; aspect: number; kind: string; label: string; description: string; takes: number };
          const rows: Row[] = [
            { name: "girl", image: reference.filmGirl, aspect: 1, kind: "Character", label: "the girl", description: "A girl in a school uniform with a dark green umbrella.", takes: 1 },
            { name: "paperWhale", image: reference.paperWhale, aspect: 1, kind: "Prop", label: "the paper whale", description: "The hero of The Paper Whale: a huge whale folded from paper, swimming over a rainy town.", takes: 1 },
            { name: "harbourTown", image: reference.filmTown, aspect: 16 / 9, kind: "Location", label: "the harbour town", description: "A hillside harbour town in the rain, slate roofs and amber windows.", takes: 1 },
          ];
          const row = (r: Row, accepted: boolean) => ({
            name: r.name,
            image: r.image,
            aspect: r.aspect,
            takes: r.takes,
            accepted,
            roster: { kind: r.kind, name: r.label, description: r.description },
          });
          const page = (accepted: boolean) => (width: number) => (
            <ReferenceReview
              width={width}
              icon={icon}
              header={{ hideStale: true, nextToReview: accepted ? 0 : 3 }}
              scroll={300}
              selected="paperWhale"
              handoff="The paper whale, painted from your manga — the folds, the paper and the eye."
              groups={[{ title: "Characters, props and locations", assets: [row(rows[0]!, true), row(rows[1]!, accepted), row(rows[2]!, false)] }]}
            />
          );
          return (
            <Composition>
              <Screen src={screen(page(false))} next={screenNext(page(true))} at={2.3} fade={0.08} focus={[0.5, 0.5, 1.15]}>
                <Pointer from={[0.5, 0.6]} to={[0.862, 0.383]} move={2.0} click={2.2} />
              </Screen>
              <Cutin at="bottom-right" size={0.3} style={CUTIN_STYLE}>
                <Panel src={k} blocking="画面を指さしたまま、迷わず言い切って笑う。" camera="fixed" />
              </Cutin>
              <Audio src={voice(script.konte[0]!, "pointing at one picture on her screen late at night", "says it instantly and decisively,", "She thrusts one finger toward the screen, her sleeve brushing the desk with a soft swish.")} start={1.1} />
            </Composition>
          );
        })
        .nextGraphicShot("26a", () => <Composition>{TERMINAL["26a"]!()}</Composition>)
        .nextGraphicShot("26b", () => {
          const s = screen((width) => reel({ width, stage: "Animatic", frame: reference.filmTown, accepted: 0, selected: "01", handoff: BOARD_HANDOFF, feedback: { target: "Shot 01" } }));
          const n = screenNext((width) => reel({ width, stage: "Animatic", frame: reference.filmPanel, accepted: 0, selected: "05", handoff: BOARD_HANDOFF, feedback: { target: "Shot 05" } }));
          return (
            <Composition>
              <Screen src={s} next={n} at={1.0} focus={[0.43, 0.4, 1.25]} />
            </Composition>
          );
        })
        .nextShot("26c", () => {
          const k = key({
            plate: plates.deskInsertNight,
            refs: [handRef(), MANUSCRIPT, LAPTOP],
            summary: "Night: beside the small laptop of <Subject 3>, the hand of <Subject 1> holding up the top page of the manga stack of <Subject 2>, its paper whale panel looking out with a gentle eye.",
            text: "Night, a dim room. Seen straight down onto the white desktop of <Picture 1>: warm amber lamplight falls from the upper left across the desk, the shadows deepening to blue-violet toward the lower right. The corner of the small white laptop of <Subject 3> fills the upper right corner of the frame, its keyboard deck seen from above, a cool white glow from its screen spilling onto the desk. The small right hand of <Subject 1>, in the white sleeve cuff, enters from the lower right edge and holds the top page of the manga stack of <Subject 2> up off the desk in the middle of the frame by its right edge, the page facing the camera: its large top panel shows the ink drawing of the paper whale over rainy rooftops, its one small round eye gentle and kind, clear and sharp in the middle of the frame.",
          });
          return (
            <Composition>
              <Panel src={k} blocking="原稿の一番上のページを少し持ち上げ、クジラのコマの目を見つめるように止まる。" camera="fixed" />
            </Composition>
          );
        })
        .nextGraphicShot("27", ({ script }) => {
          const line = script.konte[0]!;
          const PIN = { n: 1, x: 0.446, y: 0.4 };
          const page = (name: string, o: { pin?: "placing" | "draft"; composer?: string }) =>
            asset(name, adapters.jsxImage, {
              ...SCREEN,
              build: ({ width }) =>
                reel({
                  width,
                  stage: "Animatic",
                  frame: reference.filmPanel,
                  accepted: 0,
                  selected: "05",
                  handoff: BOARD_HANDOFF,
                  pins: o.pin ? [{ ...PIN, state: o.pin }] : [],
                  dirty: o.pin === "draft",
                  feedback: {
                    target: "Shot 05",
                    composer: o.composer,
                    notes: o.pin === "draft" ? [{ text: line, pin: 1, time: "0:02", draft: true }] : [],
                  },
                }),
            });
          const words = line.split(" ");
          const typed = words.map((_, i) => ({ src: page(`screenTyped${i + 1}`, { pin: "placing", composer: words.slice(0, i + 1).join(" ") }), at: 1.45 + i * 0.45 }));
          return (
            <Composition>
              <Screen
                src={screen((width) => reel({ width, stage: "Animatic", frame: reference.filmPanel, accepted: 0, selected: "05", handoff: BOARD_HANDOFF, feedback: { target: "Shot 05" } }))}
                next={page("screenPinned", { pin: "placing", composer: "" })}
                at={1.0}
                steps={[...typed, { src: page("screenDraft", { pin: "draft" }), at: 3.6 }]}
                fade={0.05}
                focus={[0.43, 0.4, 1.29]}
              >
                <Pointer from={[0.55, 0.7]} to={[0.285, 0.293]} move={0.9} click={1.0} second={{ to: [0.726, 0.2], at: 3.2, move: 0.3, click: 3.55 }} />
              </Screen>
              <Audio src={voice(line, "typing a note at her laptop late at night", "says each word as she types it, seriously,", "Her fingers tap the laptop keys one word at a time, a quiet clicking under each word as she says it.")} start={1.2} />
            </Composition>
          );
        })
        .nextGraphicShot("27a", () => (
          <Composition>
            {TERMINAL["27a"]!()}
            <GenStrip items={[{ src: reference.filmPanelKind, from: reference.filmPanel, label: "shot.05.key", start: GEN_AT["27a"].start, at: GEN_AT["27a"].at }]} />
          </Composition>
        ))
        .nextGraphicShot("28", () => {
          const s = screen((width) =>
            reel({
              width,
              stage: "Animatic",
              frame: reference.filmPanelKind,
              accepted: 4,
              selected: "05",
              changed: true,
              clip: { takes: 2, fresh: 1 },
              handoff: "Shot 05 redrawn from your note.",
              feedback: { target: "Shot 05", fresh: 1, agent: "Redrew the whale's eye rounder and softer, as you asked." },
            }),
          );
          return (
            <Composition>
              <Screen src={s} focus={[0.43, 0.35, 1.35]} />
            </Composition>
          );
        })
        .nextShot("29", ({ script }) => {
          const k = key({
            plate: plates.konteClose,
            night: true,
            refs: [KONTE],
            summary: "Night: <Subject 1>, close, both palms on her cheeks, melting into a happy smile.",
            text: `${NIGHT_C} Close on <Subject 1>, her face filling the middle of the frame, a soft cool screen glow on it from below. Both of her palms are pressed to her cheeks, squishing them up; her head tilts toward screen right; her eyes melt into happy curved crescents, her eyebrows soft, her mouth a small wobbly smile, a faint pink blush across her cheeks.`,
          });
          return (
            <Composition>
              <Panel src={k} blocking="頬を押さえたまま、とろけるように首をかしげる。" camera="fixed" />
              <Audio src={voice(script.konte[0]!, "gazing at a picture on her screen, enchanted", "says it softly and dreamily, almost a whisper,", "She presses both palms to her cheeks with a tiny soft pat and tilts her head, a quiet happy breath escaping first.")} start={0.3} />
            </Composition>
          );
        })
        .nextGraphicShot("30", ({ shot }) => {
          const VIDEO_HANDOFF = "Every shot is moving now. Review the takes on the film's clock.";
          const page = (accepted: number, frame: MediaAsset<"image">, o: { selected?: string; handoff?: string } = {}) => (width: number) => {
            const id = o.selected ?? String(accepted).padStart(2, "0");
            return reel({ width, stage: "Video", frame, accepted, selected: id, handoff: o.handoff ?? VIDEO_HANDOFF, feedback: { target: `Shot ${id}` } });
          };
          const step = (name: string, build: (width: number) => JSX.Element) => asset(name, adapters.jsxImage, { ...SCREEN, build: ({ width }) => build(width) });
          return (
            <Composition>
              <Screen
                src={shot("28").image("screen")}
                next={step("screen21", page(21, reference.filmTown))}
                at={0.6}
                steps={[
                  { src: screenNext(page(38, reference.filmGirl)), at: 1.3 },
                  { src: step("screen72", page(72, reference.filmTown)), at: 2.0 },
                  { src: step("screen80", page(79, reference.filmLastSmall, { selected: "80", handoff: "The last shot. 79 of 80 accepted." })), at: 2.6 },
                ]}
                fade={0.15}
                focus={[0.43, 0.35, 1.35]}
              />
            </Composition>
          );
        })
        .nextShot("35", ({ script, shot }) => {
          const k = keyAfter({
            prev: shot("n08").image("key"),
            plate: plates.deskMedium,
            plateKeep: NIGHT_ON_DAY,
            refs: [KONTE, LAPTOP],
            prevKeep: "partially_preserved - the night light, the window, the desk, the manga stack at the right and the camera carry across; her pose and the laptop's place are remade as the description writes them.",
            summary: "Night, the same camera: <Subject 1> at her desk flinging both arms out wide, eager.",
            text: `${NIGHT_M} the small white laptop of <Subject 2> stands open on the left part of the desktop, turned side-on to the camera, its screen facing screen right toward her, its glow lighting her from below. <Subject 1> sits behind the desk just right of centre, waist-up, her torso square to the camera, sitting up tall. Both arms are flung out wide to the sides, nearly horizontal, elbows almost straight, palms open toward the camera, her hands reaching toward the left and right edges of the frame as if showing something enormous. Her head is lifted, her eyes wide and shining, her eyebrows raised high, her mouth wide open mid-word in an eager, excited shout.`,
          });
          return (
            <Composition>
              <Panel src={k} blocking="両腕をさらに大きく広げ、身を乗り出して言う。" camera="fixed" />
              <Audio src={voice(script.konte[0]!, "spreading her arms wide at her desk, showing how big something should be", "says it eagerly, bursting with excitement, her whole body in the gesture,", "She flings both arms out wide, her loose hoodie sleeves flapping with a soft whoosh, the chair rocking back with a small creak.")} start={0.15} />
            </Composition>
          );
        })
        .nextGraphicShot("35b", () => (
          <Composition>
            {TERMINAL["35b"]!()}
            <GenStrip items={[{ src: reference.filmLastKind, from: reference.filmLastSmall, label: "shot.80.motion", start: GEN_AT["35b"].start, at: GEN_AT["35b"].at }]} />
          </Composition>
        ))
        .nextGraphicShot("35a", () => {
          const s = screen((width) =>
            reel({
              width,
              stage: "Video",
              frame: reference.filmLastKind,
              accepted: 79,
              selected: "80",
              changed: true,
              handoff: "Shot 80 again, with the whale filling the sky.",
              feedback: { target: "Shot 80", agent: "New take: the whale is big now, filling the sky over the harbour." },
            }),
          );
          return (
            <Composition>
              <Screen src={s} focus={[0.45, 0.35, 1.3]} />
            </Composition>
          );
        })
        .nextShot("32", () => {
          const k = key({
            plate: plates.windowInsert,
            plateKeep: "partially_preserved - the window, its glass, the raindrops, the pale violet curtain, the camera position and framing hold; the light is remade as dawn, as the description writes it.",
            refs: [],
            summary: "The rainy window of the bedroom, close, the sky outside beginning to pale at dawn.",
            text: "Dawn. Close on the tall rainy window, framed exactly as <Picture 1>: the glass fills the frame, its frame bars dividing it into two panes, a fold of the pale violet curtain along the right edge. Raindrops cling to the glass and run down it in thin streaks. Beyond the glass the dawn sky is pale blue-grey, lightening to a soft white and the faintest pink along the bottom, rooftops and treetops as dark shapes along the lower edge. The room side of the glass is still dim, cool blue light falling through.",
          });
          return (
            <Composition>
              <Panel src={k} blocking="雨粒が伝い落ち、窓の外が少しずつ白んでいく。" camera="fixed" />
              <DateCard items={["Deadline Day"]} start={0.15} />
            </Composition>
          );
        })
        .nextShot("33", ({ shot }) => {
          const k = keyAfter({
            prev: shot("35").image("key"),
            plate: plates.deskMedium,
            plateKeep: "partially_preserved - the set, camera position and framing hold; the light is remade as early dawn, as the description writes it.",
            refs: [KONTE, LAPTOP],
            prevKeep: "partially_preserved - the laptop's place and angle at the left of the desk, the manga stack at the right and the camera carry across; her pose and the light are remade as the description writes it.",
            summary: "At dawn, the same camera: <Subject 1> leaning far over the small laptop of <Subject 2>, clicking with a serious face.",
            text: "Early dawn: the desk lamp at the left edge is switched off and dark, the rainy window at the left glows pale blue-white with morning, a cool grey morning light fills the room, the off-white wall at the right in soft blue shadow. Seen at seated eye level across the desk, the small white laptop of <Subject 2> stands open on the left part of the desktop as in the previous shot, turned side-on to the camera, its screen facing screen right. <Subject 1> sits behind the desk just right of centre, leaning far forward and to screen left over the desk toward the laptop, her face close to its screen and lit cool white by it, her eyes wide and focused on the screen, her eyebrows drawn slightly together, her mouth a small, serious closed line; her arm on the frame's left reaches across the desk to the laptop, the index finger pressed down on its trackpad. Her hair is messy from the long night.",
          });
          return (
            <Composition>
              <Panel src={k} blocking="真剣な顔のままクリックし、肩がわずかに上がる。" camera="fixed" />
            </Composition>
          );
        })
        .nextGraphicShot("36", () => {
          const page = (done: boolean) => (width: number) =>
            reel({ width, stage: "Video", frame: reference.filmLastKind, accepted: done ? 80 : 79, selected: "80", allAccepted: done, feedback: { target: "Shot 80" } });
          return (
            <Composition>
              <Screen src={screen(page(false))} next={screenNext(page(true))} at={0.9} focus={[0.8, 0.32, 1.4]}>
                <Pointer from={[0.8, 0.5]} to={[0.862, 0.768]} move={0.6} click={0.8} />
              </Screen>
            </Composition>
          );
        })
        .nextGraphicShot("37", () => (
          <Composition>
            {TERMINAL["37"]!()}
            <GenStrip items={[{ src: reference.filmLastKind, label: "video.mp4 · 6:01", start: GEN_AT["37"].start, at: GEN_AT["37"].at, video: true }]} />
          </Composition>
        ))
        .nextShot("37a", () => (
          <Composition>
            <Panel src={reference.campus} blocking="生徒たちが広場をそれぞれの方向へ行き交う。" camera="fixed" />
            <DateCard items={["Screening Day"]} start={0.2} />
          </Composition>
        ))
        .nextShot("38", () => {
          const k = key({
            plate: reference.hall,
            place: "the darkened school auditorium in",
            plateKeep: "fully_preserved - the auditorium, the silhouetted audience, the camera position, framing and light hold; the screen shows the film as the description writes it.",
            refs: [{ image: reference.filmPanelKind, def: "the painted film frame, a soft gouache picture of a whale folded from cream paper swimming over rainy slate-blue rooftops, in", keep: "fully_preserved - its picture plays on the projection screen, small inside the frame." }],
            summary: "The darkened auditorium of <Subject 1> during the screening, the painted paper whale of <Subject 2> on the glowing screen.",
            text: "The darkened school auditorium of <Subject 1> seen from the back at seated eye level, as in <Picture 1>: rows of theater seats filled with students drawn as soft dark violet silhouettes of heads and shoulders across the lower half of the frame. The large projection screen at the front glows, the only light in the room, showing the painted film frame of <Subject 2> whole: the cream paper whale swimming toward screen left over the rainy slate-blue rooftops. Its pale glow spills over the tops of the silhouetted heads.",
          });
          return (
            <Composition>
              <Panel src={k} blocking="スクリーンの中で紙のクジラが左へ泳いでいく。客席は動かない。" camera="fixed" />
            </Composition>
          );
        })
        .nextShot("39", () => (
          <Composition>
            <Panel src={reference.filmPanelKind} blocking="紙のクジラが左へゆっくり泳ぎながら、やさしい目をこちらへ向ける。" camera="fixed" />
          </Composition>
        ))
        .nextShot("41", () => {
          const k = key({
            plate: reference.view.hall.back,
            place: "the darkened school auditorium, seen from the screen side, in",
            plateKeep: "partially_preserved - the rows of seats, the silhouetted students facing the camera, the dark navy walls and the screen's cool blue-white light hold; the camera comes in close on one seat.",
            refs: [KONTE, MANUSCRIPT],
            summary: "<Subject 2>, close, seated in the dark auditorium of <Subject 1>, hugging the manga stack of <Subject 3> and smiling with joy in the light of the screen.",
            text: "Close at seated eye level from the screen side of the auditorium of <Subject 1>: <Subject 2> sits deep in one of the theater seats, her head and shoulders filling the middle of the frame, the seatback rising behind her to the top of her head, rows of theater seats and dark silhouetted students behind her fading into navy shadow. Both of her arms hug the thick manga stack of <Subject 3> against her chest, its top edge just above the bottom edge of the frame. Her face is lit only from the front by the cool blue-white glow of the screen toward the camera, deep navy shadow at the sides of her face and in her hair. She looks just past the lens at the screen, smiling a huge, happy smile: her eyes bright and glistening with big highlights reflecting the screen, her eyebrows lifted, her cheeks raised, her mouth open in a joyful grin.",
          });
          return (
            <Composition>
              <Panel src={k} blocking="原稿を抱きしめたまま、顔いっぱいに笑う。" camera="fixed" />
            </Composition>
          );
        }),
    };
  },
});
