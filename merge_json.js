const fs = require('fs');
const path = require('path');

function robustExtract(filename) {
    const fullPath = path.join(__dirname, filename);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // { "id": ... } 형태를 찾기 위한 정규식
    const regex = /\{[\s\S]*?\}/g;
    const matches = content.match(regex);
    
    if (!matches) return [];

    const results = [];
    for (const match of matches) {
        try {
            // 표준 파싱 시도
            let clean = match.trim().replace(/,\s*\}/, '}');
            results.push(JSON.parse(clean));
        } catch (e) {
            // 실패 시 정규식 기반 수동 추출
            try {
                const getVal = (key) => {
                    const r = new RegExp(`"${key}"\\s*:\\s*"([^"]*)"`);
                    const m = match.match(r);
                    return m ? m[1] : '';
                };
                const obj = {
                    id: getVal('id'),
                    word: getVal('word'),
                    meaning: getVal('meaning'),
                    example: getVal('example'),
                    blank_answer: getVal('blank_answer'),
                    source: getVal('source'),
                    difficulty: getVal('difficulty') || 'Medium'
                };
                if (obj.word && obj.meaning) results.push(obj);
            } catch (e2) {}
        }
    }
    return results;
}

try {
    console.log('Starting Robust Data Recovery...');
    const toeicData = robustExtract('toeic.json');
    const businessData = robustExtract('business.json');

    const result = {
        toeic_course: toeicData,
        business_course: businessData
    };

    fs.writeFileSync(
        path.join(__dirname, 'src/data/words.json'),
        JSON.stringify(result, null, 2),
        'utf8'
    );

    console.log(`Success! Updated Database:`);
    console.log(`- TOEIC Master: ${toeicData.length} words`);
    console.log(`- Business English: ${businessData.length} words`);
} catch (err) {
    console.error('Final Critical Error:', err.message);
}
