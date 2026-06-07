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
  Lock,
  LogOut,
  Map,
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
  groupGames,
  levelRoadmap,
  liarTopics,
  skillNodes,
  soloGames,
  talkTopics,
  wordDeck,
} from "./learningData";

const tabs = [
  { id: "home", label: "홈", icon: Home },
  { id: "roadmap", label: "로드맵", icon: Map },
  { id: "learn", label: "학습", icon: BookOpen },
  { id: "test", label: "테스트", icon: Brain },
  { id: "talk", label: "대화", icon: MessageCircle },
  { id: "games", label: "게임", icon: Gamepad2 },
];

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
  const [wordIndex, setWordIndex] = useState(0);
  const [wordAnswer, setWordAnswer] = useState("");
  const [liarSeed, setLiarSeed] = useState("NIHONGO");
  const [liarTotal, setLiarTotal] = useState(4);
  const [liarPlayer, setLiarPlayer] = useState(1);
  const [liarTopicId, setLiarTopicId] = useState(liarTopics[0].id);

  const selectedNode = skillNodes.find((item) => item.id === selectedNodeId) || skillNodes[0];
  const selectedIndex = skillNodes.findIndex((item) => item.id === selectedNode.id);
  const nextNode = skillNodes[selectedIndex + 1];
  const passedCount = progress.passedNodeIds.length;
  const completionRate = Math.round((passedCount / skillNodes.length) * 100);
  const unlockedLevel = Math.max(...skillNodes.filter((node) => progress.unlockedNodeIds.includes(node.id)).map((node) => node.level), 0);
  const availableWords = wordDeck.filter((word) => word.minLevel <= unlockedLevel);
  const currentWord = availableWords[wordIndex % availableWords.length] || wordDeck[0];
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

  async function api(path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(profile?.id ? { "x-profile-id": profile.id, "x-access-key": accessKey } : {}),
      ...(options.headers || {}),
    };
    const response = await fetch(path, { ...options, headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "요청에 실패했습니다.");
    return data;
  }

  async function loadProgress(profileId, key) {
    const response = await fetch("/api/progress", {
      headers: { "x-profile-id": profileId, "x-access-key": key },
    });
    if (!response.ok) return;
    const data = await response.json();
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
      }).then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "로그인에 실패했습니다.");
        return body;
      });

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
    if (!progress.unlockedNodeIds.includes(node.id)) {
      setSelectedNodeId(node.id);
      setActiveTab("roadmap");
      return;
    }
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
    <main className="mobileShell">
      <header className="appHeader">
        <div>
          <p className="eyebrow">Level {selectedNode.level}</p>
          <h1>{selectedNode.title}</h1>
        </div>
        <button className="iconButton" type="button" onClick={logout} aria-label="로그아웃">
          <LogOut size={18} />
        </button>
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
                <button key={node.id} className={progress.passedNodeIds.includes(node.id) ? "pathDot done" : progress.unlockedNodeIds.includes(node.id) ? "pathDot open" : "pathDot locked"} onClick={() => selectNode(node)} type="button">
                  {progress.passedNodeIds.includes(node.id) ? <Check size={16} /> : progress.unlockedNodeIds.includes(node.id) ? node.level : <Lock size={15} />}
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
                    const isOpen = progress.unlockedNodeIds.includes(node.id);
                    const isPassed = progress.passedNodeIds.includes(node.id);
                    return (
                      <button key={node.id} className={selectedNode.id === node.id ? "nodeCard selected" : "nodeCard"} type="button" onClick={() => selectNode(node)}>
                        <span className={isPassed ? "nodeIcon done" : isOpen ? "nodeIcon open" : "nodeIcon locked"}>
                          {isPassed ? <Check size={16} /> : isOpen ? <BookOpen size={16} /> : <Lock size={16} />}
                        </span>
                        <span>
                          <strong>{node.title}</strong>
                          <small>{isOpen ? `${node.quizPool.length}개 문항 풀` : "이전 테스트 통과 필요"}</small>
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
            {!progress.unlockedNodeIds.includes(selectedNode.id) ? (
              <div className="lockedNotice">
                <Lock size={22} />
                <p>이전 노드 테스트를 통과하면 열립니다.</p>
              </div>
            ) : (
              <>
                <div className="studyList">
                  {studySession.studies.map((study, index) => (
                    <article key={study}>
                      <span>{index + 1}</span>
                      <p>{study}</p>
                    </article>
                  ))}
                </div>
                <div className="exampleList">
                  <h3>오늘의 예문</h3>
                  {studySession.examples.map((example) => (
                    <p key={example}>{example}</p>
                  ))}
                </div>
                <div className="chipRow">
                  {studySession.vocab.map((word) => (
                    <span key={word}>{word}</span>
                  ))}
                </div>
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
              </>
            )}
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
            {!progress.unlockedNodeIds.includes(selectedNode.id) ? (
              <div className="lockedNotice">
                <Lock size={22} />
                <p>잠긴 노드는 테스트할 수 없습니다.</p>
              </div>
            ) : (
              <>
                <div className="quizList">
                  {quizSession.map((item, index) => (
                    <article key={`${item.q}-${index}`}>
                      <p>{index + 1}. {item.q}</p>
                      <div className="choiceList">
                        {item.choices.map((choice) => (
                          <button key={choice} type="button" className={answers[index] === choice ? "choice selected" : "choice"} onClick={() => setAnswers((current) => ({ ...current, [index]: choice }))}>
                            {choice}
                          </button>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
                {testResult && (
                  <div className={testResult.passed ? "resultBox pass" : "resultBox retry"}>
                    <strong>{testResult.score}/{testResult.total}</strong>
                    <span>{testResult.passed ? "통과했습니다. 다음 노드가 열렸습니다." : "조금만 더 복습하면 됩니다."}</span>
                  </div>
                )}
                <div className="actionBar">
                  <button className="ghostButton" type="button" onClick={() => setActiveTab("learn")}>학습 보기</button>
                  <button className="primaryButton" type="button" onClick={submitTest}>채점하기</button>
                </div>
              </>
            )}
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
                  <span>{soloGames[soloGameIndex].prompt}</span>
                  <strong>{currentWord.jp}</strong>
                  <small>{currentWord.reading}</small>
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
              <div className="groupGrid">
                {groupGames.filter((game) => game.id !== "liar").map((game) => (
                  <article key={game.id}>
                    <Users size={18} />
                    <strong>{game.title}</strong>
                    <p>{game.prompt}</p>
                  </article>
                ))}
              </div>
            )}

            {gameSection === "liar" && (
              <div className="liarForm">
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
