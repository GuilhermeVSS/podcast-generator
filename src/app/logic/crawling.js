const puppeteer = require('puppeteer');
const textHelper = require('../../helper/text-helper');

module.exports = async ({url}) =>{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const pageContent = await page.evaluate(() => {
        const elements = document.querySelectorAll('.pw-post-title, .pw-subtitle-paragraph, .oi, .pw-post-body-paragraph, .mj')
        const elementsArray = Array.from(elements); 
        const result = [];

        let currentSection = {
            title: '',
            subtitle: '',
            subtopic: '',
            paragraph: []
        };
        elementsArray.forEach(element => {
            if (element.classList.contains('pw-post-title')) {
                result.push(currentSection);
                currentSection = {
                    title: '',
                    subtitle: '',
                    subtopic: '',
                    paragraph: []
                }
                currentSection.title = element.innerHTML;
            } else if (element.classList.contains('pw-subtitle-paragraph')) {
                currentSection.subtitle = element.innerHTML;
            } else if (element.classList.contains('pw-post-body-paragraph')) {
                currentSection.paragraph.push(element.innerHTML);
            } else if (element.classList.contains('mj')) {
                currentSection.paragraph.push(element.innerHTML);
            } else if (element.classList.contains('oi')) {
                result.push(currentSection);
                currentSection = {
                    title: '',
                    subtitle: '',
                    subtopic: '',
                    paragraph: []
                }
                currentSection.subtopic = element.innerHTML;
            }
            result.push(currentSection);
        });

        return result
    })

    await browser.close();
    const sectionArray = textHelper.stringifyText(pageContent).filter(data=>data.paragraph.length);
    const {title} = sectionArray[0];
    const finalText = textHelper.unifyText(sectionArray);
    return {title: title.replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/gi, '').toLowerCase().split(' ').join('-'), text:finalText};
}

