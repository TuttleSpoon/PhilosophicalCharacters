// ==========================================
// 日本語名 → 短縮キー の対応表
// ==========================================
const nameMap = {
  "ヴィトゲンシュタイン": "vit",
  "ギリシア懐疑派": "ske",
  "ヒューム": "hum",
  "ニーチェ": "nie",
  "カント": "kan",
  "アリストテレス": "ari",
  "ソクラテス・プラトン": "pla",// ==========================================
// 日本語名 → 短縮キー の対応表
// ==========================================
const nameMap = {
  "ヴィトゲンシュタイン": "vit",
  "ギリシア懐疑派": "ske",
  "ヒューム": "hum",
  "ニーチェ": "nie",
  "カント": "kan",
  "アリストテレス": "ari",
  "ソクラテス・プラトン": "pla",
  "デカルト": "dec",
  "スピノザ": "spi",
  "ライプニッツ": "lei",
  "ヘーゲル": "heg",
  "アクィナス": "aqu",
  "サルトル": "sar",
  "ハイデガー": "hei",
  "ベルクソン": "ber"
};

// ============================================================
// 以下に診断ロジック（Q1〜Q12）をそのまま置く
// ============================================================

// =============================
// 「選択 → 次へ」方式・一方通行・全12問（複数選択対応・上限あり）
// - Q1 は index.html に静的配置（このファイルでは表示しない）
// - Q2〜Q12 をこのスクリプトで動的表示
// - Q11: 三つまで選択可 / Q12: 五つまで選択可（maxSelect）
// - 最終的なスコアは localStorage("quizScores") に保存して result.html へ遷移
// =============================


// ------------------------------------------------------------
// Q2〜Q12（タイトルにQ番号を決め打ち）
//   - choices[].scores は「哲学者名: 加点」の連想オブジェクト
//   - multiple: true がある質問は複数選択可
//   - maxSelect で選択上限を明示（未指定なら上限なし）
// ------------------------------------------------------------
const questions = [
  {
    question: "Q2. あなたにとって「真理」とは？",
    choices: [
      { text: "理性によって普遍的に到達できるもの", scores: { "カント": 10, "ソクラテス・プラトン": 10, "アリストテレス": 10, "デカルト": 10, "スピノザ": 10, "ライプニッツ": 10, "アクィナス": 10 } },
      { text: "変化し続けるプロセス", scores: { "ヘーゲル": 10, "ベルクソン": 5 } },
      { text: "主観的な立場から構築されるもの", scores: { "サルトル": 10, "ハイデガー": 10 } },
      { text: "真理など存在し得ない（知り得ない）", scores: { "ヴィトゲンシュタイン": 10, "ギリシア懐疑派": 15, "ヒューム": 15, "ニーチェ": 10 } }
    ]
  },
  {
    question: "Q3. 自由についてどう考えますか？",
    choices: [
      { text: "人は本質的に自由である", scores: { "サルトル": 10, "ニーチェ": 10, "ベルクソン": 10 } },
      { text: "社会や制度の中に自由がある", scores: { "カント": 10, "ヘーゲル": 10 } },
      { text: "自由など幻想ではないかと思う", scores: { "ヴィトゲンシュタイン": 10, "スピノザ": 10 } }
    ]
  },
  {
    question: "Q4. 時間の感覚に一番近いのは？",
    choices: [
      { text: "過去→現在→未来という直線的なもの", scores: { "ライプニッツ": 15, "カント": 5 } },
      { text: "永遠に続いていくもの", scores: { "ソクラテス・プラトン": 5, "ニーチェ": 10 } },
      { text: "常に進歩していくもの", scores: { "ヘーゲル": 15 } },
      { text: "常に移ろい変化し続ける流れ", scores: { "ベルクソン": 15, "ヒューム": 10 } },
      { text: "実は「今」しかない", scores: { "サルトル": 10, "デカルト": 10 } }
    ]
  },
  {
    question: "Q5. あなたの価値観に最も近いのは？",
    choices: [
      { text: "知恵を追い求めることに価値がある", scores: { "ソクラテス・プラトン": 10, "アリストテレス": 5 } },
      { text: "個として力強く生きること", scores: { "ニーチェ": 20 } },
      { text: "自分自身で選択し、責任を負うこと", scores: { "サルトル": 10, "ハイデガー": 10 } },
      { text: "疑いを持ちつつ、柔らかく構えること", scores: { "ギリシア懐疑派": 20, "ヒューム": 10 } }
    ]
  },
  {
    question: "Q6. 言葉についてどう思う？",
    choices: [
      { text: "真理を表すための道具である", scores: { "カント": 10, "スピノザ": 10, "ライプニッツ": 10, "アリストテレス": 10, "ハイデガー": 10 } },
      { text: "世界を形づくる構造そのもの", scores: { "ヴィトゲンシュタイン": 20 } },
      { text: "不完全で、誤解と曖昧さに満ちている", scores: { "ギリシア懐疑派": 10, "ベルクソン": 5 } }
    ]
  },
  {
    question: "Q7. どういう世界観がしっくりくる？",
    choices: [
      { text: "理性と秩序で構築された世界", scores: { "カント": 10, "デカルト": 15, "ソクラテス・プラトン": 10, "アリストテレス": 10, "ライプニッツ": 10, "スピノザ": 10 } },
      { text: "意志や力が根底で働く世界", scores: { "ニーチェ": 15, "ヘーゲル": 10, "ベルクソン": 10 } },
      { text: "神が創造した世界", scores: { "アクィナス": 30 } },
      { text: "そもそも世界には確かな意味がない", scores: { "ギリシア懐疑派": 20, "ヴィトゲンシュタイン": 10, "ヒューム": 10, "サルトル": 10, "ハイデガー": 10 } }
    ]
  },
  {
    question: "Q8. 信頼しているのは？",
    choices: [
      { text: "理性", scores: { "デカルト": 10, "カント": 10, "ソクラテス・プラトン": 10, "スピノザ": 10, "ライプニッツ": 10, "ヘーゲル": 5, "アクィナス": 10 } },
      { text: "経験", scores: { "サルトル": 5, "ヒューム": 10, "ベルクソン": 10, "ハイデガー": 10 } }
    ]
  },
  {
    question: "Q9. 得意なのは？",
    choices: [
      { text: "自己の掘り下げ", scores: { "デカルト": 15, "ニーチェ": 10, "サルトル": 10, "ベルクソン": 10 } },
      { text: "世界の探究", scores: { "アリストテレス": 5, "ライプニッツ": 10, "ヘーゲル": 10, "ハイデガー": 20 } }
    ]
  },
  {
    question: "Q10. 重要なのは？",
    choices: [
      { text: "普遍的法則", scores: { "カント": 10, "ソクラテス・プラトン": 10, "スピノザ": 10, "ライプニッツ": 10, "アクィナス": 10, "デカルト": 10, "ヘーゲル": 10 } },
      { text: "個別具体的事象", scores: { "サルトル": 5, "ギリシア懐疑派": 10, "ベルクソン": 5, "ヒューム": 10 } }
    ]
  },
  {
    question: "Q11. 人間の本質は？（三つまで選択可）",
    multiple: true,
    maxSelect: 3, // ← 上限（3つまで）
    choices: [
      { text: "理性", scores: { "ソクラテス・プラトン": 10, "デカルト": 10, "カント": 10, "ライプニッツ": 5, "アクィナス": 10, "スピノザ": 10, "アリストテレス": 10 } },
      { text: "感情", scores: { "ニーチェ": 5, "ヒューム": 10 } },
      { text: "道徳性", scores: { "カント": 5, "アクィナス": 10, "アリストテレス": 10 } },
      { text: "創造性", scores: { "ベルクソン": 10, "サルトル": 10, "ニーチェ": 5 } },
      { text: "社会", scores: { "ヘーゲル": 10, "アリストテレス": 5 } }
    ]
  },
  {
    question: "Q12. 興味や関心があるのは？（五つまで選択可）",
    multiple: true,
    maxSelect: 5, // ← 上限（5つまで）
    choices: [
      { text: "存在とは何か", scores: { "スピノザ": 5, "ハイデガー": 20, "ベルクソン": 5 } },
      { text: "人間の認識の仕組み", scores: { "デカルト": 10, "カント": 5, "ヒューム": 10, "ヴィトゲンシュタイン": 10 } },
      { text: "どう生きるべきか", scores: { "ソクラテス・プラトン": 10, "アリストテレス": 10, "ニーチェ": 10, "サルトル": 10, "スピノザ": 10, "アクィナス": 10, "カント": 5 } },
      { text: "社会・政治・歴史", scores: { "ソクラテス・プラトン": 10, "アリストテレス": 10, "ヘーゲル": 10, "ギリシア懐疑派": 10, "ベルクソン": 5 } },
      { text: "言語や論理", scores: { "アリストテレス": 5, "ヴィトゲンシュタイン": 20, "ライプニッツ": 5, "スピノザ": 5 } }
    ]
  }
];


// ------------------------------------------------------------
// Q1（静的）用のスコア配列（元の数値そのまま）
//   - index.html の Q1 の選択肢（5つ）に対応
//   - 例：q1scores[2] = { "ヒューム":15, "ベルクソン":10, ... }
// ------------------------------------------------------------
const q1scores = [
  { "ソクラテス・プラトン": 15 },
  { "デカルト": 10, "ギリシア懐疑派": 15 },
  { "ヒューム": 15, "ベルクソン": 10, "アリストテレス": 10, "サルトル": 10, "ニーチェ": 5, "ハイデガー": 10 },
  { "ライプニッツ": 15, "ヘーゲル": 10, "カント": 10, "スピノザ": 10, "アクィナス": 10 },
  { "ヴィトゲンシュタイン": 20 }
];


// -------------------------------
// 実行用の状態変数
// -------------------------------
let currentQuestion = 1;          // 1=Q1（静的）。「次へ」で 2=Q2 を動的表示
let scores = {};                  // 哲学者ごとの累計スコア（例：{ "ニーチェ": 35, ... }）
let selectedIndex = null;         // 単一選択の選択中インデックス
let selectedSet = new Set();      // 複数選択の選択中インデックス集合（Q11/Q12で使用）

// DOM参照
const questionText = document.getElementById("questionText");
const choicesContainer = document.getElementById("choicesContainer");
const nextBtn = document.getElementById("nextBtn");


// ============================================================
// Q1（静的）のクリック処理：
//   - Q1 は index.html にすでにボタンが存在するので、そこにイベントを張る
//   - 単一選択として setSelected(idx) を呼ぶ
// ============================================================
choicesContainer.querySelectorAll(".choice").forEach((btn, idx) => {
  btn.addEventListener("click", () => setSelected(idx));
});


// ============================================================
// 「次へ」ボタン：
//   - 未選択なら何もしない
//   - Q1 は q1scores から加点
//   - Q2〜Q12 は質問定義（questions[]）から加点
//   - Q11/Q12 は複数選択のため selectedSet の分だけ繰り返し加点
//   - 全問終了後は localStorage に保存して result.html へ
// ============================================================
nextBtn.addEventListener("click", () => {
  // 未選択ガード：単一選択（selectedIndex）・複数選択（selectedSet）どちらも未選択なら return
  if (selectedIndex === null && selectedSet.size === 0) return;

  // ---------- スコア加算 ----------
  // ※「加算」の考え方（重要）：
  //   choiceScores は { "哲学者名": 加点, ... } の連想オブジェクト。
  //   addScores() はこのオブジェクトを舐めて、scores[哲学者名] に加点していく。
  //   例）選択が「ベルクソン:10, サルトル:10」の場合：
  //       scores["ベルクソン"] += 10
  //       scores["サルトル"] += 10
  //   これを各質問（および複数選択なら選んだ個数分）繰り返し、最終的に最も高い人が結果。
  if (currentQuestion === 1) {
    // Q1（静的・単一選択）
    addScores(q1scores[selectedIndex]);
  } else {
    const q = questions[currentQuestion - 2]; // currentQuestion=2 → questions[0]
    if (q.multiple) {
      // 複数選択：選んだインデックスすべてに対して加点
      selectedSet.forEach(i => addScores(q.choices[i].scores));
    } else {
      // 単一選択
      addScores(q.choices[selectedIndex].scores);
    }
  }

  // ---------- 次の設問へ（Q1→Q2→...→Q12） ----------
  currentQuestion++;
  selectedIndex = null;     // 単一選択の状態をリセット
  selectedSet.clear();      // 複数選択の状態をリセット
  nextBtn.disabled = true;  // 次へは再び無効（何か選んだら有効に）

  // ---------- まだ質問が残っているか？ ----------
  // questions.length = 11（Q2〜Q12）
  // currentQuestion は 1〜12（Q1〜Q12）
  if (currentQuestion <= questions.length + 1) {
    showQuestion(); // Q2〜Q12 の表示
  } else {
   // localStorageにも保存（従来通り）
    localStorage.setItem("quizScores", JSON.stringify(scores));

  // ✅ スコアをURLパラメータに変換（短縮キー対応）
  const params = new URLSearchParams();
  Object.entries(scores).forEach(([jpName, value]) => {
    if (value > 0) {
      // 日本語 → 短縮キー（存在しなければ日本語のまま）
      const shortKey = nameMap[jpName] || jpName;
      params.append(shortKey, value);
    }
  });

  // ✅ 短縮キー付きURLで result.html に遷移
  window.location.href = `result.html?${params.toString()}`;
  } 
  });


// ============================================================
// 質問を表示する関数（Q2〜Q12を表示）
//   - 複数選択（q.multiple=true）の場合、クリックでトグル（ON/OFF）
//   - 上限（q.maxSelect）がある場合は超過を防止（alert表示）
// ============================================================
function showQuestion() {
  const q = questions[currentQuestion - 2]; // Q2なら index 0
  questionText.textContent = q.question;
  choicesContainer.innerHTML = "";

  q.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = choice.text;

    btn.addEventListener("click", () => {
      if (q.multiple) {
        // ====== 複数選択（トグル動作） ======
        if (selectedSet.has(idx)) {
          // すでに選択中 → 解除
          selectedSet.delete(idx);
          btn.classList.remove("selected");
        } else {
          // 未選択 → 上限チェックのうえで追加
          const limit = q.maxSelect || q.choices.length; // maxSelect 未指定なら全選択可
          if (selectedSet.size < limit) {
            selectedSet.add(idx);
            btn.classList.add("selected");
          } else {
            alert(`選択は最大 ${limit} つまでです。`);
          }
        }
        // 「次へ」ボタンは1つ以上選んだら有効化
        nextBtn.disabled = selectedSet.size === 0;

      } else {
        // ====== 単一選択（Q2〜Q10） ======
        setSelected(idx);
      }
    });

    choicesContainer.appendChild(btn);
  });
}


// ============================================================
// 単一選択の見た目＆「次へ」活性制御
//   - クリックしたものだけ .selected を付与し、他は外す
//   - 「次へ」は選択が決まったら有効化
// ============================================================
function setSelected(idx) {
  selectedIndex = idx;
  nextBtn.disabled = false;
  choicesContainer.querySelectorAll(".choice").forEach((b, i) => {
    b.classList.toggle("selected", i === idx);
  });
}


// ============================================================
// スコア加算（点数の合算ロジックの中核）
//   - choiceScores は「{ 哲学者名: 加点 }」という形のオブジェクト
//   - これをキー（哲学者名）ごとに合計する
//   - すでに scores にキーがあれば加算、無ければ 0 初期化のうえ加算
//   - 複数選択ではこの関数を選択肢の数だけ繰り返し呼ぶ
//     例）Q11で 3つ選んだ → 3回 addScores() を呼び、それぞれの哲学者に加点
// ============================================================
function addScores(choiceScores) {
  for (const name in choiceScores) {
    if (!scores[name]) scores[name] = 0;   // 初出の哲学者名は 0 から開始
    scores[name] += choiceScores[name];    // 指定点を合算（累積）
  }
}
  "デカルト": "dec",
  "スピノザ": "spi",
  "ライプニッツ": "lei",
  "ヘーゲル": "heg",
  "アクィナス": "aqu",
  "サルトル": "sar",
  "ハイデガー": "hei",
  "ベルクソン": "ber"
};

// ============================================================
// 以下に診断ロジック（Q1〜Q12）をそのまま置く
// ============================================================

// ↓↓ ここから池田さんの質問ロジック部分をそのままペースト ↓↓

// =============================
// 「選択 → 次へ」方式・一方通行・全12問（複数選択対応・上限あり）
// - Q1 は index.html に静的配置（このファイルでは表示しない）
// - Q2〜Q12 をこのスクリプトで動的表示
// - Q11: 三つまで選択可 / Q12: 五つまで選択可（maxSelect）
// - 最終的なスコアは localStorage("quizScores") に保存して result.html へ遷移
// =============================


// ------------------------------------------------------------
// Q2〜Q12（タイトルにQ番号を決め打ち）
//   - choices[].scores は「哲学者名: 加点」の連想オブジェクト
//   - multiple: true がある質問は複数選択可
//   - maxSelect で選択上限を明示（未指定なら上限なし）
// ------------------------------------------------------------
const questions = [
  {
    question: "Q2. あなたにとって「真理」とは？",
    choices: [
      { text: "理性によって普遍的に到達できるもの", scores: { "カント": 10, "ソクラテス・プラトン": 10, "アリストテレス": 10, "デカルト": 10, "スピノザ": 10, "ライプニッツ": 10, "アクィナス": 10 } },
      { text: "変化し続けるプロセス", scores: { "ヘーゲル": 10, "ベルクソン": 5 } },
      { text: "主観的な立場から構築されるもの", scores: { "サルトル": 10, "ハイデガー": 10 } },
      { text: "真理など存在し得ない（知り得ない）", scores: { "ヴィトゲンシュタイン": 10, "ギリシア懐疑派": 15, "ヒューム": 15, "ニーチェ": 10 } }
    ]
  },
  {
    question: "Q3. 自由についてどう考えますか？",
    choices: [
      { text: "人は本質的に自由である", scores: { "サルトル": 10, "ニーチェ": 10, "ベルクソン": 10 } },
      { text: "社会や制度の中に自由がある", scores: { "カント": 10, "ヘーゲル": 10 } },
      { text: "自由など幻想ではないかと思う", scores: { "ヴィトゲンシュタイン": 10, "スピノザ": 10 } }
    ]
  },
  {
    question: "Q4. 時間の感覚に一番近いのは？",
    choices: [
      { text: "過去→現在→未来という直線的なもの", scores: { "ライプニッツ": 15, "カント": 5 } },
      { text: "永遠に続いていくもの", scores: { "ソクラテス・プラトン": 5, "ニーチェ": 10 } },
      { text: "常に進歩していくもの", scores: { "ヘーゲル": 15 } },
      { text: "常に移ろい変化し続ける流れ", scores: { "ベルクソン": 15, "ヒューム": 10 } },
      { text: "実は「今」しかない", scores: { "サルトル": 10, "デカルト": 10 } }
    ]
  },
  {
    question: "Q5. あなたの価値観に最も近いのは？",
    choices: [
      { text: "知恵を追い求めることに価値がある", scores: { "ソクラテス・プラトン": 10, "アリストテレス": 5 } },
      { text: "個として力強く生きること", scores: { "ニーチェ": 20 } },
      { text: "自分自身で選択し、責任を負うこと", scores: { "サルトル": 10, "ハイデガー": 10 } },
      { text: "疑いを持ちつつ、柔らかく構えること", scores: { "ギリシア懐疑派": 20, "ヒューム": 10 } }
    ]
  },
  {
    question: "Q6. 言葉についてどう思う？",
    choices: [
      { text: "真理を表すための道具である", scores: { "カント": 10, "スピノザ": 10, "ライプニッツ": 10, "アリストテレス": 10, "ハイデガー": 10 } },
      { text: "世界を形づくる構造そのもの", scores: { "ヴィトゲンシュタイン": 20 } },
      { text: "不完全で、誤解と曖昧さに満ちている", scores: { "ギリシア懐疑派": 10, "ベルクソン": 5 } }
    ]
  },
  {
    question: "Q7. どういう世界観がしっくりくる？",
    choices: [
      { text: "理性と秩序で構築された世界", scores: { "カント": 10, "デカルト": 15, "ソクラテス・プラトン": 10, "アリストテレス": 10, "ライプニッツ": 10, "スピノザ": 10 } },
      { text: "意志や力が根底で働く世界", scores: { "ニーチェ": 15, "ヘーゲル": 10, "ベルクソン": 10 } },
      { text: "神が創造した世界", scores: { "アクィナス": 30 } },
      { text: "そもそも世界には確かな意味がない", scores: { "ギリシア懐疑派": 20, "ヴィトゲンシュタイン": 10, "ヒューム": 10, "サルトル": 10, "ハイデガー": 10 } }
    ]
  },
  {
    question: "Q8. 信頼しているのは？",
    choices: [
      { text: "理性", scores: { "デカルト": 10, "カント": 10, "ソクラテス・プラトン": 10, "スピノザ": 10, "ライプニッツ": 10, "ヘーゲル": 5, "アクィナス": 10 } },
      { text: "経験", scores: { "サルトル": 5, "ヒューム": 10, "ベルクソン": 10, "ハイデガー": 10 } }
    ]
  },
  {
    question: "Q9. 得意なのは？",
    choices: [
      { text: "自己の掘り下げ", scores: { "デカルト": 15, "ニーチェ": 10, "サルトル": 10, "ベルクソン": 10 } },
      { text: "世界の探究", scores: { "アリストテレス": 5, "ライプニッツ": 10, "ヘーゲル": 10, "ハイデガー": 20 } }
    ]
  },
  {
    question: "Q10. 重要なのは？",
    choices: [
      { text: "普遍的法則", scores: { "カント": 10, "ソクラテス・プラトン": 10, "スピノザ": 10, "ライプニッツ": 10, "アクィナス": 10, "デカルト": 10, "ヘーゲル": 10 } },
      { text: "個別具体的事象", scores: { "サルトル": 5, "ギリシア懐疑派": 10, "ベルクソン": 5, "ヒューム": 10 } }
    ]
  },
  {
    question: "Q11. 人間の本質は？（三つまで選択可）",
    multiple: true,
    maxSelect: 3, // ← 上限（3つまで）
    choices: [
      { text: "理性", scores: { "ソクラテス・プラトン": 10, "デカルト": 10, "カント": 10, "ライプニッツ": 5, "アクィナス": 10, "スピノザ": 10, "アリストテレス": 10 } },
      { text: "感情", scores: { "ニーチェ": 5, "ヒューム": 10 } },
      { text: "道徳性", scores: { "カント": 5, "アクィナス": 10, "アリストテレス": 10 } },
      { text: "創造性", scores: { "ベルクソン": 10, "サルトル": 10, "ニーチェ": 5 } },
      { text: "社会", scores: { "ヘーゲル": 10, "アリストテレス": 5 } }
    ]
  },
  {
    question: "Q12. 興味や関心があるのは？（五つまで選択可）",
    multiple: true,
    maxSelect: 5, // ← 上限（5つまで）
    choices: [
      { text: "存在とは何か", scores: { "スピノザ": 5, "ハイデガー": 20, "ベルクソン": 5 } },
      { text: "人間の認識の仕組み", scores: { "デカルト": 10, "カント": 5, "ヒューム": 10, "ヴィトゲンシュタイン": 10 } },
      { text: "どう生きるべきか", scores: { "ソクラテス・プラトン": 10, "アリストテレス": 10, "ニーチェ": 10, "サルトル": 10, "スピノザ": 10, "アクィナス": 10, "カント": 5 } },
      { text: "社会・政治・歴史", scores: { "ソクラテス・プラトン": 10, "アリストテレス": 10, "ヘーゲル": 10, "ギリシア懐疑派": 10, "ベルクソン": 5 } },
      { text: "言語や論理", scores: { "アリストテレス": 5, "ヴィトゲンシュタイン": 20, "ライプニッツ": 5, "スピノザ": 5 } }
    ]
  }
];


// ------------------------------------------------------------
// Q1（静的）用のスコア配列（元の数値そのまま）
//   - index.html の Q1 の選択肢（5つ）に対応
//   - 例：q1scores[2] = { "ヒューム":15, "ベルクソン":10, ... }
// ------------------------------------------------------------
const q1scores = [
  { "ソクラテス・プラトン": 15 },
  { "デカルト": 10, "ギリシア懐疑派": 15 },
  { "ヒューム": 15, "ベルクソン": 10, "アリストテレス": 10, "サルトル": 10, "ニーチェ": 5, "ハイデガー": 10 },
  { "ライプニッツ": 15, "ヘーゲル": 10, "カント": 10, "スピノザ": 10, "アクィナス": 10 },
  { "ヴィトゲンシュタイン": 20 }
];


// -------------------------------
// 実行用の状態変数
// -------------------------------
let currentQuestion = 1;          // 1=Q1（静的）。「次へ」で 2=Q2 を動的表示
let scores = {};                  // 哲学者ごとの累計スコア（例：{ "ニーチェ": 35, ... }）
let selectedIndex = null;         // 単一選択の選択中インデックス
let selectedSet = new Set();      // 複数選択の選択中インデックス集合（Q11/Q12で使用）

// DOM参照
const questionText = document.getElementById("questionText");
const choicesContainer = document.getElementById("choicesContainer");
const nextBtn = document.getElementById("nextBtn");


// ============================================================
// Q1（静的）のクリック処理：
//   - Q1 は index.html にすでにボタンが存在するので、そこにイベントを張る
//   - 単一選択として setSelected(idx) を呼ぶ
// ============================================================
choicesContainer.querySelectorAll(".choice").forEach((btn, idx) => {
  btn.addEventListener("click", () => setSelected(idx));
});


// ============================================================
// 「次へ」ボタン：
//   - 未選択なら何もしない
//   - Q1 は q1scores から加点
//   - Q2〜Q12 は質問定義（questions[]）から加点
//   - Q11/Q12 は複数選択のため selectedSet の分だけ繰り返し加点
//   - 全問終了後は localStorage に保存して result.html へ
// ============================================================
nextBtn.addEventListener("click", () => {
  // 未選択ガード：単一選択（selectedIndex）・複数選択（selectedSet）どちらも未選択なら return
  if (selectedIndex === null && selectedSet.size === 0) return;

  // ---------- スコア加算 ----------
  // ※「加算」の考え方（重要）：
  //   choiceScores は { "哲学者名": 加点, ... } の連想オブジェクト。
  //   addScores() はこのオブジェクトを舐めて、scores[哲学者名] に加点していく。
  //   例）選択が「ベルクソン:10, サルトル:10」の場合：
  //       scores["ベルクソン"] += 10
  //       scores["サルトル"] += 10
  //   これを各質問（および複数選択なら選んだ個数分）繰り返し、最終的に最も高い人が結果。
  if (currentQuestion === 1) {
    // Q1（静的・単一選択）
    addScores(q1scores[selectedIndex]);
  } else {
    const q = questions[currentQuestion - 2]; // currentQuestion=2 → questions[0]
    if (q.multiple) {
      // 複数選択：選んだインデックスすべてに対して加点
      selectedSet.forEach(i => addScores(q.choices[i].scores));
    } else {
      // 単一選択
      addScores(q.choices[selectedIndex].scores);
    }
  }

  // ---------- 次の設問へ（Q1→Q2→...→Q12） ----------
  currentQuestion++;
  selectedIndex = null;     // 単一選択の状態をリセット
  selectedSet.clear();      // 複数選択の状態をリセット
  nextBtn.disabled = true;  // 次へは再び無効（何か選んだら有効に）

  // ---------- まだ質問が残っているか？ ----------
  // questions.length = 11（Q2〜Q12）
  // currentQuestion は 1〜12（Q1〜Q12）
  if (currentQuestion <= questions.length + 1) {
    showQuestion(); // Q2〜Q12 の表示
  } else {
   // localStorageにも保存（従来通り）
    localStorage.setItem("quizScores", JSON.stringify(scores));

  // ✅ スコアをURLパラメータに変換（短縮キー対応）
  const params = new URLSearchParams();
  Object.entries(scores).forEach(([jpName, value]) => {
    if (value > 0) {
      // 日本語 → 短縮キー（存在しなければ日本語のまま）
      const shortKey = nameMap[jpName] || jpName;
      params.append(shortKey, value);
    }
  });

  // ✅ 短縮キー付きURLで result.html に遷移
  window.location.href = `result.html?${params.toString()}`;
  } 
  });


// ============================================================
// 質問を表示する関数（Q2〜Q12を表示）
//   - 複数選択（q.multiple=true）の場合、クリックでトグル（ON/OFF）
//   - 上限（q.maxSelect）がある場合は超過を防止（alert表示）
// ============================================================
function showQuestion() {
  const q = questions[currentQuestion - 2]; // Q2なら index 0
  questionText.textContent = q.question;
  choicesContainer.innerHTML = "";

  q.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = choice.text;

    btn.addEventListener("click", () => {
      if (q.multiple) {
        // ====== 複数選択（トグル動作） ======
        if (selectedSet.has(idx)) {
          // すでに選択中 → 解除
          selectedSet.delete(idx);
          btn.classList.remove("selected");
        } else {
          // 未選択 → 上限チェックのうえで追加
          const limit = q.maxSelect || q.choices.length; // maxSelect 未指定なら全選択可
          if (selectedSet.size < limit) {
            selectedSet.add(idx);
            btn.classList.add("selected");
          } else {
            alert(`選択は最大 ${limit} つまでです。`);
          }
        }
        // 「次へ」ボタンは1つ以上選んだら有効化
        nextBtn.disabled = selectedSet.size === 0;

      } else {
        // ====== 単一選択（Q2〜Q10） ======
        setSelected(idx);
      }
    });

    choicesContainer.appendChild(btn);
  });
}


// ============================================================
// 単一選択の見た目＆「次へ」活性制御
//   - クリックしたものだけ .selected を付与し、他は外す
//   - 「次へ」は選択が決まったら有効化
// ============================================================
function setSelected(idx) {
  selectedIndex = idx;
  nextBtn.disabled = false;
  choicesContainer.querySelectorAll(".choice").forEach((b, i) => {
    b.classList.toggle("selected", i === idx);
  });
}


// ============================================================
// スコア加算（点数の合算ロジックの中核）
//   - choiceScores は「{ 哲学者名: 加点 }」という形のオブジェクト
//   - これをキー（哲学者名）ごとに合計する
//   - すでに scores にキーがあれば加算、無ければ 0 初期化のうえ加算
//   - 複数選択ではこの関数を選択肢の数だけ繰り返し呼ぶ
//     例）Q11で 3つ選んだ → 3回 addScores() を呼び、それぞれの哲学者に加点
// ============================================================
function addScores(choiceScores) {
  for (const name in choiceScores) {
    if (!scores[name]) scores[name] = 0;   // 初出の哲学者名は 0 から開始
    scores[name] += choiceScores[name];    // 指定点を合算（累積）
  }
}
