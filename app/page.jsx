"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Dice5,
  Eye,
  Gamepad2,
  GraduationCap,
  Languages,
  Lock,
  MessageCircle,
  RotateCcw,
  ScrollText,
  Sparkles,
  Users,
} from "lucide-react";

const kanaRows = {
  hiragana: [
    ["あ", "い", "う", "え", "お"],
    ["か", "き", "く", "け", "こ"],
    ["さ", "し", "す", "せ", "そ"],
    ["た", "ち", "つ", "て", "と"],
    ["な", "に", "ぬ", "ね", "の"],
    ["は", "ひ", "ふ", "へ", "ほ"],
    ["ま", "み", "む", "め", "も"],
    ["や", "ゆ", "よ"],
    ["ら", "り", "る", "れ", "ろ"],
    ["わ", "を", "ん"],
  ],
  katakana: [
    ["ア", "イ", "ウ", "エ", "オ"],
    ["カ", "キ", "ク", "ケ", "コ"],
    ["サ", "シ", "ス", "セ", "ソ"],
    ["タ", "チ", "ツ", "テ", "ト"],
    ["ナ", "ニ", "ヌ", "ネ", "ノ"],
    ["ハ", "ヒ", "フ", "ヘ", "ホ"],
    ["マ", "ミ", "ム", "メ", "モ"],
    ["ヤ", "ユ", "ヨ"],
    ["ラ", "リ", "ル", "レ", "ロ"],
    ["ワ", "ヲ", "ン"],
  ],
};

const kanaReadings = {
  あ: "a",
  い: "i",
  う: "u",
  え: "e",
  お: "o",
  か: "ka",
  き: "ki",
  く: "ku",
  け: "ke",
  こ: "ko",
  さ: "sa",
  し: "shi",
  す: "su",
  せ: "se",
  そ: "so",
  た: "ta",
  ち: "chi",
  つ: "tsu",
  て: "te",
  と: "to",
  な: "na",
  に: "ni",
  ぬ: "nu",
  ね: "ne",
  の: "no",
  は: "ha",
  ひ: "hi",
  ふ: "fu",
  へ: "he",
  ほ: "ho",
  ま: "ma",
  み: "mi",
  む: "mu",
  め: "me",
  も: "mo",
  や: "ya",
  ゆ: "yu",
  よ: "yo",
  ら: "ra",
  り: "ri",
  る: "ru",
  れ: "re",
  ろ: "ro",
  わ: "wa",
  を: "wo",
  ん: "n",
  ア: "a",
  イ: "i",
  ウ: "u",
  エ: "e",
  オ: "o",
  カ: "ka",
  キ: "ki",
  ク: "ku",
  ケ: "ke",
  コ: "ko",
  サ: "sa",
  シ: "shi",
  ス: "su",
  セ: "se",
  ソ: "so",
  タ: "ta",
  チ: "chi",
  ツ: "tsu",
  テ: "te",
  ト: "to",
  ナ: "na",
  ニ: "ni",
  ヌ: "nu",
  ネ: "ne",
  ノ: "no",
  ハ: "ha",
  ヒ: "hi",
  フ: "fu",
  ヘ: "he",
  ホ: "ho",
  マ: "ma",
  ミ: "mi",
  ム: "mu",
  メ: "me",
  モ: "mo",
  ヤ: "ya",
  ユ: "yu",
  ヨ: "yo",
  ラ: "ra",
  リ: "ri",
  ル: "ru",
  レ: "re",
  ロ: "ro",
  ワ: "wa",
  ヲ: "wo",
  ン: "n",
};

const modules = [
  {
    id: "kana-start",
    week: "1주차",
    title: "히라가나 46자와 소리",
    time: "하루 20분",
    goal: "모음, 기본 행, 탁음 전까지 소리를 보고 바로 말한다.",
    study: [
      "あいうえお를 입 모양으로 익히고, 각 행을 5개 단위로 묶어 소리 낸다.",
      "비슷한 글자 さ/ち, ぬ/め, れ/ね를 따로 비교한다.",
      "손으로 10자씩 적고, 읽기 속도보다 정확도를 먼저 올린다.",
    ],
    material: ["히라가나 표", "소리 카드", "쓰기 루틴 10자"],
    quiz: [
      { q: "あ의 발음은?", answer: "a", choices: ["a", "i", "u", "o"] },
      { q: "し의 발음은?", answer: "shi", choices: ["sa", "shi", "chi", "tsu"] },
      { q: "れ의 발음은?", answer: "re", choices: ["ne", "me", "re", "ru"] },
      { q: "ん의 발음은?", answer: "n", choices: ["wa", "wo", "n", "mu"] },
    ],
  },
  {
    id: "katakana-start",
    week: "2주차",
    title: "가타카나와 외래어",
    time: "하루 20분",
    goal: "가타카나를 보고 커피, 택시, 호텔 같은 외래어를 읽는다.",
    study: [
      "アイウエオ부터 히라가나와 같은 소리로 연결한다.",
      "シ/ツ, ソ/ン, ク/ケ처럼 헷갈리는 모양을 묶어 본다.",
      "외래어는 장음 표시 ー를 길게 읽는다는 감각을 만든다.",
    ],
    material: ["가타카나 표", "외래어 20개", "헷갈림 비교표"],
    quiz: [
      { q: "コーヒー의 뜻은?", answer: "커피", choices: ["물", "커피", "빵", "학교"] },
      { q: "ホテル의 뜻은?", answer: "호텔", choices: ["호텔", "역", "책", "택시"] },
      { q: "ツ의 발음은?", answer: "tsu", choices: ["shi", "tsu", "su", "n"] },
      { q: "ン의 발음은?", answer: "n", choices: ["so", "n", "no", "mu"] },
    ],
  },
  {
    id: "survival",
    week: "3주차",
    title: "인사와 자기소개",
    time: "하루 25분",
    goal: "처음 만난 사람에게 이름, 국적, 취미를 짧게 말한다.",
    study: [
      "こんにちは, はじめまして, よろしくおねがいします를 통째로 익힌다.",
      "わたしは ... です 문장으로 이름과 직업을 바꿔 말한다.",
      "すきです를 써서 좋아하는 음식과 취미를 말한다.",
    ],
    material: ["자기소개 문장틀", "기본 인사 12개", "취미 단어장"],
    quiz: [
      { q: "はじめまして의 자연스러운 뜻은?", answer: "처음 뵙겠습니다", choices: ["안녕히 가세요", "처음 뵙겠습니다", "잘 먹겠습니다", "괜찮아요"] },
      { q: "わたしはミナです의 뜻은?", answer: "저는 미나입니다", choices: ["저는 미나입니다", "미나가 좋아합니다", "미나가 갑니다", "미나는 어디입니까"] },
      { q: "すきです는?", answer: "좋아합니다", choices: ["싫어합니다", "좋아합니다", "압니다", "갑니다"] },
      { q: "ありがとうございます는?", answer: "감사합니다", choices: ["실례합니다", "감사합니다", "미안합니다", "잘 자요"] },
    ],
  },
  {
    id: "particles",
    week: "4주차",
    title: "조사 は, の, か",
    time: "하루 25분",
    goal: "A는 B입니다, A의 B, 질문문을 만든다.",
    study: [
      "は는 주제를 표시하고, 문장 안에서는 wa처럼 읽는다.",
      "の는 소속과 설명을 잇는다. わたしのほん처럼 짧게 붙인다.",
      "か를 문장 끝에 붙여 질문으로 만든다.",
    ],
    material: ["조사 미니 문법", "문장 바꾸기", "질문 카드"],
    quiz: [
      { q: "これはほんですか의 뜻은?", answer: "이것은 책입니까?", choices: ["이것은 책입니까?", "이것은 책입니다", "책은 어디입니까?", "책이 아닙니다"] },
      { q: "わたしのかばん의 뜻은?", answer: "나의 가방", choices: ["나의 가방", "가방입니다", "나입니까", "가방이 좋아요"] },
      { q: "は는 문장 안에서 주로 어떻게 읽나요?", answer: "wa", choices: ["ha", "wa", "he", "o"] },
      { q: "질문을 만들 때 문장 끝에 붙이는 것은?", answer: "か", choices: ["の", "か", "は", "も"] },
    ],
  },
  {
    id: "daily-verbs",
    week: "5주차",
    title: "일상 동사와 ます",
    time: "하루 30분",
    goal: "먹다, 가다, 보다, 공부하다를 정중한 현재형으로 말한다.",
    study: [
      "たべます, いきます, みます, べんきょうします를 소리로 먼저 외운다.",
      "오늘, 내일, 매일 같은 시간 단어를 앞에 붙인다.",
      "문장 끝 억양을 낮추면 평서문, 올리면 질문 느낌이 난다.",
    ],
    material: ["동사 20개", "하루 루틴 말하기", "짧은 듣기 대본"],
    quiz: [
      { q: "たべます의 뜻은?", answer: "먹습니다", choices: ["갑니다", "먹습니다", "봅니다", "삽니다"] },
      { q: "まいにち べんきょうします의 뜻은?", answer: "매일 공부합니다", choices: ["매일 쉽니다", "매일 공부합니다", "내일 갑니다", "오늘 봅니다"] },
      { q: "いきます의 뜻은?", answer: "갑니다", choices: ["옵니다", "갑니다", "있습니다", "읽습니다"] },
      { q: "みます의 뜻은?", answer: "봅니다", choices: ["봅니다", "듣습니다", "마십니다", "씁니다"] },
    ],
  },
  {
    id: "conversation",
    week: "6주차",
    title: "프리토킹 입문",
    time: "하루 30분",
    goal: "짧은 질문을 던지고 한 문장으로 반응한다.",
    study: [
      "すきな ... はなんですか로 좋아하는 것을 묻는다.",
      "いいですね, わたしもです, そうですか로 대화를 이어간다.",
      "모르는 단어는 한국어로 적고, 일본어 단어 하나만 바꿔 다시 말한다.",
    ],
    material: ["프리토킹 주제 30개", "반응 표현", "게임 진행 문장"],
    quiz: [
      { q: "すきなたべものはなんですか의 뜻은?", answer: "좋아하는 음식은 무엇입니까?", choices: ["좋아하는 음식은 무엇입니까?", "어디에서 먹습니까?", "음식이 있습니까?", "무엇을 공부합니까?"] },
      { q: "わたしもです는?", answer: "저도요", choices: ["저도요", "아닙니다", "모릅니다", "갑시다"] },
      { q: "いいですね는?", answer: "좋네요", choices: ["비싸네요", "좋네요", "어렵네요", "없네요"] },
      { q: "なんですか는?", answer: "무엇입니까?", choices: ["누구입니까?", "언제입니까?", "무엇입니까?", "어디입니까?"] },
    ],
  },
];

const grammarLessons = [
  {
    id: "sentence-order",
    title: "일본어 문장 순서",
    level: "입문 문법",
    summary: "일본어는 보통 시간·장소·대상 뒤에 동사가 오고, 중요한 말은 조사로 표시합니다.",
    patterns: [
      { label: "기본", formula: "주제 + は + 설명 + です", example: "わたしは がくせいです。", meaning: "저는 학생입니다." },
      { label: "동작", formula: "주제 + は + 대상 + を + 동사", example: "わたしは みずを のみます。", meaning: "저는 물을 마십니다." },
      { label: "질문", formula: "문장 + か", example: "これは ほんですか。", meaning: "이것은 책입니까?" },
    ],
    notes: ["동사는 문장 끝에 둡니다.", "띄어쓰기는 학습용으로만 넣었습니다.", "처음에는 조사 뒤를 짧게 끊어 읽어도 좋습니다."],
    quiz: [
      { q: "일본어 문장에서 동사는 보통 어디에 오나요?", answer: "문장 끝", choices: ["문장 처음", "문장 끝", "명사 앞", "조사 앞"] },
      { q: "これは ほんですか에서 질문을 만드는 말은?", answer: "か", choices: ["は", "ほん", "か", "これ"] },
      { q: "わたしは がくせいです의 뜻은?", answer: "저는 학생입니다", choices: ["저는 학생입니다", "저는 책입니다", "학생은 어디입니까", "저는 갑니다"] },
    ],
  },
  {
    id: "desu",
    title: "です와 じゃありません",
    level: "정중한 말",
    summary: "です는 '~입니다'에 가깝고, じゃありません은 '~이 아닙니다'로 씁니다.",
    patterns: [
      { label: "긍정", formula: "명사 + です", example: "すしです。", meaning: "초밥입니다." },
      { label: "부정", formula: "명사 + じゃありません", example: "すしじゃありません。", meaning: "초밥이 아닙니다." },
      { label: "질문", formula: "명사 + ですか", example: "すしですか。", meaning: "초밥입니까?" },
    ],
    notes: ["친한 사이 말투보다 です가 먼저 안전합니다.", "아니라고 답할 때는 いいえ를 앞에 붙일 수 있습니다.", "처음에는 명사 하나만 바꿔 말해도 충분합니다."],
    quiz: [
      { q: "すしです의 뜻은?", answer: "초밥입니다", choices: ["초밥입니다", "초밥이 아닙니다", "초밥입니까", "초밥을 먹습니다"] },
      { q: "~이 아닙니다에 가까운 표현은?", answer: "じゃありません", choices: ["です", "か", "じゃありません", "を"] },
      { q: "すしですか의 뜻은?", answer: "초밥입니까?", choices: ["초밥입니다", "초밥입니까?", "초밥이 아닙니다", "초밥을 삽니다"] },
    ],
  },
  {
    id: "particles-basic",
    title: "조사 は, の, を, で",
    level: "문장 연결",
    summary: "조사는 단어의 역할을 표시합니다. 초급에서는 は, の, を, で부터 익히면 문장이 빨리 열립니다.",
    patterns: [
      { label: "は", formula: "A + は", example: "わたしは ミナです。", meaning: "저는 미나입니다." },
      { label: "の", formula: "A + の + B", example: "わたしの かばんです。", meaning: "제 가방입니다." },
      { label: "を", formula: "대상 + を + 동사", example: "パンを たべます。", meaning: "빵을 먹습니다." },
      { label: "で", formula: "장소 + で + 동작", example: "いえで べんきょうします。", meaning: "집에서 공부합니다." },
    ],
    notes: ["は는 조사일 때 wa처럼 읽습니다.", "を는 보통 o처럼 읽습니다.", "で는 동작이 일어나는 장소를 표시합니다."],
    quiz: [
      { q: "わたしの かばん에서 の의 역할은?", answer: "소유 연결", choices: ["질문", "소유 연결", "동작 대상", "장소"] },
      { q: "パンを たべます에서 を는 무엇을 표시하나요?", answer: "먹는 대상", choices: ["먹는 대상", "장소", "이름", "질문"] },
      { q: "いえで べんきょうします의 뜻은?", answer: "집에서 공부합니다", choices: ["집이 공부입니다", "집에서 공부합니다", "집에 갑니다", "집을 삽니다"] },
    ],
  },
  {
    id: "masu",
    title: "ます형 동사",
    level: "일상 동작",
    summary: "ます형은 정중하게 동작을 말할 때 쓰는 기본 형태입니다.",
    patterns: [
      { label: "현재", formula: "동사 + ます", example: "みずを のみます。", meaning: "물을 마십니다." },
      { label: "부정", formula: "동사 + ません", example: "コーヒーを のみません。", meaning: "커피를 마시지 않습니다." },
      { label: "질문", formula: "동사 + ますか", example: "にほんごを べんきょうしますか。", meaning: "일본어를 공부합니까?" },
    ],
    notes: ["처음에는 たべます, のみます, いきます, みます부터 외웁니다.", "ません은 정중한 부정입니다.", "ますか는 질문 억양을 살짝 올리면 자연스럽습니다."],
    quiz: [
      { q: "のみます의 뜻은?", answer: "마십니다", choices: ["마십니다", "먹습니다", "갑니다", "봅니다"] },
      { q: "のみません의 뜻은?", answer: "마시지 않습니다", choices: ["마십니다", "마시지 않습니다", "마십니까", "마시고 싶습니다"] },
      { q: "べんきょうしますか는?", answer: "공부합니까?", choices: ["공부합니다", "공부합니까?", "공부하지 않습니다", "공부였습니다"] },
    ],
  },
  {
    id: "adjectives",
    title: "い형용사와 な형용사",
    level: "느낌 말하기",
    summary: "형용사는 사물과 경험의 느낌을 말할 때 씁니다. い형용사와 な형용사는 명사 앞에서 모양이 다릅니다.",
    patterns: [
      { label: "い형용사", formula: "い형용사 + 명사", example: "おいしい たべものです。", meaning: "맛있는 음식입니다." },
      { label: "な형용사", formula: "な형용사 + な + 명사", example: "しずかな まちです。", meaning: "조용한 도시입니다." },
      { label: "문장 끝", formula: "형용사 + です", example: "このほんは おもしろいです。", meaning: "이 책은 재미있습니다." },
    ],
    notes: ["おいしい, たのしい, むずかしい는 い형용사입니다.", "しずか, べんり, すき는 な형용사처럼 다룹니다.", "すきです는 '좋아합니다'로 자주 씁니다."],
    quiz: [
      { q: "おいしい たべもの의 뜻은?", answer: "맛있는 음식", choices: ["맛있는 음식", "조용한 음식", "어려운 음식", "좋아하는 음식"] },
      { q: "しずか 뒤에 명사를 바로 붙일 때 필요한 것은?", answer: "な", choices: ["は", "を", "な", "か"] },
      { q: "このほんは おもしろいです의 뜻은?", answer: "이 책은 재미있습니다", choices: ["이 책은 재미있습니다", "이 책은 조용합니다", "이 책은 갑니다", "이 책은 먹습니다"] },
    ],
  },
];

const freeTalkTopics = [
  {
    category: "일상",
    topic: "아침 루틴",
    question: "あさ、なにをしますか。",
    korean: "아침에 무엇을 하나요?",
    starter: "あさ、コーヒーをのみます。",
    vocab: ["あさ 아침", "のみます 마십니다", "ねます 잡니다"],
  },
  {
    category: "취미",
    topic: "좋아하는 음악",
    question: "すきなおんがくはなんですか。",
    korean: "좋아하는 음악은 무엇인가요?",
    starter: "わたしはポップスがすきです。",
    vocab: ["おんがく 음악", "すき 좋아함", "よく 자주"],
  },
  {
    category: "음식",
    topic: "편의점 추천",
    question: "コンビニでなにをかいますか。",
    korean: "편의점에서 무엇을 사나요?",
    starter: "おにぎりをかいます。",
    vocab: ["かいます 삽니다", "おにぎり 주먹밥", "みず 물"],
  },
  {
    category: "여행",
    topic: "가고 싶은 도시",
    question: "どこへいきたいですか。",
    korean: "어디에 가고 싶나요?",
    starter: "きょうとへいきたいです。",
    vocab: ["どこ 어디", "いきたい 가고 싶다", "まち 도시"],
  },
  {
    category: "공부",
    topic: "어려운 글자",
    question: "むずかしいかなはなんですか。",
    korean: "어려운 가나는 무엇인가요?",
    starter: "ツとシがむずかしいです。",
    vocab: ["むずかしい 어렵다", "かな 가나", "れんしゅう 연습"],
  },
  {
    category: "친구",
    topic: "주말 약속",
    question: "しゅうまつ、なにをしますか。",
    korean: "주말에 무엇을 하나요?",
    starter: "ともだちにあいます。",
    vocab: ["しゅうまつ 주말", "ともだち 친구", "あいます 만납니다"],
  },
];

const wordDeck = [
  { jp: "みず", reading: "mizu", kr: "물", hints: ["마실 수 있습니다.", "투명합니다.", "편의점에서 삽니다."] },
  { jp: "ねこ", reading: "neko", kr: "고양이", hints: ["집에서 키울 수 있습니다.", "작고 귀엽습니다.", "にゃー라고 웁니다."] },
  { jp: "ほん", reading: "hon", kr: "책", hints: ["읽습니다.", "가방에 넣을 수 있습니다.", "도서관에 많습니다."] },
  { jp: "えき", reading: "eki", kr: "역", hints: ["전철을 탑니다.", "사람이 많이 모입니다.", "여행할 때 자주 갑니다."] },
  { jp: "パン", reading: "pan", kr: "빵", hints: ["먹습니다.", "아침 식사로 좋습니다.", "가타카나 단어입니다."] },
  { jp: "ともだち", reading: "tomodachi", kr: "친구", hints: ["함께 이야기합니다.", "약속을 잡습니다.", "학교에서 만날 수 있습니다."] },
];

const liarWordSets = [
  ["すし", "ラーメン", "おにぎり", "カレー"],
  ["ねこ", "いぬ", "とり", "さかな"],
  ["えき", "ホテル", "コンビニ", "くうこう"],
  ["ほん", "えんぴつ", "ノート", "かばん"],
];

const navItems = [
  { id: "study", label: "학습", icon: BookOpen },
  { id: "kana", label: "가나", icon: Languages },
  { id: "grammar", label: "문법", icon: ScrollText },
  { id: "test", label: "테스트", icon: Brain },
  { id: "talk", label: "프리토킹", icon: MessageCircle },
  { id: "games", label: "게임", icon: Gamepad2 },
];

function pickNext(index, length) {
  return (index + 1) % length;
}

function scoreQuiz(answers, quiz) {
  return quiz.reduce((score, item, index) => score + (answers[index] === item.answer ? 1 : 0), 0);
}

function getKanaChoices(kana, allKana) {
  const answer = kanaReadings[kana];
  const pool = allKana.map((item) => kanaReadings[item]).filter((item) => item !== answer);
  return [answer, ...pool.slice(3, 6)].sort();
}

function getWordChoices(word) {
  const distractors = wordDeck.filter((item) => item.kr !== word.kr).slice(0, 3).map((item) => item.kr);
  return [word.kr, ...distractors].sort();
}

export default function Home() {
  const [activeView, setActiveView] = useState("study");
  const [currentModule, setCurrentModule] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [answers, setAnswers] = useState({});
  const [grammarIndex, setGrammarIndex] = useState(0);
  const [grammarCompleted, setGrammarCompleted] = useState([]);
  const [grammarAnswers, setGrammarAnswers] = useState({});
  const [kanaMode, setKanaMode] = useState("hiragana");
  const [flashIndex, setFlashIndex] = useState(0);
  const [showReading, setShowReading] = useState(false);
  const [kanaAnswer, setKanaAnswer] = useState("");
  const [topicIndex, setTopicIndex] = useState(0);
  const [gameMode, setGameMode] = useState("word");
  const [wordIndex, setWordIndex] = useState(0);
  const [wordAnswer, setWordAnswer] = useState("");
  const [hintCount, setHintCount] = useState(1);
  const [playerCount, setPlayerCount] = useState(4);
  const [liarSetIndex, setLiarSetIndex] = useState(0);
  const [liarIndex, setLiarIndex] = useState(1);
  const [revealedPlayer, setRevealedPlayer] = useState(null);

  const module = modules[currentModule];
  const testUnlocked = completed.includes(module.id);
  const quizScore = scoreQuiz(answers, module.quiz);
  const grammar = grammarLessons[grammarIndex];
  const grammarUnlocked = grammarCompleted.includes(grammar.id);
  const grammarScore = scoreQuiz(grammarAnswers, grammar.quiz);
  const progress = Math.round((completed.length / modules.length) * 100);
  const allKana = useMemo(() => kanaRows[kanaMode].flat(), [kanaMode]);
  const currentKana = allKana[flashIndex % allKana.length];
  const topic = freeTalkTopics[topicIndex];
  const currentWord = wordDeck[wordIndex];
  const liarWords = liarWordSets[liarSetIndex];
  const secretWord = liarWords[0];

  useEffect(() => {
    const saved = window.localStorage.getItem("nihongo-progress");
    if (saved) setCompleted(JSON.parse(saved));
    const savedGrammar = window.localStorage.getItem("nihongo-grammar-progress");
    if (savedGrammar) setGrammarCompleted(JSON.parse(savedGrammar));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("nihongo-progress", JSON.stringify(completed));
  }, [completed]);

  useEffect(() => {
    window.localStorage.setItem("nihongo-grammar-progress", JSON.stringify(grammarCompleted));
  }, [grammarCompleted]);

  function completeModule() {
    setCompleted((items) => (items.includes(module.id) ? items : [...items, module.id]));
    setActiveView("test");
  }

  function resetModuleTest() {
    setAnswers({});
  }

  function nextModule() {
    setCurrentModule((index) => pickNext(index, modules.length));
    setAnswers({});
    setActiveView("study");
  }

  function completeGrammar() {
    setGrammarCompleted((items) => (items.includes(grammar.id) ? items : [...items, grammar.id]));
  }

  function nextGrammar() {
    setGrammarIndex((index) => pickNext(index, grammarLessons.length));
    setGrammarAnswers({});
  }

  function shuffleLiarGame() {
    setLiarSetIndex((index) => pickNext(index, liarWordSets.length));
    setLiarIndex((index) => (index + 2) % playerCount);
    setRevealedPlayer(null);
  }

  return (
    <main className="shell">
      <section className="topbar" aria-label="학습 앱 상단">
        <div className="brandMark">
          <GraduationCap size={22} />
        </div>
        <div>
          <p className="eyebrow">Nihongo First Steps</p>
          <h1>일본어 첫걸음</h1>
        </div>
        <div className="progressPill" aria-label={`전체 진도 ${progress}%`}>
          <span>{progress}%</span>
          <div className="progressTrack">
            <div style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      <section className="heroBand">
        <Image
          src="/japanese-study-banner.png"
          alt="가나 카드와 노트가 놓인 일본어 학습 책상 일러스트"
          fill
          priority
          className="heroImage"
          sizes="100vw"
        />
        <div className="heroOverlay" />
        <div className="heroContent">
          <p>히라가나부터 프리토킹 놀이까지</p>
          <h2>오늘 배운 것을 오늘 말해보는 왕초보 루틴</h2>
          <div className="heroStats">
            <span>6주 과정</span>
            <span>가나 카드 92개</span>
            <span>그룹 게임 3종</span>
          </div>
        </div>
      </section>

      <nav className="viewTabs" aria-label="주요 학습 메뉴">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={activeView === item.id ? "active" : ""}
              onClick={() => setActiveView(item.id)}
              type="button"
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {activeView === "study" && (
        <section className="layout">
          <aside className="moduleRail" aria-label="학습 순서">
            {modules.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={currentModule === index ? "railItem selected" : "railItem"}
                onClick={() => {
                  setCurrentModule(index);
                  setAnswers({});
                }}
              >
                <span className={completed.includes(item.id) ? "statusDot done" : "statusDot"} />
                <strong>{item.week}</strong>
                <span>{item.title}</span>
              </button>
            ))}
          </aside>

          <section className="lessonPanel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">{module.week} · {module.time}</p>
                <h2>{module.title}</h2>
              </div>
              {completed.includes(module.id) && (
                <span className="doneBadge">
                  <Check size={16} />
                  완료
                </span>
              )}
            </div>

            <div className="goalBox">
              <Sparkles size={20} />
              <p>{module.goal}</p>
            </div>

            <div className="studyGrid">
              {module.study.map((item, index) => (
                <article key={item} className="studyCard">
                  <span>{index + 1}</span>
                  <p>{item}</p>
                </article>
              ))}
            </div>

            <div className="resourceStrip" aria-label="학습 자료">
              {module.material.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="actionRow">
              <button className="primaryButton" type="button" onClick={completeModule}>
                <Check size={18} />
                학습 완료
              </button>
              <button className="ghostButton" type="button" onClick={() => setActiveView("kana")}>
                <Languages size={18} />
                가나 연습
              </button>
            </div>
          </section>
        </section>
      )}

      {activeView === "kana" && (
        <section className="twoColumn">
          <section className="kanaBoard">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">소리와 모양</p>
                <h2>{kanaMode === "hiragana" ? "히라가나 표" : "가타카나 표"}</h2>
              </div>
              <div className="segmented">
                <button type="button" className={kanaMode === "hiragana" ? "on" : ""} onClick={() => setKanaMode("hiragana")}>
                  히라가나
                </button>
                <button type="button" className={kanaMode === "katakana" ? "on" : ""} onClick={() => setKanaMode("katakana")}>
                  가타카나
                </button>
              </div>
            </div>
            <div className="kanaGrid">
              {kanaRows[kanaMode].map((row, rowIndex) => (
                <div className="kanaRow" key={`${kanaMode}-${rowIndex}`}>
                  {row.map((kana) => (
                    <button
                      className={kana === currentKana ? "kanaCell selectedKana" : "kanaCell"}
                      type="button"
                      key={kana}
                      onClick={() => {
                        setFlashIndex(allKana.indexOf(kana));
                        setShowReading(true);
                        setKanaAnswer("");
                      }}
                    >
                      <strong>{kana}</strong>
                      <span>{kanaReadings[kana]}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="flashPanel">
            <p className="eyebrow">플래시 카드</p>
            <div className="flashCard" aria-live="polite">
              <strong>{currentKana}</strong>
              <span>{showReading ? kanaReadings[currentKana] : "읽기 숨김"}</span>
            </div>
            <div className="actionRow">
              <button className="ghostButton" type="button" onClick={() => setShowReading((value) => !value)}>
                <Eye size={18} />
                {showReading ? "숨기기" : "보기"}
              </button>
              <button
                className="primaryButton"
                type="button"
                onClick={() => {
                  setFlashIndex((index) => pickNext(index, allKana.length));
                  setShowReading(false);
                  setKanaAnswer("");
                }}
              >
                <ChevronRight size={18} />
                다음
              </button>
            </div>
            <div className="miniQuiz">
              <p>{currentKana}의 발음은?</p>
              <div>
                {getKanaChoices(currentKana, allKana).map((choice) => (
                  <button
                    type="button"
                    key={choice}
                    className={kanaAnswer === choice ? "choice selectedChoice" : "choice"}
                    onClick={() => setKanaAnswer(choice)}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              {kanaAnswer && (
                <strong className={kanaAnswer === kanaReadings[currentKana] ? "rightText" : "wrongText"}>
                  {kanaAnswer === kanaReadings[currentKana] ? "정답" : `정답은 ${kanaReadings[currentKana]}`}
                </strong>
              )}
            </div>
          </section>
        </section>
      )}

      {activeView === "grammar" && (
        <section className="grammarLayout">
          <aside className="grammarRail" aria-label="문법 주제">
            {grammarLessons.map((item, index) => (
              <button
                type="button"
                key={item.id}
                className={grammarIndex === index ? "railItem selected" : "railItem"}
                onClick={() => {
                  setGrammarIndex(index);
                  setGrammarAnswers({});
                }}
              >
                <span className={grammarCompleted.includes(item.id) ? "statusDot done" : "statusDot"} />
                <strong>{item.level}</strong>
                <span>{item.title}</span>
              </button>
            ))}
          </aside>

          <section className="grammarPanel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">{grammar.level}</p>
                <h2>{grammar.title}</h2>
              </div>
              {grammarUnlocked && (
                <span className="doneBadge">
                  <Check size={16} />
                  학습 완료
                </span>
              )}
            </div>

            <div className="grammarSummary">
              <ScrollText size={22} />
              <p>{grammar.summary}</p>
            </div>

            <div className="patternGrid">
              {grammar.patterns.map((pattern) => (
                <article className="patternCard" key={`${grammar.id}-${pattern.label}`}>
                  <span>{pattern.label}</span>
                  <strong>{pattern.formula}</strong>
                  <p>{pattern.example}</p>
                  <small>{pattern.meaning}</small>
                </article>
              ))}
            </div>

            <div className="noteList" aria-label="문법 메모">
              {grammar.notes.map((note) => (
                <span key={note}>{note}</span>
              ))}
            </div>

            <div className="actionRow">
              <button className="primaryButton" type="button" onClick={completeGrammar}>
                <Check size={18} />
                문법 학습 완료
              </button>
              <button className="ghostButton" type="button" onClick={nextGrammar}>
                <ChevronRight size={18} />
                다음 문법
              </button>
            </div>

            <section className="grammarTest" aria-label="문법 테스트">
              <div className="panelHeader">
                <div>
                  <p className="eyebrow">문법 테스트</p>
                  <h3>{grammar.title}</h3>
                </div>
                <button className="ghostButton" type="button" onClick={() => setGrammarAnswers({})}>
                  <RotateCcw size={17} />
                  다시 풀기
                </button>
              </div>

              {!grammarUnlocked ? (
                <div className="miniLocked">
                  <Lock size={20} />
                  <span>문법 학습 완료 후 테스트가 열립니다.</span>
                </div>
              ) : (
                <>
                  <div className="quizGrid">
                    {grammar.quiz.map((item, index) => (
                      <article key={item.q} className="quizCard">
                        <p>{index + 1}. {item.q}</p>
                        <div className="choiceGrid">
                          {item.choices.map((choice) => (
                            <button
                              type="button"
                              key={choice}
                              className={grammarAnswers[index] === choice ? "choice selectedChoice" : "choice"}
                              onClick={() => setGrammarAnswers((items) => ({ ...items, [index]: choice }))}
                            >
                              {choice}
                            </button>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                  <div className="scoreBar">
                    <strong>{grammarScore} / {grammar.quiz.length}</strong>
                    <span>{grammarScore === grammar.quiz.length ? "이 문법은 말하기에 써도 좋습니다." : "위 예문을 소리 내어 읽고 다시 풀어보세요."}</span>
                  </div>
                </>
              )}
            </section>
          </section>
        </section>
      )}

      {activeView === "test" && (
        <section className="testPanel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">{module.week} 테스트</p>
              <h2>{module.title}</h2>
            </div>
            <button className="ghostButton" type="button" onClick={resetModuleTest}>
              <RotateCcw size={17} />
              다시 풀기
            </button>
          </div>

          {!testUnlocked ? (
            <div className="lockedBox">
              <Lock size={28} />
              <h3>학습을 먼저 완료하세요</h3>
              <p>{module.title} 학습을 마치면 테스트가 열립니다.</p>
              <button className="primaryButton" type="button" onClick={() => setActiveView("study")}>
                <BookOpen size={18} />
                학습으로 이동
              </button>
            </div>
          ) : (
            <>
              <div className="quizGrid">
                {module.quiz.map((item, index) => (
                  <article key={item.q} className="quizCard">
                    <p>{index + 1}. {item.q}</p>
                    <div className="choiceGrid">
                      {item.choices.map((choice) => (
                        <button
                          type="button"
                          key={choice}
                          className={answers[index] === choice ? "choice selectedChoice" : "choice"}
                          onClick={() => setAnswers((items) => ({ ...items, [index]: choice }))}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <div className="scoreBar">
                <strong>{quizScore} / {module.quiz.length}</strong>
                <span>{quizScore === module.quiz.length ? "다음 단계로 넘어갈 준비가 됐습니다." : "틀린 문항을 학습 카드에서 다시 확인하세요."}</span>
                <button className="primaryButton" type="button" onClick={nextModule}>
                  다음 학습
                  <ChevronRight size={18} />
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {activeView === "talk" && (
        <section className="talkPanel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">{topic.category}</p>
              <h2>{topic.topic}</h2>
            </div>
            <button className="primaryButton" type="button" onClick={() => setTopicIndex((index) => pickNext(index, freeTalkTopics.length))}>
              <Dice5 size={18} />
              주제 바꾸기
            </button>
          </div>

          <div className="conversationStage">
            <article>
              <span>질문</span>
              <strong>{topic.question}</strong>
              <p>{topic.korean}</p>
            </article>
            <article>
              <span>첫 답변</span>
              <strong>{topic.starter}</strong>
              <p>{topic.vocab.join(" · ")}</p>
            </article>
            <article>
              <span>이어 말하기</span>
              <strong>いいですね。わたしもです。</strong>
              <p>좋네요. 저도요.</p>
            </article>
          </div>

          <div className="topicGrid">
            {freeTalkTopics.map((item, index) => (
              <button
                type="button"
                key={item.topic}
                className={topicIndex === index ? "topicCard picked" : "topicCard"}
                onClick={() => setTopicIndex(index)}
              >
                <span>{item.category}</span>
                <strong>{item.topic}</strong>
                <small>{item.question}</small>
              </button>
            ))}
          </div>
        </section>
      )}

      {activeView === "games" && (
        <section className="gamesPanel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">같이 하는 연습</p>
              <h2>게임방</h2>
            </div>
            <div className="segmented">
              <button type="button" className={gameMode === "word" ? "on" : ""} onClick={() => setGameMode("word")}>
                단어
              </button>
              <button type="button" className={gameMode === "twenty" ? "on" : ""} onClick={() => setGameMode("twenty")}>
                스무고개
              </button>
              <button type="button" className={gameMode === "liar" ? "on" : ""} onClick={() => setGameMode("liar")}>
                라이어
              </button>
            </div>
          </div>

          {gameMode === "word" && (
            <div className="gameSurface">
              <div className="wordPoster">
                <span>{currentWord.reading}</span>
                <strong>{currentWord.jp}</strong>
              </div>
              <div className="gameControls">
                <p>뜻 맞추기</p>
                <div className="choiceGrid">
                  {getWordChoices(currentWord).map((choice) => (
                    <button
                      type="button"
                      key={choice}
                      className={wordAnswer === choice ? "choice selectedChoice" : "choice"}
                      onClick={() => setWordAnswer(choice)}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
                {wordAnswer && (
                  <strong className={wordAnswer === currentWord.kr ? "rightText" : "wrongText"}>
                    {wordAnswer === currentWord.kr ? "정답" : `정답은 ${currentWord.kr}`}
                  </strong>
                )}
                <button
                  className="primaryButton"
                  type="button"
                  onClick={() => {
                    setWordIndex((index) => pickNext(index, wordDeck.length));
                    setWordAnswer("");
                  }}
                >
                  <ChevronRight size={18} />
                  다음 단어
                </button>
              </div>
            </div>
          )}

          {gameMode === "twenty" && (
            <div className="gameSurface">
              <div className="wordPoster hiddenWord">
                <span>비밀 단어</span>
                <strong>{currentWord.jp}</strong>
              </div>
              <div className="gameControls">
                <p>질문 힌트</p>
                <div className="hintList">
                  {currentWord.hints.slice(0, hintCount).map((hint) => (
                    <span key={hint}>{hint}</span>
                  ))}
                </div>
                <div className="actionRow">
                  <button className="ghostButton" type="button" onClick={() => setHintCount((count) => Math.min(count + 1, currentWord.hints.length))}>
                    <Eye size={18} />
                    힌트
                  </button>
                  <button
                    className="primaryButton"
                    type="button"
                    onClick={() => {
                      setWordIndex((index) => pickNext(index, wordDeck.length));
                      setHintCount(1);
                    }}
                  >
                    <ChevronRight size={18} />
                    다음
                  </button>
                </div>
              </div>
            </div>
          )}

          {gameMode === "liar" && (
            <div className="liarPanel">
              <div className="liarControls">
                <label>
                  <Users size={18} />
                  인원
                  <input
                    type="number"
                    min="3"
                    max="8"
                    value={playerCount}
                    onChange={(event) => {
                      const nextCount = Number(event.target.value);
                      setPlayerCount(nextCount);
                      setLiarIndex((index) => index % nextCount);
                    }}
                  />
                </label>
                <button className="primaryButton" type="button" onClick={shuffleLiarGame}>
                  <Dice5 size={18} />
                  새 라운드
                </button>
              </div>
              <div className="playerGrid">
                {Array.from({ length: playerCount }).map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    className={revealedPlayer === index ? "playerCard revealed" : "playerCard"}
                    onClick={() => setRevealedPlayer(revealedPlayer === index ? null : index)}
                  >
                    <span>Player {index + 1}</span>
                    <strong>{revealedPlayer === index ? (index === liarIndex ? "라이어" : secretWord) : "카드 확인"}</strong>
                  </button>
                ))}
              </div>
              <div className="resourceStrip">
                {liarWords.map((word) => (
                  <span key={word}>{word}</span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
