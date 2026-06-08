"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Dice5,
  Gamepad2,
  Home,
  Languages,
  LogOut,
  Map as MapIcon,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import {
  chatScenarios,
  expressionPatterns,
  groupGames,
  kanaReference,
  levelRoadmap,
  liarTopics,
  skillNodes,
  soloGames,
  talkTopics,
  wordDeck,
} from "./learningData";

const tabs = [
  { id: "home", label: "홈", icon: Home },
  { id: "roadmap", label: "로드맵", icon: MapIcon },
  { id: "learn", label: "학습", icon: BookOpen },
  { id: "test", label: "테스트", icon: Brain },
  { id: "talk", label: "대화", icon: MessageCircle },
  { id: "vocab", label: "단어장", icon: Languages },
  { id: "games", label: "게임", icon: Gamepad2 },
];

const relayQuestions = [
  { jp: "すきな たべものは なんですか。", kr: "좋아하는 음식은 무엇인가요?", helper: "すきな たべものは ___ です." },
  { jp: "しゅうまつに なにを しますか。", kr: "주말에 무엇을 하나요?", helper: "しゅうまつに ___ を します." },
  { jp: "どこに いきたいですか。", kr: "어디에 가고 싶나요?", helper: "___ に いきたいです." },
  { jp: "まいにち なにを のみますか。", kr: "매일 무엇을 마시나요?", helper: "まいにち ___ を のみます." },
  { jp: "にほんごは どうですか。", kr: "일본어는 어떤가요?", helper: "にほんごは ___ です." },
  { jp: "だれと あいますか。", kr: "누구와 만나나요?", helper: "___ と あいます." },
  { jp: "いま なにを していますか。", kr: "지금 무엇을 하고 있나요?", helper: "いま ___ ています." },
  { jp: "おすすめは なんですか。", kr: "추천은 무엇인가요?", helper: "___ が おすすめです." },
];

const roleplayCards = [
  { place: "카페", roles: ["점원", "손님"], mission: "음료를 주문하고 가격을 묻습니다.", expressions: ["___ を ください。", "___ は いくらですか。", "ありがとうございます。"] },
  { place: "역", roles: ["역무원", "여행자"], mission: "목적지를 말하고 표를 요청합니다.", expressions: ["___ に いきます。", "きっぷ を ください。", "___ は どこですか。"] },
  { place: "교실", roles: ["선생님", "학생"], mission: "모르는 표현을 묻고 다시 말해 달라고 합니다.", expressions: ["___ が わかりません。", "もういちど いってください。", "おしえてください。"] },
  { place: "편의점", roles: ["직원", "손님"], mission: "사고 싶은 물건을 말하고 추천을 받습니다.", expressions: ["___ が ほしいです。", "___ を ください。", "おすすめは なんですか。"] },
  { place: "첫 만남", roles: ["A", "B"], mission: "이름, 출신, 좋아하는 것을 말합니다.", expressions: ["はじめまして。", "わたしは ___ です。", "___ が すきです。"] },
];

const forbiddenCards = [
  { word: "カフェ", meaning: "카페", forbidden: ["커피", "마시다", "가게"], starter: "ここで ___ を のみます." },
  { word: "えき", meaning: "역", forbidden: ["기차", "지하철", "가다"], starter: "ここから ___ に いきます." },
  { word: "スマホ", meaning: "스마트폰", forbidden: ["전화", "앱", "사진"], starter: "まいにち つかいます." },
  { word: "ともだち", meaning: "친구", forbidden: ["사람", "만나다", "같이"], starter: "しゅうまつに ___ と あいます." },
  { word: "ラーメン", meaning: "라멘", forbidden: ["면", "국물", "먹다"], starter: "これは とても おいしいです." },
  { word: "としょかん", meaning: "도서관", forbidden: ["책", "읽다", "조용"], starter: "ここで べんきょうします." },
];

const reactionCards = [
  { line: "きょうは とても たのしいです。", meaning: "오늘은 정말 즐거워요.", reactions: ["いいですね。", "わたしもです。", "ほんとうですか。"] },
  { line: "この ケーキは おいしいです。", meaning: "이 케이크는 맛있어요.", reactions: ["そうですね。", "わたしも たべたいです。", "おすすめですか。"] },
  { line: "にほんごは むずかしいです。", meaning: "일본어는 어려워요.", reactions: ["でも、たのしいです。", "だいじょうぶです。", "いっしょに べんきょうしましょう。"] },
  { line: "あした カフェに いきます。", meaning: "내일 카페에 가요.", reactions: ["いいですね。", "だれと いきますか。", "おすすめは なんですか。"] },
  { line: "すみません、いみが わかりません。", meaning: "죄송해요, 의미를 모르겠어요.", reactions: ["もういちど いいます。", "だいじょうぶです。", "ゆっくり はなします。"] },
];

const kanaRomaji = {
  あ: "a", い: "i", う: "u", え: "e", お: "o", か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
  さ: "sa", し: "shi", す: "su", せ: "se", そ: "so", た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
  な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no", は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
  ま: "ma", み: "mi", む: "mu", め: "me", も: "mo", や: "ya", ゆ: "yu", よ: "yo",
  ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro", わ: "wa", を: "o", ん: "n",
  が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go", ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo",
  だ: "da", ぢ: "ji", づ: "zu", で: "de", ど: "do", ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo",
  ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po",
  ア: "a", イ: "i", ウ: "u", エ: "e", オ: "o", カ: "ka", キ: "ki", ク: "ku", ケ: "ke", コ: "ko",
  サ: "sa", シ: "shi", ス: "su", セ: "se", ソ: "so", タ: "ta", チ: "chi", ツ: "tsu", テ: "te", ト: "to",
  ナ: "na", ニ: "ni", ヌ: "nu", ネ: "ne", ノ: "no", ハ: "ha", ヒ: "hi", フ: "fu", ヘ: "he", ホ: "ho",
  マ: "ma", ミ: "mi", ム: "mu", メ: "me", モ: "mo", ヤ: "ya", ユ: "yu", ヨ: "yo",
  ラ: "ra", リ: "ri", ル: "ru", レ: "re", ロ: "ro", ワ: "wa", ヲ: "o", ン: "n",
  ガ: "ga", ギ: "gi", グ: "gu", ゲ: "ge", ゴ: "go", ザ: "za", ジ: "ji", ズ: "zu", ゼ: "ze", ゾ: "zo",
  ダ: "da", ヂ: "ji", ヅ: "zu", デ: "de", ド: "do", バ: "ba", ビ: "bi", ブ: "bu", ベ: "be", ボ: "bo",
  パ: "pa", ピ: "pi", プ: "pu", ペ: "pe", ポ: "po",
};

const yoonRomaji = {
  きゃ: "kya", きゅ: "kyu", きょ: "kyo", しゃ: "sha", しゅ: "shu", しょ: "sho", ちゃ: "cha", ちゅ: "chu", ちょ: "cho",
  にゃ: "nya", にゅ: "nyu", にょ: "nyo", ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo", みゃ: "mya", みゅ: "myu", みょ: "myo",
  りゃ: "rya", りゅ: "ryu", りょ: "ryo", ぎゃ: "gya", ぎゅ: "gyu", ぎょ: "gyo", じゃ: "ja", じゅ: "ju", じょ: "jo",
  びゃ: "bya", びゅ: "byu", びょ: "byo", ぴゃ: "pya", ぴゅ: "pyu", ぴょ: "pyo",
  キャ: "kya", キュ: "kyu", キョ: "kyo", シャ: "sha", シュ: "shu", ショ: "sho", チャ: "cha", チュ: "chu", チョ: "cho",
  ニャ: "nya", ニュ: "nyu", ニョ: "nyo", ヒャ: "hya", ヒュ: "hyu", ヒョ: "hyo", ミャ: "mya", ミュ: "myu", ミョ: "myo",
  リャ: "rya", リュ: "ryu", リョ: "ryo", ギャ: "gya", ギュ: "gyu", ギョ: "gyo", ジャ: "ja", ジュ: "ju", ジョ: "jo",
  ビャ: "bya", ビュ: "byu", ビョ: "byo", ピャ: "pya", ピュ: "pyu", ピョ: "pyo",
};

const kanaChartLayouts = {
  "hiragana-basic": {
    columns: 5,
    rows: [
      ["あ", "い", "う", "え", "お"],
      ["か", "き", "く", "け", "こ"],
      ["さ", "し", "す", "せ", "そ"],
      ["た", "ち", "つ", "て", "と"],
      ["な", "に", "ぬ", "ね", "の"],
      ["は", "ひ", "ふ", "へ", "ほ"],
      ["ま", "み", "む", "め", "も"],
      ["や", null, "ゆ", null, "よ"],
      ["ら", "り", "る", "れ", "ろ"],
      ["わ", null, null, null, "を"],
      ["ん", null, null, null, null],
    ],
  },
  "katakana-basic": {
    columns: 5,
    rows: [
      ["ア", "イ", "ウ", "エ", "オ"],
      ["カ", "キ", "ク", "ケ", "コ"],
      ["サ", "シ", "ス", "セ", "ソ"],
      ["タ", "チ", "ツ", "テ", "ト"],
      ["ナ", "ニ", "ヌ", "ネ", "ノ"],
      ["ハ", "ヒ", "フ", "ヘ", "ホ"],
      ["マ", "ミ", "ム", "メ", "モ"],
      ["ヤ", null, "ユ", null, "ヨ"],
      ["ラ", "リ", "ル", "レ", "ロ"],
      ["ワ", null, null, null, "ヲ"],
      ["ン", null, null, null, null],
    ],
  },
};

const kanaColumnCounts = {
  "hiragana-dakuon": 5,
  "katakana-dakuon": 5,
  youon: 3,
  "sokuon-chouon": 2,
};

function buildKanaDisplay(set) {
  const layout = kanaChartLayouts[set.id];

  if (layout) {
    const itemByKana = new Map(set.items.map((item) => [item[0], item]));
    return {
      columns: layout.columns,
      cells: layout.rows.flatMap((row) => row.map((kana) => (kana ? itemByKana.get(kana) : null))),
    };
  }

  return {
    columns: kanaColumnCounts[set.id] || 5,
    cells: set.items,
  };
}

function buildKanaQuiz(set, items, index) {
  const quizItems = items.length > 0 ? items : set.items;
  const correct = quizItems[index % quizItems.length];
  const distractors = sampleItems(set.items.filter((item) => item[0] !== correct[0]), 3);

  return {
    correct,
    choices: shuffleItems([correct, ...distractors]),
  };
}

function shuffleItems(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function sampleItems(items, count) {
  return shuffleItems(items).slice(0, Math.min(count, items.length));
}

function buildStudySession(node) {
  return {
    studies: sampleItems(node.studyPool, 4),
    examples: sampleItems(node.examplePool, 3),
    vocab: sampleItems(node.vocabPool, 5),
    notes: sampleItems(node.notePool || [], 3),
  };
}

function buildQuizSession(node) {
  return sampleItems(node.quizPool, 4).map((item) => ({
    ...item,
    choices: shuffleItems(item.choices),
  }));
}

function romanizeJapanese(text) {
  let output = "";
  let doubleNext = false;

  for (let index = 0; index < text.length; index += 1) {
    const pair = text.slice(index, index + 2);
    const char = text[index];

    if (char === "っ" || char === "ッ") {
      doubleNext = true;
      continue;
    }

    let reading = yoonRomaji[pair];
    if (reading) {
      index += 1;
    } else {
      const nextChar = text[index + 1] || "";
      if (char === "は" && /\s|。|、|？|！/.test(nextChar)) {
        reading = "wa";
      } else if (char === "へ" && /\s|。|、|？|！/.test(nextChar)) {
        reading = "e";
      } else {
        reading = kanaRomaji[char];
      }
    }

    if (reading) {
      if (doubleNext && /^[bcdfghjklmnpqrstvwxyz]/.test(reading)) {
        output += reading[0];
      }
      output += reading;
      doubleNext = false;
      continue;
    }

    if (char === "ー") {
      output += "-";
    } else if (char === "。") {
      output += ".";
    } else if (char === "、") {
      output += ",";
    } else if (char === "？") {
      output += "?";
    } else if (char === "！") {
      output += "!";
    } else if (/[A-Za-z0-9\s.,!?/＋+\-___]/.test(char)) {
      output += char;
    }
  }

  return output.replace(/\s+/g, " ").trim();
}

function parseJapaneseLine(text) {
  const trimmed = text.trim();
  const hangulIndex = trimmed.search(/[가-힣]/);
  const hasKana = /[ぁ-んァ-ヶー]/.test(trimmed);

  if (!hasKana) {
    return { main: trimmed, romaji: "", meaning: "" };
  }

  if (hangulIndex > 0) {
    const main = trimmed.slice(0, hangulIndex).trim();
    return {
      main,
      romaji: romanizeJapanese(main),
      meaning: trimmed.slice(hangulIndex).trim(),
    };
  }

  if (hangulIndex === -1) {
    return {
      main: trimmed,
      romaji: romanizeJapanese(trimmed),
      meaning: "",
    };
  }

  return { main: trimmed, romaji: "", meaning: "" };
}

function JapaneseText({ text, className = "jpLine" }) {
  const parsed = parseJapaneseLine(text);

  if (!parsed.romaji) {
    return <span className={className}>{parsed.main}</span>;
  }

  return (
    <span className={className}>
      <span>{parsed.main}</span>
      <span className="romajiText">{parsed.romaji}</span>
      {parsed.meaning && <small>{parsed.meaning}</small>}
    </span>
  );
}

function GameGuide({ steps }) {
  if (!steps?.length) {
    return null;
  }

  return (
    <div className="gameGuide">
      <span>플레이 방법</span>
      <ol>
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  );
}

function scoreQuiz(answers, quiz) {
  return quiz.reduce((score, item, index) => score + (answers[index] === item.answer ? 1 : 0), 0);
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash >>> 0);
}

function defaultProgress() {
  return {
    currentNodeId: skillNodes[0].id,
    unlockedNodeIds: [skillNodes[0].id],
    passedNodeIds: [],
    scores: {},
  };
}

export default function HomePage() {
  const [profile, setProfile] = useState(null);
  const [accessKey, setAccessKey] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showRomaji, setShowRomaji] = useState(true);

  const [activeTab, setActiveTab] = useState("home");
  const [progress, setProgress] = useState(defaultProgress);
  const [selectedNodeId, setSelectedNodeId] = useState(skillNodes[0].id);
  const [sessionSeed, setSessionSeed] = useState(1);
  const [answers, setAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);

  const [topicIndex, setTopicIndex] = useState(0);
  const [talkMode, setTalkMode] = useState("topic");
  const [chatIndex, setChatIndex] = useState(0);
  const [chatStep, setChatStep] = useState(0);
  const [chatTokens, setChatTokens] = useState([]);
  const [chatFeedback, setChatFeedback] = useState(null);
  const [chatChoiceSeed, setChatChoiceSeed] = useState(1);
  const [gameSection, setGameSection] = useState("solo");
  const [soloGameIndex, setSoloGameIndex] = useState(0);
  const [groupGameIndex, setGroupGameIndex] = useState(0);
  const [groupRound, setGroupRound] = useState(0);
  const [groupPlayer, setGroupPlayer] = useState(1);
  const [bingoChecked, setBingoChecked] = useState([]);
  const [reactionChoice, setReactionChoice] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [wordAnswer, setWordAnswer] = useState("");
  const [liarSeed, setLiarSeed] = useState("NIHONGO");
  const [liarTotal, setLiarTotal] = useState(4);
  const [liarPlayer, setLiarPlayer] = useState(1);
  const [liarTopicId, setLiarTopicId] = useState(liarTopics[0].id);
  const [vocabMode, setVocabMode] = useState("kana");
  const [kanaSetId, setKanaSetId] = useState(kanaReference[0].id);
  const [kanaViewMode, setKanaViewMode] = useState("study");
  const [kanaQuizIndex, setKanaQuizIndex] = useState(0);
  const [kanaQuizSeed, setKanaQuizSeed] = useState(1);
  const [kanaQuizAnswer, setKanaQuizAnswer] = useState("");
  const [wordCategory, setWordCategory] = useState("all");
  const [expressionCategory, setExpressionCategory] = useState("all");

  const selectedNode = skillNodes.find((item) => item.id === selectedNodeId) || skillNodes[0];
  const selectedIndex = skillNodes.findIndex((item) => item.id === selectedNode.id);
  const nextNode = skillNodes[selectedIndex + 1];
  const passedCount = progress.passedNodeIds.length;
  const completionRate = Math.round((passedCount / skillNodes.length) * 100);
  const unlockedLevel = Math.max(...skillNodes.filter((node) => progress.unlockedNodeIds.includes(node.id)).map((node) => node.level), 0);
  const availableWords = wordDeck.filter((word) => word.minLevel <= unlockedLevel);
  const currentWord = availableWords[wordIndex % availableWords.length] || wordDeck[0];
  const currentSoloGame = soloGames[soloGameIndex] || soloGames[0];
  const playableGroupGames = groupGames.filter((game) => game.id !== "liar");
  const currentGroupGame = playableGroupGames[groupGameIndex] || playableGroupGames[0];
  const bingoItems = useMemo(() => sampleItems(expressionPatterns, 9), [groupRound]);
  const bingoLines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const bingoCount = bingoLines.filter((line) => line.every((index) => bingoChecked.includes(index))).length;
  const relayQuestion = relayQuestions[groupRound % relayQuestions.length];
  const roleplayCard = roleplayCards[groupRound % roleplayCards.length];
  const forbiddenCard = forbiddenCards[groupRound % forbiddenCards.length];
  const reactionCard = reactionCards[groupRound % reactionCards.length];
  const currentKanaSet = kanaReference.find((set) => set.id === kanaSetId) || kanaReference[0];
  const currentKanaDisplay = useMemo(() => buildKanaDisplay(currentKanaSet), [currentKanaSet]);
  const kanaQuizItems = useMemo(() => shuffleItems(currentKanaSet.items), [currentKanaSet, kanaQuizSeed]);
  const kanaQuiz = useMemo(() => buildKanaQuiz(currentKanaSet, kanaQuizItems, kanaQuizIndex), [currentKanaSet, kanaQuizItems, kanaQuizIndex]);
  const kanaQuizPassed = kanaQuizAnswer === kanaQuiz.correct[0];
  const wordCategories = useMemo(() => ["all", ...Array.from(new Set(wordDeck.map((word) => word.category)))], []);
  const visibleVocabWords = useMemo(
    () => (wordCategory === "all" ? wordDeck : wordDeck.filter((word) => word.category === wordCategory)),
    [wordCategory]
  );
  const expressionCategories = useMemo(() => ["all", ...Array.from(new Set(expressionPatterns.map((item) => item.category)))], []);
  const visibleExpressions = useMemo(
    () => (expressionCategory === "all" ? expressionPatterns : expressionPatterns.filter((item) => item.category === expressionCategory)),
    [expressionCategory]
  );
  const vocabCount = vocabMode === "kana" ? currentKanaSet.items.length : vocabMode === "words" ? visibleVocabWords.length : visibleExpressions.length;
  const wordChoices = useMemo(() => {
    const distractors = sampleItems(availableWords.filter((word) => word.kr !== currentWord.kr), 3).map((word) => word.kr);
    return shuffleItems([currentWord.kr, ...distractors]);
  }, [availableWords, currentWord]);
  const studySession = useMemo(() => buildStudySession(selectedNode), [selectedNode, sessionSeed]);
  const quizSession = useMemo(() => buildQuizSession(selectedNode), [selectedNode, sessionSeed]);
  const currentTopic = talkTopics[topicIndex % talkTopics.length];
  const currentChat = chatScenarios[chatIndex % chatScenarios.length];
  const currentChatTurn = currentChat.turns[chatStep % currentChat.turns.length];
  const chatChoices = useMemo(
    () => shuffleItems([...currentChatTurn.target, ...currentChatTurn.distractors]),
    [currentChatTurn, chatChoiceSeed]
  );
  const liarTopic = liarTopics.find((topic) => topic.id === liarTopicId) || liarTopics[0];
  const liarNumber = (hashString(`${liarSeed}:${liarTopicId}:${liarTotal}`) % liarTotal) + 1;
  const liarWord = liarTopic.words[hashString(`${liarSeed}:${liarTopicId}:word`) % liarTopic.words.length];
  const isLiar = Number(liarPlayer) === liarNumber;

  useEffect(() => {
    const saved = window.localStorage.getItem("nihongo-session-v2");
    if (!saved) {
      setLoadingProfile(false);
      return;
    }

    const parsed = JSON.parse(saved);
    setProfile(parsed.profile);
    setAccessKey(parsed.accessKey);
    loadProgress(parsed.profile.id, parsed.accessKey).finally(() => setLoadingProfile(false));
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("nihongo-show-romaji");
    if (saved !== null) {
      setShowRomaji(saved === "true");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("nihongo-show-romaji", String(showRomaji));
  }, [showRomaji]);

  async function readApiResponse(response, fallbackMessage) {
    const text = await response.text();
    let data = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`${fallbackMessage} 서버가 JSON 대신 오류 페이지를 반환했습니다. 잠시 후 다시 시도해주세요.`);
      }
    }

    if (!response.ok) {
      throw new Error(data.error || fallbackMessage);
    }

    return data;
  }

  async function api(path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(profile?.id ? { "x-profile-id": profile.id, "x-access-key": accessKey } : {}),
      ...(options.headers || {}),
    };
    const response = await fetch(path, { ...options, headers });
    return readApiResponse(response, "요청에 실패했습니다.");
  }

  async function loadProgress(profileId, key) {
    const response = await fetch("/api/progress", {
      headers: { "x-profile-id": profileId, "x-access-key": key },
    });
    if (!response.ok) return;
    const data = await readApiResponse(response, "진행률을 불러오지 못했습니다.");
    setProgress(data.progress);
    setSelectedNodeId(data.progress.currentNodeId);
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoginError("");
    try {
      const data = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: loginName, pin: loginPin }),
      }).then((response) => readApiResponse(response, "로그인에 실패했습니다."));

      setProfile(data.profile);
      setAccessKey(data.accessKey);
      window.localStorage.setItem("nihongo-session-v2", JSON.stringify(data));
      await loadProgress(data.profile.id, data.accessKey);
    } catch (error) {
      setLoginError(error.message);
    }
  }

  function logout() {
    window.localStorage.removeItem("nihongo-session-v2");
    setProfile(null);
    setAccessKey("");
    setProgress(defaultProgress());
    setSelectedNodeId(skillNodes[0].id);
  }

  async function saveProgress(nextProgress) {
    setProgress(nextProgress);
    await api("/api/progress", {
      method: "POST",
      body: JSON.stringify(nextProgress),
    });
  }

  function selectNode(node) {
    setSelectedNodeId(node.id);
    setAnswers({});
    setTestResult(null);
    setSessionSeed((value) => value + 1);
    setActiveTab("learn");
  }

  async function submitTest() {
    const score = scoreQuiz(answers, quizSession);
    const passed = score >= selectedNode.passScore;
    const unlockedNodeIds = new Set(progress.unlockedNodeIds);
    const passedNodeIds = new Set(progress.passedNodeIds);
    if (passed) {
      passedNodeIds.add(selectedNode.id);
      if (nextNode) unlockedNodeIds.add(nextNode.id);
    }

    const nextProgress = {
      currentNodeId: passed && nextNode ? nextNode.id : selectedNode.id,
      unlockedNodeIds: [...unlockedNodeIds],
      passedNodeIds: [...passedNodeIds],
      scores: {
        ...progress.scores,
        [selectedNode.id]: Math.max(progress.scores[selectedNode.id] || 0, score),
      },
    };

    setTestResult({ score, total: quizSession.length, passed });
    await api("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ nodeId: selectedNode.id, score, total: quizSession.length, passed }),
    });
    await saveProgress(nextProgress);
  }

  function resetTest() {
    setAnswers({});
    setTestResult(null);
    setSessionSeed((value) => value + 1);
  }

  function startGeneratedSeed() {
    setLiarSeed(Math.random().toString(36).slice(2, 8).toUpperCase());
  }

  function selectGroupGame(index) {
    setGroupGameIndex(index);
    setGroupRound(0);
    setGroupPlayer(1);
    setBingoChecked([]);
    setReactionChoice("");
  }

  function nextGroupRound() {
    setGroupRound((value) => value + 1);
    setGroupPlayer((value) => (value >= 6 ? 1 : value + 1));
    setBingoChecked([]);
    setReactionChoice("");
  }

  function toggleBingoCell(index) {
    setBingoChecked((items) => (items.includes(index) ? items.filter((item) => item !== index) : [...items, index]));
  }

  function selectKanaSet(id) {
    setKanaSetId(id);
    setKanaQuizIndex(0);
    setKanaQuizSeed((value) => value + 1);
    setKanaQuizAnswer("");
  }

  function nextKanaQuiz() {
    if (kanaQuizIndex + 1 >= currentKanaSet.items.length) {
      setKanaQuizIndex(0);
      setKanaQuizSeed((value) => value + 1);
    } else {
      setKanaQuizIndex((value) => value + 1);
    }
    setKanaQuizAnswer("");
  }

  function resetChatTurn() {
    setChatTokens([]);
    setChatFeedback(null);
    setChatChoiceSeed((value) => value + 1);
  }

  function checkChatAnswer() {
    const isCorrect = chatTokens.join(" ") === currentChatTurn.target.join(" ");
    setChatFeedback({
      correct: isCorrect,
      message: isCorrect ? "좋아요. 문맥에 맞는 답장입니다." : `정답: ${currentChatTurn.target.join(" ")}`,
    });
  }

  function nextChatTurn() {
    if (chatStep + 1 < currentChat.turns.length) {
      setChatStep((value) => value + 1);
    } else {
      setChatIndex((value) => (value + 1) % chatScenarios.length);
      setChatStep(0);
    }
    resetChatTurn();
  }

  if (loadingProfile) {
    return <main className="mobileShell"><div className="loadingCard">학습 기록을 확인하고 있습니다.</div></main>;
  }

  if (!profile) {
    return (
      <main className="loginShell">
        <section className="loginHero">
          <Image src="/japanese-study-banner.png" alt="일본어 학습 카드" fill priority sizes="(max-width: 760px) 100vw, 760px" />
          <div />
        </section>
        <form className="loginCard" onSubmit={handleLogin}>
          <p className="eyebrow">Nihongo First Steps</p>
          <h1>이름과 PIN으로 학습을 이어가세요</h1>
          <label>
            이름
            <input value={loginName} onChange={(event) => setLoginName(event.target.value)} placeholder="예: MATAGI" maxLength={20} />
          </label>
          <label>
            4자리 PIN
            <input value={loginPin} onChange={(event) => setLoginPin(event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="0000" inputMode="numeric" />
          </label>
          {loginError && <p className="errorText">{loginError}</p>}
          <button className="primaryButton" type="submit">
            <ShieldCheck size={18} />
            시작하기
          </button>
          <p className="helperText">같은 이름과 PIN을 입력하면 다른 기기에서도 진행률을 이어서 볼 수 있습니다.</p>
        </form>
      </main>
    );
  }

  return (
    <main className={showRomaji ? "mobileShell" : "mobileShell romajiOff"}>
      <header className="appHeader">
        <div>
          <p className="eyebrow">Level {selectedNode.level}</p>
          <h1>{selectedNode.title}</h1>
        </div>
        <div className="headerActions">
          <button className={showRomaji ? "romajiToggle on" : "romajiToggle"} type="button" onClick={() => setShowRomaji((value) => !value)} aria-pressed={showRomaji}>
            <span>영어발음</span>
            <strong>{showRomaji ? "ON" : "OFF"}</strong>
          </button>
          <button className="iconButton" type="button" onClick={logout} aria-label="로그아웃">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {activeTab === "home" && (
        <section className="screenStack">
          <section className="welcomeCard">
            <Image src="/japanese-study-banner.png" alt="일본어 학습 책상" fill priority sizes="(max-width: 760px) 100vw, 720px" />
            <div className="welcomeShade" />
            <div className="welcomeText">
              <span>{profile.name}님의 오늘 학습</span>
              <h2>Level {selectedNode.level} · {selectedNode.title}</h2>
              <button className="lightButton" type="button" onClick={() => setActiveTab("learn")}>
                이어서 학습
                <ChevronRight size={18} />
              </button>
            </div>
          </section>

          <section className="statGrid">
            <article>
              <Trophy size={18} />
              <strong>{completionRate}%</strong>
              <span>전체 진도</span>
            </article>
            <article>
              <Check size={18} />
              <strong>{passedCount}</strong>
              <span>완료 노드</span>
            </article>
            <article>
              <Sparkles size={18} />
              <strong>{skillNodes.length}</strong>
              <span>전체 노드</span>
            </article>
          </section>

          <section className="sectionCard">
            <div className="sectionHeader">
              <h2>Level0 로드맵</h2>
              <button type="button" onClick={() => setActiveTab("roadmap")}>전체 보기</button>
            </div>
            <div className="miniPath">
              {skillNodes.slice(0, 6).map((node) => (
                <button key={node.id} className={progress.passedNodeIds.includes(node.id) ? "pathDot done" : "pathDot open"} onClick={() => selectNode(node)} type="button">
                  {progress.passedNodeIds.includes(node.id) ? <Check size={16} /> : node.level}
                </button>
              ))}
            </div>
          </section>
        </section>
      )}

      {activeTab === "roadmap" && (
        <section className="screenStack">
          {levelRoadmap.map((level) => {
            const nodes = skillNodes.filter((node) => node.level === level.level);
            return (
              <section className="sectionCard" key={level.level}>
                <div className="levelTitle">
                  <span>Level {level.level}</span>
                  <h2>{level.title}</h2>
                  <p>{level.summary}</p>
                </div>
                <div className="nodeList">
                  {nodes.map((node) => {
                    const isRecommended = progress.unlockedNodeIds.includes(node.id);
                    const isPassed = progress.passedNodeIds.includes(node.id);
                    return (
                      <button key={node.id} className={selectedNode.id === node.id ? "nodeCard selected" : "nodeCard"} type="button" onClick={() => selectNode(node)}>
                        <span className={isPassed ? "nodeIcon done" : "nodeIcon open"}>
                          {isPassed ? <Check size={16} /> : <BookOpen size={16} />}
                        </span>
                        <span>
                          <strong>{node.title}</strong>
                          <small>{isRecommended ? `${node.quizPool.length}개 문항 풀` : `선행 권장 · ${node.quizPool.length}개 문항`}</small>
                          <JapaneseText className="nodePreview" text={node.examplePool[0]} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </section>
      )}

      {activeTab === "learn" && (
        <section className="screenStack">
          <section className="sectionCard">
            <p className="eyebrow">Level {selectedNode.level} · {selectedNode.type}</p>
            <h2>{selectedNode.title}</h2>
            <div className="studyList">
              {studySession.studies.map((study, index) => (
                <article key={study}>
                  <span>{index + 1}</span>
                  <p><JapaneseText text={study} /></p>
                </article>
              ))}
            </div>
            <div className="exampleList">
              <h3>오늘의 예문</h3>
              {studySession.examples.map((example) => (
                <p key={example}><JapaneseText text={example} /></p>
              ))}
            </div>
            <div className="chipRow">
              {studySession.vocab.map((word) => (
                <span key={word}><JapaneseText text={word} /></span>
              ))}
            </div>
            {selectedNode.grammarLecture && (
              <section className="grammarLecture">
                <p className="eyebrow">문법 강의</p>
                <h3>{selectedNode.title} 핵심 정리</h3>
                <p className="lectureSummary">{selectedNode.grammarLecture.summary}</p>
                <div className="conceptList">
                  {selectedNode.grammarLecture.concepts.map((concept) => (
                    <span key={concept}>{concept}</span>
                  ))}
                </div>
                <div className="patternLectureGrid">
                  {selectedNode.grammarLecture.patterns.map((pattern) => (
                    <article key={pattern.name}>
                      <span>{pattern.name}</span>
                      <strong><JapaneseText text={pattern.formula} /></strong>
                      {pattern.examples.map((example) => (
                        <p key={example}><JapaneseText text={example} /></p>
                      ))}
                    </article>
                  ))}
                </div>
                {selectedNode.grammarLecture.transformations?.length > 0 && (
                  <div className="grammarUsageBlock">
                    <div className="grammarSectionHeader">
                      <span>활용 변화</span>
                      <h4>단어가 문법을 만나 문장으로 바뀌는 과정</h4>
                    </div>
                    <div className="transformationGrid">
                      {selectedNode.grammarLecture.transformations.map((item) => (
                        <article key={item.title} className="transformationCard">
                          <strong>{item.title}</strong>
                          <small><JapaneseText text={item.base} /></small>
                          <div className="changeSteps">
                            {item.steps.map((step) => (
                              <div key={`${item.title}-${step.label}-${step.text}`}>
                                <span>{step.label}</span>
                                <p><JapaneseText text={step.text} /></p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
                {selectedNode.grammarLecture.substitutionExamples?.length > 0 && (
                  <div className="grammarUsageBlock">
                    <div className="grammarSectionHeader">
                      <span>단어 끼워넣기</span>
                      <h4>틀은 유지하고 단어만 바꿔 회화로 확장하기</h4>
                    </div>
                    <div className="substitutionGrid">
                      {selectedNode.grammarLecture.substitutionExamples.map((item) => (
                        <article key={item.title} className="substitutionCard">
                          <span>{item.title}</span>
                          <strong><JapaneseText text={item.frame} /></strong>
                          <div className="slotChips">
                            {item.slots.map((slot) => (
                              <span key={`${item.title}-${slot}`}><JapaneseText text={slot} /></span>
                            ))}
                          </div>
                          <div className="grammarExampleList">
                            {item.examples.map((example) => (
                              <p key={`${item.title}-${example}`}><JapaneseText text={example} /></p>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
                <div className="lectureColumns">
                  <article>
                    <h4>자주 틀리는 부분</h4>
                    {selectedNode.grammarLecture.pitfalls.map((pitfall) => (
                      <p key={pitfall}>{pitfall}</p>
                    ))}
                  </article>
                  <article>
                    <h4>연습 과제</h4>
                    {selectedNode.grammarLecture.drills.map((drill) => (
                      <p key={drill}>{drill}</p>
                    ))}
                  </article>
                </div>
              </section>
            )}
            <div className="actionBar">
              <button className="ghostButton" type="button" onClick={() => setSessionSeed((value) => value + 1)}>
                <RotateCcw size={18} />
                새 예문
              </button>
              <button className="primaryButton" type="button" onClick={() => setActiveTab("test")}>
                테스트
                <ChevronRight size={18} />
              </button>
            </div>
          </section>
        </section>
      )}

      {activeTab === "test" && (
        <section className="screenStack">
          <section className="sectionCard">
            <div className="sectionHeader">
              <div>
                <p className="eyebrow">통과 기준 {selectedNode.passScore}/{quizSession.length}</p>
                <h2>{selectedNode.title} 테스트</h2>
              </div>
              <button type="button" onClick={resetTest}>새 문제</button>
            </div>
            <div className="quizList">
              {quizSession.map((item, index) => (
                <article key={`${item.q}-${index}`}>
                  <p><span>{index + 1}. </span><JapaneseText text={item.q} /></p>
                  <div className="choiceList">
                    {item.choices.map((choice) => (
                      <button key={choice} type="button" className={answers[index] === choice ? "choice selected" : "choice"} onClick={() => setAnswers((current) => ({ ...current, [index]: choice }))}>
                        <JapaneseText text={choice} />
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            {testResult && (
              <div className={testResult.passed ? "resultBox pass" : "resultBox retry"}>
                <strong>{testResult.score}/{testResult.total}</strong>
                <span>{testResult.passed ? "통과했습니다. 다음 노드가 권장 순서로 표시됩니다." : "조금만 더 복습하면 됩니다."}</span>
              </div>
            )}
            <div className="actionBar">
              <button className="ghostButton" type="button" onClick={() => setActiveTab("learn")}>학습 보기</button>
              <button className="primaryButton" type="button" onClick={submitTest}>채점하기</button>
            </div>
          </section>
        </section>
      )}

      {activeTab === "talk" && (
        <section className="screenStack">
          <section className="sectionCard talkCard">
            <div className="segmented">
              <button className={talkMode === "topic" ? "on" : ""} type="button" onClick={() => setTalkMode("topic")}>주제</button>
              <button className={talkMode === "chat" ? "on" : ""} type="button" onClick={() => setTalkMode("chat")}>채팅 조립</button>
            </div>
            {talkMode === "topic" && (
              <>
                <p className="eyebrow">{currentTopic.category}</p>
                <h2>{currentTopic.topic}</h2>
                <div className="speechBox">
                  <span>질문</span>
                  <strong>{currentTopic.question}</strong>
                  <p>{currentTopic.korean}</p>
                </div>
                <div className="speechBox">
                  <span>시작 답변</span>
                  <strong>{currentTopic.starter}</strong>
                  <p>{currentTopic.followUp}</p>
                </div>
                <div className="chipRow">
                  {currentTopic.vocab.map((item) => <span key={item}>{item}</span>)}
                </div>
                <button className="primaryButton full" type="button" onClick={() => setTopicIndex((value) => (value + 1) % talkTopics.length)}>
                  <Dice5 size={18} />
                  다음 주제
                </button>
              </>
            )}
            {talkMode === "chat" && (
              <div className="chatTrainer">
                <div>
                  <p className="eyebrow">{currentChat.category} · {chatStep + 1}/{currentChat.turns.length}</p>
                  <h2>{currentChat.title}</h2>
                </div>
                <div className="chatWindow" aria-live="polite">
                  {currentChat.turns.slice(0, chatStep).map((turn, index) => (
                    <div className="chatPair" key={`${turn.bot}-${index}`}>
                      <p className="botBubble">{turn.bot}</p>
                      <p className="userBubble">{turn.target.join(" ")}</p>
                    </div>
                  ))}
                  <p className="botBubble current">
                    <span>컴퓨터</span>
                    {currentChatTurn.bot}
                    <small>{currentChatTurn.botKr}</small>
                  </p>
                  <p className="userBubble draft">
                    {chatTokens.length > 0 ? chatTokens.join(" ") : "단어 카드를 눌러 답장을 만드세요"}
                  </p>
                </div>
                <div className="wordBank">
                  {chatChoices.map((token, index) => {
                    const used = chatTokens.includes(token);
                    return (
                      <button key={`${token}-${index}`} type="button" disabled={used} onClick={() => setChatTokens((items) => [...items, token])}>
                        {token}
                      </button>
                    );
                  })}
                </div>
                {chatFeedback && (
                  <div className={chatFeedback.correct ? "chatFeedback correctBox" : "chatFeedback retryBox"}>
                    <strong>{chatFeedback.correct ? "정답" : "다시 확인"}</strong>
                    <span>{chatFeedback.message}</span>
                    <small>{currentChatTurn.translation}</small>
                  </div>
                )}
                <div className="chatActions">
                  <button className="ghostButton" type="button" onClick={resetChatTurn}>지우기</button>
                  <button className="ghostButton" type="button" onClick={() => setChatTokens((items) => items.slice(0, -1))}>하나 취소</button>
                  <button className="primaryButton" type="button" onClick={chatFeedback?.correct ? nextChatTurn : checkChatAnswer}>
                    {chatFeedback?.correct ? "다음 채팅" : "확인"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </section>
      )}

      {activeTab === "vocab" && (
        <section className="screenStack">
          <section className="sectionCard vocabCard">
            <div className="sectionHeader">
              <div>
                <p className="eyebrow">Reference</p>
                <h2>단어장</h2>
              </div>
              <span className="countBadge">{vocabCount}개</span>
            </div>
            <div className="segmented">
              <button className={vocabMode === "kana" ? "on" : ""} type="button" onClick={() => setVocabMode("kana")}>필수 문자</button>
              <button className={vocabMode === "words" ? "on" : ""} type="button" onClick={() => setVocabMode("words")}>생활 단어</button>
              <button className={vocabMode === "expressions" ? "on" : ""} type="button" onClick={() => setVocabMode("expressions")}>생활 표현</button>
            </div>

            {vocabMode === "kana" && (
              <>
                <div className="vocabSelector">
                  {kanaReference.map((set) => (
                    <button key={set.id} className={kanaSetId === set.id ? "selected" : ""} type="button" onClick={() => selectKanaSet(set.id)}>
                      {set.title}
                    </button>
                  ))}
                </div>
                <div className="vocabIntro">
                  <strong>{currentKanaSet.title}</strong>
                  <p>{currentKanaSet.description}</p>
                </div>
                <div className="kanaModeSwitch">
                  <button className={kanaViewMode === "study" ? "on" : ""} type="button" onClick={() => setKanaViewMode("study")}>학습 보기</button>
                  <button className={kanaViewMode === "test" ? "on" : ""} type="button" onClick={() => { setKanaViewMode("test"); setKanaQuizAnswer(""); }}>암기 테스트</button>
                </div>

                {kanaViewMode === "study" && (
                  <div className="kanaReferenceGrid" style={{ "--kana-columns": currentKanaDisplay.columns }}>
                    {currentKanaDisplay.cells.map((item, index) => {
                      if (!item) {
                        return <div key={`${currentKanaSet.id}-blank-${index}`} className="kanaPlaceholder" aria-hidden="true" />;
                      }

                      const [kana, reading, meaning] = item;
                      return (
                        <article key={`${currentKanaSet.id}-${kana}`}>
                          <strong>{kana}</strong>
                          <span className="romajiText">{reading}</span>
                          <small>{meaning}</small>
                        </article>
                      );
                    })}
                  </div>
                )}

                {kanaViewMode === "test" && (
                  <article className="kanaQuizCard">
                    <span>{currentKanaSet.title} · {kanaQuizIndex + 1}번째 문제</span>
                    <strong>{kanaQuiz.correct[0]}</strong>
                    <p>이 글자는 어떻게 읽을까요?</p>
                    <div className="kanaQuizChoices">
                      {kanaQuiz.choices.map(([kana, reading, meaning]) => (
                        <button key={`${kana}-${reading}`} className={kanaQuizAnswer === kana ? "selected" : ""} type="button" onClick={() => setKanaQuizAnswer(kana)}>
                          <strong>{reading}</strong>
                          <small>{meaning}</small>
                        </button>
                      ))}
                    </div>
                    {kanaQuizAnswer && (
                      <div className={kanaQuizPassed ? "kanaQuizFeedback correctBox" : "kanaQuizFeedback retryBox"}>
                        <strong>{kanaQuizPassed ? "정답입니다" : "다시 확인해보세요"}</strong>
                        <span>정답: {kanaQuiz.correct[0]} · {showRomaji ? `${kanaQuiz.correct[1]} · ` : ""}{kanaQuiz.correct[2]}</span>
                      </div>
                    )}
                    <button className="primaryButton full" type="button" onClick={nextKanaQuiz}>다음 문제</button>
                  </article>
                )}
              </>
            )}

            {vocabMode === "words" && (
              <>
                <div className="vocabSelector">
                  {wordCategories.map((category) => (
                    <button key={category} className={wordCategory === category ? "selected" : ""} type="button" onClick={() => setWordCategory(category)}>
                      {category === "all" ? "전체" : category}
                    </button>
                  ))}
                </div>
                <div className="wordList">
                  {visibleVocabWords.map((word) => (
                    <article key={word.id}>
                      <div>
                        <strong>{word.jp}</strong>
                        <span className="romajiText">{word.reading}</span>
                      </div>
                      <p>{word.kr}</p>
                      <small>Level {word.minLevel} · {word.category}</small>
                    </article>
                  ))}
                </div>
              </>
            )}

            {vocabMode === "expressions" && (
              <>
                <div className="vocabSelector">
                  {expressionCategories.map((category) => (
                    <button key={category} className={expressionCategory === category ? "selected" : ""} type="button" onClick={() => setExpressionCategory(category)}>
                      {category === "all" ? "전체" : category}
                    </button>
                  ))}
                </div>
                <div className="expressionList">
                  {visibleExpressions.map((expression) => (
                    <article key={expression.id}>
                      <div className="expressionHeader">
                        <span>{expression.category}</span>
                        <strong>{expression.pattern}</strong>
                        <small className="romajiText">{expression.reading}</small>
                      </div>
                      <p>{expression.meaning}</p>
                      <div className="slotList" aria-label="끼워 넣을 수 있는 단어 종류">
                        {expression.slots.map((slot) => (
                          <span key={slot}>{slot}</span>
                        ))}
                      </div>
                      <div className="exampleList">
                        {expression.examples.map((example) => (
                          <small key={example}>{example}</small>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>
        </section>
      )}

      {activeTab === "games" && (
        <section className="screenStack">
          <section className="sectionCard">
            <div className="segmented">
              <button className={gameSection === "solo" ? "on" : ""} type="button" onClick={() => setGameSection("solo")}>혼자 연습</button>
              <button className={gameSection === "group" ? "on" : ""} type="button" onClick={() => setGameSection("group")}>같이 하기</button>
              <button className={gameSection === "liar" ? "on" : ""} type="button" onClick={() => setGameSection("liar")}>라이어</button>
            </div>

            {gameSection === "solo" && (
              <div className="gameStack">
                <div className="gamePicker">
                  {soloGames.map((game, index) => (
                    <button key={game.id} className={soloGameIndex === index ? "picked" : ""} type="button" onClick={() => setSoloGameIndex(index)}>
                      {game.title}
                    </button>
                  ))}
                </div>
                <article className="wordGame">
                  <span>{currentSoloGame.prompt}</span>
                  <GameGuide steps={currentSoloGame.howTo} />
                  <strong>{currentWord.jp}</strong>
                  <small className="romajiText">{currentWord.reading}</small>
                  <div className="choiceList">
                    {wordChoices.map((choice) => (
                      <button key={choice} type="button" className={wordAnswer === choice ? "choice selected" : "choice"} onClick={() => setWordAnswer(choice)}>
                        {choice}
                      </button>
                    ))}
                  </div>
                  {wordAnswer && <p className={wordAnswer === currentWord.kr ? "correct" : "incorrect"}>{wordAnswer === currentWord.kr ? "정답입니다." : `정답은 ${currentWord.kr}입니다.`}</p>}
                  <button className="primaryButton full" type="button" onClick={() => { setWordIndex((value) => value + 1); setWordAnswer(""); }}>
                    다음 문제
                  </button>
                </article>
              </div>
            )}

            {gameSection === "group" && (
              <div className="gameStack">
                <div className="gamePicker">
                  {playableGroupGames.map((game, index) => (
                    <button key={game.id} className={groupGameIndex === index ? "picked" : ""} type="button" onClick={() => selectGroupGame(index)}>
                      {game.title}
                    </button>
                  ))}
                </div>
                <article className="groupPlay">
                  <div className="groupPlayHeader">
                    <div>
                      <span>Round {groupRound + 1} · Player {groupPlayer}</span>
                      <strong>{currentGroupGame.title}</strong>
                    </div>
                    <Users size={20} />
                  </div>
                  <p>{currentGroupGame.prompt}</p>
                  <GameGuide steps={currentGroupGame.howTo} />

                  {currentGroupGame.id === "bingo" && (
                    <div className="bingoPlay">
                      <div className="bingoStatus">
                        <span>{bingoChecked.length}/9 체크</span>
                        <strong>{bingoCount > 0 ? `${bingoCount}줄 완성` : "표현을 말하면 체크"}</strong>
                      </div>
                      <div className="bingoBoard">
                        {bingoItems.map((item, index) => (
                          <button key={`${item.id}-${index}`} className={bingoChecked.includes(index) ? "checked" : ""} type="button" onClick={() => toggleBingoCell(index)}>
                            <span>{item.category}</span>
                            <strong>{item.pattern}</strong>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentGroupGame.id === "relay" && (
                    <div className="promptPlay">
                      <span>질문 카드</span>
                      <strong>{relayQuestion.jp}</strong>
                      <p>{relayQuestion.kr}</p>
                      <small>답변 틀: {relayQuestion.helper}</small>
                    </div>
                  )}

                  {currentGroupGame.id === "roleplay" && (
                    <div className="roleplayCard">
                      <span>{roleplayCard.place}</span>
                      <strong>{roleplayCard.mission}</strong>
                      <div className="roleGrid">
                        {roleplayCard.roles.map((role) => (
                          <div key={role}>{role}</div>
                        ))}
                      </div>
                      <div className="miniExpressionList">
                        {roleplayCard.expressions.map((expression) => (
                          <small key={expression}>{expression}</small>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentGroupGame.id === "forbidden" && (
                    <div className="forbiddenPlay">
                      <span>제시어</span>
                      <strong>{forbiddenCard.word}</strong>
                      <small>{forbiddenCard.meaning}</small>
                      <p>시작 문장: {forbiddenCard.starter}</p>
                      <div className="slotList" aria-label="금지어">
                        {forbiddenCard.forbidden.map((word) => (
                          <span key={word}>{word}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentGroupGame.id === "reaction" && (
                    <div className="reactionPlay">
                      <span>상대의 말</span>
                      <strong>{reactionCard.line}</strong>
                      <small>{reactionCard.meaning}</small>
                      <div className="reactionChoices">
                        {reactionCard.reactions.map((reaction) => (
                          <button key={reaction} className={reactionChoice === reaction ? "selected" : ""} type="button" onClick={() => setReactionChoice(reaction)}>
                            {reaction}
                          </button>
                        ))}
                      </div>
                      {reactionChoice && <p className="correct">좋아요. 이제 이유를 한 단어라도 덧붙여 말해보세요.</p>}
                    </div>
                  )}

                  <div className="groupActions">
                    <button className="ghostButton" type="button" onClick={() => { setGroupRound(0); setGroupPlayer(1); setBingoChecked([]); setReactionChoice(""); }}>
                      처음으로
                    </button>
                    <button className="primaryButton" type="button" onClick={nextGroupRound}>
                      다음 라운드
                    </button>
                  </div>
                </article>
              </div>
            )}

            {gameSection === "liar" && (
              <div className="liarForm">
                <GameGuide steps={groupGames.find((game) => game.id === "liar")?.howTo} />
                <div className="fieldGrid">
                  <label>시드<input value={liarSeed} onChange={(event) => setLiarSeed(event.target.value.toUpperCase())} /></label>
                  <label>총인원<input type="number" min="3" max="12" value={liarTotal} onChange={(event) => setLiarTotal(Number(event.target.value))} /></label>
                  <label>내 번호<input type="number" min="1" max={liarTotal} value={liarPlayer} onChange={(event) => setLiarPlayer(Number(event.target.value))} /></label>
                  <label>주제
                    <select value={liarTopicId} onChange={(event) => setLiarTopicId(event.target.value)}>
                      {liarTopics.map((topic) => <option key={topic.id} value={topic.id}>{topic.title}</option>)}
                    </select>
                  </label>
                </div>
                <button className="ghostButton full" type="button" onClick={startGeneratedSeed}>방장 시드 생성</button>
                <div className={isLiar ? "liarResult liar" : "liarResult normal"}>
                  <span>{liarTopic.title} · Player {liarPlayer}</span>
                  <strong>{isLiar ? "당신은 라이어입니다" : liarWord}</strong>
                  <p>{isLiar ? "다른 사람의 설명을 듣고 제시어를 추리하세요." : "이 단어를 직접 말하지 않고 일본어로 설명해보세요."}</p>
                </div>
              </div>
            )}
          </section>
        </section>
      )}

      <nav className="bottomTabs" aria-label="주요 메뉴">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} type="button" className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)}>
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </main>
  );
}
