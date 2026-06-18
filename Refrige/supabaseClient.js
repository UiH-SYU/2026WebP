const SUPABASE_URL = "https://cusuqrawykjcxziupovi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1c3VxcmF3eWtqY3h6aXVwb3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxOTUyMzcsImV4cCI6MjA5Mjc3MTIzN30.UYST5NTS1mR3HDnYU8qNnvTvWgJt72guuKuUxpbpHzk";

if (!window.supabase) {
  alert("Supabase 라이브러리를 불러오지 못했습니다. script 순서를 확인해주세요.");
  throw new Error("Supabase library is not loaded.");
}

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);