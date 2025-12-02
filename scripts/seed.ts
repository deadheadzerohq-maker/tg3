import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

async function run() {
  const corridors = [
    { code: "I-80_WY-NE", name: "I-80 WY → NE", region: "Mountain" },
    { code: "LAX-DFW", name: "LAX → DFW", region: "SoCal" },
    { code: "I-95_NJ-CT", name: "I-95 NJ → CT", region: "Northeast" },
  ];
  await supabase.from("corridors").upsert(corridors, { onConflict: "code" });
  console.log("Seeded corridors", corridors.length);
}

run();
