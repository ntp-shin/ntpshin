const { CONFIG } = require("./site.config")

module.exports = {
  siteUrl: CONFIG.link,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  generateIndexSitemap: false,
}

// module.exports = {
//   siteUrl: CONFIG.link,
//   generateRobotsTxt: true, // Tiếp tục tạo robots.txt
//   sitemapSize: 7000,
//   generateIndexSitemap: false,
//   robotsTxtOptions: {
//     additionalSitemaps: [], // Xóa các dòng Host liên quan
//     policies: [
//       {
//         userAgent: "*",
//         allow: "/",  // Cho phép toàn bộ trang web được crawl
//       },
//     ],
//   },
// }
