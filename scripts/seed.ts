import { createClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv } from "../lib/env";

const supabase = createClient(publicEnv.supabaseUrl, serverEnv.supabaseServiceRoleKey);

async function seed() {
  const { error } = await supabase.from("corridors").insert([
    {
      code: "I-40_TX-NM",
      name: "I-40 Amarillo to Albuquerque",
      region: "Southwest",
      description: "High plains to high desert corridor",
    },
    {
      code: "I-80_WY-NE",
      name: "I-80 Wyoming to Nebraska",
      region: "Mountain",
      description: "Mountain passes and plains transition",
    },
  ]);

  if (error) {
    console.error(error);
  } else {
    console.log("Seeded corridors");
  }
}

seed();
