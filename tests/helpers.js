const WHATSAPP = "https://wa.me/85263302851?text=Hello%20Bernard%2C%20I%27d%20like%20to%20ask%20about%20lessons.";
const isPhone = (page) => page.viewportSize().width < 768;
const noSidewaysScroll = (page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
module.exports = { WHATSAPP, isPhone, noSidewaysScroll };
