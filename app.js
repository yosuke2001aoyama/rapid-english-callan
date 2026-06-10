const lessons = [
  {
    section: 'RAPID Q&A',
    question: 'If a policy appears efficient in the short term but creates substantial costs later on, should decision-makers still adopt it?',
    prompt: 'No, decision-makers shouldn\'t ...',
    answer: 'No, decision-makers shouldn\'t adopt a policy merely because it appears efficient in the short term if it creates substantial costs later on.',
    concepts: [['decision', 'makers'], ['shouldn\'t', 'should not'], ['short', 'term'], ['costs', 'consequences'], ['later', 'long term']],
    phrases: ['merely because'], minWords: 20
  },
  {
    section: 'RAPID Q&A',
    question: 'Why is it often misleading to judge the reliability of a claim solely by the confidence with which it is expressed?',
    prompt: 'It is often misleading because ...',
    answer: 'It is often misleading because confidence of delivery is not necessarily evidence that the claim itself is accurate or well supported.',
    concepts: [['misleading'], ['confidence'], ['evidence', 'proof'], ['accurate', 'reliable'], ['supported', 'substantiated']],
    phrases: ['not necessarily'], minWords: 18
  },
  {
    section: 'RAPID Q&A',
    question: 'Would an organization be justified in withholding information if disclosing it immediately could undermine an ongoing investigation?',
    prompt: 'Yes, an organization might ...',
    answer: 'Yes, an organization might be justified in withholding information temporarily if immediate disclosure could undermine an ongoing investigation.',
    concepts: [['organization'], ['justified'], ['withholding', 'withhold'], ['disclosure', 'disclosing'], ['investigation']],
    phrases: ['might be justified'], minWords: 16
  },
  {
    section: 'RAPID Q&A',
    question: 'What tends to happen when people repeatedly postpone difficult decisions on the assumption that circumstances will resolve themselves?',
    prompt: 'When people repeatedly postpone ...',
    answer: 'When people repeatedly postpone difficult decisions, the available options tend to narrow and the eventual consequences become harder to manage.',
    concepts: [['postpone', 'delay'], ['decisions'], ['options', 'choices'], ['narrow', 'fewer'], ['consequences', 'outcome']],
    phrases: ['tend to'], minWords: 18
  },
  {
    section: 'RAPID Q&A',
    question: 'In what sense can a highly specialized expert be at a disadvantage when explaining an issue to the general public?',
    prompt: 'A highly specialized expert can ...',
    answer: 'A highly specialized expert can be at a disadvantage because extensive knowledge may make it difficult to recognize what the general public does not yet understand.',
    concepts: [['expert'], ['disadvantage'], ['knowledge', 'expertise'], ['public', 'audience'], ['understand', 'know']],
    phrases: ['be at a disadvantage'], minWords: 20
  },
  {
    section: 'PATTERN PRACTICE',
    question: 'If a committee considers a proposal generally acceptable despite a few minor flaws, how might it describe the proposal using the phrase “by and large”?',
    prompt: 'By and large, the committee ...',
    answer: 'By and large, the committee considers the proposal acceptable despite its minor flaws.',
    concepts: [['committee'], ['proposal'], ['acceptable'], ['minor', 'few'], ['flaws', 'problems']],
    phrases: ['by and large'], minWords: 12
  },
  {
    section: 'PATTERN PRACTICE',
    question: 'If a research team must continue working continuously to meet an unexpectedly early deadline, what will they have to do?',
    prompt: 'They will have to work ...',
    answer: 'They will have to work around the clock to meet the unexpectedly early deadline.',
    concepts: [['work'], ['deadline'], ['meet'], ['early', 'unexpectedly']],
    phrases: ['around the clock'], minWords: 12
  },
  {
    section: 'PATTERN PRACTICE',
    question: 'How would you say that a convincing argument directly identifies the central cause of a persistent problem?',
    prompt: 'The argument hits ...',
    answer: 'The argument hits the nail on the head by identifying the central cause of the persistent problem.',
    concepts: [['argument'], ['identifying', 'identifies'], ['central', 'main'], ['cause'], ['problem']],
    phrases: ['hits the nail on the head'], minWords: 15
  },
  {
    section: 'PATTERN PRACTICE',
    question: 'If the evidence is incomplete and you want to avoid reaching a conclusion too early, what should you reserve?',
    prompt: 'I should reserve ...',
    answer: 'I should reserve judgment until enough evidence is available to support a reliable conclusion.',
    concepts: [['evidence'], ['available', 'complete'], ['support'], ['reliable', 'sound'], ['conclusion']],
    phrases: ['reserve judgment'], minWords: 13
  },
  {
    section: 'CORRECTION LOOP',
    question: 'Why can a correlation between two variables not, by itself, establish that one variable causes the other?',
    prompt: 'A correlation cannot establish causation because ...',
    answer: 'A correlation cannot establish causation because the relationship may be coincidental or produced by a third variable that affects both of them.',
    concepts: [['correlation'], ['causation', 'causes'], ['coincidental', 'coincidence'], ['third'], ['variable']],
    phrases: ['cannot establish causation'], minWords: 19
  },
  {
    section: 'CORRECTION LOOP',
    question: 'When writing a formal recommendation, why is it preferable to acknowledge a serious counterargument before defending your own position?',
    prompt: 'It is preferable to acknowledge ...',
    answer: 'It is preferable to acknowledge a serious counterargument because doing so demonstrates intellectual fairness and makes the defense of your own position more credible.',
    concepts: [['acknowledge'], ['counterargument', 'objection'], ['fairness'], ['position', 'argument'], ['credible', 'convincing']],
    phrases: ['doing so'], minWords: 20
  },
  {
    section: 'CORRECTION LOOP',
    question: 'If technological progress increases productivity but distributes its benefits unevenly, what challenge does that present to public policy?',
    prompt: 'It presents the challenge of ...',
    answer: 'It presents the challenge of preserving the gains from higher productivity while ensuring that the resulting benefits are distributed more equitably.',
    concepts: [['productivity'], ['gains', 'benefits'], ['ensuring', 'ensure'], ['distributed', 'distribution'], ['equitably', 'fairly']],
    phrases: ['while ensuring'], minWords: 18
  }
];

const els = {
  question: document.querySelector('#questionText'), prompt: document.querySelector('#promptText'), transcript: document.querySelector('#transcript'),
  feedback: document.querySelector('#feedback'), mic: document.querySelector('#micButton'), replay: document.querySelector('#replayButton'),
  skip: document.querySelector('#skipButton'), zone: document.querySelector('#responseZone'), teacherCard: document.querySelector('.teacher-card'),
  teacherState: document.querySelector('#teacherState'), responseLabel: document.querySelector('#responseLabel'), sideProgress: document.querySelector('#sideProgress'),
  progressLabel: document.querySelector('#progressLabel'), progressPercent: document.querySelector('#progressPercent'), sound: document.querySelector('#soundToggle'),
  form: document.querySelector('#fallbackForm'), typed: document.querySelector('#typedAnswer'), toast: document.querySelector('#toast'),
  section: document.querySelector('.live-dot'), responseTime: document.querySelector('#responseTime'), completeness: document.querySelector('#completeness'),
  precision: document.querySelector('#precision'), sessionScore: document.querySelector('#sessionScore'), repeatPanel: document.querySelector('#repeatPanel'),
  repeatAnswer: document.querySelector('#repeatAnswer'), recordRepeat: document.querySelector('#recordRepeatButton'), replayAnswer: document.querySelector('#replayAnswerButton'),
  confirmRepeat: document.querySelector('#confirmRepeatButton'), next: document.querySelector('#nextButton')
};

let index = 0;
let started = false;
let listening = false;
let soundOn = true;
let speechRate = 1;
let recognition;
let advanceTimer;
let turnReadyAt = 0;
let responseStartedAt = 0;
let scores = [];
let repeatMode = false;
let selectedVoice = null;
let currentAudio = null;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.onstart = () => setListening(true);
  recognition.onend = () => setListening(false);
  recognition.onerror = event => {
    setListening(false);
    const messages = { 'not-allowed': 'マイクが許可されていません。下の入力欄も利用できます。', 'no-speech': '聞き取れませんでした。間を置かず、もう一度答えてください。', 'network': '音声認識に接続できませんでした。' };
    showToast(messages[event.error] || '音声認識をもう一度お試しください。');
  };
  recognition.onresult = event => {
    if (!responseStartedAt) responseStartedAt = Date.now();
    const text = Array.from(event.results).map(result => result[0].transcript).join('');
    showTranscript(text);
    if (event.results[event.results.length - 1].isFinal) {
      if (repeatMode) evaluateRepeat(text);
      else evaluate(text);
    }
  };
}

function normalize(text) {
  return text.toLowerCase().replace(/[.,;:?!“”"]/g, '').replace(/’/g, "'").replace(/\b(is not)\b/g, "isn't").replace(/\b(are not)\b/g, "aren't").replace(/\b(should not)\b/g, "shouldn't").replace(/\s+/g, ' ').trim();
}

function selectNaturalVoice() {
  const voices = speechSynthesis.getVoices().filter(voice => /^en[-_]/i.test(voice.lang));
  const preferred = [
    /Microsoft (Ava|Jenny|Aria|Guy) Online/i,
    /Google (US|UK) English/i,
    /Samantha|Ava|Serena|Daniel|Karen|Moira/i,
    /English.*Natural/i
  ];
  selectedVoice = preferred.map(pattern => voices.find(voice => pattern.test(voice.name))).find(Boolean) || voices[0] || null;
}

if ('speechSynthesis' in window) {
  selectNaturalVoice();
  speechSynthesis.addEventListener('voiceschanged', selectNaturalVoice);
}

function speak(text, onEnd, options = {}) {
  if (!soundOn || !('speechSynthesis' in window)) { if (onEnd) setTimeout(onEnd, 350); return; }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = selectedVoice?.lang || 'en-US';
  utterance.rate = options.rate || speechRate;
  utterance.pitch = 1;
  utterance.voice = selectedVoice;
  utterance.onstart = () => { els.teacherCard.classList.add('speaking'); els.teacherState.textContent = 'SPEAKING'; };
  utterance.onend = () => { els.teacherCard.classList.remove('speaking'); els.teacherState.textContent = 'YOUR TURN'; if (onEnd) onEnd(); };
  utterance.onerror = () => { els.teacherCard.classList.remove('speaking'); if (onEnd) onEnd(); };
  speechSynthesis.speak(utterance);
}

function speakSequence(parts, onEnd) {
  if (!soundOn || !('speechSynthesis' in window)) { if (onEnd) setTimeout(onEnd, 350); return; }
  window.speechSynthesis.cancel();
  let partIndex = 0;
  const playNext = () => {
    if (partIndex >= parts.length) { els.teacherCard.classList.remove('speaking'); if (onEnd) onEnd(); return; }
    const part = parts[partIndex++];
    if (part.pause) { setTimeout(playNext, part.pause); return; }
    const utterance = new SpeechSynthesisUtterance(part.text);
    utterance.lang = selectedVoice?.lang || 'en-US'; utterance.voice = selectedVoice;
    utterance.rate = part.rate || speechRate; utterance.pitch = 1;
    utterance.onstart = () => { els.teacherCard.classList.add('speaking'); els.teacherState.textContent = 'LISTEN'; };
    utterance.onend = playNext;
    utterance.onerror = playNext;
    speechSynthesis.speak(utterance);
  };
  playNext();
}

function audioPath(type) {
  return `audio/${type}${String(index + 1).padStart(2, '0')}.wav`;
}

function playRecorded(type, onEnd) {
  if (!soundOn) { if (onEnd) setTimeout(onEnd, 350); return; }
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  window.speechSynthesis?.cancel();
  const audio = new Audio(audioPath(type));
  currentAudio = audio;
  audio.playbackRate = speechRate;
  audio.onplay = () => { els.teacherCard.classList.add('speaking'); els.teacherState.textContent = type === 'q' ? 'LISTEN' : 'CORRECTION'; };
  audio.onended = () => { els.teacherCard.classList.remove('speaking'); currentAudio = null; if (onEnd) onEnd(); };
  audio.onerror = () => {
    els.teacherCard.classList.remove('speaking'); currentAudio = null;
    if (type === 'q') speakSequence([{ text: lessons[index].question }, { pause: 450 }, { text: lessons[index].question }, { pause: 850 }, { text: lessons[index].prompt }], onEnd);
    else speak(`Correct answer. ${lessons[index].answer}. Repeat.`, onEnd, { rate: Math.max(.82, speechRate - .06) });
  };
  audio.play().catch(() => audio.onerror());
}

function askQuestion() {
  clearTimeout(advanceTimer);
  const lesson = lessons[index];
  repeatMode = false;
  responseStartedAt = 0;
  els.section.innerHTML = `<i></i> ${lesson.section}`;
  els.question.textContent = lesson.question;
  els.prompt.textContent = 'Listen twice. Answer immediately in one complete sentence.';
  els.transcript.textContent = '質問を保持し、指定された書き出しと表現を使って答えてください。';
  els.transcript.classList.remove('has-text');
  els.feedback.hidden = true;
  els.repeatPanel.hidden = true;
  els.responseLabel.textContent = 'YOUR RESPONSE';
  els.responseTime.textContent = '--'; els.completeness.textContent = '--'; els.precision.textContent = '--';
  els.replay.disabled = false; els.skip.disabled = false;
  updateProgress();
  playRecorded('q', () => {
    els.prompt.textContent = `Start immediately: “${lesson.prompt}”`;
    turnReadyAt = Date.now();
    startRecognition();
  });
}

function startLesson() {
  started = true;
  els.mic.classList.add('started');
  els.mic.setAttribute('aria-label', 'マイクを開始または停止する');
  askQuestion();
}

function startRecognition() {
  if (!recognition) { showToast('このブラウザでは音声認識が使えません。下の入力欄をご利用ください。'); els.typed.focus(); return; }
  if (listening) return;
  try { recognition.start(); } catch (_) { /* already starting */ }
}

function setListening(value) {
  listening = value;
  els.zone.classList.toggle('listening', value); els.mic.classList.toggle('listening', value);
  els.teacherState.textContent = value ? 'LISTENING' : 'YOUR TURN';
  els.responseLabel.textContent = value ? 'LISTENING...' : 'YOUR RESPONSE';
}

function showTranscript(text) {
  els.transcript.textContent = `“${text}”`;
  els.transcript.classList.add('has-text');
}

function evaluate(text) {
  const lesson = lessons[index];
  const normalized = normalize(text);
  const words = normalized.split(' ').filter(Boolean);
  if (words.length < 5) {
    els.feedback.hidden = false;
    els.feedback.className = 'feedback';
    els.feedback.innerHTML = `<b>FULL SENTENCE REQUIRED.</b> Not just “${escapeHtml(text)}”<br><span>SAY: ${escapeHtml(lesson.answer)}</span>`;
    els.responseTime.textContent = `${Math.max(0, ((responseStartedAt || Date.now()) - turnReadyAt) / 1000).toFixed(1)}s`;
    els.completeness.textContent = 'NO';
    els.precision.textContent = '--';
    scores.push(35);
    els.sessionScore.textContent = `${Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)}`;
    beginCorrection(text, lesson, false);
    return;
  }
  const conceptHits = lesson.concepts.filter(group => group.some(term => normalized.includes(term)));
  const phraseHits = lesson.phrases.filter(phrase => normalized.includes(phrase));
  const conceptScore = conceptHits.length / lesson.concepts.length;
  const phraseScore = phraseHits.length / lesson.phrases.length;
  const lengthScore = Math.min(words.length / lesson.minWords, 1);
  const delay = Math.max(0, ((responseStartedAt || Date.now()) - turnReadyAt) / 1000);
  const speedScore = delay <= 1.8 ? 1 : delay <= 3.5 ? .82 : delay <= 5.5 ? .62 : .4;
  const total = Math.round((conceptScore * .5 + phraseScore * .25 + lengthScore * .15 + speedScore * .1) * 100);
  const missingConcepts = lesson.concepts.filter(group => !group.some(term => normalized.includes(term))).map(group => group[0]);
  const missingPhrases = lesson.phrases.filter(phrase => !normalized.includes(phrase));
  scores.push(total);

  els.responseTime.textContent = `${delay.toFixed(1)}s`;
  els.completeness.textContent = `${Math.round((conceptScore * .75 + lengthScore * .25) * 100)}%`;
  els.precision.textContent = `${Math.round(phraseScore * 100)}%`;
  els.sessionScore.textContent = `${Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)}`;
  els.feedback.hidden = false;

  if (total >= 82) {
    els.feedback.className = 'feedback good';
    els.feedback.innerHTML = `<b>ACCEPTED · ${total}</b> 内容と指定表現を保持できました。模範文を同じリズムで復唱してください。`;
    beginCorrection(text, lesson, true);
  } else {
    const targets = [...missingPhrases, ...missingConcepts].slice(0, 5);
    els.feedback.className = 'feedback';
    els.feedback.innerHTML = `<b>CORRECTION · ${total}</b> ${escapeHtml(targets.join(' / ') || 'Use a fuller sentence.')}<br><span>SAY: ${escapeHtml(lesson.answer)}</span>`;
    beginCorrection(text, lesson, false);
  }
}

function beginCorrection(userText, lesson, accepted) {
  repeatMode = true;
  els.teacherState.textContent = 'REPEAT';
  els.prompt.textContent = 'Correction → repeat immediately.';
  els.repeatAnswer.textContent = lesson.answer;
  els.repeatPanel.hidden = false;
  els.next.disabled = true;
  playRecorded('a', () => {
    els.teacherState.textContent = 'REPEAT NOW';
  });
}

function evaluateRepeat(text) {
  const target = normalize(lessons[index].answer);
  const spoken = normalize(text);
  const targetWords = [...new Set(target.split(' '))];
  const matched = targetWords.filter(word => spoken.includes(word)).length;
  const accuracy = Math.round(matched / targetWords.length * 100);
  els.responseLabel.textContent = 'REPEAT ACCURACY';
  els.feedback.hidden = false;
  if (accuracy >= 72) {
    els.feedback.className = 'feedback good';
    els.feedback.innerHTML = `<b>REPEAT · ${accuracy}%</b> Good. Keep the corrected pattern.`;
    els.teacherState.textContent = 'REPEATED';
    els.next.disabled = false;
  } else {
    els.feedback.className = 'feedback';
    els.feedback.innerHTML = `<b>TRY AGAIN · ${accuracy}%</b> Hear the model once more, then repeat the whole sentence.`;
    speak(lessons[index].answer, startRecognition, { rate: Math.max(.82, speechRate - .08) });
  }
}

function nextQuestion() {
  if (listening && recognition) recognition.stop();
  if (index < lessons.length - 1) { index += 1; askQuestion(); } else finishLesson();
}

function finishLesson() {
  index = lessons.length;
  updateProgress();
  const average = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  els.question.textContent = `Session complete. Average score: ${average}.`;
  els.prompt.textContent = average >= 82 ? 'Good rhythm. Repeat the session at VERY FAST pace next.' : 'Repeat the corrected answers before increasing the pace.';
  els.transcript.textContent = '高速Q&A、完全な文、即時訂正と復唱のセッションを完了しました。';
  els.feedback.hidden = true; els.teacherState.textContent = 'COMPLETE';
  els.replay.disabled = true; els.skip.disabled = true; els.mic.disabled = true;
  speak(`Excellent work. Your average score is ${average}.`);
}

function updateProgress() {
  const done = Math.min(index, lessons.length);
  const percent = Math.round(done / lessons.length * 100);
  els.sideProgress.style.width = `${percent}%`;
  els.progressLabel.textContent = `${done} / ${lessons.length} questions`;
  els.progressPercent.textContent = `${percent}%`;
}

function toggleMic() {
  if (!started) { startLesson(); return; }
  if (listening && recognition) recognition.stop(); else { turnReadyAt = Date.now(); responseStartedAt = 0; startRecognition(); }
}

function showToast(message) {
  els.toast.textContent = message; els.toast.classList.add('show');
  setTimeout(() => els.toast.classList.remove('show'), 3300);
}

function escapeHtml(text) {
  const div = document.createElement('div'); div.textContent = text; return div.innerHTML;
}

els.mic.addEventListener('click', toggleMic);
els.replay.addEventListener('click', () => playRecorded('q', () => { turnReadyAt = Date.now(); responseStartedAt = 0; startRecognition(); }));
els.skip.addEventListener('click', nextQuestion);
els.sound.addEventListener('click', () => {
  soundOn = !soundOn;
  els.sound.style.opacity = soundOn ? '1' : '.35';
  showToast(soundOn ? '先生の音声をオンにしました。' : '先生の音声をオフにしました。');
  if (!soundOn) {
    speechSynthesis.cancel();
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    els.teacherCard.classList.remove('speaking');
  }
});
document.querySelectorAll('.pace-control button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.pace-control button').forEach(item => item.classList.remove('active'));
  button.classList.add('active'); speechRate = Number(button.dataset.rate); showToast(`話す速度: ${button.textContent}`);
}));
els.form.addEventListener('submit', event => {
  event.preventDefault();
  const value = els.typed.value.trim();
  if (!started) startLesson();
  if (value) { responseStartedAt = Date.now(); showTranscript(value); evaluate(value); els.typed.value = ''; }
});
document.addEventListener('keydown', event => {
  if (event.code === 'Space' && document.activeElement.tagName !== 'INPUT') { event.preventDefault(); toggleMic(); }
});

els.replayAnswer.addEventListener('click', () => playRecorded('a'));
els.recordRepeat.addEventListener('click', () => {
  if (!repeatMode) return;
  els.transcript.textContent = '訂正文をそのまま復唱してください。';
  els.responseLabel.textContent = 'REPEAT RECORDING';
  startRecognition();
});
els.confirmRepeat.addEventListener('click', () => {
  els.teacherState.textContent = 'REPEATED';
  els.confirmRepeat.textContent = 'REPEATED ✓';
  els.next.disabled = false;
});
els.next.addEventListener('click', () => {
  els.confirmRepeat.textContent = 'I REPEATED IT';
  nextQuestion();
});

updateProgress();
