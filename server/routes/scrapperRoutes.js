'use strict';
module.exports = app => {
  const scraperController = require('../controller/scrapperController');

  /**
   * Scraper Routes - Item Collection
   */
  app.route('/scrape').post(scraperController.first_scrape);
};
