import { defineReference, asset, adapters } from "konte";
import { imageKrea2TurboT2i } from "konte/workspace/adapters/comfy/image_krea2_turbo_t2i.js";
import { imageMinimaxH3R2i } from "konte/workspace/adapters/comfy/image_minimax_h3_r2i.js";
import { imageQwenImageEdit21 } from "konte/workspace/adapters/comfy/image_qwen_image_edit_2_1.js";
import { audioYue2 } from "konte/workspace/adapters/comfy/audio_yue2.js";
import type { MediaAsset } from "konte";
import direction from "./direction";

const STYLE =
  "Modern flat-colour anime illustration in the style of a cute mobile-game mascot key visual: bold, clean dark outlines of even weight, bright flat cel colours filled edge to edge, one simple step of soft lavender shading, crisp edges everywhere.";

export const FILM_STYLE =
  "Soft painterly picture-book illustration in thick, velvety gouache: visible round brush strokes, colours laid in soft overlapping layers, edges melting gently into one another, a faint warm paper grain under the paint.";

const PROP_GROUND =
  "The object alone, centred and filling most of the frame, on a plain warm off-white background, even soft daylight, a faint soft shadow beneath it.";

const MANGA_STYLE = "A black-and-white manga panel drawn in ink: bold black ink lines, grey screentone shading, white paper, the same hand and line as <Picture 1>.";

/** One panel of konte-chan's manga, redrawn flat and square-on from the style of her manuscript. */
function mangaPanel(
  manuscript: MediaAsset<"image">,
  name: string,
  text: string,
  keep = "attribute_transfer - the ink line, screentone, paper and drawing hand carry over onto a new panel.",
  subject = "its ink line, screentone, paper and drawing hand",
) {
  return asset(name, imageMinimaxH3R2i, {
    width: 1344,
    height: 768,
    image1: manuscript,
    prompt: {
      subjectDefinitions: [`<Subject 1> is the black-and-white ink manga of <Picture 1>: ${subject}.`],
      summary: { tasks: ["reference generation"], text: "One manga panel, flat and square-on, filling the whole frame." },
      retentionAnalysis: [`<Subject 1> (appears in [Shot 1]): ${keep}`],
      detailedDescription: { style: `2D-animated. ${MANGA_STYLE}`, shots: [`One single landscape manga panel seen flat and square-on, filling the whole frame edge to edge, its black border running along the four edges of the frame. ${text}`] },
    },
  });
}

const file = (name: string) => `assets/files/${name}` as const;

export default defineReference(direction, {
  references: () => {
    const konte = asset("konte", adapters.imageFile, { path: file("konte-character.png") });
    const konteVoice = asset("konteVoice", adapters.audioFile, { path: file("konte-voice.mp3") });

    const poster = asset("poster", imageKrea2TurboT2i, {
      prompt: `${STYLE} A school film festival poster, portrait, printed in a hand-silkscreened look in violet and sunflower yellow on cream paper, seen straight on. Across the top in big bold rounded violet letters it reads "FILM FESTIVAL". In the middle, a yellow film reel and a black-and-white clapperboard drawn in simple bold shapes, a strip of film curling around them. Near the bottom in a yellow band, bold violet letters read "Entries due SUNDAY". Four red push pins hold its corners. ${PROP_GROUND}`,
    });

    const manuscript = asset("manuscript", imageKrea2TurboT2i, {
      prompt: `${STYLE} A thick stack of hand-drawn manga manuscript pages, the edges of many sheets showing along the side, seen from slightly above. The top page is a black-and-white ink manga page with screentone, divided into four panels by bold black borders. The largest panel at the top shows a big whale folded from paper, crisp origami facets, swimming above the rooftops of a rainy town, its one small round eye gentle and soft, looking toward the viewer. Small panels below show rain on rooftops and a girl looking up. Clean white paper, black ink, grey screentone. ${PROP_GROUND}`,
    });




    const laptop = asset("laptop", imageKrea2TurboT2i, {
      prompt: `${STYLE} A small, thin white laptop, open, seen from the front, slightly from above and to the left. The screen stands upright at the back and faces the viewer, dark grey and blank, framed by a thin white bezel. In front of it lies the flat white keyboard deck with rows of pale grey keys and a plain trackpad below them, its front edge thin and straight. ${PROP_GROUND}`,
    });

    const paperWhale = asset("paperWhale", imageKrea2TurboT2i, {
      prompt: `${FILM_STYLE} A large whale folded from cream paper like origami, crisp facets with soft creases, pale ivory planes and cool slate-blue shadows in the folds, a long gently curved body and a broad tail fin, one small round dark eye with a soft highlight, gentle and kind. It swims in side view, filling the frame, against a plain soft grey-blue painted background with a few faint streaks of rain.`,
    });

    const room = asset("room", imageKrea2TurboT2i, {
      prompt: `${STYLE} A small, quiet teenage bedroom, seen at seated eye height from the far side of a small study desk, looking across the desk toward the room. A small white study desk runs across the lower part of the picture, its top scattered with loose sheets of paper, a violet pencil cup and a few eraser crumbs. An empty violet chair is tucked behind the desk. On the left, a tall window beside the desk with rain running down the glass and a soft white rainy sky outside, a pale violet curtain tied at its edge. Behind the chair, a smooth off-white wall with a small bookshelf of violet and pastel spines on the right and a small potted green plant. White, violet and pale lavender with small touches of mint green and sunflower yellow. Soft, cool, even rainy daylight from the window on the left, gentle pale shadows.`,
    });

    const hallway = asset("hallway", imageKrea2TurboT2i, {
      prompt: `${STYLE} An empty school hallway after school, seen at standing eye height from a three-quarter angle down its length. On the left wall, a large cork bulletin board in a light wood frame, covered with club notices and printed handouts held by coloured push pins. On the right, a long row of tall windows with rain running down the glass and a soft white rainy sky outside, their light reflecting as pale stripes on the polished pale grey floor. The hallway runs away toward a far door in the centre. Off-white walls with a pale violet stripe along the lower wall. White, pale grey and violet with small touches of sunflower yellow on the notices. Soft, cool, even rainy daylight from the windows on the right.`,
    });

    const campus = asset("campus", imageKrea2TurboT2i, {
      prompt: `${STYLE} A school campus on the day of its film festival, seen from a slightly raised spot at the edge of a wide paved plaza in bright morning light. Across the far side of the plaza, filling the upper middle of the picture, a white-walled school building with rows of windows and a small clock tower in its centre, a long violet banner with a film reel drawn on it hanging down the front of the clock tower. Strings of violet and sunflower yellow pennant flags run in loose swags from the building to tall poles across the plaza. Small festival stalls with striped violet-and-white awnings line both sides of the plaza, a few round paper lanterns and balloons tied to their posts. Pale grey paving stones cover the lower third of the picture, a few planters with green shrubs at the edges. Students in white and navy school uniforms walk and gather across the plaza, drawn with slender, natural anime proportions about six heads tall, long legs and small heads: a few walk in the near foreground, standing about a third of the picture's height, others in pairs pointing at the stalls further back, getting smaller with distance. Clear soft blue sky with a few white clouds after the rain, small puddles on the paving catching the sky. White, violet, sunflower yellow and fresh green. Bright, even morning daylight from the upper left, soft pale shadows.`,
    });

    const hall = asset("hall", imageKrea2TurboT2i, {
      prompt: `${STYLE} A school auditorium darkened for a film screening, seen from the back of the room at seated eye height. Rows of theatre seats fill the lower half of the picture, the backs of the audience's heads as soft, smooth dark violet silhouettes, seen only from behind. At the front, a large projection screen fills the upper middle of the picture, glowing a soft blank warm white, the only light in the room. The light from the screen spills over the tops of the seats and the silhouettes' hair in a pale rim. Dark navy and deep violet walls fading into shadow at the sides. Deep navy, violet and warm white.`,
    });

    const mangaWhale = mangaPanel(
      manuscript,
      "mangaWhale",
      "It is the large top panel of the top page in <Picture 1>, redrawn whole: a big whale folded from paper, crisp origami facets, swims toward screen left across the upper half of the panel, its head at the left, one small round dark eye on its head; tiled rooftops, utility poles and small houses of a rainy town fill the lower third under a grey, cloudy sky.",
      "partially_preserved - the top panel's composition, the paper whale, the rooftops and the ink line hold; it is redrawn flat and square-on, filling the frame.",
      "its line, screentone, paper whale and rainy town",
    );
    const mangaRain = mangaPanel(
      manuscript,
      "mangaRain",
      "Heavy rain streams down in long straight lines over the tiled rooftops of the rainy town, a utility pole on the left, a small house beyond the roofs on the right.",
    );
    const mangaGirl = mangaPanel(
      manuscript,
      "mangaGirl",
      "A girl with shoulder-length black hair in a school uniform stands in the rain at the right of the panel, holding a dark umbrella tilted back over one shoulder, her face turned up toward the sky at the upper left, her eyes wide and quiet; rain lines fill the panel behind her.",
    );
    const mangaHarbour = mangaPanel(
      manuscript,
      "mangaHarbour",
      "Seen wide from a rooftop, the paper whale flies high in the cloudy sky in the upper right of the panel, small, gliding away through the air above a harbour of calm water and small boats far below it, the rain thinning to a few lines, the rooftops of the town along the bottom edge.",
      undefined,
      "its line, screentone, paper whale and rainy town",
    );

    const filmTown = asset("filmTown", imageKrea2TurboT2i, {
      width: 1920,
      height: 1088,
      prompt: `${FILM_STYLE} A narrow old hillside harbour town in steady rain, seen wide from a high rooftop: slate-blue tiled rooftops, utility poles and small houses stepping down toward a grey-teal harbour, wet lanes holding long amber reflections of lit windows, an open misty grey-violet sky over the water. Palette of deep slate blue, misty teal and grey-violet, warm honey amber in every window. Diffuse rainy light, soft atmospheric haze in the distance.`,
    });
    const filmGirl = asset("filmGirl", imageKrea2TurboT2i, {
      prompt: `${FILM_STYLE} One girl with shoulder-length black hair in a navy school uniform, holding a dark green umbrella tilted back over one shoulder, standing whole in a three-quarter view and looking up with a quiet, curious face. Centred on a plain, even, soft misty grey-blue painted ground with a little margin around her, even diffuse light, the girl filling most of the frame.`,
    });

    const filmFrame = (name: string, eye: string, eyeKeep: string) =>
      asset(name, imageMinimaxH3R2i, {
        width: 1344,
        height: 768,
        image1: mangaWhale,
        image2: paperWhale,
        image3: filmTown,
        prompt: {
          subjectDefinitions: [
            "<Picture 1> is the manga panel whose composition this frame keeps.",
            "<Subject 1> is the whale folded from cream paper in <Picture 2>: crisp origami facets with soft creases, pale ivory planes and cool slate-blue shadows in the folds.",
            "<Subject 2> is the painted harbour town of <Picture 3>: slate-blue rooftops in steady rain, warm amber windows, thick velvety gouache.",
          ],
          summary: { tasks: ["reference generation"], text: "The manga panel of <Picture 1> painted as a frame of the film: the paper whale of <Subject 1> over the town of <Subject 2>." },
          retentionAnalysis: [
            "<Picture 1> ([Shot 1] composition): partially_preserved - the composition holds: the whale's size, place and heading, the rooftops along the bottom; the ink drawing is repainted in colour.",
            `<Subject 1> (appears in [Shot 1]): partially_preserved - the paper whale's folded body and colours hold; its pose follows <Picture 1>; ${eyeKeep}`,
            "<Subject 2> (appears in [Shot 1]): attribute_transfer - the gouache medium, palette and rainy light carry over onto the composition of <Picture 1>.",
          ],
          detailedDescription: {
            style: "watercolor. A soft painterly picture-book illustration in thick, velvety gouache with visible round brush strokes and a faint warm paper grain.",
            shots: [
              `The composition of <Picture 1>, painted: the paper whale of <Subject 1> swims toward screen left across the upper half of the frame, its head at the left, over the slate-blue tiled rooftops, utility poles and small houses of <Subject 2> along the bottom third, fine rain streaking across a misty grey-violet sky, warm amber windows glowing below. ${eye}`,
            ],
          },
        },
      });
    const filmPanel = filmFrame(
      "filmPanel",
      "Its one visible eye is small, narrow and hard, a flat black slit under a heavy straight fold, a stern, cold look.",
      "its eye is remade as the description writes it, a narrow flat black slit under a heavy straight fold, overriding the round eye of <Picture 2> and <Picture 1>.",
    );
    const filmLast = (name: string, whale: string) =>
      asset(name, imageMinimaxH3R2i, {
        width: 1344,
        height: 768,
        image1: paperWhale,
        image2: filmTown,
        prompt: {
          subjectDefinitions: [
            "<Subject 1> is the whale folded from cream paper in <Picture 1>: crisp origami facets with soft creases, pale ivory planes and cool slate-blue shadows in the folds, one small round dark eye.",
            "<Subject 2> is the painted harbour town of <Picture 2>: slate-blue rooftops, a grey-teal harbour, warm amber windows, thick velvety gouache.",
          ],
          summary: { tasks: ["reference generation"], text: "The last frame of the painted film: the harbour of <Subject 2>, the paper whale of <Subject 1> over it." },
          retentionAnalysis: [
            "<Subject 1> (appears in [Shot 1]): partially_preserved - the paper whale's folded body, colours and proportions hold; its size and place in the frame are remade as the description writes them.",
            "<Subject 2> (appears in [Shot 1]): attribute_transfer - the gouache medium, brushwork, palette and rainy light carry over onto a wider composition.",
          ],
          detailedDescription: {
            style: "watercolor. A soft painterly picture-book illustration in thick, velvety gouache with visible round brush strokes and a faint warm paper grain.",
            shots: [
              `From a rooftop at the edge of the town of <Subject 2>, the harbour spreads out below: slate-blue rooftops and chimneys along the bottom edge, the calm grey-teal water with small boats and warm lanterns across the middle, the rain thinning to a few fine streaks and pale gold light breaking through the clouds over the water on the right. ${whale}`,
            ],
          },
        },
      });
    const filmLastSmall = filmLast(
      "filmLastSmall",
      "The paper whale of <Subject 1> is small and far away in the upper right corner of the frame, about one twentieth of the frame's width, gliding away toward the upper right edge, seen from slightly behind; open grey sky and wide water fill most of the picture around it.",
    );
    const filmLastKind = filmLast(
      "filmLastKind",
      "The paper whale of <Subject 1> is enormous, filling the whole upper two thirds of the frame from edge to edge, gliding over the harbour toward screen right, its broad paper belly and fins spread across the sky, its one gentle eye near the right, the boats and rooftops tiny beneath it.",
    );

    const filmPanelKind = asset("filmPanelKind", imageQwenImageEdit21, {
      width: 1344,
      height: 768,
      image1: filmPanel,
      prompt:
        "In <image1>, only the paper whale's eye is redrawn: it becomes round, wide open and soft, a dark pupil with a small white highlight and a gentle upturned crease beneath it, a kind, warm look. Keep the whale's folded body, its pose and size, the rooftops, the rain, the colours, the gouache brushwork and the framing of <image1> unchanged.",
    });

    const filmClip = (name: string, shot: string, eye: string) =>
      asset(name, imageMinimaxH3R2i, {
        width: 1344,
        height: 768,
        image1: paperWhale,
        image2: filmTown,
        prompt: {
          subjectDefinitions: [
            "<Subject 1> is the whale folded from cream paper in <Picture 1>: crisp origami facets with soft creases, pale ivory planes and cool slate-blue shadows in the folds.",
            "<Subject 2> is the painted harbour town of <Picture 2>: slate-blue rooftops in steady rain, warm amber windows, thick velvety gouache.",
          ],
          summary: { tasks: ["reference generation"], text: "A frame of a short video clip: the paper whale of <Subject 1> over the town of <Subject 2>, its head and eye large in the frame." },
          retentionAnalysis: [
            "<Subject 1> (appears in [Shot 1]): partially_preserved - the paper whale's folded body and colours hold; its eye is remade as the description writes it; its pose and place in the frame are new.",
            "<Subject 2> (appears in [Shot 1]): attribute_transfer - the gouache medium, palette and rainy light carry over onto a new composition.",
          ],
          detailedDescription: {
            style: "watercolor. A soft painterly picture-book illustration in thick, velvety gouache with visible round brush strokes and a faint warm paper grain.",
            shots: [`${shot} ${eye}`],
          },
        },
      });
    const filmPanelSleepy = filmClip(
      "filmPanelSleepy",
      "Seen from below, the paper whale of <Subject 1> glides overhead toward screen right, its head filling the left half of the frame, its folded belly running off the right edge; the eaves of two slate-blue roofs of <Subject 2> cut into the bottom corners, fine rain streaking across a misty grey-violet sky.",
      "Its one visible eye, large and clear on its head, is heavy and drooping, the upper lid sagging low over half of a small dull pupil, a sleepy, bored look.",
    );
    const filmPanelSharp = filmClip(
      "filmPanelSharp",
      "Three-quarter front view, the paper whale of <Subject 1> swims toward the camera over the rooftops of <Subject 2>, its head large in the middle of the frame, its fins spreading toward both edges, rain falling in front of it.",
      "Its one visible eye, large and clear on its head, is small, narrow and hard, a flat black slit under a heavy straight fold, a stern, cold look.",
    );

    const bgm = asset("bgm", audioYue2, {
      style: "Bright playful indie pop, 112 BPM, 4/4, plucky acoustic guitar, glockenspiel melody, soft upright piano, light brushed drums, round warm bass, gentle handclaps, cozy warm production",
      lyrics: "",
      bpm: 112,
      maxDuration: 150,
    });

    return {
      konte,
      konteVoice,
      poster,
      manuscript,
      laptop,
      paperWhale,
      room,
      hallway,
      campus,
      hall,
      mangaWhale,
      mangaRain,
      mangaGirl,
      mangaHarbour,
      filmTown,
      filmGirl,
      filmPanel,
      filmPanelKind,
      filmPanelSleepy,
      filmPanelSharp,
      filmLastSmall,
      filmLastKind,
      bgm,
    };
  },
  views: ({ reference }) => {
    const hallwaySide = asset("hallwaySide", imageMinimaxH3R2i, {
      image1: reference.hallway,
      prompt: {
        subjectDefinitions: [
          "<Subject 1> is the school hallway in <Picture 1>, with its cork bulletin board in a light wood frame, its row of tall rainy windows and its off-white walls with a pale violet stripe.",
        ],
        summary: {
          tasks: ["reference generation"],
          text: "The hallway of <Subject 1> seen square-on to the wall that holds the cork bulletin board.",
        },
        retentionAnalysis: [
          "<Subject 1> (appears in [Shot 1]): attribute_transfer - the walls, the bulletin board, the floor, the palette and the rainy light carry over; the camera position is new.",
        ],
        detailedDescription: {
          style: "2D-animated. Flat-colour anime illustration with bold, clean dark outlines and bright flat cel colours.",
          shots: [
            "The camera stands in the middle of the hallway of <Subject 1> at standing eye height, facing the left-hand wall square-on, with the row of rainy windows behind it. The cork bulletin board fills the middle half of the frame, its light wood frame level with the frame's edges, club notices and printed handouts held by coloured push pins across it. Off-white wall with the pale violet stripe along its lower part shows on both sides of the board, the pale grey floor along the bottom tenth of the frame. Soft, cool rainy daylight falls onto the wall from behind the camera, with faint pale stripes of window light across the board.",
          ],
        },
      },
    });

    const roomTop = asset("roomTop", imageMinimaxH3R2i, {
      image1: reference.room,
      prompt: {
        subjectDefinitions: [
          "<Subject 1> is the bedroom in <Picture 1>, with its small white study desk, the violet chair, the tall rainy window with a pale violet curtain, and the off-white walls.",
        ],
        summary: {
          tasks: ["reference generation"],
          text: "The study desk of <Subject 1> seen from straight above.",
        },
        retentionAnalysis: [
          "<Subject 1> (appears in [Shot 1]): attribute_transfer - the desk, its loose sheets, the violet pencil cup, the palette and the rainy light carry over; the camera position is new.",
        ],
        detailedDescription: {
          style: "2D-animated. Flat-colour anime illustration with bold, clean dark outlines and bright flat cel colours.",
          shots: [
            "A flat top-down plan view: the camera hangs directly above the study desk of <Subject 1>, its axis pointing straight down at the floor. The white desk top is seen as a flat rectangle that fills the whole frame from edge to edge, its sides and legs out of sight beneath it, its long edge running left to right: a few loose sheets of white paper, the violet pencil cup near the top edge and a few grey eraser crumbs lie on it, with plenty of bare white desk top between them. Along the left edge, a thin strip of the window sill with its pale violet curtain. Soft, cool rainy daylight falls across the desk from the left, with gentle pale shadows toward the right.",
          ],
        },
      },
    });

    const hallBack = asset("hallBack", imageKrea2TurboT2i, {
      prompt: `${STYLE} A school auditorium darkened for a film screening, seen from the front of the room, from just below the glowing projection screen, at seated eye height, looking back over the audience. Rows of deep violet theatre seats with pale pink-violet tops face the camera and fill the lower two thirds of the picture, rising gently toward the back. In every seat a student sits facing the camera, looking up past it toward the screen, each one a soft, smooth dark violet silhouette with the face in shadow, the tops of their heads and their shoulders rimmed in soft warm white light from the screen behind the camera. Behind the last row, the dark back wall with a small projection booth window glowing near its top centre. Dark navy and deep violet walls fading into shadow at the sides. Deep navy, violet and warm white.`,
    });

    return {
      hallway: { side: hallwaySide },
      room: { top: roomTop },
      hall: { back: hallBack },
    };
  },
});
