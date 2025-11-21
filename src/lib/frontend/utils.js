import emojiData from 'emoji-datasource'; 


const SHORTCODE_TO_UNICODE = {};


for (const emoji of emojiData) {

  if (emoji.short_names && emoji.unified) {
    
    const unicodeChars = emoji.unified
      .split('-')                       
      .map(u => String.fromCodePoint(parseInt(u, 16)))
      .join('');
    

    for (const name of emoji.short_names) {
      SHORTCODE_TO_UNICODE[`:${name}:`] = unicodeChars;
    }
  }
}

/*
 
  1. Discord custom emojis: <:name:id> or <a:name:id>
  2. Shortcodes: :smile:, :bread:, ...
  3. Unicode emojis: 🍞, 😄, 👨‍👩‍👧‍👦
 */
export function emojiToURL(e) {
  if (!e) return null; // 

  // Check Discord custom emoji 
  const discordMatch = e.match(/^<(?:(a)?):\w+:(\d+)>$/);
  if (discordMatch) {
    const isAnimated = discordMatch[1]; // 'a' if animated
    const id = discordMatch[2];
    const ext = isAnimated ? "gif" : "png";
    return `https://cdn.discordapp.com/emojis/${id}.${ext}`;
  }

  // shortcode
  if (SHORTCODE_TO_UNICODE[e]) {
    e = SHORTCODE_TO_UNICODE[e]; // convert :smile: -> 😄
  }

  // unicode
  if (/[^\u0000-\u007F]/.test(e)) {
    // Convert emoji to codepoints for Twemoji CDN
    const codepoints = Array.from(e)
      .map(c => c.codePointAt(0).toString(16))
      .join("-");
    return `https://twemoji.maxcdn.com/v/latest/72x72/${codepoints}.png`;
  }

  // Unknown or plain text
  return null;
}
