// Server component — fetches a random verse on each page load

const VERSES = [
  "john+3:16",
  "philippians+4:13",
  "jeremiah+29:11",
  "psalm+23:1",
  "romans+8:28",
  "isaiah+40:31",
  "proverbs+3:5-6",
  "matthew+6:33",
  "hebrews+11:1",
  "psalm+46:1",
];

interface BibleApiResponse {
  reference: string;
  text: string;
}

async function fetchVerse(): Promise<{ reference: string; text: string }> {
  const verse = VERSES[Math.floor(Math.random() * VERSES.length)];
  try {
    const res = await fetch(`https://bible-api.com/${verse}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("API error");
    const data: BibleApiResponse = await res.json();
    return {
      reference: data.reference,
      text: data.text.replace(/\n/g, " ").trim(),
    };
  } catch {
    return {
      reference: "John 3:16",
      text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    };
  }
}

export default async function BibleVerse() {
  const { reference, text } = await fetchVerse();

  return (
    <div className="text-center px-4 py-2">
      <p className="text-cyan-400 text-sm italic max-w-2xl mx-auto">
        &ldquo;{text}&rdquo;
      </p>
      <p className="text-cyan-600 text-xs mt-1 font-semibold">{reference}</p>
    </div>
  );
}
