const puppeteer = require('puppeteer');
const textHelper = require('../../helper/text-helper');


async function medium({url}){
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
            }
            if (element.classList.contains('pw-subtitle-paragraph')) {
                currentSection.subtitle = element.innerHTML;
            }
            if (element.classList.contains('pw-post-body-paragraph')) {
                currentSection.paragraph.push(element.innerHTML);
            }
            if (element.classList.contains('mj')) {
                currentSection.paragraph.push(element.innerHTML);
            }
            if (element.classList.contains('oi')) {
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
    const sectionArray = textHelper.stringifyText(pageContent).filter(data => data.paragraph.length);
    const { title } = sectionArray[0];
    const finalText = textHelper.unifyText(sectionArray);
    return { title: textHelper.titleNormalize(title), text: finalText };
}

const strategyMap = {
    'medium': medium,

}

module.exports = {
    strategy: null,
    setStrategy: function(source){
        this.strategy = strategyMap[source];
        const ans = {};
        if(!this.strategy){
           return {
            error: true,
            message: 'Strategy not found'
           }
        }
        return {error: false,
            message: 'Strategy was set successfully'
        }

    },
    executeStrategy: async function({url}){
        if(this.strategy === null){
            throw new Error('The strategy was not defined')
        }
        return await this.strategy({url});
    }
}

