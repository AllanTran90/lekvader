import { useState, useRef, useEffect } from "react";
import { CloudRain, Sun, Cloud, CloudSnow, Home, TreePine, Layers, Dices, Sparkles, Send } from "lucide-react";

// ---------- Data ----------

const INNE = [
  { t: "Kuddfort", d: "Bygg ett fort av kuddar, filtar och stolar. Krypa in och ha en fikapaus inuti.", min: 2, max: 8 },
  { t: "Skattjakt inomhus", d: "Göm små saker i lägenheten/huset och gör enkla ledtrådar för att hitta dem.", min: 3, max: 9 },
  { t: "Danstävling", d: "Sätt på musik och ha en dans-stopp-lek — dansa tills musiken tystnar, då fryser alla.", min: 2, max: 10 },
  { t: "Måla med vattenfärg", d: "Plocka fram papper och vattenfärger, låt fantasin flöda på köksbordet.", min: 2, max: 10 },
  { t: "Inomhusbowling", d: "Ställ upp PET-flaskor eller leksaker på rad och kasta en mjuk boll för att välta dem.", min: 3, max: 8 },
  { t: "Sagostund med rollspel", d: "Läs en bok och låt barnen agera ut karaktärerna efteråt.", min: 2, max: 7 },
  { t: "Bygg med lego/klossar", d: "Ge ett tema, t.ex. 'bygg det högsta tornet' eller 'bygg ett djur'.", min: 2, max: 10 },
  { t: "Ballongvolleyboll", d: "Spänn ett snöre mellan två stolar och spela volleyboll med en ballong — svårt att göra illa sig på.", min: 3, max: 10 },
  { t: "Pyssla med återvinning", d: "Gör robotar eller djur av toarullar, mjölkkartonger och tejp.", min: 3, max: 9 },
  { t: "Simon says / Följa John", d: "Klassisk lek där barnen bara gör rörelser om du säger 'Simon says' först.", min: 3, max: 8 },
];

const UTE = [
  { t: "Lekplatsbesök", d: "Klassisk runda på närmaste lekplats — gungor, rutschkana och klätterställning.", min: 1, max: 8 },
  { t: "Pölhoppning", d: "Ta på stövlar och hoppa i vattenpölar efter regnet.", min: 2, max: 7 },
  { t: "Kastanjesamling", d: "Samla kastanjer, ekollon och löv och gör konst av det hemma sen.", min: 2, max: 8 },
  { t: "Cykel- eller sparkcykeltur", d: "Kort runda i närområdet, gärna med ett mål som en glasspaus eller lekpark.", min: 3, max: 10 },
  { t: "Naturbingo", d: "Gör en enkel bingobricka (fågel, sten, rött löv, kotte) att leta efter på promenaden.", min: 3, max: 9 },
  { t: "Snöänglar & snögubbe", d: "När snön kommer — gör snöänglar eller bygg en snögubbe tillsammans.", min: 2, max: 10 },
  { t: "Kottkastning", d: "Ställ upp en hink eller rita en ring och tävla i att kasta kottar i mål.", min: 3, max: 8 },
  { t: "Utflykt till skogen", d: "Kort skogspromenad med fokus på att klättra på stenar och gå på stockar.", min: 2, max: 9 },
];

const KORT = [
  { t: "Kort-Memory", d: "Lägg ut ett vanligt kortlek nedvänt och matcha par. Enkelt att anpassa svårighet efter ålder.", min: 3, max: 8 },
  { t: "Svarte Petter", d: "Klassiskt parbildningsspel där den som sitter kvar med Svarte Petter förlorar.", min: 4, max: 10 },
  { t: "Kasino", d: "Enkelt insamlingsspel med vanlig kortlek, bra för att öva siffror.", min: 5, max: 12 },
  { t: "Fyra i rad (kort)", d: "Lägg ut korten i rader efter färg eller nummer — ett enkelt mönsterspel för de yngsta.", min: 3, max: 6 },
  { t: "Öser", d: "Snabbt och enkelt kortspel där man samlar par genom att lägga korten snabbt.", min: 4, max: 9 },
  { t: "Spänn (Slap)", d: "Lägg ut kort i tur och ordning, den som är snabbast att slå på ett par vinner högen.", min: 5, max: 11 },
  { t: "Gissa kortet", d: "Ett barn drar ett kort utan att titta och håller det mot pannan — övriga ger ledtrådar.", min: 4, max: 10 },
];

const BRADSPEL = [
  { t: "Fia med knuff", d: "Svensk klassiker för hela familjen, tärningsbaserat och enkelt att lära.", min: 4, max: 12 },
  { t: "Bondens marknad / Djurmemory", d: "Bildbaserade memoryspel för de yngsta barnen.", min: 2, max: 6 },
  { t: "Yatzy", d: "Tärningsspel med enkla regler för äldre barn, kan förenklas för yngre.", min: 6, max: 12 },
  { t: "Alfapet Junior / Bildlotto", d: "Enkla ord- och bildspel som tränar språk och igenkänning.", min: 3, max: 7 },
  { t: "Jenga", d: "Bygg ett torn av klossar och dra ut en i taget utan att det rasar.", min: 4, max: 10 },
  { t: "Fyra i rad", d: "Släpp brickor i en ställning och försök få fyra i rad före motståndaren.", min: 5, max: 12 },
  { t: "Twister", d: "Rörelsespel som får hela familjen att skratta och röra på sig inomhus.", min: 4, max: 12 },
  { t: "Kimlek / Minneslek med föremål", d: "Lägg ut föremål på en bricka, täck över, och gissa vad som saknas.", min: 3, max: 8 },
];

const WEATHER_OPTIONS = [
  { key: "sol", label: "Klart", Icon: Sun, bad: false, temp: 12 },
  { key: "molnigt", label: "Molnigt", Icon: Cloud, bad: false, temp: 8 },
  { key: "regn", label: "Regn", Icon: CloudRain, bad: true, temp: 6 },
  { key: "sno", label: "Snö", Icon: CloudSnow, bad: true, temp: -2 },
  { key: "kallt", label: "Kallt & klart", Icon: Sun, bad: true, temp: 1 },
];

// ---------- UI pieces ----------

function ActivityCard({ item }) {
  return (
    <div
      className="min-w-[220px] max-w-[220px] rounded-2xl p-4 flex-shrink-0"
      style={{ background: "#22314F", border: "1px solid #33456A" }}
    >
      <h3 className="text-[15px] font-semibold mb-1" style={{ color: "#F5EFE0", fontFamily: "'Baloo 2', sans-serif" }}>
        {item.t}
      </h3>
      <p className="text-[13px] leading-snug mb-3" style={{ color: "#B7C4DA" }}>
        {item.d}
      </p>
      <span
        className="text-[11px] px-2 py-1 rounded-full"
        style={{ background: "#F0A73C22", color: "#F0A73C" }}
      >
        {item.min}–{item.max} år
      </span>
    </div>
  );
}

function Section({ title, Icon, items, accent }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Icon size={18} style={{ color: accent }} />
        <h2 className="text-[16px] font-semibold" style={{ color: "#F5EFE0", fontFamily: "'Baloo 2', sans-serif" }}>
          {title}
        </h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 px-1" style={{ scrollbarWidth: "thin" }}>
        {items.map((it, i) => (
          <ActivityCard key={i} item={it} />
        ))}
      </div>
    </div>
  );
}

function AiChat({ age, weatherLabel }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const systemPrompt = `Du är en varm och praktisk assistent i en app för barnfamiljer som ger förslag på lekar, aktiviteter, kortlek och brädspel.
Kontext just nu: barnets ålder är ${age} år, vädret är valt till "${weatherLabel}".
Föräldern kan berätta om begränsningar (tid, material, plats, energi) eller be om fler idéer utöver de färdiga listorna i appen.
Ge 2-4 konkreta, korta förslag anpassade efter kontexten. Svara alltid på svenska, i en vänlig och praktisk ton, utan onödig inledning. Använd korta stycken eller punktlistor.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMessages.map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      const data = await response.json();
      const replyText = (data.content || [])
        .map((c) => (c.type === "text" ? c.text : ""))
        .filter(Boolean)
        .join("\n");
      setMessages((prev) => [...prev, { role: "assistant", text: replyText || "Hmm, fick inget svar. Försök igen." }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Kunde inte nå AI:n just nu. Försök igen om en stund." }]);
    }
    setLoading(false);
  };

  return (
    <div
      className="rounded-2xl p-4 mb-8"
      style={{ background: "#1B2A45", border: "1px solid #2C3E60" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={18} style={{ color: "#F0A73C" }} />
        <h2 className="text-[16px] font-semibold" style={{ color: "#F5EFE0", fontFamily: "'Baloo 2', sans-serif" }}>
          Fråga AI om fler förslag
        </h2>
      </div>
      <p className="text-[12px] mb-3" style={{ color: "#8A9BB8" }}>
        Berätta om begränsningar, t.ex. "vi har bara 10 minuter" eller "inget pyssel hemma" — få förslag utöver listorna ovan.
      </p>

      {messages.length > 0 && (
        <div
          ref={scrollRef}
          className="flex flex-col gap-2 mb-3 max-h-64 overflow-y-auto pr-1"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className="rounded-xl px-3 py-2 text-[13px] whitespace-pre-wrap"
              style={{
                background: m.role === "user" ? "#2C3E60" : "#22314F",
                color: m.role === "user" ? "#F5EFE0" : "#D8E0EE",
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
              }}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div
              className="rounded-xl px-3 py-2 text-[13px]"
              style={{ background: "#22314F", color: "#8A9BB8", alignSelf: "flex-start" }}
            >
              Tänker…
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Skriv en fråga eller begränsning…"
          className="flex-1 bg-transparent outline-none text-[13px] px-3 py-2 rounded-xl"
          style={{ color: "#F5EFE0", border: "1px solid #2C3E60" }}
        />
        <button
          onClick={send}
          disabled={loading}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#F0A73C", opacity: loading ? 0.5 : 1 }}
        >
          <Send size={15} style={{ color: "#141F35" }} />
        </button>
      </div>
    </div>
  );
}

// ---------- Main app ----------

export default function FamilyActivityApp() {
  const [age, setAge] = useState(4);
  const [weatherKey, setWeatherKey] = useState("regn");

  const weather = WEATHER_OPTIONS.find((w) => w.key === weatherKey);
  const showIndoor = weather.bad;
  const showOutdoor = !weather.bad;

  const byAge = (arr) => arr.filter((a) => age >= a.min && age <= a.max);

  return (
    <div className="min-h-screen w-full flex justify-center" style={{ background: "#141F35" }}>
      <div className="w-full max-w-md px-4 py-6">
        {/* Header */}
        <div className="mb-5 px-1">
          <h1
            className="text-[22px] font-bold"
            style={{ color: "#F5EFE0", fontFamily: "'Baloo 2', sans-serif" }}
          >
            Vad ska vi hitta på idag?
          </h1>
          <p className="text-[13px]" style={{ color: "#8A9BB8" }}>
            Lekförslag anpassade efter väder och ålder
          </p>
        </div>

        {/* Weather picker */}
        <div
          className="rounded-2xl p-3 mb-3"
          style={{ background: "#1B2A45", border: "1px solid #2C3E60" }}
        >
          <p className="text-[12px] mb-2 px-1" style={{ color: "#8A9BB8" }}>
            Välj dagens väder
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {WEATHER_OPTIONS.map((w) => (
              <button
                key={w.key}
                onClick={() => setWeatherKey(w.key)}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl flex-shrink-0"
                style={{
                  background: weatherKey === w.key ? "#F0A73C22" : "transparent",
                  border: weatherKey === w.key ? "1px solid #F0A73C" : "1px solid #2C3E60",
                }}
              >
                <w.Icon size={20} style={{ color: weatherKey === w.key ? "#F0A73C" : "#8A9BB8" }} />
                <span className="text-[11px]" style={{ color: weatherKey === w.key ? "#F5EFE0" : "#8A9BB8" }}>
                  {w.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Weather card */}
        <div
          className="rounded-3xl p-5 mb-5 flex items-center gap-3"
          style={{
            background: "linear-gradient(135deg, #1E2C4A, #263A61)",
            border: "1px solid #33456A",
          }}
        >
          <weather.Icon size={36} style={{ color: "#F0A73C" }} />
          <div>
            <p className="text-[26px] font-bold leading-none" style={{ color: "#F5EFE0", fontFamily: "'Baloo 2', sans-serif" }}>
              {weather.temp}°
            </p>
            <p className="text-[13px]" style={{ color: "#B7C4DA" }}>{weather.label}</p>
          </div>
        </div>

        {/* Age selector */}
        <div
          className="rounded-2xl p-4 mb-6 flex items-center justify-between"
          style={{ background: "#1B2A45", border: "1px solid #2C3E60" }}
        >
          <span className="text-[14px]" style={{ color: "#B7C4DA" }}>Barnets ålder</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAge((a) => Math.max(1, a - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[16px]"
              style={{ background: "#2C3E60", color: "#F5EFE0" }}
            >
              −
            </button>
            <span className="text-[16px] font-semibold w-6 text-center" style={{ color: "#F0A73C" }}>
              {age}
            </span>
            <button
              onClick={() => setAge((a) => Math.min(12, a + 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[16px]"
              style={{ background: "#2C3E60", color: "#F5EFE0" }}
            >
              +
            </button>
          </div>
        </div>

        {/* Weather-dependent hint */}
        <p className="text-[12px] mb-4 px-1" style={{ color: "#8A9BB8" }}>
          {showIndoor
            ? "Passar bra för inomhusdagar — här är förslag på lekar hemma."
            : "Fint väder ute — perfekt för lekplats eller utomhuslek!"}
        </p>

        {/* Sections */}
        {showIndoor && (
          <Section title="Lek inomhus" Icon={Home} items={byAge(INNE)} accent="#F0A73C" />
        )}
        {showOutdoor && (
          <Section title="Utomhus & lekplatser" Icon={TreePine} items={byAge(UTE)} accent="#7FC29B" />
        )}
        <Section title="Enkla kortlekar" Icon={Layers} items={byAge(KORT)} accent="#E27D8E" />
        <Section title="Brädspel" Icon={Dices} items={byAge(BRADSPEL)} accent="#7DA6E2" />

        <AiChat age={age} weatherLabel={weather.label} />
      </div>
    </div>
  );
}
