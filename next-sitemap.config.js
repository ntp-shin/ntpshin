const { CONFIG } = require("./site.config")

module.exports = {
  siteUrl: CONFIG.link,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  generateIndexSitemap: true,
}

// module.exports = {
//   siteUrl: CONFIG.link || "https://ntpshin.vercel.app",  // Đảm bảo siteUrl đúng
//   generateRobotsTxt: true,  // Tạo file robots.txt tự động
//   sitemapSize: 7000,  // Kích thước sitemap
//   generateIndexSitemap: false,  // Không tạo index sitemap
//   robotsTxtOptions: {
//     policies: [
//       {
//         userAgent: "*",
//         allow: "/",
//       },
//     ],
//     additionalSitemaps: [
//       `${CONFIG.link || "https://ntpshin.vercel.app"}/sitemap.xml`,
//     ],
//   },
// }