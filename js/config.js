/* -------------------------------------------------------------------------- */
/* FREQ/ARCH — Backend configuration                                          */
/*                                                                            */
/* Leave these blank to run in LOCAL mode: comments, archive submissions and  */
/* votes are saved in each visitor's own browser (localStorage).              */
/*                                                                            */
/* To make submissions SHARED across all visitors, create a free Supabase     */
/* project (https://supabase.com), run the SQL in SUPABASE.md, then paste     */
/* your project URL and public "anon" key below. That's it — the site         */
/* upgrades to a shared community wall automatically.                         */
/*                                                                            */
/* The anon key is designed to be public (row-level security protects your    */
/* data), so it is safe to commit this file.                                  */
/* -------------------------------------------------------------------------- */

window.FREQARCH_CONFIG = {
    supabaseUrl: '',      // e.g. "https://abcdefgh.supabase.co"
    supabaseAnonKey: ''   // e.g. "eyJhbGciOiJIUzI1NiIsInR..."
};
