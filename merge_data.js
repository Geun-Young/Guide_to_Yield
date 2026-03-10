const fs = require('fs');
const path = require('path');

function finalExtract(filename) {
    const fullPath = path.join(__dirname, filename);
    let content = fs.readFileSync(fullPath, 'utf8');

    // UTF-8 BOM (EF BB BF) 제거
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }

    console.log(`Processing ${filename}...`);

    // 모든 { ... } 객체를 찾음
    const regex = /\{[\s\S]*?\}/g;
    const matches = content.match(regex);
    
    if (!matches) return [];

    const results = [];
    for (const match of matches) {
        try {
            // 미세한 쉼표나 줄바꿈 청소 후 파싱
            let clean = match.trim().replace(/,\s*\}/, '}');
            const obj = JSON.parse(clean);
            if (obj.word && obj.meaning) {
                results.push(obj);
            }
        } catch (e) {
            // 파싱 실패 시 정규식으로 강제 추출
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
        }
    }
    return results;
}

try {
    const toeicData = finalExtract('toeic.txt');
    const businessData = finalExtract('business.txt');

    console.log(`FINAL RESULTS: TOEIC(${toeicData.length}), Business(${businessData.length})`);

    const result = {
        toeic_course: toeicData,
        business_course: businessData
    };

    fs.writeFileSync(
        path.join(__dirname, 'src/data/words.json'), 
        JSON.stringify(result, null, 2), 
        'utf8'
    );

    console.log('SUCCESS! Everything is now in clean UTF-8. No broken Korean!');
} catch (err) {
    console.error('ERROR:', err.message);
}
