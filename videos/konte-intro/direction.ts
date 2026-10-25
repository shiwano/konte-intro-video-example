import { defineDirection } from "konte";

export default defineDirection({
  brief: {
    logline:
      "学園の映画祭に、描き上げた漫画『The Paper Whale』を映画にして出したいkonteちゃん。動画生成サイトで1本のクリップはうまく作れても、つなげるほどクジラの顔はばらばらになり、作り直しのファイルに埋もれていく。半信半疑で試したkonteでエージェントに作業を任せて監督に回ると、表情へのこだわりが80ショットの作品を仕上げる力に変わる。",
    hook: "放課後の雨の廊下で、掲示板の映画祭のポスターに目を留めたkonteちゃんの顔が、きらきらに輝く。",
    audience:
      "Comfyの「Open Source Higgsfield」コンペティションの審査員と、YouTube・SNSで見る人。音なしでも字幕で話が追える。見終わって言わせたい一言は「物語のある、ちゃんとした映画が、私にも作れそう」。konteちゃんを好きになることが、そのままkonteを好きになることに重なるように。",
    tone: "明るく、テンポよく、愛おしい。顔のアップで感情を運び、わくわく→ちょっと嬉しい→途方に暮れる→直しに夢中→満面の笑顔という表情の変化がリズムになる。前半は動画生成サイトの画面と彼女の顔の短い切り返しで、うまくいった喜びからクリップの山に埋もれていくまでを積み重ね、後半はkonteの画面と彼女の顔の切り返しで加速し、締め切りぎりぎりのAcceptで頂点。上映会では少し長めに見せて、嬉しそうな笑顔で切る。全体は2分を切る尺に収める。",
    look: "2Dアニメ。キャラクターシートと同じ太めの線と明るいフラットな塗りのポップな絵柄。白と紫を基調に、部屋の小物で色数を足す。劇中作『The Paper Whale』だけは、絵本のような柔らかい厚塗りで描き分ける。konteのレビュー画面は実物どおりのUIコンポーネントで組み、架空の動画生成サイト、konteのページ、Comfy Developer PlatformのページとClaude Codeのターミナルはモックで再現する。どれも生成しない。日付はゲームのカレンダー演出のような、大きく傾いた数字と曜日のHTMLカードにして、映像の上にかぶせる。カメラは基本固定。横16:9。",
    outOfScope: [
      "AIが全部やってくれる「おまかせ」に見せない。彼女の判断で作品が良くなる",
      "konteちゃんを笑われるドジっ子にしない",
      "機能の列挙やナレーションでの解説はしない。konteの革新性や仕組みを彼女に語らせない",
      "konteを見つけても大喜びさせない。半信半疑で試してみる",
      "動画生成サイトを悪者にしない。単発のクリップはうまくいき、困るのは何ショットもの作品をまとめること。実在のサービスに似せない",
      "キラキラのSaaSプロモ風の演出は出さない。konteの画面は実物のUIから外れない",
      "ゆっくり漂うカメラやスローモーションは使わない",
      "APIキーなどの秘密の情報は画面に映さない",
      "締めのロゴやキャッチコピーは出さない。嬉しそうな笑顔で終わる",
    ],
    tolerances: [
      "絵の中の原稿の文字は読めなくてよい",
      "漫画原稿の枚数は、ショット間で厳密に揃わなくてよい",
    ],
  },
  characters: {
    konte: {
      name: "konteちゃん",
      promptDepiction: "girl",
      description:
        "黒髪ボブに紫の星柄リボンのカチューシャ、黒いチョーカー。konteロゴ入りの白いパーカー、紫の縁取りの黒いプリーツスカート、白いレッグウォーマーに紫のスニーカー、紫の小さなショルダーバッグ。表情がころころ変わる。絵を描くのが好きで、顔の表情には人一倍こだわる。",
      voice: {
        id: "konteVoice",
        description: "少女、十代前半の明るく軽い声、歯切れがよい。英語。",
      },
    },
  },
  props: {
    poster: {
      name: "映画祭のポスター",
      promptDepiction: "film festival poster",
      description:
        "学園映画祭のポスター。紫と黄色の手刷り風で、フィルムとカチンコの絵。締め切りは日曜。廊下の掲示板に画鋲で留めてある。",
    },
    manuscript: {
      name: "漫画原稿の束",
      promptDepiction: "stack of manga manuscript pages",
      description:
        "konteちゃんが描き上げた漫画『The Paper Whale』の原稿用紙の束。白黒のペン画で、一番上のページには、雨の街の上を泳ぐ紙のクジラが、やさしい目でこちらを見るコマがある。厚みがある。",
    },
    laptop: {
      name: "ノートパソコン",
      promptDepiction: "small laptop",
      description:
        "白くて小さな薄型ノートパソコン。天板は無地。重い処理ができるGPUは積んでいない。",
    },
    paperWhale: {
      name: "紙のクジラ",
      promptDepiction: "paper whale",
      description:
        "劇中作『The Paper Whale』の主役。折り紙のような紙でできた大きなクジラで、雨の街の上を泳ぐ。やさしい目。絵本のような柔らかい厚塗りで描かれる。",
    },
  },
  locations: {
    room: {
      name: "konteちゃんの部屋",
      description: "小さな自分の部屋。白い壁に紫の小物。机は雨の降る窓のそばにある。",
      landmarks: {
        window: {
          name: "雨の窓",
          promptDepiction: "rainy window",
          description: "机の左手の窓。ずっと雨が伝っている。昼は白く、夜は暗い青。",
        },
        desk: {
          name: "机",
          promptDepiction: "desk",
          description: "白い天板の小さな勉強机。紙と鉛筆と消しかすが散らばる。",
        },
      },
    },
    hallway: {
      name: "放課後の学校の廊下",
      description:
        "放課後の、ひと気のない校舎の廊下。片側の壁に掲示板、反対側に雨の窓が並び、白い光が床に映る。",
      landmarks: {
        bulletinBoard: {
          name: "廊下の掲示板",
          promptDepiction: "school bulletin board",
          description: "コルクの掲示板。部活のお知らせやプリントが画鋲で留められている。",
        },
        hallWindow: {
          name: "廊下の雨の窓",
          promptDepiction: "row of rainy hallway windows",
          description: "廊下に並ぶ大きな窓。外は雨で、ガラスを雨粒が伝う。",
        },
      },
    },
    campus: {
      name: "映画祭の日の学園",
      description: "映画祭の当日の学園。校舎の前の広場に飾りや出店が並び、生徒たちでにぎわう。",
      landmarks: {
        schoolBuilding: {
          name: "校舎",
          promptDepiction: "school building",
          description: "白い壁の校舎。時計塔があり、映画祭の大きな垂れ幕が下がる。",
        },
        plaza: {
          name: "校舎前の広場",
          promptDepiction: "school plaza",
          description: "紫と黄色の旗飾りが渡され、出店が並ぶ広場。小さな人影の生徒たちが行き交う。",
        },
      },
    },
    hall: {
      name: "学園の上映会場",
      description: "学園の講堂を暗くした上映会場。客席を埋める生徒たちは、顔の見えない影。",
      landmarks: {
        seats: {
          name: "客席",
          promptDepiction: "theater seats",
          description: "暗い客席の列。生徒たちのシルエットが並ぶ。",
        },
        screen: {
          name: "スクリーン",
          promptDepiction: "projection screen",
          description: "講堂の正面の大きなスクリーン。会場で唯一の光。",
        },
      },
    },
  },
  setups: {
    boardMedium: {
      name: "掲示板の前のkonteちゃん",
      description:
        "廊下の斜め前から、掲示板の前に立つ彼女を腰上で。画面左に掲示板、右奥へ雨の窓が並ぶ廊下が続く。",
      location: "hallway",
      framing: "medium",
      view: "front",
      within: null,
      holds: ["bulletinBoard", "hallWindow"],
    },
    hallClose: {
      name: "廊下のkonteちゃんの顔",
      description:
        "同じ軸から、掲示板を見る彼女の顔いっぱいに。画面左の手前に掲示板のポスターの端がぼけて入り、奥に雨の窓がぼける。",
      location: "hallway",
      framing: "close",
      within: "boardMedium",
      holds: ["bulletinBoard", "hallWindow"],
    },
    posterInsert: {
      name: "掲示板のポスターの寄り",
      description: "掲示板に留められたポスターを正面から寄りで。",
      location: "hallway",
      framing: "insert",
      view: "side",
      holds: [],
    },
    manuscriptInsert: {
      name: "掲げた原稿の寄り",
      description: "彼女が掲げた原稿の一番上のページが画面を埋める。ふちに指がかかる。",
      location: "hallway",
      framing: "insert",
      view: "front",
      holds: [],
    },
    deskMedium: {
      name: "机のkonteちゃん",
      description: "机の向こう正面から、机に向かう彼女を腰上で。画面左に雨の窓、右は白い壁。",
      location: "room",
      framing: "medium",
      view: "front",
      within: null,
      holds: ["window", "desk"],
    },
    konteClose: {
      name: "konteちゃんの顔",
      description: "同じ軸から、彼女の顔いっぱいに。画面左の奥に雨の窓がぼける。",
      location: "room",
      framing: "close",
      within: "deskMedium",
      holds: ["window"],
    },
    windowInsert: {
      name: "雨の窓の寄り",
      description:
        "机の左手の雨の窓を、机の向こう正面の軸から寄りで。窓ガラスと外の光だけが画面を埋める。",
      location: "room",
      framing: "insert",
      view: "front",
      holds: [],
    },
    deskInsertNight: {
      name: "夜の机の上の寄り",
      description: "夜の机の天板を真上から。ランプの暖かい光が左上から落ち、右下へ影になる。",
      location: "room",
      framing: "insert",
      view: "top",
      holds: [],
    },
    campusWide: {
      name: "映画祭の学園の遠景",
      description: "広場の端の少し高い位置から、にぎわう広場の向こうに校舎を正面に。",
      location: "campus",
      framing: "wide",
      view: "front",
      within: null,
      holds: ["plaza", "schoolBuilding"],
    },
    hallWide: {
      name: "客席越しのスクリーン",
      description: "会場の後方から、影の生徒たちの頭越しに、光るスクリーンを正面に。",
      location: "hall",
      framing: "wide",
      view: "front",
      within: null,
      holds: ["seats", "screen"],
    },
    screenInsert: {
      name: "スクリーンの寄り",
      description: "スクリーンの映像だけが画面を埋める。",
      location: "hall",
      framing: "insert",
      view: "front",
      holds: [],
    },
    seatClose: {
      name: "客席のkonteちゃん",
      description:
        "スクリーン側から、客席に座る彼女の顔を。スクリーンの光が顔に当たり、後ろの列は影。",
      location: "hall",
      framing: "close",
      view: "back",
      within: null,
      holds: ["seats"],
    },
  },
  policy: {
    format: {
      fps: 24,
      size: {
        megapixels: 0.9,
        delivery: { width: 1280, height: 720 },
      },
    },
    lang: "en",
    fonts: ["Nunito"],
  },
  waivers: {
    "view-unanchored_hall.back":
      "客席側の眺めは、編集では観客が後ろ向きのままになるため、人間の指示で同じ絵柄の文章からKreaで一から描く。",
  },
  sequence: {
    lens: "mini-drama",
    pleasure: "cute",
    shots: [
      {
        id: "01",
        role: "ordinary",
        action:
          "雨の窓が並ぶ放課後の廊下で、漫画原稿の束を胸に抱えたkonteちゃんが、廊下の掲示板の映画祭のポスターに目を留めて、顔をきらきら輝かせる。",
        setup: "hallClose",
        duration: 3,
        lineup: ["konte"],
      },
      {
        id: "02",
        role: "ordinary",
        action:
          "廊下の掲示板に留められた映画祭のポスターの締め切りの欄を、konteちゃんの指がなぞる。",
        setup: "posterInsert",
        duration: 2.5,
        lineup: ["konte"],
        script: [
          {
            character: "konte",
            text: "A film festival!",
            acting: "息をのんでから、うれしさがこぼれるように。",
          },
        ],
      },
      {
        id: "03",
        role: "ordinary",
        action: "廊下の掲示板の前で、konteちゃんが漫画原稿の束を両手で高く掲げる。",
        setup: "boardMedium",
        duration: 3.5,
        lineup: ["konte"],
        script: [
          {
            character: "konte",
            text: "I'm making this into a movie!",
            acting: "胸を張って、宣言するように。",
          },
        ],
      },
      {
        id: "04",
        role: "ordinary",
        action:
          "掲げた漫画原稿の束の一番上のページで、雨の街の上を泳ぐ紙のクジラのコマが、やさしい目でこちらを見ている。",
        setup: "manuscriptInsert",
        duration: 2,
        lineup: ["konte"],
      },
      {
        id: "n01",
        role: "ordinary",
        action:
          "雨の窓の自分の部屋で、漫画原稿の束を机に置いたkonteちゃんが、そのとなりでノートパソコンのふたを開く。",
        setup: "deskMedium",
        duration: 1.5,
        lineup: ["konte"],
        join: "jump-forward",
      },
      {
        id: "n02",
        kind: "graphic",
        role: "ordinary",
        action:
          "架空の動画生成サイトの画面に、漫画原稿の紙のクジラのコマの画像がドロップされ、生成ボタンが押される。",
        duration: 2,
      },
      {
        id: "n03",
        kind: "graphic",
        role: "ordinary",
        action:
          "動画生成サイトの画面で、できあがったクリップが再生され、紙のクジラが雨の街の上を泳ぐ。",
        duration: 1.5,
      },
      {
        id: "n04",
        role: "ordinary",
        action: "画面の光を浴びたkonteちゃんの顔に、じわっと笑みが広がる。",
        setup: "konteClose",
        duration: 2,
        lineup: ["konte"],
        script: [
          {
            character: "konte",
            text: "Oh! Not bad!",
            acting: "思ったよりいい、という驚きまじりに、小さく弾んで。",
          },
        ],
      },
      {
        id: "n05",
        kind: "graphic",
        role: "disruption",
        action:
          "動画生成サイトのタイムラインにクリップが次々と並んでいき、並んだサムネイルの紙のクジラが、一枚ごとに違う目つきになっている。",
        duration: 2.5,
      },
      {
        id: "n06",
        role: "disruption",
        action: "konteちゃんが画面に顔を近づけ、眉を寄せる。",
        setup: "konteClose",
        duration: 2,
        lineup: ["konte"],
        script: [
          {
            character: "konte",
            text: "No... her eyes are kinder.",
            acting: "小さく、自分にだけ聞こえる声で。",
          },
        ],
      },
      {
        id: "n07",
        kind: "graphic",
        role: "pressure",
        action:
          "動画生成サイトのダウンロード一覧に、shot03_whale_v2、shot04_v3_fix、shot12_final_REALと、いくつものショットの作り直したクリップのファイルが積み上がり、件数が246件まで増えていく。",
        duration: 2,
      },
      {
        id: "07a",
        role: "pressure",
        action: "すっかり夜になった雨の窓を、雨粒が伝い落ちる。",
        setup: "windowInsert",
        duration: 1,
        lineup: [],
      },
      {
        id: "n08",
        role: "pressure",
        action: "夜の机で、konteちゃんがノートパソコンの前で頬杖をつき、肩を落としてため息をつく。",
        setup: "deskMedium",
        duration: 3,
        lineup: ["konte"],
        script: [
          {
            character: "konte",
            text: "Why is a whole movie so hard...?",
            acting: "途方に暮れて、ため息まじりに。",
          },
        ],
      },
      {
        id: "n09",
        kind: "graphic",
        role: "hero",
        action:
          "ブラウザで開いた掲示板の「単発のクリップは簡単なのに、何ショットもある映画はなぜこんなに大変？」という質問のスレッドに、konteでClaude Codeに制作を任せたら楽だったという体験談のコメントがついていて、カーソルがその一節をなぞって選択していく。",
        duration: 2.5,
        script: [
          {
            character: "konte",
            text: "I just... leave notes?",
            acting: "コメントを目で追いながら、信じきれずに小さく読み上げる。",
          },
        ],
      },
      {
        id: "n10",
        role: "hero",
        action: "画面を見つめるkonteちゃんが、半信半疑で小さく首をかしげる。",
        setup: "konteClose",
        duration: 2,
        lineup: ["konte"],
        script: [
          {
            character: "konte",
            text: "...Worth a try?",
            acting: "期待しすぎないように、半信半疑でつぶやく。",
          },
        ],
      },
      {
        id: "16",
        kind: "graphic",
        role: "hero",
        action:
          "再現したClaude Codeのターミナルに、スキャンした漫画原稿のページの画像が添えられ、「この漫画原稿を、80ショットの短編映画にしたい」という一文が打ち込まれる。",
        duration: 4,
        cutin: { setup: "konteClose", lineup: ["konte"] },
        script: [
          {
            character: "konte",
            text: "I want to make this... into a real film.",
            acting: "打ち込みながら読み上げる、少し照れた本気の声で。",
          },
        ],
      },
      {
        id: "17",
        kind: "graphic",
        role: "hero",
        action:
          "ターミナルでエージェントが漫画原稿を読み、direction.tsにショットが一行書き足されるたびに、そのもとになった原稿のコマが横に一枚ずつ並んでいく。",
        duration: 4,
      },
      {
        id: "18",
        kind: "graphic",
        role: "hero",
        action:
          "ターミナルに「生成はどこで回しますか？ ローカルのGPUか、Comfy APIか」という質問が表示される。",
        duration: 3,
      },
      {
        id: "19",
        role: "hero",
        action: "konteちゃんが、小さなノートパソコンのふたに手をそえて、困り顔で見つめる。",
        setup: "deskMedium",
        duration: 3,
        lineup: ["konte"],
        script: [
          {
            character: "konte",
            text: "A GPU? ...In this?",
            acting: "おそるおそる、ちょっと泣きそうに。",
          },
        ],
      },
      {
        id: "20",
        kind: "graphic",
        role: "hero",
        action:
          "ターミナルでエージェントが「GPUがなくても大丈夫、Comfy APIを使いましょう！」と答え、Comfy Developer PlatformでAPIキーを作る手順を示す。",
        duration: 3.5,
      },
      {
        id: "21",
        kind: "graphic",
        role: "hero",
        action: "Comfy Developer Platformの画面で、伏せ字のAPIキーが発行される。",
        duration: 2,
      },
      {
        id: "22",
        kind: "graphic",
        role: "hero",
        action: "konteの設定画面に、伏せ字のAPIキーが貼り付けられる。",
        duration: 1.5,
      },
      {
        id: "23",
        kind: "graphic",
        role: "hero",
        action: "ターミナルに、Comfy APIへ送られた生成ジョブの行が次々と流れ始める。",
        duration: 4.5,
      },
      {
        id: "24",
        role: "hero",
        action: "画面の光を浴びたkonteちゃんの顔が、ぱっと明るくなる。",
        setup: "konteClose",
        duration: 2,
        lineup: ["konte"],
        script: [{ character: "konte", text: "Whoa...!", acting: "思わず漏れた、弾む声で。" }],
      },
      {
        id: "25",
        kind: "graphic",
        role: "hero",
        action:
          "ターミナルでエージェントが生成できた素材を一つずつ確認し、最後にレビュー画面を開く。",
        duration: 3,
      },
      {
        id: "26",
        kind: "graphic",
        role: "hero",
        action: "referenceのレビュー画面で、紙のクジラにAcceptが押される。",
        duration: 3.5,
        cutin: { setup: "konteClose", lineup: ["konte"] },
        script: [{ character: "konte", text: "That one!", acting: "迷わず、指さすように。" }],
      },
      {
        id: "26a",
        kind: "graphic",
        role: "hero",
        action:
          "ターミナルでエージェントが80ショットの絵コンテを生成して確認し、最後にレビュー画面を開く。",
        duration: 2,
      },
      {
        id: "26b",
        kind: "graphic",
        role: "hero",
        action: "animaticのレビュー画面で、80ショットの絵コンテが尺どおりに通して再生される。",
        duration: 2,
      },
      {
        id: "26c",
        role: "hero",
        action:
          "ノートパソコンの横で、konteちゃんが漫画原稿の束の一番上のページを手に取り、紙のクジラのコマのやさしい目を見つめる。",
        setup: "deskInsertNight",
        duration: 1,
        lineup: ["konte"],
      },
      {
        id: "27",
        kind: "graphic",
        role: "hero",
        action:
          "animaticのレビュー画面で、紙のクジラの目にピンが立ち、「Her eyes should be kinder.」というコメントが書き込まれる。",
        duration: 4,
        script: [
          {
            character: "konte",
            text: "Her eyes should be kinder.",
            acting: "打ち込みながら、真剣に一語ずつ。",
          },
        ],
      },
      {
        id: "27a",
        kind: "graphic",
        role: "hero",
        action:
          "ターミナルでエージェントが「Her eyes should be kinder.」のコメントを読み、紙のクジラのパネルを描き直す生成ジョブを送る。",
        duration: 3.5,
      },
      {
        id: "28",
        kind: "graphic",
        role: "hero",
        action:
          "animaticのレビュー画面で、前回のコメントが消え、紙のクジラのパネルが目のやさしい新しい絵に変わり、前のテイクを残したまま、新しいテイクが届いている。",
        duration: 2.5,
      },
      {
        id: "29",
        role: "hero",
        action: "konteちゃんが両手を頬に当てて、とろけるように笑う。",
        setup: "konteClose",
        duration: 2.5,
        lineup: ["konte"],
        script: [{ character: "konte", text: "Yes. That's her.", acting: "うっとりと、小さく。" }],
      },
      {
        id: "30",
        kind: "graphic",
        role: "hero",
        action:
          "animatic のレビュー画面から video のレビュー画面へ移り、Acceptedの数が21/80から72/80へ増えて最後のショットにたどり着き、そのテイクでは紙のクジラが画面の隅に小さく収まっている。",
        duration: 4,
      },
      {
        id: "35",
        role: "hero",
        action: "konteちゃんが、両手を思いきり左右に広げてみせる。",
        setup: "deskMedium",
        duration: 3,
        lineup: ["konte"],
        script: [
          {
            character: "konte",
            text: "Bigger! She should fill the sky!",
            acting: "目を輝かせて、身ぶりごと伝えるように。",
          },
        ],
      },
      {
        id: "35b",
        kind: "graphic",
        role: "hero",
        action:
          "ターミナルでエージェントが最後のショットの構図へのコメントを読み、ほかの79ショットを採用済みのまま、最後のショットだけの描き直しの生成ジョブを送る。",
        duration: 3,
      },
      {
        id: "35a",
        kind: "graphic",
        role: "hero",
        action:
          "描き直された最後のショットのテイクが再生され、紙のクジラが雨の街の空いっぱいに大きく泳いでいる。",
        duration: 2,
      },
      {
        id: "32",
        role: "hero",
        action: "日曜の明け方、雨の窓の外が白みはじめる。",
        setup: "windowInsert",
        duration: 1.5,
        lineup: [],
        telop: ["Deadline Day"],
      },
      {
        id: "33",
        role: "hero",
        action:
          "机の左寄りに置いたノートパソコンに身を乗り出したkonteちゃんが、真剣な顔でAcceptをクリックする。",
        setup: "deskMedium",
        duration: 2.5,
        lineup: ["konte"],
      },
      {
        id: "36",
        kind: "graphic",
        role: "hero",
        action: "最後のショットにAcceptが押され、Acceptedが79/80から80/80になる。",
        duration: 2.5,
      },
      {
        id: "37",
        kind: "graphic",
        role: "hero",
        action: "ターミナルで書き出しを待ち、しばらくして完成した動画ファイルの名前が表示される。",
        duration: 3.5,
      },
      {
        id: "37a",
        role: "release",
        action: "映画祭の当日、旗飾りの渡された校舎前の広場を、たくさんの生徒たちが行き交う。",
        setup: "campusWide",
        duration: 2.5,
        lineup: [],
        telop: ["Screening Day"],
      },
      {
        id: "38",
        role: "release",
        action:
          "暗い上映会場で、生徒たちの影の向こうのスクリーンを、紙のクジラが雨の街の上へ泳いでいく。",
        setup: "hallWide",
        duration: 3.5,
        lineup: [],
      },
      {
        id: "39",
        role: "release",
        action:
          "漫画原稿のあのコマと同じ構図で、スクリーンいっぱいの紙のクジラが、やさしい目をこちらへ向ける。",
        setup: "screenInsert",
        duration: 3,
        lineup: [],
      },
      {
        id: "41",
        role: "release",
        action:
          "客席の暗がりで、漫画原稿の束を胸元に抱えたkonteちゃんが、スクリーンの光を浴びて顔いっぱいに嬉しそうに笑う。",
        setup: "seatClose",
        duration: 4,
        lineup: ["konte"],
      },
    ],
  },
});
