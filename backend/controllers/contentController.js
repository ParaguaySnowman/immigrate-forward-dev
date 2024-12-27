//controllers/contentController.js
//(immigrate-forward-dev)

const axios = require('axios');

async function fetchAndRenderContentByCategory(req, res, next, category) {
    try {
        // Construct the API URL dynamically with the category parameter
        const apiUrl = `http://localhost:1337/api/cards?populate[thumbnail][populate]=*&populate[document][populate]=*&filters[category][$eq]=${category}`;
        
        // Make the API call with the dynamically generated URL
        const response = await axios.get(apiUrl);
        const contentData = response.data;

        // Render the view with the fetched content
        res.render('tutorials', { content: contentData });

    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).send('Error fetching content');
    }
}

module.exports = {
    fetchAndRenderContentByCategory,
};