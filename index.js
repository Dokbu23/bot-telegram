require("dotenv").config();
const { Bot, InlineKeyboard, Keyboard } = require("grammy");
const express = require("express");

// Check if BOT_TOKEN exists
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN || BOT_TOKEN === "123456789:ABCdefGHIjklMNOpqrsTUVwxyZ") {
  console.error("❌ ERROR: Walang BOT_TOKEN na nahanap sa .env file!");
  console.error("Kumuha ng token sa Telegram @BotFather at ilagay sa .env file bilang BOT_TOKEN=your_token_here");
  process.exit(1);
}

// Initialize Telegram Bot
const bot = new Bot(BOT_TOKEN);

// ==========================================
// 1. COMMAND HANDLERS
// ==========================================

// Command: /start
bot.command("start", async (ctx) => {
  const userName = ctx.from?.first_name || "Kaibigan";
  
  // Inline Keyboard (Clickable buttons inside message)
  const inlineMenu = new InlineKeyboard()
    .text("🛍️ Products", "use_bot")
    .text("ℹ️ About", "about_bot")
    .row()
    .url("🌐 Official Store", "https://t.me/telegram");

  // Custom Reply Keyboard (Chat menu buttons)
  const replyMenu = new Keyboard()
    .text("🛍️ Products")
    .text("📦 My Orders")
    .row()
    .text("🎧 Support")
    .text("ℹ️ About")
    .row()
    .text(" Quick Help")
    .text(" Roll Dice")
    .resized();

  await ctx.reply(
    `👋 Magandang araw, **${userName}**!\n\nMaligayang pagdating sa aming Telegram Store Bot. Ako ay nakahandang tumulong sa iyo.\n\nPumili ng option sa ibaba o mag-type ng /help para sa mga utos.`,
    {
      parse_mode: "Markdown",
      reply_markup: inlineMenu,
    }
  );

  // Send reply keyboard as well
  await ctx.reply("Pumili sa menu sa ibaba:", {
    reply_markup: replyMenu,
  });
});

// Command: /help
bot.command("help", async (ctx) => {
  const helpText = `
📋 **Listahan ng mga Utos (Commands):**

🔹 /start - Simulan ang bot at buksan ang menu.
🔹 /products - Tingnan ang listahan ng mga produkto.
🔹 /myorders - Subaybayan ang iyong mga order.
🔹 /support - Makipag-ugnayan sa customer support.
🔹 /about - Alamin ang impormasyon tungkol sa amin.
🔹 /info - Tingnan ang iyong Telegram user details.
🔹 /echo <text> - Ulitin ang iyong isinulat na mensahe.
🔹 /ping - Subukan ang koneksyon at latency ng bot.

🌟 **Mga katangian:**
• Interactive Catalog & Menu
• Real-time Order Tracking
• 24/7 Customer Support Desk
• Server Health Check
`;
  await ctx.reply(helpText, { parse_mode: "Markdown" });
});

// Helper Functions for New Commands
async function sendProducts(ctx) {
  const text = `🛍️ **Listahan ng mga Produkto (Products Catalog):**\n\n1. 🎬 **Netflix Premium** - ₱149 / month\n   • 4K Ultra HD + HDR\n   • 1 Screen Shared / Solo Profile\n   • Downloadable & Full Warranty\n\n2. 🤖 **Gemini 18M** - ₱299 / month\n   • 18M Token Context Window Access\n   • Advanced AI Reasoning & Coding Assistant\n   • 24/7 API & Web Access\n\n💡 *Pumili ng produkto sa ibaba para sa detalye o pagbili:*`;
  
  const keyboard = new InlineKeyboard()
    .text("🎬 Netflix Premium", "prod_netflix")
    .row()
    .text("🤖 Gemini 18M", "prod_gemini");

  await ctx.reply(text, { parse_mode: "Markdown", reply_markup: keyboard });
}

async function sendMyOrders(ctx) {
  const text = `📦 **Aking mga Order (My Orders):**\n\n🆔 **Order #ORD-10928**\n• **Item:** Netflix Premium (1 Month)\n• **Status:** ✅ **Active / Delivered**\n• **Total:** ₱149.00\n• **Expiry:** Sep 12, 2026\n\n🆔 **Order #ORD-08721**\n• **Item:** Gemini 18M Access (1 Month)\n• **Status:** ✅ **Active**\n• **Total:** ₱299.00\n\n💡 *Para sa mga katanungan sa iyong order, gamitin ang /support command.*`;
  await ctx.reply(text, { parse_mode: "Markdown" });
}

async function sendSupport(ctx) {
  const text = `🎧 **Customer Support & Help Desk:**\n\nMay kailangan ka bang tulong? Handa kaming tumulong sa iyo!\n\n📧 **Email:** support@example.com\n📞 **Hotline:** (02) 8123-4567 / +63 917 123 4567\n⏰ **Operating Hours:** Lunes - Biyernes (8:00 AM - 6:00 PM)\n\n💬 **Live Chat Support:** @SupportAdmin`;
  await ctx.reply(text, { parse_mode: "Markdown" });
}

async function sendAbout(ctx) {
  const text = `ℹ️ **Tungkol sa Aming Shop (About Us):**\n\n🏪 **E-Commerce Telegram Bot Store**\nKami ay nagbibigay ng pinakamabilis at pinaka-maaasahang online shopping experience sa Telegram!\n\n✨ **Bakit kami ang piliin?**\n• 💯 Genuine & Original Accounts\n• 🚀 Instant Delivery via Telegram\n• 💳 Flexible Payment Options (GCash, PayMaya, Maya)\n• 🛡️ Full Warranty sa buong Subscription\n\n🌐 **Website:** https://example.com`;
  await ctx.reply(text, { parse_mode: "Markdown" });
}

// Commands: /products, /myorders, /support, /about
bot.command("products", sendProducts);
bot.command("myorders", sendMyOrders);
bot.command("orders", sendMyOrders);
bot.command("support", sendSupport);
bot.command("about", sendAbout);

// Command: /info
bot.command("info", async (ctx) => {
  const user = ctx.from;
  const infoText = `
👤 **Impormasyon ng User:**
• **First Name:** ${user?.first_name || "N/A"}
• **Last Name:** ${user?.last_name || "N/A"}
• **Username:** ${user?.username ? `@${user.username}` : "Walang username"}
• **User ID:** \`${user?.id}\`
• **Language:** ${user?.language_code || "N/A"}
`;
  await ctx.reply(infoText, { parse_mode: "Markdown" });
});

// Command: /echo
bot.command("echo", async (ctx) => {
  const text = ctx.match;
  if (!text) {
    return ctx.reply("⚠️ Pakilagyan ng text matapos ang /echo command.\nHalimbawa: `/echo Magandang Araw`", { parse_mode: "Markdown" });
  }
  await ctx.reply(`📢 **Echo:** ${text}`, { parse_mode: "Markdown" });
});

// Command: /ping
bot.command("ping", async (ctx) => {
  const start = Date.now();
  const sentMsg = await ctx.reply("🏓 Ping...");
  const latency = Date.now() - start;
  await ctx.api.editMessageText(
    sentMsg.chat.id,
    sentMsg.message_id,
    `🏓 **Pong!**\n⚡ Latency: \`${latency}ms\`\n🟢 Bot Status: **Online**`,
    { parse_mode: "Markdown" }
  );
});

// ==========================================
// 2. INLINE BUTTON CALLBACK HANDLERS
// ==========================================

bot.callbackQuery("use_bot", async (ctx) => {
  await ctx.answerCallbackQuery();
  await sendProducts(ctx);
});

bot.callbackQuery("about_bot", async (ctx) => {
  await ctx.answerCallbackQuery();
  await sendAbout(ctx);
});

bot.callbackQuery("prod_netflix", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    "🎬 **Netflix Premium Account**\n\n💰 **Presyo:** ₱149 / buwan\n\n✨ **Features:**\n• 4K Ultra HD Streaming\n• Solo Profile na may sariling PIN\n• Pwede sa TV, Phone, Laptop, & Tablet\n• Full Warranty sa buong subscription period\n\n💬 Mag-reply o i-chat si @SupportAdmin para bumili!",
    { parse_mode: "Markdown" }
  );
});

bot.callbackQuery("prod_gemini", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    "🤖 **Gemini 18M (AI Access)**\n\n💰 **Presyo:** ₱299 / buwan\n\n✨ **Features:**\n• Massive 18M Token Context Window\n• Advanced Code Generation & AI Reasoning\n• High-speed response rate\n• Full 24/7 Access & Support\n\n💬 Mag-reply o i-chat si @SupportAdmin para bumili!",
    { parse_mode: "Markdown" }
  );
});

// ==========================================
// 3. CHAT TEXT & MEDIA HANDLERS
// ==========================================

// Handle Reply Keyboard buttons
bot.hears("🛍️ Products", sendProducts);
bot.hears("Products", sendProducts);
bot.hears("📦 My Orders", sendMyOrders);
bot.hears("My Orders", sendMyOrders);
bot.hears("🎧 Support", sendSupport);
bot.hears("Support", sendSupport);
bot.hears("ℹ️ About", sendAbout);
bot.hears("About", sendAbout);

// Handle Reply Keyboard buttons
bot.hears(" Quick Help", async (ctx) => {
  await ctx.reply(" I-type lang ang anumang command tulad ng /help, /info, o /echo para magamit ang bot.");
});

bot.hears(" Bot Info", async (ctx) => {
  await ctx.reply(" Bot Status: **Online & Active** \nEngine: **Node.js (Grammy)**", { parse_mode: "Markdown" });
});

bot.hears(" Roll Dice", async (ctx) => {
  await ctx.replyWithDice();
});

// Handle Stickers
bot.on("message:sticker", async (ctx) => {
  await ctx.reply(" Ang ganda ng sticker mo! ");
});

// Handle Photos
bot.on("message:photo", async (ctx) => {
  await ctx.reply(" Natanggap ko ang iyong larawan! ");
});

// Catch all other text messages
bot.on("message:text", async (ctx) => {
  await ctx.reply(` Natanggap ko ang iyong mensahe: "${ctx.message.text}"\nI-type ang /help para sa listahan ng mga utos.`);
});

// ==========================================
// 4. ERROR HANDLING
// ==========================================

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(` Errorhabang pinapagana ang update ${ctx.update.update_id}:`);
  const e = err.error;
  console.error("Error details:", e);
});

// ==========================================
// 5. EXPRESS WEB SERVER (Health Check for Deployment)
// ==========================================

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send({
    status: "ok",
    message: "Telegram Bot is running smoothly!",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(` Web server health check listening on port ${PORT}`);
});

// ==========================================
// 6. START BOT
// ==========================================

bot.start({
  onStart: (botInfo) => {
    console.log(` Bot @${botInfo.username} is running and ready!`);
  },
});

// Graceful Shutdown
process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());
