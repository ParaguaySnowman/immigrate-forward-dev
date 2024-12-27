const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

function renderWithLayout(res, viewPath, title, additionalData = {}) {
    const viewContent = ejs.render(fs.readFileSync(viewPath, 'utf8'), additionalData);
    res.render('layout', { title, body: viewContent });
}

module.exports = renderWithLayout;
