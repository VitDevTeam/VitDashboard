import { emojify } from "node-emoji"



export function emojiToURL(e) {
    const m = e.match(/^<(?:(a)?):\w+:(\d+)>$/);
    if (m) return `https://cdn.discordapp.com/emojis/${m[2]}.${m[1] ? "gif" : "png"}`;
    
    const u = emoji.emojify(e);
    if (u !== e && emoji.hasEmoji(u)) e = u; // shortcode -> unicode
    
    if (/[^\u0000-\u007F]/.test(e))
      return `https://twemoji.maxcdn.com/v/latest/72x72/${[...e].map(c=>c.codePointAt(0).toString(16)).join("-")}.png`;
    
    return null;
  }
  
