"use client";

const ACCENT = "#39ff14";
const TEXT_MESSAGE =
  "Hi Frankie, I'm reaching out so we can connect and work on making change easier.";

const contact = {
  firstName: "Frankie",
  lastName: "Carioti",
  title: "Change Agent",
  company: "Carioti Properties",
  phoneDisplay: "312.292.1119",
  phoneDial: "+13122921119",
  email: "frank@cariotiproperties.com",
  websites: [
    "https://www.prairiefoodservices.com/",
    "https://www.cariotiproperties.com/",
  ],
};

const createVCard = () => {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${contact.lastName};${contact.firstName};;;`,
    `FN:${contact.firstName} ${contact.lastName}`,
    `ORG:${contact.company}`,
    `TITLE:${contact.title}`,
    `TEL;TYPE=CELL,VOICE:${contact.phoneDial}`,
    `EMAIL;TYPE=INTERNET:${contact.email}`,
  ];

  contact.websites.forEach((url) => {
    lines.push(`URL:${url}`);
  });

  lines.push("NOTE:Making Change Easy", "END:VCARD");

  return lines.join("\r\n");
};

const downloadFile = (content: string, filename: string, mime: string) => {
  // Return a promise so callers can wait for the download to be initiated
  return new Promise<void>((resolve) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Keep the object URL and link in the DOM for a short time to ensure the browser
    // has time to start the download, then clean up and resolve.
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      resolve();
    }, 700);
  });
};

const openTextMessageThread = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return;
  }

  const userAgent = navigator.userAgent || "";
  const isIOS =
    /iPad|iPhone|iPod/.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const separator = isIOS ? "&" : "?";
  const smsUrl = `sms:${contact.phoneDial}${separator}body=${encodeURIComponent(
    TEXT_MESSAGE
  )}`;

  window.location.assign(smsUrl);
};

export default function Home() {
  const handleSaveAssets = async () => {
    // Wait until the download has been initiated and cleaned up
    await downloadFile(
      createVCard(),
      "frankie-carioti.vcf",
      "text/vcard;charset=utf-8"
    );

    // Prompt the user before opening Messages so they can confirm
    if (typeof window !== "undefined") {
      const open = window.confirm(
        "Contact saved. Open Messages to send a text to Frankie?"
      );

      if (open) {
        openTextMessageThread();
      }
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent px-4 py-12 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
      >
        <div className="absolute left-8 top-16 h-64 w-64 rounded-full bg-[rgba(57,255,20,0.2)] blur-[120px]" />
        <div className="absolute bottom-8 right-6 h-48 w-48 rounded-full bg-[rgba(0,0,0,0.6)] blur-[100px]" />
      </div>

      <section className="relative w-full max-w-sm">
        <div className="absolute -inset-0.5 rounded-[32px] bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-80 blur-2xl" />
        <div className="relative overflow-hidden rounded-[32px] border border-white/15 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),rgba(26,30,34,0.95))] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
          <div className="absolute inset-0 rounded-[32px] border border-white/5" />
          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <p
                className="text-xs font-semibold uppercase tracking-[0.55em]"
                style={{ color: ACCENT }}
              >
                Making Change Easy
              </p>
              <h1 className="text-4xl font-semibold leading-none text-white drop-shadow-lg">
                Real Estate
              </h1>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleSaveAssets}
                className="save-contact-jiggle inline-flex w-full items-center justify-center rounded-2xl border border-[rgba(57,255,20,0.75)] bg-[rgba(57,255,20,0.12)] px-6 py-4 text-lg font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),_0_15px_25px_rgba(0,0,0,0.45)] transition hover:scale-[1.02] hover:bg-[rgba(57,255,20,0.18)]"
              >
                Save contact & text Frankie
              </button>
            </div>

            <footer className="mt-2 border-t border-white/10 pt-4 text-center text-xs text-white/70">
              <p>Built in America, on earth.</p>
              <p className="mt-1 italic text-white/60">
                Making relationships built to last, the American Way.
              </p>
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
}
