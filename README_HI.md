# Prompt Photo Studio Pro AI

## यह क्या करता है?
- फोटो अपलोड + प्रीव्यू
- Prompt-based image editing using OpenAI Images API
- Result preview + download
- API key केवल server environment में रहती है

## Render पर प्रकाशित करने के लिए
1. इस फोल्डर की सभी फाइलें GitHub repository में अपलोड करें।
2. Render → New + → Web Service → अपनी repository चुनें।
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Render → Environment में `OPENAI_API_KEY` नाम का variable बनाएं और अपनी OpenAI API key value डालें। Key को HTML या GitHub में न डालें।
6. Deploy करें। Render URL खोलें।

## PC पर स्थानीय टेस्ट
1. Node.js LTS इंस्टॉल करें।
2. इस फोल्डर में terminal खोलें।
3. `npm install`
4. `.env.example` की कॉपी बनाकर उसका नाम `.env` रखें।
5. `.env` में अपनी API key डालें।
6. `npm start`
7. `http://localhost:3000` खोलें।

## सुरक्षा और खर्च
- ChatGPT subscription और API billing अलग हैं। API usage पर शुल्क लग सकता है।
- Public launch से पहले authentication, rate limiting, usage limits, HTTPS, privacy policy और generated image retention/deletion rules जोड़ें।
- यह AI edit starter है; इसमें पासपोर्ट/प्रिंट लेआउट और cloud account storage नहीं जोड़े गए।
- Image generation का समय बदल सकता है।
