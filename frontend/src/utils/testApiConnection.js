export async function testApiConnection() {
  try {
    const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: process.env.REACT_APP_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
      },
    });

    if (response.ok) {
      console.log("✅ API backend (Supabase) conectada correctamente");
    } else {
      console.error("❌ API backend respondió con error:", response.status);
    }
  } catch (error) {
    console.error("❌ Error de conexión con API backend:", error);
  }
}
